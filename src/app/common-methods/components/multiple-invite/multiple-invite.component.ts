import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {  MatDialog,  } from '@angular/material/dialog';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { AdditionalComponentComponent } from 'src/app/case/additional-component/additional-component.component';
import { ScrollToErrorDirective } from '../../directive/scroll-to-error.directive';
import { AutoCompleteDropDown } from '../../models/autoComplete';
import {
  CaseComponentVm, CaseCreationView, CaseSubComponentVm, CommonComponentVm,
  SaveInvitation, CaseEntry, CcList
} from '../../models/caseCreationView';

import { CommonService } from '../../services/common.service';
import { ScreeningService } from '../../services/screening.service';
import { Router } from '@angular/router';
import { ENTER } from '@angular/cdk/keycodes';
import { COMMA } from '@angular/cdk/keycodes';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { AuthService } from '../../services/auth.service';
import { Table } from 'primeng/table';
import { AnyCnameRecord } from 'dns';

@Component({
  standalone: false,
  selector: 'app-multiple-invite',
  templateUrl: './multiple-invite.component.html',
  styleUrls: ['./multiple-invite.component.css']
})
export class MultipleInviteComponent implements OnInit {
  caseCreationColumns: { field: string; header: string; }[];
  chargeCodeFlag = false;
  @ViewChild('dtable', { static: true }) dtable!: Table;
  dataList: any[];
  routePath = 'Direct App / Create Invitation';
  invitationFormGroup: UntypedFormGroup = new UntypedFormGroup({
    noOfComponent: new UntypedFormControl(''),
    clientId: new UntypedFormControl('', Validators.required),
    siteId: new UntypedFormControl('', Validators.required),
    packageId: new UntypedFormControl()
  });
  userData: any;
  tableForm: UntypedFormGroup = new UntypedFormGroup({});
  clientControls!: AutoCompleteDropDown;
  currencyControls!: AutoCompleteDropDown;
  clients: any[] = [];
  sites: any[] = [];
  sitefilterlist: any[] = [];
  caseDetails: any;
  menubar = [{ menuName: 'Select Components' }, { menuName: 'Candidate Review' }];

  @ViewChild('history') history!: TemplateRef<any>;
  btnSave = true;
  btnReset = true;
  toolTip = 'Save';
  applicantIdColumnName: '';

  compColumns = [
    { field: 'compName', header: 'Component Name' },
    { field: 'noOfComponent', header: 'No of Component' },
    { field: 'price', header: 'Price' },
  ];
  sitekeyUp = false;
  currencyList: any[] = [];
  step1 = 0;
  commonControls: CommonComponentVm;
  caseComponent: CaseComponentVm[];
  caseComponentVm = new CaseComponentVm();
  caseSubComponent: CaseSubComponentVm[];
  saveInvitation = new SaveInvitation();
  packagelist: any[] = [];
  componentList: any[] = [];
  compEditValues: CommonComponentVm;
  // @ViewChild(AdditionalComponentComponent) addComp: AdditionalComponentComponent;
  @ViewChild(AdditionalComponentComponent) addComp!: AdditionalComponentComponent;
  packName: any;
  packComponent: any[] = [];
  packPrice: any;
  caseCreationList: CaseEntry[] = [];
  expiryDateLst: any[] = [];
  statusList: any[] = [];
  consentList: any[] = [];
  screenAuth:any;
  noOfCases = new UntypedFormControl();
  // tslint:disable-next-line: no-use-before-declare
  mergeInvite = new MultipleCaseCreation();
  caseComponentList: any;
  mattableSource = new MatTableDataSource([]);
  packtableSource = new MatTableDataSource([]);
  tableColumnsheaders: string[] = ['compName', 'noOfComponent', 'price'];
  packColumnsheaders: string[] = ['compName', 'noOfComponent'];
  packComponentList: any;
  btnSearch = true;
  tabledetailsColumnsheaders = [
    { field: 'sNo', header: 'S.No' },
    { field: 'caseRefNo', header: 'ReferenceNo' },
    { field: 'clientReferenceNo', header: 'Candidate Name' },
    { field: 'applicantId', header: 'Application Id' },
    { field: 'emailId', header: 'EmailId' },
    { field: 'clientName', header: 'Email Status' }];

  // @ViewChild('getTemplate', { static: true }) getTemplate;
  @ViewChild('getTemplate') getTemplate!: TemplateRef<any>;
  selectable = true;
  removable = true;
  addOnBlur = true;
  CcList: CcList[] = [];
  @ViewChild(MatTabGroup) tab!: MatTabGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  ccList: any[] = [];
  constructor(private formBuilder: UntypedFormBuilder, private message: MessageService, public common: CommonService,
    public screenService: ScreeningService, private scroll: ScrollToErrorDirective, private router: Router,
    public dialog: MatDialog, public authService: AuthService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);

    this.getClients();
    this.getExpiryDateLst();
    this.screenService.GetConsentType().subscribe(resp => {
      if (resp) {
        this.consentList = resp;
      }
    });
    this.initFormGroup();
    this.goToStep(0);
  }
  searchCase() {
    this.common.subCheckFlag = true;
    this.router.navigate(['dashboard/screening/createinvitation']);
  }
  initFormGroup() {
    this.invitationFormGroup = this.formBuilder.group(
      {
        noOfComponent: [''],
        clientId: ['', Validators.required],
        siteId: ['', Validators.required],
        packageId: []
      });
    this.tableForm = this.formBuilder.group({
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
        '', this.invitationFormGroup, false, false, true);
    this.currencyControls = new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencyList,
      '', this.invitationFormGroup, false, false, false);
  }
  getClients() {
    const data = new CaseCreationView();
    data.teamId = this.userData.teamId;
    data.applicationId = this.userData.applicationId;
    data.clientId = this.userData.clientId;
    data.teamName = this.userData.teamName;
    this.screenService.getInvitationClientName(data).subscribe(resp => {
      if (resp) {
        this.clients = resp;
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
            '', this.invitationFormGroup, false, false, true);
      }
    });
  }
  getpacakge(clientId, invitationFlag,siteId){
    this.screenService.getCasePackageComponent(clientId, invitationFlag,siteId).subscribe(resp => {
      if (resp) {
        this.packagelist = resp.package;
        this.componentList = resp.component.map((m) => {
          m.subCompFlag = m.subCompFlag === null ? false : m.subCompFlag;
          m.ischecked = false;
          m.disable = false;
          m.active = true;
          return m;
        });
        this.componentList.forEach((el) => {
          if (el.subCompFlag) {
            el.packageSubComponent.forEach(m1 => {
              m1.ischecked = false;
              m1.disable = false;
              m1.active = true;
              // return m1;
            });
          }
        });
        this.commonControls = new CommonComponentVm(this.invitationFormGroup, this.caseComponent, this.saveInvitation,
          this.packagelist, this.componentList, clientId, '', 'invitation');
      }
    });
  }
  getPacakgebysiteId(value: any) {    
    if (value > 0) {
      this.getpacakge(this.invitationFormGroup.get('clientId')?.value,true,value);
    }
  }
  getClientId(clientId: any) {
    if (clientId) {
      this.chargeCodeFlag = this.clients.some(x => x.clientId === clientId && x.chargeCodeFlag === true);
      const invitationFlag = true;
       if (this.clients.find(x => x.clientId === clientId).agreementPendingFlag === true) {
        this.showTopCenter('warn', 'Failure Message', 'The client has pending in agreement approval...');
        this.invitationFormGroup.get('clientId')?.setValue(null); return;
      } else {
        this.sites = [];
        this.invitationFormGroup.controls.siteId.setValue(undefined);
        setTimeout(() => {
          this.getSiteLocation(clientId);
        }, 20);
        this.getCaseDetailsByClientId(clientId);
        this.invitationFormGroup.controls.siteId.enable();
      }
    }
  }
  getCommonValues(e: CommonComponentVm) {
    this.compEditValues = e;
    this.packComponent = this.compEditValues.packComponent;
  }
  enableNoCases() {
    if (this.invitationFormGroup.controls.clientId.value === null ||
      this.invitationFormGroup.controls.siteId.value === null) {
      this.noOfCases.disable();
    } else if (this.invitationFormGroup.controls.clientId.value !== null &&
      this.invitationFormGroup.controls.siteId.value !== null) {
       this.noOfCases.enable();
    }
  }
  getCaseDetailsByClientId(data: any) {
    this.screenService.getDetailsByClientId(data).subscribe(resp => {
      if (resp) {
        this.caseDetails = resp;
        this.applicantIdColumnName = this.caseDetails.applicantIdColumnName;
    }
    });
  }
  assignCompCopy() {
    this.sitefilterlist = Object.assign([], this.sites);
  }
  siteItems(value: any) {
    if (!value) { this.assignCompCopy(); }
    if (value) {
      this.sitefilterlist = Object.assign([], this.sites).filter(
        item => ((item.siteNoWithsiteName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  getSiteLocation(clientId: any) {
    this.screenService.getSiteNoByClientId(clientId).subscribe((resp) => {
      if (resp) {
        resp.map(e => {
          e.siteNoWithsiteName = e.siteNo + '-' + e.siteName;
        });
        this.sites = resp;
        this.siteItems('');
        this.packagelist = [];
        this.componentList = [];
      }
      if (resp.length === 0) {
        this.invitationFormGroup.get('siteId')?.disable();
        this.getpacakge(clientId,true,0);      
        this.sitefilterlist = [];
      }
    });
  }
  siteKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const comp = this.sites.filter(e =>
          e.siteNoWithsiteName.toLowerCase() === value.toLowerCase());
        if (comp.length > 0) {
          this.sitekeyUp = true;
        } else {
          this.sitekeyUp = true;
        }
      } else {
        this.sitekeyUp = false;
      }
    }
  }
  checkVal(value: any) {
    const data: any = this.sitefilterlist.filter(e => e.siteNoWithsiteName.toLowerCase().trim() ===
      value.toLowerCase().trim());
    if (data.length > 0) {
      const datax = data[0];
      this.invitationFormGroup.controls.siteId.setValue(datax.siteId);
      this.invitationFormGroup.controls.siteId.setErrors(null);
    } else {
      this.invitationFormGroup.controls.siteId.setErrors({ incorrect: true });
    }
  }
  get displaySiteFn() {
    const compNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.sitefilterlist && this.sitefilterlist.length > 0) {
          comp = this.sitefilterlist.find(x => x.siteId === comp);
          if (comp.siteNoWithsiteName) {
            return comp.siteNoWithsiteName;
          }
        } else {
          return null;
        }
      }
    };
    return compNew;
  }
  goToStep(selectedIndex: any) {
    this.step1 = selectedIndex;
    if (this.step1 === 0) {
      this.step1 = 0;
      if (this.tab) { this.tab.selectedIndex = 0; }
      this.stepperChange(0);
      const add = this.invitationFormGroup.value;
    }
    if (this.step1 !== 0) {
      if (this.step1 === 1) {
        // if (this.saveInvitation.caseComponent.length === 0) {
          // this.saveInvitation.caseComponent = [];
          this.noOfCases.setValue('');
          this.noOfCases.clearValidators();
          this.noOfCases.updateValueAndValidity();
          if (this.invitationFormGroup.valid && (this.invitationFormGroup.controls.clientId.value > 0 &&
            this.invitationFormGroup.controls.siteId.value > 0)) {

            if (this.addComp && this.addComp.compfrm.valid) {
              if (this.addComp && this.addComp.dt.value) {
                let compList: any[] = [];
                const comprawList = this.addComp.dt.value;
                this.saveInvitation.caseComponent = compList = comprawList.filter(f => {
                  if (f.subCompFlag) {
                    f.caseSubComponent = f.packageSubComponent.filter(f1 => f1.ischecked === true);
                    if (f.caseSubComponent.length > 0) {
                      return true;
                    }
                  } else {
                    return f.ischecked;
                  }
                });
              }
            }
          }
        // }
        if (this.saveInvitation.caseComponent.length > 0 || this.invitationFormGroup.controls.packageId.value > 0) {
          this.caseComponentList = [];
          const caseComponent = this.saveInvitation.caseComponent;
          let chklist: any[] = [];
          let checkFlag: boolean;
          let countList: any[] = [];
          caseComponent.forEach(ele => {
            if (ele.subCompFlag === true && ele.caseSubComponent.length > 0) {
              chklist = ele.caseSubComponent.filter(x => (x.daCompValidationFlag === true && !x.daCompValidYear));
              ele.caseSubComponent.forEach(el => {
                this.caseComponentVm = new CaseComponentVm();
                if (el.ischecked === true) {
                  this.caseComponentVm.compName = ele.compName + ' - ' + el.subCompName;
                  this.caseComponentVm.noOfComponent = el.noOfComponent;
                  this.caseComponentVm.price = el.price;
                  let tblList: any;
                  this.caseComponentList.push(this.caseComponentVm);
                  tblList = this.caseComponentList;
                  if (chklist.length > 0) {
                    checkFlag = false;
                    countList.push(checkFlag);
                    return this.showTopCenter('error', 'Failed', 'Please Give Experience for Checked Component');
                  } else {
                    checkFlag = true;
                    countList.push(checkFlag);      
                  }
                }
              });
            } else {
              this.caseComponentList.push(ele);
              if (ele.daCompValidationFlag === true && !ele.daCompValidYear) {
                checkFlag = false;
                countList.push(checkFlag);
              } else {
                checkFlag = true;
                countList.push(checkFlag);
              }
            }
          });
          if (countList.length > 0) {
            const val = countList.filter(x => x === false);
            if (val.length > 0) {
              this.step1= 0;
              if (this.tab) { this.tab.selectedIndex = 0; }
              return this.showTopCenter('error', 'Failed', 'Please Give Experience for Checked Component');
            } else {
              this.step1=1;
              if (this.tab) { this.tab.selectedIndex = 1; }
            }
          }
          this.mattableSource = this.caseComponentList;
          if (this.invitationFormGroup.controls.packageId.value > 0) {
            this.screenService.getComponentByPackageId(this.invitationFormGroup.controls.packageId.value).subscribe(res => {
              if (res) {
                this.packComponent = res;
              }
            });
            if (this.packagelist.length > 0) {
              const packName = this.packagelist.find(x => x.packageId === this.invitationFormGroup.controls.packageId.value);
              this.packName = packName.packageName;
              this.packPrice = packName.price;
            }
            if (this.packComponent.length > 0) {
              const pcomp: any[] = [];
              const packComp = this.packComponent;
              packComp.forEach(ele => {
                if (ele.packageSubComponent && ele.packageSubComponent.length > 0) {
                  ele.packageSubComponent.forEach(el => {
                    this.caseComponentVm = new CaseComponentVm();
                    this.caseComponentVm.compName = ele.compName + ' - ' + el.subCompName;
                    this.caseComponentVm.noOfComponent = el.noOfComponent;
                    this.caseComponentVm.price = this.packPrice;
                    pcomp.push(this.caseComponentVm);
                  });
                  this.packComponentList = pcomp;
                } else {
                  ele.price = this.packPrice;
                  pcomp.push(ele);
                  this.packComponentList = pcomp;
                }
              });
            }
            this.packtableSource = this.packComponentList;
            this.step1 = 1;
            if (this.tab) { this.tab.selectedIndex = 1; }
          }
          this.stepperChange(selectedIndex);
        } else {
          this.invitationFormGroup.markAllAsTouched();
          if (this.tab) { this.tab.selectedIndex = 0; }
          this.step1 = 0;
          this.scroll.scrollToError();
          this.showTopCenter('warn', 'Alert', 'Please select atleast one component or package');
        }
      } else {
        this.invitationFormGroup.controls.clientId.setValidators(Validators.required);
        this.invitationFormGroup.controls.clientId.updateValueAndValidity();
        this.invitationFormGroup.controls.clientId.markAsTouched();
        this.invitationFormGroup.controls.siteId.setValidators(Validators.required);
        this.invitationFormGroup.controls.siteId.updateValueAndValidity();
        this.invitationFormGroup.controls.siteId.markAsTouched();
        if (this.tab) { this.tab.selectedIndex = 0; }
        this.step1 = 0;
        this.scroll.scrollToError();
      }
    }
  }
  isExist(colField, index, value, header, data) {
    if (colField !== 'candidateFirstName' &&
      colField !== 'candidateMiddleName' &&
      colField !== 'candidateLastName') {
      if (value && value.length === 0) { return; }
      let isExist: boolean = colField === 'applicantId' ? ('' + (value).trim() === 'N/A') : false;
      if (!isExist) {
        if(value != ''){
          isExist = this.caseCreationList.filter(e => {
            const fieldVal = ((e as any)[colField] != null ? '' + (e as any)[colField] : '');
            return (fieldVal.toLowerCase() !== 'n/a' || fieldVal.toLowerCase() !== 'na') && fieldVal === '' + (value).trim();
          }).length > 1;
        }
        if (colField === 'contactData' && data.mailContact.length ) {
          isExist = data.mailContact.filter(e => e[colField] === '' + (value).trim()).length > 1;
          const duplist = data.mailContact.filter((v, i, a) => a.findIndex(t => (t.contactData === v.contactData && t.value === v.value)) === i)
          this.CcList = duplist;
          data.mailContact = this.CcList;
        }
        // if (colField === 'contactData' && data.mailContact.length > 0 ) {
        //   let dupList = this.caseCreationList[index].mailContact.filter(e => e.contactData == data.mailContact[index].contactData)
        //   console.log(dupList);
        //   let alert = this.caseCreationList[index].mailContact.includes(data.mailContact[index].contactData)
        //   if(alert: any) {
        //     this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
        //   }
        // }
        if (colField === 'emailId') {
          if (isExist) {
            this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
            this.caseCreationList[index][colField] = '';
            return;
          }
          this.checkMailid(value);
        }
        if (isExist && colField !== 'emailId' && (colField === 'chargeCode' && value.toLowerCase() !== 'n/a' && value.toLowerCase() !== 'na')) {
          this.caseCreationList[index][colField] = '';
          this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
          return;
        }
        if (!isExist) {
          if (colField === 'applicantId') {
            this.screenService.CheckApplicantId(value, this.invitationFormGroup.controls.clientId.value).subscribe(e => {
              if (e) { isExist = (!e.success); }
              if (isExist) {
                this.caseCreationList[index][colField] = '';
                this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
                return;
              }
            });
          }
        }
        if (colField === 'chargeCode' && (value.toLowerCase() !== 'n/a' && value.toLowerCase() !== 'na')) {
          this.screenService.CheckChargeCode(value, this.invitationFormGroup.controls.clientId.value).subscribe(e => {
            if (e === true) {
              this.caseCreationList[index][colField] = '';
              this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
              return;
            }
          });
        }
      }
    }
  }
  checkMailid(mailid: any) {
    this.authService.CheckClientBasedUserEmail(mailid, this.invitationFormGroup.controls.clientId.value).subscribe(resp => {
      if (resp === true) {
        const popupData = {
          action: this.common.ALERT,
          bodyText: 'Invitation already send to' + ' ' + mailid + ',' + ' ' + 'would you like to proceed with this Email ID'
        };
        const dialogRef = this.dialog.open(CommonAlertsComponent, {
          width: '400px',
          data: popupData,
          disableClose: true
        });
      }
    });
  }
  stepperChange(index: number) {
    const data = document.getElementsByClassName('list');
    // if (data.length > 0) {
    // data[index].classList.add('active');
    // data[index].classList.add('completed');
    //   for (let i = 0; i < data.length; i++) {
    //     if (index === i) {
    //       data[i].classList.add('active');
    //     } else {
    //       data[i].classList.remove('active');
    //     }
    //   // }
    // }
  }
  caseCountCreate() {
    this.caseCreationList = [];
    if (this.noOfCases.value <= 15) {
      this.tableForm = new UntypedFormGroup({});
      this.caseCreationList = [];
      const currval = +(this.noOfCases.value);
      const listLength = this.caseCreationList.length;
      // if (this.editCaseList && this.editCaseList.caseEntry[0].invitationExpiryLookupId > 0 && this.expiryDateLst.length > 0) {
      //   expireId = this.expiryDateLst.find(x => x.lookUpId === this.editCaseList.caseEntry[0].invitationExpiryLookupId);
      // }
      if (currval === listLength) { return false; }
      if (currval === 0) { this.caseCreationList = []; }
      const ifAdd = currval > listLength ? true : false;
      if (currval > listLength) {
        for (let index = 0; index < +(currval - listLength); index++) {
          this.tableForm.addControl('phoneNo' + index, new UntypedFormControl('',
            Validators.compose([Validators.minLength(10), Validators.pattern(/^[- 0-9]+$/)])));
          this.tableForm.addControl('emailId' + index, new UntypedFormControl('', [Validators.compose([Validators.required,
          Validators.pattern(this.common.EmailRegX), Validators.minLength(1)])]));
          this.tableForm.addControl('contactData' + index, new UntypedFormControl('', [Validators.compose([
            Validators.pattern(this.common.EmailRegX), Validators.minLength(1)])]));
          this.tableForm.addControl('expirelookupId' + index, new UntypedFormControl(null, [Validators.compose([Validators.required])]));
          this.tableForm.addControl('consentLookupId' + index, new UntypedFormControl(null));
          this.caseCreationList.push({
            applicantId: 'N/A',
            doj: null,
            candidateFirstName: '',
            candidateLastName: '',
            candidateMiddleName: '',
            clientReferenceNo: '',
            caseRefNo: '',
            candidateId: 0,
            employeeId:'N/A',
            contactId: 0,
            chargeCode: '',
            screeningOwnerId: 0,
            clientName: '',
            siteName: '',
            tat: 0,
            caseNo: 0,
            emailId: '',
            invitationExpiryLookupId: 0,
            consentLookupId: 0,
            invitationId: 0,
            phoneNo: '',
            packageId: this.invitationFormGroup.controls.packageId.value > 0 ?
              this.invitationFormGroup.controls.packageId.value : 0,
            caseComponent: this.saveInvitation.caseComponent.length > 0 ? this.saveInvitation.caseComponent : [],
            mailContact: []
          });
        }
      } else { this.caseCreationList.length = currval; }
      if (this.caseCreationList.length > 0) {
        const getElementsByClassName: any = document.getElementsByClassName('p-edit');
        if (getElementsByClassName) {
          if (getElementsByClassName.length > 0) {
            getElementsByClassName[0].click();
          }
        }
      }
    } else {
      this.showTopCenter('warn', 'Info Message', 'Count should not allow above 15 Candidates');
    }
  //   if(this.chargeCodeFlag === true) {
  //     this.caseCreationColumns = [
  //       { field: 'sno', header: 'S.No' },
  //       { field: 'chargeCode', header: 'Charge Code' },
  //       { field: 'applicantId', header: 'ApplicantId' },
  //       { field: 'candidateFirstName', header: 'First Name' },
  //       { field: 'candidateMiddleName', header: ' Middle Name' },
  //       { field: 'candidateLastName', header: 'Last Name' },
  //       { field: 'phoneNo', header: 'Mobile Number' },
  //       { field: 'emailId', header: 'Email' },
  //       { field: 'contactData', header: 'CC' },
  //       { field: 'invitationExpiryLookupId', header: 'Expiry Days' },
  //       { field: 'consentLookupId', header: 'Consent Types' },
  //       { field: 'action', header: 'Action' }
  //     ];    
  //   } else {
  //     this.caseCreationColumns = [
  //       { field: 'sno', header: 'S.No' },
  //       { field: 'applicantId', header: 'ApplicantId' },
  //       { field: 'candidateFirstName', header: 'First Name' },
  //       { field: 'candidateMiddleName', header: ' Middle Name' },
  //       { field: 'candidateLastName', header: 'Last Name' },
  //       { field: 'phoneNo', header: 'Mobile Number' },
  //       { field: 'emailId', header: 'Email' },
  //       { field: 'contactData', header: 'CC' },
  //       { field: 'invitationExpiryLookupId', header: 'Expiry Days' },
  //       { field: 'consentLookupId', header: 'Consent Types' },
  //       { field: 'action', header: 'Action' }
  //     ];
  //   }
  // }
  const baseColumns = [
      { field: 'sno', header: 'S.No' },
      { field: 'applicantId', header: 'ApplicantId' },
      { field: 'candidateFirstName', header: 'First Name' },
      { field: 'candidateMiddleName', header: 'Middle Name' },
      { field: 'candidateLastName', header: 'Last Name' },
      { field: 'phoneNo', header: 'Mobile Number' },
      { field: 'emailId', header: 'Email' },
      { field: 'contactData', header: 'CC' },
      { field: 'invitationExpiryLookupId', header: 'Expiry Days' },
      { field: 'consentLookupId', header: 'Consent Types' },
      { field: 'action', header: 'Action' }
    ];   
    this.caseCreationColumns = [...baseColumns];
    // Add Charge Code if enabled
    if (this.chargeCodeFlag) {
      this.caseCreationColumns.splice(1, 0, {
        field: 'chargeCode',
        header: 'Charge Code'
      });
    }

    // Add Client DOJ if enabled
    if (this.caseDetails.enableClientDOJ) {      
      this.caseCreationColumns.splice(
        this.chargeCodeFlag ? 3 : 2,
        0,
        {
          field: 'doj',
          header: 'Client Date of Joining'
        }
      );
    }
  }
  getExpiryDateLst() {
    this.screenService.getExpiryDateLst().subscribe(res => {
      if (res) {
        this.expiryDateLst = res.invitationExpiryDays;
        this.statusList = res.invitationStatus;
      }
    });
  }
  deleteRow(ind: any) {
    this.caseCreationList.splice(ind, 1);
    this.showTopCenter('success', 'success Message', 'Deleted Successfully');
    this.tableForm.removeControl('phoneNo' + ind);
    this.tableForm.removeControl('emailId' + ind);
    this.tableForm.removeControl('expirelookupId' + ind);
    this.tableForm.removeControl('consentLookupId' + ind);
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  sendInvitation() {
   // this.caseCreationList;
    let ccFlag: boolean;
    // this.caseCreationList.forEach((ele, i) => {
    //   ele.mailContact = this.CcList.filter(x =>x.index === i);
    //   if (ele.mailContact.length > 0) {
    //     const mailList = ele.mailContact.filter(x => x.index === i);
    //     if (mailList.length > 0) {
    //       ele.mailContact = mailList;
    //     }
    //   }
    // });
    // const mList = this.caseCreationList.map(m => m.mailContact);
    // let flagList: any[] = [];
    // mList.forEach(ele => {
    //   if (ele.length < 2) {
    //     ccFlag = ele.map(e => e).length < 2;
    //     flagList.push({ checkFlag: ccFlag });
    //   } else {
    //     ccFlag = false;
    //     flagList.push({ checkFlag: ccFlag });
    //   }
    // });
    // const count = flagList.filter(m => m.checkFlag === false).length;
    // if (count > 0 && (count === flagList.length)) {
    //   ccFlag = true;
    // } else {
    //   ccFlag = false;
    // }
    this.mergeInvite.caseNo = 0;
    this.mergeInvite.clientId = this.invitationFormGroup.controls.clientId.value;
    this.mergeInvite.siteId = this.invitationFormGroup.controls.siteId.value;
    this.mergeInvite.caseInitiationDate = new Date();
    this.mergeInvite.loggedIn = this.userData.userId;
    this.mergeInvite.invitationFlag = true;
    this.mergeInvite.caseEntry = this.caseCreationList;
    this.mergeInvite.deptId = this.userData.deptId;
    this.mergeInvite.teamId = this.userData.teamId;
    this.mergeInvite.autoAssign = false;
    this.mergeInvite.invitationId = 0;
    // this.mergeInvite.packageId = this.invitationFormGroup.controls.packageId.value;
    // this.mergeInvite.caseComponent = this.saveInvitation.caseComponent;
    if (this.mergeInvite.caseEntry.length > 0 && this.tableForm.valid) {
      if (this.caseCreationList.filter(e => ('' + e.chargeCode.trim()).length === 0).length > 0 && this.chargeCodeFlag === true) {
        this.showTopCenter('warn', 'Failure Message', 'Please add Charge Code'); return;
      }
      if (this.caseCreationList.filter(e => ('' + e.applicantId.trim()).length === 0).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Please add Applicant ID'); return;
      }
      if (this.caseCreationList.filter(e => ('' + e.candidateFirstName.trim()).length < 3).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Candidate first name should have atleast 3 characters'); return;
      }
      if (this.caseCreationList.filter(e => ('' + e.emailId.trim()).length === 0).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Please add Email ID'); return;
      }
      if (this.caseCreationList.filter(e => e.invitationExpiryLookupId === 0).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Please add Expiry Days'); return;
      }
      if (this.caseCreationList.filter(e => e.consentLookupId === 0).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Please add Consent Type'); return;
      }

      if (this.mergeInvite.caseEntry.length > 0) {

        this.dataList = [];
        this.dataList = this.mergeInvite.caseEntry;
        this.dataList.map(x => x.clientReferenceNo = x.candidateFirstName + ' ' + x.candidateMiddleName + ' ' + x.candidateLastName)
        this.dataList.map(x => x.applicantId = x.applicantId);
      }
      // if(ccFlag === true) {
      this.screenService.addCaseCreation(this.mergeInvite).subscribe(resp => {
        if (resp) {
          const refArray = resp.message ? resp.message.split(',') : [];
          this.dataList.forEach((ele, i) => {
            if (refArray.length > 0) {
              ele.caseRefNo = refArray[i];

              if (ele.caseRefNo.includes('Success')) {
                ele.clientName = 'Success';
              } else if (ele.caseRefNo.includes('Failure')) {
                ele.clientName = 'Failure';
              }
              ele.caseRefNo = ele.caseRefNo.split(' ', 1);
            }
          });
          this.mergeInvite = new MultipleCaseCreation();
          this.caseCreationList = [];
          this.mergeInvite.caseEntry = [];
          this.showTopCenter('success', 'Success Message', 'Invitation Created successfully');
          this.openGetData();
          this.CcList = [];
          this.initFormGroup();
          this.goToStep(0);
          this.noOfCases.setValue('');
          this.packagelist = [];
          this.componentList = [];
        }
      });
      // } 
      // else {
      //   this.showTopCenter('warn', 'Alert', 'Fill Each case atleast 2 CC field'); 
      // }
    } else {
      this.showTopCenter('warn', 'Alert Message', 'Add minimum of One candidate');
      this.noOfCases.markAsTouched();
      this.caseCreationList.forEach((ele, i) => {
        this.tableForm.get('emailId' + i).markAsTouched();
        // this.tableForm.get('contactData' + i).markAsTouched();
        this.tableForm.get('expirelookupId' + i).markAsTouched();
        this.tableForm.get('consentLookupId' + i).markAsTouched();
      });
    }
  } x
  openGetData() {
    const dialogRef = this.dialog.open(this.getTemplate, {
      width: '1000px',
      disableClose: true
    });
  }
  resetForm() {
    this.invitationFormGroup.reset();
    this.componentList = [];
    this.packagelist = [];
    this.caseCreationList = [];
    this.step1 = 0;
    this.stepperChange(0);
  }
  addMail(event: MatChipInputEvent, type, i) {
    const input = event.input;
    const value = event.value;
    if (type === 'CC') {
      if ((value || '').trim()) {
        if (this.common.EmailRegX.test(value)) {
          const ccvalue = value;
          const obj: CcList = {
            contactData: ccvalue,
            index: i,
            active: true,
            transContactId: 0,
            destLookupId: 0,
            destName: '',
            lookupId: 0,
            contactId: 0
          }
          if (obj) {
            this.caseCreationList[i].mailContact.push(obj);
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Please enter valid Email');
        }
        if (input) {
          this.tableForm.get('contactData' + i).setValue('');
        }
      }
    }
  }
  removeControl(i,ind, type) {
    if (type === 'CC') {
      this.caseCreationList[i].mailContact.splice(ind, 1);
    }
  }
}

export class MultipleCaseCreation {
  caseNo: number;
  clientId: number;
  siteId: number;
  caseReceivedDate: Date;
  caseInitiationDate: Date;
  loggedIn: number;
  invitationFlag: boolean;
  caseEntry: CaseEntry[] = [];
  clientName: string;
  candidateName: string;
  clientReferenceNo: string;
  screeningOwnerId: number;
  deptId: number;
  teamId: number;
  invitationId: number;
  applicationId: number;
  packageId: number;
  invitationStatusLookupId: number;
  caseComponent: CaseComponentVm[] = [];
  autoAssign: boolean;
}
