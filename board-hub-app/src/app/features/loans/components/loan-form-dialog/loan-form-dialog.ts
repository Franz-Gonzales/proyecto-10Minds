import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

import { NotificationService } from '../../../../core/services/notification.service';
import { GameService } from '../../../games/services/game.service';
import { ClientService } from '../../../clients/services/client.service';
import { Game } from '../../../games/models/game.model';
import { Client } from '../../../clients/models/client.model';
import {
  CreateBulkLoansInput,
  Loan,
  UpdateLoanInput,
} from '../../models/loan.model';


/** A game selected for the bulk loan with its quantity */
export interface SelectedGameItem {
  game: Game;
  quantity: number;
}

export interface LoanFormDialogData {
  loan?: Loan;
}

/** The dialog returns either a bulk create input or an update input */
export type LoanFormDialogResult = CreateBulkLoansInput | UpdateLoanInput;

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
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
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

  /** Main form: shared fields (client, dates, notes) */
  form!: FormGroup;

  /** Mini-form for adding games in create mode */
  gamePickerForm!: FormGroup;

  readonly isEdit: boolean = !!this.data?.loan;

  readonly games = signal<Game[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly loadingGames = signal(false);
  readonly loadingClients = signal(false);

  /** Selected games list for bulk create */
  readonly selectedGames = signal<SelectedGameItem[]>([]);

  /** Currently picked game in the game picker (for showing stock info) */
  readonly pickerSelectedGame = signal<Game | null>(null);

  /** For edit mode only */
  readonly selectedGame = signal<Game | null>(null);

  readonly today = new Date();

  /** Available games = all games minus already selected ones */
  readonly availableGames = computed(() => {
    const selected = new Set(this.selectedGames().map(sg => sg.game.id));
    return this.games().filter(g => !selected.has(g.id));
  });

  /** Grand total price of all selected games (create mode) */
  readonly grandTotal = computed(() =>
    this.selectedGames().reduce((sum, sg) => sum + sg.quantity * sg.game.pricePerDay, 0)
  );

  ngOnInit(): void {
    this.buildForm();
    this.loadGames();
    this.loadClients();
  }

  private buildForm(): void {
    const loan = this.data?.loan;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isEdit) {
      // Edit mode: single game form (same as before)
      this.form = this.fb.group({
        gameId: [loan!.gameId, [Validators.required]],
        clientId: [loan!.clientId, [Validators.required]],
        quantity: [loan!.quantity, [Validators.required, Validators.min(1)]],
        dateRange: this.fb.group({
          start: [new Date(loan!.startDate), [Validators.required]],
          end: [new Date(loan!.endDate), [Validators.required]],
        }),
        notes: [loan!.notes ?? ''],
      });
    } else {
      // Create mode: shared fields only
      this.form = this.fb.group({
        clientId: ['', [Validators.required]],
        dateRange: this.fb.group({
          start: [this.today, [Validators.required]],
          end: [tomorrow, [Validators.required]],
        }),
        notes: [''],
      });

      // Game picker mini-form
      this.gamePickerForm = this.fb.group({
        gameId: ['', [Validators.required]],
        quantity: [1, [Validators.required, Validators.min(1)]],
      });
    }
  }

  get dateRangeGroup(): FormGroup {
    return this.form.get('dateRange') as FormGroup;
  }

  private loadGames(): void {
    this.loadingGames.set(true);
    this.gameService.getAll().subscribe({
      next: (games) => {
        if (this.isEdit) {
          this.games.set(games.filter(g => !g.isDeleted));
        } else {
          this.games.set(games.filter(g => !g.isDeleted && g.stockAvailable > 0));
        }
        this.loadingGames.set(false);

        if (this.isEdit && this.data.loan?.gameId) {
          const game = games.find(g => g.id === this.data.loan!.gameId) ?? null;
          this.selectedGame.set(game);
          this.updateEditQuantityValidators(game);
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
        this.clients.set(clients.filter(c => c.isActive));
        this.loadingClients.set(false);
      },
      error: () => {
        this.notification.error('Error al cargar clientes');
        this.loadingClients.set(false);
      },
    });
  }

  // ─── Edit mode: game change ───
  onGameChange(gameId: string): void {
    const game = this.games().find(g => g.id === gameId) ?? null;
    this.selectedGame.set(game);
    this.updateEditQuantityValidators(game);
  }

  private updateEditQuantityValidators(game: Game | null): void {
    if (!game) return;
    const quantityControl = this.form.get('quantity');
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

  // ─── Create mode: game picker ───
  onPickerGameChange(gameId: string): void {
    const game = this.games().find(g => g.id === gameId) ?? null;
    this.pickerSelectedGame.set(game);

    if (game) {
      const qtyCtrl = this.gamePickerForm.get('quantity');
      qtyCtrl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(game.stockAvailable),
      ]);
      qtyCtrl?.setValue(1);
      qtyCtrl?.updateValueAndValidity();
    }
  }

  getPickerMaxQuantity(): number {
    return this.pickerSelectedGame()?.stockAvailable ?? 1;
  }

  addGame(): void {
    if (this.gamePickerForm.invalid) {
      this.gamePickerForm.markAllAsTouched();
      return;
    }

    const { gameId, quantity } = this.gamePickerForm.getRawValue();
    const game = this.games().find(g => g.id === gameId);
    if (!game) return;

    this.selectedGames.update(list => [...list, { game, quantity }]);

    // Reset picker
    this.gamePickerForm.reset({ gameId: '', quantity: 1 });
    this.pickerSelectedGame.set(null);
  }

  removeGame(index: number): void {
    this.selectedGames.update(list => list.filter((_, i) => i !== index));
  }

  // ─── Submit ───
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.error('Por favor completa todos los campos requeridos');
      return;
    }

    const raw = this.form.getRawValue();
    const startDate = new Date(raw.dateRange.start);
    const endDate = new Date(raw.dateRange.end);

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
      // Bulk create
      if (this.selectedGames().length === 0) {
        this.notification.error('Agrega al menos un juego al préstamo');
        return;
      }

      const result: CreateBulkLoansInput = {
        clientId: raw.clientId,
        items: this.selectedGames().map(sg => ({
          gameId: sg.game.id,
          quantity: sg.quantity,
        })),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...(raw.notes?.trim() ? { notes: raw.notes.trim() } : {}),
      };
      this.dialogRef.close(result);
    }
  }
}
