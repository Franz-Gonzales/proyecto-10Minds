import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Game, CATEGORY_LABELS, CATEGORY_COLORS } from '../../models/game.model';
import { StockBadge } from '../../../../shared/components/stock-badge/stock-badge';
import { CurrencyBsPipe } from '../../../../shared/pipes/currency-bs-pipe';

@Component({
  selector: 'app-game-card',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, StockBadge, CurrencyBsPipe],
  templateUrl: './game-card.html',
})
export class GameCard {
  readonly game = input.required<Game>();

  readonly edit = output<Game>();
  readonly delete = output<Game>();

  readonly categoryLabels = CATEGORY_LABELS;
  readonly categoryColors = CATEGORY_COLORS;

  get placeholderImage(): string {
    return 'https://placehold.co/400x240/1e293b/64748b?text=Sin+Imagen';
  }
}
