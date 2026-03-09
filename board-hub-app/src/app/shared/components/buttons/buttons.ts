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
  host: {
    '[class.block]': 'fullWidth()',
    '[class.w-full]': 'fullWidth()'
  }
})
export class Button {
  readonly label = input.required<string>();
  readonly icon = input<string>();
  readonly variant = input<ButtonVariant>('solid-blue');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly justify = input<'center' | 'start'>('center');

  readonly clicked = output<void>();

  readonly labelClasses = computed(() => {
    if (this.icon()) {
      return 'font-medium tracking-wide text-sm hidden sm:inline';
    }
    return 'font-medium tracking-wide text-xs sm:text-sm';
  });

  readonly tailwindClasses = computed(() => {
    const widthClass = this.fullWidth() ? '!w-full' : 'w-full sm:w-auto';
    const justifyClass = this.justify() === 'start'
      ? (this.icon() ? 'justify-center sm:justify-start' : 'justify-start')
      : 'justify-center';

    const baseClasses = `${widthClass} flex ${justifyClass} items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed `;

    const solidBase = baseClasses + '!shadow-none !rounded-xl !h-12 sm:!h-[45px] !px-4 sm:!px-6 !text-white !border-transparent ';
    const outlineBase = baseClasses + '!shadow-none !rounded-[10px] !h-10 sm:!h-[35px] !px-3 sm:!px-5 !bg-transparent !border ';

    const variantMap: Record<ButtonVariant, string> = {
      'solid-blue':  solidBase + '!bg-[#1D6AE5] hover:brightness-90',
      'solid-slate': solidBase + '!bg-[#1B273B] hover:brightness-125',
      'solid-green': solidBase + '!bg-[#16A34A] hover:brightness-90',
      'solid-red':   solidBase + '!bg-[#D64545] hover:brightness-90',

      'outline-blue':  outlineBase + '!border-[#1D6AE5] !text-[#1D6AE5] hover:!bg-[#1D6AE5]/10',
      'outline-slate': outlineBase + '!border-[#94A3B8] !text-[#94A3B8] hover:!bg-[#94A3B8]/10',
      'outline-green': outlineBase + '!border-[#16A34A] !text-[#16A34A] hover:!bg-[#16A34A]/10',
      'outline-red':   outlineBase + '!border-[#D64545] !text-[#D64545] hover:!bg-[#D64545]/10',
    };

    return variantMap[this.variant()];
  });
}
