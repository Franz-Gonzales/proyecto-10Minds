import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 6000);
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  private show(message: string, type: NotificationType, duration?: number): void {
    const panelClassMap: Record<NotificationType, string> = {
      success: 'snack-success',
      error: 'snack-error',
      warning: 'snack-warning',
      info: 'snack-info',
    };

    this.snackBar.open(message, '✕', {
      ...this.defaultConfig,
      duration: duration ?? this.defaultConfig.duration,
      panelClass: [panelClassMap[type]],
    });
  }
}
