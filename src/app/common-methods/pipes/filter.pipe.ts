import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: false, name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;
    const term = searchText.toLowerCase();
    return items.filter(item =>
      Object.values(item).some(val =>
        val != null && String(val).toLowerCase().includes(term)
      )
    );
  }
}
