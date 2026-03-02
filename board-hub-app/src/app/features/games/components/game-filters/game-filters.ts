import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GameCategory, CATEGORY_LABELS } from '../../models/game.model';

interface FilterTab {
  label: string;
  value: GameCategory | null;
}

@Component({
  selector: 'app-game-filters',
  imports: [MatIconModule, FormsModule],
  templateUrl: './game-filters.html',
})
export class GameFilters {
  readonly activeCategory = input<GameCategory | null>(null);
  readonly searchTerm = input<string>('');

  readonly categoryChange = output<GameCategory | null>();
  readonly searchChange = output<string>();

  readonly tabs: FilterTab[] = [
    { label: 'Todos', value: null },
    { label: CATEGORY_LABELS[GameCategory.ESTRATEGIA], value: GameCategory.ESTRATEGIA },
    { label: CATEGORY_LABELS[GameCategory.FAMILIAR], value: GameCategory.FAMILIAR },
    { label: CATEGORY_LABELS[GameCategory.COOPERATIVO], value: GameCategory.COOPERATIVO },
    { label: CATEGORY_LABELS[GameCategory.PARTY], value: GameCategory.PARTY },
    { label: CATEGORY_LABELS[GameCategory.ABSTRACTO], value: GameCategory.ABSTRACTO },
    { label: CATEGORY_LABELS[GameCategory.RPG], value: GameCategory.RPG },
  ];

  readonly localSearch = signal('');

  selectCategory(value: GameCategory | null): void {
    this.categoryChange.emit(value);
  }

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
