import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { MessageService } from 'primeng/api';
@Component({
  standalone: false,
  selector: 'app-individual-report',
  templateUrl: './individual-report.component.html',
  styleUrls: ['./individual-report.component.css']
})
export class IndividualReportComponent implements OnInit {
  iqcClientno: any[] = [];
  iclientList: any[] = [];
  iqcOwner: any[] = [];
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  SearchCriFilter = false;
  showdSearch = true;
  show_Search = true;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Report / Client Report / Individual Report';
  individualQCApprovedList: any[] = [];
  qcApprovedForm: UntypedFormGroup;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage;
  page = 1;
  clientList: any[] = [];
  caseRefList: any[] = [];
  qccandidateList: any[] = [];
  icandidateList: any[] = [];
  candidateList: { candidateFullName: any; }[];
  clientNameControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  closedUserList: any[] = [];
  closedUserControl!: AutoCompleteDropDown;
  @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  ctsPattern = /CTS/;
  ctsFlag:boolean = false;
  constructor(public qualityCheckService: QualityCheckService, private message: MessageService, public common: CommonService, public dialog: MatDialog, public screeningService: ScreeningService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.GetIndividualQCApprovedReportDetails();
    //this.initDefaultData()
    this.itemPerPage = 10;
    if (this.ctsPattern.test(this.userData.deptName.toUpperCase())) {
      this.ctsFlag = true;
    } else {
      this.ctsFlag = false;
    }
  }
  // VP
  // initDefaultData(){
  //   this.screeningService.getClients(this.userData).subscribe(res => {
  //     if (res) {
  //       this.iclientList = res;
  //     }
  //   });
  //   this.screeningService.GetFQCClosedUser(this.userData).subscribe(res => {
  //     if (res) {
  //       this.iqcOwner = res;
  //     }
  //   });
  //   this.screeningService.GetFinalQCApprovedClientReferenceNumber(this.userData).subscribe(res => {
  //     if (res) {
  //       this.iqcClientno = res;
  //     }
  //   });
  //   this.screeningService.getQcCandidate(this.userData).subscribe(res => {
  //     if (res) {
  //       this.icandidateList = res;
  //     }
  //   });
  // }
  GetIndividualQCHistoryReportDetails(id: any) {
    this.qualityCheckService.GetQCHistoryReportDetails(this.common.screenName, id);
    this.dialog.open(this.history, {
      width: '800px',
      disableClose: true
    });
  }
  initFormGroup() {
    this.qcApprovedForm = new UntypedFormGroup({
      candidateName: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      applicantId:new UntypedFormControl(null),
      fqcClosedUserFName: new UntypedFormControl(null),
      from: new UntypedFormControl(null),
      to: new UntypedFormControl(null)
    });
    this.initautoCompleteCtrl();
  }
  applyPagination() {
    let filter = this.userData.filters;
    if (this.qcApprovedForm.value.clientName && this.qcApprovedForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.qcApprovedForm.value.clientName;
    } if (this.qcApprovedForm.value.clientRefNo && this.qcApprovedForm.get('clientRefNo')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=' + this.qcApprovedForm.value.clientRefNo;
    } if (this.qcApprovedForm.value.candidateName && this.qcApprovedForm.get('candidateName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'firstName@=' + this.qcApprovedForm.value.candidateName;
    } if (this.qcApprovedForm.value.fqcClosedUserFName && this.qcApprovedForm.get('fqcClosedUserFName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'fqcClosedUserFName@=' + this.qcApprovedForm.value.fqcClosedUserFName;
    } if (this.qcApprovedForm.value.from) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'from>=' + new DatePipe('en-Us').transform(this.qcApprovedForm.value.from, 'yyyy-MM-dd');
    } if (this.qcApprovedForm.value.to) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'to<=' + new DatePipe('en-Us').transform(this.qcApprovedForm.value.to, 'yyyy-MM-dd');
    }
    if (this.qcApprovedForm.value.applicantId && this.qcApprovedForm.get('applicantId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'applicantId==' + this.qcApprovedForm.value.applicantId
    }
    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter
    this.userData.sorts = '';
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
  }
  initautoCompleteCtrl() {
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.iclientList,
      '', this.qcApprovedForm, false, false, false, 'standard');
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.iqcClientno,
      '', this.qcApprovedForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id',
      'name', this.icandidateList, '', this.qcApprovedForm, false, false, false, 'standard');
    this.closedUserControl = new AutoCompleteDropDown('IQC Closed By', 'fqcClosedUserFName', 'name',
      'name', this.iqcOwner, '', this.qcApprovedForm, false, false, false, 'standard');
  }
  GetIndividualQCApprovedReportDetails() {
    this.applyPagination();
    this.qualityCheckService.GetIndividualQCApprovedReportDetails(this.userData).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        const res = resp.body;
        this.getResp(res);
      }
    });
  }
  getResp(res: any) {
    this.individualQCApprovedList = res;
    this.individualQCApprovedList.map(m =>
      m.candidateFullName = m.firstName + ' ' + m.middleName + '' + m.lastName);
    this.individualQCApprovedList.map(m =>
      m.fqcClosedUserFName = m.fqcClosedUserFName ? (m.fqcClosedUserFName + (m.fqcClosedUserMName ? (' ' + m.fqcClosedUserMName) : '')
        + (m.fqcClosedUserLName ? (' ' + m.fqcClosedUserLName) : '')) : m.fqcClosedUserFName);
    this.autocompleteData();
  }
  search() {
    if (this.qcApprovedForm.value.clientName || this.qcApprovedForm.value.clientRefNo
      || this.qcApprovedForm.value.candidateName ||this.qcApprovedForm.value.applicantId ||
      this.qcApprovedForm.value.fqcClosedUserFName || this.qcApprovedForm.value.from || this.qcApprovedForm.value.to) {
      this.shievePageNo = 1;
      this.userData.filters = '';
      this.GetIndividualQCApprovedReportDetails();

    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    for (const ctrl in this.qcApprovedForm.controls) {
      if (ctrl === key) {
        this.qcApprovedForm.get(ctrl).setValue('');
      }
    }
  }
  autocompleteData() {
    this.clientList = Array.from(new Map
      (this.individualQCApprovedList.map(x => ({ clientName: x.clientName }))
        .map(e => [e.clientName, e])).values());
    this.caseRefList = Array.from(new Map
      (this.individualQCApprovedList.map(x => ({ clientRefNo: x.clientRefNo }))
        .map(e => [e.clientRefNo, e])).values());
    this.qccandidateList = Array.from(new Map
      (this.individualQCApprovedList.map(x => ({ candidateFullName: x.candidateFullName }))
        .map(e => [e.candidateFullName, e])).values());
    this.closedUserList = Array.from(new Map
      (this.individualQCApprovedList.map(x => ({ fqcClosedUserFName: x.fqcClosedUserFName })).filter(f => f.fqcClosedUserFName)
        .map(e => [e.fqcClosedUserFName, e])).values());
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
      for (const ctrl in this.qcApprovedForm.controls) {
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
  getIndividualReportDocument(screeningCompId: any) {
    this.qualityCheckService.GetIndividualQCReportDocument(screeningCompId, this.userData.userId).subscribe(res => {
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
    if (this.individualQCApprovedList.length) {
      return Math.ceil(this.individualQCApprovedList.length / this.itemPerPage);
    }
  }
  showall() {
    if (this.individualQCApprovedList.length > 0) {
      this.itemPerPage = this.individualQCApprovedList.length;
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
  shieveFilter(ctrl: any) {
    if (this.qcApprovedForm.get(ctrl).valid) {
      this.GetIndividualQCApprovedReportDetails();
    }
  }
  removeValue(value: any) {
    if (value === '') {
      this.GetIndividualQCApprovedReportDetails();
    }
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.GetIndividualQCApprovedReportDetails();
  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.shievePageSize = this.shieveTotalCount;
      this.GetIndividualQCApprovedReportDetails();
    }
  }
  reset() {
    this.searchValueArr = [];
    this.qcApprovedForm.reset();
    this.userData.filters = "";
    this.GetIndividualQCApprovedReportDetails();
  }
}
