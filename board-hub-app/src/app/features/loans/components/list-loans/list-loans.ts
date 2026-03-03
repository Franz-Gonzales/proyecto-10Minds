import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

import {
  Loan,
  LoanStatus,
  LOAN_STATUS_LABELS,
  LOAN_STATUS_COLORS,
} from '../../models/loan.model';

@Component({
  selector: 'app-list-loans',
  imports: [MatIconModule, MatMenuModule, MatButtonModule, MatTooltipModule, DatePipe],
  templateUrl: './list-loans.html',
})
export class ListLoans {
  readonly loans = input.required<Loan[]>();

  readonly returnLoan = output<Loan>();
  readonly deleteLoan = output<Loan>();

  readonly statusLabels = LOAN_STATUS_LABELS;
  readonly statusColors = LOAN_STATUS_COLORS;
  readonly LoanStatus = LoanStatus;

  getClientFullName(loan: Loan): string {
    if (!loan.client) return 'Cliente desconocido';
    return `${loan.client.name} ${loan.client.lastName}`;
  }

  getClientInitials(loan: Loan): string {
    if (!loan.client) return '??';
    const first = loan.client.name?.charAt(0) ?? '';
    const last = loan.client.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-blue-600', 'bg-purple-600', 'bg-emerald-600',
      'bg-amber-600', 'bg-rose-600', 'bg-cyan-600',
      'bg-indigo-600', 'bg-teal-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getGameTitle(loan: Loan): string {
    return loan.game?.title ?? 'Juego desconocido';
  }

  getGameImage(loan: Loan): string | null {
    return loan.game?.imageUrl ?? null;
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
}
