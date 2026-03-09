import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { LoanFilters } from '../../components/loan-filters/loan-filters';
import { ListLoans, ClientLoanSummary } from '../../components/list-loans/list-loans';
import { LoansClient } from '../../components/loans-client/loans-client';
import {
  LoanFormDialog,
  LoanFormDialogData,
} from '../../components/loan-form-dialog/loan-form-dialog';

import { LoanService } from '../../services/loan.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractGraphQLError } from '../../../../core/interceptors/error.interceptor';

import { CreateBulkLoansInput, Loan, LoanStatus, UpdateLoanInput } from '../../models/loan.model';

@Component({
  selector: 'app-loans-page',
  imports: [PageHeader, LoanFilters, EmptyState, ListLoans, LoansClient],
  templateUrl: './loans-page.html',
})
export default class LoansPage implements OnInit {
  private readonly loanService = inject(LoanService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly loans = signal<Loan[]>([]);
  readonly loading = signal(false);
  readonly activeStatus = signal<LoanStatus | null>(null);
  readonly searchTerm = signal('');

  /** When set, we show the client detail view */
  readonly selectedClient = signal<ClientLoanSummary | null>(null);

  /** Filtered loans for the general view (status + search) */
  readonly filteredLoans = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    let result = this.loans();

    if (search) {
      result = result.filter((loan) => {
        const gameTitle = loan.game?.title?.toLowerCase() ?? '';
        const clientName = `${loan.client?.name ?? ''} ${loan.client?.lastName ?? ''}`.toLowerCase();
        return gameTitle.includes(search) || clientName.includes(search);
      });
    }

    return result;
  });

  /** Loans for the selected client, filtered by status */
  readonly clientLoans = computed(() => {
    const client = this.selectedClient();
    if (!client) return [];

    let result = this.loans().filter(l => l.clientId === client.clientId);

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      result = result.filter(l => {
        const gameTitle = l.game?.title?.toLowerCase() ?? '';
        return gameTitle.includes(search);
      });
    }

    // Sort by most recent first
    return result.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading.set(true);
    const status = this.activeStatus() ?? undefined;

    this.loanService.getAll({ status, includeDeleted: false }).subscribe({
      next: (loans) => {
        this.loans.set(loans);
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.error(extractGraphQLError(err));
        this.loading.set(false);
      },
    });
  }

  onStatusChange(status: LoanStatus | null): void {
    this.activeStatus.set(status);
    this.loadLoans();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  // ─── Client detail navigation ───
  onViewClientLoans(summary: ClientLoanSummary): void {
    this.searchTerm.set('');
    this.selectedClient.set(summary);
  }

  onBackToGeneral(): void {
    this.searchTerm.set('');
    this.selectedClient.set(null);
  }

  // ─── Create ───
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(LoanFormDialog, {
      width: '95vw',
      maxWidth: '720px',
      maxHeight: '90vh',
      data: {} satisfies LoanFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: CreateBulkLoansInput | undefined) => {
      if (!result) return;

      this.loanService.createBulk(result).subscribe({
        next: (loans) => {
          this.notification.success(`${loans.length} préstamo(s) registrado(s) exitosamente`);
          this.loadLoans();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  // ─── Edit ───
  openEditDialog(loan: Loan): void {
    const dialogRef = this.dialog.open(LoanFormDialog, {
      width: '95vw',
      maxWidth: '680px',
      maxHeight: '90vh',
      data: { loan } satisfies LoanFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: UpdateLoanInput | undefined) => {
      if (!result) return;

      this.loanService.update(result).subscribe({
        next: () => {
          this.notification.success('Préstamo actualizado exitosamente');
          this.loadLoans();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  // ─── Return (mark as delivered) ───
  onReturnLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '90vw',
      maxWidth: '420px',
      data: {
        title: 'Confirmar devolución',
        message: `¿Marcar como entregado el préstamo de "${loan.game?.title ?? 'juego'}" para ${loan.client?.name ?? 'cliente'} ${loan.client?.lastName ?? ''}?`,
        confirmLabel: 'Marcar entregado',
        cancelLabel: 'Cancelar',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.loanService.returnLoan(loan.id).subscribe({
        next: () => {
          this.notification.success('Préstamo marcado como entregado');
          this.loadLoans();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  // ─── Revert (undo delivered → reserved/overdue) ───
  onRevertLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '90vw',
      maxWidth: '420px',
      data: {
        title: 'Restaurar préstamo',
        message: `¿Restaurar el préstamo de "${loan.game?.title ?? 'juego'}"? El estado volverá a Reservado o Vencido según corresponda y el stock del juego se reducirá nuevamente.`,
        confirmLabel: 'Restaurar',
        cancelLabel: 'Cancelar',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.loanService.revertLoan(loan.id).subscribe({
        next: () => {
          this.notification.success('Préstamo restaurado exitosamente');
          this.loadLoans();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  // ─── Delete ───
  onDeleteLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '90vw',
      maxWidth: '420px',
      data: {
        title: 'Eliminar préstamo',
        message: `¿Estás seguro de eliminar el préstamo de "${loan.game?.title ?? 'juego'}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.loanService.delete(loan.id).subscribe({
        next: () => {
          this.notification.success('Préstamo eliminado exitosamente');
          this.loadLoans();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }
}
