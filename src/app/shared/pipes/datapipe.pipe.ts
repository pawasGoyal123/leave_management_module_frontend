import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  PercentPipe,
} from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datapipe',
  standalone: true,
})
export class DataPipe implements PipeTransform {
  constructor(
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe
  ) {}

  transform(value: any, pipeName: string, pipeArgs: any[]): any {
    switch (pipeName) {
      case 'date':
        return this.datePipe.transform(value, ...pipeArgs);
      case 'currency':
        return this.currencyPipe.transform(value, ...pipeArgs);
      case 'number':
        return this.decimalPipe.transform(value, ...pipeArgs);
      case 'percent':
        return this.percentPipe.transform(value, ...pipeArgs);
      default:
        return value;
    }
  }
}
