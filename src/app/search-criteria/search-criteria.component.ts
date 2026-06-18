import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SearchCriteriaService } from '../common-methods/services/search-criteria.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Status } from '../common-methods/models/status';
import { Country } from '../common-methods/models/country';
import { VerificationService } from '../common-methods/services/verification.service';
import { AutoCompleteDropDown } from '../common-methods/models/autoComplete';
import { CommonService } from '../common-methods/services/common.service';
import { Router } from '@angular/router';
import { ScreeningService } from '../common-methods/services/screening.service';
import { QualityCheckService } from '../common-methods/services/quality-check.service';
import { MessageService } from 'primeng/api';
// import { Vendors } from '../common-methods/Models/searchCriteria';

@Component({
  standalone: false,
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.css']
})
export class SearchCriteriaComponent implements OnInit {
  searchList: any[] = [];
  searchValueArr: any[] = [];
  searchForm: UntypedFormGroup;
  componentControl!: AutoCompleteDropDown;
  vendorControl!: AutoCompleteDropDown;
  clientControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  userControl!: AutoCompleteDropDown;
  closedByControl!: AutoCompleteDropDown;
  verificationControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  clientRefControl!: AutoCompleteDropDown;
  empInsControl!: AutoCompleteDropDown;
  vendorList: any;
  clientList: any;
  statusList: any;
  userList: any;
  componentList: any;
  verificationIdList: any;
  clientReferenceIdList: any;
  candidateList: any;
  empInsList: any;
  searchDetails: any[] = [];
  expandedSC = false;
  showdSearch = true;
  showSearchResult = true;
  userData: any;
  column: string;
  @Input() filterLength: number;
  isDesc: boolean;
  direction: number;
  itemPerPage = 5;
  page = 1;
  routePath = 'Search  / Search List';
  searchDetailsVm = new SearchDetailsVm();
  getPriorityVm: GetPriorityVm = new GetPriorityVm();
  countList: any;
  deptList: any;
  userComponentList: any;
  // hideToggle = false;
  // searchCriteriaFormGroup: UntypedFormGroup;
  // // vendorsView: Vendors[] = [];
  // agentlists: any[] = [];
  // agentName: any; serviceTypeName: any;
  // candidateName: any;
  // filterAgents: any[] = [];
  // vendorsList: any;
  // filterVendors: any;
  // vendorName: any;
  // statusList: Status[] = [];
  // countryList: Country[] = [];
  // filteredstatusList: Observable<Status[]>;
  // filteredCountryList: Observable<Country[]>;
  // statusControl = new UntypedFormControl();
  // countryControl = new UntypedFormControl();
  // serviceType: any;
  // filterServiceTypes: any;
  // filterCandidates: any;
  // candidateList: any;
  // country: any;
  // filterCountry: any;
  // constructor(public searchCriteriaService: SearchCriteriaService) { }
  // displayedColumns: string[] = ['Prio', 'RefNo', 'CandidateName', 'Employer', 'Service',
  //   'Agency',
  //   'ReqDate',
  //   'Country',
  //   'Status',
  //   'Owner'];
  // dataSource = new MatTableDataSource([]);
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  // ngOnInit() {
  //   this.initFormGroup();
  //   this.getSearchCriteriaMasterList();
  //   this.getScreeningDetails();
  //   // this.getAllAgents();
  //   this.dataSource.sort = this.sort;
  //   // this.getAllVendors();
  //   // this.getAllStatus();
  //   // this.getAllCountry();
  // }
  // initFormGroup() {
  //   this.searchCriteriaFormGroup = new UntypedFormGroup(
  //     {
  //       agentname: new UntypedFormControl(),
  //       vendors: new UntypedFormControl(),
  //       serviceTypeName: new UntypedFormControl(),
  //       candidateName: new UntypedFormControl(),
  //       country: new UntypedFormControl(),
  //       // statusControl: new UntypedFormControl()
  //     });
  // }
  // getScreeningDetails() {
  //   this.searchCriteriaService.getScreeningDetailsByFilterCriteria()
  //     .subscribe(resp => {
  //       console.log(resp, 'getScreeningDetails');
  //       if (resp) {
  //         // dataSource = new MatTableDataSource(ELEMENT_DATA);
  //         this.dataSource = new MatTableDataSource(resp);
  //         // this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }
  //     });
  // }
  // getSearchCriteriaMasterList() {
  //   this.searchCriteriaService.getSearchCriteriaList()
  //     .subscribe(resp => {
  //       console.log(resp, 'getSearchCriteriaMasterList');
  //       if (resp) {
  //         // All Service Types
  //         this.serviceType = resp.getAllServiceTypes;
  //         this.filterServiceTypes = resp.getAllServiceTypes;
  //         //
  //         this.vendorsList = resp.getAllVendor;
  //         this.filterVendors = resp.getAllVendor;
  //         // Agents
  //         this.filterAgents = resp.getAllAgents;
  //         this.agentlists = resp.getAllAgents;
  //         // All Status
  //         this.statusList = resp.getAllStatus;
  //         this.filterData();
  //         // All country
  //         this.countryList = resp.getAllCountry;
  //         this.filteredCountryList = resp.getAllCountry;
  //         // All Candidate Names
  //         this.filterCandidates = resp.getAllCandidates;
  //         this.candidateList = resp.getAllCandidates;
  //       }
  //     });
  // }
  // assignCandidates() {
  //   this.filterCandidates = Object.assign([], this.candidateName);
  // }
  // candidateFilterItem(value: any) {
  //   if (!value) { this.assignCandidates(); }
  //   if (value) {
  //     this.filterCandidates = Object.assign([], this.candidateName).filter(
  //       item => (item.candidateFullName.toLowerCase().indexOf(value.toLowerCase())) > -1);
  //   }
  // }
  // assignServiceTypes() {
  //   this.filterServiceTypes = Object.assign([], this.serviceType);
  // }
  // serviceTypeFilterItem(value: any) {
  //   if (!value) { this.assignServiceTypes(); }
  //   if (value) {
  //     this.filterServiceTypes = Object.assign([], this.serviceType).filter(
  //       item => (item.rptTyepe.toLowerCase().indexOf(value.toLowerCase())) > -1);
  //   }
  // }
  // onSelectVendor(result: any) {
  //   this.vendorName = result.vendorName;
  // }
  // vendorFilterItem(value: any) {
  //   if (!value) { this.assignCopys(); }
  //   if (value) {
  //     this.filterVendors = Object.assign([], this.vendorsList).filter(
  //       item => (item.vendorName.toLowerCase().indexOf(value.toLowerCase())) > -1);
  //   }
  // }
  // assignCopys() {
  //   this.filterVendors = Object.assign([], this.vendorsList);
  // }

  // displayFnVendors(vendor): string {
  //   if (vendor == null || vendor === undefined) {
  //     return null;
  //   } else {
  //     if (vendor.vendorName) {
  //       return vendor.vendorName;
  //     } else {
  //       return vendor;
  //     }
  //   }
  // }

  // assignCopy() {
  //   this.filterAgents = Object.assign([], this.agentlists);
  // }
  // getname(data: any) {
  //   this.agentName = data.agentName;
  // }
  // agentFilterItem(value: any) {
  //   if (!value) { this.assignCopy(); }
  //   if (value) {
  //     this.filterAgents = Object.assign([], this.agentlists).filter(
  //       item => (item.agentName.toLowerCase().indexOf(value.toLowerCase())) > -1);
  //   }
  // }

  // assignCountry() {
  //   this.filteredCountryList = Object.assign([], this.country);
  // }
  // countryFilterItem(value: any) {
  //   if (!value) { this.assignCountry(); }
  //   if (value) {
  //     this.filteredCountryList = Object.assign([], this.country).filter(
  //       item => (item.country.toLowerCase().indexOf(value.toLowerCase())) > -1);
  //   }
  // }

  // filterData() {
  //   this.filteredstatusList = this.statusControl.valueChanges.pipe(startWith(''),
  //     map(value => this.filterStatus(value))
  //   );
  // }
  // filterStatus(value: any) {
  //   const filterValue = value.toLowerCase();
  //   return this.statusList.filter(option => option.screeningStatus.toLowerCase().includes(filterValue));
  // }

  constructor(public verificationService: VerificationService, private route: Router, public commonService: CommonService,
    // tslint:disable-next-line:align
    public messageService: MessageService, public screeningService: ScreeningService, public qualityCheckService: QualityCheckService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.GetComponentDetails();
    this.getCount();
  }
  GetComponentDetails() {
    this.verificationService.GetComponentDetails().subscribe(resp => {
      this.searchDetails = resp.verificationDetailsVm;
      if (this.userData.teamLeadFlag) {
        this.deptList = resp.vtsDepartCompMases;
        this.userComponentList = this.deptList.filter(x => x.deptId === this.userData.deptId);
      }
      this.getList();
    });
  }

  getList() {
    this.searchDetails.map(m =>
      m.candidateFullName = m.candidateFirstName + ' ' + m.candidateMiddleName + '' + m.candidateLastName);
    if (this.searchDetails) {
      this.clientList = Array.from(new Map
        (this.searchDetails.map(x => ({ clientName: x.clientName }))
          .map(e => [e.clientName, e])).values());
      this.vendorList = Array.from(new Map
        (this.searchDetails.map(x => ({ vendorName: x.vendorName }))
          .map(e => [e.vendorName, e])).values());
      this.componentList = Array.from(new Map
        (this.searchDetails.map(x => ({ componentName: x.componentName }))
          .map(e => [e.componentName, e])).values());
      this.candidateList = Array.from(new Map
        (this.searchDetails.map(x => ({ candidateFullName: x.candidateFullName })).filter(f => f.candidateFullName !== null)
          .map(e => [e.candidateFullName, e])).values());
      this.verificationIdList = Array.from(new Map
        (this.searchDetails.map(x => ({ verificationId: x.verificationId }))
          .map(e => [e.verificationId, e])).values());
      this.clientReferenceIdList = Array.from(new Map
        (this.searchDetails.map(x => ({ clientRefNo: x.clientRefNo }))
          .map(e => [e.clientRefNo, e])).values());
      this.statusList = Array.from(new Map
        (this.searchDetails.map(x => ({ statusName: x.componentStatus })).filter(f => f.statusName !== null)
          .map(e => [e.statusName, e])).values());
      this.userList = Array.from(new Map
        (this.searchDetails.map(x => ({ ownerName: x.screeningOwnerName })).filter(f => f.ownerName !== null)
          .map(e => [e.ownerName, e])).values());
      this.empInsList = Array.from(new Map
        (this.searchDetails.map(x => ({ functionalEntity: x.functionalEntity })).filter(f => f.functionalEntity !== null)
          .map(e => [e.functionalEntity, e])).values());
      this.initautoCompleteCtrl();
      this.searchList = this.searchDetails;
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
      for (const ctrl in this.searchForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  removeSearchValue(key, index) {
    // tslint:disable-next-line: forin
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.searchForm.controls) {
      if (ctrl === key) {
        this.searchForm.get(ctrl).setValue('');
      }
      if (ctrl === 'reqFromDate' || ctrl === 'reqToDate') {
        this.searchList = this.commonService.CloneObject(this.searchDetails);
      }
    }
  }
  initFormGroup() {
    this.searchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      verificationId: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      functionalEntity: new UntypedFormControl(null),
      compName: new UntypedFormControl(null),
      vendorName: new UntypedFormControl(null),
      statusName: new UntypedFormControl(null),
      ownerName: new UntypedFormControl(null),
      closedBy: new UntypedFormControl(null),
      LastCommunicationDate: new UntypedFormControl(null),
      callbackDate: new UntypedFormControl(null),
      clientUpdateDate: new UntypedFormControl(null),
      reqFromDate: new UntypedFormControl(null),
      reqToDate: new UntypedFormControl(null),
      closureFromDate: new UntypedFormControl(null),
      closureToDate: new UntypedFormControl(null),
      assignStatus: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'componentName', 'componentName', this.componentList,
      '', this.searchForm, true, false, false);
    this.vendorControl = new AutoCompleteDropDown('Vendor Name', 'vendorName', 'vendorName', 'vendorName', this.vendorList,
      '', this.searchForm, true, false, false);
    this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientList,
      '', this.searchForm, true, false, false);
    this.statusControl = new AutoCompleteDropDown('Status Name', 'statusName', 'statusName', 'statusName', this.statusList,
      '', this.searchForm, true, false, false);
    this.userControl = new AutoCompleteDropDown('Owner Name', 'ownerName', 'ownerName', 'ownerName', this.userList,
      '', this.searchForm, true, false, false);
    this.closedByControl = new AutoCompleteDropDown('Closed By', 'ownerName', 'ownerName', 'ownerName', this.userList,
      '', this.searchForm, true, false, false);
    this.verificationControl = new AutoCompleteDropDown('Verification ID', 'verificationId', 'verificationId', 'verificationId',
      this.verificationIdList, '', this.searchForm, true, false, false);
    this.clientRefControl = new AutoCompleteDropDown('Client Ref ID', 'clientRefNo', 'clientRefNo', 'clientRefNo',
      this.clientReferenceIdList, '', this.searchForm, true, false, false);
    this.candidateControl = new AutoCompleteDropDown('candidate Name', 'candidateName', 'candidateFullName', 'candidateFullName',
      this.candidateList, '', this.searchForm, true, false, false);
    this.empInsControl = new AutoCompleteDropDown('Employer/Institution Name', 'functionalEntity', 'functionalEntity',
      'functionalEntity', this.empInsList, '', this.searchForm, true, false, false);
  }
  toggle(data: any) {
    this.showSearchResult = !this.showSearchResult;
    if (this.showSearchResult) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }
  resetFilterSort(type: any) {
    this.searchForm.reset();
    this.searchValueArr = [];
    this.column = '';
    switch (type) {
      case 'tab':
        this.searchList = this.commonService.CloneObject(this.searchList);
        break;
      case 'reset':
        this.GetComponentDetails();
        break;
      default:
        break;
    }
  }
  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  getTotalPage(): number {
    if (this.searchList.length) {
      return Math.ceil(this.searchList.length / this.itemPerPage);
    }
  }
  navigateUrl(data: any) {
    // let index;
    // if (this.userData.teamLeadFlag) {
    //    index = this.userComponentList.findIndex(x => x.compId === data.componentId);
    // }||
    // (this.userData.teamLeadFlag === true && index > -1)
    if (data.screeningOwnerName === this.userData.userName) {
      this.workFlowBasedUrl(data);
    } else {
      // this.showNotification('warn', 'Failure Message', 'You do not have permission to open this case.');
    }
  }
  workFlowBasedUrl(data: any) {
    if (data.workFlowName === 'VE') {
      this.verificationService.changeMessage(data.screeningCompId);
      this.route.navigate(['dashboard/verification/verificationDetail']);
    } else if (data.workFlowName === 'QC') {
      this.qualityCheckService.changeMessage(data);
      this.route.navigate(['dashboard/qc/qualityCheckDetail']);
    } else if (data.workFlowName === 'DE') {
      this.screeningService.screeningCompId = data.screeningCompId;
      this.route.navigate(['dashboard/screening/clientapp']);
    } else if (data.workFlowName === 'FQC') {
      this.qualityCheckService.changeMessage(data);
      this.route.navigate(['dashboard/qc/qualityCheckDetail']);
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
  searchFunc() {
    this.searchForm.value.screeningCompId = this.commonService.getNuumberFromString(this.searchForm.value.screeningCompId);
    this.searchDetailsVm = this.searchForm.value;
    this.verificationService.GetSearchDetails(this.searchDetailsVm).subscribe(res => {
      this.searchDetails = res;
      this.getList();
    });
  }
  getCount() {
    this.verificationService.GetPriorityCount(this.userData).subscribe(resp => {
      this.countList = resp;
    });
  }
  openCount(priorityLookup: number, count: number) {
    if (count > 0) {
      this.getPriorityVm = new GetPriorityVm();

      this.getPriorityVm.priorityLookupId = priorityLookup;
      this.getPriorityVm.loginUserDetVm = this.userData;

      this.verificationService.GetPriority(priorityLookup).subscribe(resp => {
        this.searchDetails = resp;
        this.getList();
      });
    }
  }
}

export class SearchDetailsVm {
  candidateName: string;
  empName: string;
  insName: string;
  screeningCompId: number;
  clientId: number;
  siteId: string;
  compId: number;
  vendorId: number;
  screeningOwnerId: number;
  requestDate: Date;
  lastCommunicationDate: Date;
  callbackDate: Date;
  cientUpdateDate: Date;
}

export interface PeriodicElement {
  CandidateName: string;
  Prio: number;
  RefNo: number;
  Employer: string;
  Service: string;
  Agency: string;
  ReqDate: string;
  Country: string;
  Status: string;
  Owner: string;
}
class GetPriorityVm {
  priorityLookupId: number;
  loginUserDetVm: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Prio: 1, CandidateName: 'Hydrogen', RefNo: 123, Employer: 'Supervisor',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 2, CandidateName: 'Helium', RefNo: 446, Employer: 'Admin',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 3, CandidateName: 'Lithium', RefNo: 6941, Employer: 'SuperAdmin',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 4, CandidateName: 'Beryllium', RefNo: 9122, Employer: 'Software',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 5, CandidateName: 'Boron', RefNo: 1811, Employer: 'Account',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 6, CandidateName: 'Carbon', RefNo: 12107, Employer: 'Cleark',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 7, CandidateName: 'Nitrogen', RefNo: 14067, Employer: 'Jr Software',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 8, CandidateName: 'Oxygen', RefNo: 15994, Employer: 'O',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 9, CandidateName: 'Fluorine', RefNo: 18984, Employer: 'F',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
  {
    Prio: 10, CandidateName: 'Neon', RefNo: 20797, Employer: 'Ne',
    Service: 'ABB', Agency: '123ABB', ReqDate: '15/10/2019', Country: 'India', Status: 'Pending', Owner: 'Rajesh'
  },
];


