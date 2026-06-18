// import { NativeDateAdapter, } from '@angular/material/dialog';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

import { Injectable } from "@angular/core";
export const APP_DATE_FORMATS = {
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
    },
    display: {
        //  dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
        dateInput: 'input',
        //  monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
         monthYearLabel: 'inputMonth',
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};


@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
    parse(value: any): Date | null {
        console.log('value', value);
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        value.toLocaleString('default', { month: 'long' }).slice(0,3);
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
    format(date: Date, displayFormat: string): string {
        if (displayFormat === 'input') {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const monthstr = date.toLocaleString('default', { month: 'long' }).slice(0,3);
            const year = date.getFullYear();
            return this._to2digit(day) + '/' + monthstr + '/' + year;
        } else if (displayFormat === 'inputMonth') {
            const month = date.getMonth() + 1;
            const monthstr = date.toLocaleString('default', { month: 'long' }).slice(0,3);
            const year = date.getFullYear();
            return monthstr + '/' + year;
        } else {
            return date.toDateString();
        }
    }

    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}
