import { Component, input, computed, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

// Definimos los 8 tipos exactos basados en tu imagen
export type ButtonVariant =
  | 'solid-blue' | 'solid-slate' | 'solid-green' | 'solid-red'
  | 'outline-blue' | 'outline-slate' | 'outline-green' | 'outline-red';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './buttons.html',
  styleUrl: './buttons.scss',
})
export class Button {
  // Datos que recibe el componente
  readonly label = input.required<string>();
  readonly icon = input<string>(); // Opcional
  readonly variant = input<ButtonVariant>('solid-blue'); // Azul por defecto
  readonly disabled = input<boolean>(false);

  // Evento de salida
  readonly clicked = output<void>();

  // Calcula la clase dinámica (ej: 'btn-outline-red')
  readonly btnClass = computed(() => `btn-${this.variant()}`);
}
