import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, NgClass } from '@angular/common';

import {
  Loan,
  LoanStatus,
  LOAN_STATUS_LABELS,
  LOAN_STATUS_COLORS,
} from '../../models/loan.model';

/** One row in the general list = one client with their most recent loan */
export interface ClientLoanSummary {
  clientId: string;
  clientName: string;
  clientLastName: string;
  clientPhone: string;
  latestLoan: Loan;
  totalLoans: number;
}

@Component({
  selector: 'app-list-loans',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatTableModule, DatePipe, NgClass],
  templateUrl: './list-loans.html',
})
export class ListLoans {
  readonly loans = input.required<Loan[]>();
  readonly viewClientLoans = output<ClientLoanSummary>();

  readonly displayedColumns = ['index', 'client', 'latestGame', 'period', 'totalLoans', 'status', 'total', 'actions'];

  readonly statusLabels = LOAN_STATUS_LABELS;
  readonly statusColors = LOAN_STATUS_COLORS;

  /** Group loans by client, keep only the most recent per client */
  readonly clientSummaries = computed<ClientLoanSummary[]>(() => {
    const loans = this.loans();
    const map = new Map<string, { loans: Loan[] }>();

    for (const loan of loans) {
      const cid = loan.clientId;
      if (!map.has(cid)) {
        map.set(cid, { loans: [] });
      }
      map.get(cid)!.loans.push(loan);
    }

    const summaries: ClientLoanSummary[] = [];
    for (const [clientId, data] of map) {
      // Sort by createdAt descending to get the most recent
      data.loans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = data.loans[0];

      summaries.push({
        clientId,
        clientName: latest.client?.name ?? 'Desconocido',
        clientLastName: latest.client?.lastName ?? '',
        clientPhone: latest.client?.phoneNumber ?? '',
        latestLoan: latest,
        totalLoans: data.loans.length,
      });
    }

    // Sort summaries by most recent loan first
    summaries.sort((a, b) =>
      new Date(b.latestLoan.createdAt).getTime() - new Date(a.latestLoan.createdAt).getTime()
    );

    return summaries;
  });

  getFullName(s: ClientLoanSummary): string {
    return `${s.clientName} ${s.clientLastName}`;
  }

  getInitials(s: ClientLoanSummary): string {
    const first = s.clientName.charAt(0).toUpperCase();
    const last = s.clientLastName.charAt(0).toUpperCase();
    return `${first}${last}`;
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

  getGameCategory(loan: Loan): string {
    return loan.game?.category?.name ?? '';
  }

  formatCurrency(value: number): string {
    return `Bs. ${value.toFixed(2)}`;
  }

  isDateOverdue(loan: Loan): boolean {
    return loan.status === LoanStatus.OVERDUE;
  }

  getStatusClasses(row: ClientLoanSummary): string {
    const c = this.statusColors[row.latestLoan.status];
    return `${c.bg} ${c.text} ${c.border}`;
  }

  getStatusDot(row: ClientLoanSummary): string {
    return this.statusColors[row.latestLoan.status].dot;
  }

  getStatusLabel(row: ClientLoanSummary): string {
    return this.statusLabels[row.latestLoan.status];
  }
}
