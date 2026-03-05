import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDialog } from "../button-dialog/button-dialog";

@Component({
  selector: 'app-page-header',
  imports: [MatButtonModule, MatIconModule, ButtonDialog],
  templateUrl: './page-header.html',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly actionLabel = input<string>('');
  readonly actionIcon = input<string>('add');

  readonly action = output<void>();

  openCreateDialog()
  {
    this.action.emit();
  }
}
