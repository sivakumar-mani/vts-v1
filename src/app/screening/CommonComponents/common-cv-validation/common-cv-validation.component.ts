import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { Options } from 'selenium-webdriver/chrome';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { SelectItem } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-common-cv-validation',
  templateUrl: './common-cv-validation.component.html',
  styleUrls: ['./common-cv-validation.component.css']
})
export class CommonCvValidationComponent implements OnInit {
  @Input() formarrayName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Output() addNewCV = new EventEmitter<any>();
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() invitationFlag = false;
  docdata: any[] = [];
  items: SelectItem[] = [];
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  showInSuff: boolean;
  docData: any;
  applicationId: number;
  cvList: any[] = [];
  nFlag = false;
  constructor(public screeningService: ScreeningService, private common: CommonService) { }
  ngOnInit() {
    if(this.mainForm!=undefined){
      if(this.screeningComponent.componentDocument.length==0){               
        this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
      this.getduplicate();
      this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.showInsuff();
      if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
        this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
      }
    }
    let statusList: any[] = [];
    statusList = this.compBaseDetails.screeningStatus.filter(x => x.screeningStatus === 'Close - Fake (Verbal Conf Rcvd.)' || x.screeningStatus === 'Close - Gen (Verbal Conf Rcvd.)')
    if (statusList.length > 0) {
      for (let i = 0; i < statusList.length; i++) {
        this.items.push({
          label: statusList[i].screeningStatus, value: statusList[i].statusId
        });
      }
    }
  }

  getduplicate() {
    const frmArray = this.mainForm.get(this.formarrayName) as UntypedFormGroup;
    const rawData = frmArray.getRawValue();
    this.cvList = Object.keys(rawData);
  }
  formarraycontrol(name: any) {
    return (this.mainForm.get(this.formarrayName) as UntypedFormArray).controls;
  }

  controls(catogery: any) {
    const frmGroup = this.mainForm.get(this.formarrayName) as UntypedFormGroup;
    const mycontrols = (frmGroup.get(catogery) as UntypedFormArray).controls;
    return mycontrols;
  }
  getparticularForm(form: UntypedFormArray) {
    return form.controls;
  }
  addnewComp(item, form) {
    const frmGroup = this.mainForm.get(this.formarrayName) as UntypedFormGroup;
    const mycontrols = frmGroup.get(item) as UntypedFormArray;
    this.addNewCV.emit({ item, form: mycontrols });
  }
  removeCV(index, catogery) {
    const frmGroup = this.mainForm.get(this.formarrayName) as UntypedFormGroup;
    const mycontrols = frmGroup.get(catogery) as UntypedFormArray;
    mycontrols.removeAt(index);
  }
  onSelectionChange(event: any) {
    if (event > 0) {
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValue(null);
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
    }
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
    } else {
      this.showInSuff = false;
    }
    if(this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.value === 0) {
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValue(null);
    }
    if (this.showInSuff) {
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValue(null);
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.clearValidators();
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
    this.nFlag = true;
  }
}
