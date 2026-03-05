import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Category } from '../../models/category.model';

export interface CategoryFormDialogData {
  category?: Category;
}

@Component({
  selector: 'app-gategory-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './gategory-form-dialog.html',
  styles: [`
    :host { display: block; }

    .section-title {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #3b82f6;
    }
  `],
})
export class GategoryFormDialog {

  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<GategoryFormDialog>);
  readonly data: CategoryFormDialogData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;
  readonly isEdit: boolean = !!this.data?.category;

  ngOnInit(): void {
    const c = this.data?.category;

    this.form = this.fb.group({
      name: [c?.name ?? '', [Validators.required, Validators.maxLength(255)]],
      icon: [c?.icon ?? '', [Validators.required, Validators.maxLength(50)]],
      description: [c?.description ?? ''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = { ...this.form.getRawValue() };

    if (this.isEdit) {
      this.dialogRef.close({ id: this.data.category!.id, ...formValue });
    } else {
      this.dialogRef.close(formValue);
    }
  }
}
