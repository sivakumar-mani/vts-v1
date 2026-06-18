import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { User } from 'src/app/common-methods/models/user';

@Component({
  standalone: false,
  selector: 'app-common-custom-fields',
  templateUrl: './common-custom-fields.component.html',
  styleUrls: ['./common-custom-fields.component.css']
})
export class CommonCustomFieldsComponent implements OnInit {
  @Input() mainForm: UntypedFormGroup;
  @Input() formArrName: string;
  userData = new User();

  constructor() { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  }
  getMiscFormGroup() {
    const control = this.mainForm.get(this.formArrName) as UntypedFormArray;
    if (control) {
      return control.controls;
    }
    // return (this.mainForm.get(this.formArrName) as UntypedFormArray).controls;
  }

}
