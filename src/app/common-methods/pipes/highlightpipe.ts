import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ standalone: false, name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    constructor(public sanitizer: DomSanitizer) {
    }
    transform(text: string, search): SafeHtml {
        if (search && text) {
            let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            pattern = pattern.split(' ').filter((t) => {
                return t.length > 0;
            }).join('|');
            const regex = new RegExp(pattern, 'gi');
            return this.sanitizer.bypassSecurityTrustHtml(
               String(text).replace(regex, (match) => `<b>${match}</b>`)
            );

        } else {
            return text;
        }
    }
}
