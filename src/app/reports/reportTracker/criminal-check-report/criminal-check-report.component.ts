import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-criminal-check-report',
  templateUrl: './criminal-check-report.component.html',
  styleUrls: ['./criminal-check-report.component.css']
})
export class CriminalCheckReportComponent implements OnInit {
  // CRIMINAL TRACKER REPORT
  SearchCriFilter = false;
  showdSearch = true;
  showSearch = true;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Reports / Report Tracker / Criminal Check - MIS';
  criminalCheckReportList: any[] = [];
  criminalCheckReportForm: UntypedFormGroup;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage = 5;
  page = 1;
  clientNameDrpDwn: any[] = [];
  caseRefList: any[] = [];
  reportCandidateList: any[] = [];
  candidateList: { candidateFullName: any; }[];
  clientNameControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];

  maxDate = new Date();
  clientflterlist: any[] = [];
  clientKeyUp = false;

  statusDrpDwn: any[] = [];
  statusflterlist: any[] = [];
  statusKeyUp = false;

  componentDrpDwn: any[] = [];
  componentflterlist: any[] = [];
  componentKeyUp = false;

  // tslint:disable-next-line: max-line-length
  constructor(private reportService: ReportService, public common: CommonService, private message: MessageService, private datepipe: DatePipe, ) { }

  ngOnInit() {
    this.initFormGroup();
    this.getDrpDwnDatas();
  }

  initFormGroup() {
    this.criminalCheckReportForm = new UntypedFormGroup({
      clientId: new UntypedFormControl(null),
      statusId: new UntypedFormControl(null),
      componentId: new UntypedFormControl(null, Validators.required),
      fromDate: new UntypedFormControl(null),
      toDate: new UntypedFormControl(null),
    });
    // this.initautoCompleteCtrl();
  }
  getDrpDwnDatas() {
    this.reportService.getAllLookUpCriminalReport().subscribe(res => {
      if (res != null) {
        this.statusDrpDwn = res.lstStatus;
        this.clientNameDrpDwn = res.clientList;
        this.componentDrpDwn = res.componentList;
      }
    });
  }
  // initautoCompleteCtrl() {
  //   this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientList,
  //     '', this.criminalCheckReportForm, false, false, false, 'standard');
  //   this.caseRefNoControl = new AutoCompleteDropDown('Status', 'clientRefNo', 'clientRefNo', 'clientRefNo', this.caseRefList,
  //     '', this.criminalCheckReportForm, false, false, false, 'standard');
  //   this.candidateControl = new AutoCompleteDropDown('Component Name', 'candidateName', 'candidateFullName',
  //     'candidateFullName', this.reportCandidateList, '', this.criminalCheckReportForm, false, false, false, 'standard');
  // }

  clientItems(value: any) {
    const clientIds: any[] = [];
    if (!value) { this.assignclientCopy(clientIds); }
    if (value) {
      this.clientflterlist = Object.assign([], this.clientNameDrpDwn.filter(f =>
        clientIds.indexOf(Number(f.clientId)) === -1)).filter(
          item => ((item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignclientCopy(clientIds: any) {
    this.clientflterlist = Object.assign([], this.clientNameDrpDwn.filter(f =>
      clientIds.indexOf(Number(f.clientId)) === -1));
  }
  displayClientFn(id: any): string {
    if (!id) { return ''; }
    const clientName = this.clientNameDrpDwn.filter(res => Number(res.clientId) === id);
    return clientName ? clientName[0].clientName : '';
  }

  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.clientflterlist.filter(e =>
          e.clientName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.clientKeyUp = true;
        } else {
          this.clientKeyUp = true;
        }
      } else {
        this.clientKeyUp = false;
      }
    }
  }
  get displayclientFn() {
    const clientNew = (client) => {
      if (client == null || client === undefined) {
        return null;
      }
      if (client && this.clientflterlist && this.clientflterlist.length > 0) {
        client = this.clientflterlist.find(x => Number(x.clientId) === Number(client));
        return client.clientName;
      } else {
        if (client === 0 && this.clientflterlist && this.clientflterlist.length > 0) {
          client = this.clientflterlist.find(x => Number(x.clientId) === Number(client));
          return client.clientName;
        } else { return null; }

      }

    };
    return clientNew;
  }
  checkValidValue(cntrl): void {
    if (cntrl === 'clientName') {
      const value = this.criminalCheckReportForm.controls.clientId.value;
      if (value === '' || value == null) {
        // this.criminalCheckReportForm.get('clientId')?.setValidators(Validators.required);
      } else if (this.clientKeyUp) {
        this.criminalCheckReportForm.get('clientId')?.setErrors({ incorrect: true });
      } else {
        this.criminalCheckReportForm.get('clientId')?.setErrors(null);
      }
    }

    if (cntrl === 'rCheckName') {
      const value = this.criminalCheckReportForm.controls.statusId.value;
      if (value === '' || value === null) {
        // this.recordCheckCategoryForm.get('statusId')?.setValidators(Validators.required);
      } else if (this.statusKeyUp) {
        this.criminalCheckReportForm.get('statusId')?.setErrors({ incorrect: true });
      } else {
        this.criminalCheckReportForm.get('statusId')?.setErrors(null);
      }
    }

    if (cntrl === 'rCheckCtgryName') {
      const value = this.criminalCheckReportForm.controls.componentId.value;
      if (value === '' || value == null) {
        this.criminalCheckReportForm.get('componentId')?.setValidators(Validators.required);
      } else if (this.componentKeyUp) {
        this.criminalCheckReportForm.get('componentId')?.setErrors({ incorrect: true });
      } else {
        this.criminalCheckReportForm.get('componentId')?.setErrors(null);
      }
    }
  }
  getComponetDetailsByClient(cntrl, evnt?) {
    if (cntrl === 'clientName') { this.clientKeyUp = false; }
    if (cntrl === 'rCheckName') { this.statusKeyUp = false; }
    if (cntrl === 'rCheckCtgryName') { this.componentKeyUp = false; }
  }
  recordCheckItems(value: any) {
    const rCheckIds: any[] = [];
    if (!value) { this.assignRecordCheckCopy(rCheckIds); }
    if (value) {
      this.statusflterlist = Object.assign([], this.statusDrpDwn.filter(f =>
        rCheckIds.indexOf(f.screeningStatusId) === -1)).filter(
          item => ((item.statusName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignRecordCheckCopy(rCheckIds: any) {
    this.statusflterlist = Object.assign([], this.statusDrpDwn.filter(f =>
      rCheckIds.indexOf(f.screeningStatusId) === -1));
  }

  displayRcheckFn(id: any): string {
    if (!id) { return ''; }
    const rChkName = this.statusDrpDwn.filter(res => res.screeningStatusId === id);
    return rChkName ? rChkName[0].statusName : '';
  }

  rCheckKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const rCheck = this.statusflterlist.filter(e =>
          e.statusName.toLowerCase() === value.toLowerCase());
        if (rCheck.length > 0) {
          this.statusKeyUp = true;
        } else {
          this.statusKeyUp = true;
        }
      } else {
        this.statusKeyUp = false;
      }
    }
  }

  get displayrcheckFn() {
    const rChkNewret = (recCheck) => {
      if (recCheck == null || recCheck === undefined) {
        return null;
      } else {
        if (recCheck && this.statusflterlist && this.statusflterlist.length > 0) {
          recCheck = this.statusflterlist.find(x => x.screeningStatusId === recCheck);
          return recCheck.statusName;
        } else {
          return null;
        }
      }
    };
    return rChkNewret;
  }

  recordCheckCatGryItems(value: any) {
    const rCheckCatGryIds: any[] = [];
    if (!value) { this.assignRecordCheckCatGryCopy(rCheckCatGryIds); }
    if (value) {
      this.componentflterlist = Object.assign([], this.componentDrpDwn.filter(f =>
        rCheckCatGryIds.indexOf(f.compId) === -1)).filter(
          item => ((item.compName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignRecordCheckCatGryCopy(rCheckCatGryIds: any) {
    this.componentflterlist = Object.assign([], this.componentDrpDwn.filter(f =>
      rCheckCatGryIds.indexOf(f.compId) === -1));
  }
  displayRcheckCatGryFn(id: any): string {
    if (!id) { return ''; }
    const rChkNameCatGry = this.componentDrpDwn.filter(res => res.compId === id);
    return rChkNameCatGry ? rChkNameCatGry[0].compName : '';
  }
  rCheckCatGryKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const rCheckCgry = this.componentflterlist.filter(e =>
          e.compName.toLowerCase() === value.toLowerCase());
        if (rCheckCgry.length > 0) {
          this.componentKeyUp = true;
        } else {
          this.componentKeyUp = true;
        }
      } else {
        this.componentKeyUp = false;
      }
    }
  }
  get displayrcheckCatGryFn() {
    const rChkCatGryNewret = (recCheckCatGry) => {
      if (recCheckCatGry == null || recCheckCatGry === undefined) {
        return null;
      } else {
        if (recCheckCatGry && this.componentflterlist && this.componentflterlist.length > 0) {
          recCheckCatGry = this.componentflterlist.find(x => x.compId === recCheckCatGry);
          return recCheckCatGry.compName;
        } else {
          return null;
        }
      }
    };
    return rChkCatGryNewret;
  }

  downloadFile(doc, filename) {
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
    if (this.criminalCheckReportList.length) {
      return Math.ceil(this.criminalCheckReportList.length / this.itemPerPage);
    }
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  getPropertyValue(event, property) {
    if (event.value !== '' && event.value !== null) {
      event.propertyName = property;
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
      for (const ctrl in this.criminalCheckReportForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    for (const ctrl in this.criminalCheckReportForm.controls) {
      if (ctrl === key) {
        this.criminalCheckReportForm.get(ctrl).setValue('');
      }
    }
  }
  resetForm() {
    this.clientItems('');
    this.recordCheckItems('');
    this.recordCheckCatGryItems('');
    this.criminalCheckReportForm.reset();
    this.criminalCheckReportForm.markAsPristine();
    this.initFormGroup();
    this.searchValueArr = [];
    this.criminalCheckReportList = [];
    this.page = 1;
    this.itemPerPage = 5;
  }
  toggle(data: any) {
    this.showSearch = !this.showSearch;

    if (this.showSearch) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }
  searchValue() {
    if (!this.criminalCheckReportForm.valid) {
      this.showTopCenter('warn', 'Failure Message', 'Component Name Is Required.');
      return;
    }
    let dateStr = null;
    const compId = this.criminalCheckReportForm.controls.componentId.value;
    const clientId = Number(this.criminalCheckReportForm.controls.clientId.value);
    const statusId = Number(this.criminalCheckReportForm.controls.statusId.value);
    const fromDate = this.datepipe.transform(this.criminalCheckReportForm.controls.fromDate.value, 'yyyy-MM-dd');
    const toDate = this.datepipe.transform(this.criminalCheckReportForm.controls.toDate.value, 'yyyy-MM-dd');
    if (fromDate !== null && toDate !== null) {
      dateStr = fromDate + '|' + toDate;
    } else {
      dateStr = null;
    }
    this.reportService.getCriminalReportData(compId, clientId, statusId, dateStr).subscribe(res => {
      if (res != null) {
        if (dateStr) {
          const value = res;
          // tslint:disable-next-line: max-line-length
          this.criminalCheckReportList = value.filter(r => r.caseReqDate.substring(0, 10) >= fromDate && r.caseReqDate.substring(0, 10) <= toDate);
          return;
        }
        this.criminalCheckReportList = res;
      }
    });
  }

}
