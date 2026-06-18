import { Component, OnInit, SimpleChanges, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-abroad',
  templateUrl: './abroad.component.html',
  styleUrls: ['./abroad.component.css']
})
export class AbroadComponent implements OnInit, OnChanges {

  @Input() compAddress: any;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() componentName: string;
  address = new BehaviorSubject(null);
  nFlag = false;
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
  docTypeId: number = 0;
  documentList: any;
  constructor(public screeningService: ScreeningService, private cd: ChangeDetectorRef, public common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.showInsuff();
    if (this.common.componentName == this.common.MVR) {
      this.documentList = [{ docName: 'SSN' }, { docName: "Driver's License" }];
    } else {
      this.documentList = [{ docName: 'SSN' }, { docName: 'Government ID' }, { docName: 'Passport' }, { docName: "Driver's License" }];
    }
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    if (this.common.componentName == this.common.SSN_TRACE) {
      this.ssnControl = true;
      this.mainForm.get(this.formgroupName + '.ssnNo').setValidators([Validators.minLength(9)]);
    } else if (this.common.componentName == this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS
      || this.common.componentName == this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS) {
      this.criminalcontrol = true;
    } else {
      this.nationCriminalControl = true;
    }
    this.docTypeId = this.mainForm.get(this.formgroupName + '.documentTypeLookupId').value ? this.mainForm.get(this.formgroupName + '.documentTypeLookupId').value : this.docTypeId
    if (this.docTypeId == 0) {
      this.mainForm.get(this.formgroupName + '.idProofNumber').setValidators([Validators.required]);
      this.mainForm.get(this.formgroupName + '.issuedBy').clearValidators();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compBaseDetails) {
      this.gapList = this.screeningService.gapVerificationTypeList;
      this.checkAddress();
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }

  getValidorNot() {
    if (this.userData.applicationId == 3) {
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
      if (this.docTypeId && this.docTypeId != 0) {
        return true
      } else {
        return false;
      }
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
            name = 'Issuing agency';
            break;
          }
        case 2:
          {
            name = 'Issuing Country';
            break;

          }
        case 3:
          {
            name = "Issuing Authority ";
            break;
          }
      }
    }

    return name
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
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
