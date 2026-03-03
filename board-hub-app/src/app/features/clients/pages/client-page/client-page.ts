import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { ClientFilter } from '../../components/client-filter/client-filter';
import { ClientList } from '../../components/client-list/client-list';
import { ClientFormDialog, ClientFormDialogData } from '../../components/client-form-dialog/client-form-dialog';

import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractGraphQLError } from '../../../../core/interceptors/error.interceptor';

import { Client, CreateClientInput, UpdateClientInput } from '../../models/client.model';

@Component({
  selector: 'app-client-page',
  imports: [PageHeader, ClientFilter, ClientList, EmptyState],
  templateUrl: './client-page.html',
})
export default class ClientPage implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly clients = signal<Client[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal<string>('');

  readonly filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.clients();

    return this.clients().filter((c) => {
      const fullName = `${c.name} ${c.lastName}`.toLowerCase();
      return (
        fullName.includes(term) ||
        c.ci.toLowerCase().includes(term) ||
        c.phoneNumber.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);

    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.error(extractGraphQLError(err));
        this.loading.set(false);
      },
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ClientFormDialog, {
      width: '600px',
      maxHeight: '90vh',
      data: {} satisfies ClientFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: CreateClientInput | undefined) => {
      if (!result) return;

      this.clientService.create(result).subscribe({
        next: () => {
          this.notification.success('Cliente registrado exitosamente');
          this.loadClients();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  openEditDialog(client: Client): void {
    const dialogRef = this.dialog.open(ClientFormDialog, {
      width: '600px',
      maxHeight: '90vh',
      data: { client } satisfies ClientFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: UpdateClientInput | undefined) => {
      if (!result) return;

      this.clientService.update(result).subscribe({
        next: () => {
          this.notification.success('Cliente actualizado exitosamente');
          this.loadClients();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  confirmDelete(client: Client): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar cliente',
        message: `¿Estás seguro de eliminar a "${client.name} ${client.lastName}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        confirmColor: 'warn',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.clientService.delete(client.id).subscribe({
        next: () => {
          this.notification.success('Cliente eliminado exitosamente');
          this.loadClients();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }
}
