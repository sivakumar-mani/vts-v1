import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MasterService } from '../../common-methods/services/master.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {
  Agent, SalesClientMapping, SalePersonDetails, Response as ResponseVM,
  SalesClientMappingDetails
} from '../../common-methods/models/salesclientmapping';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';

import { CommonService } from '../../common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { AuthService } from '../../common-methods/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-sales-client-mapping',
  templateUrl: './sales-client-mapping.component.html',
  styleUrls: ['./sales-client-mapping.component.css']
})
export class SalesClientMappingComponent implements OnInit {

  salesClientMappingForm: UntypedFormGroup;
  salePersonDetailsList: SalePersonDetails[] = [];
  agentList: Agent[] = [];
  deletedClient: any[] = [];
  salesClientMappingList: SalesClientMapping[] = [];
  salesClientMapping = new SalesClientMapping();
  isAlreadyExist = new ResponseVM();
  clientNameSelect!: AutoCompleteDropDown;
  selectedAgentList: any[] = [];
  salesClientMappingDetailsList: SalesClientMappingDetails[] = [];
  local: any;
  preClientList: any[] = [];
  breadcrumbFlags = new BreadcrumbFlags();
  screenAuth: any = {};
  showForm = false;

  isEdit: boolean;
  routePath = 'Client / Sales Team - Client Mapping';

  filteredOptions: Observable<Agent[]>;
  displayedColumns = [
    // { field: 'sNo', header: 'SNo' },
    { field: 'salePersonName', header: 'Sales Person' },
    { field: 'clientName', header: 'Client Name' },
    // { field: 'Actions', header: 'Actions' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];

  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  currentPage = 1;
  tempCurrentPage = 1;
 @ViewChild('clientNameTrigger', { static: true }) 
clientNameTrigger!: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

  @ViewChild('salePersonNameTrigger', { static: true }) salePersonNameTrigger: MatMenuTrigger;
  salePersonNameFilteredOptions: Observable<string[]>;
  salePersonNameControl = new UntypedFormControl();
  showFlag;
  constructor(public masterService: MasterService,
    private formBuilder: UntypedFormBuilder, public message: MessageService, public common: CommonService,
    public dialog: MatDialog, private authservice: AuthService, private router: Router,
  ) { }
  ngOnInit() {
    this.local = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.getSalesPersonDetails();
    this.getSalesClientMappingDetails();
  }


  add() {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Save';
    this.initForm();
    this.showForm = true;
    this.isEdit = false;
  }

  initForm() {
    this.salesClientMappingForm = this.formBuilder.group({
      salePersonId: ['', Validators.required],
      salesClientMappingId: [0],
      salesClient: [],
      loggedId: [this.local.userId]
    });
  }

  addAgent(agent: Agent) {
    this.selectedAgentList = [];
    this.agentList = this.agentList.filter(e => e.clientId !== agent.clientId);
    this.selectedAgentList = Object.assign([], agent);
  }

  // removeAgent(agent: Agent) {
  //   this.selectedAgentList = this.selectedAgentList.filter(e => e.clientId !== agent.clientId);
  //   this.agentList.push(agent);
  //   this.applyFilteration();
  // }

  getSalesPersonDetails() {
    this.masterService.getSalesPersonDetails().subscribe(res => {
      this.salePersonDetailsList = res;
    }, err => { console.error(err); }, () => { });
  }

  checkSalesPersonById(userId: number) {
    this.selectedAgentList.forEach(el => {
      this.agentList.push(el);
    });
    this.masterService.checkSalesPersonById(userId).subscribe((res) => {
      this.isAlreadyExist = res as any;
    }, err => { console.error(err); }, () => {
      if (this.isAlreadyExist.success) {
        this.getSalesClient();
      } else {
        this.filteredOptions = null;
        this.salesClientMappingForm.controls.salePersonId.setErrors({ incorrect: true });
      }
    });
  }

  getSalesClient() {
    this.masterService.getSalesClient().subscribe(res => {
      this.agentList = res;
    }, err => { console.error(err); }, () => {
    });
  }

  // applyFilteration() {
  //   this.filteredOptions = this.salesClientMappingForm.controls.clientname.valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(value => typeof value === 'string' ? value : value ? value.clientName : ''),
  //       map(clientName => clientName ? this._filter(clientName) : this.agentList.slice())
  //     );
  // }

  addSalesClientMapping() {
    if (this.salesClientMappingForm.valid) {
      this.preClientList = [];
      if (this.selectedAgentList.length > 0) {
        if (this.isEdit) {
          this.deletedClient = this.common.tempResetData.salesClient
            .filter(f => !this.selectedAgentList.some(s => s.clientId === f.clientId));
          this.deletedClient.map(m => m.active = false);
          this.preClientList = this.common.CloneObject(this.selectedAgentList);
          this.preClientList.push(...this.deletedClient);
          this.salesClientMappingForm.controls.salesClient.setValue(this.preClientList);
        }

        this.masterService.addSalesClientMapping(this.salesClientMappingForm.value).subscribe(res => {
          if (res) {
            if (this.salesClientMappingForm.controls.salesClientMappingId.value > 0) {
              this.isEdit = false;
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            } else {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            }
            this.getSalesClientMappingDetails();
            this.closeForm();
          }

        }, err => { console.error(err); }, () => {
          this.selectedAgentList = [];
          this.salesClientMappingList = [];
          this.salesClientMappingForm.reset();
        });
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Please select atleast one client');
      }
    }
  }

  getSalesClientMappingDetails() {
    this.masterService.getSalesClientMappingDetails().subscribe(res => {
      this.salesClientMappingDetailsList = res;
    }, err => { console.error(err); }, () => {
      this.salesClientTblAutoFilters();
    });
  }

  private _filter(value: string): Agent[] {
    const filterValue = value.toLowerCase();
    return this.agentList.filter(option => option.clientName.toLowerCase().includes(filterValue));
  }

  closeForm() {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.salesClientMappingForm.reset();
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.selectedAgentList = [];
    this.agentList = [];
    this.common.tempResetData  = [];
  }

  resetForm() {
    if (this.salesClientMappingForm.controls.salesClientMappingId.value > 0) {
      this.salesClientMappingForm.patchValue({
        salesPersonId: this.common.tempResetData.salePersonId,
      });
      this.selectedAgentList = this.common.tempResetData;
    } else {
      this.selectedAgentList = [];
      this.salesClientMappingForm.reset();
      this.salesClientMappingForm.markAsPristine();
      this.initForm();
    }
  }

  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure, you want to delete this record?'
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
            this.deleteSalesClientMapping(data);
          }
        }
      });
    }
  }

  deleteSalesClientMapping(personId: number) {
    this.masterService.deleteSalesClientMapping(personId, this.local.userId).subscribe(res => {
      if (res.success) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
      } else {
        this.showTopCenter('warn', 'Success Message', 'Failed to delete');
      }
    }, err => { console.error(err); }, () => {
      this.getSalesClientMappingDetails();
    });
  }

  editSalesClientMapping(rowData: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initForm();
    this.getSalesClient();
    this.masterService.getSalesClientMappingDetailsById(rowData.salePersonId).subscribe(res => {
      if (res) {
        this.salesClientMappingForm.patchValue({
          salePersonId: res.salePersonId,
          salesClient: res.salesClient
        });
        this.common.tempResetData = this.common.CloneObject(res);
        this.common.tempResetData.salesClient = res.salesClient;
        this.selectedAgentList = this.common.CloneObject(res.salesClient);
      }

    });

    this.showForm = !this.showForm;
    this.isEdit = true;
  }
  resettable() {
    this.dt.reset();
    this.clientNameControl.reset();
    this.salePersonNameControl.reset();
    this.salesClientTblAutoFilters();
    this.global.nativeElement.value = '';
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
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
  private salesClientTblAutoFilters(): void {
    this.salePersonNameFilteredOptions = this.salePersonNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.salesClientMappingDetailsList.map(x => x.salePersonName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.salesClientMappingDetailsList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }

}

