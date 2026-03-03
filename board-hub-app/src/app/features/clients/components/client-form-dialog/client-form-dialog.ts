import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Client } from '../../models/client.model';

export interface ClientFormDialogData {
  client?: Client;
}

@Component({
  selector: 'app-client-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './client-form-dialog.html',
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
export class ClientFormDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ClientFormDialog>);
  readonly data: ClientFormDialogData = inject(MAT_DIALOG_DATA);

  form!: FormGroup;
  readonly isEdit: boolean = !!this.data?.client;

  ngOnInit(): void {
    const c = this.data?.client;

    this.form = this.fb.group({
      name: [c?.name ?? '', [Validators.required, Validators.maxLength(255)]],
      lastName: [c?.lastName ?? '', [Validators.required, Validators.maxLength(255)]],
      ci: [c?.ci ?? '', [Validators.required, Validators.maxLength(20)]],
      phoneNumber: [c?.phoneNumber ?? '', [Validators.required, Validators.maxLength(20)]],
      email: [c?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(255)]],
      direction: [c?.direction ?? ''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = { ...this.form.getRawValue() };

    // Limpiar dirección vacía a null
    if (!formValue.direction?.trim()) {
      formValue.direction = null;
    }

    if (this.isEdit) {
      this.dialogRef.close({ id: this.data.client!.id, ...formValue });
    } else {
      this.dialogRef.close(formValue);
    }
  }
}