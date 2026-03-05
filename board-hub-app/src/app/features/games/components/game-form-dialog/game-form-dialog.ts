import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { NotificationService } from '../../../../core/services/notification.service';
import { CategoryService } from '../../../categories/services/category.service';
import { Category } from '../../../categories/models/category.model';
import { Game } from '../../models/game.model';

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
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './game-form-dialog.html',
  styles: [`
    :host {
      display: block;
    }

    .image-upload-area {
      border: 2px dashed rgba(59, 130, 246, 0.4);
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .image-upload-area:hover {
      border-color: rgba(59, 130, 246, 0.8);
      background-color: rgba(59, 130, 246, 0.05);
    }

    .image-upload-area.has-image {
      border-style: solid;
      border-color: rgba(59, 130, 246, 0.6);
    }

    .image-preview {
      max-height: 180px;
      object-fit: contain;
      border-radius: 0.5rem;
    }

    .section-title {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #3b82f6;
    }
  `],
})
export class GameFormDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);
  private readonly categoryService = inject(CategoryService);
  readonly dialogRef = inject(MatDialogRef<GameFormDialog>);
  readonly data: GameFormDialogData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;
  readonly isEdit: boolean = !!this.data?.game;

  readonly imagePreview = signal<string | null>(null);
  readonly imageFileName = signal<string | null>(null);
  readonly categories = signal<Category[]>([]);
  readonly loadingCategories = signal(false);

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();
  }

  private buildForm(): void {
    const game = this.data?.game;

    this.form = this.fb.group({
      title: [game?.title ?? '', [Validators.required, Validators.maxLength(255)]],
      categoryId: [game?.categoryId ?? '', [Validators.required]],
      description: [game?.description ?? ''],
      pricePerDay: [game?.pricePerDay ?? 10, [Validators.required, Validators.min(0.01)]],
      minPlayers: [game?.minPlayers ?? 2, [Validators.required, Validators.min(1)]],
      maxPlayers: [game?.maxPlayers ?? 4, [Validators.required, Validators.min(1)]],
      durationMinutes: [game?.durationMinutes ?? 30, [Validators.required, Validators.min(1)]],
      stockTotal: [game?.stockTotal ?? 1, [Validators.required, Validators.min(1)]],
      imageUrl: [game?.imageUrl ?? ''],
    });

    if (game?.imageUrl) {
      this.imagePreview.set(game.imageUrl);
      this.imageFileName.set('Imagen actual');
    }
  }

  private loadCategories(): void {
    this.loadingCategories.set(true);
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories.filter((c) => c.isActive));
        this.loadingCategories.set(false);
      },
      error: () => {
        this.notification.error('Error al cargar categorías');
        this.loadingCategories.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.notification.warning('Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF.');
      return;
    }

    const maxSizeBytes = 4 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.notification.warning('La imagen excede el límite de 4 MB.');
      return;
    }

    this.imageFileName.set(file.name);

    const reader = new FileReader();
    reader.onerror = () => {
      this.notification.warning('Error al leer el archivo. Inténtalo de nuevo.');
      input.value = '';
    };
    reader.onload = () => {
      const base64 = reader.result as string;
      this.imagePreview.set(base64);
      this.form.patchValue({ imageUrl: base64 });
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.imageFileName.set(null);
    this.form.patchValue({ imageUrl: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = { ...this.form.getRawValue() };

    formValue.pricePerDay = Number(formValue.pricePerDay);
    formValue.minPlayers = Number(formValue.minPlayers);
    formValue.maxPlayers = Number(formValue.maxPlayers);
    formValue.durationMinutes = Number(formValue.durationMinutes);
    formValue.stockTotal = Number(formValue.stockTotal);

    if (!formValue.description?.trim()) formValue.description = null;
    if (!formValue.imageUrl?.trim()) formValue.imageUrl = null;

    if (this.isEdit) {
      this.dialogRef.close({ id: this.data.game!.id, ...formValue });
    } else {
      this.dialogRef.close(formValue);
    }
  }
}
