import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Game, GameCategory, CATEGORY_LABELS } from '../../models/game.model';

export interface GameFormDialogData {
  game?: Game;
}

@Component({
  selector: 'app-game-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './game-form-dialog.html',
})
export class GameFormDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<GameFormDialog>);
  readonly data: GameFormDialogData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;
  readonly isEdit: boolean = !!this.data?.game;

  readonly categories = Object.values(GameCategory).map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  }));

  ngOnInit(): void {
    const game = this.data?.game;

    this.form = this.fb.group({
      title: [game?.title ?? '', [Validators.required, Validators.maxLength(255)]],
      category: [game?.category ?? GameCategory.ESTRATEGIA, [Validators.required]],
      description: [game?.description ?? ''],
      pricePerDay: [game?.pricePerDay ?? 0, [Validators.required, Validators.min(0.01)]],
      minPlayers: [game?.minPlayers ?? 1, [Validators.required, Validators.min(1)]],
      maxPlayers: [game?.maxPlayers ?? 1, [Validators.required, Validators.min(1)]],
      durationMinutes: [game?.durationMinutes ?? 30, [Validators.required, Validators.min(1)]],
      stockTotal: [game?.stockTotal ?? 1, [Validators.required, Validators.min(1)]],
      imageUrl: [game?.imageUrl ?? ''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    // Clean empty strings to null
    if (!formValue.description?.trim()) formValue.description = null;
    if (!formValue.imageUrl?.trim()) formValue.imageUrl = null;

    if (this.isEdit) {
      this.dialogRef.close({ id: this.data.game!.id, ...formValue });
    } else {
      this.dialogRef.close(formValue);
    }
  }
}