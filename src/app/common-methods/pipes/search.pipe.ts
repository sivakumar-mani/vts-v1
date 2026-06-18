import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: Array<any>, obj: any[]) {
    if (items && items.length) {
      return items.filter(item => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].key && obj[i].value && item.hasOwnProperty(obj[i].key)
            && (item[obj[i].key] ? item[obj[i].key].toLowerCase() : '').indexOf(obj[i].value.toLowerCase()) === -1) {
            return false;
          }
        }
        return true;
      });
    } else {
      return items;
    }
  }
}
