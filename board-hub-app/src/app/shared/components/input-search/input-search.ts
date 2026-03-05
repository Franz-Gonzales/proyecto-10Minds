import { Component, input, output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-search',
  imports: [MatIcon, FormsModule],
  templateUrl: './input-search.html',
})
export class InputSearch {

  readonly searchTerm = input<string>('');
  readonly searchChange = output<string>();
  readonly searchPlaceholder = input<string>('');

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }
}
