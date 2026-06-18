import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { SiteDetail } from 'src/app/common-methods/models/site';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { AddNewComponent } from 'src/app/screening/DynamicComponents/add-new/add-new.component';
import { CommonPreDataComponent } from '../common-pre-data/common-pre-data.component';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-common-education',
  templateUrl: './common-education.component.html',
  styleUrls: ['./common-education.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CommonEducationComponent implements OnInit, OnChanges {
  requiredFlag: boolean;
  Instname: any;
  empvalueId = 0;
  show: boolean;
  @ViewChild('FakeIns', { static: true }) FakeIns: TemplateRef<any>;
  @ViewChild('DateAlertPopUp', { static: true }) DateAlertPopUp;
  @ViewChild('DateAlertPopUp1', { static: true }) DateAlertPopUp1;
  @ViewChild('DateEmptoEduPopUp', { static: true }) DateEmptoEduPopUp;
  InsValue: any;
  screeningComponent = new ScreeningComponentInfo();
  baseInfo: any;
  instnList: any[] = [];
  educationType: any[] = [];
  educationTypeLookupId: number;
  filterInstnList: any[] = [];
  cfilterInstnList: any[] = [];
  instList: any[] = [];
  filterInstList: any[] = [];
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() formArrName: string;
  @Input() fileBtn: boolean;
  @Input() showNotApplicable = false;
  @Input() hiddenInsuff: boolean;
  @Input() compAddress: any;
  @Input() docList: any;
  @Input() predata: any[] = [];
  @Input() invitationFlag = false;
  @Input() ctsFlag = false;
  @Input() isSuspectFlag: boolean;
  docdata: any[] = [];
  address = new BehaviorSubject(null);
  instnKeyup: boolean;
  instKeyup: boolean;
  checked = false;
  userData = new User();
  isTech = false;
  applicationId: number;
  setBlur: boolean;
  showInSuff: boolean;
  setInstBlur: boolean;
  insutionFormGroup: UntypedFormGroup;
  miscHint = { qHint: '(Eg. Hall Ticket No.)', aHint: '(Eg. A3455DR)' };
  instAlertCount: number;
  isFakeInstn: boolean;
  degreeList: any[] = []; // added by salman
  majorFilterList: any[] = [];
  degreeMas: any[] = [];
  degreeKeyup: boolean;
  npReasonList: any[] = [];
  Institution: any[] = [];
  showRemarks = false;
  naFlag = false;
  edutype: any;
  insttype: any;
  nFlag = false;
  reasonForLeavingFalg = false;
  addressWithoutForm: any;
  isFakeEducation: boolean = false;
  addcontrolflag: boolean = false;
  allEmpolymentList: any;
  headerText: string;
  messageText1: string;
  messageName1: any[] = [];
  messageText2: string;
  messageName2: any[] = [];
  messageText3: any[] = [];
  messageName3: any[] = [];
  msg1: string;
  msg3: string;
  msg4: any;
  msg2: any;
  messageText4: any[] = [];
  commonAlertMsg: string;
  sixMonthComment: string;
  commonMessage: string;
  toFlag: boolean = false;
  DEAndDirectAppFalg: boolean;
  docFlag = true;
  multipleEduFlag: boolean = false;
  constructor(public master: MasterService, public screeningService: ScreeningService, public formBuilder: UntypedFormBuilder,
    private cd: ChangeDetectorRef, private dialog: MatDialog, public common: CommonService, public fb: UntypedFormBuilder,
    public datePipe: DatePipe) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.mainForm != undefined) {
        this.baseInfo = this.compBaseDetails;
        this.instnList = this.screeningService.institutionList;
        this.setInstnItems('');
        const instnName = this.mainForm.get(this.formgroupName).get('institutionName')?.value;
        this.mainForm.get(this.formgroupName).get('institutionName')?.setValue(instnName);
        const instData = this.instnList.find(y => (y.name ? y.name.toLowerCase() : y.name) ===
          (instnName ? instnName.toLowerCase() : instnName));
        this.instList = this.screeningService.instituteList;
        if (instData) {

          this.instList = this.screeningService.instituteList.
            filter(x => x.institutionId === (instData.empInsId !== 0 && instData.empInsId));
          this.setInstItems('');
          this.mainForm.get(this.formgroupName).get('instituteName')?.
            setValue(this.mainForm.get(this.formgroupName).get('instituteName')?.value);
        }
        // if (changes.compAddress) {
        //   this.checkAddress();
        // }
        this.setInstItems('');
        this.mainForm.get(this.formgroupName).get('instituteName')?.
          setValue(this.mainForm.get(this.formgroupName).get('instituteName')?.value);
        if (changes.formgroupName) {
          this.addcontrolflag = true;
        }
      }

    }
  }
  // checkAddress() {
  //   this.address.next(this.compAddress);
  //   this.cd.markForCheck();
  //   if (!this.compAddress.postalCode) {
  //     this.mainForm.controls.compRef.get('address')?.get('postalCode')?.clearValidators();
  //     this.mainForm.controls.compRef.get('address')?.get('postalCode')?.updateValueAndValidity();
  //   }
  // }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applicationId = this.userData.applicationId;
    if (this.screeningComponent.componentDocument.length == 0) {
      this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
    }
    this.common.maxmDate();
    this.getUniversity();
    this.getDegreeLkpList();
    this.GetNotProvidedReasonList();
    this.showInsuff();
    if (this.mainForm != undefined) {

      const add = this.mainForm.get(this.formgroupName).get('address')?.value;
      if (add.addressId > 0) {
        this.addressWithoutForm = this.mainForm.get(this.formgroupName).get('address')?.value;
        this.address = new BehaviorSubject(this.mainForm.get(this.formgroupName).get('address')?.value);
        this.address.next(this.mainForm.get(this.formgroupName).get('address')?.value);
      }
      if (this.mainForm.get(this.formgroupName).get('educationType')?.value === 'Other Certification Course') {
        this.edutype = 'Other Certification Course';
      }
      if (this.mainForm.get(this.formgroupName).get('institutionType')?.value === 'Others') {
        this.insttype = 'Others';
      }
      if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
        this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
        this.checked = true;
      }
      this.instnList = this.screeningService.institutionList;
    }
    this.CheckValidatorInsTyp();
    if (this.userData.applicationId === 3) {
      if (this.common.candidateCountryId !== 92) {
        const ssflag = this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.value;
        if (ssflag == null || ssflag == true) {
          this.nFlag = false;
          this.reasonForLeavingFalg = false;
        }
        else {
          this.nFlag = true;
          this.reasonForLeavingFalg = true;
        }
      }
      else {
      this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.setValue(false);
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      this.nFlag = false;
      this.reasonForLeavingFalg = true;
    }
    }
  }

  // VTS2-2023-CRT-0123 , VTS2-2023-CRT-0120 - Edu, Emp overlap and Gap Alert Validation - Start

  // 6 month alert 

  public openDialogEduAlert2() {
    const dialogRef = this.dialog.open(this.DateEmptoEduPopUp, {
      width: '500px',
      disableClose: true
    });
  }
  public setToDateAlertBasedOnEmptoEdu(toDate: any, institueName: any, checkindex: any) {
    if (this.common.allEmpComponent != undefined) {
      this.messageText2 = '';
      let index = this.common.allEmpComponent.length - 1;

       if(this.screeningService.ClientCategoryId !== 2){
       let findEduList = this.screeningService.componentList.filter(l => l.compId === 15);
       let NoOfCount = findEduList[0].noOfComponent;
       this.DEAndDirectAppFalg = (NoOfCount === checkindex) ? true : false;
      }
      //let lastIndex = this.common.allEduComponent.length + 1;
      if ((this.DEAndDirectAppFalg) && (toDate != null && this.common.allEmpComponent[index].compRef.fromDate != null)) {
        let tDate1 = new Date(''); tDate1 = new Date(toDate);
        let fDate1 = new Date(''); fDate1 = new Date(this.common.allEmpComponent[index].compRef.fromDate);
        const timeDiff = fDate1.getTime() - tDate1.getTime();
        const diffInMonths = timeDiff / (1000 * 3600 * 24 * 30);
        if (diffInMonths > 6) {
          this.headerText = 'Alert !',
            this.msg1 = 'There is gap more than 6 months between '; this.msg2 = institueName;
          this.msg3 = ' and '; this.msg4 = this.common.allEmpComponent[index].compRef.employerName;
          this.messageText2 = 'There is gap more than 6 months between ' + ' - ' + institueName + ' And ' + this.common.allEmpComponent[index].compRef.employerName + ' ';
          this.openDialogEduAlert2();
        }
      }
    }
    this.getcommonAlert();
  }
  // public setfromDateAlertBasedOnEmptoEdu(fromDate: any,institueName: any,checkindex: any) {
  //   if (this.common.allEmpComponent != undefined) {
  //     this.messageText2 = '';
  //     let index = this.common.allEmpComponent.length - 1;
  //     let lastIndex = this.allEducationList.length;
  //     if (lastIndex === checkindex) {
  //       let fDate1 = new Date(''); fDate1 = new Date(fromDate);
  //       let tDate1 = new Date(''); tDate1 = new Date(this.common.allEmpComponent[index].compRef.toDate);

  //       const timeDiff = tDate1.getTime() - fDate1.getTime();
  //       const diffInMonths = timeDiff / (1000 * 3600 * 24 * 30);
  //       if (diffInMonths > 1) {
  //         this.headerText = 'Alert !',
  //         this.msg1 = 'There is gap more than 6 moths between ';this.msg2 = institueName;
  //         this.msg3 = ' and '; this.msg4 = this.common.allEmpComponent[index].compRef.employerName;
  //         this.messageText2 = 'There is gap more than 6 moths between ' + ' ' + institueName + ' And ' + this.common.allEmpComponent[index].compRef.employerName;
  //         this.openDialogEduAlert2();
  //       }
  //     }

  //   }
  // }
  //end
  //overlap
  public setToDateAlert(toDate: any, institueName: any, checkindex: any) {
    if (this.screeningService.ClientCategoryId !== 2) {
      if (this.common.allEmpComponent != undefined) {
        this.messageName1 = [];
        this.messageText4 = [];
        this.toFlag = false;
        this.common.allEmpComponent.forEach((ele, indexs) => {

          let findIndex : number = 0;
            findIndex = checkindex -1;
            if(findIndex !== indexs){

          if ((ele.compRef.fromDate != null && ele.compRef.toDate != null) || (ele.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided' && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided') ||
            (ele.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') != 'n/a' && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') != 'n/a')) {
            ele.compRef.toDate = (ele.compRef.toDate != null && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') == 'tilldate') ? this.datePipe.transform(new Date(), 'dd/MMM/yyyy') : ele.compRef.toDate;
            let tDate1 = new Date(''); tDate1 = new Date(toDate);
            let tDate2 = new Date(''); tDate2 = new Date(ele.compRef.toDate);
            let fDate1 = new Date(''); fDate1 = new Date(ele.compRef.fromDate);
            if (tDate1 < tDate2 && tDate1 > fDate1) {
              this.headerText = 'Alert !',
                this.messageName1.push(ele.compRef.employerName);
              this.messageText1 = 'There is overlap between this institution and the ' + ((this.messageName1.length > 1) ? ' employers ' : ' employer ');
              this.toFlag = true;
              this.openDialogAlert1(toDate, institueName, checkindex);
            } else {
              this.setToDateAlertBasedOnEmptoEdu(toDate, institueName, checkindex);
            }
          } }
          else {
            this.setToDateAlertBasedOnEmptoEdu(toDate, institueName, checkindex);
          }
        })
        if (this.messageText1 != undefined) {
          this.messageText4.push(this.messageText1 + ' - ' + this.messageName1.join(', '));
        }
      } else {
        this.setToDateAlertBasedOnEmptoEdu(toDate, institueName, checkindex);
      }
    }
  }
  public setfromDateAlert(fromDate: any,checkindex: any) {
    if (this.screeningService.ClientCategoryId !== 2) {
      if (this.common.allEmpComponent.length > 0) {
        this.messageName2 = [];
        this.messageText3 = [];
        this.common.allEmpComponent.forEach((ele, indexs) => {
          let findIndex : number = 0;
            findIndex = checkindex -1;
            if(findIndex !== indexs){
          if ((ele.compRef.fromDate != null && ele.compRef.toDate != null) || (ele.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided' && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided') ||
            (ele.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') != 'n/a' && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') != 'n/a')) {
            ele.compRef.toDate = (ele.compRef.toDate != null && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') == 'tilldate') ? this.datePipe.transform(new Date(), 'dd/MMM/yyyy') : ele.compRef.toDate;
            let fDate1 = new Date(''); fDate1 = new Date(fromDate);
            let fDate2 = new Date(''); fDate2 = new Date(ele.compRef.fromDate);
            let tDate1 = new Date(''); tDate1 = new Date(ele.compRef.toDate);
            if (fDate1 > fDate2 && fDate1 < tDate1) {
              this.headerText = 'Alert !',
                this.messageName2.push(ele.compRef.employerName);
              this.messageText1 = 'There is overlap between this institution and the ' + ((this.messageName2.length > 1) ? ' employers ' : ' employer ');
              this.openDialogAlert2();
            }
          }}
        })
        if (this.messageText1 != undefined) {
          this.messageText3.push(this.messageText1 + ' - ' + this.messageName2.join(', '));
        }
      }
      this.getcommonAlert();
    }
  }
  public openDialogAlert1(Date?: any, institueName?: any, checkindex?: any, toFlag?: boolean) {
    const dialogRef = this.dialog.open(this.DateAlertPopUp, {
      width: '500px',
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (toFlag) {
          this.setToDateAlertBasedOnEmptoEdu(Date, institueName, checkindex)
        }
      });
    }
  }
  public openDialogAlert2() {
    const dialogRef = this.dialog.open(this.DateAlertPopUp1, {
      width: '500px',
      disableClose: true
    });
  }

  getcommonAlert() {
    this.commonAlertMsg = '';
    this.sixMonthComment = '';
    this.commonMessage = '';
    this.commonAlertMsg = (this.messageText3 ? this.messageText3.join('-- ') : '') + (this.messageText4 ? this.messageText4.join(', ') : '');
    this.sixMonthComment = this.messageText2 ? this.messageText2 : '';
    // this.commonMessage =  (this.commonAlertMsg ? (this.commonAlertMsg + ', ') : '') + this.sixMonthComment; 
    this.mainForm.get('screeningComponentInfo')?.get('commonAlertMsg')?.setValue(this.commonAlertMsg);
    this.mainForm.get('screeningComponentInfo')?.get('sixMonthComment')?.setValue(this.commonAlertMsg);
    this.mainForm.get('screeningComponentInfo')?.get('eduEmpSixMonthComment')?.setValue(this.sixMonthComment);
  }
  //end

  // VTS2-2023-CRT-0123 , VTS2-2023-CRT-0120 - Edu, Emp overlap and Gap Alert Validation - End

  getDegreeLkpList() {
    if (this.screeningService.degreeList.length > 0) {
      this.degreeList = this.screeningService.degreeList;
      this.degreeMas = this.screeningService.degreeList[0].degreeNameList;
    }
  }
  getUniversity() {
    if (this.screeningService.Institution) {
      this.Institution = this.screeningService.Institution;
    }

  }
  GetNotProvidedReasonList() {
    if (this.screeningService.npReasonList) {
      this.npReasonList = this.screeningService.npReasonList;
    }

  }
  educationDetailName(data: any) {
    if (data > 0) {
      const educationList = this.common.educationType.filter(x => x.lookUpId === data);
      if (educationList.length > 0) {
        this.edutype = educationList[0].lookUpName
        this.mainForm.get(this.formgroupName).get('educationType')?.setValue(educationList[0].lookUpName);
      }
    }
  }
  reasonName(e: any) {
    if (e > 0) {
      const reasonList = this.npReasonList.filter(x => x.lookUpId === e);
      if (reasonList.length > 0) {
        this.mainForm.get(this.formgroupName).get('npReason')?.setValue(reasonList[0].lookUpName);
        if (reasonList[0].lookUpName === 'Others') {
          this.requiredFlag = true;
        } else {
          this.requiredFlag = false;
          this.mainForm.get(this.formgroupName).get('npReason')?.clearValidators();
          this.mainForm.get(this.formgroupName).get('npReason')?.updateValueAndValidity();
          this.mainForm.get(this.formgroupName).get('npRemarks')?.setValue('');
          this.mainForm.get(this.formgroupName).get('npRemarks')?.clearValidators();
          this.mainForm.get(this.formgroupName).get('npRemarks')?.updateValueAndValidity();

        }
      }
    } else {
      this.requiredFlag = false;
      this.mainForm.get(this.formgroupName).get('npReason')?.setValue('');

    }
  }
  handleDateChange(dar, controlName) {
    if (controlName !== 'courseStart') {
      this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-US').transform(dar.value, 'dd/MMM/yyyy'));
      this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value, controlName);
      this.touchValidation(dar.value, controlName);
      this.mainForm.get(this.formgroupName).get('npReasonLookupId')?.clearValidators();
      this.mainForm.get(this.formgroupName).get('npReasonLookupId')?.updateValueAndValidity();
      this.mainForm.get(this.formgroupName).get('npRemarks')?.clearValidators();
      this.mainForm.get(this.formgroupName).get('npRemarks')?.updateValueAndValidity();
    } else {
      this.mainForm.get(this.formgroupName + '.courseStart').setValue(new DatePipe('en-US').transform(dar.value, 'dd/MMM/yyyy'));
      this.upperCase(this.mainForm.get(this.formgroupName + '.courseStart').value, controlName);
      this.touchValidation(dar.value, controlName);
    }
  }
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
    if (val.includes('NOT PROVIDED') && controlName) {
      this.mainForm.get(this.formgroupName).get(controlName).setValue('Not Provided');
    }
  }
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      {

        validator: this.common.dateCompareFile('courseCompletion',
          'certificateIssue')
      },
    );
  }
  dateCalca() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      {

        validator: this.common.dateCompareFile('courseStart',
          'courseCompletion')
      },
    );
  }
  dateCalcyear() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      {

        validator: this.common.dateCompareFile('courseStart',
          'yearOfPassing')
      },
    );
  }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('courseCompletion')?.value && val) && (this.mainForm.get(this.formgroupName).get('yearOfPassing')) &&
      this.mainForm.get(this.formgroupName).get(controlName).value < this.mainForm.get(this.formgroupName).get('courseCompletion')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
    }
  }
  get anReasonShow(): boolean {
    const fromdate = this.mainForm.get(this.formgroupName + '.courseCompletion').value;
    const toDate = this.mainForm.get(this.formgroupName + '.certificateIssue').value;
    const showflag = this.invitationFlag ? ((fromdate ? fromdate.toUpperCase() : '') === 'NOT PROVIDED') ||
      ((toDate ? toDate.toUpperCase() : '') === 'NOT PROVIDED') ? true : false : false;
    if (!showflag) {
      this.mainForm.get(this.formgroupName + '.npReasonLookupId').setValue('');
      this.mainForm.get(this.formgroupName + '.npReason').setValue('');
      this.mainForm.get(this.formgroupName + '.npReasonLookupId').clearValidators();
    }
    return showflag;
  }
  get pursuinglable(): boolean {
    const npRason = this.mainForm.get(this.formgroupName + '.npReasonLookupId').value;
    if (this.npReasonList.length > 0) {
      const toDate = this.npReasonList.find(f => f.lookUpId === npRason);
      this.common.showLable = toDate ? toDate.lookUpName.toUpperCase() === 'PURSUING' || 'BACK-LOGS' || 'DISCONTINUED' || 'RESULTS AWAITED' || 'OTHERS' ? true : false : false;
      this.common.showHint = toDate ? toDate.lookUpName.toUpperCase() === 'PURSUING' ? true : false : false;
    }
    return this.common.showLable;
  }


  get otherReasonShow(): boolean {
    const npRason = this.mainForm.get(this.formgroupName + '.npReasonLookupId').value;
    if (this.npReasonList.length > 0) {
      const toDate = this.npReasonList.find(f => f.lookUpId === npRason);
      this.showRemarks = toDate ? toDate.lookUpName.toUpperCase() === 'OTHERS' ? true : false : false;
      if (!this.showRemarks) {
        this.mainForm.get(this.formgroupName + '.npRemarks').setValue('');
      }
    }
    return this.showRemarks;
  }
  disableAddByInstn() {
    const instnName = this.mainForm.get(this.formgroupName).get('institutionName')?.value;
    if (instnName) {
      const instData = this.instnList.find(y => y.name.toLowerCase() === instnName.toLowerCase());
      if (instData) {
      } else {
        this.mainForm.get(this.formgroupName).get('address')?.enable();
      }
    } else {
      this.mainForm.get(this.formgroupName).get('address')?.enable();
      this.mainForm.get(this.formgroupName).get('address')?.reset();
      this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(0);
    }
  }
  getAddressForm(): UntypedFormGroup {

    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  getName(option: any) {

    return (option.address.addressId === this.screeningService.defaultAddressId) ? option.name + '  | Not Provided ' : option.name + '  |  ' + option.address.country + ' | ' + option.address.state + ' | ' + option.address.district;
  }
  instnkeyUpFunction(event, value) {

    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterInstnList.filter(e =>
          e.name.toLowerCase() === value.toLowerCase() || e.address.state.toLowerCase() === value.toLowerCase()
            || e.address.district ? e.address.district.toLowerCase() : '' === value.toLowerCase());
        if (data.length > 0) {
          this.instnKeyup = true;

        } else {
          this.instnKeyup = true;
          this.instList = [];
          this.mainForm.get(this.formgroupName).get('instituteName')?.setValue('');
        }
      } else {
        this.instnKeyup = false;
        this.instnList.find(x => x.empInsId);
        this.instList = [];
        this.mainForm.get(this.formgroupName).get('instituteName')?.setValue('');
      }
      this.disableAddByInstn();

    }
  }
  get displayInstnFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterInstnList && this.filterInstnList.length > 0) {
          data = this.instnList.find(x => x.name === data);
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

  setInstnItems(value: any) {
    if (!value) { this.assignInstnResourceCopy(); }
    if (value) {
      this.filterInstnList = Object.assign([], this.instnList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          item.address.state.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }
    if (!this.mainForm.get(this.formgroupName).get('institutionName')?.value) {
      this.addressWithoutForm = null;
    }
  }


  assignInstnResourceCopy() {
    this.filterInstnList = Object.assign([], this.instnList);
  }
  instkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterInstList.filter(e =>
          e.instituteName.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.instKeyup = true;
        } else {
          this.instKeyup = true;
        }
      } else {
        this.instKeyup = false;
      }
    }
    this.empvalueId = 0;
  }
  get displayInstFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterInstList && this.filterInstList.length > 0) {
          data = this.instList.find(x => x.instituteName === data);
          if (data === undefined) {
            return null;
          }
          return data.instituteName;
        } else {
          return null;
        }
      }
    };
    return dataNew;
  }
  getInput(value: any) {
    if (value && value.length >= 4) {
      this.GetInstitutionInfo(value);
    } else if (value === '') {
      this.addressWithoutForm = null;
      this.GetInstitutionInfo(value);
    } else {
      this.setInstItems(value);
    }
  }

  setInstItems(value: any) {

    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.filterInstnList = Object.assign([], this.instList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          item.address.state.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }
  }
  assignResourceCopy() {
    this.filterInstList = Object.assign([], this.instList);
  }
  CheckValidatorInsTyp() {
    if (this.screeningService.instypflag === true) {
      this.mainForm.get(this.formgroupName).get('universityTypeLookupId')?.clearValidators();
      this.mainForm.get(this.formgroupName).get('universityTypeLookupId')?.updateValueAndValidity();
    }
  }

  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
    }
    else {
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

  public openDialog(msg: string, header: string, type: string) {
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
        if (!result && header === 'Confirmation' && type === 'Institution') {
          this.mainForm.get(this.formgroupName).get('institutionName')?.setValue('');
          this.getStatusDetails('genuine');
        } else if (result && msg.startsWith('Do you want to get approval for') && !this.isFakeInstn) {
          this.getStatusDetails('fake');
        }
      });
    }
  }
  changeInstitution() {
    setTimeout(() => {
      const instnName = this.mainForm.get(this.formgroupName).get('institutionName')?.value;
      this.InsValue = this.mainForm.get(this.formgroupName).get('institutionName')?.value;
      if (instnName && this.applicationId === 3) {
        // const insObj = this.instnList.find(x => x.name.trim().toLowerCase() ===
        // this.mainForm.get(this.formgroupName).get('institutionName')?.value.trim().toLowerCase());
        const insObj = this.instnList.find(x => x.address.addressId ===
          this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.value);
        if (this.instnList.filter(x => x.name.trim().toLowerCase() === instnName.trim().toLowerCase()).length === 1 && insObj) {
          this.empvalueId = insObj.empInsId;
          if (insObj.address) {

            this.addressWithoutForm = insObj.address;
            this.address = new BehaviorSubject(insObj.address);
            this.address.next(insObj.address);
            setTimeout(() => {
              this.mainForm.get(this.formgroupName).get('address')?.setValue(insObj.address)
            }, 50);
          }

        }

      }
      if (instnName && this.applicationId !== 3) {
        let msg = ''; let header = '';
        const insObj = this.instnList.find(x => x.address.addressId ===
          this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.value);
        // const insObj = this.instnList.find(x => x.name.toLowerCase() ===
        //   this.mainForm.get(this.formgroupName).get('institutionName')?.value.toLowerCase());

        if (insObj && this.instAlertCount > 0) {
          this.setInstnName(insObj.empInsId, insObj.address.addressId, insObj.empInsAddressId);
          this.instAlertCount = 1;
        }

        if (insObj && this.instAlertCount === 0) {
          if (insObj.researchResultLookupName === 'Fake' && insObj.address.country === 'India' && !this.screeningService.forResearchByPassFlag) {
            this.instAlertCount++;
            this.isFakeInstn = true;
            msg = 'Institution name is matching with Fake Institution list.';
            header = 'Alert';
            this.openDialog(msg, header, 'Institution');
            this.getStatusDetails('genuine');
          } else if ((insObj.researchStatus != this.common.VERIFIEDNUM && !this.screeningService.forResearchByPassFlag) && insObj.address.country === 'India') {
            this.isFakeEducation = true;
            let educationForm = this.mainForm.get('compRef') as UntypedFormGroup;
            if (this.isSuspectFlag) {
              educationForm.addControl('isClientSuspectFlag', new UntypedFormControl(true))
            }
            if (insObj.researchStatus != this.common.VERIFIEDNUM) {
              this.instAlertCount++;
              msg = 'Institution name is under research verification process.';
              header = 'Alert';
              this.openDialog(msg, header, 'Institution');
              this.getStatusDetails('fake');
              this.isFakeInstn = false;
            }

          } else {
            this.isFakeEducation = false;
            let educationForm = this.mainForm.get('compRef') as UntypedFormGroup;
            if (this.isSuspectFlag) {
              educationForm.removeControl('isClientSuspectFlag')
            }
            this.getStatusDetails('genuine');
            this.isFakeInstn = false;
          }
          this.instList = this.screeningService.instituteList.filter(x => x.institutionId === insObj.empInsId);
          this.setInstItems('');
        } else {
          if (instnName.trim() !== '' && !insObj) {
            this.mainForm.get(this.formgroupName).get('institutionName')?.setErrors({ notmatch: true });
            this.mainForm.get(this.formgroupName).get('address')?.reset();
            this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(0);
          }
        }
      }
      else {
        this.isFakeEducation = false;
        let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
        if (this.isSuspectFlag) {
          employmentForm.removeControl('isClientSuspectFlag')
        }
      }
    }, 300);

  }
  setInstnName(empInsId, addressId, empInsAddressId) {
    this.setBlur = false;
    this.instAlertCount = 0;
    const instn = this.instnList.find(x => x.empInsId === empInsId && x.address.addressId === addressId && x.empInsAddressId === empInsAddressId);
    if (instn) {
      this.disableAddByInstn();
      this.mainForm.get(this.formgroupName).get('institutionId')?.setValue(instn.empInsId);
      this.mainForm.get(this.formgroupName).get('institutionName')?.setValue(instn.name);
      this.mainForm.get(this.formgroupName).get('empInsAddressId')?.setValue(instn.empInsAddressId);
      this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(addressId);
      if (instn.address) {
        this.addressWithoutForm = instn.address;
        this.address = new BehaviorSubject(instn.address);
        this.address.next(instn.address);
      }

    } else {
      this.mainForm.get(this.formgroupName).get('address')?.enable();
    }
    this.instList = this.screeningService.instituteList.filter(x => x.institutionId === empInsId);
    this.setInstItems('');
  }
  getInstName(value: any) {
    const obj = {
      active: null,
      address: null,
      approveStatusLookupId: 0,
      approveStatusLookupName: "",
      createdUserId: null,
      faculty: null,
      instituteId: 0,
      instituteName: this.mainForm.get(this.formgroupName).get('instituteName')?.value,
      institutionId: 0,
      institutionName: null
    }
    setTimeout(() => {
      const instName = this.mainForm.get(this.formgroupName).get('instituteName')?.value;
      if (instName) {

        const instnName = this.mainForm.get(this.formgroupName).get('institutionName')?.value;
        const instData = this.instnList.find(y => (y.name ? y.name.toLowerCase() : y.name) ===
          (instnName ? instnName.toLowerCase() : instnName));
        if (instData) {
          let msg = ''; let header = '';
          const insObj = this.instList.find(x => x.instituteName.trim().toLowerCase() ===
            this.mainForm.get(this.formgroupName).get('instituteName')?.value.trim().toLowerCase());
          obj.institutionId = instData.empInsId;
          obj.institutionName = instnName;
          if (obj.instituteName.length > 0) {
            if (!this.screeningService.instituteList.some(s => s.instituteName === obj.instituteName)) {
              this.screeningService.instituteList.push(obj);
            }
            if ((!this.screeningService.instituteList.some(s => s.instituteName === obj.instituteName)) &&
              (!this.screeningService.newCollegeList.some(s => s.instituteName === obj.instituteName))) {
              this.screeningService.newCollegeList.push(obj);
            }
          }
          if (this.applicationId !== 3) {

            if (insObj) {
              if (insObj.approveStatusLookupName === 'Reject' && insObj.address.country === 'India') {
                msg = 'Institute name is matching with rejected institute list.';
                header = 'Alert';
              } else if (insObj.ResearchStatus != this.common.VERIFIED && insObj.address.country === 'India') {
                msg = 'Institute name is under research verification process.';
                header = 'Alert';
                this.getStatusDetails('fake');
              }
              this.instList = this.screeningService.instituteList.filter(x => x.instituteId === insObj.instituteId);
              this.setInstItems('');
            } else {
              if (!insObj && instName.trim() !== '') {
                msg = 'Do you want to get approval for ' + instName + ' ?';
                header = 'Confirmation';
              }
            }
          }
        }
      }
    }, 300);
  }
  setInstName(instituteId: any) {
    this.setInstBlur = false;

    const inst = this.instList.find(x => x.instituteId === instituteId);
    if (inst) {
      this.mainForm.get(this.formgroupName).get('instituteName')?.setValue(inst.instituteName);
    }
  }

  checkevent(id, val) {
    this.common.selectedIteams = id
  }

  getStatusDetails(type: any) {
    const formValue = this.mainForm.getRawValue();
    if (type === 'fake' && !this.screeningService.forResearchByPassFlag) {
      if (formValue.screeningComponentInfo.screeningCompId === 0) {
        const statusId = this.baseInfo.deScreeningStatus.find(x => x.screeningStatus.toLowerCase() === 'for research').statusId;
        this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
      } else {
        const statusId = this.baseInfo.screeningStatus.find(x => x.screeningStatus.toLowerCase() === 'for research').statusId;
        this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
      }
    } else {
      if (formValue.screeningComponentInfo.qcRejectFlag === true && this.mainForm.get('screeningComponentInfo.screenStatusId')?.value !== 0 && this.common.instatusId != 2) {
        this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(this.common.instatusId);
      } else if (formValue.screeningComponentInfo.qcRejectFlag !== true) {
        if (this.mainForm.get('screeningComponentInfo.screenStatusId')?.value === 0) {
          const statusId = this.baseInfo.deScreeningStatus.find(x => x.screeningStatus.toLowerCase() === 'open').statusId;
          this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
        } else {
          const statusId = this.baseInfo.screeningStatus.find(x => x.screeningStatus.toLowerCase() === 'open').statusId;
          this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
        }
      }
    }
    this.setInstnItems(this.mainForm.get(this.formgroupName).get('institutionName')?.value)
  }
  createMisc() {
    if (this.mainForm.contains('miscQuestion')) {
      if (this.mainForm.get('miscQuestion')?.value.length === 0) {
        this.mainForm.removeControl('miscQuestion');
      }
    }
    const question = [{
      miscId: 0,
      miscQuestion: '',
      miscAnswer: '',
      defaultQuestionFlag: false,
    }];
    this.mainForm.addControl('miscQuestion', this.common.initMiscForm(question));
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }

  GetInstitutionInfo(value, flag = false) {
    let values1;
    let values2;

    if (flag == true) {
      values1 = this.getPaginationMValues();
    } else {
      this.show = true;
      values2 = this.getPaginationValues(value);
    }

    this.screeningService.GetInstitutioInfo(flag == true ? values1 : values2).subscribe(resp => {
      if (resp) {
        this.instnList = resp;
        if (this.compBaseDetails != undefined) {
          this.compBaseDetails.institutionList = resp;
        }
        if (flag === true) {

          this.mainForm.get(this.formgroupName).get('institutionName')?.setValue(this.instnList[0].name);

        }
      }
      this.show = false;
    });
  }

  getPaginationValues(filter: any) {
    return {
      pageSize: 50,
      page: 1,
      filters: 'name @=' + (filter === null ? '' : filter),
      sorts: '-empInsId',
      applyPaging: true,
      needTotal: true,
      empInsId: 0,
      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false,
      department: this.userData.deptName,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }
  getPaginationMValues() {
    return {
      pageSize: 1,
      page: 1,
      filters: '',
      sorts: '-empInsId',
      empInsId: 0,
      applyPaging: false,
      needTotal: true,

      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false,
      department: this.userData.deptName,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }
  setDegreeName(degName: any) {
    this.mainForm.get(this.formgroupName).get('major')?.setValue('');
    if (degName != null || degName !== '' || degName !== undefined) {
      this.mainForm.get(this.formgroupName).get('degree')?.setValue(degName);
      this.majorFilterList = this.degreeList.filter(e =>
        e.degree.toLowerCase() === degName.toLowerCase());
    }
    if (degName == null || degName === '' || degName === undefined) {
      this.mainForm.get(this.formgroupName).get('major')?.clearValidators();
    }

  }

  setMajorName(mName: any) {
    const degName = this.mainForm.get(this.formgroupName).get('degree')?.value;
    if (degName == null || degName === '' || degName === undefined) {
      return;
    }
    if (mName != null && mName !== '' && mName !== undefined) {
      this.mainForm.get(this.formgroupName).get('major')?.setValue(mName);
    }
  }

  degreekeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.degreeList.filter(e =>
          e.degree.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.degreeKeyup = true;
        } else {
          this.degreeKeyup = true;
        }
      } else {
        this.degreeKeyup = false;
      }
    }
  }

  getDegreeMajorNameNew(value: any) {
    const degName = this.mainForm.get(this.formgroupName).get('degree')?.value;
    const majorName = this.mainForm.get(this.formgroupName).get('major')?.value;
    if (degName === null || degName === '' || degName === undefined) {
      return;
    }
    if (majorName != null && majorName !== '' && majorName !== undefined) {
      setTimeout(() => {
        if (degName && this.applicationId !== 3) {
          let msg = ''; let header = '';
          const degObj = this.degreeList.filter(x => x.degree ? x.degree.trim().toLowerCase() : x.degree === degName.trim().toLowerCase());
          if (degObj.length !== 0) {
            const majorObj = degObj.filter(x => x.major.trim().toLowerCase() === majorName.trim().toLowerCase());
            if (majorObj.length === 0) {
              msg = 'Do you want to get approval for Degree: ' + degName + ' & major: ' + majorName + ' ?';
              header = 'Confirmation';
              this.openEducationDialog(msg, header, 'Education');
            }
          }
          if (degObj.length === 0) {
            msg = 'Do you want to get approval for Degree: ' + degName + ' & major: ' + majorName + ' ?';
            header = 'Confirmation';
            this.openEducationDialog(msg, header, 'Education');
          }
        }
      }, 300);
    }
  }

  public openEducationDialog(msg: string, header: string, type: string) {
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
        if (result) {
        }
        if (!result) {
          this.mainForm.get(this.formgroupName).get('major')?.setValue('');
        }
      });
    }
  }
  getfrm(): UntypedFormGroup {
    return this.insutionFormGroup.get('address') as UntypedFormGroup;
  }
  public openAddNewMasterData() {
    const popupData = {
      action: 'Institution',
      headerText: 'Add New Institution',
      bodyText: 'Institution will goes under research verification process.',
      labelText: 'Institution Name',
      value: this.mainForm.get(this.formgroupName).get('institutionName')?.value
    };
    const dialogRef = this.dialog.open(AddNewComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.Responds != null) {
            this.empvalueId = 1;
            const values = this.getPaginationMValues();
            this.screeningService.GetInstitutioInfo(values).subscribe(resp => {
              this.instnList = resp;
              this.screeningService.institutionList = resp;
              const objins = this.instnList.find(f => f.empInsId === result.Responds.educationEmployerId && f.address != null && f.address.addressId === result.Responds.addressId);
              this.filterInstnList = Object.assign([], this.instnList).find(f => f.empInsId === result.Responds.educationEmployerId && f.address != null && f.address.addressId === result.Responds.addressId);
              this.mainForm.get(this.formgroupName).get('institutionId')?.setValue(objins.empInsId);
              this.mainForm.get(this.formgroupName).get('institutionName')?.setValue(objins.name);
              this.mainForm.get(this.formgroupName).get('empInsAddressId')?.setValue(objins.empInsAddressId);
              this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(objins.address.addressId);
              this.isFakeEducation = true;
              let educationForm = this.mainForm.get('compRef') as UntypedFormGroup;
              if (this.isSuspectFlag) {
                educationForm.addControl('isClientSuspectFlag', new UntypedFormControl(true))
              }
              // this.GetInstitutionInfo(objins.empInsId, true);
              delete objins.address.addressPos;
              delete objins.address.posDuration;
              // this.mainForm.get(this.formgroupName).get('address')?.setValue(objins.address)
              this.addressWithoutForm = objins.address;
              this.address = new BehaviorSubject(objins.address);
              this.address.next(objins.address);

              setTimeout(() => {
                this.mainForm.get(this.formgroupName).get('address')?.setValue(objins.address)
              }, 50);
              if (objins.address.country === 'India') {
                this.getStatusDetails('fake');
              } else {
                this.getStatusDetails('genuine');
              }
            });
          }
        }
      });
    }
  }
  Institutiontype(e: any) {
    if (e > 0) {
      const Institutiontype = this.Institution.filter(x => x.lookUpId === e);
      if (Institutiontype.length > 0) {
        this.insttype = Institutiontype[0].lookUpName
        this.mainForm.get(this.formgroupName).get('institutionType')?.setValue(Institutiontype[0].lookUpName);
      }
    }
  }


  public openDialogdata() {
    const popupData = {
      action: 'Education',
      headerText: 'Education Pre-Data',
      values: this.predata
    };
    const dialogRef = this.dialog.open(CommonPreDataComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.mainForm.get(this.formgroupName).get('institutionId')?.setValue(result.rowdata.empInsId);
          this.mainForm.get(this.formgroupName).get('institutionName')?.setValue(result.rowdata.name);
          this.mainForm.get(this.formgroupName).get('empInsAddressId')?.setValue(result.rowdata.empInsAddressId);
          this.mainForm.get(this.formgroupName).get('courseCompletion')?.setValue(result.rowdata.fromdate.replace(/\s+/g, ''));
          this.mainForm.get(this.formgroupName).get('certificateIssue')?.setValue(result.rowdata.todate.replace(/\s+/g, ''));
          this.mainForm.get(this.formgroupName).get('yearOfPassing')?.setValue(result.rowdata.todate.replace(/\s+/g, ''));

          if (this.instnList && result.rowdata.employer) {
            this.instnList.find(y => y.name.toLowerCase() === result.rowdata.employer.toLowerCase());
            const objemp = this.instnList.find(x => x.name.toLowerCase() ===
              this.mainForm.get(this.formgroupName).get('institutionName')?.value.toLowerCase());
            if (objemp) {
              this.changeInstitution();
            } else {
              this.openAddNewMasterData();
            }
          }
        }
      });
    }
  }
  assignvalue(value: any) {
    this.InsValue = value;

  }

  Insvalidation(event: any, autoValue) {
    if (event.relatedTarget && event.relatedTarget.tagName === 'MAT-OPTION') {

      return;
    }
    if (autoValue != "" && autoValue != undefined) {
      this.cfilterInstnList = this.instnList.filter(s => s.name == autoValue)
      if (this.filterInstnList.length == 0 || this.cfilterInstnList.length == 0) {
        const dialogRef = this.dialog.open(this.FakeIns, {
          width: '350px',
          disableClose: true
        });
      }

    }

  }
  Inscvalidation() {
    if (this.InsValue != "" && this.InsValue != undefined) {
      this.cfilterInstnList = this.instnList.filter(s => s.name == this.InsValue)

      if (this.filterInstnList.length == 0) {
        const dialogRef = this.dialog.open(this.FakeIns, {
          width: '350px',
          disableClose: true
        });
      }

    }

  }

  validatetype(type: any) {
    if (type == 'okay') {
      this.openAddNewMasterData();

    } else if (type === 'cancel') {
      this.mainForm.get(this.formgroupName).get('institutionName')?.setValue('');
      this.mainForm.get(this.formgroupName).get('instituteName')?.setValue('');
    }
  }
  CheckDoc(event: any) {
    if (event.value) {
      this.nFlag = false;
      this.reasonForLeavingFalg = false;
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(true);
      const compRef = this.mainForm['controls']['compRef']['controls'] as UntypedFormGroup;
      const fields = [
        'universityTypeLookupId', 'institutionId', 'instituteName',
        'registrationNumber', 'certificateIssue', 'gpa'
      ];
      fields.forEach(field => {
        const control = compRef.get(field);
        if (control) {
          control.clearValidators();
          control.setErrors(null);
          control.markAsPristine();
          control.markAsUntouched();
          control.updateValueAndValidity({ emitEvent: false });
        }
      });
    }
    else {
      this.nFlag = true;
      this.reasonForLeavingFalg = true;
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
    }
  }
}

