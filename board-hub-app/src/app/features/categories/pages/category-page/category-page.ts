import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from "../../../../shared/components/page-header/page-header";
import { CategoryService } from '../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../../models/category.model';
import { extractGraphQLError } from '../../../../core/interceptors/error.interceptor';
import { InputSearch } from "../../../../shared/components/input-search/input-search";
import { CategoryFormDialogData, CategoryFormDialog } from '../../components/category-form-dialog/category-form-dialog';
import { EmptyState } from "../../../../shared/components/empty-state/empty-state";
import { CategoryList } from "../../components/category-list/category-list";
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category-page',
  imports: [PageHeader, InputSearch, EmptyState, CategoryList],
  templateUrl: './category-page.html',
})
export default class CategoryPage implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal<string>('');

  readonly filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.categories();

    return this.categories().filter((c) => {
      const name = `${c.name}`.toLowerCase();
      return (
        name.includes(term) ||
        (c.description ?? '').toLowerCase().includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories(): void {
    this.loading.set(true);

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.error(extractGraphQLError(err));
        this.loading.set(false);
      },
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialog, {
      width: '600px',
      maxHeight: '90vh',
      data: {} satisfies CategoryFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: CreateCategoryInput | undefined) => {
      if (!result) return;

      this.categoryService.create(result).subscribe({
        next: () => {
          this.notification.success('Categoría registrada exitosamente');
          this.loadCategories();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormDialog, {
      width: '600px',
      maxHeight: '90vh',
      data: { category } satisfies CategoryFormDialogData,
    });

    dialogRef.afterClosed().subscribe((result: (UpdateCategoryInput & { id: string }) | undefined) => {
      if (!result) return;

      this.categoryService.update(result).subscribe({
        next: () => {
          this.notification.success('Categoría actualizada exitosamente');
          this.loadCategories();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

  confirmDelete(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar Categoría',
        message: `¿Estás seguro de eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        confirmColor: 'warn',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.categoryService.delete(category.id).subscribe({
        next: () => {
          this.notification.success('Categoría eliminada exitosamente');
          this.loadCategories();
        },
        error: (err) => {
          this.notification.error(extractGraphQLError(err));
        },
      });
    });
  }

}
