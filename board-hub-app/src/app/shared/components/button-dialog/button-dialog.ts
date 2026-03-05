import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './button-dialog.html',
})
export class ButtonDialog {

  readonly actionLabel = input<string>('');
  readonly actionIcon = input<string>('');
  readonly action = output<void>();

}
