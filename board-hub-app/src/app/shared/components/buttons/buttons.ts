import { Component, input, computed, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'solid-blue' | 'solid-slate' | 'solid-green' | 'solid-red'
  | 'outline-blue' | 'outline-slate' | 'outline-green' | 'outline-red';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './buttons.html',
})
export class Button {
  readonly label = input.required<string>();
  readonly icon = input<string>(); 
  readonly variant = input<ButtonVariant>('solid-blue'); 
  readonly disabled = input<boolean>(false);

  readonly clicked = output<void>();

  readonly tailwindClasses = computed(() => {
    
    // 1. Clases base para los botones SÓLIDOS 
    const solidBase = '!shadow-none !rounded-xl !h-[45px] !px-5 transition-colors duration-200 !text-white ';
    
    // 2. Clases base para los botones OUTLINE 
    const outlineBase = '!shadow-none !rounded-[10px] !h-[45px] !px-4 !min-w-0 !bg-transparent !border transition-colors duration-200 ';

    // 3. Diccionario con los 8 tipos 
    const variantMap: Record<ButtonVariant, string> = {
      // Sólidos
      'solid-blue':  solidBase + '!bg-blue-600 hover:!bg-blue-700',
      'solid-slate': solidBase + '!bg-slate-800 hover:!bg-slate-900',
      'solid-green': solidBase + '!bg-green-600 hover:!bg-green-700',
      'solid-red':   solidBase + '!bg-red-500 hover:!bg-red-600',
      
      // Outlines
      'outline-blue':  outlineBase + '!border-blue-500 !text-blue-500 hover:!bg-blue-500/10',
      'outline-slate': outlineBase + '!border-slate-700 !text-slate-300 hover:!bg-slate-800 hover:!text-white',
      'outline-green': outlineBase + '!border-green-600 !text-green-600 hover:!bg-green-600/10',
      'outline-red':   outlineBase + '!border-red-500 !text-red-500 hover:!bg-red-500/10',
    };

    return variantMap[this.variant()];
  });
}