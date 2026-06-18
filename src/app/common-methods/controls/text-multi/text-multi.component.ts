import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { MultiText } from '../../models/multiText';
import { CommonService } from '../../services/common.service';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-text-multi',
  templateUrl: './text-multi.component.html',
  styleUrls: ['./text-multi.component.css']
})
export class TextMultiComponent implements OnInit, OnChanges {
  @Input() multiText: MultiText;
  @Input() commonField: Observable<any[]>;
  rowCount = 1;
  textFormArray: UntypedFormArray;
  datavalue: any[];
  constructor(private common: CommonService, private cd: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.checkValueChanges();
    }
  }
  checkValueChanges() {
    if (this.commonField) {
      this.commonField.subscribe(data => {
        this.datavalue = data;
        this.textFormArray = this.multiText.selectFormGroup.get(this.multiText.formArrayName) as UntypedFormArray;
        const length = this.textFormArray.length;
        let ind = length;
        if (this.textFormArray.length > 0) {
          while (ind >= 0) {
            this.textFormArray.removeAt(ind);
            ind--;
          }
        }
        if (this.datavalue.length > 0) {
            this.textFormArray.push(this.common.cloneForm(this.multiText.subForm));
            this.textFormArray.setValue(this.datavalue);
        } else {
          this.addItem(0, false);
        }
        this.rowCount = this.textFormArray.length;
        this.cd.markForCheck();
      });
    }
  }
  ngOnInit() {
    this.addItem(0, false);
  }
  addItem(index, fromButton) {
    const formData = this.multiText.selectFormGroup.value;
    this.textFormArray = this.multiText.selectFormGroup.get(this.multiText.formArrayName) as UntypedFormArray;
    if (fromButton) {
      const frmGroup = this.textFormArray.controls[index] as UntypedFormGroup;
      if (frmGroup.valid) {
        const data = frmGroup.get(this.multiText.frmCtrlName);
        if (data.value) {
          const exist = formData[this.multiText.formArrayName].some((s, i) =>
            s.value === data.value && i !== index);
          if (exist) {
            data.setErrors({ alreadyExist: true });
          } else {
            this.textFormArray.push(this.common.cloneForm(this.multiText.subForm));
          }
        } else {
          data.setValidators([Validators.required]);
          data.markAsTouched();
          data.markAsDirty();
          data.updateValueAndValidity();
        }
      }
    } else {
      this.textFormArray.push(this.common.cloneForm(this.multiText.subForm));
    }
    this.rowCount = this.textFormArray.length;

  }
  removeControl(index: any) {
    if (this.textFormArray.length > 1) {
      this.textFormArray.removeAt(index);
    }
    this.rowCount = this.textFormArray.length;
  }
  getFormGroup() {
    return (this.multiText.selectFormGroup.get(this.multiText.formArrayName) as UntypedFormArray).controls;
  }


}
