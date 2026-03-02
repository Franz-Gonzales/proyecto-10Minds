import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  templateUrl: './empty-state.html',
})
export class EmptyState {
  readonly icon = input<string>('inbox');
  readonly title = input<string>('Sin resultados');
  readonly subtitle = input<string>('No se encontraron datos para mostrar.');
}
