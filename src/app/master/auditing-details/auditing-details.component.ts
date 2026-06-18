import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormControlName } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Table, TableModule } from 'primeng/table';
import { startWith, map } from 'rxjs/operators';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';
// import { MatExpansionPanel, MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';

@Component({
  standalone: false,
  selector: 'app-auditing-details',
  templateUrl: './auditing-details.component.html',
  styleUrls: ['./auditing-details.component.css']
})
export class AuditingDetailsComponent implements OnInit {
  lookupNameControl = new UntypedFormControl();
  auditingDetailList: any[] = [];
  audoitSearchForm: UntypedFormGroup;

  moduleList: auditModuleVm[] = [];
  modulefilterlist: any[] = [];
  modulekeyUp = false;

  submoduleList: auditSubModuleVm[] = [];
  subModulefilterlist: any[] = [];
  subModulekeyUp = false;

  screenList: auditScreenVm[] = [];
  screenNamefilterlist: any[] = [];
  screenNamekeyUp = false;

  applicationNamefilterlist: any[] = [];
  appliactionNamekeyUp = false;

  auditTransVmList: AuditTransVm[] = [];
  getAuditDetailsList: any[] = [];
  UserTypeDeptList: any;
  isShowMore = false;

  startMinDate: Date;
  startmaxDate: Date;
  endMinDate: Date;
  endMaxDate: Date;

  auditList: any[] = [];
  auditingList: any[] = [];
  column: any;
  itemPerPage;
  page = 1;
  isDesc: boolean;
  direction: number;
  showSearchResult = true;
  showdSearch = true;
  expandedSC = false;

  applicationList: any[] = [];
  applicatinControl!: AutoCompleteDropDown;
  moduleControl!: AutoCompleteDropDown;
  submoduleControl!: AutoCompleteDropDown;
  screennameControl!: AutoCompleteDropDown;

  auditingDetails: any;
  filterListContent: any[] = [];
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  userId: number;
  filtersubmoduleList: auditSubModuleVm[];
  filterscreenList: auditScreenVm[];
  constructor(private masterService: MasterService, private formBuilder: UntypedFormBuilder,
    private commonService: CommonService, private dateP: DatePipe) {
    this.userId = JSON.parse(sessionStorage.getItem('user_data')).userId;
  }

  ngOnInit() {
    this.initFormGroup();
    this.getAuditDetails();
    this.audoitSearchForm.controls['subModuleName'].disable();
    this.audoitSearchForm.controls['screenName'].disable();
    this.getAudiTransList();
    this.itemPerPage = 5;
  }

  initFormGroup() {
    this.audoitSearchForm = new UntypedFormGroup({
      userId: new UntypedFormControl(),
      moduleName: new UntypedFormControl(),
      subModuleName: new UntypedFormControl(),
      screenName: new UntypedFormControl(),
      applicationName: new UntypedFormControl(),
      stateDate: new UntypedFormControl(),
      endDate: new UntypedFormControl(),
    });
    this.initautoCompleteCtrl();
  }

  initautoCompleteCtrl() {
    this.applicatinControl = new AutoCompleteDropDown('Application Name', 'applicationName', 'applicationName', 'applicationName', this.applicationList,
      '', this.audoitSearchForm, false, false, false);
    this.moduleControl = new AutoCompleteDropDown('Module Name', 'moduleName', 'moduleName', 'moduleName', this.moduleList,
      '', this.audoitSearchForm, false, false, false);
    this.submoduleControl = new AutoCompleteDropDown('SubModule Name', 'subModuleName', 'subModuleName', 'subModuleName', this.filtersubmoduleList,
      '', this.audoitSearchForm, false, false, false);
    this.screennameControl = new AutoCompleteDropDown('Screen Name', 'screenName', 'screenName', 'screenName', this.filterscreenList,
      '', this.audoitSearchForm, false, false, false);
  }

  getAudiTransList() {
    this.audoitSearchForm.controls['userId'].setValue(this.userId);
    this.masterService.GetAuditTrans(this.audoitSearchForm.value).subscribe(res => {
      this.auditTransVmList = res;
    }, err => { }, () => {
      this.initautoCompleteCtrl();
    });
  }

  getAuditDetails() {
    this.masterService.getAuditDetailsList().subscribe(res => {
      if (res) {
        this.applicationList = res.auditApplicationVm;
        this.moduleList = res.auditModuleVm;
        this.submoduleList = res.auditSubModuleVm;
        this.screenList = res.auditScreenVm;
        this.initautoCompleteCtrl();
        // console.log('this.moduleList', this.moduleList)
      }
    });
  }

  submodulefilter() {
    const moduleId = this.moduleList.find(m => m.moduleName === this.audoitSearchForm.get('moduleName')?.value).moduleId;
    this.filtersubmoduleList = this.submoduleList.filter(s => s.moduleId
      === moduleId);
    this.submoduleControl = new AutoCompleteDropDown('SubModule Name', 'subModuleName', 'subModuleName', 'subModuleName', this.filtersubmoduleList,
      '', this.audoitSearchForm, false, false, false);
    if (this.filtersubmoduleList.length === 0) {
      this.audoitSearchForm.controls['subModuleName'].disable();
    } else {
      this.audoitSearchForm.controls['subModuleName'].enable();
    }
    if (this.screenList.length === 0) {
      this.audoitSearchForm.controls['screenName'].disable();
    } else {
      this.audoitSearchForm.controls['screenName'].enable();
    }

  }
  setSubModule(event: any) {
    if (event.value.trim() === '') {
      this.audoitSearchForm.get('subModuleName')?.setValue(null);
      this.audoitSearchForm.get('screenName')?.setValue(null);
      this.filtersubmoduleList = [];
      this.audoitSearchForm.controls['subModuleName'].disable();
      this.audoitSearchForm.controls['screenName'].disable();
      this.submoduleControl = new AutoCompleteDropDown('SubModule Name', 'subModuleName', 'subModuleName', 'subModuleName', this.filtersubmoduleList,
        '', this.audoitSearchForm, false, false, false);

    }
  }

  screenNameFilter() {
    const moduleId = this.moduleList.find(m => m.moduleName === this.audoitSearchForm.get('moduleName')?.value).moduleId;
    this.filterscreenList = this.screenList.filter(s => s.moduleId === moduleId);
    this.screennameControl = new AutoCompleteDropDown('Screen Name', 'screenName', 'screenName', 'screenName', this.filterscreenList,
      '', this.audoitSearchForm, false, false, false);
  }

  screenFilter() {
    const subModuleId = this.submoduleList.find(m => m.subModuleName === this.audoitSearchForm.get('subModuleName')?.value).subModuleId;
    this.filterscreenList = this.screenList.filter(s => s.subModuleId === subModuleId);
    this.screennameControl = new AutoCompleteDropDown('Screen Name', 'screenName', 'screenName', 'screenName', this.filterscreenList,
      '', this.audoitSearchForm, false, false, false);
  }

  setScreen(event: any) {
    if (event.value.trim() === '') {
      this.audoitSearchForm.get('screenName')?.setValue(null);
      this.filterscreenList = [];
      this.screennameControl = new AutoCompleteDropDown('Screen Name', 'screenName', 'screenName', 'screenName', this.filterscreenList,
        '', this.audoitSearchForm, false, false, false);

    }
  }

  resetFilterSort() {
    this.audoitSearchForm.reset();
    this.filterListContent = [];
    this.getAuditDetails();
    this.getAudiTransList();
    this.filterscreenList = [];
    this.page = 1;
    this.expandedSC = false;
    this.audoitSearchForm.controls['subModuleName'].disable();
    this.audoitSearchForm.controls['screenName'].disable();
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
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }

  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  toggle() {
    this.showSearchResult = !this.showSearchResult;

    if (this.showSearchResult) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }

  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.filterListContent.length > 0) {
        if (this.filterListContent.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
          if (this.filterListContent.filter(x => x.propertyName === event.propertyName).length > 0) {
            const index = this.filterListContent.findIndex(f => f.propertyName === event.propertyName);
            this.filterListContent.splice(index, 1, { propertyName: event.propertyName, value: event.value });
          } else {
            this.filterListContent.push({ propertyName: event.propertyName, value: event.value });
          }
        }
      } else {
        this.filterListContent.push({ propertyName: event.propertyName, value: event.value });
      }
    } else {
      for (const ctrl in this.audoitSearchForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.filterListContent.findIndex(x => x.propertyName === ctrl);
          this.filterListContent.splice(index, 1);
        }
      }
    }
  }
  showall() {
    if (this.auditTransVmList.length > 0) {
      this.itemPerPage = this.auditTransVmList.length;
    }
  }
  removeSearchValue(key, index) {
    this.filterListContent.splice(index, 1);
    for (const ctrl in this.audoitSearchForm.controls) {
      if (ctrl === key) {
        this.audoitSearchForm.get(ctrl).setValue('');
      }
    }
  }

  getRecordBydate(type: any) {
    if (this.audoitSearchForm.get('stateDate')?.value && this.audoitSearchForm.get('endDate')?.value) {
      const data: any[] = [];
      const FromDate = this.dateP.transform(this.audoitSearchForm.get('stateDate')?.value, 'yyyy-MM-dd');
      const ToDate = this.dateP.transform(this.audoitSearchForm.get('endDate')?.value, 'yyyy-MM-dd');
      this.auditTransVmList.map(d => d.created = this.dateP.transform(d.created, 'yyyy-MM-dd'));
      this.auditTransVmList = this.auditTransVmList.filter(x =>
        x.created >= FromDate && x.created <= ToDate);
      const ftDate = new DatePipe('en-GB');
      data.push({
        propertyName: 'stateDate',
        value: ftDate.transform(this.audoitSearchForm.get('stateDate')?.value, 'dd/MM/yyyy')
      },
        {
          propertyName: 'endDate',
          value: ftDate.transform(this.audoitSearchForm.get('endDate')?.value, 'dd/MM/yyyy')
        });
      for (let i = 0; i < data.length; i++) {
        this.getPropertyValue(data[i]);
      }
    } else {
      for (const ctrl in this.audoitSearchForm.controls) {
        if (ctrl === type) {
          const index = this.filterListContent.findIndex(x => x.propertyName === ctrl);
          this.filterListContent.splice(index, 1);
        }
      }
    }

  }

  getPage(event: any) {
    this.page = event;
  }

}

class AuditTransSearch {
  userId: number;
  moduleId: number;
  subModuleId: number;
  screenId: number;
  applicationId: number;
  stateDate: Date;
  endDate: Date;
}

class filterType {
  type: string;
  idName?: string;
  id?: number;
  value?: string;
  toolTip: string;
}

class AuditTransVm {
  auditId: number;
  applicationId: number;
  applicationName: string;
  moduleId?: number;
  moduleName: string;
  subModuleId?: number;
  subModuleName: string;
  screenId?: number;
  screenName: string;
  userId?: number;
  userName: string;
  actionLookupId?: number;
  controllerName: string;
  methodName: string;
  successFlag?: boolean;
  description: string;
  innerException: string;
  created?: string;
  lookupName: string;
}

class GetAuditDetails {
  application: auditApplicationVm[] = [];
  auditList: RolePermissionVm;
}

class auditApplicationVm {
  applicationId: number;
  applicationName: string;
}

class RolePermissionVm {
  application: auditApplicationVm[] = [];
  module: auditModuleVm[] = [];
  subModuleVm: auditSubModuleVm[] = [];
  screenVm: auditScreenVm[] = [];
}

class auditModuleVm {
  moduleId: number;
  moduleName: string;
}

class auditSubModuleVm {
  moduleId: number;
  subModuleId: number;
  subModuleName: string;
}

class auditScreenVm {
  screenId: number;
  moduleId: number;
  subModuleId: number;
  screenName: string;
}
