import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CategoryService } from '../../../categories/services/category.service';

interface FilterTab {
  label: string;
  value: string | null;
  icon?: string;
}

@Component({
  selector: 'app-game-filters',
  imports: [MatIconModule, FormsModule],
  templateUrl: './game-filters.html',
})
export class GameFilters implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeCategoryId = input<string | null>(null);
  readonly searchTerm = input<string>('');

  readonly categoryChange = output<string | null>();
  readonly searchChange = output<string>();

  readonly tabs = signal<FilterTab[]>([{ label: 'Todos', value: null }]);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (categories) => {
        const categoryTabs: FilterTab[] = categories
          .filter((c) => c.isActive)
          .map((c) => ({
            label: c.name,
            value: c.id,
            icon: c.icon,
          }));

        this.tabs.set([{ label: 'Todos', value: null }, ...categoryTabs]);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.tabs.set([{ label: 'Todos', value: null }]);
      }
    });
  }

  selectCategory(value: string | null): void {
    this.categoryChange.emit(value);
  }

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
