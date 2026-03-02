import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
  transform(startDate: string | Date, endDate: string | Date): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const fmt = 'MMM dd, yyyy';
    return `${format(start, fmt, { locale: es })} - ${format(end, fmt, { locale: es })}`;
  }
}