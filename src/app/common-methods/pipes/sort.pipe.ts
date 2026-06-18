import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(records: Array<any>, args?: any): any {
    if (records) {
      return records.sort((a, b) => {
        if (args.property && a[args.property] && b[args.property] && a[args.property].toUpperCase() < b[args.property].toUpperCase()) {
          return -1 * args.direction;
        } else if (a[args.property] && b[args.property] && a[args.property].toUpperCase() > b[args.property].toUpperCase()) {
          return 1 * args.direction;
        } else {
          return 0;
        }
      });
    }
  }
}

