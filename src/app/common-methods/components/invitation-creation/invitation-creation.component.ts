import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';

import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { AutoCompleteDropDown } from '../../models/autoComplete';
import { ScreeningService } from '../../services/screening.service';
import { CaseCreation } from '../../models/case-creation';
import { BreadcrumbFlags } from '../../models/breadcrumb-flags';
import {
  CaseComponentVm, CaseSubComponentVm, InvitationVm, SaveInvitation,
  CaseCreationView, CaseEntry, CommonComponentVm, CcList
} from '../../../common-methods/models/caseCreationView';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
// import { MatChipInputEvent, MatDialog, MatMenuTrigger, MatTabGroup, MatTableDataSource } from '@angular/material/dialog';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ScreeningDetails } from '../../models/screening-details';
import { MailTemplate, MailData, MailAttachment } from 'src/app/common-methods/mail-templates/mail-template';
import { MasterService } from '../../services/master.service';
import { DatePipe } from '@angular/common';
import { Site } from '../../models/site';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { AdditionalComponentComponent } from 'src/app/case/additional-component/additional-component.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ScrollToErrorDirective } from 'src/app/common-methods/directive/scroll-to-error.directive';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-invitation-creation',
  templateUrl: './invitation-creation.component.html',
  styleUrls: ['./invitation-creation.component.css']
})
export class InvitationCreationComponent implements OnInit, OnDestroy {
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 20;
  chargeCodeFlag = false;
  caseCreationColumns: { field: string; header: string; }[];
  step1 = 0;
  packlist: any[] = [];
  scopelist: any[] = [];
  mattableSource = new MatTableDataSource([]);
  packtableSource = new MatTableDataSource([]);
  tableColumnsheadersd: string[] = ['compName', 'noOfComponent', 'price'];
  packColumnsheaders: string[] = ['compName', 'noOfComponent'];
  compbar = [{ menuName: 'Select Components' }, { menuName: 'Component Review' }];
  caseComponentList: any;
  itemPerPage;
  packComponent: any[] = [];
  packPrice: any;
  packName: any;
  email: UntypedFormArray;
  showMorepackage = false;
  showMorepackagetwo = false;
  routePath: string = '';
  invitationFormGroup: UntypedFormGroup;
  btnSend = false;
  btnReset = false;
  invitationDetails = new invitationDetailsVm();
  btnBack = false;
  btnAdd = true;
  btnSave = false;
  btnResetTbl = true;
  btnAddDisabled = false;
  btnSendDisabled = false;
  btnSearch = true;
  screenAuth: any = {};
  tooltip = false;
  toolTip: any;
  userData: any;
  showGrid = false;
  editClick = false;
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  expiryDateLst: any[] = [];
  statusList: any[] = [];
  packagelist: any[] = [];
  caseCreation = new CaseCreation();
  breadcrumbFlags = new BreadcrumbFlags();
  viewData: any;
  invitationList: any[] = [];
  errormsg: string;
  screeningDetails = new ScreeningDetails();
  invitationAuditList: any[] = [];
  @ViewChild('tab', { static: true }) tab!: MatTabGroup;

@ViewChild('invitetab', { static: true }) invitetab!: Table;

@ViewChild('dt') dt!: Table;           // static: true → removed (conditional in template)

@ViewChild('dtable') dtable!: Table;

@ViewChild('global', { static: true }) global!: ElementRef;

@ViewChild('NotCompletedSubcheckAlert', { static: true }) NotCompletedSubcheckAlert: any;

@ViewChild(AdditionalComponentComponent, { static: true }) addComp!: AdditionalComponentComponent;

@ViewChild('uploadConfirm', { static: true }) uploadConfirm!: TemplateRef<any>;

@ViewChild('referencenumberTrigger', { static: true }) referencenumberTrigger!: MatMenuTrigger;

@ViewChild('clientNameTrigger', { static: true }) clientNameTrigger!: MatMenuTrigger;

@ViewChild('candidateNameTrigger', { static: true }) candidateNameTrigger!: MatMenuTrigger;

@ViewChild('getTemplate', { static: true }) getTemplate!: TemplateRef<any>;

  // @ViewChild('tab', { static: true }) tab: MatTabGroup;
  // @ViewChild('invitetab', { static: true }) invitetab: DataTable;
  //  @ViewChild('dt', { static: false }) dt!: Table;
  // @ViewChild('global', { static: true }) global!: ElementRef;
  // @ViewChild('NotCompletedSubcheckAlert', { static: true }) NotCompletedSubcheckAlert;
  addComp2 :any;
  // @ViewChild(AdditionalComponentComponent) addComp: AdditionalComponentComponent;
  // @ViewChild('dtable', { static: true }) dtable!: Table;
  //@ViewChild('uploadConfirm', { static: true }) uploadConfirm!: TemplateRef<any>;
  // @ViewChild('referencenumberTrigger', { static: true }) referencenumberTrigger: MatMenuTrigger;
  //@ViewChild('clientNameTrigger', { static: true }) 
// clientNameTrigger!: MatMenuTrigger;
  // @ViewChild('candidateNameTrigger', { static: true }) candidateNameTrigger: MatMenuTrigger;
  // @ViewChild('getTemplate', { static: true }) getTemplate;

  checkCopy = false;
  frozenCols = [{ field: 'action', header: 'Action' }];
  invitationcols = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'clientReferenceNo', header: 'Reference No' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'firstName', header: 'Candidate Name' },
  ];
  searchUser = new UntypedFormControl();

  viewColumns: any[] = [];
  gridColumns: any[] = [];
  gridData: any[] = [];

  isEditFlag: boolean;
  statusId: any;
  componentList: any[] = [];
  // tslint:disable-next-line: no-use-before-declare
  dataValue = new DataValue();
  packComponentList: any[] = [];
  caseComponentVm = new CaseComponentVm();
  caseComponent: CaseComponentVm[];
  caseSubComponent: CaseSubComponentVm[];
  invitationobj = new InvitationVm();
  saveInvitation = new SaveInvitation();
  contentHeader: string;
  index: number;
  caseDetails: any;
  compid: number;
  compBaseDetailslist: any;
  page = 1;
  dupComponentList: any[] = [];
  dialogRef: any;
  caseFlag: boolean;
  clientControls!: AutoCompleteDropDown;
  clients: any[] = [];
  sites: any[] = [];
  sitefilterlist: any[] = [];
  clientHasSite: boolean;
  sitekeyUp = false;
  isFocused = false;
  caseCreationList: CaseEntry[] = [];

  saveCase = new CaseCreation();
  applicantIdColumnName: '';
  tableForm: UntypedFormGroup;

  showFlag = false;
  currencyControls!: AutoCompleteDropDown;
  currencyList: any[] = [];
  commonControls: CommonComponentVm;
  compEditValues: CommonComponentVm;
  referencenumberCtrl = new UntypedFormControl();
  referencenumberFilteredOptions: Observable<string[]>;
  clientNameCtrl = new UntypedFormControl();
  clientNamesFilteredOptions: Observable<string[]>;
  candidateNameCtrl = new UntypedFormControl();
  candidateNameFilteredOptions: Observable<string[]>;
  type: string;
  editCaseList: any;
  consentList: any[] = [];
  searchFlag = false;
  edit: any;
  invi: any[] = [];
  tableColumnsheaders = [
    { field: 'referenceNo', header: 'Reference No' },
    { field: 'firstName', header: 'Candidate Name' },
    { field: 'emailId', header: 'EmailId' },
    { field: 'clientName', header: 'Email Status' },
    { field: 'caseComponent', header: 'Components' }];
  dataList: any[] = [];  
  selectable = true;
  removable = true;
  addOnBlur = true;
  CcList: CcList[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  ccList: any[] = [];
  dAPreQcSubcheckFlag: any;
  statusLookUpId: any;
  headerText: string;
  messageText: string;

  constructor(private agentEntryService: AgentEntryMasterService, private authService: AuthService, private router: Router,
    public common: CommonService, private scroll: ScrollToErrorDirective,
    private formBuilder: UntypedFormBuilder, public screenService: ScreeningService, private message: MessageService,
    public dialog: MatDialog, public master: MasterService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.routePath = this.common.subCheckFlag !== true ? 'Direct App / Scope Invitation' : 'Direct App / Create Invitation';
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.showGrid = true;
    this.initFormGroup();
    this.getExpiryDateLst();

    if (this.common.subCheckFlag !== true && this.router.url !== '/dashboard/screening/subCheckInvitation') {
      this.getGridData();
    } else {
      this.searchCase();
    }
    if (this.router.url === '/dashboard/screening/subCheckInvitation') {
      this.routePath = 'Direct App / Sub Check Invitation';
      this.searchCase();
    }
    this.getClients();
    this.getPackageComponentList(0);
    this.screenService.GetConsentType().subscribe(resp => {
      if (resp) {
        this.consentList = resp;
      }
    });
    this.itemPerPage = 10;
  }

  initFormGroup() {
    this.invitationFormGroup = this.formBuilder.group(
      {
        active: [true],
        loggedIn: new UntypedFormControl(this.userData.userId),
        invitationId: [0],
        packageId: [],
        compId: [''],
        subCompId: [''],
        noOfComponent: [''],
        clientId: [],
        siteId: [],
        noOfCases: [],
        applicantId: [],
        currencyId: [''],
        compReceivedDate: [new Date()],
        compInitiationDate: [new Date()]
      });
    this.tableForm = this.formBuilder.group({
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
        '', this.invitationFormGroup, false, false, true);
    this.currencyControls = new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencyList,
      '', this.invitationFormGroup, false, false, false);
  }

  // get grid detail list
  getGridData() {
    this.gridData = [];
    this.screenService.getCreateInvitationData(this.userData.applicationId, this.userData.teamId, this.userData.userId)
      .subscribe(createInvitation => {
        this.invitationList = createInvitation;
        this.invitationList.forEach(element => {
          element.firstName = element.firstName + ' ' + element.middleName + ' ' + element.lastName;
        });
        this.userTblAutoFilters();
      });
  }

  // get expiry date list for auto-complete
  getExpiryDateLst() {
    this.screenService.getExpiryDateLst().subscribe(res => {
      if (res) {
        this.expiryDateLst = res.invitationExpiryDays;
        this.statusList = res.invitationStatus;
      }
    });
  }
  checkvalidEmail(emailId, ind) {
    if (emailId) {
      if (!this.isEditFlag) {
        this.invitationFormGroup.controls.invitationId.setValue(0);
      }
      this.screenService.checkValidEmailId(this.invitationFormGroup.controls.loggedIn.value, emailId).subscribe(resp => {
        if (!resp.success) {
          this.caseCreationList.forEach((ele, i) => {
            this.tableForm.get('emailId' + i).setErrors({ incorrect: true });
          });
        }
      });
    }
  }

  breadCrumbFlags() {
    this.btnResetTbl = !this.btnResetTbl;
    this.btnSend = this.btnSend;
    this.btnReset = !this.btnReset;
    this.btnBack = !this.btnBack;
  }
  resetForm() {
    this.tblReset();
    this.compEditValues.packComponent = [];
    this.compEditValues.compCommonLists.packageId = 0;
    this.invitationFormGroup.reset();
    this.invitationFormGroup.markAsPristine();
    this.invitationFormGroup.markAllAsTouched();
    this.compEditValues.compCommonLists.caseComponent = [];
  }
  closeForm() {
    this.breadCrumbFlags();
    if (this.router.url === '/dashboard/screening/subCheckInvitation') {
      this.router.navigate(['dashboard/home']);
    } else {
      this.routePath = 'Screening / Create Invitation';
      this.isEditFlag = false;
      this.showGrid = true;
      this.btnAdd = true;
      this.btnBack = false;
      this.btnSend = false;
      this.btnSave = false;
      this.caseFlag = false;
      this.btnAdd = true;
      this.caseCreationList = [];
      this.btnSearch = true;
      this.saveInvitation.caseComponent = [];
      this.showFlag = false;
      this.errormsg = '';
      // tslint:disable-next-line: no-use-before-declare
      this.dataValue = new DataValue();
      this.editCaseList = '';
      this.getGridData();
      this.searchFlag = false;
      this.edit = '';
      if (this.common.subCheckFlag === true) {
        this.router.navigate(['dashboard/screening/multipleinvitation']);
        this.common.subCheckFlag = false;
      }
    }
  }
  tblReset() {
    if (this.searchFlag === true) {
      this.searchUser.setValue('');
      this.invitationList = [];
    } else {
      this.invitetab.reset();
      this.global.nativeElement.value = '';
    }
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.invitetab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  // get package list and component list for auto-complete
  getPackageComponentList(clientId: any) {
    this.screenService.getPackageAndComponentList(clientId, true).subscribe(res => {
      if (res) {
        this.packagelist = res.package;
        this.componentList = res.component.map((m) => {
          m.subCompFlag = m.subCompFlag === null ? false : m.subCompFlag;
          m.ischecked = false;
          m.disable = false;
          m.active = true;
          m.remarks = '';
          return m;
        });

        this.componentList.forEach((el) => {
          if (el.subCompFlag) {
            el.packageSubComponent.forEach(m1 => {
              m1.ischecked = false;
              m1.disable = false;
              m1.active = true;
              m1.remarks = '';
            });
          }
        });
        this.commonControls = new CommonComponentVm(this.invitationFormGroup, this.caseComponent, this.saveInvitation,
          this.packagelist, this.componentList, this.caseCreation.clientId, this.edit, 'invitation');
      }
    });
  }

  getCaseDetailsByClientId(data: any) {
    this.caseCreation.clientId = data;
    this.screenService.getDetailsByClientId(data).subscribe(resp => {
      if (resp) {
        this.caseDetails = resp;
        this.applicantIdColumnName = this.caseDetails.applicantIdColumnName;
      }
    });
  }
  // Manage Invitation click events
  editInvitation(rowData, type: string) {
    this.type = type;
   
    if (this.searchFlag !== true) {
      this.dataValue = rowData;
    }
    this.btnSearch = false;
    if (type === 'invite') {
      this.routePath = 'Screening / Create Invitation';
      this.btnSend = false;
      this.caseFlag = false;
      this.saveInvitation.caseComponent = [];
      this.btnAdd = false;
      if (rowData) {
        this.getPackageComponentList(rowData.clientId);
        this.toolTip = 'Send Invitation';
        this.searchFlag === true ? this.btnBack = !this.btnBack : this.btnBack = false;
        this.breadCrumbFlags();
        this.initFormGroup();
        this.breadcrumbFlags.toolTip = 'Save';
        if (this.searchFlag !== true) {
          this.showGrid = !this.showGrid;
        }
        
        this.invitationFormGroup.patchValue({
          email: this.dataValue.email,
          invitationExpiryDate: this.dataValue.invitationExpiryDate,
        });
      }
      if (this.searchFlag === true) {
        this.screenService.GetInvitationComponent(rowData.invitationId).subscribe(res => {
          if (res) {
            this.edit = res;
            this.dataValue = res;

            if (this.packagelist.length > 0 &&res.packageId>0) {
                          const packName = this.packagelist.find(x => x.packageId === res.packageId);
                          this.packName = packName.packageName;
                          this.packPrice = packName.price;
                        }
            
            this.showGrid = false;
            this.scopelist = this.edit.caseComponent;
          this.packlist = this.edit.packageComponent;
              this.commonControls = new CommonComponentVm(this.invitationFormGroup, this.caseComponent, this.saveInvitation,
              this.packagelist, this.componentList, this.caseCreation.clientId, res, 'invitation');
            this.dataValue.clientName = rowData.clientName;
            this.dataValue.clientReferenceNo = this.searchFlag === true && this.edit ? this.edit.clientRefNo :
              rowData.clientReferenceNo;
            this.dataValue.siteNo = this.searchFlag === true && this.edit ? this.edit.siteNo
              : rowData.siteNo;
            this.dataValue.siteName = rowData.siteName;
            this.dataValue.candidateName = rowData.firstName;
            this.dataValue.applicationId = rowData.applicationId;
            this.dataValue.emailId = this.searchFlag === true && this.edit ? this.edit.emailId : rowData.emailId;
            this.dataValue.phoneNo = this.searchFlag === true && this.edit ? this.edit.phoneNo : rowData.phoneNo;
            let expiry: any;
            let status: any;
            if (this.edit && this.searchFlag === true) {
              const ex = this.expiryDateLst.find(x => x.lookUpId === this.edit.invitationExpiryLookupId);
              if (ex.lookUpName === '1') {
                expiry = ex.lookUpName + ' ' + 'day';
              } else {
                expiry = ex.lookUpName + ' ' + 'days';
              }
              status = this.consentList.find(x => x.lookUpId === this.edit.consentLookupId);
            }

            this.dataValue.invitationExpiryLookupName = this.searchFlag === true && expiry ? expiry :
              rowData.invitationExpiryLookupName;
            this.dataValue.consentLookupName = this.searchFlag === true && status.lookUpName ? status.lookUpName :
              rowData.consentLookupName;
            this.dataValue.caseNo = rowData.caseNo;
            this.dataValue.clientId = rowData.clientId;
            this.dataValue.firstName = rowData.firstName;
            this.dataValue.userName = this.searchFlag === true && this.edit ? this.edit.userName :
              rowData.userName;
            this.dataValue.password = this.searchFlag === true && this.edit ? this.edit.password :
              rowData.password;
            this.dataValue.invitationId = rowData.invitationId;
            this.dataValue.invitationExpiryDate = rowData.invitationExpiryDate;
            this.dataValue.invitationExpiryLookupId = this.searchFlag === true && this.edit ? this.edit.invitationExpiryLookupId :
              rowData.invitationExpiryLookupId;
          }
        });
      }

    }
    if (type === 'case') {
      this.getSiteLocation(rowData.clientId);
      this.addInvitation();
      this.btnReset = false;
      this.screenService.GetInvitationByInvitationId(rowData.invitationId).subscribe(resp => {
        if (resp) {
          this.editCaseList = resp;
          this.invitationFormGroup.controls.siteId.disable();
          this.invitationFormGroup.controls.clientId.disable();
          this.invitationFormGroup.controls.siteId.setValue(resp.siteId);
          this.invitationFormGroup.controls.clientId.setValue(resp.clientId);
          this.invitationFormGroup.value.siteId = this.invitationFormGroup.controls.siteId.value;
          this.invitationFormGroup.value.clientId = this.invitationFormGroup.controls.clientId.value;
          this.invitationFormGroup.controls.noOfCases.disable();
          this.invitationFormGroup.controls.noOfCases.setValue(1);
          const editMailList = resp.caseEntry.map(x => x.mailContact);
          if (editMailList[0].length > 0) {
            editMailList[0].forEach(ele => {
              const obj: CcList = {
                contactData: ele.contactData,
                index: 0,
                active: ele.active,
                transContactId: ele.transContactId,
                destLookupId: 0,
                destName: '',
                lookupId: 0,
                contactId: ele.contactId
              }
              this.CcList.push(obj);
            });
          }
          this.caseCountCreate();
        }
      });
    }
  }


  // component available check in form
  check() {
    const dupvalues: number[] = [];
    this.caseComponent = this.caseComponent.filter(x => x.type === 'Individual');
    this.caseComponent.forEach(e => {
      if (!dupvalues.includes(e.compId)) {
        if (this.caseComponent.filter(el => el.compId === e.compId).length > 1) {
          const copydata: CaseComponentVm[] = this.caseComponent.filter(r => r.compId === e.compId);
          this.caseComponent = this.caseComponent.filter(del => del.compId !== e.compId);
          let copydata1 = new CaseComponentVm();
          copydata.forEach((data, index) => {
            if (index === 0) {
              copydata1 = data;
            } else {
              copydata1.caseSubComponent.push(data.caseSubComponent[0]);
            }
          });
          this.caseComponent.push(copydata1);
          this.saveInvitation.caseComponent.push(copydata1);
        }
      }
      dupvalues.push(e.compId);
    });
  }
  validationCustomField() {
    if (this.caseFlag === true) {
      const controlNames = ['clientId', 'siteId', 'noOfCases', 'email', 'lookUpId'];
      for (const ctrl in this.invitationFormGroup.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (!this.invitationFormGroup.get(ctrl).value) {
            this.invitationFormGroup.get(ctrl).setValidators(Validators.required);
            this.invitationFormGroup.get(ctrl).markAsTouched();
            this.invitationFormGroup.get(ctrl).updateValueAndValidity();
          } else {
            this.invitationFormGroup.get(ctrl).clearValidators();
            this.invitationFormGroup.get(ctrl).updateValueAndValidity();
          }
        }
      }
    } else {
      const controlNames = ['clientId', 'siteId', 'noOfCases', 'email', 'lookUpId'];
      for (const ctrl in this.invitationFormGroup.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          this.invitationFormGroup.get(ctrl).clearValidators();
          this.invitationFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
    }

  }
  // create Invitation
  sendInvitation() {
    const dd = this.caseCreationList;
    this.validationCustomField();
    let compList: any[] = [];
    if (this.invitationFormGroup.valid) {
      if (this.caseFlag !== true) {
        if(this.addComp == undefined){
          this.addComp = this.addComp2;
        }
        if (this.addComp.compfrm.valid) {
          if (this.compEditValues && this.compEditValues.compCommonLists) {
            this.saveInvitation.packageId = this.compEditValues.compCommonLists.packageId;
            if (this.saveInvitation.packageId) {
              this.packComponentList = this.compEditValues.packComponent;
              this.invitationFormGroup.get('packageId')?.setValue(this.saveInvitation.packageId);
            }
          }
          
          if (this.addComp.dt.value) {
            const comprawList = this.addComp.dt.value;
            compList = comprawList.filter(f => {
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
          this.saveInvitation.packageId = this.searchFlag === false && this.saveInvitation.packageId ? this.saveInvitation.packageId : 0;
          this.saveInvitation.caseComponent = compList;
          this.saveInvitation.loggedId = this.userData.userId;
          this.saveInvitation.caseNo = this.dataValue.caseNo;
          this.saveInvitation.clientId = this.dataValue.clientId;
          this.saveInvitation.clientName = this.dataValue.clientName;
          this.saveInvitation.firstName = this.dataValue.firstName;
          this.saveInvitation.lastName = this.dataValue.lastName;
          this.saveInvitation.middleName = this.dataValue.middleName;
          this.saveInvitation.invitationStatusLookupId = this.statusList.find(f => f.lookUpName === 'Sent').lookUpId;
          this.saveInvitation.userName = this.dataValue.userName;
          this.saveInvitation.passWord = this.dataValue.password;
          this.saveInvitation.invitationId = this.dataValue.invitationId;
          this.saveInvitation.emailId = this.dataValue.emailId;
          this.saveInvitation.phoneNo = this.dataValue.phoneNo;
          this.saveInvitation.invitationExpiryLookupId = this.dataValue.invitationExpiryLookupId;
          this.saveInvitation.referenceNo = this.dataValue.clientReferenceNo;
        } else {
          Object.keys(this.addComp.compfrm.controls).forEach(key => {
            this.addComp.compfrm.controls[key].markAsTouched();
          });
        }
        if (this.saveInvitation.caseComponent.length === 0 && !this.invitationFormGroup.get('packageId')?.value) {
          this.errormsg = 'Please add atleast One Component';
          this.showTopCenter('warn', 'Failure Message', 'Please add atleast One Component');
        }
        let checkFlag: boolean;
        if ((this.saveInvitation.packageId && (this.saveInvitation.caseComponent.length === 0))
          || this.saveInvitation.caseComponent.length >= 1) {
          if (this.searchFlag === true && this.saveInvitation.caseComponent) {
            this.saveInvitation.compReceivedDate = this.invitationFormGroup.get('compReceivedDate')?.value;
            this.saveInvitation.compInitiationDate = this.invitationFormGroup.get('compInitiationDate')?.value;
            this.saveInvitation.caseComponent.forEach(ele => {
              ele.compReceivedDate = this.invitationFormGroup.get('compReceivedDate')?.value;
              ele.compInitiationDate = this.invitationFormGroup.get('compInitiationDate')?.value;
            });

          }
          let chklist: any[] = [];
          let countList: any[] = [];
          this.saveInvitation.caseComponent.forEach(ele => {
            if (ele.subCompFlag === true && ele.caseSubComponent.length > 0) {
              ele.caseSubComponent.forEach(el => {
                if (el.ischecked === true) {
                  chklist = ele.caseSubComponent.filter(x => (x.daCompValidationFlag === true && !x.daCompValidYear));
                  if (chklist.length > 0) {
                    checkFlag = false;
                    countList.push(checkFlag);
                  } else {
                    checkFlag = true;
                    countList.push(checkFlag);
                  }
                  if (el.subCheckFlag === true) {
                    ele.subCheckFlag = true;
                  }
                }
              });
            } else {
              if (ele.daCompValidationFlag === true && !ele.daCompValidYear) {
                checkFlag = false;
                countList.push(checkFlag);
              } else {
                checkFlag = true;
                countList.push(checkFlag);
              }
            }
          });
          let countFlag: boolean;
          if (countList.length > 0) {
            const val = countList.filter(x => x === false);
            if (val.length > 0) {
              countFlag === false;
            } else {
              countFlag = true;
            }
          }
          if (this.saveInvitation.packageId > 0) {
            if (this.saveInvitation.caseComponent.length === 0) {
              countFlag = true;
            }
            this.screenService.getComponentByPackageId(this.saveInvitation.packageId).subscribe(res => {
              if (res) {
                this.packComponent = res;
              }
            });
          }
          this.dataList = [];
          this.dataList.push(this.saveInvitation);
          if (countFlag === true) {
            this.screenService.createInvitation(this.saveInvitation).subscribe(res => {
              if (res.success) {
                if (this.dataList.length > 0) {
                  this.dataList[0].clientName = res.message ? res.message : '';
                }
                if (this.edit) {
                  this.showTopCenter('success', 'Success Message', 'Invitation Updated successfully');
                  this.openGetData();
                } else {
                  this.showTopCenter('success', 'Success Message', 'Invitation sent successfully');
                  this.openGetData();
                }
              }
              // **Added for Nodemail** //
              // this.sendMailInvitation(this.saveInvitation, res.message);
            });
          } else {
            return this.showTopCenter('error', 'Failed', 'Please Give Experience for Checked Component');
          }
        } else {
          this.errormsg = 'Please add atleast One Component';
          this.showTopCenter('warn', 'Failure Message', 'Please add atleast One Component');
        }
      } else {
        let ccFlag: boolean;
        this.caseCreationList.forEach((ele, i) => {
          ele.mailContact = this.CcList;
          if (ele.mailContact.length > 0) {
            const mailList = ele.mailContact.filter(x => x.index === i);
            if (mailList.length > 0) {
              ele.mailContact = mailList;
            }
          }
        });
        this.saveCase.clientId = this.invitationFormGroup.get('clientId')?.value;
        this.saveCase.siteId = this.invitationFormGroup.get('siteId')?.value;
        const mList = this.caseCreationList.map(m => m.mailContact);
        let flagList: any[] = [];
        mList.forEach(ele => {
          if (ele.length < 2) {
            ccFlag = ele.map(e => e).length < 2;
            flagList.push({ checkFlag: ccFlag });
          } else {
            ccFlag = false;
            flagList.push({ checkFlag: ccFlag });
          }
        });
        const count = flagList.filter(m => m.checkFlag === false).length;
        if (count > 0 && (count === flagList.length)) {
          ccFlag = true;
        } else {
          ccFlag = false;
        }

        this.saveCase.caseEntry = this.caseCreationList;
        this.saveCase.loggedIn = this.userData.userId;
        this.saveCase.invitationFlag = this.editCaseList && this.editCaseList.caseNo > 0 ?
          this.editCaseList.invitationFlag : true;
        this.saveCase.deptId = this.userData.deptId;
        this.saveCase.teamId = this.userData.teamId;
        this.saveCase.autoAssign = this.editCaseList && this.editCaseList.caseNo > 0 ?
          this.editCaseList.autoAssign : false;
        this.saveCase.caseNo = this.editCaseList && this.editCaseList.caseNo > 0 ?
          this.editCaseList.caseNo : 0;
        if (this.caseCreationList.length > 0 && this.tableForm.valid) {
          if (this.caseCreationList.filter(e => (e.candidateFirstName?.trim() ?? '').length < 3).length > 0) {
            this.showTopCenter('warn', 'Failure Message', 'Candidate first name should have atleast 3 characters'); return;
          }
          if (this.caseCreationList.filter(e => (e.applicantId?.trim() ?? '').length === 0).length > 0) {
            this.showTopCenter('warn', 'Failure Message', 'Please add Applicant ID'); return;
          }
          // if (ccFlag === true) {
          if (this.saveCase.caseNo === 0) {
            this.screenService.addCaseCreation(this.saveCase).subscribe(resp => {
              if (resp) {
                this.showTopCenter('success', 'Success Message', 'Case Creation Created successfully');
                this.getGridData();
                this.closeForm();
              }
            });
          } else {
            this.screenService.UpdateInvitation(this.saveCase).subscribe(resp => {
              if (resp) {
                this.showTopCenter('success', 'Success Message', 'Case Creation Updated successfully');
                this.getGridData();
                this.closeForm();
              }
            });
          }
          // } else {
          //   this.showTopCenter('warn', 'Alert', 'Fill Each case atleast 2 CC field');
          // }
        } else {
          this.caseCreationList.forEach((ele, i) => {
            this.tableForm.get('emailId' + i).markAsTouched();
            this.tableForm.get('expirelookupId' + i).markAsTouched();
            this.tableForm.get('consentLookupId' + i).markAsTouched();
          });
        }
      }
    }
  }
  openGetData() {
    const dialogRef = this.dialog.open(this.getTemplate, {
      width: '1000px',
      disableClose: true
    });
  }
  closeAll() {
    this.dialog.closeAll();
    this.getGridData();
    this.closeForm();
    this.errormsg = '';
    this.saveInvitation = new SaveInvitation();
    this.compEditValues.compCommonLists = new SaveInvitation();

  }

  // **Added for Nodemail** //
  // sendMailInvitation(data, msg) {
  //   const emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() ===
  //     this.common.INVITATION_CREATION).htmlTemplateBody;
  //   const mailTemp = new MailTemplate();
  //   mailTemp.mailbodyheader = 'Dear';
  //   const expiry = this.expiryDateLst.filter(x => x.lookUpId === data.invitationExpiryLookupId);
  //   const expiryDate = expiry[0].lookUpName;
  //   const numberValue = Number(expiryDate);
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + numberValue);
  //   mailTemp.Date = this.datePipe.transform(tomorrow, 'dd-MM-yyyy');
  //   mailTemp.candidateName = data.firstName + ' ' + data.middleName + ' ' + data.lastName;
  //   mailTemp.clientName = data.clientName;
  //   const loginData = msg.split('$$$');
  //   mailTemp.userName = loginData[0];
  //   mailTemp.password = loginData[1];
  //   console.log(mailTemp);
  //   const mailData = new MailData();
  //   mailData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //   this.master.sendEmail(mailData).subscribe(resp => {
  //     this.showTopCenter('success', 'Success', resp['message']);
  //   });
  // }

  checkFilterComponents() {
    if (this.saveInvitation.packageId > 0) {
      let complen: any[] = [];
      const compList: any[] = [];
      const compsublen: any[] = [];
      let compListsub: any[] = [];
      const submaxlist: any[] = [];
      const compInd: any[] = [];
      if (this.packComponentList && this.packComponentList.length > 0) {
        // main component filters while package select save
        const maxsavelist = this.componentList.filter(x => x.maxNoOfComp === 1 && x.subCompFlag !== true);
        if (maxsavelist && maxsavelist.length > 0) {
          // const mainComp = maxsavelist.filter(x => x.subCompFlag !== true);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < maxsavelist.length; i++) {
            const indList = this.saveInvitation.caseComponent.filter(x => x.type === 'Individual'
              && x.compId === maxsavelist[i].componentId);
            if (indList && indList.length > 0) {
              compInd.push(indList[0]);
            }
          }
          if (compInd && compInd.length > 0) {
            this.packComponentList.forEach((ee) => {
              complen = compInd.filter(x => x.compId === ee.componentId && x.componentType === ee.compName);
              if (complen && complen.length > 0) {
                compList.push(complen[0]);
              }
            });
          }
        }
        if (compList) {
          compList.forEach((ele) => {
            if (!ele.packageSubComponent) {
              this.dupComponentList = compList;
            }
          });
        }
        // sub component filters
        const subFilterList = this.saveInvitation.caseComponent.filter(x => x.caseSubComponent.length > 0);
        subFilterList.forEach(ex => {
          const packmaxlist = ex.caseSubComponent.filter(x => x.maxNoOfComp === 1 && ex.type === 'Individual');
          if (packmaxlist.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            submaxlist.push(packmaxlist[0]);
          }
        });
        let sublen: any[] = [];
        if (submaxlist.length > 0) {
          submaxlist.forEach((el) => {
            this.packComponentList.forEach((comp) => {
              if (comp.packageSubComponent && comp.packageSubComponent.length > 0 && comp.packageSubComponent !== null) {
                sublen = comp.packageSubComponent.filter(x => x.subCompId === el.subCompId);
                if (sublen.length > 0) {
                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < sublen.length; i++) {
                    compsublen.push(sublen[i]);
                  }
                }
              }
            });
          });
        }
        if (compsublen && compsublen.length > 0) {
          compListsub = compsublen;
        }
        if (compListsub && compListsub.length > 0) {
          this.dupComponentList = compListsub;
        }
      }
      if (this.dupComponentList && this.dupComponentList.length > 0) {
        let comp: any[] = [];
        this.dupComponentList.forEach((ele) => {
          this.caseComponent = this.saveInvitation.caseComponent;
          if (!ele.caseSubComponent) {
            comp = this.caseComponent.filter(x => x.compId === ele.compId);
          } else {
            comp = this.caseComponent.filter(x => x.subCompName === ele.subCompName);
          }
        });
      } else {
        this.caseComponent = this.saveInvitation.caseComponent;
      }
    } else {
      this.caseComponent = this.saveInvitation.caseComponent;
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  dialogClose() {
    this.dialog.closeAll();
    this.closeForm();
  }

  private userTblAutoFilters(): void {
    this.candidateNameFilteredOptions = this.candidateNameCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.invitationList.map(x => x.firstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNamesFilteredOptions = this.clientNameCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.invitationList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.referencenumberFilteredOptions = this.referencenumberCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.invitationList.map(x => x.clientReferenceNo).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }

  searchCaseClear(val: any) {
    if (!val) {
      this.invitationList = [];
    }
  }
  applypagination(excelFlag: any) {
    this.userData.pageSize = excelFlag === true ? Number(this.shieveTotalCount) : this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = '';
    this.userData.sorts = '';
    //this.userData.sorts = '';
    this.userData.applyPaging = (excelFlag === true) ? false : true;
    this.userData.needTotal = true;
  }
  searchList(excelFlag: any) {
    if (this.searchUser.value) {
      this.invitationDetails.statusLookUpId = 0;
      this.applypagination(excelFlag);
      this.invitationDetails.applicationId = this.userData.applicationId;
      this.invitationDetails.teamId = this.userData.teamId;
      this.invitationDetails.userId = this.userData.userId;
      this.invitationDetails.applyPaging = true;
      this.invitationDetails.page = 1;
      this.invitationDetails.pageSize = 10;
      this.invitationDetails.filters ="clientReferenceNo=="+this.searchUser.value.toUpperCase();
      this.screenService.getManageInvitationData(this.invitationDetails).subscribe(resp => {
        const manageInviteList = resp.body;
        manageInviteList.map(m => {
          const day = m.invitationExpiryDate;
          const fulldate = new Date(m.invitationSendDate);
          m.invitationExpiryDate = (new Date(fulldate.setDate(fulldate.getDate() + day)));
        });
        manageInviteList.forEach(element => {
          element.firstName = element.firstName + ' ' + element.middleName + ' ' + element.lastName;
        });
        this.invi = manageInviteList.filter(x => (x.clientReferenceNo ? x.clientReferenceNo : '') ===
          this.searchUser.value.toUpperCase());
          this.invi.forEach(ele =>{
            this.dAPreQcSubcheckFlag = ele.sendDAsubcheckToDEPreQCFlag;
            this.statusLookUpId = ele.statusLookUpId;
         })
         //// VTS2-2023-CRT-0116 - Ajith :- CRT adds a sub-check to the candidate login it should not be sent as invite instead it should be sent to DE Pre-QC subcheck queue  
         if (this.dAPreQcSubcheckFlag  && this.statusLookUpId !== 212) {
           this.headerText = 'Alert!'
           this.messageText = "The case invitation was not yet approved, hence it is not possible to add sub-check."
           this.dialogRef = this.dialog.open(this.NotCompletedSubcheckAlert, {
             width: '320px',
             disableClose: true
           });
         }
         else {
           if (this.invi.length > 0) {
             this.invitationList = this.invi;
           } else {
             this.invitationList = [];
             this.showTopCenter('warn', 'Failure Message', 'Your search result was not found');
           }
         }
      });
    }
  }
  addInvitation() {
    this.getExpiryDateLst();
    this.CcList = [];
    this.btnSearch = false;
    this.caseFlag = true;
    this.showGrid = false;
    this.toolTip = 'Send Invitation';
    this.btnAdd = false;
    this.breadCrumbFlags();
    this.initFormGroup();
    this.btnSend = false;
    this.btnSave = true;
    this.editClick = !this.editClick;
    this.editClick = true;
    this.breadcrumbFlags.toolTip = 'Save';
    this.getClients();
    this.routePath = 'Screening / Case Creation';
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
      }
    });
  }
  enableNoCases() {
    if (this.invitationFormGroup.controls.clientId.value === null ||
      this.invitationFormGroup.controls.siteId.value === null) {
      this.invitationFormGroup.controls.noOfCases.disable();
    } else if (this.invitationFormGroup.controls.clientId.value !== null &&
      this.invitationFormGroup.controls.siteId.value !== null) {
      this.invitationFormGroup.controls.noOfCases.enable();
    }
  }
  getClientId(clientId: any) {
    if (clientId) {
      this.chargeCodeFlag = this.clients.some(x => x.clientId === clientId && x.chargeCodeFlag === true);
      if (this.clients.find(x => x.clientId === clientId).agreementPendingFlag === true) {
        this.showTopCenter('warn', 'Failure Message', 'The client has pending in agreement approval...');
        this.invitationFormGroup.get('clientId')?.setValue(null); return;
      } else {
        this.sites = [];
        this.invitationFormGroup.controls.siteId.setValue(undefined);
        if (!this.dataValue) {
          this.invitationFormGroup.controls.noOfCases.setValue(undefined);
        }
        setTimeout(() => {
          this.getSiteLocation(clientId);
        }, 20);
        this.getCaseDetailsByClientId(clientId);
        this.invitationFormGroup.controls.siteId.enable();
      }
    }
  }
  siteItems(value: any) {
    if (!value) { this.assignCompCopy(); }
    if (value) {
      this.sitefilterlist = Object.assign([], this.sites).filter(
        item => ((item.siteNoWithsiteName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignCompCopy() {
    this.sitefilterlist = Object.assign([], this.sites);
  }
  getSiteLocation(clientId: any) {
    this.screenService.getSiteNoByClientId(clientId).subscribe((resp) => {
      if (resp) {
        resp.map(e => {
          e.siteNoWithsiteName = e.siteNo + '-' + e.siteName;
        });
        this.sites = resp;
        this.siteItems('');
      }
      if (resp.length === 0) {
        this.invitationFormGroup.get('siteId')?.disable();
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
  caseCountCreate() {
    this.tableForm = new UntypedFormGroup({});
    if (this.invitationFormGroup.get('noOfCases')?.value <= 15) {
      this.caseCreationList = [];
      const currval = +(this.invitationFormGroup.controls.noOfCases.value);
      const listLength = this.caseCreationList.length;
      let expireId: any;
      if (this.editCaseList && this.editCaseList.caseEntry[0].invitationExpiryLookupId > 0 && this.expiryDateLst.length > 0) {
        expireId = this.expiryDateLst.find(x => x.lookUpId === this.editCaseList.caseEntry[0].invitationExpiryLookupId);
      }
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
            applicantId: this.editCaseList && this.editCaseList.caseEntry.length > 0 ? this.editCaseList.caseEntry[0].applicantId : 'N/A',
            doj: this.editCaseList && this.editCaseList.caseEntry.length > 0 && this.editCaseList.caseEntry[0].doj
            ? new Date(this.editCaseList.caseEntry[0].doj): null,
            candidateFirstName: this.editCaseList && this.editCaseList.caseEntry.length > 0 ?
              this.editCaseList.caseEntry[0].candidateFirstName : '',
            candidateLastName: this.editCaseList && this.editCaseList.caseEntry.length > 0 ?
              this.editCaseList.caseEntry[0].candidateLastName : '',
            candidateMiddleName: this.editCaseList && this.editCaseList.caseEntry.length > 0 ?
              this.editCaseList.caseEntry[0].candidateMiddleName : '',
            clientReferenceNo: '',            
            caseRefNo: '',
            employeeId: this.editCaseList && this.editCaseList.caseEntry.length > 0 ?
              this.editCaseList.caseEntry[0].employeeId : 0,
            candidateId: this.editCaseList && this.editCaseList.caseEntry.length > 0 ?
              this.editCaseList.caseEntry[0].candidateId : 0,
            contactId: 0,
            chargeCode: this.editCaseList && this.editCaseList.caseEntry.length > 0 ?
              this.editCaseList.caseEntry[0].chargeCode : '',
            screeningOwnerId: 0,
            clientName: '',
            siteName: '',
            tat: 0,
            caseNo: this.editCaseList && this.editCaseList.caseNo ? this.editCaseList.caseNo : 0,
            phoneNo: this.editCaseList && this.editCaseList.caseEntry.length > 0 ? this.editCaseList.caseEntry[0].phoneNo : '',
            emailId: this.editCaseList && this.editCaseList.caseEntry.length > 0 ? this.editCaseList.caseEntry[0].emailId : '',
            invitationExpiryLookupId: this.editCaseList && this.editCaseList.caseEntry.length > 0 ? expireId.lookUpId : 0,
            consentLookupId: this.editCaseList && this.editCaseList.caseEntry.length > 0 ?
              this.editCaseList.caseEntry[0].consentLookupId : 0,
            invitationId: this.dataValue && this.dataValue.invitationId > 0 ?
              this.dataValue.invitationId : 0,
            mailContact: this.CcList
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
    if (this.chargeCodeFlag === true) {
      this.caseCreationColumns = [
        { field: 'sno', header: 'S.No' },
        { field: 'chargeCode', header: 'Charge Code' },
        { field: 'applicantId', header: 'ApplicantId' },
        { field: 'candidateFirstName', header: 'First Name' },
        { field: 'candidateMiddleName', header: ' Middle Name' },
        { field: 'candidateLastName', header: 'Last Name' },
        { field: 'phoneNo', header: 'Mobile Number' },
        { field: 'emailId', header: 'Email' },
        { field: 'contactData', header: 'CC' },
        { field: 'invitationExpiryLookupId', header: 'Expiry Days' },
        { field: 'consentLookupId', header: 'Consent Types' },
        { field: 'action', header: 'Action' }
      ];
    } else {
      this.caseCreationColumns = [
        { field: 'sno', header: 'S.No' },
        { field: 'applicantId', header: 'ApplicantId' },
        { field: 'candidateFirstName', header: 'First Name' },
        { field: 'candidateMiddleName', header: ' Middle Name' },
        { field: 'candidateLastName', header: 'Last Name' },
        { field: 'phoneNo', header: 'Mobile Number' },
        { field: 'emailId', header: 'Email' },
        { field: 'contactData', header: 'CC' },
        { field: 'invitationExpiryLookupId', header: 'Expiry Days' },
        { field: 'consentLookupId', header: 'Consent Types' },
        { field: 'action', header: 'Action' }
      ];
    }
  }
  isExist(colField, index, value, header, data) {
    if (colField !== 'candidateFirstName' &&
      colField !== 'candidateMiddleName' &&
      colField !== 'candidateLastName') {
      if (value?.length === 0) { return; }
      let isExist: boolean = colField === 'applicantId' ? ('' + (value).trim() === 'N/A') : false;
      if (!isExist) {
        isExist = this.caseCreationList.filter(e => e[colField].toLowerCase() !== 'n/a' && e[colField] === '' + (value).trim()).length > 1;
        if (colField === 'contactData' && data.mailContact.length > 0) {
          isExist = data.mailContact.filter(e => e[colField] === '' + (value).trim()).length > 1;
          const duplist = data.mailContact.filter((v, i, a) => a.findIndex(t => (t.contactData === v.contactData && t.value === v.value)) === i)
          this.CcList = duplist;
          data.mailContact = this.CcList;
        }
        if (colField === 'emailId') {
          if (isExist) {
            this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
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
            let appFlag = false;
            if (this.editCaseList && this.editCaseList.caseEntry.length > 0 && data.invitationId > 0) {
              if (value === this.editCaseList.caseEntry[index].applicantId) {
                appFlag = true;
              } else {
                appFlag = false;
              }
            }
            if (!appFlag) {
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
        }
        if (colField === 'chargeCode' && (value.toLowerCase() !== 'n/a' && value.toLowerCase() !== 'na')) {
          let chargeFlag = false;
          if (this.editCaseList && this.editCaseList.caseEntry.length > 0 && data.invitationId > 0) {
            if (value === this.editCaseList.caseEntry[index].chargeCode) {
              chargeFlag = true;
            } else {
              chargeFlag = false;
            }
          }
          if (!chargeFlag && (value.toLowerCase() !== 'n/a' || value.toLowerCase() !== 'na')) {
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
  showall() {
    if (this.invitationList.length > 0) {
      this.itemPerPage = this.invitationList.length;
    }
  }
  deleteRow(ind: any) {
    this.caseCreationList.splice(ind, 1);
    this.showTopCenter('success', 'success Message', 'Deleted Successfully');
    this.tableForm.removeControl('phoneNo' + ind);
    this.tableForm.removeControl('emailId' + ind);
    this.tableForm.removeControl('contactData' + ind);
    this.tableForm.removeControl('expirelookupId' + ind);
    this.tableForm.removeControl('consentLookupId' + ind);
  }

  getCommonValues(e: CommonComponentVm) {
    this.compEditValues = e;
    this.errormsg = '';
  }
  getHeader() {
    if (this.common.subCheckFlag === true) {
      return 'Sub Check Invitation';
    } else if (this.btnSearch !== true && this.caseFlag !== true && this.showGrid === true || this.router.url === '/dashboard/screening/subCheckInvitation') {
      return 'Sub Check Invitation';
    } else {
      return 'Scope Invitation';
    }

  }
  searchCase() {
    this.btnSearch = false;
    this.invitationList = [];
    this.btnReset = true;
    this.btnBack = true;
    this.btnAdd = false;
    this.btnResetTbl = false;
    this.searchFlag = true;
    this.searchUser.setValue('');
  }
  addMail(event: MatChipInputEvent, type, i) {
    const input = event.input;
    const value = event.value;
    if (type === 'CC') {
      if ((value || '').trim()) {
        if (this.common.EmailRegX.test(value)) {
          const ccvalue = value;
          // this.ccList.push(ccvalue);
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
            this.CcList.push(obj);
            this.ccList = this.CcList;
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
  removeControl(ind, type, i) {
    if (type === 'CC') {
      this.ccList.splice(ind, 1);
    }
  }
  ngOnDestroy() {
    this.common.subCheckFlag = false;
  }
  stepperChange(index: number) {
    const data = document.getElementsByClassName('list');
  }
  goToStep(selectedIndex: any) {
    this.step1 = selectedIndex;
    this.caseComponentList = [];
    if (this.step1 === 0) {
        this.step1 = 0;
        this.btnSend = false;
        this.tab.selectedIndex = 0;
        this.stepperChange(0);
        const add = this.invitationFormGroup.value;
        this.breadcrumbFlags.btnSave = false;
     }
   if (this.step1 !== 0) {
   if (this.step1 === 1) {   
    
    this.addComp2 = this.addComp;    
    const dd = this.caseCreationList;
    this.validationCustomField();
    let compList: any[] = [];
    if (this.invitationFormGroup.valid) {
      this.btnSend = true;
      if (this.caseFlag !== true) {
        if (this.addComp.compfrm.valid) {
          if (this.compEditValues && this.compEditValues.compCommonLists) {
            this.saveInvitation.packageId = this.compEditValues.compCommonLists.packageId;
            if (this.saveInvitation.packageId) {
              this.packComponentList = this.compEditValues.packComponent;
              this.invitationFormGroup.get('packageId')?.setValue(this.saveInvitation.packageId);
            }
          }
          if (this.addComp.dt.value) {
            const comprawList = this.addComp.dt.value;
            compList = comprawList.filter(f => {
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
          
          this.saveInvitation.packageId = this.searchFlag === false && this.saveInvitation.packageId ? this.saveInvitation.packageId : 0;
          this.saveInvitation.caseComponent = compList;
          this.saveInvitation.loggedId = this.userData.userId;
          this.saveInvitation.caseNo = this.dataValue.caseNo;
          this.saveInvitation.clientId = this.dataValue.clientId;
          this.saveInvitation.clientName = this.dataValue.clientName;
          this.saveInvitation.firstName = this.dataValue.firstName;
          this.saveInvitation.lastName = this.dataValue.lastName;
          this.saveInvitation.middleName = this.dataValue.middleName;
          this.saveInvitation.invitationStatusLookupId = this.statusList.find(f => f.lookUpName === 'Sent').lookUpId;
          this.saveInvitation.userName = this.dataValue.userName;
          this.saveInvitation.passWord = this.dataValue.password;
          this.saveInvitation.invitationId = this.dataValue.invitationId;
          this.saveInvitation.emailId = this.dataValue.emailId;
          this.saveInvitation.phoneNo = this.dataValue.phoneNo;
          this.saveInvitation.invitationExpiryLookupId = this.dataValue.invitationExpiryLookupId;
          this.saveInvitation.referenceNo = this.dataValue.clientReferenceNo;
        } else {
          Object.keys(this.addComp.compfrm.controls).forEach(key => {
            this.addComp.compfrm.controls[key].markAsTouched();
          });
        }
        const caseComponent = this.common.CloneObject(compList);
        caseComponent.forEach(ele => {
          if (ele.subCompFlag === true && ele.caseSubComponent.length > 0) {
            ele.caseSubComponent.forEach(el => {
              this.caseComponentVm = new CaseComponentVm();
              if (el.ischecked === true) {
                this.caseComponentVm.compName = ele.compName + ' - ' + el.subCompName;
                this.caseComponentVm.noOfComponent = el.noOfComponent;
                this.caseComponentVm.price = el.price;
                let tblList: any;
                this.caseComponentList.push(this.caseComponentVm);
                tblList = this.caseComponentList;

              }
            });
          } else {
            this.caseComponentList.push(ele);
          }
        });

          this.mattableSource = this.caseComponentList;
        if (this.saveInvitation.caseComponent.length === 0 && !this.invitationFormGroup.get('packageId')?.value) {
          this.errormsg = 'Please add atleast One Component';
          this.showTopCenter('warn', 'Failure Message', 'Please add atleast One Component');
          this.step1 = 0;
          this.tab.selectedIndex = 0;
          this.invitationFormGroup.markAllAsTouched();
          this.scroll.scrollToError();
          
        }
        let checkFlag: boolean;
        if ((this.saveInvitation.packageId && (this.saveInvitation.caseComponent.length === 0))
          || this.saveInvitation.caseComponent.length >= 1) {
          if (this.searchFlag === true && this.saveInvitation.caseComponent) {
            this.saveInvitation.compReceivedDate = this.invitationFormGroup.get('compReceivedDate')?.value;
            this.saveInvitation.compInitiationDate = this.invitationFormGroup.get('compInitiationDate')?.value;
            this.saveInvitation.caseComponent.forEach(ele => {
              ele.compReceivedDate = this.invitationFormGroup.get('compReceivedDate')?.value;
              ele.compInitiationDate = this.invitationFormGroup.get('compInitiationDate')?.value;
            });

          }
          let chklist: any[] = [];
          let countList: any[] = [];
          this.saveInvitation.caseComponent.forEach(ele => {
            if (ele.subCompFlag === true && ele.caseSubComponent.length > 0) {
              ele.caseSubComponent.forEach(el => {
                if (el.ischecked === true) {
                  chklist = ele.caseSubComponent.filter(x => (x.daCompValidationFlag === true && !x.daCompValidYear));
                  if (chklist.length > 0) {
                    checkFlag = false;
                    countList.push(checkFlag);
                  } else {
                    checkFlag = true;
                    countList.push(checkFlag);
                  }
                  if (el.subCheckFlag === true) {
                    ele.subCheckFlag = true;
                  }
                }
              });
            } else {
              if (ele.daCompValidationFlag === true && !ele.daCompValidYear) {
                checkFlag = false;
                countList.push(checkFlag);
              } else {
                checkFlag = true;
                countList.push(checkFlag);
              }
            }
          });
          let countFlag: boolean;
          if (countList.length > 0) {
            const val = countList.filter(x => x === false);
            if (val.length > 0) {
              countFlag === false;
            } else {
              countFlag = true;
            }
          }
          if (this.saveInvitation.packageId > 0) {
            if (this.saveInvitation.caseComponent.length === 0) {
              countFlag = true;
            }
            this.screenService.getComponentByPackageId(this.saveInvitation.packageId).subscribe(res => {
              if (res) {
                this.packComponent = res;
              }
            });
          }
          this.dataList = [];
          this.dataList.push(this.saveInvitation);
          if (countFlag === true) {
            this.step1 = 1;
            this.tab.selectedIndex = 1;           
            
          }else{
            this.step1 = 0;
            this.tab.selectedIndex = 0;
            this.invitationFormGroup.markAllAsTouched();
            this.scroll.scrollToError();
            return this.showTopCenter('error', 'Failed', 'Please Give Experience for Checked Component');
          }
        } else {
          this.step1 = 0;
            this.tab.selectedIndex = 0;
            this.invitationFormGroup.markAllAsTouched();
             this.scroll.scrollToError();
          this.errormsg = 'Please add atleast One Component';
          this.showTopCenter('warn', 'Failure Message', 'Please add atleast One Component');
        }
      } else {
        let ccFlag: boolean;
        this.caseCreationList.forEach((ele, i) => {
          ele.mailContact = this.CcList;
          if (ele.mailContact.length > 0) {
            const mailList = ele.mailContact.filter(x => x.index === i);
            if (mailList.length > 0) {
              ele.mailContact = mailList;
            }
          }
        });
        this.saveCase.clientId = this.invitationFormGroup.get('clientId')?.value;
        this.saveCase.siteId = this.invitationFormGroup.get('siteId')?.value;
        const mList = this.caseCreationList.map(m => m.mailContact);
        let flagList: any[] = [];
        mList.forEach(ele => {
          if (ele.length < 2) {
            ccFlag = ele.map(e => e).length < 2;
            flagList.push({ checkFlag: ccFlag });
          } else {
            ccFlag = false;
            flagList.push({ checkFlag: ccFlag });
          }
        });
        const count = flagList.filter(m => m.checkFlag === false).length;
        if (count > 0 && (count === flagList.length)) {
          ccFlag = true;
        } else {
          ccFlag = false;
        }

        this.saveCase.caseEntry = this.caseCreationList;
        this.saveCase.loggedIn = this.userData.userId;
        this.saveCase.invitationFlag = this.editCaseList && this.editCaseList.caseNo > 0 ?
          this.editCaseList.invitationFlag : true;
        this.saveCase.deptId = this.userData.deptId;
        this.saveCase.teamId = this.userData.teamId;
        this.saveCase.autoAssign = this.editCaseList && this.editCaseList.caseNo > 0 ?
          this.editCaseList.autoAssign : false;
        this.saveCase.caseNo = this.editCaseList && this.editCaseList.caseNo > 0 ?
          this.editCaseList.caseNo : 0;
        if (this.caseCreationList.length > 0 && this.tableForm.valid) {
          if (this.caseCreationList.filter(e => (e.candidateFirstName?.trim() ?? '').length < 3).length > 0) {
            this.showTopCenter('warn', 'Failure Message', 'Candidate first name should have atleast 3 characters'); return;
          }
          if (this.caseCreationList.filter(e => (e.applicantId?.trim() ?? '').length === 0).length > 0) {
            this.showTopCenter('warn', 'Failure Message', 'Please add Applicant ID'); return;
          }
         
        } else {
          this.caseCreationList.forEach((ele, i) => {
            this.tableForm.get('emailId' + i).markAsTouched();
            this.tableForm.get('expirelookupId' + i).markAsTouched();
            this.tableForm.get('consentLookupId' + i).markAsTouched();
          });
        }
      }
    }    
  }
 }
  }
}
export class DataValue {
  clientName: string;
  clientReferenceNo: any;
  siteNo: any;
  siteName: string;
  candidateName: string;
  applicationId: any;
  phoneNo: string;
  emailId: string;
  cc: string;
  invitationExpiryLookupName: string;
  consentLookupName: string;
  invitationExpiryLookupId: number;
  invitationId: number;
  password: any;
  userName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  clientId: number;
  caseNo: any;
  email: any;
  invitationExpiryDate: any;
}
export class invitationDetailsVm {
  pageSize: number;
  page: number;
  filters: string;
  sorts: string;
  applyPaging: boolean;
  needTotal: boolean;
  statusLookUpId: number;
  applicationId: number;
  teamId: number;
  userId: number;
}