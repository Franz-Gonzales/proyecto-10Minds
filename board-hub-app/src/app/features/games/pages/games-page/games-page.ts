import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PageHeader } from '../../../../shared/components/page-header/page-header';

import { GameFilters } from '../../components/game-filters/game-filters';
import { GameCard } from '../../components/game-card/game-card';
import { GameFormDialog, GameFormDialogData } from '../../components/game-form-dialog/game-form-dialog';

import { GameService } from '../../services/game.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractGraphQLError } from '../../../../core/interceptors/error.interceptor';

import { Game, GameCategory, CreateGameInput, UpdateGameInput } from '../../models/game.model';
import { EmptyState } from '../../components/empty-state/empty-state';
import { ConfirmDialog, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-games-page',
  imports: [PageHeader, GameFilters, GameCard, EmptyState],
  templateUrl: './games-page.html',
})
export default class GamesPage implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly games = signal<Game[]>([]);
  readonly loading = signal(false);
  readonly activeCategory = signal<GameCategory | null>(null);
  readonly searchTerm = signal('');

  readonly filteredGames = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    if (!search) return this.games();
    return this.games().filter((g) => g.title.toLowerCase().includes(search));
  });

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading.set(true);
    const category = this.activeCategory() ?? undefined;

    this.gameService.getAll(category).subscribe({
      next: (games) => {
        this.games.set(games);
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.error(extractGraphQLError(err));
        this.loading.set(false);
      },
    });
  }

  onCategoryChange(category: GameCategory | null): void {
    this.activeCategory.set(category);
    this.loadGames();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(GameFormDialog, {
      width: '640px',
      maxHeight: '90vh',
      data: {} satisfies GameFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: CreateGameInput | undefined) => {
      if (!result) return;

      this.gameService.create(result).subscribe({
        next: (created) => {
          this.notification.success('Juego creado exitosamente');
          this.loadGames();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  openEditDialog(game: Game): void {
    const dialogRef = this.dialog.open(GameFormDialog, {
      width: '640px',
      maxHeight: '90vh',
      data: { game } satisfies GameFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: UpdateGameInput | undefined) => {
      if (!result) return;

      this.gameService.update(result).subscribe({
        next: (updated) => {
          this.notification.success('Juego actualizado exitosamente');
          this.loadGames();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  confirmDelete(game: Game): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar juego',
        message: `¿Estás seguro de eliminar "${game.title}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        confirmColor: 'warn',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.gameService.delete(game.id).subscribe({
        next: () => {
          this.notification.success('Juego eliminado exitosamente');
          this.loadGames();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }
}
