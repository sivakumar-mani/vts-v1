import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Input, TemplateRef } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { startWith, map } from 'rxjs/operators';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { SharedService } from '../../services/shared.service';
import { BreadcrumbFlags } from '../../models/breadcrumb-flags';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-emp-ins-prof-list',
  templateUrl: './emp-ins-prof-list.component.html',
  styleUrls: ['./emp-ins-prof-list.component.css']
})
export class EmpInsProfListComponent implements OnInit {
  itemperpage: any;
  @Input() pageType: string;

  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  btnExcelExport = true;

  employerInstutionList: any[] = [];
  pathParameters: string[];
  routePath = 'Configure / Employer Creation';
  dialogRef: any;
  referenceDeleteDetails: any;
  screenAuth: ScreenAuth = new ScreenAuth();
  userdata: any;
  btnAddUpload = true;
  empIns = false;
  verSt = false;
  @ViewChild('deleteconfirmation') confirmation!: TemplateRef<any>;
  cols = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'name', header: 'Employer Name' },
    { field: 'addLine1', header: 'Address' },
    { field: 'city', header: 'City' },
    { field: 'stateName', header: 'State' },
    { field: 'countryName', header: 'Country' },
    { field: 'pincode', header: 'Pincode' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  index = -1;
  totalpages: number;
  showBulkUpload = false;
  @ViewChild('global') global!: ElementRef;

  @ViewChild('nameTrigger') nameTrigger!: MatMenuTrigger;
  nameFilteredOptions!: Observable<string[]>;
  nameControl = new UntypedFormControl();

  @ViewChild('addLine1Trigger') addLine1Trigger!: MatMenuTrigger;
  addLine1FilteredOptions!: Observable<string[]>;
  addLine1Control = new UntypedFormControl();

  @ViewChild('cityTrigger') cityTrigger!: MatMenuTrigger;
  cityFilteredOptions!: Observable<string[]>;
  cityControl = new UntypedFormControl();

  @ViewChild('stateNameTrigger') stateNameTrigger!: MatMenuTrigger;
  stateNameFilteredOptions!: Observable<string[]>;
  stateNameControl = new UntypedFormControl();

  @ViewChild('countryNameTrigger') countryNameTrigger!: MatMenuTrigger;
  countryNameFilteredOptions!: Observable<string[]>;
  countryNameControl = new UntypedFormControl();

  // @ViewChild('pincodeTrigger', { static: true }) pincodeTrigger: MatMenuTrigger;
  @ViewChild('pincodeTrigger') pincodeTrigger!: MatMenuTrigger;
  pincodeFilteredOptions: Observable<string[]>;
  pincodeControl = new UntypedFormControl();
  breadcrumbFlags = new BreadcrumbFlags();
  // tslint:disable-next-line:max-line-length
  constructor(private dateP: DatePipe, private masterService: MasterService, private messageService: MessageService, public dialog: MatDialog,
    // tslint:disable-next-line:align
    private router: Router, public authService: AuthService, public common: CommonService) { }
  // employerFlag: string;
  ngOnInit() {
    this.userdata = this.authService.userdata;
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    // this.empInsProf = true;
    this.authService.empInsProf = this.pageType;
    if (this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION) {
      this.cols.push({ field: 'frApprovedDate', header: 'FR Approved date' }, { field: 'frApprovedBy', header: 'FR Approved By' }, { field: 'remarks', header: 'Remarks' })
    }
    // this.institutionEmployer = 1;
    this.getEmployerInstitution();
    this.getEmployerInstituteList();
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.breadcrumbFlags.toolTip = 'Save';
    this.itemperpage = 10;
    // this.setBreadcrumbs();
  }
  showBulk() {
    this.showBulkUpload = true;
  }
  exportAsExcelFile() {
    this.common.exportToExcel(this.cols, this.employerInstutionList, 'InstitutionCreation');
  }

  navigateURL() {
    this.showBulkUpload = !this.showBulkUpload;
    this.getEmployerInstitution();
  }
  getEmployerInstituteList() {
    const pageType = this.authService.empInsProf === this.common.SCRN_PROFESSIONAL_REFERENCE ? 1 : 2;
    const empFlag = this.pageType === this.common.SCRN_EMPLOYER_CREATION ? true : false;
    this.currentPage = 1;
    this.masterService.GetEmpInsProfDetails(this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION
      ? 3 : pageType, empFlag, this.userdata.deptId ? this.userdata.deptId : 0).subscribe(resp => {
        this.employerInstutionList = resp;
        this.employerInstutionList.map(m => m.frApprovedDate = m.frApprovedDate != null ? this.dateP.transform(m.frApprovedDate, 'dd/MM/yyyy') : null);
        this.employerInstutionList.forEach(element => {
          element.addLine1 = (element.addLine1 == '' || element.addLine1 == null ? '' : (element.addLine1)) + (element.addLine2 == '' || element.addLine2 == null ? '' : (', ' + element.addLine2)) + (element.addLine3 == '' || element.addLine3 == null ? '' : (', ' + element.addLine3));
        })
        this.userTblAutoFilters();
      });

  }
  getEmployerInstitution() {
    if (this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION) {
      this.routePath = 'Configure / Employer / Employer Creation';
      this.empIns = true;
      // this.employerFlag = true;
      // this.authService.empInsProf = true;
      // this.cols[0].field = 'employerName';
      this.cols[0].header = 'Employer Name';
    } else if (this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION) {
      this.routePath = 'Configure / Institution / Institution Creation';
      this.empIns = false;
      // this.employerFlag = false;
      // this.authService.employerFlag = false;
      // this.cols[0].field = 'instituteName';
      this.cols[0].header = 'Institution Name';
    } else if (this.authService.empInsProf === this.common.SCRN_PROFESSIONAL_REFERENCE) {
      this.routePath = 'Configure / Employer / Professional Reference Creation';
      // this.cols[0].field = 'instituteName';
      this.cols[0].header = 'Contact Person Name';
    } else if (this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION) {
      this.routePath = 'Configure / Employer / License Creation';
      // this.cols[0].field = 'instituteName';
      this.cols[0].header = 'Authority Name';
    }
    this.getEmployerInstituteList();
  }
  navigateEmployerInstution() {
    this.authService.employerInstutionId = 0;
    this.authService.employerInstutionAddId = 0;
    this.masterService.viewFlag = false;
    this.router.navigate(['/dashboard/master/empInsProfDetail']);
  }
  getEmployerInsutionByEmpID(empId, addressId, researchMappingId) {
    this.authService.employerInstutionId = empId;
    this.authService.employerInstutionAddId = addressId > 0 ? addressId : 0;
    this.authService.researchMappingId = researchMappingId > 0 ? researchMappingId : 0;
    this.masterService.viewFlag = false;
    this.router.navigate(['/dashboard/master/empInsProfDetail']);
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
  private userTblAutoFilters(): void {
    this.nameFilteredOptions = this.nameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.employerInstutionList.map(x => x.name).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.addLine1FilteredOptions = this.addLine1Control.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.employerInstutionList.map(x => x.addLine1).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.cityFilteredOptions = this.cityControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.employerInstutionList.map(x => x.city).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.stateNameFilteredOptions = this.stateNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.employerInstutionList.map(x => x.stateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.countryNameFilteredOptions = this.countryNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.employerInstutionList.map(x => x.countryName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.pincodeFilteredOptions = this.pincodeControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.employerInstutionList.map(x => x.pincode).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }

  closeMenu(col: any) {
    switch (col) {
      case 'name': this.nameTrigger.closeMenu(); break;
      case 'addLine1': this.addLine1Trigger.closeMenu(); break;
      case 'city': this.cityTrigger.closeMenu(); break;
      case 'stateName': this.stateNameTrigger.closeMenu(); break;
      case 'countryName': this.countryNameTrigger.closeMenu(); break;
      case 'pincode': this.pincodeTrigger.closeMenu(); break;
      default: break;
    }
  }
  tblReset() {
    this.dt.reset();
    this.nameControl.setValue('');
    this.addLine1Control.setValue('');
    this.cityControl.setValue('');
    this.stateNameControl.setValue('');
    this.countryNameControl.setValue('');
    this.pincodeControl.setValue('');
    this.global.nativeElement.value = '';
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
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
            this.deleteInsEmpProfMasterDetById(data.id, data.addressId);
          }
        }
      });
    }
  }
  deleteInsEmpProfMasterDetById(id: number, addressId: number) {
    const pageType = this.authService.empInsProf === this.common.SCRN_PROFESSIONAL_REFERENCE ? 1 : 2;
    this.masterService.deleteInsEmpProfMasterDetById(this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION
      ? 3 : pageType, id, this.userdata.userId,
      this.pageType === this.common.SCRN_EMPLOYER_CREATION, addressId > 0 ? addressId : 0).subscribe(resp => {
        if (resp) {
          setTimeout(() => {
            this.getEmployerInstituteList();
          }, 0);
          this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        }
      });
  }
  showTopCenter(level, info, message) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  viewDetail(empId, addressId, researchMappingId) {
    // this.breadcrumbFlags.btnAdd = false;
    // this.breadcrumbFlags.btnReset = false;
    this.authService.employerInstutionId = empId;
    this.authService.employerInstutionAddId = addressId > 0 ? addressId : 0;
    this.authService.researchMappingId = researchMappingId > 0 ? researchMappingId : 0;
    this.masterService.viewFlag = true;
    this.router.navigate(['/dashboard/master/empInsProfDetail']);

  }
  showall() {
    if (this.employerInstutionList.length > 0) {
      this.itemperpage = this.employerInstutionList.length;
    }
  }
}
