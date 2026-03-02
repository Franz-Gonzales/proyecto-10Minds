import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyBs' })
export class CurrencyBsPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null) return 'Bs. 0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'Bs. 0.00';
    return `Bs. ${num.toFixed(2)}`;
  }
}