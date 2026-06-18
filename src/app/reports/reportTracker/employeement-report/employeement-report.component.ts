import { Component, OnInit } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-employeement-report',
  templateUrl: './employeement-report.component.html',
  styleUrls: ['./employeement-report.component.css']
})
export class EmployeementReportComponent implements OnInit {
  SearchCriFilter = false;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  showdSearch = true;
  show_Search = true;
  searchText: any;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Report / MIS - Report Tracker / Employment - MIS';
  // employmentReportList: any[] = [];
  employmentReportForm: UntypedFormGroup;
  clientList: any[] = [];
  statusList: any[] = [];
  componentList: any[] = [];
  clientNameControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  componentControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  outputDataExcel: any[] = [];
  isEmptyRec = false;
  displayColumns: any[] = [];
  employmentReportList: Array<{ field: string, header: string }> = [];
  screenName: any;
  constructor(public reportService: ReportService, private message: MessageService, public common: CommonService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenName = JSON.parse(sessionStorage.getItem('curMenu_data')).screenName;
    this.getEmploymentReportList();
    this.initFormGroup();
  }
  exportExcel() {
    const objd = this.common.ConvertKeysToLowerCase(this.employmentReportList);
    if (objd) {
      this.outputDataExcel = objd;
    }
    if (this.outputDataExcel.length > 0) {
      const ws = XLSX.utils.json_to_sheet(this.outputDataExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.screenName);
      XLSX.writeFile(wb, this.screenName + '.xlsx');
    }
  }
  getEmploymentReportList() {
    this.applyPagination();
    this.reportService.getEmploymentReportList().subscribe(res => {
      if (res) {
        this.componentList = res.componentReportVm;
        this.clientList = res.clientReportVm;
        this.statusList = res.statusVm;
        this.initautoCompleteCtrl();
      }
    });
  }
  applyPagination() {
    let filter = this.userData.filters;
    if (this.employmentReportForm.value.clientName && this.employmentReportForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.employmentReportForm.value.clientName;
    } if (this.employmentReportForm.value.verificationId && this.employmentReportForm.get('verificationId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=' + this.employmentReportForm.value.verificationId;
    } if (this.employmentReportForm.value.compName && this.employmentReportForm.get('compName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'compName@=' + this.employmentReportForm.value.compName;
    } if (this.employmentReportForm.value.statusName && this.employmentReportForm.get('statusName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'statusName@=' + this.employmentReportForm.value.statusName;
    } if (this.employmentReportForm.value.vendorName && this.employmentReportForm.get('vendorName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'vendorName@=' + this.employmentReportForm.value.vendorName;
    } if (this.employmentReportForm.value.from) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'from>=' + new DatePipe('en-Us').transform(this.employmentReportForm.value.from, 'yyyy-MM-dd');
    } if (this.employmentReportForm.value.to) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'to<=' + new DatePipe('en-Us').transform(this.employmentReportForm.value.to, 'yyyy-MM-dd');
    }
  }
  monthlyChange(event: any) {
    if (event === true) {
      this.employmentReportForm.get('fromdate')?.setValue(new Date(new Date().setDate(new Date().getDate() - 119)));
      this.employmentReportForm.get('todate')?.setValue(new Date());
    } else {
      this.employmentReportForm.get('fromdate')?.setValue('');
      this.employmentReportForm.get('todate')?.setValue('');
    }
  }
  initFormGroup() {
    this.employmentReportForm = new UntypedFormGroup({
      compId: new UntypedFormControl(null),
      clientId: new UntypedFormControl(null),
      screeningStatusId: new UntypedFormControl(null),
      fromdate: new UntypedFormControl(),
      todate: new UntypedFormControl(),
      monthly: new UntypedFormControl(false)
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.componentControl = new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName',
      this.componentList, '', this.employmentReportForm, false, false, true, 'standard');
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
      '', this.employmentReportForm, false, false, false, 'standard');
    this.statusControl = new AutoCompleteDropDown('Screening Status', 'screeningStatusId', 'screeningStatusId', 'statusName', this.statusList,
      '', this.employmentReportForm, false, false, false, 'standard');

  }
  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    for (const ctrl in this.employmentReportForm.controls) {
      if (ctrl === key) {
        this.employmentReportForm.get(ctrl).setValue('');
      }
    }
  }
  shieveFilter(ctrl: any) {
    if (this.employmentReportForm.get(ctrl).valid) {
      this.getEmploymentReportList();
    }
  }
  removeValue(value: any) {
    if (value === '') {
      this.getEmploymentReportList();
    }
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.getEmploymentReportList();
  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.shievePageSize = this.shieveTotalCount;
      this.getEmploymentReportList();
    }
  }
  // autocompleteData() {
  //   this.clientList = Array.from(new Map
  //     (this.employmentReportList.map(x => ({ clientName: x.clientName }))
  //       .map(e => [e.clientName, e])).values());
  //   this.statusList = Array.from(new Map
  //     (this.employmentReportList.map(x => ({ statusName: x.statusName }))
  //       .map(e => [e.statusName, e])).values());
  //   this.componentList = Array.from(new Map
  //     (this.employmentReportList.map(x => ({ compName: x.compName }))
  //       .map(e => [e.compName, e])).values());
  //   this.initautoCompleteCtrl();
  // }
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
      for (const ctrl in this.employmentReportForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  downloadFile(doc, filename) {
    const sampleArr = this.common.base64ToArrayBuffer(doc);
    this.common.saveByteArray(filename, sampleArr);
  }
  resetForm() {
    this.employmentReportForm.reset();
    this.employmentReportList = [];
    this.isEmptyRec = false;
  }
  toggle(data: any) {
    this.show_Search = !this.show_Search;
    if (this.show_Search) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  searchValue() {
    if (!this.employmentReportForm.valid) {
      this.showTopCenter('warn', 'Failure Message', 'Component Name Is Required.');
      return;
    }
    const fromDate = this.datepipe.transform(this.employmentReportForm.controls.fromdate.value, 'yyyy-MM-dd');
    const toDate = this.datepipe.transform(this.employmentReportForm.controls.todate.value, 'yyyy-MM-dd');
    this.employmentReportForm.controls.fromdate.reset(fromDate);
    this.employmentReportForm.controls.todate.reset(toDate);
    this.employmentReportList = [];
    this.reportService.getEmploymentReportDetails(this.employmentReportForm.getRawValue()).subscribe(resp => {
      if (resp) {
        this.employmentReportList = resp;
      }
      this.getColumns(this.employmentReportList);
    });
  }
  getColumns(employmentReportList: any) {
    if (employmentReportList.length > 0) {
      const obj = employmentReportList[0];
      const columnList = Object.keys(obj).filter(function (key) {
        if (obj.hasOwnProperty(key) && typeof key === 'string') {
          return key;
        }
      });
      for (const col of columnList) {
        if (col !== 'clientId' && col !== 'active' && col !== 'fromDate' && col !== 'toDate' && col !== 'candidateId') {
          this.displayColumns.push({ field: col, header: col });
          // console.log(this.displayColumns);
        }
      }
      this.isEmptyRec = false;
    } else {
      this.isEmptyRec = true;
    }
  }
}
