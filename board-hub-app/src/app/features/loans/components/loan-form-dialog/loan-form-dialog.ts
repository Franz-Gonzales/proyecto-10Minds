import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NotificationService } from '../../../../core/services/notification.service';
import { GameService } from '../../../games/services/game.service';
import { ClientService } from '../../../clients/services/client.service';
import { Game } from '../../../games/models/game.model';
import { Client } from '../../../clients/models/client.model';
import { CreateLoanInput, Loan, UpdateLoanInput } from '../../models/loan.model';

export interface LoanFormDialogData {
  loan?: Loan;
}

@Component({
  selector: 'app-loan-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  styles: [`
    .section-title {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #3b82f6;
    }
  `],
  templateUrl: './loan-form-dialog.html',
})
export class LoanFormDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);
  private readonly gameService = inject(GameService);
  private readonly clientService = inject(ClientService);
  readonly dialogRef = inject(MatDialogRef<LoanFormDialog>);
  readonly data: LoanFormDialogData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;
  readonly isEdit: boolean = !!this.data?.loan;

  readonly games = signal<Game[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly selectedGame = signal<Game | null>(null);
  readonly loadingGames = signal(false);
  readonly loadingClients = signal(false);

  readonly today = new Date();

  ngOnInit(): void {
    this.buildForm();
    this.loadGames();
    this.loadClients();
  }

  private buildForm(): void {
    const loan = this.data?.loan;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.form = this.fb.group({
      gameId: [loan?.gameId ?? '', [Validators.required]],
      clientId: [loan?.clientId ?? '', [Validators.required]],
      quantity: [loan?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      startDate: [loan ? new Date(loan.startDate) : this.today, [Validators.required]],
      endDate: [loan ? new Date(loan.endDate) : tomorrow, [Validators.required]],
      notes: [loan?.notes ?? ''],
    });
  }

  private loadGames(): void {
    this.loadingGames.set(true);
    this.gameService.getAll().subscribe({
      next: (games) => {
        if (this.isEdit) {
          // In edit mode, show all non-deleted games (current game might have 0 stock)
          this.games.set(games.filter((g) => !g.isDeleted));
        } else {
          this.games.set(games.filter((g) => !g.isDeleted && g.stockAvailable > 0));
        }
        this.loadingGames.set(false);

        // Pre-select game in edit mode
        if (this.data?.loan?.gameId) {
          const game = games.find((g) => g.id === this.data.loan!.gameId) ?? null;
          this.selectedGame.set(game);
          this.updateQuantityValidators(game);
        }
      },
      error: () => {
        this.notification.error('Error al cargar juegos');
        this.loadingGames.set(false);
      },
    });
  }

  private loadClients(): void {
    this.loadingClients.set(true);
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients.set(clients.filter((c) => c.isActive));
        this.loadingClients.set(false);
      },
      error: () => {
        this.notification.error('Error al cargar clientes');
        this.loadingClients.set(false);
      },
    });
  }

  onGameChange(gameId: string): void {
    const game = this.games().find((g) => g.id === gameId) ?? null;
    this.selectedGame.set(game);
    this.updateQuantityValidators(game);
  }

  private updateQuantityValidators(game: Game | null): void {
    if (!game) return;

    const quantityControl = this.form.get('quantity');
    // In edit mode, available stock = current stock + loan's current quantity
    let maxQuantity = game.stockAvailable;
    if (this.isEdit && this.data.loan && game.id === this.data.loan.gameId) {
      maxQuantity += this.data.loan.quantity;
    }

    quantityControl?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(maxQuantity),
    ]);
    quantityControl?.updateValueAndValidity();
  }

  getMaxQuantity(): number {
    const game = this.selectedGame();
    if (!game) return 1;

    let max = game.stockAvailable;
    if (this.isEdit && this.data.loan && game.id === this.data.loan.gameId) {
      max += this.data.loan.quantity;
    }
    return max;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.error('Por favor completa todos los campos requeridos');
      return;
    }

    const raw = this.form.getRawValue();

    const startDate = new Date(raw.startDate);
    const endDate = new Date(raw.endDate);

    if (endDate <= startDate) {
      this.notification.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    if (this.isEdit) {
      const result: UpdateLoanInput = {
        id: this.data.loan!.id,
        gameId: raw.gameId,
        clientId: raw.clientId,
        quantity: Number(raw.quantity),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...(raw.notes?.trim() ? { notes: raw.notes.trim() } : { notes: null }),
      };
      this.dialogRef.close(result);
    } else {
      const result: CreateLoanInput = {
        gameId: raw.gameId,
        clientId: raw.clientId,
        quantity: Number(raw.quantity),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...(raw.notes?.trim() ? { notes: raw.notes.trim() } : {}),
      };
      this.dialogRef.close(result);
    }
  }
}
