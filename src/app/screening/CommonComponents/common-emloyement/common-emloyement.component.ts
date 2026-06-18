import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild, TemplateRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray, NgForm } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ScreeningComponentInfo, ScreeningDetails } from 'src/app/common-methods/models/screening-details';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { CommonAddNewComponent } from '../common-add-new/common-add-new.component';
import { CommonPreDataComponent } from '../common-pre-data/common-pre-data.component';
import { DatePipe } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { CommonBaseInfoComponent } from '../common-base-info/common-base-info.component';

@Component({
  standalone: false,
  selector: 'app-common-employment',
  templateUrl: './common-emloyement.component.html',
  styleUrls: ['./common-emloyement.component.css']
})
export class CommonEmloyementComponent implements OnInit, OnChanges {
  CFflag = 0;
  Message: any;
  disableFlag: boolean;
  naFlag = false;
  nFlag = false;
  ctcreqFlag = true;
  reasonForLeavingFalg = false;
  docFlag = true;
  insvalueId = 0;
  cfilterInstnList: any[] = [];
  focudMe = false;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() selectedIndex: any;
  @Input() compBaseDetails: any;
  @Input() compAddress: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() showEmpHRSupFields: boolean;
  @Input() predata: any[] = [];
  @Input() supervisorAddress: any;
  @Output() emitFresher = new EventEmitter<any>();
  @Input() invitationFlag = false;
  @Input() currentAddress: any
  @Input() notApplicableBehaviorInput: any;
  @Input() directAppAddressFlag = false;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  address = new BehaviorSubject(null);
  supaddress = new BehaviorSubject(null);
  baseInfo: any;
  empList: any[] = [];
  filterEmpList: any[] = [];
  empKeyup: boolean;
  userData = new User();
  isTech = false;
  showInSuff: boolean;
  showHRSupFieldsFlag = false;
  applicationId: number;
  setBlur: boolean;
  dropdown: any;
  todateReadOnly = false;
  minDate = new Date();
  maxDate = new Date();
  maxDate1 = new Date();
  mininitiationdate = new Date();
  miscHint = { qHint: '(Eg. Company ID.)', aHint: '(Eg. A3455DR)' };
  empAlertCount: number;
  dateofinitiation = new UntypedFormControl();
  countryControls!: AutoCompleteDropDown;
  countryList: any[] = [];
  npReasonList: any[] = [];
  showRemarks = false;
  sameCurrentadd = false;
  displayedColumns = [
    { field: 'action', header: 'Action' },
    { field: 'address', header: 'Address' },
    { field: 'place', header: 'Village/Town' },
    { field: 'district', header: 'District/City' },
    { field: 'state', header: 'State' },
    { field: 'city', header: 'Place/Location/Area' },
    { field: 'country', header: 'Country' },
    { field: 'postalCode', header: 'Zip Code' },
    { field: 'periodOfStay', header: 'period Of Stay From - To' }

  ];
  itemperpage = 10;
  totalpages: number;
  isFakeEmployee: boolean = false;
  @Input() isSuspectFlag: boolean;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  // casePriorities: any[] = [];
  // tooltipName = 'Add Address';
  rowIndex = -1;
  addressForm: UntypedFormGroup;
  periodofStayadd = new BehaviorSubject(null);
  @ViewChild('keeponHold', { static: true }) keeponHold: TemplateRef<any>;
  @ViewChild('OverLabPopUp', { static: true }) OverLabPopUp: TemplateRef<any>;
  @ViewChild('FakeEmp', { static: true }) FakeEmp: TemplateRef<any>;
  @ViewChild(CommonBaseInfoComponent) baseComp: CommonBaseInfoComponent;
  @ViewChild('DateAlertPopUp', { static: true }) DateAlertPopUp;
  @ViewChild('DateAlertPopUp1', { static: true }) DateAlertPopUp1;
  @ViewChild('DateEmpAlertPopUp', { static: true }) DateEmpAlertPopUp;
  @ViewChild('DateEduPopUp', { static: true }) DateEduPopUp;
  addressWithoutForm: any;
  screeningDetails1 = new ScreeningDetails();
  addcontrolflag: boolean;
  allEmpolymentList: any[] = [];
  dialogRef: any;
  headerText: string;
  messageText1: string;
  messageName1: any[] = [];
  messageText2: string;
  messageName2: any[] = [];
  messageText3: any[] = [];
  messageName3: any[] = [];

  emp1: any;
  EmpfromDate: any;
  CompName: any;
  EmpIndex: any;
  msg1: string;
  msg2: any;
  msg3: string;
  msg4: any;
  commonAlertMsg: string;
  messageText: string;
  messageTextEmptoEdu: any;
  messageTextEmptoEmp: any;
  sixMonthComment: any;
  commonMessage: string;
  messageText4: any[] = [];
  messageTextfrom1: any[] = [];
  messageTextfrom2: any[] = [];
  messageTextto1: any[] = [];
  messageTextto2: any[] = [];


  fromDateCommonAlert: string;
  toDateCommonAlert: string
  fromDateCommonAlertForGap: string
  fromFlag: boolean = false;
  fromflag1: boolean = false;
  toFlag: boolean = false;
  eduEmpSixMonthComment: string;
  DEAndDirectAppFalg: boolean = false;
  multipleEmpFlag: boolean = false;
  ;
  constructor(public screeningService: ScreeningService, public fb: UntypedFormBuilder,
    public dialog: MatDialog, public common: CommonService, private cd: ChangeDetectorRef, private message: MessageService,
    private master: MasterService, public datePipe: DatePipe) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear()));
    this.maxDate1 = new Date(this.maxDate1.setMonth(this.maxDate1.getMonth() + 3));
    this.minDate = new Date(this.minDate.setFullYear(this.minDate.getFullYear() - 100));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mainForm != undefined) {
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value === true && this.applicationId == 3) {
        // this.addressForm.disable();
        this.disableFlag = true;
      }
      else if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value != true && this.mainForm.get('compRef')?.get('fresherFlag')?.value != true && this.applicationId == 3) {
        this.addressForm.enable();
        this.disableFlag = false;
      }

      if (changes.compAddress) {
        this.checkAddress();
      }
      if (changes.notApplicableBehaviorInput) {
        this.notApplicableBehavior(changes.notApplicableBehaviorInput.currentValue.value);

      }
      if (changes.supervisorAddress) {
        this.checksupervisorAddress();
      }
      if (changes.compBaseDetails) {
        if (this.compBaseDetails) {
          this.baseInfo = this.compBaseDetails;
          this.dropdown = this.screeningService.EmpaddressTypelst ? this.screeningService.EmpaddressTypelst.filter(s => s.lookUpName == 'New Address') : [];
          this.empList = this.screeningService.employerList;
          this.setEmpItems('');
          this.mainForm.get(this.formgroupName).get('employerName')?.
            setValue(this.mainForm.get(this.formgroupName).get('employerName')?.value);
        }
      }
      if (changes.formgroupName) {
        this.addcontrolflag = true;
      }
    }
  }
  notApplicableBehavior(event: any) {
    if (event) {
      if (this.baseComp && this.mainForm.get('screeningComponentInfo.compIndex')?.value && this.mainForm.get('screeningComponentInfo.compIndex')?.value > 1) {
        this.baseComp.notApplicable(event);
      }
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  checksupervisorAddress() {
    this.supaddress.next(this.supervisorAddress);
    this.cd.markForCheck();
  }
  ngOnInit() {
    if (this.mainForm != undefined) {
      if (this.userData.applicationId == 3) {
        this.screeningService.compData = { compName: "Address" }
      }
      if (this.screeningComponent.componentDocument.length == 0) {
        this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
      this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.CFflag = this.mainForm.get('screeningComponentInfo.compIndex')?.value
      this.applicationId = this.userData.applicationId;
      this.showHRSupFields();
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value === true && this.applicationId == 3) {
        // this.addressForm.disable();
        this.disableFlag = true;
      }
      this.fresherFlagMethod(this.mainForm['controls']['compRef']['controls']['fresherFlag'].value);
      this.empList = this.screeningService.employerList;
      if (this.screeningService.caseFlag != true || this.userData.applicationId === 3) {
        this.countryControls =
          new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
            '', this.mainForm.get('compRef.supervisorDet') as UntypedFormGroup, false, false, false);
        this.getCountryList();
      }


      if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
        this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
      }
      const add = this.mainForm.get(this.formgroupName).get('address')?.value;

      if (add.addressId > 0) {
        this.addressWithoutForm = this.mainForm.get(this.formgroupName).get('address')?.value;

        this.address = new BehaviorSubject(this.mainForm.get(this.formgroupName).get('address')?.value);
        this.address.next(this.mainForm.get(this.formgroupName).get('address')?.value);

      }

      this.initcompref();
      this.showInsuff();

      this.chengeCurrentEmp();


    }
    if (this.userData.applicationId === 3) {
      if (this.common.candidateCountryId !== 92) {
        const ssflag = this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.value;
        if (ssflag == null || ssflag == true) {
          this.nFlag = false;
          this.reasonForLeavingFalg = true;
          this.ctcreqFlag = true;
        }
        else {
          this.nFlag = true;
          this.ctcreqFlag = false;
          this.reasonForLeavingFalg = false;
        }
      }
      else {
      this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.setValue(false);
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      this.nFlag = false;
      this.reasonForLeavingFalg = false;
      this.ctcreqFlag = true;
    }
    }
  }

  // VTS2-2023-CRT-0123 , VTS2-2023-CRT-0120 - Edu, Emp overlap and Gap Alert Validation - Start

  //6 month gap alert

  public openDialogEmpAlert1() {
    const dialogRef = this.dialog.open(this.DateEmpAlertPopUp, {
      width: '500px',
      disableClose: true
    });
  }
  public openDialogEduAlert2() {
    const dialogRef = this.dialog.open(this.DateEduPopUp, {
      width: '500px',
      disableClose: true
    });
  }

  setfromDateEmpAlert(fromDate: any, CompanyName: any, checkindex: any) {
    if (this.allEmpolymentList.length > 0) {
      let index = checkindex - 2;
      let index22 = this.allEmpolymentList[index]
      if (this.allEmpolymentList[index].compRef.fromDate != null && this.allEmpolymentList[index].compRef.toDate != null) {
        this.messageTextEmptoEmp = '';
        this.allEmpolymentList[index].compRef.toDate = (this.allEmpolymentList[index].compRef.toDate != null && this.allEmpolymentList[index].compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') == 'tilldate') ? this.datePipe.transform(new Date(), 'dd/MMM/yyyy') : this.allEmpolymentList[index].compRef.toDate;

        let fDate1 = new Date(''); fDate1 = new Date(fromDate);
        let fDate2 = new Date(''); fDate2 = new Date(this.allEmpolymentList[index].compRef.fromDate);
        let tDate1 = new Date(''); tDate1 = new Date(this.allEmpolymentList[index].compRef.toDate);
        const timeDiff = tDate1.getTime() - fDate1.getTime();
        const diffInMonths = timeDiff / (1000 * 3600 * 24 * 30);

        if (diffInMonths > 6) {
          this.headerText = 'Alert !',
          this.emp1 = this.allEmpolymentList[index].compRef.employerName;
          this.msg1 = 'There is gap more than 6 months between this employer '; this.msg4 = this.emp1;
          this.msg3 = ' and the previous employer '; this.msg2 = CompanyName;
          this.messageTextEmptoEmp = 'There is gap more than 6 months between this employer' + ' - ' + CompanyName + ' and the previous employer' + ' ' + this.emp1 + ' ';
          this.openDialogEmpAlert1();
        }
      }
    }

  }

  public setfromDateAlertBasedOnEdutoEmp(fromDate: any, CompanyName: any, Lindex: any) {
    this.EmpfromDate = fromDate;
    this.CompName = CompanyName;
    this.EmpIndex = Lindex;
    if (this.common.allEduComponent != undefined) {
      this.messageTextEmptoEdu = '';
      let index = this.common.allEduComponent.length - 1;
      if(this.screeningService.ClientCategoryId === 3){
        let lastIndex = this.allEmpolymentList.length + 1;
        this.DEAndDirectAppFalg = (lastIndex === Lindex) ? true : false;
      }
      else if(this.screeningService.ClientCategoryId !== 3 && this.screeningService.ClientCategoryId !== 2){
       let findEmpList = this.screeningService.componentList.filter(l => l.compId === 18);
       let NoOfCount = findEmpList[0].noOfComponent;
       this.DEAndDirectAppFalg = (NoOfCount === Lindex) ? true : false;
      }
      //let lastIndex = this.allEmpolymentList.length + 1;
      if ((this.DEAndDirectAppFalg) && (fromDate != null && this.common.allEduComponent[index].compRef.courseCompletion != null)) {
        let fDate1 = new Date(''); fDate1 = new Date(fromDate);
        let tDate1 = new Date(''); tDate1 = new Date(this.common.allEduComponent[index].compRef.courseCompletion);

        const timeDiff = fDate1.getTime() - tDate1.getTime();
        const diffInMonths = timeDiff / (1000 * 3600 * 24 * 30);
        if (diffInMonths > 6) {
          this.headerText = 'Alert !',
            this.msg1 = 'There is gap more than 6 months between '; this.msg2 = CompanyName;
          this.msg3 = ' And '; this.msg4 = this.common.allEduComponent[index].compRef.institutionName;
          this.messageTextEmptoEdu = 'There is gap more than 6 months between' + ' - ' + CompanyName + ' And ' + this.common.allEduComponent[index].compRef.institutionName + ' ';
          this.openDialogEduAlert2();
        }
        else {
          this.setfromDateEmpAlert(fromDate, CompanyName, Lindex)
        }
      }
      else {
        this.setfromDateEmpAlert(fromDate, CompanyName, Lindex)
      }
    }
    else {
      this.setfromDateEmpAlert(fromDate, CompanyName, Lindex)
    }
    this.fromDateCommonAlertForGap = '';
    this.fromDateCommonAlertForGap = this.messageTextEmptoEmp ? this.messageTextEmptoEmp : '';
    this.getcommonAlert();
  }

  //end

  //overlap alert -start

  public setfromDateAlertBasedOnEdu(fromDate: any, CompanyName: any, Lindex: any) {
    if (this.common.allEduComponent != undefined || this.common.allEduComponent != null) {
      let index = this.common.allEduComponent.length - 1;
      this.messageName2 = [];
      this.messageTextfrom2 = [];
      this.fromflag1 = false;
      let fDate1 = new Date(''); fDate1 = new Date(fromDate);
      let fDate2 = new Date(''); fDate2 = new Date(this.common.allEduComponent[index].compRef.courseStart);
      let tDate1 = new Date(''); tDate1 = new Date(this.common.allEduComponent[index].compRef.courseCompletion);
      if (fDate1 > fDate2 && fDate1 < tDate1) {
        this.headerText = 'Alert !',
          this.messageName2.push(this.common.allEduComponent[index].compRef.institutionName);
        this.messageText = 'This current employer is overlaping with the following ' + ((this.messageName2.length > 1) ? ' Educations ' : ' Education ');
        this.messageTextfrom2.push('This current employer is overlaping with the following ' + ((this.messageName2.length > 1) ? ' Educations ' : ' Education ') + ' - ' + this.messageName2.join(', '));
        this.fromflag1 = true;
        this.openDialogAlert2(fromDate, CompanyName, Lindex, this.fromflag1);
      } else {
        this.setfromDateAlertBasedOnEdutoEmp(fromDate, CompanyName, Lindex);
      }
    } else {
      this.setfromDateAlertBasedOnEdutoEmp(fromDate, CompanyName, Lindex);
    }
    this.fromDateCommonAlert = '';
    this.fromDateCommonAlert = (this.messageTextfrom1 ? this.messageTextfrom1.join(', ') : '') + (this.messageTextfrom2 ? this.messageTextfrom2.join(', ') : '');
  }
  public setToDateAlertBasedOnEdu(toDate: any) {
    if (this.common.allEduComponent != undefined || this.common.allEduComponent != null) {
      let index = this.common.allEduComponent.length - 1;
      this.messageName2 = [];
      this.messageTextto2 = [];
      let tDate1 = new Date(''); tDate1 = new Date(toDate);
      let tDate2 = new Date(''); tDate2 = new Date(this.common.allEduComponent[index].compRef.courseCompletion);
      let fDate1 = new Date(''); fDate1 = new Date(this.common.allEduComponent[index].compRef.courseStart);
      if (tDate1 < tDate2 && tDate1 > fDate1) {
        this.headerText = 'Alert !',
          this.messageName2.push(this.common.allEduComponent[index].compRef.institutionName);
        this.messageText = 'This current employer is overlaping with the following ' + ((this.messageName2.length > 1) ? ' Educations ' : ' Education ');
        this.openDialogAlert2();
        this.messageTextto2.push('This current employer is overlaping with the following ' + ((this.messageName2.length > 1) ? ' Educations ' : ' Education ') + + ' - ' + this.messageName2.join(', '));
      }
    }
    this.toDateCommonAlert = '';
    this.toDateCommonAlert = (this.messageTextto1 ? this.messageTextto1.join(', ') : '') + (this.messageTextto2 ? this.messageTextto2.join(', ') : '');
    this.getcommonAlert();
  }

  public setfromDateAlert(fromDate: any, CompanyName: any, Lindex: any) {
    if (this.screeningService.ClientCategoryId !== 2) {
      if (this.common.allEmpComponent != undefined || this.common.allEmpComponent != null) {
        this.allEmpolymentList = this.common.allEmpComponent;
        if (this.allEmpolymentList.length > 0) {
          this.messageName1 = [];
          this.messageTextfrom1 = [];
          this.fromFlag = false;
          this.allEmpolymentList.forEach((ele, indexs) => {
            let findIndex : number = 0;
            findIndex = Lindex -1;
            if(findIndex !== indexs){
            if ((ele.compRef.fromDate != null && ele.compRef.toDate != null) || (ele.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided' && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided') ||
              (ele.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') != 'n/a' && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') != 'n/a')) {
              ele.compRef.toDate = (ele.compRef.toDate != null && ele.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') == 'tilldate') ? this.datePipe.transform(new Date(), 'dd/MMM/yyyy') : ele.compRef.toDate;
              let fDate1 = new Date(''); fDate1 = new Date(fromDate);
              let fDate2 = new Date(''); fDate2 = new Date(ele.compRef.fromDate);
              let tDate1 = new Date(''); tDate1 = new Date(ele.compRef.toDate);
              if (fDate1 > fDate2 && fDate1 < tDate1) {
                this.headerText = 'Alert !',
                  this.messageName1.push(ele.compRef.employerName);
                this.messageText = 'This current employer is overlaping with the following previous' + ((this.messageName1.length > 1) ? ' employers ' : ' employer ');

                this.fromFlag = true;
                this.openDialogAlert1(fromDate, CompanyName, Lindex, this.fromFlag);
              }

            }
          }
          })
          if (this.fromFlag == false) {
            this.setfromDateAlertBasedOnEdu(fromDate, CompanyName, Lindex);
          }
          if (this.messageText != undefined) {
            this.messageTextfrom1.push(this.messageText + ' - ' + this.messageName1.join(', '));
          }
        } else {
          this.setfromDateAlertBasedOnEdu(fromDate, CompanyName, Lindex);
        }
      } else {
        this.setfromDateAlertBasedOnEdu(fromDate, CompanyName, Lindex);
      }
    }
  }
  public setToDateAlert(toDate: any , Lindex: any) {
    if (this.screeningService.ClientCategoryId !== 2) {
      if (this.common.allEmpComponent != undefined || this.common.allEmpComponent != null) {
        this.allEmpolymentList = this.common.allEmpComponent;
        if (this.allEmpolymentList.length > 0) {
          this.messageName1 = [];
          this.messageTextto1 = [];
          this.toFlag = false;
          this.allEmpolymentList.forEach((ele, indexs) => {

            let findIndex : number = 0;
            findIndex = Lindex -1;
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
                this.messageText = 'This current employer is overlaping with the following previous' + ((this.messageName1.length > 1) ? ' employers ' : ' employer ');
                this.toFlag = true;
                this.openDialogAlert3(toDate, '', false, this.toFlag);
              }
            }
          }
          })
          if (this.toFlag = false) {
            this.setToDateAlertBasedOnEdu(toDate);
          }
          if (this.messageText != undefined) {
            this.messageTextto1.push(this.messageText + ' - ' + this.messageName1.join(', '));
          }
        } else {
          this.setToDateAlertBasedOnEdu(toDate);
        }
      } else {
        this.setToDateAlertBasedOnEdu(toDate);
      }
    }
  }

  public openDialogAlert1(Date?: any, CompanyName?: any, Lindex?: any, fromFlag?: boolean) {
    const dialogRef = this.dialog.open(this.DateAlertPopUp, {
      width: '500px',
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (fromFlag) {
          this.setfromDateAlertBasedOnEdu(Date, CompanyName, Lindex)
        }
      });
    }
  }
  public openDialogAlert2(Date?: any, CompanyName?: any, Lindex?: any, fromFlag?: boolean) {
    const dialogRef = this.dialog.open(this.DateAlertPopUp1, {
      width: '500px',
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (fromFlag) {
          this.setfromDateAlertBasedOnEdutoEmp(Date, CompanyName, Lindex)
        }
      });
    }
  }
  public openDialogAlert3(Date?: any, CompanyName?: any, Lindex?: any, toFlag?: boolean) {
    const dialogRef = this.dialog.open(this.DateAlertPopUp, {
      width: '500px',
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (toFlag) {
          this.setToDateAlertBasedOnEdu(Date)
        }
      });
    }
  }

  getcommonAlert() {
    this.commonAlertMsg = '';
    this.sixMonthComment = '';
    this.commonMessage = '';
    this.eduEmpSixMonthComment = '';
    this.commonAlertMsg = (this.fromDateCommonAlert ? (this.fromDateCommonAlert + '-- ') : '') + (this.toDateCommonAlert ? this.toDateCommonAlert : '')
    this.eduEmpSixMonthComment = this.messageTextEmptoEdu ? this.messageTextEmptoEdu : null;
    this.sixMonthComment = this.fromDateCommonAlertForGap ? this.fromDateCommonAlertForGap : '';
    this.commonMessage = (this.commonAlertMsg ? (this.commonAlertMsg + '-- ') : '') + (this.sixMonthComment ? this.sixMonthComment : '');
    this.mainForm.get('screeningComponentInfo')?.get('commonAlertMsg')?.setValue(this.commonAlertMsg);
    this.mainForm.get('screeningComponentInfo')?.get('sixMonthComment')?.setValue(this.commonMessage);
    this.mainForm.get('screeningComponentInfo')?.get('eduEmpSixMonthComment')?.setValue(this.eduEmpSixMonthComment);
  }
  //end

  // VTS2-2023-CRT-0123 , VTS2-2023-CRT-0120 - Edu, Emp overlap and Gap Alert Validation - End

  getInput(value: any) {
    if (value && value.length >= 4) {
      this.GetCompanyInfo(value);
    } else if (value === '') {
      this.addressWithoutForm = null;
      this.GetCompanyInfo(value);
    } else {
      this.setEmpItems(value);
    }

  }
  GetCompanyInfo(value, flag = false) {
    let values1;
    let values2;
    if (flag == true) {
      values1 = this.getPaginationMValues(value);
    } else {
      values2 = this.getPaginationValues(value);
    }
    this.screeningService.GetCompanyInfo((flag == true) ? values1 : values2).subscribe(resp => {
      if (resp) {
        this.empList = resp;
        this.compBaseDetails.employer = resp;
        if (flag == true) {
          this.setEmpItems(this.empList[0].empName);
        } else {
          this.setEmpItems(value);
        }
        if (flag === true) {
          this.mainForm.get(this.formgroupName).get('employerName')?.setValue(this.mainForm.get(this.formgroupName).get('employerName')?.value);

        }
      }
    });
  }

  getPaginationMValues(filterId: any) {
    return {
      pageSize: 1,
      page: 1,
      filters: '',
      sorts: '-empInsId',
      applyPaging: false,
      empInsId: 0,
      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false, //this.screeningService.indianClientFlag,
      needTotal: true,
      department: this.userData.deptName,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }

  getPaginationValues(filter: any) {
    return {
      pageSize: 20,
      page: 1,
      filters: 'name @=' + (filter === null ? '' : filter),
      sorts: '-empInsId',
      applyPaging: true,
      empInsId: 0,
      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false, //this.screeningService.indianClientFlag,
      needTotal: true,
      department: this.userData.deptName,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }
  fresherFlagMethod(fresherFlag: any) {
    if (fresherFlag === true) {
      this.disableFlag = true;
      // if (this.userData.applicationId === 3) {
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
      // }
      this.mainForm['controls']['compRef'].disable();

      this.mainForm['controls']['screeningComponentInfo'].disable();
      this.mainForm['controls']['screeningInsufficiency'].disable();
      this.mainForm['controls']['periodOfStayAddress'].disable();
      this.mainForm['controls']['componentCustomFields'].disable();
      this.mainForm['controls']['compRef']['controls']['fresherFlag'].enable();
      this.mainForm['controls']['componentCustomFields'].disable();
    }
    else {
      if (this.userData.applicationId === 3) {
        this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].setValidators(Validators.required);
        this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
      }
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].enable();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].enable();
      this.mainForm['controls']['compRef'].enable();
      //this.addressForm.enable();
      this.disableFlag = false;
      this.mainForm['controls']['screeningComponentInfo'].enable();
      this.mainForm['controls']['screeningInsufficiency'].enable();
      this.mainForm['controls']['periodOfStayAddress'].enable();
      this.mainForm['controls']['componentCustomFields'].enable();
      this.mainForm['controls']['compRef']['controls']['fresherFlag'].enable();
      this.mainForm['controls']['componentCustomFields'].enable();
    }
  }
  getCountryList() {
    if (this.countryList.length > 0) {
      this.countryControls =
        new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
          '', this.mainForm.get('compRef.supervisorDet') as UntypedFormGroup, false, false, false);
    } else {
      this.master.GetCountryList().subscribe(res => {
        if (res) {
          this.countryList = res;
          this.countryControls =
            new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
              '', this.mainForm.get('compRef.supervisorDet') as UntypedFormGroup, false, false, false);
        }
      });
    }
  }
  GetNotProvidedReasonList() {
    this.screeningService.GetNotProvidedReasonList().subscribe(res => {
      if (res) {
        this.npReasonList = res;
      }
    });
  }
  get anReasonShow(): boolean {
    const fromdate = this.mainForm.get(this.formgroupName + '.fromDate').value;
    const toDate = this.mainForm.get(this.formgroupName + '.toDate').value;
    const showflag = this.invitationFlag ? (((fromdate ? fromdate.toUpperCase() : '') === 'NOT PROVIDED') ||
      ((toDate ? toDate.toUpperCase() : '') === 'NOT PROVIDED')) ? true : false : false;
    if (!showflag) {
      this.mainForm.get(this.formgroupName + '.npReasonLookupId').setValue('');
    }
    return showflag;
  }
  get otherReasonShow(): boolean {
    const npRason = this.mainForm.get(this.formgroupName + '.npReasonLookupId').value;
    if (this.npReasonList.length > 0) {
      const reasonObj = this.npReasonList.find(f => f.lookUpId === npRason);
      this.showRemarks = reasonObj ? reasonObj.lookUpName.toUpperCase() === 'OTHERS' ? true : false : false;
      if (!this.showRemarks) {
        this.mainForm.get(this.formgroupName + '.npRemarks').setValue('');
      }
    }
    return this.showRemarks;
  }
  get Supervisor(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName + '.supervisorDet') as UntypedFormGroup;
  }
  empkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterEmpList.filter(e =>
          e.name.toLowerCase() === value.toLowerCase() ||
          e.address.state.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.empKeyup = true;
        } else {
          this.empKeyup = true;
        }
      } else {
        this.empKeyup = false;
      }
      this.disableAddByEmp();
    }
  }
  get displayempFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterEmpList && this.filterEmpList.length > 0) {
          data = this.empList.find(x => x.name === data);
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
  getName(option: any) {
    return (option.address.addressId === this.screeningService.defaultAddressId) ? option.name + '  | Not Provided ' : option.name + '  |  ' + option.address.country + ' | ' + option.address.state + ' | ' + option.address.district;
  }
  setEmpItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {

      this.filterEmpList = Object.assign([], this.empList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          item.address.state.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }
  }
  assignResourceCopy() {
    this.filterEmpList = Object.assign([], this.empList);
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
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
  showHRSupFields() {
    this.showHRSupFieldsFlag = (this.invitationFlag && (this.mainForm['controls']['compRef']['controls']['fresherFlag'].value != true && this.mainForm.get('screeningComponentInfo.notApplicableFlag')?.value != true)) ? true : false;
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
          this.mainForm.get(this.formgroupName).get('employerName')?.setValue('');
          this.getStatusDetails('genuine');

        } else {
          if (this.screeningService.caseFlagType !== this.common.NEWCASE) {
            const empObj = this.empList.find(x => x.name.toLowerCase() ===
              this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
            if (typeof empObj.researchStatus === 'number') {

              if (empObj.researchStatus != this.common.VERIFIEDNUM) {
                if (empObj.researchStatus == this.common.FORRESNUM && !this.screeningService.forResearchByPassFlag) {
                  this.getStatusDetails('fake');
                  this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                } else {
                  this.getStatusDetails('genuine');
                }
              }
            }
            else if (typeof empObj.researchStatus === 'string') {
              if (empObj.researchStatus != this.common.VERIFIEDNUM) {
                if (empObj.researchStatus == this.common.FOR_RE && !this.screeningService.forResearchByPassFlag) {
                  this.getStatusDetails('fake');
                  this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                } else {
                  this.getStatusDetails('genuine');
                }
              }
            }
          }
        }
      });
    }
  }
  changeEmployer() {
    setTimeout(() => {
      const employerName = this.mainForm.get(this.formgroupName).get('employerName')?.value;
      this.common.empdata = this.mainForm.get(this.formgroupName).get('employerName')?.value;
      if (this.applicationId === 3) {
        let msg = ''; let header = '';
        // const empObj = this.empList.find(x => x.name.toLowerCase() ===
        //   this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
        const empObj = this.empList.find(x => x.address.addressId ===
          this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.value);
        if (this.empList.filter(x => x.name.toLowerCase() === employerName.toLowerCase()).length === 1 && empObj) {
          this.addressWithoutForm = empObj.address;
          this.insvalueId = empObj.empInsId;
          this.address = new BehaviorSubject(empObj.address);
          this.address.next(empObj.address);
          setTimeout(() => {
            this.mainForm.get(this.formgroupName).get('address')?.setValue(empObj.address)
          }, 50);
        }
        if ((empObj.researchStatus === this.common.VERIFIEDNUM && empObj.isReverify && this.userData.applicationId == this.common.AcheckLoginId)) {
          this.mainForm.get(this.formgroupName).get('reverifyFlag')?.setValue(empObj.isReverify);
          const varn = this.mainForm;
          this.empAlertCount++;
          msg = 'The employer has been moved to Reverify concluded employer.';
          header = 'Alert';
          this.openDialog(msg, header);
        }
      }
      if (this.applicationId !== 3) {
        let msg = ''; let header = '';
        if (employerName) {
          // const empObj = this.empList.find(x => x.name.toLowerCase() ===
          //   this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
          const empObj = this.empList.find(x => x.address.addressId ===
            this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.value);
          if (empObj && this.empAlertCount > 0) {
            // this.getmethod(empObj.empInsId, empObj.address.addressId);
            this.getmethod(empObj.empInsId, empObj.address.addressId, empObj.empInsAddressId);
            this.empAlertCount = 1;
          }
          if (empObj && this.empAlertCount === 0) {

            if (empObj.researchResultLookupName === 'Fake' && empObj.address.country === 'India') {
              this.empAlertCount++;
              msg = 'Company name is matching with Fake Employer list.';
              header = 'Alert';
              this.openDialog(msg, header);
              this.getStatusDetails('genuine');

            }
            else if ((empObj.researchStatus === this.common.VERIFIEDNUM || empObj.researchStatus === this.common.ReverifyFR) && empObj.isReverify && this.userData.applicationId == this.common.AcheckLoginId) {
              const varn = this.mainForm;
              this.empAlertCount++;
              msg = 'The employer has been moved to Reverify concluded employer.';
              header = 'Alert';
              this.openDialog(msg, header);
            }


            else if ((empObj.researchStatus != this.common.VERIFIEDNUM && empObj.researchStatus != this.common.ReverifyFR && !this.screeningService.forResearchByPassFlag) && empObj.address.country === 'India') {
              let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
              if (this.isSuspectFlag) {
                employmentForm.addControl('isClientSuspectFlag', new UntypedFormControl(true))
              }
              this.isFakeEmployee = true;
              if (typeof empObj.researchStatus === 'number') {
                this.empAlertCount++;
                msg = 'Company name is under research verification process.';
                header = 'Alert';
                this.openDialog(msg, header);
                if (empObj.researchStatus == this.common.FORRESNUM && !this.screeningService.forResearchByPassFlag) {
                  this.getStatusDetails('fake');
                  this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                } else {
                  this.getStatusDetails('genuine');
                }
              }
              else if (typeof empObj.researchStatus === 'string') {
                this.empAlertCount++;
                msg = 'Company name is under research verification process.';
                header = 'Alert';
                this.openDialog(msg, header);

                if (empObj.researchStatus == this.common.FOR_RE && !this.screeningService.forResearchByPassFlag) {
                  this.getStatusDetails('fake');
                  this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                } else {
                  this.getStatusDetails('genuine');
                }
              }

            } else {
              let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
              this.isFakeEmployee = false;
              if (this.isSuspectFlag) {
                employmentForm.removeControl('isClientSuspectFlag')
              }
              this.getStatusDetails('genuine');
            }
          } else {
            if (!empObj && employerName.trim() !== '') {
              this.mainForm.get(this.formgroupName).get('employerName')?.setErrors({ notmatch: true });
              this.mainForm.get(this.formgroupName).get('address')?.reset();
              this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(0);
            }

          }
          if (this.empList.filter(x => x.name.toLowerCase() === employerName.toLowerCase()).length !== 0 && empObj) {
            this.addressWithoutForm = empObj.address;
            delete empObj.address.addressPos;
            delete empObj.address.posDuration;
            this.address = new BehaviorSubject(empObj.address);
            this.address.next(empObj.address);
            setTimeout(() => {
              this.mainForm.get(this.formgroupName).get('address')?.setValue(empObj.address)
            }, 50);
          }
        } else {
          this.isFakeEmployee = false;
          let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
          if (this.isSuspectFlag) {
            employmentForm.removeControl('isClientSuspectFlag')
          }
        }
      }
    }, 300);

  }
  //getmethod(empInsId, addressId) {
  getmethod(empInsId, addressId, empInsAddressId) {
    this.setBlur = false;
    this.empAlertCount = 0;
    //const instn = this.empList.find(x => x.empInsId === empInsId && //x.address.addressId === addressId);
    const instn = this.empList.find(x => x.empInsId === empInsId && x.address.addressId === addressId && x.empInsAddressId == empInsAddressId);
    if (instn) {
      this.mainForm.get(this.formgroupName).get('employerName')?.setValue(instn.name);
      this.mainForm.get(this.formgroupName).get('companyId')?.setValue(instn.empInsId);
      this.mainForm.get(this.formgroupName).get('empInsAddressId')?.setValue(instn.empInsAddressId);
      this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(addressId);
      this.mainForm.get(this.formgroupName).get('reverifyFlag')?.setValue(instn.isReverify);
      this.addressWithoutForm = instn.address;
      this.address = new BehaviorSubject(instn.address);
      this.address.next(instn.address);
      this.disableAddByEmp();
    }

  }
  getStatusDetails(type: any) {
    const formValue = this.mainForm.getRawValue();

    if (type === 'fake' && !this.screeningService.forResearchByPassFlag) {
      if (formValue.screeningComponentInfo.screeningCompId === 0) {
        this.setStatusValue(this.baseInfo.deScreeningStatus, this.common.FOR_RE);
      } else {
        this.setStatusValue(this.baseInfo.screeningStatus, this.common.FOR_RE);
      }
    } else {
      if (formValue.screeningComponentInfo.qcRejectFlag === true && this.common.instatusId != 2 && this.mainForm.get('screeningComponentInfo.screenStatusId')?.value !== 0) {
        this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(this.common.instatusId);
      }
      else if (formValue.screeningComponentInfo.qcRejectFlag !== true) {
        if (this.mainForm.get('screeningComponentInfo.screenStatusId')?.value === 0) {
          this.setStatusValue(this.baseInfo.deScreeningStatus, 'open');
        } else {
          this.setStatusValue(this.baseInfo.screeningStatus, 'open');
        }
      }
    }
    this.setEmpItems(this.mainForm.get(this.formgroupName).get('employerName')?.value)
  }
  setStatusValue(list, status) {
    const statusId = list.find(x => x.screeningStatus.toLowerCase() === status.toLowerCase()).statusId;
    this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
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
  chengeCurrentEmp() {
    const currentEmploye = this.mainForm.get(this.formgroupName).get('currentEmployerFlag')?.value;
    if (currentEmploye) {
      this.mainForm.get(this.formgroupName).get('validationString')?.setValue(['NOT PROVIDED', 'TILL DATE', 'Not Provided']);
      this.mainForm.get(this.formgroupName).get('toDate')?.setValue('TILL DATE');
      this.todateReadOnly = true;
      this.calcCurrentCompany();
    } else {
      this.mainForm.get(this.formgroupName).get('validationString')?.setValue(['NOT PROVIDED', 'Not Provided']);
      if (this.mainForm.get('screeningComponentInfo.insuffRaisedFlag')?.value) {
        if (this.screeningService.insuffLevelList.length > 0) {
          const levelLookupId = this.screeningService.insuffLevelList.find(f => f.lookUpName === 'Level-1').lookUpId;
          this.mainForm.get('screeningInsufficiency.levelLookupId')?.setValue(levelLookupId);
        }
      }
      if (this.mainForm.get(this.formgroupName).get('toDate')?.value === 'TILL DATE') {
        this.mainForm.get(this.formgroupName).get('toDate')?.setValue('');

      }
      this.todateReadOnly = false;
    }
  }
  calcCurrentCompany() {
    if (this.mainForm.get(this.formgroupName).get('fromDate')?.value &&
      this.mainForm.get(this.formgroupName).get('toDate')?.value === 'TILL DATE') {
      const val = this.mainForm.get(this.formgroupName).get('toDate')?.value === 'TILL DATE' ?
        moment(new Date(), 'dd/MM/yyyy') : '';
      const val1 = moment(this.mainForm.get(this.formgroupName).get('fromDate')?.value, 'dd/MM/yyyy');
      if ((val1 && val1.isValid() === true) && (val && val.isValid() === true)) {
        if (val1 > val) {
          this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors({ incorrect: true });
          this.mainForm.get(this.formgroupName).get('fromDate')?.markAsTouched();
        } else {
          this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors(null);
        }
      }
    }
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    if (this.fileBtn) {
      this.nFlag = true;
    }
  }
  disableAddByEmp() {
    const empName = this.mainForm.get(this.formgroupName).get('employerName')?.value;
    if (empName) {
      const empData = this.empList.find(y => y.name.toLowerCase() === empName.toLowerCase());
      if (!empData) {
        this.mainForm.get(this.formgroupName).get('address')?.enable();
      }
    } else {
      this.mainForm.get(this.formgroupName).get('address')?.enable();
      this.mainForm.get(this.formgroupName).get('address')?.reset();
    }
  }
  public openDialogdata() {
    const popupData = {
      action: 'Company',
      headerText: 'Company Pre-Data',
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
          this.mainForm.get(this.formgroupName).get('employerName')?.setValue(result.rowdata.name);
          this.mainForm.get(this.formgroupName).get('companyId')?.setValue(result.rowdata.empInsId);
          this.mainForm.get(this.formgroupName).get('fromDate')?.setValue(result.rowdata.fromdate.replace(/\s+/g, ''));
          this.mainForm.get(this.formgroupName).get('toDate')?.setValue(result.rowdata.todate.replace(/\s+/g, ''));
          if (this.empList && result.rowdata.name) {
            const objemp = this.empList.find(x => x.name.toLowerCase() ===
              this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
            if (objemp) {
              this.changeEmployer();
            } else {
              this.openAddNewMasterData();
            }
          }
        }
      });
    }
  }
  public openAddNewMasterData() {
    this.screeningService.compData = { compName: "employment (hr)" }
    const popupData = {
      action: 'Employer',
      headerText: 'Add New Company',
      labelText: 'Company Name',
      bodyText: 'Company Name will goes under research verification process.',
      value: this.mainForm.get(this.formgroupName).get('employerName')?.value
    };
    const dialogRef = this.dialog.open(CommonAddNewComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.screeningService.compData = { compName: "Address" }
          if (result.Responds != null) {
            this.insvalueId = 1;
            const values = this.getPaginationMValues(result.Responds.educationEmployerId);
            this.screeningService.GetCompanyInfo(values).subscribe(resp => {
              this.empList = resp;
              this.screeningService.employerList = resp;
              const objins = this.empList.find(f => f.empInsId === result.Responds.educationEmployerId && f.address != null && f.address.addressId === result.Responds.addressId);
              this.filterEmpList = Object.assign([], this.empList).find(f => f.empInsId === result.Responds.educationEmployerId && f.address != null && f.address.addressId === result.Responds.addressId);
              this.mainForm.get(this.formgroupName).get('employerName')?.setValue(objins.name);
              this.common.empdata = objins.name;
              this.mainForm.get(this.formgroupName).get('companyId')?.setValue(objins.empInsId);
              this.addressWithoutForm = objins.address;
              this.isFakeEmployee = true;
              this.mainForm.get(this.formgroupName).get('empInsAddressId')?.setValue(objins.empInsAddressId);
              this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(objins.address.addressId);
              let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
              if (this.isSuspectFlag) {
                employmentForm.addControl('isClientSuspectFlag', new UntypedFormControl(true))
              }
              delete objins.address.addressPos;
              delete objins.address.posDuration;
              // this.GetCompanyInfo(objins.empInsId, true);
              this.address = new BehaviorSubject(objins.address);
              this.address.next(objins.address);
              setTimeout(() => {
                this.mainForm.get(this.formgroupName).get('address')?.setValue(objins.address)
              }, 50);
              if (this.applicationId !== 3 && objins.address.country === 'India') {
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
  changeKeeponHold(event: any) {
    if (event.value) {
      this.dialog.open(this.keeponHold,
        { width: '450px', disableClose: true, });
      this.dateofinitiation.setValidators(Validators.required);
    } else {
      this.dateofinitiation.clearValidators();
      this.dateofinitiation.setValue(null);
      this.dateofinitiation.updateValueAndValidity();
    }
  }
  keeponHoldYes() {
    if (this.dateofinitiation.valid) {
      this.mainForm.get(this.formgroupName).get('empInitiationDate')?.setValue(this.dateofinitiation.value);
      this.dialog.closeAll();
    } else {

    }
  }
  keeponHoldNo() {
    this.mainForm.get(this.formgroupName).get('empInitiationDate')?.setValue(null);
    this.dialog.closeAll();
  }
  chengeFresherEmp(event: any) {
    this.emitFresher.emit(event);
    const currentEmploye = this.mainForm.get(this.formgroupName).get('currentEmployerFlag')?.value;
    if (currentEmploye == false) {
      this.fresherFlagMethod(event.checked);
    }
    else {
      this.showTopCenter(
        'warn',
        'Failure Message',
        'Please Select One Choice'
      );
      this.mainForm.get(this.formgroupName).get('fresherFlag')?.setValue(false);
    }
  }
  initcompref() {
    this.addressForm = this.fb.group({
      screeningAddressId: new UntypedFormControl(0),
      companyId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      addressTypeId: new UntypedFormControl(0),
      screeningEmployeeId: new UntypedFormControl(0),
      screeningCriminalCheckId: new UntypedFormControl(0),
      screeningPCC3ECompId: new UntypedFormControl(0),
      periodOfStay: new UntypedFormControl('', this.validatedateInputStayFromwithBirt),
      periodOfStayTo: new UntypedFormControl('', this.validatedateInputwitTilldate),
      addressTypeLookupId: new UntypedFormControl('', Validators.required),
      checkPermanentAddress: new UntypedFormControl(),
      validationString: new UntypedFormControl(['NOT PROVIDED', 'SINCE BIRTH', 'TILL DATE']),
      address: this.initCommonAddress()
    });
  }
  initCommonAddress(): UntypedFormGroup {
    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl('', Validators.required),
      addLine2: new UntypedFormControl(null),
      addLine3: new UntypedFormControl(null),
      cityId: new UntypedFormControl(null),
      districtId: new UntypedFormControl(null),
      stateId: new UntypedFormControl('', Validators.required),
      countryId: new UntypedFormControl('', Validators.required),
      postalCode: new UntypedFormControl('', Validators.required),
      locationId: new UntypedFormControl(null),
      country: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      place: new UntypedFormControl(''),
      addressPos: this.fb.array([
        this.fb.group({
          addressId: new UntypedFormControl(0),
          periodOfStay: new UntypedFormControl('', [Validators.required, this.validatedateInputStayFromwithBirt]),
          periodOfStayTo: new UntypedFormControl('', [Validators.required, this.validatedateInputwitTilldate]),
          addressPosId: new UntypedFormControl(0),
          screeningCompId: new UntypedFormControl(0),
          reportFlag: new UntypedFormControl(false),
          validationString: new UntypedFormControl([
            "NOT PROVIDED",
            "Not Provided",
            "SINCE BIRTH",
            "TILL DATE",
          ]),
        }),
      ]),
    });
  }
  validatedateInputStayFromwithBirt(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (sincebrithREGEX.test(value) || ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) || mmmyyyyREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validatedateInputwitTilldate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value)
        || mmmyyyyREGEX.test(value) || tillDateREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }

  addUpdateAddress(action: any) {
    if (this.addressForm.valid) {
      if (this.rowIndex === -1) {
        this.addressForm.get('addressTypeId')?.setValue(this.addressForm.getRawValue().addressTypeLookupId);
        this.mainForm.get('periodOfStayAddress')?.value.push(this.addressForm.value);
      } else {
        this.mainForm.get('periodOfStayAddress').value[this.rowIndex] = this.addressForm.value;
      }
      this.reserAddressForm();
    } else {
      this.addressForm.markAllAsTouched();
    }
  }
  changeDate(date, control) {
    this.mainForm.get(this.formgroupName).get(control).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperValue(this.mainForm.get(this.formgroupName).get(control).value, control);

    if (control == 'periodOfStayTo' || control == 'periodOfStay') {
      this.touchSValidation(date.value, control);
    } else { this.touchValidation(date.value, control); }
  }
  handleDatechange(date, control) {
    this.addressForm.get(control).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.addressForm.get(control).value, control);
    if (control == 'periodOfStayTo' || control == 'periodOfStay') {
      this.touchSValidation(date.value, control);
    } else { this.touchValidation(date.value, control); }
  }
  upperCase(val, control) {
    val = val.toUpperCase();
    this.addressForm.get(control).setValue(val);
    if (val.includes('NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue('Not Provided');
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue('Not Provided');
    }
  }
  fromDate(val, control) {
    if (!val.includes('NOT PROVIDED')) {
      let date1 = new Date();
      let date2 = this.common.convertDate(val);
      if (date2 > date1) {
        this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors({ incorrectlimitf: true });
      }

    }
  }
  toDate(val, control) {
    if (!val.includes('NOT PROVIDED') && !val.toUpperCase().includes('TILL DATE')) {
      let date1 = new Date();
      let date2 = this.common.convertDate(val);
      if (this.CFflag != 1) {
        if (date2 > date1) {
          this.mainForm.get(this.formgroupName).get('toDate')?.setErrors({ incorrectlimit: true });
        }
      }
      if (this.CFflag == 1) {
        if (date2 > this.maxDate1) {
          this.mainForm.get(this.formgroupName).get('toDate')?.setErrors({ incorrectlimit: true });
        }
      }
    }
  }
  upperValue(val, control) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(control).setValue(val);

    if (val.includes('NOT PROVIDED') && control === "fromDate") {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && control === "contactNo") {
      this.mainForm.get(this.formgroupName).get('supervisorDet.supervisorContactNo.contactData')?.setValue('Not Provided');

    }
    if (val.includes('NOT PROVIDED') && control === "contactEmail") {
      this.mainForm.get(this.formgroupName).get('supervisorDet.supervisorEmail.contactData')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && control === "toDate") {
      this.mainForm.get(this.formgroupName).get('toDate')?.setValue('Not Provided');
    }
  }
  touchValidation(val, control) {
    if ((this.mainForm.get(this.formgroupName).get('fromDate')?.value && val) && this.mainForm.get(this.formgroupName).get(control).value < this.mainForm.get(this.formgroupName).get('fromDate')?.value) {
      this.mainForm.get(this.formgroupName).get(control).markAsTouched();
    }
  }
  touchSValidation(val, control) {
    if ((this.addressForm.get('periodOfStay')?.value && val) &&
      this.addressForm.get(control).value < this.addressForm.get('periodOfStay')?.value) {
      this.addressForm.get(control).setErrors({ comparison: true });
      this.addressForm.get(control).markAsTouched();
    }
  }
  dateCalc(from, to) {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      {
        validator: this.common.dateCompareFile('fromDate',
          'toDate')
      },
    );
  }
  getDateCal(compId, index, fromdate, todate) {
    let startdate: any;
    let enddate: any;

    if (fromdate !== 'NOT PROVIDED' || todate !== 'NOT PROVIDED') {
      let compArr: any[] = [];
      const formRawValue = this.common.fileSubmissionCom.getRawValue();
      compArr = formRawValue.screeningComponent.find(x => x.compId ===
        compId).component;
      compArr.splice(index - 1, 1);
      if (fromdate != '') {
        startdate = this.common.convertDate(fromdate);
      }

      if (todate != '') {
        enddate = this.common.convertDate(todate);
      }

      if (todate.toUpperCase().includes('TILL DATE')) {
        let secondDate = new Date(new Date());
      }
      for (let i = 0; i <= (compArr.length - 1); i++) {

        if (compArr[i].compRef.toDate != null) {
          if (compArr[i].compRef.toDate.toUpperCase().includes('TILL DATE')) {
            var tlDate = new Date();

          }
          else {
            tlDate = null;
          }
          if (todate.toUpperCase().includes('TILL DATE')) {
            var totlDate = new Date();

          }
          else {
            totlDate = null;
          }
          if (compArr[i].compRef.fromDate != null && compArr[i].compRef.toDate != null) {
            var frompDate = new Date(fromdate);
            var topDate = totlDate != null ? totlDate : new Date(todate);
            var firstDate = new Date(compArr[i].compRef.fromDate);
            var secondate = tlDate != null ? tlDate : new Date(compArr[i].compRef.toDate)

            if ((frompDate >= firstDate) && (topDate <= secondate)) {
              this.Message = "Period of Employment for this Employment (HR) " + fromdate + " and " + todate + " is Overlapping with Previous Employment (HR) " + compArr[i].compRef.fromDate + " and " + compArr[i].compRef.toDate;
              this.openEmpDialog();
              return false;

            }
          }
        }

      }
    }
  }
  openEmpDialog() {
    const dialogRef = this.dialog.open(this.OverLabPopUp, {
      width: '350px',
      disableClose: true
    });
  }
  assignvalue(value: any) {
    this.common.empdata = value;
  }

  Empvalidation(event: any, autoValue) {
    if (event.relatedTarget && event.relatedTarget.tagName === 'MAT-OPTION') {

      return;
    }
    this.empList = this.screeningService.employerList;
    if (autoValue != "" && autoValue != undefined) {
      this.cfilterInstnList = this.empList.filter(s => s.name == autoValue)
      if (this.filterEmpList.length === 0 || this.cfilterInstnList.length === 0) {
        const dialogRef = this.dialog.open(this.FakeEmp, {
          width: '350px',
          disableClose: true
        });
      }
    }
  }

  Empcvalidation() {
    this.empList = this.compBaseDetails.employer;
    if (this.common.empdata != "" && this.common.empdata != undefined) {
      if (this.mainForm.get(this.formgroupName).get('fresherFlag')?.value != true) {
        if (this.filterEmpList.length == 0) {
          const dialogRef = this.dialog.open(this.FakeEmp, {
            width: '350px',
            disableClose: true
          });

        }
      }

    }
  }
  validatetype(type: any) {

    if (type == 'okay') {
      this.openAddNewMasterData();

    } else if (type === 'cancel') {

      this.mainForm.get(this.formgroupName).get('employerName')?.setValue('')

    }

  }

  editAddress(rowData, index) {
    this.addressForm.get('addressTypeLookupId')?.setValue(489);
    this.rowIndex = index;
    this.addressForm.patchValue(rowData);
    this.screeningService.compData = { compName: "Address" }
    this.periodofStayadd.next(rowData.address);
  }
  reserAddressForm() {
    this.rowIndex = -1;
    this.addressForm.reset();
    this.addressForm.get('screeningAddressId')?.setValue(0);
    this.addressForm.get('address.addressId')?.setValue(0);
    this.addressForm.get('screeningEmployeeId')?.setValue(0);
    this.initcompref();
  }
  public deleteperiodofStayAdd(id, index) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this Address?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.mainForm.get('periodOfStayAddress')?.value.splice(index, 1);
            this.reserAddressForm();
            if (id > 0) {
              this.deleteAddress(id);
            }
          }
        }
      });
    }
  }
  deleteAddress(id: any) {
    this.screeningService.resAddress(id).subscribe((id) => {
    });
  }
  addtypeChange(data: any) {
    this.screeningService.compData = { compName: "Address" }
    const addressType = this.compBaseDetails.addressType.find(f => f.lookUpId === data);
    if (addressType) {
      this.addressForm.get('addressTypeLookupId')?.setValue(addressType.lookUpId);
      if (addressType.lookUpName === 'Current Address') {
        this.sameCurrentadd = false;
        this.periodofStayadd.next(this.currentAddress.candidate.address)
        this.addressForm.get('periodOfStay')?.setValue(this.currentAddress.candidate.periodOfStay)
        this.addressForm.get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
      }
      else if (addressType.lookUpName === "Permanent Address") {
        this.sameCurrentadd = true;
        this.addressForm.get('address')?.reset();
        this.addressForm.get('periodOfStay')?.setValue(null)
        this.addressForm.get('periodOfStayTo')?.setValue(null)
        this.addressForm.get('address')?.get('addressId')?.setValue(0);
        this.permanentaddressFetch();
      }
      else {
        this.sameCurrentadd = false;
        this.addressForm.get('address')?.reset();
        this.addressForm.get('periodOfStay')?.setValue(null)
        this.addressForm.get('periodOfStayTo')?.setValue(null)
        this.addressForm.get('address')?.get('addressId')?.setValue(0);
      }
    }
  }

  chengeAddress(daata: any) {
    if (daata.checked === true) {
      this.addressForm.get('checkPermanentAddress')?.setValue(daata.checked);
      this.periodofStayadd.next(this.currentAddress.candidate.address);
      this.addressForm.get('periodOfStay')?.setValue(this.currentAddress.candidate.periodOfStay)
      this.addressForm.get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
    } else {
      this.addressForm.get('checkPermanentAddress')?.setValue(daata.checked);
      this.addressForm.get('address')?.reset();
      this.addressForm.get('periodOfStay')?.setValue(null)
      this.addressForm.get('periodOfStayTo')?.setValue(null)
      this.addressForm.get('address')?.get('addressId')?.setValue(0);
      this.permanentaddressFetch();
    }
  }
  notProvidevalidation(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('toDate')?.setErrors({ incorrect: true });
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('toDate')?.setErrors(null);
    }
  }
  notprovidedco(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors(null);
    }
  }
  notprovidedmail(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors(null);
    }
  }
  dateCompare(from, to) {
    return this.fb.group({
      UntypedFormGroup: this.addressForm
    },
      {
        validator: this.common.dateCompareFile('periodOfStay',
          'periodOfStayTo')
      },
    );
  }
  checkCurrentEmp() {
    const fresherEmploye = this.mainForm.get(this.formgroupName).get('fresherFlag')?.value;
    if (fresherEmploye == false) {
      this.chengeCurrentEmp();
    }
    else {
      this.showTopCenter(
        'warn',
        'Failure Message',
        'Please Select One Choice'
      );
      this.mainForm.get(this.formgroupName).get('currentEmployerFlag')?.setValue(false);
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  permanentaddressFetch() {
    let pList: any[] = [];
    const subList = this.screeningService.componentList ?
      this.screeningService.componentList.filter(x => x.screeningSubComponent.length > 0 && x.compName === this.common.ADDRESS || x.compName === this.common.ADDRESS_GEO) : [];
    if (subList.length > 0) {
      pList = subList[0].screeningSubComponent.filter(x => x.subCompName === 'Permanent Address');
    }
    if (pList.length > 0 && this.screeningService.compFormArray.value.length > 0) {
      this.screeningService.compFormArray.value.forEach(ele => {
        if (ele.compId === pList[0].compId) {
          ele.component.forEach(ee => {
            if (ee.screeningComponentInfo.subCompId === pList[0].subCompId) {
              this.periodofStayadd.next(ee.compRef.address);
              this.addressForm.get('periodOfStay')?.setValue(ee.compRef.periodOfStay)
              this.addressForm.get('periodOfStayTo')?.setValue(ee.compRef.periodOfStayTo)
            }
          });
        }
      });
    }
  }
  CheckDoc(event: any) {
    if (event.value) {
      this.nFlag = false;
      this.ctcreqFlag = false;
      this.reasonForLeavingFalg = true;
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(true);
      this.mainForm['controls']['compRef']['controls']['reasonForLeaving'].setValidators(Validators.required);
      const compRef =  this.mainForm['controls']['compRef']['controls'] as UntypedFormGroup;
      const fields = [
          'holdFlag','ctc'
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
      this.ctcreqFlag = true;
      this.reasonForLeavingFalg = false;
      this.mainForm['controls']['compRef']['controls']['reasonForLeaving'].clearValidators();
      this.mainForm['controls']['compRef']['controls']['reasonForLeaving'].updateValueAndValidity();
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
    this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].disable();
    }
   
  }

}

