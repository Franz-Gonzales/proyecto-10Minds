import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-filter',
  imports: [MatIconModule, FormsModule],
  templateUrl: './client-filter.html',
})
export class ClientFilter {
  readonly searchTerm = input<string>('');
  readonly searchChange = output<string>();

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}