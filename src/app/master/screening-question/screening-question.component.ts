import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';

import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
// import { MatMenuTrigger } from '@angular/material/menu/menu-trigger';
@Component({
  standalone: false,
  selector: 'app-screening-question',
  templateUrl: './screening-question.component.html',
  styleUrls: ['./screening-question.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class ScreeningQuestionComponent implements OnInit {
  showFlag = false;
  screeningForm: UntypedFormGroup;
  displayedColumns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'componetName', header: 'Service Type' },
  ];
  questionColumns = [
    { field: 'question', header: 'Question' },
    { field: 'active', header: 'active' }
  ];
  routePath = 'Configure / Screening Questions';
  breadcrumbFlags = new BreadcrumbFlags();
  screeningQuestionList: any[] = [];
  userData: any;
  isEdit = false;
  serviceList: any[] = [];
  clientList: any[] = [];
  totalpages: number;
  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global') global!: ElementRef;
  @ViewChild('sub') sub!: Table;
  // @ViewChild('sub', { static: true }) sub: DataTable;
  // @ViewChild('global', { static: true }) global!: ElementRef;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpagesSub: number;
  currentPageSub = 1;
  tempCurrentPageSub = 1;
  screenAuth: any = {};
  clientControls!: AutoCompleteDropDown;
  componentControls!: AutoCompleteDropDown;
  @ViewChild('clientNameCtrlTrigger') clientNameCtrlTrigger!: MatMenuTrigger;
  clientNameFilteredOptions!: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

  @ViewChild('componetNameCtrlTrigger') componetNameCtrlTrigger!: MatMenuTrigger;
  componetNameFilteredOptions!: Observable<string[]>;
  componetNameControl = new UntypedFormControl();

  @ViewChild('questionCtrlTrigger') questionCtrlTrigger!: MatMenuTrigger;
  constructor(public common: CommonService, private master: MasterService, private authservice: AuthService,
    // tslint:disable-next-line: align
    private message: MessageService, private fb: UntypedFormBuilder, public dialog: MatDialog, public invoiceService: InvoiceService,
    private router: Router,) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getScreeningQuestionList();
    this.getClient();
    this.getServiceType();
  }
  initFormGroup(flag: any) {
    this.screeningForm = this.fb.group({
      clientId: ['', Validators.required],
      compId: ['', [Validators.required]],
      logginId: [this.userData.userId],
      singleEditFlag: [],
      question: this.fb.array(flag === true ? [this.initQuesForm()] : [])
    });
    this.clientControls = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName',
      this.clientList, '', this.screeningForm, false, false, true);
    this.componentControls = new AutoCompleteDropDown('Component Type', 'compId', 'componentId', 'compName',
      this.serviceList, '', this.screeningForm, false, false, true);
  }
  initQuesForm(): UntypedFormGroup {
    return this.fb.group({
      questionClientMapId: new UntypedFormControl(0),
      questionId: new UntypedFormControl(0),
      question: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(true),
    });
  }
  getformgroup() {
    return (this.screeningForm.get('question') as UntypedFormArray).controls;
  }
  addControl(i: any) {
    if (this.screeningForm.get('question')?.valid) {
      const addQuestion = this.screeningForm.get('question') as UntypedFormArray;
      addQuestion.push(this.initQuesForm());
    } else {
      this.screeningForm.get('question')?.markAllAsTouched();
    }
  }
  removeControl(i: any) {
    const removeQuetion = this.screeningForm.get('question') as UntypedFormArray;
    removeQuetion.removeAt(i);
  }
  getScreeningQuestionList() {
    this.master.getScreeningQuestionList(this.userData.clientId).subscribe(resp => {
      if (resp) {
        this.screeningQuestionList = resp;
        this.currentPage = 1;
        this.currentPageSub = 1;
        this.screeningQuestionList.forEach((element, ind) => {
          element.logginId = ind;
        });
        this.userTblAutoFilters();
      }
    });
  }
  getClient() {
    //this.master.GetClient()
    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      this.clientList = res;
      this.clientList.sort((a, b) => a.clientName.localeCompare(b.clientName));
      this.clientList.splice(0, 0, {
        clientId: 0, clientName: 'All Client',
        active: true,
      });
      this.clientControls = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName',
        this.clientList, '', this.screeningForm, false, false, true);
    });
  }
  getServiceType() {
    this.master.getScreeningQuesServiceType().subscribe(resp => {
      if (resp) {
        this.serviceList = resp;
      }
    });
    this.componentControls = new AutoCompleteDropDown('Component Type', 'compId', 'componentId', 'compName',
      this.serviceList, '', this.screeningForm, false, false, true);
  }
  saveScreeningQuestion() {
    if (this.screeningForm.valid) {
      this.screeningForm.getRawValue().clientId === 0 ? this.screeningForm.get('clientId')?.setValue(null)
        : this.screeningForm.get('clientId')?.setValue(this.screeningForm.getRawValue().clientId);
      this.master.updateScreeningQuestion(this.screeningForm.getRawValue()).subscribe(res => {
        if (res.success) {
          this.showTopCenter('success', 'Success Message', this.breadcrumbFlags.toolTip + 'd Successfully');
          this.getScreeningQuestionList();
          this.closeForm();
        }
      });
    } else {
      this.screeningForm.markAllAsTouched();
    }
  }
  addScreeningQuestions() {
    this.initFormGroup(true);
    this.breadcrumbFlags.toolTip = 'Save';
    this.screeningForm.get('singleEditFlag')?.setValue(true);
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  editScreeningQuestion(src, id, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initFormGroup(false);
    this.master.getScreeningQuestionById(src.clientId ? src.clientId : 0, src.compId, id).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        this.common.tempResetData.clientId = this.common.tempResetData.clientId ? this.common.tempResetData.clientId : 0
        this.common.tempResetData.question.forEach(ele => {
          const addQuestion = this.screeningForm.get('question') as UntypedFormArray;
          addQuestion.push(this.initQuesForm());
        });
        setTimeout(() => {
          this.screeningForm.patchValue({
            compId: this.common.tempResetData.compId,
            clientId: this.common.tempResetData.clientId,
            question: this.common.tempResetData.question,
          });
        }, 1);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.screeningForm.disable();
        } else if (mode === 'editSingle') {
          this.isEdit = true;
          this.screeningForm.get('singleEditFlag')?.setValue(true);
        }
        this.screeningForm.get('clientId')?.disable();
        this.screeningForm.get('compId')?.disable();
      }
    });
    this.showFlag = !this.showFlag;
  }
  public openDialog(data, id, mode) {
    // tslint:disable-next-line: no-use-before-declare
    const deleteVm = new DeleteQuestionVm();
    deleteVm.logginId = this.userData.userId;
    if (mode === 'deleteMultiple') {
      deleteVm.questionClientMapId = data.question.map(x => x.questionClientMapId);
    } else {
      deleteVm.questionClientMapId.push(id);
    }
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
            this.deleteScreeningQuestion(deleteVm);
          }
        }
      });
    }
  }
  deleteScreeningQuestion(src: any) {
    this.master.deleteScreeningQuestion(src).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getScreeningQuestionList();
      }
    });
  }
  resetForm() {
    if (this.breadcrumbFlags.toolTip === 'Update') {
      this.initFormGroup(false);
      this.screeningForm.patchValue({
        compId: this.common.tempResetData.compId,
        question: this.common.tempResetData.question
      });
      this.screeningForm.controls.clientId.setValue(this.common.tempResetData.clientId ? this.common.tempResetData.clientId : 0);
      this.common.tempResetData.question.forEach(ele => {
        const addQuestion = this.screeningForm.get('question') as UntypedFormArray;
        addQuestion.push(this.initQuesForm());
      });
      this.screeningForm.get('question')?.patchValue(this.common.tempResetData.question);
      this.screeningForm.get('clientId')?.disable();
      this.screeningForm.get('compId')?.disable();
      if (this.isEdit === true) {
        this.screeningForm.get('singleEditFlag')?.setValue(true);
      }
    } else {
      this.initFormGroup(true);
      this.screeningForm.markAsPristine();
      this.screeningForm.get('singleEditFlag')?.setValue(true);
    }
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.screeningForm.reset();
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
    this.currentPageSub = 1;
    this.isEdit = false;
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
  getTotalPagesSub(totalRecords, rows) {
    this.totalpagesSub = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPageSub(pageNo, rows) {
    this.currentPageSub = pageNo / rows;
    this.tempCurrentPageSub = this.currentPageSub;
  }
  navigatePageSub(pageNo, rowscount) {
    if (+pageNo > this.totalpagesSub || +pageNo <= 0) {
      this.currentPageSub = this.tempCurrentPageSub;
    } else {
      this.sub.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPageSub = this.currentPageSub;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  resettable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
    this.clientNameControl.reset();
    this.componetNameControl.reset();
    this.userTblAutoFilters();
  }
  private userTblAutoFilters(): void {
    this.componetNameFilteredOptions = this.componetNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.screeningQuestionList.map(x => x.componetName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.screeningQuestionList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  closeMenu(col: any) {
    switch (col) {
      case 'componetName': this.componetNameCtrlTrigger.closeMenu(); break;
      case 'clientName': this.clientNameCtrlTrigger.closeMenu(); break;
      case 'question': this.questionCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }
}
class DeleteQuestionVm {
  questionClientMapId: any[] = [];
  logginId: number;
}
