import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-professional-list',
  templateUrl: './professional-list.component.html',
  styleUrls: ['./professional-list.component.css']
})
export class ProfessionalListComponent implements OnInit {
  //  @ViewChild('dt', { static: false }) dt!: Table;
  // currentPage = 1;
  // tempCurrentPage = 1;
  // index = -1;
  // totalpages: number;
  // professionalControl = new UntypedFormControl();
  // professionalDetails: any[] = [];
  // cols = [
  //   { field: 'contactPerson', header: 'contactPerson Name' },
  //   { field: 'address1', header: 'Address' },
  //   { field: 'city', header: 'City' },
  //   { field: 'state', header: 'State' },
  //   { field: 'country', header: 'Country' },
  //   { field: 'pincode', header: 'Pincode' },
  //   { field: 'Actions', header: 'Actions' }
  // ];
  // dialogRef: any;
  // referenceDeleteId: number;
  // pathParameters: string[];
  // routePath = 'Configure / Professional Details';
  // @ViewChild('global', { static: true }) global!: ElementRef;

  // @ViewChild('employerNameTrigger', { static: true }) employerNameTrigger!: MatMenuTrigger;
  // employerNameFilteredOptions: Observable<string[]>;
  // employerNameControl = new UntypedFormControl();
  // @ViewChild('deleteconfirmation', { static: true }) confirmation;
  // @ViewChild('contactPersonTrigger', { static: true }) contactPersonTrigger: MatMenuTrigger;
  // contactNameFilteredOptions: Observable<string[]>;
  // contactPersonNameCtrl = new UntypedFormControl();

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
  constructor(public authService: AuthService, public common: CommonService) { }

  ngOnInit() {
    // this.setBreadcrumbs();
    // this.getProfessionalReferenceDetails();
  }
  // setBreadcrumbs() {
  //   this.pathParameters = [this.common.HIDE, this.routePath];
  //   this.common.FlagEvent(this.pathParameters);
  //   this.common.eventSubscription = this.common.events$.subscribe(resp => {
  //     if (resp === this.common.ADD) {
  //       this.goTo();
  //     }
  //   });
  // }
  // getProfessionalReferenceDetails() {
  //   this.masterService.getProfessionalReferenceDetails(0).subscribe(resp => {
  //     if (resp) {
  //       this.professionalDetails = resp;
  //       console.log(this.professionalDetails, 'this.professionalDetailsgrid');
  //     }
  //   });
  // }
  // getProfessionalDetailsByProfessionalID(profId: any) {
  //   this.authService.professionalId = profId;
  //   this.router.navigate(['/dashboard/master/professionaldetail']);
  // }
  // goTo() {
  //   this.authService.professionalId = 0;
  //   this.router.navigate(['/dashboard/master/professionaldetail']);
  // }
  // professionalDetailDelete() {
  //   this.masterService.professionalDetailDelete(this.referenceDeleteId, 'jp').subscribe(resp => {
  //     if (resp != null) {
  //       this.cancelDialogRef();
  //       this.showTopCenter('warning', 'error', 'Warn Message', 'Deleted Successfully');
  //     }
  //   });
  // }
  // professionalDetailDeleteId(profId: any) {
  //   this.referenceDeleteId = profId;
  //   this.successPopup();
  // }
  // showTopCenter(warning: string, level: string, info: string, message: string) {
  //   this.messageService.add({ key: warning, severity: level, summary: info, detail: message });
  // }
  // cancelDialogRef() {
  //   this.dialogRef.close();
  // }
  // successPopup() {
  //   this.dialogRef = this.dialog.open(this.confirmation, {
  //     width: '510px',
  //     disableClose: true
  //   });
  // }
  // ngOnDestroy() {
  //   this.common.eventSubscription.unsubscribe();
  //   }
  //   getTotalPages(totalRecords, rows) {
  //     this.totalpages = Math.ceil((totalRecords) / rows);
  //     return Math.ceil((totalRecords) / rows);
  //   }
  //   navigateNxtPrevPage(pageNo, rows) {
  //     this.currentPage = pageNo / rows;
  //     this.tempCurrentPage = this.currentPage;
  //   }
  //   navigatePage(pageNo, rowscount) {
  //     if (+pageNo > this.totalpages || +pageNo <= 0) {
  //       this.currentPage = this.tempCurrentPage;
  //     } else {
  //       this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
  //       this.tempCurrentPage = this.currentPage;
  //     }
  //   }
}
