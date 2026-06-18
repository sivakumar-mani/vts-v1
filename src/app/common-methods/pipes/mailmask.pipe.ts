import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'mailmask'

  })
  export class MailMask implements PipeTransform {
    msktxt = /(?<=.)[^@\n](?=[^@\n]*?@)|(?:(?<=@.)|(?!^)\G(?=[^@\n]*$)).(?=.*\.)/gm;
    subst = `*`;

    transform (value:string):string{
        if(value!=null){
        return value.replace(this.msktxt,this.subst);
        }
        else{
            return "Invalid"
        } 
    }
  }