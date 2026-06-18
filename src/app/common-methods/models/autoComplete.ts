import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

export class AutoCompleteDropDown {
    placeholder: string;
    formControlName: string;
    controlId: number | string;
    controlName: string;
    items: any;
    valueField: number | string;
    selectFormGroup: UntypedFormGroup;
    showDefaultSelect: boolean;
    disabled: boolean;
    required: boolean;
    appearance: string;

     constructor(placeholder: string,
                 formControlName: string,
                 controlId: number | string,
                 controlName: string,
                 items: any,
                 valueField: number | string,
                 selectFormGroup: UntypedFormGroup ,
                 showDefaultSelect: boolean,
                 disabled: boolean,
                 required: boolean,
                 appearance = 'outline') {
         this.placeholder = placeholder;
         this.formControlName = formControlName;
         this.controlId = controlId;
         this.controlName = controlName;
         this.items = items;
         this.valueField = valueField;
         this.selectFormGroup = selectFormGroup;
         this.showDefaultSelect = showDefaultSelect;
         this.disabled = disabled;
         this.required = required;
         this.appearance = appearance;
     }

}

