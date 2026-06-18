import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { AddNewComponent } from '../add-new/add-new.component';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { DatePipe } from '@angular/common';


@Component({
  standalone: false,
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css']
})
export class LicenseComponent implements OnInit, OnChanges {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compAddress: any;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  naFlag = false;
  nFlag = false;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  address = new BehaviorSubject(null);
  userData = new User();
  showInSuff: boolean;
  authCount: number;
  authorityList: any[] = [];
  filterauthorityList: any[] = [];
  authKeyup: boolean;
  applicationId: number;
   constructor(private cd: ChangeDetectorRef, private screeningService: ScreeningService,public fb: UntypedFormBuilder,
    public common: CommonService, private dialog: MatDialog, private master: MasterService ) { }

  ngOnInit() {

    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applicationId = this.userData.applicationId;
    this.authorityList = this.screeningService.issuingAuthorityList;
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.setAuthItems('');
    this.showInsuff();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compAddress) {
      this.checkAddress();
    }
    if (changes.compBaseDetails) {
      this.authorityList = this.screeningService.issuingAuthorityList;
      // }
      this.setAuthItems('');
      this.mainForm.get(this.formgroupName).get('issuingAuthority')?.
        setValue(this.mainForm.get(this.formgroupName).get('issuingAuthority')?.value);
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
      // this.showInSuff = event.checked;
    } else {
      this.showInSuff = false;
    }
    if(this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.value === 0) {
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
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
    { validator: this.common.dateCompareFile('validFrom', 
    'validTo') },
  );
  }
  handleDateChange(dar, controlName) {
      this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-US').transform(dar.value, 'dd/MMM/yyyy'));
      this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value,controlName);
      this.touchValidation(dar, controlName);
    }
    upperCase(val, controlName) {
      val = val.toUpperCase();
      this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
      if(val.includes('NOT PROVIDED') && controlName === "validFrom") {
        this.mainForm.get(this.formgroupName).get('validFrom')?.setValue('Not Provided');
      }
      if(val.includes('NOT PROVIDED') && controlName === "validTo") {
        this.mainForm.get(this.formgroupName).get('validTo')?.setValue('Not Provided');
      }
  
    }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('validFrom')?.value && val) &&
    this.mainForm.get(this.formgroupName).get(controlName).value < this.mainForm.get(this.formgroupName).get('validFrom')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
    }
  }
  keyUpFn(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterauthorityList.filter(e =>
          e.name.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.authKeyup = true;
        } else {
          this.authKeyup = true;
        }
      } else {
        this.authKeyup = false;
      }
    }
  }
  get displayFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterauthorityList && this.filterauthorityList.length > 0) {
          data = this.authorityList.find(x => x.name === data);
          if (data === undefined) {
            return null;
          }
          return data.name;
        } else {
          return null;
        }
      }
    };
    return dataNew;
  }

  // Resource ..
  setAuthItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.filterauthorityList = Object.assign([], this.authorityList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignResourceCopy() {
    this.filterauthorityList = Object.assign([], this.authorityList);
  }

  public openDialog(msg: string, header: string) {
    const popupData = {
      action: header === 'Alert' ? this.common.ALERT : this.common.DELETECONFIRMATION,
      headerText: header,
      bodyText: msg
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (!result && header === 'Confirmation') {
          this.mainForm.get(this.formgroupName).get('issuingAuthority')?.setValue('');
        }
      });
    }
  }
  changeAuthority() {
    setTimeout(() => {
      const issuingAuthority = this.mainForm.get(this.formgroupName).get('issuingAuthority')?.value;
      if (this.applicationId !== 3) {
        let msg = ''; let header = '';
        if (issuingAuthority) {
          const authObj = this.authorityList.find(x => x.name.toLowerCase() ===
            this.mainForm.get(this.formgroupName).get('issuingAuthority')?.value.toLowerCase());
          if (authObj && this.authCount > 0) {
            this.getAuthority(authObj.name);
            this.authCount = 1;
          }
          // if (authObj && this.authCount === 0) {
          //   if (authObj.researchResultLookupName === 'Fake') {
          //     this.authCount++;
          //     msg = 'Employer name is matching with Fake Employer list.';
          //     header = 'Alert';
          //     this.openDialog(msg, header);

          //   } else if (authObj.researchResultLookupName === null || authObj.researchResultLookupId === null) {
          //     this.authCount++;
          //     msg = 'Employer name is under research verification process.';
          //     header = 'Alert';
          //     this.openDialog(msg, header);
          //   }
          // } else {
          if (!authObj && issuingAuthority.trim() !== '') {
            // this.screeningService.tempEmpHrCompList = this.screeningService.tempEmpHrCompList.filter(x => x.empInsId !== 0);
            // this.screeningService.tempEmpHrCompList.push({
            //   address: null,
            //   empInsId: 0,
            //   name: issuingAuthority,
            //   researchResultLookupId: 0,
            //   researchResultLookupName: ''
            // });
            this.mainForm.get(this.formgroupName).get('issuingAuthority')?.setErrors({ notmatch: true });
            this.mainForm.get(this.formgroupName).get('address')?.reset();
            this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(0);
            // msg = 'Do you want to get approval for ' + issuingAuthority + ' ?';
            // header = 'Confirmation';
            // this.openDialog(msg, header);
            // }

          }
          if (this.authorityList.filter(x => x.name.toLowerCase() === issuingAuthority.toLowerCase()).length === 1 && authObj) {
            this.address = new BehaviorSubject(authObj.address);
            this.address.next(authObj.address);
          }
        }
      }
    }, 300);

  }
  getAuthority(authName: any) {
    this.authCount = 0;
    const obj = this.authorityList.find(x => x.name === authName);
    if (obj) {
      this.mainForm.get(this.formgroupName).get('issuingAuthority')?.setValue(obj.name);
      // this.setBlur = true;
      this.address = new BehaviorSubject(obj.address);
      this.address.next(obj.address);
    }
  }
  notProvidevalidation(val: any) {
    if((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('validFrom')?.setErrors({incorrect : true});
    }
    else if((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('validFrom')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('validTo')?.setErrors({incorrect : true});
    }
    else if((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('validTo')?.setErrors(null);
    }
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
  public openAddNewMasterData() {
    // this.initFormGroup();
    const popupData = {
      action: 'License',
      headerText: 'Add Issuing Authority',
      labelText: 'Issuing Authority',
      bodyText: '',
    };
    const dialogRef = this.dialog.open(AddNewComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.Responds > 0) {
            this.master.GetLicenseAuthorityList().subscribe(resp => {
              this.authorityList = resp;
              this.screeningService.issuingAuthorityList = resp;
              // this.instnList = resp; this.screeningService.institutionList = resp;
              const objins = this.authorityList.find(f => f.id === result.Responds);
              this.mainForm.get(this.formgroupName).get('issuingAuthority')?.setValue(objins.name);
              this.address.next(objins.address);
              this.mainForm.get(this.formgroupName).get('address')?.disable();
            });
          }
        }
        if (!result) {
          // this.mainForm.get(this.formgroupName).get('major')?.setValue('');
        }
      });
    }
  }
}
