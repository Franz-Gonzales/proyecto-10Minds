import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { LOAN_STATUS_LABELS, LoanStatus } from '../../models/loan.model';

interface FilterTab {
  label: string;
  value: LoanStatus | null;
}

@Component({
  selector: 'app-loan-filters',
  imports: [MatIconModule, FormsModule],
  templateUrl: './loan-filters.html',
})
export class LoanFilters {
  readonly activeStatus = input<LoanStatus | null>(null);
  readonly searchTerm = input<string>('');

  readonly statusChange = output<LoanStatus | null>();
  readonly searchChange = output<string>();

  readonly tabs: FilterTab[] = [
    { label: 'Todos', value: null },
    { label: LOAN_STATUS_LABELS[LoanStatus.RESERVED], value: LoanStatus.RESERVED },
    { label: LOAN_STATUS_LABELS[LoanStatus.LOANED], value: LoanStatus.LOANED },
    { label: LOAN_STATUS_LABELS[LoanStatus.DELIVERED], value: LoanStatus.DELIVERED },
    { label: LOAN_STATUS_LABELS[LoanStatus.OVERDUE], value: LoanStatus.OVERDUE },
  ];

  selectStatus(value: LoanStatus | null): void {
    this.statusChange.emit(value);
  }

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
