import { Component, OnInit, SimpleChanges, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningComponentInfo } from '../../../../../src/app/common-methods/models/screening-details';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../common-methods/services/common.service';
import { FSCandidateVm } from 'src/app/common-methods/models/screening-detail';


@Component({
  standalone: false,
  selector: 'app-common-abroad',
  templateUrl: './common-abroad.component.html',
  styleUrls: ['./common-abroad.component.css']
})
export class CommonAbroadComponent implements OnInit, OnChanges {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() compAddress: any;
  @Input() componentName: string;
  docTypeId: number = 0;
  address = new BehaviorSubject(null);
  nFlag = false;
  ssnFlag = false;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  showInSuff: boolean;
  docData: any;
  applicationId: number;
  gapList: any[] = [];
  ssnControl: boolean = false;
  criminalcontrol: boolean = false;
  nationCriminalControl: boolean = false;
  documentList: any;
  indiacountryId: any;
  candidateInfo: FSCandidateVm;
  constructor(public screeningService: ScreeningService, private cd: ChangeDetectorRef, public common: CommonService, public datePipe: DatePipe) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.common.componentName === this.common.MVR) {
      this.documentList = [{ docName: 'SSN' }, { docName: "Driver's License" }];
    } else if(this.common.candidateCountryId === 92){
      this.documentList = [{ docName: 'Government ID' }, { docName: 'Passport' }, { docName: "Driver's License" }];
    } else {
      this.documentList = [{ docName: 'SSN' }, { docName: 'Government ID' }, { docName: 'Passport' }, { docName: "Driver's License" }];
    }
    if (this.mainForm != undefined) {
      if (this.screeningComponent.componentDocument.length == 0) {
        this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
      this.showInsuff();
      if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
        this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
      }
    }
    if (this.common.componentName === this.common.SSN_TRACE) {
      this.ssnControl = true;
      this.mainForm.get(this.formgroupName + '.ssnNo').setValidators([Validators.minLength(9)]);
    } else if (this.common.componentName == this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS
      || this.common.componentName == this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS) {
      this.criminalcontrol = true;
    } else {
      this.nationCriminalControl = true;
    }

    if (this.common.componentName !== this.common.SSN_TRACE) {
      this.docTypeId = this.mainForm.get(this.formgroupName + '.documentTypeLookupId').value ? this.mainForm.get(this.formgroupName + '.documentTypeLookupId').value : this.docTypeId
      if (this.docTypeId == 0) {
        this.mainForm.get(this.formgroupName + '.idProofNumber').setValidators([Validators.required, Validators.minLength(9)]);
        this.mainForm.get(this.formgroupName + '.issuedBy').clearValidators();
      }
    }
    // this.getName('number');
    // To reuse candidate info in components page for directapp 
    this.candidateInfo = this.common.getCandidateInfo();

    if (this.candidateInfo && this.userData.applicationId === 3) {
      this.mainForm.get(this.formgroupName + '.fullName').setValue(this.candidateInfo.firstName);
      this.mainForm.get(this.formgroupName + '.fatherName').setValue(this.candidateInfo.fatherName);
      if (this.ssnControl) {
        this.mainForm.get(this.formgroupName + '.dob').setValue(this.datePipe.transform(this.candidateInfo.dob, 'dd/MMM/yyyy'));
        if (this.candidateInfo != undefined && this.candidateInfo.uan != null && this.candidateInfo.uan != ""){
          this.mainForm.get(this.formgroupName + '.ssnNo').setValue(this.candidateInfo.uan);
        }        
      }
      else {
        this.mainForm.get(this.formgroupName + '.dateOfBirth').setValue(this.datePipe.transform(this.candidateInfo.dob, 'dd/MMM/yyyy'));
      }
      if (this.candidateInfo != undefined && this.candidateInfo.address != null){
        this.addressBind(this.candidateInfo.address);
      }      
    }
    if (this.userData.applicationId === 3) {
      if (this.common.candidateCountryId !== 92) {
        const ssflag = this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.value;
        if (ssflag == null || ssflag == true) {
          this.nFlag = false;
          // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.clearValidators();
          // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.updateValueAndValidity();
          // this.mainForm.controls[this.formgroupName].get('address.stateId')?.clearValidators();
          // this.mainForm.controls[this.formgroupName].get('address.stateId')?.updateValueAndValidity();
          // this.mainForm.controls[this.formgroupName].get('address.countryId')?.clearValidators();
          // this.mainForm.controls[this.formgroupName].get('address.countryId')?.updateValueAndValidity();
        }
        else {
          this.nFlag = true;
        }
      }
      else {
      this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.setValue(false);
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      this.nFlag = true;
    }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.mainForm != undefined) {
      if (changes.compBaseDetails) {
        this.gapList = this.screeningService.gapVerificationTypeList;
        this.checkAddress();

      }
    }
  }
  CheckDoc(event: any) {
    if (event.value) {
      this.nFlag = false;
      this.ssnFlag = false;
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(true);
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.clearValidators();
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.clearValidators();
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.clearValidators();
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.updateValueAndValidity();
    }
    else {
      this.nFlag = true;
      this.ssnFlag = true;
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.setValidators(Validators.required);
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.setValidators(Validators.required);
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.setValidators(Validators.required);
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.updateValueAndValidity();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].disable();
    }
  }
  getValidorNot() {
    if (this.userData.applicationId == 3 && this.nFlag) {
      if (!this.nFlag && !this.ssnControl) {
        if (this.docTypeId && this.docTypeId != 0) {
          return true
        } else {
          return false;
        }
      } else {
        if (this.nFlag || this.ssnControl) {
          return false
        } else {
          return true;
        }
      }
    } else {
      return true;
    }

  }
  changeDocument(event: any) {
    this.docTypeId = event;
    this.mainForm.get(this.formgroupName + '.issuedBy').setValue('');
    this.mainForm.get(this.formgroupName + '.idProofNumber').setValue('');
    if (this.docTypeId == 0) {
      this.mainForm.get(this.formgroupName + '.idProofNumber').setValidators([Validators.required, Validators.minLength(9)]);
      this.mainForm.get(this.formgroupName + '.issuedBy').clearValidators();
    } else {
      this.mainForm.get(this.formgroupName + '.issuedBy').setValidators([Validators.required]);
      this.mainForm.get(this.formgroupName + '.idProofNumber').setValidators([Validators.required]);
    }
    this.mainForm.get(this.formgroupName + '.issuedBy').updateValueAndValidity();
    this.mainForm.get(this.formgroupName + '.idProofNumber').updateValueAndValidity()
  }
  getName(column: any) {
    let name;
    if(this.common.candidateCountryId === 92) {
     if (column == 'number') {
      switch (this.mainForm.get(this.formgroupName + '.documentTypeLookupId').value) {
        case 0:
          {
            name = 'Government ID Number';
            break;
          }
        case 1:
          {
            name = 'Passport Number';
            break;

          }
        case 2:
          {
            name = "Driver’s License Number";
            break;
          }
      }
    } else {
      switch (this.docTypeId) {
        case 0:
          {
            name = 'Issuing Agency Name';
            break;
          }
        case 1:
          {
            name = 'Issuing Country Name';
            break;

          }
        case 2:
          {
            name = "Issuing Authority Name ";
            break;
          }
      }
    }
    } else {
      if (column == 'number') {
      switch (this.mainForm.get(this.formgroupName + '.documentTypeLookupId').value) {
        case 0:
          {
            name = 'SSN Number';
            break;
          }
        case 1:
          {
            name = 'Government ID Number';
            break;
          }
        case 2:
          {
            name = 'Passport Number';
            break;

          }
        case 3:
          {
            name = "Driver’s License Number";
            break;
          }
      }
    } else {
      switch (this.docTypeId) {
        case 1:
          {
            name = 'Issuing Agency Name';
            break;
          }
        case 2:
          {
            name = 'Issuing Country Name';
            break;

          }
        case 3:
          {
            name = "Issuing Authority Name ";
            break;
          }
      }
    }
    }

    return name
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
    addressBind(data: any) {
      if(data!=undefined){
       this.address.next(data)
      }
    }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  handleDateChange(date, controlName) {
    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value, controlName);
  }
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
  }
  showInsuff() {
    if (this.userData.applicationId === 1) {
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
    this.nFlag = true;
  }

}
