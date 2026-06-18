import { UntypedFormGroup, FormGroupName, UntypedFormArray, FormControlName, UntypedFormControl } from '@angular/forms';

export class MultiText {
    placeholder: string;
    formArrayName: string;
    selectFormGroup: UntypedFormGroup;
    disabled: boolean;
    // required: boolean;
    subForm: UntypedFormGroup;
    frmCtrlName: string;
    constructor(placeholder: string,
                formArrayName: string,
                selectFormGroup: UntypedFormGroup,
                disabled: boolean,
                // required: boolean,
                subForm: UntypedFormGroup,
                frmCtrlName: string) {
        this.placeholder = placeholder;
        this.formArrayName = formArrayName;
        this.selectFormGroup = selectFormGroup;
        this.disabled = disabled;
        // this.required = required;
        this.subForm = subForm;
        this.frmCtrlName = frmCtrlName;
    }

}

