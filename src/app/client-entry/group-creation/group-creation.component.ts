import { Component, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { GroupCreation, GroupSites } from '../../common-methods/models/group-creation';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { SearchCriteriaService } from '../../common-methods/services/search-criteria.service';
import { MasterService } from '../../common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from '../../common-methods/services/common.service';
import { Table, TableModule } from 'primeng/table';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../common-methods/services/auth.service';
import { AutoCompleteDropDown } from '../../common-methods/models/autoComplete';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.css']
})
export class GroupCreationComponent implements OnInit {
  // itemperpage;
  // checked = false;
  // clientlst: any[] = [];
  // siteNameLists: [];
  // filterCandidates: any;
  // candidateName: any;
  // groupCreation: GroupCreation = new GroupCreation();
  // groupFormGroup: UntypedFormGroup;
  // showView = true;
  // groupNameFilter = new UntypedFormControl();
  // groupSites: any[] = [];
  // filteredGroupNames: Observable<string[]>;
  // frozenCols = [{ field: 'action', header: 'Action' }];
  // cols = [
  //   { field: 'clientName', header: 'Client Name' },
  //   { field: 'groupName', header: 'Group Name' },
  //   { field: 'contactPerson', header: 'Contact Person' },
  //   { field: 'billingPersonName', header: 'Billing Person' },
  //   tePath = 'Client / Group Creation';
  // siteNoDisplay: any;
  // isEditFlag = false;
  // selectedOptions: number[] = [];
  // @ViewChild('global', { static: true }) global!: ElementRef;
  // totalpages: number;
  // @ViewChild('billingtab', { static: true }) billingtab: DataTable;
  // currentPage = 1;
  // tempCurrentPage = 1;
  //@ViewChild('clientNameTrigger', { static: true }) 
// clientNameTrigger!: MatMenuTrigger;
  // clientNameFilteredOptions: Observable<string[]>;
  // clientNameControl = new UntypedFormControl();
  // @ViewChild('groupNameTrigger', { static: true }) groupNameTrigger: MatMenuTrigger;
  // groupNameFilteredOptions: Observable<string[]>;
  // groupNameControl = new UntypedFormControl();
  // @ViewChild('contactPersonTrigger', { static: true }) contactPersonTrigger: MatMenuTrigger;
  // contactPersonFilteredOptions: Observable<string[]>;
  // contactPersonControl = new UntypedFormControl();
  // @ViewChild('billingPersonNameTrigger', { static: true }) billingPersonNameTrigger: MatMenuTrigger;
  // billingPersonNameFilteredOptions: Observable<string[]>;
  // billingPersonNameControl = new UntypedFormControl();
  // @ViewChild('siteNameTrigger', { static: true }) siteNameTrigger: MatMenuTrigger;
  // siteNameFilteredOptions: Observable<string[]>;
  // siteNameControl = new UntypedFormControl();
  // billingKeyup = false;
  // screenAuth: any = {};
  // siteRequiredFlag = false;
  // clientControls!: AutoCompleteDropDown;{ field: 'siteName', header: 'Site Name' },
  //   { field: 'active', header: 'Active' },
  // ];

    itemperpage: any;
  checked = false;

  clientlst: any[] = [];
  siteNameLists: any[] = [];

  filterCandidates: any;
  candidateName: any;

  groupCreation: GroupCreation = new GroupCreation();

  groupFormGroup!: UntypedFormGroup;
routePath: string = '';
  showView = true;

  groupNameFilter = new UntypedFormControl();

  groupSites: any[] = [];
  filteredGroupNames!: Observable<string[]>;

  frozenCols = [
    { field: 'action', header: 'Action' }
  ];

  cols = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'groupName', header: 'Group Name' },
    { field: 'contactPerson', header: 'Contact Person' },
    { field: 'billingPersonName', header: 'Billing Person' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'active', header: 'Active' }
  ];

  tePath = 'Client / Group Creation';
  siteNoDisplay: any;
  isEditFlag = false;

  selectedOptions: number[] = [];

  currentPage = 1;
  tempCurrentPage = 1;
  totalpages!: number;

  // ViewChild fixes (Angular 9 style)
  @ViewChild('global') global!: ElementRef;
  @ViewChild('billingtab') billingtab!: Table;

  @ViewChild('clientNameTrigger') clientNameTrigger!: MatMenuTrigger;
  clientNameFilteredOptions!: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

  @ViewChild('groupNameTrigger') groupNameTrigger!: MatMenuTrigger;
  groupNameFilteredOptions!: Observable<string[]>;
  groupNameControl = new UntypedFormControl();

  @ViewChild('contactPersonTrigger') contactPersonTrigger!: MatMenuTrigger;
  contactPersonFilteredOptions!: Observable<string[]>;
  contactPersonControl = new UntypedFormControl();

  @ViewChild('billingPersonNameTrigger') billingPersonNameTrigger!: MatMenuTrigger;
  billingPersonNameFilteredOptions!: Observable<string[]>;
  billingPersonNameControl = new UntypedFormControl();

  @ViewChild('siteNameTrigger') siteNameTrigger!: MatMenuTrigger;
  siteNameFilteredOptions!: Observable<string[]>;
  siteNameControl = new UntypedFormControl();

  billingKeyup = false;
  screenAuth: any = {};
  siteRequiredFlag = false;

clientControls!: AutoCompleteDropDown;
// { field: 'siteName', header: 'Site Name' },
  //   { field: 'active', header: 'Active' },
  // ];

  groupList: any[] = [];
  groupNames: any;
  rowCount: number;
  localUser: any;
  // rou

  breadcrumbFlags = new BreadcrumbFlags();
  address = new BehaviorSubject(null);
  constructor(public masterService: MasterService, private dialog: MatDialog, public searchCriteriaService: SearchCriteriaService,
    // tslint:disable-next-line:align
    private messageService: MessageService, private authService: AuthService, public common: CommonService,
    // tslint:disable-next-line:align
    private formBuilder: UntypedFormBuilder, private router: Router,) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (changes.siteNameLists) {
      if (this.siteNameLists) {
        this.loadSites();
      }
    }
  }
  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    const userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.localUser = userData.userId;
    this.getAllGroupNames();
    this.getGroupList();
    this.itemperpage=10;
  }
  initFormGroup() {
    this.groupFormGroup = this.formBuilder.group(
      {
        clientId: ['', [Validators.required]],
        groupName: ['', [Validators.required]],
        contactPerson: ['', [Validators.required]],
        billingPersonName: ['', [Validators.required]],
        gstNo: ['', [Validators.required]],
        active: [true],
        groupSite: ['', [Validators.required]],
        loggedIn: new UntypedFormControl(this.localUser),
        groupCreationId: new UntypedFormControl(0),
        address: new UntypedFormGroup({
          addressId: new UntypedFormControl(0),
          addLine1: new UntypedFormControl('', Validators.required),
          addLine2: new UntypedFormControl(''),
          addLine3: new UntypedFormControl(''),
          cityId: new UntypedFormControl(''),
          districtId: new UntypedFormControl(),
          stateId: new UntypedFormControl('', Validators.required),
          countryId: new UntypedFormControl('', Validators.required),
          postalCode: new UntypedFormControl('', Validators.required),
          locationId: new UntypedFormControl(),
          country: new UntypedFormControl(),
          state: new UntypedFormControl(),
          place: new UntypedFormControl(),
          district: new UntypedFormControl(),
          city: new UntypedFormControl()
        }),
      });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlst,
        '', this.groupFormGroup, false, false, true);
  }
  getGroupDetail() {
    this.masterService.getGroupDetail().subscribe(res => {
      if (res) {
        this.clientlst = res.client;
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlst,
            '', this.groupFormGroup, false, false, true);
      }
    });
  }
  getAllGroupNames() {
    this.masterService.getAllGroupNames(this.groupCreation.clientId).subscribe(resp => {
      if (resp) {
        this.groupNames = resp;
        this.groupNames.filter(x => x.cGroupWiseName == null).map(y => y.cGroupWiseName = '');
        this.filteredGroupNames = this.groupNameFilter.valueChanges
          .pipe(startWith(''), map(value => this._filterClient(value))
          );
      }
    });
  }
  getAllSiteNamesByAgentId(clientId: any) {
    this.groupSites = [];
    this.selectedOptions = [];
    this.billingKeyup = false;
    this.masterService.getSiteNoByAgentId(clientId, '').subscribe(resp => {
      if (resp) {
        this.groupSites = resp.groupSite;
        this.siteNoDisplay = resp.siteNoDisplay;
        if (!this.isEditFlag) {
          setTimeout(() => {
            if (this.siteNoDisplay.length > 0) {
              this.siteNoDisplay.forEach(el => {
                if (this.groupSites.filter(l => +l.siteId === el.siteId)) {
                  this.selectedOptions.push(el.siteId);
                  this.groupFormGroup.controls.groupSite.setValue([this.selectedOptions ? this.selectedOptions : '']);
                }
              });
            } else {
              this.selectedOptions.push(resp.groupSite.siteId);
            }
          }, 0);
        }
        if (this.groupSites.length === 0) {
          this.showTopCenter('warn', 'Failure Message', 'Site not available, please select another client');
          this.groupFormGroup.controls.clientId.setValue(undefined);
        }
      }
    });
  }
  private _filterClient(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupNames.filter(option => option.cGroupWiseName.toLowerCase().includes(filterValue));
  }
  assignCandidates() {
    this.filterCandidates = Object.assign([], this.candidateName);
  }
  candidateFilterItem(value: any) {
    if (!value) { this.assignCandidates(); }
    if (value) {
      this.filterCandidates = Object.assign([], this.candidateName).filter(
        item => (item.candidateFullName.toLowerCase().indexOf(value.toLowerCase())) > -1);
    }
  }
  getCountryName(data: any) {
    this.groupCreation.countryId = data.countryId;
    this.groupCreation.countryName = data.country;
  }
  loadSites() {
    if (this.groupCreation.groupSites.length > 0) {
      this.rowCount = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.groupCreation.groupSites.length; i++) {
        this.groupFormGroup.addControl('groupSite' + this.rowCount, new UntypedFormControl());
        this.groupCreation.groupSites[i].rowCount = this.rowCount;
        this.rowCount++;
      }
    }
  }
  selectAll(event: any) {
    this.selectedOptions = [];
    if (event.checked === true) {
      this.groupSites.forEach(element => {
        element.active = event.checked;
        this.selectedOptions.push(element.siteId);
      });
      this.groupFormGroup.patchValue({ groupSite: [this.selectedOptions] });
    } else {
      this.groupFormGroup.controls.groupSite.setValue('');
    }
  }
  saveGroupDetail() {
    const controlNames = ['clientId', 'groupName', 'contactPerson', 'billingPersonName', 'gstNo', 'groupSite'];
    for (const ctrl in this.groupFormGroup.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!this.groupFormGroup.get(ctrl).value) {
          this.groupFormGroup.get(ctrl).setValidators(Validators.required);
          this.groupFormGroup.get(ctrl).updateValueAndValidity();
        } else {
          this.groupFormGroup.get(ctrl).clearValidators();
          this.groupFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
    }
    if (this.groupFormGroup.get('clientId')?.value > 0 && this.groupFormGroup.get('groupSite')?.value.length > 0) {
      if (this.groupFormGroup.valid) {
        const siteIds: number[] = this.groupFormGroup.get('groupSite')?.value;
        const checkedSiteLst = this.groupSites.filter(f => siteIds ? siteIds.indexOf(f.siteId) > -1 : '');
        const siteLst: object[] = [];
        checkedSiteLst.forEach(element => {
          element.active = true;
          siteLst.push(element);
        });
        this.groupFormGroup.value.groupSite = siteLst;
        if (this.isEditFlag) {
          const unCheckSiteIds = this.common.tempResetData.groupSite.filter(f => !siteIds.includes(f));
          const unCheckSiteLst = this.groupSites.filter(f => unCheckSiteIds ? unCheckSiteIds.indexOf(f.siteId) > -1 : '');
          unCheckSiteLst.forEach(element => {
            element.active = false; this.groupFormGroup.controls.groupSite.value.push(element);
          });
        }
        this.masterService.saveGroupCreation(this.groupFormGroup.value).subscribe(resp => {
          if (resp.success) {
            // setTimeout(() => {
            if (!this.isEditFlag) {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            } else {
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            }
            this.breadcrumbFlags.toolTip = 'Save';
            this.resetForm();
            this.viewGroupList();
            this.getGroupList();
            // }, 5);
          } else {
            this.openAlertDialog(resp.message);
            this.groupFormGroup.controls.groupSite.setValue('');
          }
        });
      } else {
        this.groupFormGroup.markAllAsTouched();
      }
    } else {
      this.siteRequiredFlag = true;
      this.groupFormGroup.markAllAsTouched();
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  resetForm() {
    if (this.groupFormGroup.controls.groupCreationId.value > 0 && this.isEditFlag) {
      this.groupFormGroup.patchValue({
        clientId: this.common.tempResetData.clientId,
        groupName: this.common.tempResetData.groupName,
        contactPerson: this.common.tempResetData.contactPerson,
        billingPersonName: this.common.tempResetData.billingPersonName,
        address: this.common.tempResetData.address,
        // addressLine1: this.common.tempResetData.addressLine1,
        // countryId: this.common.tempResetData.countryId,
        // stateId: this.common.tempResetData.stateId,
        // city: this.common.tempResetData.city,
        // zipcode: this.common.tempResetData.zipcode,
        gstNo: this.common.tempResetData.gstNo,
        active: this.common.tempResetData.active,
        groupSite: this.common.tempResetData.groupSite,
        groupCreationId: this.common.tempResetData.groupCreationId,
      });
      this.address = new BehaviorSubject(this.common.tempResetData.address);
      this.address.next(this.common.tempResetData.address);
    } else {
      const controlNames = ['clientId', 'groupName', 'contactPerson', 'billingPersonName', 'gstNo', 'groupSite'];
      for (const ctrl in this.groupFormGroup.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          this.groupFormGroup.get(ctrl).clearValidators();
          this.groupFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
      this.siteRequiredFlag = false;
      this.groupFormGroup.controls.groupCreationId.setValue(0);
      this.groupFormGroup.reset('');
      this.groupFormGroup.markAsPristine();
      this.groupFormGroup.markAllAsTouched();
    }
  }
  getGroupList() {
    this.groupList = [];
    this.masterService.getGroupCreationDetails(null).subscribe(resp => {
      if (resp) {
        this.groupList = resp;
        this.currentPage = 1;
      }
    }, err => { }, () => {
      this.groupTblAutoFilters();
    });
  }
  editFunc(agentId, groupWiseId) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.getGroupDetail();
    this.selectedOptions = [];
    this.isEditFlag = true;
    this.initFormGroup();
    this.masterService.getGroupCreationDetailById(agentId, groupWiseId).subscribe(res => {
      if (res) {
        this.groupFormGroup.patchValue({
          clientId: res.clientId,
          groupName: res.groupName,
          contactPerson: res.contactPerson,
          billingPersonName: res.billingPersonName,
          address: res.address,
          gstNo: res.gstNo,
          active: res.active,
          groupCreationId: res.groupCreationId,
        });
        setTimeout(() => {
          this.groupFormGroup.get('clientId')?.setValue(res.clientId);
        }, 10);
        this.address = new BehaviorSubject(res.address);
        this.address.next(res.address);
        if (res.groupSite.length > 0) {
          res.groupSite.filter(f => f.active === true).map(a => {
            this.selectedOptions.push(a.siteId);
          });
        }
        this.groupFormGroup.controls.groupSite.setValue(this.selectedOptions);
        this.common.tempResetData = Object.assign({}, this.groupFormGroup.value);
        this.getAllSiteNamesByAgentId(res.clientId);
      }
    });
    this.showView = false;
  }
  addGroupDetail() {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Save';
    this.address = new BehaviorSubject(null);
    this.getGroupDetail();
    this.initFormGroup();
    this.groupSites = [];
    this.isEditFlag = false;
    this.showView = !this.showView;
  }
  viewGroupList() {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.groupSites = [];
    this.siteRequiredFlag = false;
    this.isEditFlag = false;
    this.showView = true;
    this.selectedOptions = [];
  }
  checkSiteGroup(groupName: any) {
    if (!this.isEditFlag) {
      this.selectedOptions = [];
      this.masterService.getSiteNoByAgentId(this.groupFormGroup.get('clientId')?.value, groupName).subscribe(resp => {
        if (resp && resp.response.success) {
          this.groupSites = resp.groupSite;
          this.siteNoDisplay = resp.siteNoDisplay;
          if (this.siteNoDisplay.length > 0 && resp.response.value !== 0) {
            this.siteNoDisplay.forEach(el => {
              if (this.groupSites.filter(l => +l.siteId === el.siteId)) {
                this.selectedOptions.push(el.siteId);
                this.groupFormGroup.controls.groupSite.setValue([el.siteId ? el.siteId : '']);
              }
            });
          }
        } else {
          if (this.groupFormGroup.get('groupName')?.value !== null && this.groupFormGroup.get('groupName')?.value !== '') {
            this.groupFormGroup.get('groupName')?.setErrors({ incorrect: true });
          }
        }
      });
      if (this.selectedOptions.length > 0) {
        this.changeSite(this.selectedOptions);
      }
    }
  }
  openAlertDialog(data: any) {
    const popupData = {
      action: this.common.ALERT,
      headerText: 'Alert',
      bodyText: data
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '500px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
        }
      });
    }
  }
  changeSite(event: any) {
    if (event) {
      this.groupSites.filter(f => {
        f.siteId = event; f.active = true;
        this.groupFormGroup.controls.groupSite.setValue([event]);
      });
    }
  }
  dataSelectionChange(event: any) {
    this.groupSites.filter(e => e.siteId === event)[0].active = !this.groupSites.filter(e => e.siteId === event)[0].active;
    if (this.groupSites.find(e => e.active = true)) {
      this.siteRequiredFlag = false;
    } else {
      this.siteRequiredFlag = true;
    }
  }
  public openDialog(data, data1) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this group?'
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
            this.removeGroupDetail(data, data1);
          }
        }
      });
    }
  }
  removeGroupDetail(agentId, groupWiseId) {
    if (agentId && groupWiseId) {
      this.masterService.removeGroupDetailById(agentId, groupWiseId, this.groupFormGroup.get('loggedIn')?.value).subscribe(res => {
        if (res.success) {
          this.showTopCenter('success', 'Success Message', 'deleted Successfully');
          this.getGroupList();
        }
      });
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
      this.billingtab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  private groupTblAutoFilters(): void {
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.groupList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.groupNameFilteredOptions = this.groupNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.groupList.map(x => x.groupName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.contactPersonFilteredOptions = this.contactPersonControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.groupList.map(x => x.contactPerson).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.billingPersonNameFilteredOptions = this.billingPersonNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.groupList.map(x => x.billingPersonName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.siteNameFilteredOptions = this.siteNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.groupList.map(x => x.siteName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  checkValidValue() {
    if (!this.isEditFlag) {
      const value = this.groupFormGroup.get('clientId')?.value;
      if (value === '' || value == null) {
      } else if (this.billingKeyup) {
        this.groupFormGroup.controls.clientId.setErrors({ incorrect: true });
      } else {
        this.groupFormGroup.controls.clientId.setErrors(null);
      }
    }
  }
  checVal() {
    if (!this.isEditFlag) {
      const data: any = this.clientlst.filter(e => e.clientName.toLowerCase().trim() ===
        (this.groupFormGroup.get('clientId')?.value).toLowerCase().trim());
      if (data.length > 0) {
        this.groupFormGroup.get('clientId')?.setValue(data[0].clientId);
        this.billingKeyup = false;
      }
      this.checkValidValue();
      this.selectedOptions = [];
      this.groupSites = [];
      this.siteNoDisplay = [];

    }
  }
  tblReset() {
    this.billingtab.reset();
    setTimeout(() => {
      this.clientNameControl.reset();
      this.groupNameControl.reset();
      this.contactPersonControl.reset();
      this.billingPersonNameControl.reset();
      this.siteNameControl.reset();
      this.groupTblAutoFilters();
    }, 5);
    this.global.nativeElement.value = '';
  }
  showall(){
    if(this.groupList.length>0){
    this.itemperpage=this.groupList.length;
    }
  }
}
