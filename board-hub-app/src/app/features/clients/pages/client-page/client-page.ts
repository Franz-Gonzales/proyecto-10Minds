import { Component, computed, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { ClientList } from '../../components/client-list/client-list';
import { ClientFormDialog, ClientFormDialogData } from '../../components/client-form-dialog/client-form-dialog';

import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractGraphQLError } from '../../../../core/interceptors/error.interceptor';

import { Client, CreateClientInput, PageInfo, UpdateClientInput } from '../../models/client.model';

@Component({
  selector: 'app-client-page',
  imports: [PageHeader, ClientList, EmptyState],
  templateUrl: './client-page.html',
})
export default class ClientPage implements OnInit, OnDestroy {
  private readonly clientService = inject(ClientService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly destroy$ = new Subject<void>(); // Subject es para manejar la destrucción del componente y evitar memory leaks en los observables
  private readonly searchSubject = new Subject<string>(); // Para capturar lo que el usuario escribe.

  readonly clients = signal<Client[]>([]);
  readonly loading = signal(false);
  readonly pageInfo = signal<PageInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // State for query params
  readonly currentPage = signal(1);      // Página actual
  readonly pageSize = signal(10);        // Items por página
  readonly searchTerm = signal('');      // Texto del buscador
  readonly sortBy = signal('createdAt'); // Campo de orden
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');

  // Indicates if the initial load shows zero results (no search active)
  readonly isEmptyState = computed(() =>
    !this.loading() && this.clients().length === 0 && !this.searchTerm()
  );

  ngOnInit(): void {
    // Debounce search input
    this.searchSubject
      .pipe(
        debounceTime(400), // Espera 400ms después del último keystroke (antirrebote)
        distinctUntilChanged(), // Si el valor no cambió, no emite
        takeUntil(this.destroy$), // Se desuscribe al destruir el comp
      )
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.currentPage.set(1); // Reset to first page on search ( vuelve a página 1)
        this.loadClients();
      });

    this.loadClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClients(): void {
    this.loading.set(true);

    this.clientService
      .getAllPaginated({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        sortBy: this.sortBy(),
        sortOrder: this.sortOrder(),
      })
      .subscribe({
        next: (result) => {
          this.clients.set(result.items);
          this.pageInfo.set(result.pageInfo);
          this.loading.set(false);
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
          this.loading.set(false);
        },
      });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1); // MatPaginator is 0-based, backend is 1-based
    this.pageSize.set(event.pageSize);
    this.loadClients();
  }

  onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.sortBy.set(sort.active);
      this.sortOrder.set(sort.direction.toUpperCase() as 'ASC' | 'DESC');
    } else {
      this.sortBy.set('createdAt');
      this.sortOrder.set('DESC');
    }
    this.currentPage.set(1);
    this.loadClients();
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
