import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';

import {
  Loan,
  LoanStatus,
  LOAN_STATUS_LABELS,
  LOAN_STATUS_COLORS,
} from '../../models/loan.model';
import { Button } from '../../../../shared/components/buttons/buttons';

@Component({
  selector: 'app-loans-client',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatTableModule, MatMenuModule, DatePipe, Button],
  templateUrl: './loans-client.html',
})
export class LoansClient {
  readonly loans = input.required<Loan[]>();
  readonly clientName = input.required<string>();

  readonly back = output<void>();
  readonly edit = output<Loan>();
  readonly deleteLoan = output<Loan>();
  readonly returnLoan = output<Loan>();
  readonly revertLoan = output<Loan>();

  readonly displayedColumns = ['index', 'game', 'period', 'quantity', 'status', 'total', 'actions'];

  readonly statusLabels = LOAN_STATUS_LABELS;
  readonly statusColors = LOAN_STATUS_COLORS;
  readonly LoanStatus = LoanStatus;

  getGameTitle(loan: Loan): string {
    return loan.game?.title ?? 'Juego desconocido';
  }

  getGameImage(loan: Loan): string | null {
    return loan.game?.imageUrl ?? null;
  }

  getGameCategory(loan: Loan): string {
    return loan.game?.category?.name ?? '';
  }

  formatCurrency(value: number): string {
    return `Bs. ${value.toFixed(2)}`;
  }

  isDateOverdue(loan: Loan): boolean {
    return loan.status === LoanStatus.OVERDUE;
  }

  canBeReturned(loan: Loan): boolean {
    return loan.status === LoanStatus.RESERVED || loan.status === LoanStatus.OVERDUE;
  }

  canBeReverted(loan: Loan): boolean {
    return loan.status === LoanStatus.DELIVERED;
  }

  canBeEdited(loan: Loan): boolean {
    return loan.status === LoanStatus.RESERVED;
  }

  getTotalSum(): number {
    return this.loans().reduce((sum, l) => sum + l.totalPrice, 0);
  }

  getStatusClasses(loan: Loan): string {
    const c = this.statusColors[loan.status];
    return `${c.bg} ${c.text} ${c.border}`;
  }

  getStatusDot(loan: Loan): string {
    return this.statusColors[loan.status].dot;
  }

  getStatusLabel(loan: Loan): string {
    return this.statusLabels[loan.status];
  }
}
