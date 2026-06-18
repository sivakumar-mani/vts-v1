import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
  filterCodeList: any[] = [];
  phoneCodeList: any[] = [];
  @Input() screeningCandidateDet: UntypedFormGroup;
  @Input() verificationCaseDet: UntypedFormGroup;
  @Input() casePriority: any;
  @Input() verificationForm;
  @Input() clientName: string;
  casePriorityControl = new UntypedFormControl('', Validators.required);
  priorityLookup: any;
  ownerGroup: UntypedFormGroup;
  closedFlag = false;
  employeeDetailsEdit = false;
  address = new BehaviorSubject(null);
  @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;;
  dialogRef: any;
  userData: any;
  maxDate = new Date();
  genderDetails: any[] = [];
  maritalStatus: any[] = [];
  screenAuth:any;
  directorshipPANMandatory = false;
  constructor(private verificationService: VerificationService, private message: MessageService, public dialog: MatDialog,
    public screening: ScreeningService, public common: CommonService ,public authService:AuthService) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 18));
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.common.VERIFICATION_ROUTER);
    this.getGenderDetails();
    this.getMaritlStatus();
    this.getPhoneCodeList();
    this.closedFlag = this.verificationService.closedCheck;
    this.common.birthDate();
    // this.address.next(this.screeningCandidateDet.get('address')?.value);
  }


  updateCandidateDetails() {
    this.screeningCandidateDet.get('createdUserId')?.setValue(this.userData.userId);
    const data = this.screeningCandidateDet.value;
    this.screeningCandidateDet.markAllAsTouched();
    this.screeningCandidateDet.get('address.countryId')?.value === 0 ? this.screeningCandidateDet.get('address.countryId')?.setValue('') :
      this.screeningCandidateDet.get('address.countryId')?.setValue(this.screeningCandidateDet.get('address.countryId')?.value);
    if (this.screeningCandidateDet.value.address.addLine1 || this.screeningCandidateDet.value.address.addLine2
      || this.screeningCandidateDet.value.address.addLine3 || this.screeningCandidateDet.value.address.postalCode) {
      this.screeningCandidateDet.get('address.countryId')?.setValidators(Validators.required);
      this.screeningCandidateDet.get('address.countryId')?.updateValueAndValidity();
    } else {
      this.screeningCandidateDet.get('address.countryId')?.clearValidators();
      this.screeningCandidateDet.get('address.countryId')?.updateValueAndValidity();
    }
    if (this.screeningCandidateDet.valid) {
      if (this.screeningCandidateDet.get('address.countryId')?.value === 0 ||
        this.screeningCandidateDet.get('address.countryId')?.value === '') {
        // this.screeningCandidateDet.get('address')?.setValue(null);
        data.address = null;
      } else {
        data.address.createdUserId = this.userData.userId;
      }
      this.verificationService.updateCandidateDetails(data).subscribe(res => {
        if (res.success) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          if (this.screeningCandidateDet.get('genderLookupId')?.value > 0) {
            const genderList = this.genderDetails.filter(x => x.lookUpId === this.screeningCandidateDet.get('genderLookupId')?.value);
            this.screeningCandidateDet.get('gender')?.setValue(genderList[0].lookUpName);
          }
          if (this.screeningCandidateDet.get('maritalStatusLookupId')?.value > 0) {
            const maritalStatus = this.maritalStatus.filter(x => x.lookUpId === this.screeningCandidateDet.get('maritalStatusLookupId')?.value);
            this.screeningCandidateDet.get('marital')?.setValue(maritalStatus[0].lookUpName);
          }
          if (data.address !== null) {
            this.address.next(this.screeningCandidateDet.get('address')?.value);
          } else {
            this.screeningCandidateDet.get('address')?.patchValue(this.verificationService.tempData.screeningCandidateDet.address);
          }
          // this.screeningCandidateDet.get('address')?.setValue(this.screeningCandidateDet.get('address')?.value);
        }
      }, err => { }, () => {
        this.employeeDetailsEdit = false;
      });
    }
  }
  setSpouseValue(value: any) {
    if(value === this.common.UNMARRIED){
      this.screeningCandidateDet.get('spouseName')?.setValue('');
   }else{
    
   }
 }
  updateCaseDetails(casePriority: any) {
    if (this.casePriorityControl.valid) {
      this.verificationCaseDet.get('casePriorityLookupId')?.setValue(casePriority.lookUpId);
      this.verificationCaseDet.get('casePriorityName')?.setValue(casePriority.lookUpName);
      this.verificationService.updateCaseDetails(this.verificationCaseDet.value).subscribe(res => {
        if (res.success === true) {
          this.dialogClose();
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Case Priority Not Saved');
        }
      }, err => { }, () => {
      });
    }
  }
  getGenderDetails() {
    this.screening.getGenderDetails().subscribe(resp => {
      if (resp) {
        this.genderDetails = resp;
      }
    });
  }
  setCodeItems(value: any) {
    if (!value) { this.assigncodeResourceCopy(); }
    if (value) {
      this.filterCodeList = Object.assign([], this.phoneCodeList).filter(
        item => ((item.country.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assigncodeResourceCopy() {
    this.filterCodeList = Object.assign([], this.phoneCodeList);
  }
  getPhoneCodeList() {
    this.screening.getPhoneCodeList().subscribe(resp => {
      this.screeningCandidateDet.get('alternativeCountryId')?.setValue(92);
      //this.mainForm.get(this.formgroupName).get('alternativeCountryId')?.setValue(92);
      if (resp) {
        this.phoneCodeList = resp;
        this.phoneCodeList.forEach(element => {
          element.country = element.country + ' - ' + element.countryCode;
        });
              }
    });
    this.displayCodeFn;
  }
   get displayCodeFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        data = this.phoneCodeList.find(x => x.countryId === data);
        if (data === undefined) {
          return null;
        }
        return data.countryCode;
      }
    };
    return dataNew;
  }
  codekeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterCodeList.filter(e =>
          e.country.toLowerCase() === value.toLowerCase());
      }
    }
  }
  getMaritlStatus() {
    this.screening.getMaritlStatus().subscribe(resp => {
      if (resp) {
        this.maritalStatus = resp;

      }
    });
  }
  maritalStatusList(e: any) {
    if (e > 0) {
      const maritalList = this.maritalStatus.filter(x => x.lookUpId === e);
      if (maritalList.length > 0) {
        this.screeningCandidateDet.get('maritalStatusLookupId')?.setValue(maritalList[0].lookUpId);
      }
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }


  dialogClose() {
    this.dialogRef.close();
    this.casePriorityControl.setValue(0);
  }

  opendialog() {
    this.dialogRef = this.dialog.open(this.assignPopUp, {
      width: '400px',
      disableClose: true
    });
  }
  bindAddress() {
    this.address.next(this.screeningCandidateDet.get('address')?.value);
  }
  resetCandidate() {
    this.screeningCandidateDet.patchValue(this.verificationService.tempData.screeningCandidateDet);
    this.employeeDetailsEdit = false;
  }

}
