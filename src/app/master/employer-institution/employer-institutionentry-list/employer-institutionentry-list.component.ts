import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';

@Component({
  standalone: false,
  selector: 'app-employer-institutionentry-list',
  templateUrl: './employer-institutionentry-list.component.html',
  styleUrls: ['./employer-institutionentry-list.component.css']
})
export class EmployerInstitutionentryListComponent implements OnInit {
  // institutionEmployer;
  // employerInstutionList: any[] = [];
  // pathParameters: string[];
  // routePath = 'Configure / Employer/Instution Details';
  // dialogRef: any;
  // referenceDeleteDetails: any;
  // screenAuth: ScreenAuth = new ScreenAuth();
  // @ViewChild('deleteconfirmation', { static: true }) confirmation;
  // cols = [
  //   { field: 'employerName', header: 'Employer Name' },
  //   { field: 'address1', header: 'Address' },
  //   { field: 'city', header: 'City' },
  //   { field: 'state', header: 'State' },
  //   { field: 'country', header: 'Country' },
  //   { field: 'pincode', header: 'Pincode' },
  // ];
  //  @ViewChild('dt', { static: false }) dt!: Table;
  // currentPage = 1;
  // tempCurrentPage = 1;
  // index = -1;
  // totalpages: number;
  // @ViewChild('global', { static: true }) global!: ElementRef;

  // @ViewChild('employerNameTrigger', { static: true }) employerNameTrigger!: MatMenuTrigger;
  // employerNameFilteredOptions: Observable<string[]>;
  // employerNameControl = new UntypedFormControl();


  // @ViewChild('address1Trigger', { static: true }) address1Trigger: MatMenuTrigger;
  // address1FilteredOptions: Observable<string[]>;
  // address1Control = new UntypedFormControl();

  // @ViewChild('cityTrigger', { static: true }) cityTrigger: MatMenuTrigger;
  // cityFilteredOptions: Observable<string[]>;
  // cityControl = new UntypedFormControl();

  // @ViewChild('stateTrigger', { static: true }) stateTrigger: MatMenuTrigger;
  // stateFilteredOptions: Observable<string[]>;
  // stateControl = new UntypedFormControl();

  // @ViewChild('countryTrigger', { static: true }) countryTrigger: MatMenuTrigger;
  // countryFilteredOptions: Observable<string[]>;
  // countryControl = new UntypedFormControl();

  // @ViewChild('pincodeTrigger', { static: true }) pincodeTrigger: MatMenuTrigger;
  // pincodeFilteredOptions: Observable<string[]>;
  // pincodeControl = new UntypedFormControl();

  // @ViewChild('instituteNameTrigger', { static: true }) instituteNameTrigger: MatMenuTrigger;
  // instituteNameFilteredOptions: Observable<string[]>;
  // instituteNameControl = new UntypedFormControl();

  // @ViewChild('componentNameTrigger', { static: true }) componentNameTrigger: MatMenuTrigger;
  // componentNameFilteredOptions: Observable<string[]>;
  // componentNameControl = new UntypedFormControl();

  // @ViewChild('siteNameTrigger', { static: true }) siteNameTrigger: MatMenuTrigger;
  // siteNameFilteredOptions: Observable<string[]>;
  // siteNameControl = new UntypedFormControl();
  // tslint:disable-next-line:max-line-length
  constructor(private masterService: MasterService,
              private messageService: MessageService,
              public dialog: MatDialog,
              private router: Router,
              public authService: AuthService,
              public common: CommonService) { }
  employerFlag: boolean;
  ngOnInit() {
    // this.screenAuth = this.authService.getScreenAuth(this.common.SCRN_EMPLOYER_INSTITUTION, this.common.MOD_CLIENT);
    // this.employerFlag = true;
    // this.authService.employerFlag = this.employerFlag;
    // this.institutionEmployer = 1;
    // this.getEmployerInstituteList();
    // this.setBreadcrumbs();
  }
  // setBreadcrumbs() {
  //   this.pathParameters = [this.common.HIDE, this.routePath];
  //   this.common.FlagEvent(this.pathParameters);
  //   this.common.eventSubscription = this.common.events$.subscribe(resp => {
  //     if (resp === this.common.RESET) {
  //       // this.resetForm();
  //     }
  //     if (resp === this.common.BACK) {
  //       // this.closeBillingCycle();
  //     }
  //     if (resp === this.common.ADD) {
  //       this.navigateEmployerInstution();
  //     }
  //   });
  // }
  // getEmployerInstituteList() {
  //   this.masterService.getEmployerInstituteList(this.employerFlag).subscribe(resp => {
  //     this.employerInstutionList = resp;
  //   });
  // }
  // getEmployerInstitution(e: any) {
  //   if (e.value === 1) {
  //     this.employerFlag = true;
  //     this.authService.employerFlag = true;
  //     this.cols[0].field = 'employerName';
  //     this.cols[0].header = 'Employer Name';
  //   } else {
  //     this.employerFlag = false;
  //     this.authService.employerFlag = false;
  //     this.cols[0].field = 'instituteName';
  //     this.cols[0].header = 'Institute Name';
  //   }
  //   this.getEmployerInstituteList();
  // }
  // navigateEmployerInstution() {
  //   this.authService.employerInstutionId = 0;
  //   this.router.navigate(['/dashboard/master/employerinstutionentrydetails']);
  // }
  // getEmployerInsutionByEmpID(empId: any) {
  //   this.authService.employerInstutionId = empId;
  //   this.router.navigate(['/dashboard/master/employerinstutionentrydetails']);
  // }
  // empInstuitionDetailDeleteId(empInstuition: any) {
  //   this.referenceDeleteDetails = empInstuition;
  //   this.successPopup();
  // }
  // successPopup() {
  //   this.dialogRef = this.dialog.open(this.confirmation, {
  //     width: '510px',
  //     disableClose: true
  //   });
  // }
  // employerInstuitionDetailDelete() {
  //   this.masterService.deleteEmployerInstitute(this.referenceDeleteDetails).subscribe(resp => {
  //     if (resp != null) {
  //       this.cancelDialogRef();
  //       this.showTopCenter('warning', 'error', 'Warn Message', 'Deleted Successfully');
  //     }
  //   });
  // }
  // showTopCenter(warning: string, level: string, info: string, message: string) {
  //   this.messageService.add({ key: warning, severity: level, summary: info, detail: message });
  // }
  // cancelDialogRef() {
  //   this.dialogRef.close();
  // }
  // ngOnDestroy() {
  //   this.common.eventSubscription.unsubscribe();
  // }
  // getTotalPages(totalRecords, rows) {
  //   this.totalpages = Math.ceil((totalRecords) / rows);
  //   return Math.ceil((totalRecords) / rows);
  // }
  // navigateNxtPrevPage(pageNo, rows) {
  //   this.currentPage = pageNo / rows;
  //   this.tempCurrentPage = this.currentPage;
  // }
  // navigatePage(pageNo, rowscount) {
  //   if (+pageNo > this.totalpages || +pageNo <= 0) {
  //     this.currentPage = this.tempCurrentPage;
  //   } else {
  //     this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
  //     this.tempCurrentPage = this.currentPage;
  //   }
  // }
}
