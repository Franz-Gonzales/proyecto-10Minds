import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { LoanFilters } from '../../components/loan-filters/loan-filters';
import { ListLoans } from '../../components/list-loans/list-loans';
import {
  LoanFormDialog,
  LoanFormDialogData,
} from '../../components/loan-form-dialog/loan-form-dialog';

import { LoanService } from '../../services/loan.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractGraphQLError } from '../../../../core/interceptors/error.interceptor';

import { CreateLoanInput, Loan, LoanStatus } from '../../models/loan.model';

@Component({
  selector: 'app-loans-page',
  imports: [PageHeader, LoanFilters, EmptyState, ListLoans],
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

  readonly filteredLoans = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    if (!search) return this.loans();

    return this.loans().filter((loan) => {
      const gameTitle = loan.game?.title?.toLowerCase() ?? '';
      const clientName = `${loan.client?.name ?? ''} ${loan.client?.lastName ?? ''}`.toLowerCase();
      return gameTitle.includes(search) || clientName.includes(search);
    });
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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(LoanFormDialog, {
      width: '680px',
      maxHeight: '90vh',
      data: {} satisfies LoanFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: CreateLoanInput | undefined) => {
      if (!result) return;

      this.loanService.create(result).subscribe({
        next: () => {
          this.notification.success('Préstamo registrado exitosamente');
          this.loadLoans();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  onReturnLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
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

  onDeleteLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
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
