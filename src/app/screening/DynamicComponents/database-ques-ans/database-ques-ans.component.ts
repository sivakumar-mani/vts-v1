import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
@Component({
  standalone: false,
  selector: 'app-database-ques-ans',
  templateUrl: './database-ques-ans.component.html',
  styleUrls: ['./database-ques-ans.component.css']
})
export class DatabaseQuesAnsComponent implements OnInit {

   @Input() mainForm: UntypedFormGroup;
  @Input() formArrName: string;
  @Input() miscHint = { qHint: '', aHint: '' };
  @Input() miscType: string;
  @Input() disableAnswer = false;
  @Input() hiddenAddRemove = false;
  rowCount = 1;
  userData = new User();
  constructor(public common: CommonService) { }
  ngOnInit() {
      this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.rowCount = (this.mainForm.get(this.formArrName) as UntypedFormArray).controls.length;

    if (this.rowCount > 1) {
      this.removeQues(this.mainForm.get(this.formArrName).value.findIndex(x => x.screeningRecordCheckId === 0
        && x.recordCheckCategoryQues === '' && x.remark === ''));
    }
    if (this.userData.applicationId === 3) {
      this.disableAnswer = false;
    }
  }
  addQues() {
    if (this.mainForm.get(this.formArrName).valid) {
      const addMisc = this.mainForm.get(this.formArrName) as UntypedFormArray;
      addMisc.push(this.miscItems());
      } else {
      this.mainForm.get(this.formArrName).markAllAsTouched();
    }

  }
  removeQues(index: any) {
    if (index > -1) {
      const removeMisc = this.mainForm.get(this.formArrName) as UntypedFormArray;
      removeMisc.removeAt(index);
         }
  }
  getMiscFormGroup() {
    this.rowCount = (this.mainForm.get(this.formArrName) as UntypedFormArray).controls.length;
    return (this.mainForm.get(this.formArrName) as UntypedFormArray).controls;
  }
  miscItems(): UntypedFormGroup {
    return new UntypedFormGroup({
      miscId: new UntypedFormControl(0),
      miscQuestion: new UntypedFormControl('', Validators.required),
      miscAnswer: new UntypedFormControl(''),
      defaultQuestionFlag: new UntypedFormControl(false)
    });
  }
}
