import { Component, input, computed } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

export type ChipVariant = 'blue' | 'green' | 'gray' | 'red' | 'indigo' | 'yellow';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './chips.html',
})
export class Chip {
  // Datos que recibe el componente
  readonly label = input.required<string>();
  readonly variant = input<ChipVariant>('gray'); 

  // Calcula la clase SCSS que irá aplicada al chip según la variante
  readonly chipClass = computed(() => `chip-${this.variant()}`);

  // Calcula el color de fondo del puntito usando Tailwind
  readonly dotClass = computed(() => {
    const colorMap: Record<ChipVariant, string> = {
      blue: 'bg-blue-400',
      green: 'bg-emerald-400',
      gray: 'bg-slate-400',
      red: 'bg-red-400',
      indigo: 'bg-indigo-400',
      yellow: 'bg-amber-400',
    };
    return colorMap[this.variant()];
  });
}