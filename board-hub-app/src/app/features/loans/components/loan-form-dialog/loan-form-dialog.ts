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
import { CreateLoanInput } from '../../models/loan.model';

export interface LoanFormDialogData {
  // Empty for create, future use for edit
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.form = this.fb.group({
      gameId: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      startDate: [this.today, [Validators.required]],
      endDate: [tomorrow, [Validators.required]],
      notes: [''],
    });
  }

  private loadGames(): void {
    this.loadingGames.set(true);
    this.gameService.getAll().subscribe({
      next: (games) => {
        this.games.set(games.filter((g) => !g.isDeleted && g.stockAvailable > 0));
        this.loadingGames.set(false);
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

    if (game) {
      const quantityControl = this.form.get('quantity');
      quantityControl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(game.stockAvailable),
      ]);
      quantityControl?.updateValueAndValidity();
    }
  }

  getMaxQuantity(): number {
    return this.selectedGame()?.stockAvailable ?? 1;
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

    const result: CreateLoanInput = {
      gameId: raw.gameId,
      clientId: raw.clientId,
      quantity: raw.quantity,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...(raw.notes?.trim() ? { notes: raw.notes.trim() } : {}),
    };

    this.dialogRef.close(result);
  }
}
