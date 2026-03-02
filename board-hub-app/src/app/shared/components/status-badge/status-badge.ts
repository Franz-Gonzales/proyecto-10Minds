import { Component, computed, input } from '@angular/core';

type Status = 'RESERVED' | 'DELIVERED' | 'OVERDUE';

interface StatusConfig {
  label: string;
  colorClass: string;
  dotClass: string;
}

const STATUS_MAP: Record<Status, StatusConfig> = {
  RESERVED: {
    label: 'Activo',
    colorClass: 'text-primary border-primary/30 bg-primary/10',
    dotClass: 'bg-primary',
  },
  DELIVERED: {
    label: 'Devuelto',
    colorClass: 'text-success border-success/30 bg-success/10',
    dotClass: 'bg-success',
  },
  OVERDUE: {
    label: 'Vencido',
    colorClass: 'text-error border-error/30 bg-error/10',
    dotClass: 'bg-error',
  },
};

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  readonly status = input.required<string>();

  readonly config = computed<StatusConfig>(() => {
    return STATUS_MAP[this.status() as Status] ?? STATUS_MAP['RESERVED'];
  });
}