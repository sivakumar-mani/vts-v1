import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'textmask'
  })
  export class MaskPipe implements PipeTransform {
  
    transform(value: string): string {
     
      if (value.length < 10) {
        return value;
      }
      return  value.replace(/\d(?=\d{4})/g, "X-");
    }

  
  }