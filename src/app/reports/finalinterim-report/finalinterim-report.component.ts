import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { DatePipe } from '@angular/common';
import { report } from 'process';
import { element } from 'angular';
import { ReportService } from 'src/app/common-methods/services/report.service';
@Component({
  standalone: false,
  selector: 'app-finalinterim-report',
  templateUrl: './finalinterim-report.component.html',
  styleUrls: ['./finalinterim-report.component.css']
})
export class FinalinterimReportComponent implements OnInit {
  componentName: any[] = [];
  componentList: any;
  componentControl!: AutoCompleteDropDown;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  fqcOwner: any;
  FqcClientno: any;
  SearchCriFilter = false;
  showdSearch = true;
  // tslint:disable-next-line:variable-name
  show_Search = true;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  finalReportList: any[] = [];
  finalReportForm: UntypedFormGroup;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage;
  page = 1;
  clientList: any[] = [];
  fclientList: any[] = [];
  caseRefList: any[] = [];
  reportCandidateList: any[] = [];
  candidateList: { candidateFullName: any; }[];
  closedUserList: any[] = [];
  clientNameControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  from: any;
  to: any;
  candidateControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  pdfType = '';
  clientCategory = 0;
  closedUserControl!: AutoCompleteDropDown;
  ctsPattern = /CTS/;
  ctsFlag: boolean = false;
  isInterimReportStatusConfig: boolean = false;
  @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  isFinal: boolean;
  modifyInterimReportStatusList: any;
  // @ViewChild('modifyInterimReportStatus', { static: true }) modifyInterimReportStatus: TemplateRef<any>;
  @ViewChild('modifyInterimReportStatus', { static: true }) modifyInterimReportStatus;
  dialogRef: any;
  modifyInterimReportStatusTitleID: any;
  modifyInterimReportStatusTitle: any;
  temp: any;
  selectall = new UntypedFormControl();
  components: any[] = [];
  compId: any[] = [];
  screeningId: any[] = [];
  filterFlag: boolean = false;
  constructor(public reportService: ReportService, public qualityCheckService: QualityCheckService, public common: CommonService, public verification: VerificationService,
    public dialog: MatDialog, public router: Router, private message: MessageService, public auth: AuthService, public screeningService: ScreeningService, public datePipe: DatePipe) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);     
    this.initFormGroup();
    this.isFinal = this.router.url.includes('finalInterim') ? true : this.router.url.includes('interim') ? false : null;
    this.GetFinalQCApprovedReportDetails();
    this.itemPerPage = 10;
      this.pdfType = this.auth.getpdfType('pdfType');
    if (this.ctsPattern.test(this.userData.deptName.toUpperCase())) {
      this.ctsFlag = true;
    } else {
      this.ctsFlag = false;
    }
    this.getComponentName();
  }

  getList(list = [], screenName) {
    return list.filter(x => x.screenName === screenName);
  }
  // VP
  GetFinalQCHistoryReportDetails(id: any) {
    this.qualityCheckService.GetQCHistoryReportDetails(this.common.screenName, id);
    this.dialog.open(this.history, {
      width: '800px',
      // height: '600px',
      disableClose: true
    });
  }
  GetFinalQCApprovedReportDetails() {
    this.finalReportList = [];
    this.filterFlag = false;
    if (this.isFinal === true) {
      this.applyPagination();
      if (this.isFinal == true) {
        if (this.userData.compId !=null && this.userData.compId > 0) {
          this.filterFlag = true;
        }
      }
      this.qualityCheckService.GetFinalQCApprovedReportDetails(this.userData).subscribe(resp => {
        if (resp.body.length > 0) {
          this.shieveTotalCount = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.getResp(res);
        }
      });
    } else if (this.isFinal === false) {
      this.applyPagination();
      this.qualityCheckService.GetInterimReportDetails(this.userData).subscribe(resp => {
        if (resp) {
          this.shieveTotalCount = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.getResp(res);
        }
      });
    } else {
      this.qualityCheckService.GetSRReportDetails(this.userData.userId,
        this.userData.applicationId).subscribe(resp => {
          if (resp.body.length > 0) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.getResp(res);
          }
        });
    }
  }
  getResp(resp: any) {
    this.finalReportList = resp;
    if (resp.length > 0) {
      this.finalReportList.map(m =>
        m.candidateFullName = m.firstName + ' ' + m.middleName + '' + m.lastName);
      this.finalReportList.map(m =>
        m.fqcClosedUserFName = m.fqcClosedUserFName ? (m.fqcClosedUserFName + (m.fqcClosedUserMName ? (' ' + m.fqcClosedUserMName) : '')
          + (m.fqcClosedUserLName ? (' ' + m.fqcClosedUserLName) : '')) : m.fqcClosedUserFName);
      if (this.isFinal !== false) {
        this.finalReportList.forEach(element => {
          if (element.srReportDocument) {
            element.srReportDocument.map(m =>
              m.fqcClosedUserFName = m.fqcClosedUserFName ? (m.fqcClosedUserFName + (m.fqcClosedUserMName ? (' ' + m.fqcClosedUserMName) : '')
                + (m.fqcClosedUserLName ? (' ' + m.fqcClosedUserLName) : '')) : m.fqcClosedUserFName);
          }
          // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
          // element.colorCode = (element.colorCode !== null && element.colorCode !== '' && element.colorCode !== undefined) ? element.colorCode : this.common.colorCode;
        });
      }
      this.autocompleteData();
    }
  }
  // applypagination
  shieveFilter(ctrl: any) {
    if (this.finalReportForm.get(ctrl).valid) {
      this.GetFinalQCApprovedReportDetails();
    }
  }
  removeValue(value: any) {
    if (value === '') {
      this.GetFinalQCApprovedReportDetails();
    }
  }
  shievePagination(event: any) {
    this.selectall.setValue(false);
    this.shievePageNo = event;
    this.GetFinalQCApprovedReportDetails();
  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.shievePageSize = this.shieveTotalCount;
      this.GetFinalQCApprovedReportDetails();
    }
  }
  reset() {
    this.searchValueArr = [];
    this.finalReportForm.reset();
    this.userData.filters = "";
    this.userData.compId = 0;
    if (this.isFinal === true) {
      this.filterFlag = false;
      this.selectall.setValue(false);
    }
    this.GetFinalQCApprovedReportDetails();
  }
  applyPagination() {
    let filter = this.userData.filters;
    // if (this.finalReportForm.value.component && this.finalReportForm.get('component')?.valid) {
    //   filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'compId==' + this.finalReportForm.value.component;
    // }
     if (this.finalReportForm.value.clientName && this.finalReportForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.finalReportForm.value.clientName;
    } if (this.finalReportForm.value.clientRefNo && this.finalReportForm.get('clientRefNo')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=' + this.finalReportForm.value.clientRefNo;
    }
    if (this.finalReportForm.value.candidateName && this.finalReportForm.get('candidateName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'firstName@=' + this.finalReportForm.value.candidateName
    } if (this.finalReportForm.value.fqcClosedUserFName && this.finalReportForm.get('fqcClosedUserFName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'fqcClosedUserFName@=' + this.finalReportForm.value.fqcClosedUserFName
    } if (this.finalReportForm.value.from) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'from>=' + new DatePipe('en-Us').transform(this.finalReportForm.value.from, 'yyyy-MM-dd');
    } if (this.finalReportForm.value.to) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'to<=' + new DatePipe('en-Us').transform(this.finalReportForm.value.to, 'yyyy-MM-dd');
    }
    if (this.finalReportForm.value.applicantId && this.finalReportForm.get('applicantId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'applicantId==' + this.finalReportForm.value.applicantId
    }
    if (this.isFinal == true) {
      this.compId = this.finalReportForm.get('component')?.value ;
      // ?    this.finalReportForm.controls.component.value.map(m => m.id) : [];
      this.userData.compId = this.compId;
    }    
    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter;
    this.userData.sorts = '';
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
  }
  initFormGroup() {
    this.finalReportForm = new UntypedFormGroup({
      from: new UntypedFormControl(null),
      to: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null),
      applicantId: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      fqcClosedUserFName: new UntypedFormControl(null),
      component: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.fclientList,
      '', this.finalReportForm, false, false, false, 'standard');
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.FqcClientno,
      '', this.finalReportForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id',
      'name', this.candidateList, '', this.finalReportForm, false, false, false, 'standard');
    this.closedUserControl = new AutoCompleteDropDown('FR Closed By', 'fqcClosedUserFName', 'name',
      'name', this.fqcOwner, '', this.finalReportForm, false, false, false, 'standard');
      this.componentControl = new AutoCompleteDropDown('Component Name', 'component', 'id',
        'name', this.components, '', this.finalReportForm, false, false, false, 'standard');
  }
  removeSearchValue(key, index) {
    // tslint:disable-next-line: forin
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.finalReportForm.controls) {
      if (ctrl === key) {
        this.finalReportForm.get(ctrl).setValue('');
      }
    }
  }
  autocompleteData() {
    this.clientList = Array.from(new Map
      (this.finalReportList.map(x => ({ clientName: x.clientName }))
        .map(e => [e.clientName, e])).values());
    this.caseRefList = Array.from(new Map
      (this.finalReportList.map(x => ({ clientRefNo: x.clientRefNo }))
        .map(e => [e.clientRefNo, e])).values());
    this.reportCandidateList = Array.from(new Map
      (this.finalReportList.map(x => ({ candidateFullName: x.candidateFullName }))
        .map(e => [e.candidateFullName, e])).values());
    this.closedUserList = Array.from(new Map
      (this.finalReportList.map(x => ({ fqcClosedUserFName: x.fqcClosedUserFName })).filter(f => f.fqcClosedUserFName)
        .map(e => [e.fqcClosedUserFName, e])).values());
    this.initautoCompleteCtrl();
  }
  search() {
    if (this.finalReportForm.value.clientName || this.finalReportForm.value.clientRefNo
      || this.finalReportForm.value.candidateName || this.finalReportForm.value.applicantId ||
      this.finalReportForm.value.fqcClosedUserFName || this.finalReportForm.value.from ||this.finalReportForm.value.component || this.finalReportForm.value.to || this.finalReportForm.value.component) {
      this.shievePageNo = 1;
      this.userData.filters = '';
      if (this.isFinal == true) {
        this.selectall.setValue(false);
      }
      this.GetFinalQCApprovedReportDetails();
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.searchValueArr.length > 0) {
        if (this.searchValueArr.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
          if (this.searchValueArr.filter(x => x.propertyName === event.propertyName).length > 0) {
            const index = this.searchValueArr.findIndex(f => f.propertyName === event.propertyName);
            this.searchValueArr.splice(index, 1, { propertyName: event.propertyName, value: event.value });
          } else {
            this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
          }
        }
      } else {
        this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
      }
    } else {
      for (const ctrl in this.finalReportForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  downloadFile(doc, filename) {
    if (doc || filename) {
      const sampleArr = this.common.base64ToArrayBuffer(doc);
      this.common.saveByteArray(filename, sampleArr);
    }
  }
  ngOnDestroy() {
    this.verification.suppReportType = undefined;
  }
  sendInterimReportMail(report: any) {
    this.verification.sendInterimReportMail(report.screeningId, report.clientId, report.colorCode, this.userData.userId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Interim Report Mail send successfully');
      }
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  getFinalReportDocument(report: any) {
    this.verification.individualQc = 0;
    this.clientCategory = report.clientCategoryId;
    if (this.isFinal !== false) {
      this.qualityCheckService.GetFinalQCReportDocument(this.common.screenName, report.screeningId, this.userData.userId).subscribe(res => {
        if (res) {
          this.downloadFile(res.document, res.fileName);
        }
      });
    } else {
      //  alert('Print Interim is under construction');

      this.verification.GetInterimReportDocument(report.screeningId, this.userData.userId, this.verification.ReportTitleID).subscribe(resp => {
        this.verification.isFinalReport = false;
        this.verification.reportType = 'download';
        this.verification.suppReportType = 'interim';
        this.verification.screeningId = report.screeningId;
        // this.verification.ReportTitleID = 0;
        if (resp) {
          this.verification.finalReportvalue = resp;
          this.verification.getClientReportHeaderFooter(report.clientId).
            subscribe(res => {
              if (res) {
                this.verification.clientLogoaddress = res;
                this.verification.getOrganizationLogo(report.clientId).subscribe(re => {
                  if (re) {
                    this.verification.fileLogo = re;
                    this.verification.isFinalReport = true;
                  }
                });
              }
            });
        }
      });
    }
  }
  getSRReport(report, reportDocId) {
    this.qualityCheckService.GetSRReportDocument('SR Report', report.screeningId, this.userData.userId, reportDocId).subscribe(res => {
      if (res) {
        this.downloadFile(res.document, res.fileName);
      }
    });
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.finalReportList.length) {
      return Math.ceil(this.finalReportList.length / this.itemPerPage);
    }
  }
  showall() {
    if (this.finalReportList.length > 0) {
      this.itemPerPage = this.finalReportList.length;
    }
  }
  preventInfinite() {
    // if (!this.itemPerPage) {
    //   this.itemPerPage = 1;
    // }
    this.GetFinalQCApprovedReportDetails();
  }
  OnPageChange() {
    this.GetFinalQCApprovedReportDetails();
  }
  resetForm() {
  }
  toggle(data: any) {
    this.show_Search = !this.show_Search;
    if (this.show_Search) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }

  GetModifyInterimReportStatus(report: any) {
    this.verification.GetModifyInterimReportStatus(report.clientId).subscribe(resp => {
      this.modifyInterimReportStatusList = resp.lstReportType;
      this.isInterimReportStatusConfig = resp.isConfigured;
      this.temp = report;
      if (this.isInterimReportStatusConfig) {
        this.dialogRef = this.dialog.open(this.modifyInterimReportStatus, {
          width: '400px',
          disableClose: true
        });
      }
      else {
        this.verification.ReportTitleID = 0;
        this.getFinalReportDocument(this.temp);
      }
    });
  }

  dialogInterimReportStatusTilte() {
    this.dialogRef.close();
    this.modifyInterimReportStatusTitleID = 0;
  }
  submitModifyReportStatusTitle() {
    // const temp = report;
    this.verification.ReportTitleID = this.modifyInterimReportStatusTitleID;
    const ReportTileName = this.modifyInterimReportStatusList.filter(x => x.lookUpId === this.verification.ReportTitleID);//.map(m => m.lookUpName);
    this.modifyInterimReportStatusTitle = ReportTileName[0].lookUpName;
    this.verification.ReportTitle = this.modifyInterimReportStatusTitle;
    if (this.verification.ReportTitleID > 0) {
      //if(this.screeningId != 0)
      //this.temp.reportTitleId = this.modifyInterimReportStatusTitleID;
      // if (this.modifyInterimReportStatusTitle === 'Case Status') {
      //   const tempname = this.temp.colorCode

      //   this.temp.colorCode = '';
      // }
      this.getFinalReportDocument(this.temp);
      this.dialogRef.close();
      this.showTopCenter('success', 'Success Message', 'Interim Report Status Changed Successfully');
    }
  }


  selectAll(ele: any) {
    if (ele.checked == true) {
      this.finalReportList.forEach(ele1 => {
        ele1.multiSelectFlag = true;
      })
    }
    if (ele.checked == false) {
      this.finalReportList.forEach(ele1 => {
        ele1.multiSelectFlag = false;
      })
    }
  }
  assignScope(ele, index, data, list) {
    for (let i = 0; i < list.length; i++) {
      const caselist = list.filter(x => x.multiSelectFlag === true);
      if (list.length == caselist.length) {
        this.selectall.setValue(true);
      }
      if (list.length != caselist.length) {
        this.selectall.setValue(false);
      }
      if (index == i) {
        data.multiSelectFlag = ele;
      }
    }
  }
  getComponentName() {
    this.screeningService.getComponents(this.userData).subscribe(res => {
      if (res) {
        this.components = res;
        this.initautoCompleteCtrl();
      }
    });
  }

  downloadMultipleReports() {
    this.screeningId = [];
    // const reportList = this.finalReportList.filter(x => x.multiSelectFlag === false);
    // if (reportList.length == this.finalReportList.length) {
    //   this.showTopCenter('error', 'Error Message', 'Select one or more report');
    // } else {
    this.finalReportList.forEach(element => {
      if (element.multiSelectFlag == true) {
        this.screeningId.push(element.screeningId);
      }
    })
    if (this.screeningId.length > 0) {
      this.reportService.downloadMultipleReport(this.screeningId).subscribe((data: Blob) => {
        this.downloadZipFile(data, 'Final Report - ' + this.datePipe.transform(new Date(), 'yyyy_MM_dd') + '.zip');
      },
        (error) => {
          console.error('Error downloading report', error);
        }
      )
    } else {
      this.showTopCenter('error', 'Error Message', 'Select one or more report');
    }
    // }
  }

  downloadZipFile(data: Blob, fileName: string): void {
    const blob = new Blob([data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
