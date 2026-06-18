import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';

@Component({
  standalone: false,
  selector: 'app-common-file-database',
  templateUrl: './common-file-database.component.html',
  styleUrls: ['./common-file-database.component.css']
})
export class CommonFileDatabaseComponent implements OnInit {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() formarray: UntypedFormArray;
  @Output() emitNotapplicable = new EventEmitter<any>();
  @Input() formIndex: number;
  @Input() header: string;
  userData: any;
  nFlag = false;
  screeningComponent = new ScreeningComponentInfo();
  docdata: any[] = [];  
  showInSuff: boolean;
  compName: any;
  constructor(public screening: ScreeningService, public common: CommonService, public fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // this.mainForm.get(this.formgroupName + '.sourceName').setValidators(Validators.required);
    // this.mainForm.get(this.formgroupName + '.sourceName').updateValueAndValidity();
    console.log(this.mainForm, 'mainForm');
    if (this.screeningComponent.componentDocument.length == 0) {
      this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
    }
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
    let compNameList = this.screening.componentList.filter(x => x.compId === this.mainForm.value.screeningComponentInfo.compId);
    if (compNameList.length > 0) {
      this.compName = compNameList[0].compName;
    }
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
    } else {
      this.showInSuff = false;
    }
    if (this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.value === 0) {
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValue(null);
    }
    if (this.showInSuff) {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('levelLookupId')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('raisedDate')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    }
  }



  notApplicable(event: any) {
    this.fileBtn = event.checked;
    const obj = { index: this.formIndex, checked: event.checked, formdata: this.mainForm.getRawValue() }
    this.screening.notApplicableSub.next(obj);
    this.emitNotapplicable.emit(event);
    this.nFlag = true;
  }

}
