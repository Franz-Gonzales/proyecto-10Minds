import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stock-badge',
  imports: [],
  templateUrl: './stock-badge.html',
})
export class StockBadge {
  readonly stock = input.required<number>();

  readonly isAvailable = computed(() => this.stock() > 0);
  readonly label = computed(() =>
    this.isAvailable() ? `${this.stock()} disponibles` : 'Agotado',
  );
}
