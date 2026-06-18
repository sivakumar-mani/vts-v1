import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { DatePipe } from '@angular/common';
@Component({
  standalone: false,
  selector: 'app-supplementry-report',
  templateUrl: './supplementry-report.component.html',
  styleUrls: ['./supplementry-report.component.css']
})
export class SupplementryReportComponent implements OnInit {
  SearchCriFilter = false;
  showdSearch = true;
  Sclientref: any;
  scandidateList: any;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  componentList: any;
  show_Search = true;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Report / Client Report / Supplementary Report';
  supplementaryReportList: any[] = [];
  supplementaryReportForm: UntypedFormGroup;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage;
  page = 1;
  clientList: any[] = [];
  caseRefList: any[] = [];
  reportCandidateList: any[] = [];
  candidateList: { candidateFullName: any; }[];
  clientNameControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  indCompList: SupplementaryReport[] = [];
  pdfType = '';
  @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  ctsPattern = /CTS/;
  ctsFlag:boolean = false;
  clientCategoryId: number;
  constructor(public qualityCheckService: QualityCheckService, private auth: AuthService, public common: CommonService,
    public verification: VerificationService, private message: MessageService, public dialog: MatDialog, public screeningService: ScreeningService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.GetSupplementaryReportDetails();
    this.pdfType = this.auth.getpdfType('pdfType');
    this.itemPerPage = 10;
    if (this.ctsPattern.test(this.userData.deptName.toUpperCase())) {
      this.ctsFlag = true;
    } else {
      this.ctsFlag = false;
    }
  }
  ngOnDestroy() {
    this.verification.suppReportType = undefined;
  }
  // VP
  GetSupplementryQCHistoryReportDetails(id: any) {
    this.qualityCheckService.GetQCHistoryReportDetails(this.common.screenName, id);
    this.dialog.open(this.history, {
      width: '800px',
      disableClose: true
    });
  }
  reset() {
    this.searchValueArr = [];
    this.supplementaryReportForm.reset();
    this.userData.filters = "";
    this.GetSupplementaryReportDetails()
  }
  GetSupplementaryReportDetails() {
    this.applyPagination();
    this.qualityCheckService.GetSupplementaryReportDetails(this.userData).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        this.supplementaryReportList = resp.body;
        this.supplementaryReportList.map(m =>
          m.candidateFullName = m.firstName + ' ' + m.middleName + '' + m.lastName);
        this.autocompleteData();
      }
    });
  }
  // applypagination
  shieveFilter(ctrl: any) {
    if (this.supplementaryReportForm.get(ctrl).valid) {
      this.GetSupplementaryReportDetails();
    }
  }
  removeValue(value: any) {
    if (value === '') {
      this.GetSupplementaryReportDetails();
    }
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.GetSupplementaryReportDetails();
  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.shievePageSize = this.shieveTotalCount;
      this.GetSupplementaryReportDetails();
    }
  }
  applyPagination() {
    let filter = this.userData.filters;
    if (this.supplementaryReportForm.value.clientName && this.supplementaryReportForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.supplementaryReportForm.value.clientName;
    } if (this.supplementaryReportForm.value.clientRefNo) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=' + this.supplementaryReportForm.value.clientRefNo;
    } if (this.supplementaryReportForm.value.candidateName && this.supplementaryReportForm.get('candidateName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'candidateName@=' + this.supplementaryReportForm.value.candidateName;
    }  if (this.supplementaryReportForm.value.from) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'caseCreatedDate>=' + new DatePipe('en-Us').transform(this.supplementaryReportForm.value.from, 'yyyy-MM-dd');
    } if (this.supplementaryReportForm.value.to) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'caseCreatedDate<=' + new DatePipe('en-Us').transform(this.supplementaryReportForm.value.to, 'yyyy-MM-dd');
    }
    if (this.supplementaryReportForm.value.applicantId && this.supplementaryReportForm.get('applicantId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'applicantId==' + this.supplementaryReportForm.value.applicantId
    }
    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter
    this.userData.sorts = '';
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
  }
  checkSubComp(event, screeningCompId, screeningId) {
    if (event.checked === true) {
      const obj = new SupplementaryReport();
      const flag = this.indCompList.some(s => s.screeningId === screeningId);
      if (!flag) {
        obj.screeningId = screeningId;
        obj.screeningCompId.push(screeningCompId);
        this.indCompList.push(obj);
      } else {
        this.indCompList.map(m => {
          if (m.screeningId === screeningId) {
            m.screeningCompId.push(screeningCompId);
          }
        });
      }
    } else {
      this.indCompList.map(m => {
        const index = m.screeningCompId.indexOf(screeningCompId);
        m.screeningCompId.splice(index, 1);
      });
    }
  }
  initFormGroup() {
    this.supplementaryReportForm = new UntypedFormGroup({
      from: new UntypedFormControl(null),
      to: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null),
      applicantId:new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null)
    });
    this.initautoCompleteCtrl();
  }
  search() {
    if (this.supplementaryReportForm.value.clientName || this.supplementaryReportForm.value.clientRefNo
      || this.supplementaryReportForm.value.candidateName|| this.supplementaryReportForm.value.applicantId
      || this.supplementaryReportForm.value.from || this.supplementaryReportForm.value.to) {
      this.shievePageNo = 1;
      this.userData.filters = '';
      this.GetSupplementaryReportDetails();

    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  initautoCompleteCtrl() {
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.clientList,
      '', this.supplementaryReportForm, false, false, false, 'standard');
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.Sclientref,
      '', this.supplementaryReportForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id',
      'name', this.scandidateList, '', this.supplementaryReportForm, false, false, false, 'standard');
  }
  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    for (const ctrl in this.supplementaryReportForm.controls) {
      if (ctrl === key) {
        this.supplementaryReportForm.get(ctrl).setValue('');
      }
    }
  }
  autocompleteData() {
    this.caseRefList = Array.from(new Map
      (this.supplementaryReportList.map(x => ({ clientRefNo: x.clientRefNo }))
        .map(e => [e.clientRefNo, e])).values());
    this.reportCandidateList = Array.from(new Map
      (this.supplementaryReportList.map(x => ({ candidateFullName: x.candidateFullName }))
        .map(e => [e.candidateFullName, e])).values());
    this.initautoCompleteCtrl();
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
      for (const ctrl in this.supplementaryReportForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  downloadFile(screeningId, clientId) {
    const supplementaryReport = new SupplementaryReport();
    if (this.indCompList.filter(f => f.screeningId === screeningId)[0]) {
      supplementaryReport.screeningCompId = this.indCompList.filter(f => f.screeningId === screeningId)[0].screeningCompId;
    }
    supplementaryReport.screeningId = screeningId;
    supplementaryReport.loggedIn = this.userData.userId;
    if (supplementaryReport.screeningCompId && supplementaryReport.screeningCompId.length > 0) {
      this.verification.isFinalReport = false;
      this.verification.reportType = 'download';
      this.verification.suppReportType = 'supplementary';
      this.verification.ReportTitleID = 0;
      this.verification.screeningId = screeningId;
      this.verification.supScreeningCompIds = supplementaryReport.screeningCompId.join(',');
      this.verification.GetSupplementaryReportDocument(supplementaryReport).subscribe(resp => {
        if (resp) {
          this.verification.finalReportvalue = resp;
          this.verification.isFinalReport = true;
          this.clientCategoryId = resp.candidateDetail.clientCategoryId;
        }
        this.verification.getOrganizationLogo(clientId).subscribe(res => {
          if (res) {
            this.verification.fileLogo = res;
          }
        }, err => { }, () => {
          this.verification.isFinalReport = true;
        });
      });
    } else {
      this.showTopCenter('warn', 'Failure', 'Please select atleast One Component to Generate Report');
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  downloadFile1(doc, filename) {
    const sampleArr = this.common.base64ToArrayBuffer(doc);
    this.common.saveByteArray(filename, sampleArr);
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
    if (this.supplementaryReportList.length) {
      return Math.ceil(this.supplementaryReportList.length / this.itemPerPage);
    }
  }
  showall() {
    if (this.supplementaryReportList.length > 0) {
      this.itemPerPage = this.supplementaryReportList.length;
    }
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
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
}

export class SupplementaryReport {
  screeningId: number;
  screeningCompId: number[] = [];
  loggedIn: number;
}
