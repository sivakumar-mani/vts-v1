import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ScreeningService } from '../../services/screening.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { ScreeningDetails } from '../../models/screening-details';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { startWith, map } from 'rxjs/operators';
import moment from 'moment';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
@Component({
  standalone: false,
  selector: 'app-invitation-manage',
  templateUrl: './invitation-manage.component.html',
  styleUrls: ['./invitation-manage.component.css']
})
export class InvitationManageComponent implements OnInit {
  // event: LazyLoadEvent;
  // virtualDatabase: any;
  // excelVirtualDatabase: any;
  // loading: boolean;
  loading: boolean;
  event: LazyLoadEvent;
  isShowAll: boolean = false;
  isExport: boolean = false;
  searchValue: string = '';
  excelData: any;
  itemperpage;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  private skipFirstLazyLoad = false;
  ExcelFlag: boolean = false;
  reportTitle = 'Manage Invitation';
  extractedDate = new Date();
  toolTip = 'Save';
  userData: any;
  btnExcelExport = true;
  btnDownLoad = false;
  remarks = new UntypedFormControl('', Validators.required);
  routePath = 'Direct App / Manage Invitation';
  @ViewChild('dt')dt!: Table;
  @ViewChild('global')global!: ElementRef;
  @ViewChild('pdf')pdf: any;
  @ViewChild('rejectedComments')rejectedComments: any;
  manageColumns = [
    { field: 'check', header: '' },
    { field: 'invitationStatus', header: 'Status' },
    { field: 'clientReferenceNo', header: 'Reference No' },
    { field: 'applicationId', header: 'Application Id' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'firstName', header: 'Candidate Name' },
    { field: 'emailId', header: 'Email Id' },
    { field: 'phoneNo', header: 'Mobile Number' },
    { field: 'invitationSendDate', header: 'Invitation Date' },
    { field: 'invitationExpiryDate', header: 'Expiry Date' },
    { field: 'submittedDate', header: 'Submitted Date' },
    { field: 'dateOfJoining', header: 'Date Of Joining' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'packageName', header: 'Package Name' },
    { field: 'userName', header: 'User Name' },
    { field: 'cancelUserName', header: 'Cancelled By' }
  ];
  frozenCols = [{ field: 'action', header: 'Action' }];
  @ViewChild('referencenumberTrigger')referencenumberTrigger!: MatMenuTrigger;
  referencenumberCtrl = new UntypedFormControl();
  referencenumberFilteredOptions: Observable<string[]>;
  @ViewChild('clientNameTrigger')clientNameTrigger!: MatMenuTrigger;
  clientNameCtrl = new UntypedFormControl();
  clientNamesFilteredOptions: Observable<string[]>;
  @ViewChild('candidateNameTrigger')candidateNameTrigger!: MatMenuTrigger;
  candidateNameCtrl = new UntypedFormControl();
  candidateNameFilteredOptions: Observable<string[]>;
  @ViewChild('statusTrigger')statusTrigger!: MatMenuTrigger;
  statusCtrl = new UntypedFormControl();
  statusFilteredOptions: Observable<string[]>;
  @ViewChild('emailTrigger')emailTrigger!: MatMenuTrigger;
  emailCtrl = new UntypedFormControl();
  emailFilteredOptions: Observable<string[]>;
  @ViewChild('caseInitiationTrigger')caseInitiationTrigger!: MatMenuTrigger;
  @ViewChild('expiryTrigger')expiryTrigger!: MatMenuTrigger;
  fromDateTime = '';
  toDateTime = '';
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  itemPerPage;
  page = 1;

  screeningDetails = new ScreeningDetails();
  manageInviteList = [];
  filterManageInviteList = [];
  viewColumns = [];
  invitationAuditList = [];
  showcaseDetaile = false;
  editClick = true;
  compid: number;
  contentHeader: string;
  viewData: any;
  compBaseDetailslist: any;
  btnBack = false;
  btnResetTbl = true;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  isStopped = false;
  // tslint:disable-next-line: no-use-before-declare
  statusAdd = new StatusAdd();
  invitationDetails = new invitationDetailsVm();
  statusList: any;
  dataValue: any;
  headerFlag = false;
  btnSend = false;
  btnReject = false;
  selectedList = [];
  screenAuth: any = {};
  indexRow: number;
  downloadflag: any;
  constructor(public screening: ScreeningService, private datePipe: DatePipe, public common: CommonService,
    public dialog: MatDialog, private message: MessageService,
    private sharedService: SharedService , public router: Router, private auth: AuthService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data'));
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    // this.loaderHide(true)
    if (this.userData.teamName === 'DEPre-QC') {
      this.manageColumns = [
        { field: 'invitationStatus', header: 'Status' },
        { field: 'clientReferenceNo', header: 'Reference No' },
        { field: 'clientName', header: 'Client Name' },
        { field: 'firstName', header: 'Candidate Name' },
        { field: 'invitationSendDate', header: 'Invitation Date' },
        { field: 'invitationExpiryDate', header: 'Expiry Date' }
      ];
    }
    this.itemPerPage = 10;
    this.itemperpage = 4;
    this.invitationDetails.page = this.shievePageNo;
    this.invitationDetails.pageSize = this.shievePageSize;
    this.invitationDetails.needTotal = true;
    this.invitationDetails.applyPaging = true;
    this.skipFirstLazyLoad = true;
    this.getManageInviteData();
  }
  getExpiryDateLst() {
    this.screening.getExpiryDateLst().subscribe(resp => {
      if (resp) {
        this.statusList = resp;
      }
    });
  }
  globalSearch(searchvalue) {
    this.invitationDetails.needTotal = true;
    this.invitationDetails.filters = searchvalue ? "(invitationStatus|applicationId|clientReferenceNo|clientName|emailId|userName|firstName|phoneNo)@=" + searchvalue : '';
    this.invitationDetails.page = 1;
    this.getManageInviteData();
  }
  rsInvitation(type, data) {
    const popupData = {
      action: this.common.APPROVE,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to ' + type + ' this record?'
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
          if (action === this.common.APPROVE) {
            let sList: any;
            this.screening.getExpiryDateLst().subscribe(resp => {
              if (resp) {
                this.statusList = resp;
                if (this.statusList.invitationStatus.length > 0) {
                  sList = this.statusList.invitationStatus.find(x => x.lookUpName === type);
                }
                this.statusAdd.invitationId = data.invitationId;
                this.statusAdd.invitationStatusId = sList.lookUpId;
                this.statusAdd.loggedId = this.userData.userId;
              }
              this.screening.InvitationStatusUpdate(this.statusAdd).subscribe(resp => {
                if (resp) {
                  this.getManageInviteData();
                  this.showTopCenter('success', 'Success Message', (type + 'ed Successfully'));
                }
              });
            });
          }
        }
      });
    }
  }
  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;

    this.userData.page = (event.first + event.rows) / 10;
    this.userData.pageSize = 10;
    const sort = event.sortField == 'candidateName' ? 'candidateFirstName' : event.sortField
    this.userData.sorts = event.sortOrder == -1 ? "-" + sort : sort;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    if (this.skipFirstLazyLoad && this.userData.page === 1 && !event.sortField && Object.keys(event.filters).length === 0) {
      this.skipFirstLazyLoad = false;
      return;
    }
    if (Object.keys(event.filters).length > 0 || event.sortField || this.userData.page) {
      this.getManageInviteData();
    }
  }

  applypagination(){
    this.invitationDetails.pageSize = this.ExcelFlag === true ? Number(this.shieveTotalCount) : this.shievePageSize;
    this.invitationDetails.page = this.invitationDetails.page > 0 ? this.invitationDetails.page : this.shievePageNo;
    this.invitationDetails.needTotal = true;
    this.invitationDetails.applyPaging = (this.ExcelFlag === true || this.isShowAll === true) ? false : true;
  }
  getManageInviteData() {
    this.applypagination();
    this.invitationDetails.statusLookUpId = 0;
    this.invitationDetails.applicationId = this.userData.applicationId;
    this.invitationDetails.teamId = this.userData.teamId;
    this.invitationDetails.userId = this.userData.userId;
    if (this.isExport || this.isShowAll) {
      this.invitationDetails.applyPaging = false;
    } else {
      this.invitationDetails.applyPaging = true;
      this.invitationDetails.pageSize = this.shievePageSize;
      this.invitationDetails.page = this.userData.page > 0 ? this.userData.page : this.shievePageNo;
      this.invitationDetails.needTotal = true;
    }

    this.screening.getManageInvitationData(this.invitationDetails).subscribe(resp => {
      this.totalpages = resp.headers.get('X-Total-Count');
      this.manageInviteList = resp.body;
      // this.totalpages = resp.length;
      // this.manageInviteList = this.virtualDatabase.slice(this.event.first, (this.event.first + this.event.rows));
      // this.loading = false;
      // this.getExpiryDateLst();
      this.filterManageInviteList = resp.body;
      this.manageInviteList.map(m => {
        const day = m.invitationExpiryDate;
        const fulldate = new Date(m.invitationSendDate);
        m.invitationExpiryDate = (new Date(fulldate.setDate(fulldate.getDate() + day)));
      });
      this.manageInviteList.forEach(element => {
        if ((((element.invitationStatus === 'Sent' && this.userData.subTeamName !== 'DEPreQC')) ||
          ((element.invitationStatus === 'Expired') && this.userData.subTeamName !== 'DEPreQC' &&
            this.userData.subTeamName !== 'CRTScopeCreation') ||
          (((element.invitationStatus === 'Completed' && this.isStopped === false) ||
            element.invitationStatus === 'Stop') && this.userData.subTeamName !== 'CRTScopeCreation'))) {
          this.headerFlag = true;
        }
        element.firstName = element.firstName + ' ' + element.middleName + ' ' + element.lastName;
        element.cancelUserName = element.cancelUserFirstName ? element.cancelUserFirstName + ' ' + element.cancelUserLastName : 'N/A';
      });
      if (this.userData.teamName === 'DEPre-QC') {
        this.manageInviteList = this.filterManageInviteList.filter(x => x.invitationStatus === 'Approved');
      }
      this.TblAutoFilters();

    });
  }
  // loadInvite(event: LazyLoadEvent) {
  //   this.loading = true;
  //   this.event = event;
  //   setTimeout(() => {
  //     if (this.virtualDatabase) {
  //       this.manageInviteList = this.virtualDatabase.slice(event.first, (event.first + event.rows));
  //       this.loading = false;
  //     }
  //   }, 100);
  // }
  saveStatus() {
    const sendList = this.selectedList.filter(x => x.invitationStatus === 'Sent');
    const openList = this.selectedList.filter(x => x.invitationStatus === 'Expired');
    const rejectList = this.selectedList.filter(x => (x.invitationStatus === 'Completed' && this.isStopped === false)
      || x.invitationStatus === 'Stop');
    if (sendList && sendList.length >= 1) {
      const saveCase = [];
      sendList.forEach(ele => {
        const status: StatusAdd = {
          invitationId: ele.invitationId,
          loggedId: this.userData.userId,
          invitationStatusId: ele.statusLookUpId,
          remarks: ''
        };
        saveCase.push(status);
      });
      this.screening.bulkInvitationResend(saveCase).subscribe(resp => {
        this.selectedList = [];
        this.btnSend = false;
        this.showTopCenter('success', 'Success Message', 'Re-Send Successfully');
        this.getManageInviteData();
      });
    }
    if (openList.length >= 1) {
      const saveCase = [];
      openList.forEach(ele => {
        const status: StatusAdd = {
          invitationId: ele.invitationId,
          loggedId: this.userData.userId,
          invitationStatusId: ele.statusLookUpId,
          remarks: ''
        };
        saveCase.push(status);
      });
      this.screening.bulkInvitationopen(saveCase).subscribe(resp => {
        this.selectedList = [];
        this.btnSend = false;
        this.showTopCenter('success', 'Success Message', 'Re-Open Successfully');
        this.getManageInviteData();
      });
    }
    if (rejectList && rejectList.length >= 1) {
      if (this.remarks.value && this.remarks.valid) {
        this.screening.bulkInvitationReject(rejectList).subscribe(resp => {
          this.selectedList = [];
          this.btnReject = false;
          this.showTopCenter('success', 'Success Message', 'Reject Successfully');
          this.getManageInviteData();
        });
      } else {
        this.dialog.open(this.rejectedComments, {
          width: '620px'
        });
      }
    }
  }
  selectedHead(e) {
    const distinct = this.selectedList.filter((x, i, arr) => arr.findIndex(t => t.invitationStatus === x.invitationStatus) === i);
    if (e.checked === true) {
      if (distinct.length === 1) {
        this.selectedList.forEach((el) => {
          el.assignFlag = true;
          if (distinct[0].invitationStatus === 'Sent') {
            this.btnSend = true;
          } else if (distinct[0].invitationStatus === 'Expired') {
            this.btnSend = true;
          } else if ((distinct[0].invitationStatus === 'Completed' && this.isStopped === false)
            || distinct[0].invitationStatus === 'Stop') {
            this.btnReject = true;
          }
        });
      } else {
        this.showTopCenter('warn', 'Alert Message', 'Please Select the Candidate with Same Status of Invite');
        this.selectedList = [];
        e.checked = false;
        this.selectedList.forEach((ex) => {
          ex.assignFlag = false;
        });
      }
    } else {
      this.btnSend = false;
      this.btnReject = false;
    }
  }
  selectedItem(e, data) {
    if (this.selectedList.filter(x => x.invitationStatus === 'Sent').length >= 1) {
      this.btnSend = true;
      this.toolTip = 'Resend';
    } else if (this.selectedList.filter(x => x.invitationStatus === 'Expired').length >= 1) {
      this.btnSend = true;
      this.toolTip = 'Re-Open';
    } else if (this.selectedList.filter(x => (x.invitationStatus === 'Completed' && this.isStopped === false)
      || x.invitationStatus === 'Stop').length >= 1) {
      this.btnReject = true;
    }
    if (e.checked === true) {
      if (this.selectedList.length > 0) {
        if (this.selectedList.find(x => x.invitationStatus !== data.invitationStatus)) {
          const ind = this.selectedList.findIndex(x => x.invitationStatus === data.invitationStatus);
          this.showTopCenter('warn', 'Alert Message', 'Please Select the Candidate with Same Status of Invite');
          this.selectedList.splice(ind, 1);
          e.checked = false;
          data.assignFlag = false;
          if (data.invitationStatus === 'Sent') {
            this.btnSend = false;
          } else if (data.invitationStatus === 'Expired') {
            this.btnSend = false;
          } else if ((data.invitationStatus === 'Completed' && this.isStopped === false)
            || data.invitationStatus === 'Stop') {
            this.btnReject = false;
          }
        }
      } else {
        this.btnSend = false;
        this.btnReject = false;
      }
    } else {
      if (this.selectedList.length === 0) {
        this.btnSend = false;
        this.btnReject = false;
      }
    }
  }
  resetDate() {
    this.fromDateTime = '';
    this.toDateTime = '';
    this.manageInviteList = this.filterManageInviteList;
  }
  getRecordBydate(fDateTime, tDateTime, type) {
    this.manageInviteList = this.filterManageInviteList;
    const FromDateTime = this.datePipe.transform(fDateTime, 'yyyy-MM-ddThh:mm');
    const ToDateTime = this.datePipe.transform(tDateTime, 'yyyy-MM-ddThh:mm');
    if (type === 'send') {
      this.manageInviteList.map(d => d.invitationSendDate = this.datePipe.transform(d.invitationSendDate, 'yyyy-MM-ddThh:mm'));
      this.manageInviteList = this.filterManageInviteList.filter(x =>
        x.invitationSendDate >= FromDateTime && x.invitationSendDate <= ToDateTime);
    }
    if (type === 'expiry') {
      this.manageInviteList.map(d => d.invitationExpiryDate = this.datePipe.transform(d.invitationExpiryDate, 'yyyy-MM-ddThh:mm'));
      this.manageInviteList = this.filterManageInviteList.filter(x =>
        x.invitationExpiryDate >= FromDateTime && x.invitationExpiryDate <= ToDateTime);
    }
  }
  getTotalPages(totalRecords, rows) {
    // this.totalpages = Math.ceil((this.manageInviteList.length) / rows);
   // this.totalpages = Math.ceil((totalRecords) / rows);
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
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  getPage(event) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.invitationAuditList.length) {
      return Math.ceil(this.invitationAuditList.length / this.itemPerPage);
    }
  }
  showall() {
    if (this.manageInviteList.length > 0) {
      this.itemperpage = this.manageInviteList.length;
      this.isShowAll = true;
      this.getManageInviteData();
    }
    
  }
  showallinvi() {
    if (this.invitationAuditList.length > 0) {
      this.itemperpage = this.invitationAuditList.length;
    }
  }
  aftershowall() {
    this.dialog.closeAll();
    this.itemperpage = 4;
  }
  preventInfinite() {
    if (!this.itemperpage) {
      this.itemperpage = 4;
    }
  }
  editInvitation(rowData, templateRef, type: string) {
    this.dataValue = rowData;
    this.contentHeader = type;
    switch (type) {
      case 'View':
        {
          this.screening.getManageInviteView(rowData.invitationId).subscribe(res => {
            if (res) {
              this.viewData = res;
              this.dialog.open(templateRef, {
                width: '800px',
                data: res
              });
            }
          });
        }
        break;
      case 'View/Download':
        {
          this.dataValue = rowData.clientReferenceNo + '.pdf';
          this.downloadflag = rowData.downloadDocumentFlag;
          this.openFileSubmission(rowData);
        }
        break;
      case 'Resend':
        {
          this.screening.resentInvitation(rowData.invitationId, this.userData.userId).subscribe(res => {
            if (res) {
              this.showTopCenter('success', 'Success Message', 'Re-Send Successfully');
            } else {
              this.showTopCenter('warn', 'Failure Message', 'Re-Send Failed');
            }
          });
        }
        break;
      case 'Reopen':
        {
          this.openReopenDialog(rowData.invitationId, this.userData.userId);
        }
        break;
      case 'Cancel':
        {
          this.openDialog(rowData.invitationId, this.userData.userId);
        }
        break;
      case 'Log':
        {
          this.viewColumns = [
            { field: 'invitationSection', header: 'Invitation Log Type' },
            { field: 'auditDate', header: 'Log Date' },
            { field: 'invitationStatus', header: 'Invitation Comments' }];
          this.openLogDailog(templateRef, rowData.invitationId);
        }
        break;
      case 'Approve':
        this.openApproveDialog(rowData.invitationId, this.userData.userId);
        break;
      case 'Rejected':
        this.dialog.open(this.rejectedComments, {
          width: '620px'
        });
        this.remarks = new UntypedFormControl('', Validators.required);
        break;
      default: return 'N/A';
    }
  }
  rejectSubmit(data) {
    const rejectList = this.selectedList.filter(x => (x.invitationStatus === 'Completed' && this.isStopped === false)
      || x.invitationStatus === 'Stop');
    if (rejectList.length > 0) {
      if (this.remarks.value && this.remarks.valid) {
        if (this.statusList.invitationStatus.length > 0) {
          const sList = this.statusList.invitationStatus.find(x => x.lookUpName === 'Rejected');
          rejectList.forEach(ele => {
            ele.statusLookUpId = sList.lookUpId;
            ele.invitationStatus = sList.lookUpName;
          });
        }
        const saveCase = [];
        rejectList.forEach(ele => {
          const status: StatusAdd = {
            invitationId: ele.invitationId,
            loggedId: this.userData.userId,
            invitationStatusId: ele.statusLookUpId,
            remarks: this.remarks.value
          };
          saveCase.push(status);
        });
        this.screening.bulkInvitationReject(saveCase).subscribe(resp => {
          if (resp === true) {
            this.selectedList = [];
            this.btnReject = false;
            this.remarks.setValue('');
            this.dialog.closeAll();
            this.showTopCenter('success', 'Success Message', 'Reject Successfully');
            this.getManageInviteData();
          }
        });
      }
    } else {
      if (this.remarks.value && this.remarks.valid) {
        let sList: any;
        if (this.statusList.invitationStatus.length > 0) {
          sList = this.statusList.invitationStatus.find(x => x.lookUpName === 'Rejected');
        }
        this.statusAdd.invitationId = data.invitationId;
        this.statusAdd.invitationStatusId = sList.lookUpId;
        this.statusAdd.loggedId = this.userData.userId;
        this.statusAdd.remarks = this.remarks.value;
        this.screening.InvitationStatusUpdate(this.statusAdd).subscribe(resp => {
          if (resp) {
            this.dialog.closeAll();
            this.getManageInviteData();
            this.showTopCenter('success', 'Success Message', ('Rejecteded Successfully'));
          }
        });
      } else {
        this.remarks.setValidators(Validators.required);
        this.remarks.markAsTouched();
        this.remarks.updateValueAndValidity();
      }
    }
  }
  openFileSubmission(data) {
    if (data) {
      const caseNo = data.caseNo;
      this.screening.getScreeningCaseDetails(caseNo, this.userData.userId, this.userData.applicationId).subscribe(resp => {
        if (resp) {
          this.screeningDetails = resp;
          this.showcaseDetaile = true;
          this.editClick = false;
          this.btnBack = true;
          this.btnExcelExport = false;
          this.btnDownLoad = true;
        }
        this.screeningComponentStatusDetails();
      });
    }
  }
  screeningComponentStatusDetails() {
    this.screeningDetails.screeningComponent.forEach((ele, i) => {
      ele.component.forEach((e) => {
        this.compid = ele.compId;
      });
    });
    if (this.compid) {
      this.screening.screeningComponentStatusDetails(this.compid, (this.userData.deptId ? this.userData.deptId : 0), this.userData.applicationId).subscribe(res => {
        if (res) {
          setTimeout(() => {
            this.compBaseDetailslist = res;
          });
        }
      });
    }
  }
  public openReopenDialog(invitationId, userId) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to reopen this Invitation?'
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
            this.invitationReOpen(invitationId, userId);
          }
        }
      });
    }
  }
  invitationReOpen(invitationId, userId) {
    this.screening.invitationReOpen(invitationId, userId).subscribe(res => {
      if (res) {
        this.getManageInviteData();
        this.showTopCenter('success', 'success Message', 'Invitation reopen Successfully');
      }
    });
  }
  public openDialog(invitationId, userId) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this Invitation?'
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
            this.removeGroupDetail(invitationId, userId);
          }
        }
      });
    }
  }
  removeGroupDetail(invitationId, userId) {
    this.screening.cancelInvitation(invitationId, userId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'success Message', 'Cancelled Successfully');
        this.getManageInviteData();
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Failed to Cancell');
      }
    });
  }
  openLogDailog(templateRef, invitationId) {
    this.screening.getInvitationAuditDetails(invitationId).subscribe(res => {
      if (res) {
        this.invitationAuditList = res;
        this.dialog.open(templateRef, {
          width: '750px',
        });
      }
    });
  }
  public openApproveDialog(src, userId) {
    const popupData = {
      action: this.common.APPROVE,
      id: src,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to Approve this record?'
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
          if (action === this.common.APPROVE) {
            this.approveDialog(src, userId);
          }
        }
      });
    }
  }
  approveDialog(invitationId, userId) {
    this.screening.ApproveCandidateCase(invitationId, userId).subscribe(res => {
      if (res) {
        this.getManageInviteData();
        this.showTopCenter('success', 'Success', 'Invitation approved successfully');
      }
    });
  }
  downloadSupportingDoc() {
    if (this.downloadflag === true) {
      const docList = [];
      if (this.screeningDetails && this.screeningDetails.screeningComponent.length > 0) {
        this.screeningDetails.screeningComponent.forEach(ele => {
          ele.component.forEach(el => {
            if (el.screeningComponentInfo.componentDocument.length > 0) {
              el.screeningComponentInfo.componentDocument.forEach(docele => {
                if (docele.screeningDocId > 0) {
                  docList.push(docele.screeningDocId);
                }
              });
            }
          });
        });

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < docList.length; i++) {
          this.screening.downloadScreeningDocument(docList[i]).subscribe(resp => {
            setTimeout(() => {
              this.common.downloadDocument(0, resp.document, resp.fileName);
            }, 0);
          });
        }
        if (this.screeningDetails.document.length > 0) {
          this.screeningDetails.document.forEach((ele, i) => {
            this.screening.downloadScreeningDocument(ele.screeningDocId).subscribe(resp => {
              setTimeout(() => {
                this.common.downloadDocument(0, resp.document, resp.fileName);
                this.common.downloadDocument(ele.screeningDocId, ele.document, ele.fileName);
              });
            });
          });
        }
      }
    }
  }
  backevent() {
    this.editClick = true;
    this.getManageInviteData();
    this.btnBack = false;
    this.btnDownLoad = false;
    this.btnExcelExport = true;
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  resetTbl() {
    this.invitationDetails.filters =''; 
    this.dt.reset();
    this.resetDate();
    this.global.nativeElement.value = '';
    this.searchValue = '';
    this.userData.page = 1;
    this.userData.pageSize = 10;
    this.userData.needTotal = true; 
    this.isShowAll = false;
    this.ExcelFlag = false;

  }
  exportAsExcelFile() {
    this.ExcelFlag = true;
    this.applypagination();
    this.invitationDetails.statusLookUpId = 0;
    this.invitationDetails.applicationId = this.userData.applicationId;
    this.invitationDetails.teamId = this.userData.teamId;
    this.invitationDetails.userId = this.userData.userId;  
    this.invitationDetails.filters =''; 
      this.invitationDetails.applyPaging = false;    
    this.manageColumns = [
      { field: 'check', header: '' },
      { field: 'invitationStatus', header: 'Status' },
      { field: 'clientReferenceNo', header: 'Reference No' },
      { field: 'applicationId', header: 'Application Id' },
      { field: 'clientName', header: 'Client Name' },
      { field: 'firstName', header: 'Candidate Name' },
      { field: 'emailId', header: 'Email Id' },
      { field: 'phoneNo', header: 'Mobile Number' },
      { field: 'invitationSendDate', header: 'Invitation Date' },
      { field: 'invitationExpiryDate', header: 'Expiry Date' },
      { field: 'submittedDate', header: 'Submitted Date' },
      { field: 'dateOfJoining', header: 'Date Of Joining' },
      { field: 'componentName', header: 'Component Name' },
      { field: 'packageName', header: 'Package Name' },
      { field: 'userName', header: 'User Name' },
      { field: 'cancelUserName', header: 'Cancelled By' }

    ];
    this.screening.getManageInvitationData(this.invitationDetails).subscribe(resp => {    
      this.excelData = resp.body;
      this.excelData.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
        + m.candidateLastName);
      this.ExcelFlag = false;

    // export to excel file
    let tabtext = '<table border="1px">';
    // var textRange;
    let j = 0;

    const header = this.manageColumns;
    if (header[0].field === 'check') {
      header.splice(0, 1);
    }

    const filteredValue1 = this.excelData; // id of table
    const filteredValue = this.common.CloneObject(filteredValue1);
    const lines = filteredValue.length;
    if (filteredValue.length > 0) {

      filteredValue.forEach(ele => {
        ele.invitationSendDate = this.common.getTimezoneOffset(ele.invitationSendDate,
          false);
        ele.packageName = ele.packageName ? ele.packageName : 'N/A'
        ele.invitationSendDate = moment(ele.invitationSendDate).format("YYYY-MM-DD HH:mm:ss");

        // Invitation Expiry Date Issue solved - 4/3/2024
        const day = ele.invitationExpiryDate;
        const fulldate = new Date(ele.invitationSendDate);
        ele.invitationExpiryDate = (new Date(fulldate.setDate(fulldate.getDate() + day)));

        //ele.invitationExpiryDate = this.common.getTimezoneOffset(ele.invitationExpiryDate,
        //  false);

        ele.invitationExpiryDate = moment(ele.invitationExpiryDate).format("YYYY-MM-DD HH:mm:ss");

        ele.submittedDate = ele.submittedDate ? this.common.getTimezoneOffset(ele.submittedDate,
          false) : 'N/A';

        //ele.cancelUserName = ele.cancelUserName ? ele.cancelUserName : 'N/A'
        ele.cancelUserName = ele.cancelUserFirstName ? ele.cancelUserFirstName + ' ' + ele.cancelUserLastName : 'N/A';
        if (ele.submittedDate !== 'N/A') {
          ele.submittedDate = moment(ele.submittedDate).format("YYYY-MM-DD HH:mm:ss");
        }
        ele.dateOfJoining = ele.dateOfJoining
  ? moment.utc(ele.dateOfJoining).local().format("DD-MM-YYYY")
  : 'N/A';
      });
    }
    let headerColos = '';

    // the first headline of the table
    if (lines > 0) {
      header.forEach(h => {
        headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    for (j = 0; j < lines; j++) {
      headerColos = '';
      header.forEach(h => {
        headerColos = headerColos + '<td style="font-size:12px">' + filteredValue[j][h.field] + '</td>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    tabtext = tabtext + '</table>';
    tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
    tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
    tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
    const fileName = 'ManageInvitation.xls';
    const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });
    if ((window.navigator as any).msSaveBlob) { // IE 10+
      (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
    } else {
      const link = document.createElement('a'); // create link download file
      link.href = window.URL.createObjectURL(exceldata); // set url for link download
      link.setAttribute('download', fileName); // set attribute for link created
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // });
    
  });
  }
  private TblAutoFilters(): void {

    this.candidateNameFilteredOptions = this.candidateNameCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.manageInviteList.map(x => x.firstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNamesFilteredOptions = this.clientNameCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.manageInviteList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.referencenumberFilteredOptions = this.referencenumberCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.manageInviteList.map(x => x.clientReferenceNo).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.statusFilteredOptions = this.statusCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.manageInviteList.map(x => x.invitationStatus).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.emailFilteredOptions = this.emailCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.manageInviteList.map(x => x.emailId).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }

  // loaderHide(value) {
  //   console.log(value, 'test')
  //   if (value == true) {
  //     this.sharedService.emitChangeLoading({
  //       showLoader: false,
  //     });
  //   }
  //   else {
  //     this.sharedService.emitChangeLoading({
  //       showLoader: false,
  //     });
  //   }
  // }
}
export class StatusAdd {
  invitationId: number;
  loggedId: number;
  invitationStatusId: number;
  remarks: string;
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