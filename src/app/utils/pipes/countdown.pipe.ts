import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countdown',
  standalone: true,
})
export class CountdownPipe implements PipeTransform {
  transform(milliseconds: number, format: 'full' | 'minute' = 'full'): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    switch (format) {
      case 'full':
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      case 'minute':
        return `${minutes}`;
    }
  }
}
