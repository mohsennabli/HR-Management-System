import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {
  transform(value: number[]): number {
    if (!value || !Array.isArray(value)) {
      return 0;
    }
    return value.reduce((acc, curr) => acc + curr, 0);
  }
} 