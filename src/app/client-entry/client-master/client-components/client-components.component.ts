import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ClientService } from 'src/app/common-methods/services/client.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Table, TableModule } from 'primeng/table';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-client-components',
  templateUrl: './client-components.component.html',
  styleUrls: ['./client-components.component.css'],
  animations: [
    trigger('rotatedState', [
      state('reset', style({ transform: 'rotate(0deg)' })),
      state('right', style({ transform: 'rotate(90deg)' })),
      state('down', style({ transform: 'rotate(180deg)' })),
      state('left', style({ transform: 'rotate(270deg)' })),
      state('up', style({ transform: 'rotate(360deg)' })),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})
export class ClientComponentsComponent implements OnInit {
  state: string = 'default';
  url: any;
  dir: string;
  imageSource: any;
  downldata: any;
  fname: any
  sid: any;
  downid: any;
  imageChangedEvent: any = '';
  downname: any;
  downmethod: any;
  zoomval: number;
  rvalue: number;
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
  @Input() mainForm: UntypedFormGroup;
  @Input() bindData: any;
  @Input() currencyList: any;
  @ViewChild('insuffHistory', { static: true }) insuffHistory;
  insuffHistoryData: any[] = [];
  componentForm: UntypedFormGroup;
  clientFeesApprovalForm: UntypedFormGroup;
  clientFeeDocumentForm: UntypedFormGroup;
  clientTATApprovalForm: UntypedFormGroup;
  clientTATDocumentForm: UntypedFormGroup;
  componentControls!: AutoCompleteDropDown;
  currencyControls!: AutoCompleteDropDown;
  subCompList: any;
  index = -1;
  columnName = [
    { field: 'componentId', header: 'Component' },
    { field: 'componentDesc', header: 'Component Desc' },
    { field: 'displayOrder', header: 'Report Display Order' },
    { field: 'effectiveDate', header: 'Effective Date' },
    { field: 'fees', header: 'Fees' },
    { field: 'currencyId', header: 'Currency' },
    { field: 'tat', header: 'TAT Days' },
    { field: 'beyondTat', header: 'BT' },
    { field: 'currentTat', header: 'CT' },
    { field: 'nearTat', header: 'NT' },
    { field: 'withInTat', header: 'WT' },
    { field: 'daCompValidationFlag', header: 'DA' },
    { field: 'interimReportFlag', header: 'Interim Report' },
    { field: 'isAdditionalPos', header: 'Additional period of stay' },
    // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
    { field: 'enableAutoIqc', header: 'Enable auto IQC' },
    { field: 'enableAutoFqc', header: 'Enable auto FQC' },
  ];
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  reportType: any;
  @ViewChild('feesConfirmation', { static: true }) feesConfirmation;
  @ViewChild('tatConfirmation', { static: true }) tatConfirmation;
  @Output() deleteEvent = new EventEmitter<any>();
  showBt: boolean = false;
  showCt: boolean = false;
  showNt: boolean = false;
  showWt: boolean = false;
  showIcons: boolean = false;
  dialogRef: any;
  @ViewChild('tatValidation', { static: true }) tatValidation;
  minDate = new Date();
  maxDate = new Date();
  clientId: number = 0;
  // tslint:disable-next-line: max-line-length
  constructor(public screeningService: ScreeningService, private sanitizer: DomSanitizer,
    public clientService: ClientService, public commonService: CommonService,
    private fb: UntypedFormBuilder, public dialog: MatDialog, public _datePipe: DatePipe) { }
  ngOnInit() {
    this.componentEntryForm();
  }
  componentEntryForm() {
    this.componentForm = this.fb.group({
      clientComponentId: new UntypedFormControl(0),
      componentDesc: new UntypedFormControl(''),
      fees: new UntypedFormControl(null),
      tat: new UntypedFormControl(null, [Validators.min(1)]),
      componentId: [],
      subComponentId: new UntypedFormControl(null),
      active: new UntypedFormControl(true),
      isSubComponent: new UntypedFormControl(),
      clientSubComponentId: new UntypedFormControl(0),
      effectiveDate: new UntypedFormControl(new Date(), Validators.required),
      /*
      beyondTat: new UntypedFormControl('', [Validators.required]),
      currentTat: new UntypedFormControl('', [Validators.required]),
      nearTat: new UntypedFormControl('', [Validators.required]),
      withInTat: new UntypedFormControl('', [Validators.required]),
      */
      beyondTat: new UntypedFormControl(''),
      currentTat: new UntypedFormControl(''),
      nearTat: new UntypedFormControl(''),
      withInTat: new UntypedFormControl(''),
      msp: new UntypedFormControl(),
      nrp: new UntypedFormControl(),
      originalTAT: new UntypedFormControl(),
      interimReportFlag: new UntypedFormControl(false),
      ctsFlag: new UntypedFormControl(false),
      directAppAddressFlag: new UntypedFormControl(false),
      pdfReportNameChangeFlag: new UntypedFormControl(false),
      deReopenFlag: new UntypedFormControl(false),
       // Added By Megala - For VTS2-2024-CRT-0217
       pdfHyperLinkFlag:new UntypedFormControl(false),
      daCompValidationFlag: new UntypedFormControl(false),
      clientFeeApprovalFlag: new UntypedFormControl(false),
      clientFeesApproval: new UntypedFormControl(),
      clientTATApproval: new UntypedFormControl(),
      subComponentEntry: this.fb.array([]),
      deleteDisableFlag: new UntypedFormControl(),
      feeDisableFlag: new UntypedFormControl(),
      tatDisableFlag: new UntypedFormControl(),
      compEditFlag: new UntypedFormControl(),
      displayOrder: new UntypedFormControl(),
      currencyId: new UntypedFormControl(this.commonService.getIdByName(this.currencyList, 'currencyId',
        'currencyShortName', this.commonService.currencyInr)),
      isAdditionalPos: new UntypedFormControl(false),
      //  VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
      enableAutoIqc: new UntypedFormControl(false),
      enableAutoFqc: new UntypedFormControl(false)
    });
    this.componentControls = new AutoCompleteDropDown('Component', 'componentId', 'serviceId', 'rptType', this.bindData,
      '', this.componentForm, false, false, true);
    this.currencyControls = new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencyList,
      '', this.componentForm, false, false, true);
  }
  subComponentEntryForm(data: any) {
    return new UntypedFormGroup({
      clientSubComponentId: new UntypedFormControl(data.clientSubComponentId),
      subComponentId: new UntypedFormControl(data.subComponentId),
      clientComponentId: new UntypedFormControl(data.clientComponentId),
      fees: new UntypedFormControl(data.fees),
      tat: new UntypedFormControl(data.tat),
      componentId: new UntypedFormControl(data.componentId),
      effectiveDate: new UntypedFormControl(data.effectiveDate),
      beyondTat: new UntypedFormControl(data.beyondTat),
      currentTat: new UntypedFormControl(data.currentTat),
      nearTat: new UntypedFormControl(data.nearTat),
      withInTat: new UntypedFormControl(data.withInTat),
      active: new UntypedFormControl(true),
      clientFeesApproval: new UntypedFormControl(data.clientFeesApproval),
      clientTATApproval: new UntypedFormControl(data.clientTATApproval),
      feeDisableFlag: new UntypedFormControl(data.feeDisableFlag),
      tatDisableFlag: new UntypedFormControl(data.tatDisableFlag),
      compEditFlag: new UntypedFormControl(data.compEditFlag),
      deleteDisableFlag: new UntypedFormControl(),
      interimReportFlag: new UntypedFormControl(data.interimReportFlag),
      //  VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
      enableAutoIqc: new UntypedFormControl(data.enableAutoIqc),
      enableAutoFqc: new UntypedFormControl(data.enableAutoFqc),
      directAppAddressFlag: new UntypedFormControl(data.directAppAddressFlag),
      ctsFlag: new UntypedFormControl(data.ctsFlag),
      daCompValidationFlag: new UntypedFormControl(data.daCompValidationFlag),
      currencyId: new UntypedFormControl(data.currencyId),
      isAdditionalPos: new UntypedFormControl(data.isAdditionalPos),
      pdfReportNameChangeFlag: new UntypedFormControl(data.pdfReportNameChangeFlag),
      deReopenFlag: new UntypedFormControl(data.deReopenFlag),
// Added By Megala - For VTS2-2024-CRT-0217
pdfHyperLinkFlag:new UntypedFormControl(data.pdfHyperLinkFlag),

    });
  }
  clientFeesApproval(data: any) {
    this.clientFeesApprovalForm = this.fb.group({
      componentFeeId: new UntypedFormControl(0),
      componentId: new UntypedFormControl(data.componentId),
      subComponentId: new UntypedFormControl(data.subComponentId),
      requestedAmount: new UntypedFormControl(data.fees),
      requestorComments: new UntypedFormControl('', Validators.required),
      clientApprovalFlag: new UntypedFormControl(null, Validators.required),
      nrp: new UntypedFormControl(data.nrp),
      msp: new UntypedFormControl(data.msp),
      feeDocument: [],
      clientFeeDocument: [[]],
    });
  }
  clientFeeDocument() {
    this.clientFeeDocumentForm = new UntypedFormGroup({
      compFeeDocId: new UntypedFormControl(0),
      approvalFeeId: new UntypedFormControl(0),
      fileName: new UntypedFormControl(),
      componentId: new UntypedFormControl(this.componentForm.getRawValue().componentId),
      subComponentId: new UntypedFormControl(this.componentForm.getRawValue().subComponentId),
      document: new UntypedFormControl()
    });
  }
  clientTATApproval(data: any) {
    this.clientTATApprovalForm = this.fb.group({
      componentTATId: new UntypedFormControl(0),
      clientComponentId: new UntypedFormControl(data.clientComponentId),
      componentId: new UntypedFormControl(data.componentId),
      subComponentId: new UntypedFormControl(data.subComponentId),
      requestedTAT: new UntypedFormControl(data.tat),
      originalTAT: new UntypedFormControl(data.originalTAT),
      requestorComments: new UntypedFormControl('', Validators.required),
      clientApprovalFlag: new UntypedFormControl(null, Validators.required),
      tatDocument: [],
      clientTATDocument: [[]],
    });
  }
  clientTATDocument() {
    this.clientTATDocumentForm = new UntypedFormGroup({
      compTATDocId: new UntypedFormControl(0),
      approvalTATId: new UntypedFormControl(0),
      fileName: new UntypedFormControl(),
      componentId: new UntypedFormControl(this.componentForm.getRawValue().componentId),
      subComponentId: new UntypedFormControl(this.componentForm.getRawValue().subComponentId),
      document: new UntypedFormControl()
    });
  }
  componentChange(event: any) {
    if (event) {
      this.subCompList = this.bindData.find(x => x.serviceId === event);
      if (this.mainForm.get('componentEntry')?.value && this.index === -1 && (this.mainForm.get('componentEntry')?.value.some(x =>
        x.componentId === event && x.isSubComponent !== true) || (this.subCompList.subComponent !== null && this.subCompList.
          subComponent.length === this.mainForm.get('componentEntry')?.value.filter(e => e.componentId === event).length))) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Selected Component was already exists.');
        this.componentForm.get('componentId')?.setValue(null);
        return;
      }
      if (this.index === -1) {
        const currencyId = this.subCompList.abroadCompFlag ? this.commonService.getIdByName(this.currencyList, 'currencyId',
          'currencyShortName', this.commonService.currencyUsd) : this.commonService.getIdByName(this.currencyList, 'currencyId',
            'currencyShortName', this.commonService.currencyInr);
        this.componentForm.get('currencyId')?.setValue(currencyId);
      }

      if (this.subCompList.subComponent !== null) {
        this.componentForm.get('isSubComponent')?.setValue(true);
        this.componentForm.get('subComponentId')?.setValidators(Validators.required);
      } else {
        this.componentForm.get('componentDesc')?.setValue(this.subCompList.rptDesc);
        this.componentForm.get('componentDesc')?.disable();
        this.componentForm.get('subComponentId')?.clearValidators();
        this.componentForm.get('subComponentId')?.setValue(null);
      }
      this.componentForm.get('subComponentId')?.updateValueAndValidity();
      this.commonCompValue(this.subCompList);
    } else {
      this.subCompList = null;
    }
  }
  getSubCompName(compId, subCompId) {
    const subList = this.bindData.find(x => x.serviceId === compId).subComponent;
    return this.commonService.getNameById(subList, 'subComponentId', 'subReportType', subCompId);
  }
  editComponent(data, ind) {
    this.index = ind;
    this.commonService.goToTop();
    this.componentForm.patchValue(data);
    this.componentChange(data.componentId);
    let value = data;
    if (data.isSubComponent === true) {
      this.componentForm.get('subComponentId')?.setValue(data.subComponentEntry[0].subComponentId);
      this.componentForm.get('clientSubComponentId')?.setValue(data.subComponentEntry[0].clientSubComponentId);
      this.subComponentChange(data.subComponentEntry[0].subComponentId);
      value = data.subComponentEntry[0];
      this.componentForm.get('subComponentId')?.disable();
    } else {
      this.componentForm.get('subComponentEntry')?.setValue([]);
    }
    this.componentForm.patchValue({
      clientComponentId: value.clientComponentId,
      fees: value.fees,
      tat: value.tat,
      active: value.active,
      effectiveDate: value.effectiveDate,
      beyondTat: value.beyondTat,
      currentTat: value.currentTat,
      nearTat: value.nearTat,
      withInTat: value.withInTat,
      currencyId: value.currencyId,
      feeDisableFlag: value.feeDisableFlag,
      tatDisableFlag: value.tatDisableFlag,
      compEditFlag: value.compEditFlag,
      deleteDisableFlag: value.deleteDisableFlag,
      clientFeesApproval: value.clientFeesApproval,
      clientTATApproval: value.clientTATApproval,
    });
    this.showBt = this.componentForm.get('tat')?.value ? true : false;
    this.showCt = this.componentForm.get('beyondTat')?.value ? true : false;
    this.showNt = this.componentForm.get('currentTat')?.value ? true : false;
    this.showWt = this.componentForm.get('nearTat')?.value ? true : false;
    this.showIcons = this.componentForm.get('withInTat')?.value ? true : false;
    this.componentForm.get('componentId')?.disable();
    value.feeDisableFlag === true ? this.componentForm.get('fees')?.disable() : this.componentForm.get('fees')?.enable();
    value.feeDisableFlag === true ? this.componentForm.get('tat')?.disable() : this.componentForm.get('tat')?.enable();
    this.minDate = null;
    this.maxDate = null;
  }
  openDialog(ind: any) {
    this.deleteEvent.emit({
      data: ind, hText: 'Confirmation', bText: 'Are you sure you want to delete this record?',
      method1: 'componentScreen', method2: 'deleteComponent', methodNo: null
    });
  }
  deleteComponent(ind: any) {
    this.mainForm.get('componentEntry')?.value.splice(ind, 1);
    this.mainForm.get('componentEntry')?.setValue(this.mainForm.get('componentEntry')?.value);
    this.clientService.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
    this.dt.reset();
    this.commonService.goToTop();
  }
  commonCompValue(list: any) {
    this.componentForm.get('msp')?.setValue(list.msp);
    this.componentForm.get('nrp')?.setValue(list.nrp);
    this.componentForm.get('originalTAT')?.setValue(list.tat);
    this.componentForm.get('tat')?.setValue(list.tat);
  }
  subComponentChange(event: any) {
    if (event && this.subCompList.subComponent && this.subCompList.subComponent.length) {
      if (this.mainForm.get('componentEntry')?.value && this.mainForm.get('componentEntry')?.value.some(x => x.isSubComponent === true
        && x.subComponentEntry[0].subComponentId === event) > 0 && this.index === -1) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Selected Component was already exists.');
        this.componentForm.get('subComponentId')?.setValue(null);
        return;
      }
      const list = this.subCompList.subComponent.find(x => x.subComponentId === event);
      this.componentForm.get('componentDesc')?.setValue(list.subReportType);
      this.commonCompValue(list);
    }
  }
  checkFees(eventValue: any) {
    if (this.componentForm.get('fees')?.valid && (eventValue) && (eventValue < this.componentForm.get('msp')?.value)) {
      this.clientFeesApproval(this.componentForm.getRawValue());
      this.dialogRef = this.dialog.open(this.feesConfirmation, {
        width: '700px',
        disableClose: true
      });
    } else {
      this.componentForm.get('clientFeesApproval')?.setValue(null);
    }
  }
  typeChange(event, type) {
    if (type === true && event === true) {
      this.clientFeesApprovalForm.get('feeDocument')?.setValidators(Validators.required);
      this.clientFeesApprovalForm.get('feeDocument')?.updateValueAndValidity();
      this.clientFeeDocument();
    } else if (type === false && event === true) {
      this.clientTATApprovalForm.get('tatDocument')?.setValidators(Validators.required);
      this.clientTATApprovalForm.get('tatDocument')?.updateValueAndValidity();
      this.clientTATDocument();
    } else if (type === true && event === false) {
      this.clientFeesApprovalForm.get('clientFeeDocument')?.setValue([]);
      this.clientFeesApprovalForm.get('feeDocument')?.clearValidators();
      this.clientFeesApprovalForm.get('feeDocument')?.updateValueAndValidity();
    } else if (type === false && event === false) {
      this.clientTATApprovalForm.get('clientTATDocument')?.setValue([]);
      this.clientTATApprovalForm.get('tatDocument')?.clearValidators();
      this.clientTATApprovalForm.get('tatDocument')?.updateValueAndValidity();
    }
  }
  saveFeePopup() {
    if (this.clientFeesApprovalForm.valid) {
      if ((this.clientFeesApprovalForm.value.clientApprovalFlag === true && this.clientFeesApprovalForm.value.clientFeeDocument
        .length > 0) || (this.clientFeesApprovalForm.value.clientApprovalFlag !== true)) {
        this.componentForm.get('clientFeesApproval')?.setValue(this.clientFeesApprovalForm.getRawValue());
        this.dialogRef.close();
      }
    } else {
      this.clientFeesApprovalForm.markAllAsTouched();
    }
  }
  removeFeeDoc(ind: any) {
    this.clientFeesApprovalForm.value.clientFeeDocument.splice(ind, 1);
    this.clientFeesApprovalForm.get('clientFeeDocument')?.setValue(this.clientFeesApprovalForm.value.clientFeeDocument);
  }
  openUploadFeeDoc(event: any) {
    this.clientFeeDocumentForm.patchValue({
      fileName: event.target.files[0].name,
      document: event.target.files[0],
    });
    this.clientFeesApprovalForm.value.clientFeeDocument.push(this.clientFeeDocumentForm.value);
    this.clientFeesApprovalForm.get('clientFeeDocument')?.setValue(this.clientFeesApprovalForm.value.clientFeeDocument);
  }
  feePopupClose() {
    this.componentForm.get('fees')?.setValue(null);
    this.dialogRef.close();
  }
  getFeeColumns() {
    const fee = [
      { field: 'docType', header: 'Document Type' },
      { field: 'fileName', header: 'File Name' },
      { field: 'msp', header: 'Msp' },
      { field: 'nrp', header: 'Nrp' },
      { field: 'requestorComments', header: 'Comments' },
    ];
    return fee;
  }
  getTatColumns() {
    const tat = [
      { field: 'docType', header: 'Document Type' },
      { field: 'fileName', header: 'File Name' },
      { field: 'originalTAT', header: 'TAT' },
      { field: 'tat', header: 'Requested TAT' },
      { field: 'requestorComments', header: 'Comments' },
    ];
    return tat;
  }
  tatPopupClose() {
    this.componentForm.get('tat')?.setValue(null);
    this.dialogRef.close();
  }
  saveTatPopup() {
    if (this.clientTATApprovalForm.valid) {
      if ((this.clientTATApprovalForm.value.clientApprovalFlag === true && this.clientTATApprovalForm.value.clientTATDocument.length > 0)
        || (this.clientTATApprovalForm.value.clientApprovalFlag !== true)) {
        this.componentForm.get('clientTATApproval')?.setValue(this.clientTATApprovalForm.getRawValue());
        this.dialogRef.close();
      }
    } else {
      this.clientTATApprovalForm.markAllAsTouched();
    }
  }
  removeTatDoc(ind: any) {
    this.clientTATApprovalForm.value.clientTATDocument.splice(ind, 1);
    this.clientTATApprovalForm.get('clientTATDocument')?.setValue(this.clientTATApprovalForm.value.clientTATDocument);
  }
  openUploadTatDoc(event: any) {
    this.clientTATDocumentForm.patchValue({
      fileName: event.target.files[0].name,
      document: event.target.files[0],
    });
    this.clientTATApprovalForm.value.clientTATDocument.push(this.clientTATDocumentForm.value);
    this.clientTATApprovalForm.get('clientTATDocument')?.setValue(this.clientTATApprovalForm.value.clientTATDocument);
  }
  checkTat(eventValue, fieldName) {
    eventValue = Number(eventValue);
    let tatValue = this.componentForm.get('tat')?.value ? Number(this.componentForm.get('tat')?.value) : '';
    let beyondTatValue = this.componentForm.get('beyondTat')?.value ? Number(this.componentForm.get('beyondTat')?.value) : '';
    let currentTatValue = this.componentForm.get('currentTat')?.value ? Number(this.componentForm.get('currentTat')?.value) : '';
    let nearTatValue = this.componentForm.get('nearTat')?.value ? Number(this.componentForm.get('nearTat')?.value) : '';
    let withInTatValue = this.componentForm.get('withInTat')?.value ? Number(this.componentForm.get('withInTat')?.value) : '';
    if (fieldName === 'tat') {
      if (eventValue && this.componentForm.get('tat')?.valid) {
        this.clientTatValidation(eventValue);
        if (eventValue < this.componentForm.get('originalTAT')?.value) {
          this.clientTATApproval(this.componentForm.getRawValue());
          this.dialogRef = this.dialog.open(this.tatConfirmation, {
            width: '700px',
            disableClose: true
          });
        } else {
          this.showBt = true;
          this.componentForm.get('clientTATApproval')?.setValue(null);
        }
      } else {
        if (currentTatValue && nearTatValue && withInTatValue && beyondTatValue && tatValue === '') {
          this.makeEmptyField('tat');
        }
      }
    } else if (fieldName === 'bt') {
      if (currentTatValue && nearTatValue && withInTatValue && beyondTatValue === '') {
        this.makeEmptyField('bt');
      }
      if (eventValue >= tatValue) {
        this.showCt = true;
      }
    } else if (fieldName === 'ct') {
      if (eventValue <= beyondTatValue) {
        this.showNt = true;
      }
    } else if (fieldName === 'nt') {
      if (eventValue <= currentTatValue) {
        this.showWt = true;
      }
    } else {
      if (eventValue <= nearTatValue) {
        this.showIcons = true;
      }
    }
    this.validInputValues(beyondTatValue, tatValue, currentTatValue, nearTatValue, withInTatValue);
  }
  validInputValues(beyondTatValue, tatValue, currentTatValue, nearTatValue, withInTatValue) {
    //Remove Validation
    if (beyondTatValue > tatValue && currentTatValue <= beyondTatValue && nearTatValue <= currentTatValue && withInTatValue <= nearTatValue) {
      // Valid values
      this.componentForm.get('beyondTat')?.setErrors(null);
      this.componentForm.get('nearTat')?.setErrors(null);
      this.componentForm.get('currentTat')?.setErrors(null);
      this.componentForm.get('withInTat')?.setErrors(null);
    } else {
      // Invalid values
      if (beyondTatValue <= tatValue && beyondTatValue != '' && tatValue != '') {
        this.componentForm.get('beyondTat')?.markAsTouched();
        this.componentForm.get('beyondTat')?.setErrors({ incorrect: true });
      }
      else
        this.componentForm.get('beyondTat')?.setErrors(null);
      if (currentTatValue > beyondTatValue && currentTatValue != '' && beyondTatValue != '') {
        this.componentForm.get('currentTat')?.setErrors({ incorrect: true });
      }
      else
        this.componentForm.get('currentTat')?.setErrors(null);
      if (nearTatValue > currentTatValue && nearTatValue != '' && currentTatValue != '')
        this.componentForm.get('nearTat')?.setErrors({ incorrect: true });
      else
        this.componentForm.get('nearTat')?.setErrors(null);
      if (withInTatValue > nearTatValue && withInTatValue != '' && nearTatValue != '')
        this.componentForm.get('withInTat')?.setErrors({ incorrect: true });
      else
        this.componentForm.get('withInTat')?.setErrors(null);
      // remove Validation
      // if(beyondTatValue =='')
      // this.componentForm.get('beyondTat')?.setErrors({ required: true });      
      // if(currentTatValue=='')
      // this.componentForm.get('currentTat')?.setErrors({ required: true });
      // if(nearTatValue=='')
      // this.componentForm.get('nearTat')?.setErrors({ required: true });
      // if( withInTatValue=='')
      // this.componentForm.get('withInTat')?.setErrors({ required: true });

    }
  }
  makeEmptyField(field: any) {
    let value = field === 'tat' ? 'BT,' : '';
    this.dialogRef = this.dialog.open(this.tatValidation, {
      width: '450px',
      data: `${value} CT, NT, WT value is based on ${field.toUpperCase()}. If you remove ${field.toUpperCase()}, then dependent fields become empty`
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.showBt = field === 'tat' ? false : true;
        this.showCt = false;
        this.showNt = false;
        this.showWt = false;
        this.showIcons = false;
        this.componentForm.get('beyondTat')?.setValue('');
        this.componentForm.get('currentTat')?.setValue('');
        this.componentForm.get('nearTat')?.setValue('');
        this.componentForm.get('withInTat')?.setValue('');
      }
    })
  }
  clientTatValidation(eventValue: any) {
    if (Number(this.mainForm.get('clientEntry.tatCount')?.value) < eventValue) {
      this.componentForm.get('tat')?.setErrors({ incorrect: true });
      this.componentForm.get('tat')?.markAsTouched();
    } else {
      this.componentForm.get('tat')?.setErrors(null);
    }
  }
  fileSizeValidation() {
    const list = this.mainForm.get('componentEntry')?.value.filter(x => x.clientFeesApproval ||
      x.clientTATApproval || (x.subComponentEntry.some(s => s.clientFeesApproval || s.clientTATApproval)));
    let size = 0;
    list.forEach(element => {
      if (element.clientFeesApproval) {
        element.clientFeesApproval.clientFeeDocument.forEach(eleme => {
          size = size + eleme.document.size;
        });
      }
      if (element.clientTATApproval) {
        element.clientTATApproval.clientTATDocument.forEach(elem => {
          size = size + elem.document.size;
        });
      }
      element.subComponentEntry.forEach(ele => {
        if (ele.clientFeesApproval) {
          ele.clientFeesApproval.clientFeeDocument.forEach(el => {
            size = size + el.document.size;
          });
        }
        if (ele.clientTATApproval) {
          ele.clientTATApproval.clientTATDocument.forEach(e => {
            size = size + e.document.size;
          });
        }
      });
    });
    if (this.componentForm.getRawValue().clientFeesApproval) {
      this.componentForm.getRawValue().clientFeesApproval.clientFeeDocument.forEach(eleme => {
        size = size + eleme.document.size;
      });
    }
    if (this.componentForm.getRawValue().clientTATApproval) {
      this.componentForm.getRawValue().clientTATApproval.clientTATDocument.forEach(elem => {
        size = size + elem.document.size;
      });
    }
    return this.bytesToSize(size);
  }
  bytesToSize(bytes: any) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    const total = Math.round(bytes / Math.pow(1024, i));
    if (i === 2) {
      return total > 5 ? false : true;
    } else if (i > 2) {
      return false;
    } else {
      return true;
    }
  }
  //   bytesToSize1(bytes: any) {
  //     var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  //     if (bytes == 0) return '0 Byte';
  //     var i = Math.floor(Math.log(bytes) / Math.log(1024));
  //     return Math.round(bytes / Math.pow(1024, i));
  //  }
  addComponent() {
    this.minDate = new Date()
    this.maxDate = new Date()
    this.clientTatValidation(this.componentForm.get('tat')?.value);
    const fileSize = this.fileSizeValidation();
    if (!fileSize) {
      this.clientService.showTopCenter('warn', 'Failure Message', 'the overall file size should be less than 5MB');
      return;
    }
    if (this.componentForm.get('tat')?.errors && this.componentForm.get('tat')?.errors.incorrect === true) {
      return;
    }
    const ctrls = ['fees', 'tat', 'componentDesc'];
    if (this.componentForm.valid && !ctrls.some(y => !this.componentForm.get(y).value)) {
      this.componentForm.get('compEditFlag')?.setValue(true);
      if (this.componentForm.get('isSubComponent')?.value === true && this.componentForm.get('subComponentEntry')?.value.length === 0) {
        const subComp = this.componentForm.get('subComponentEntry') as UntypedFormArray;
        subComp.push(this.subComponentEntryForm(this.componentForm.getRawValue()));
        this.componentForm.get('clientFeesApproval')?.setValue(null);
        this.componentForm.get('clientTATApproval')?.setValue(null);
      }
      const componentEntry = this.mainForm.get('componentEntry')?.value;
      if (this.index > -1) {
        this.componentForm.get('compEditFlag')?.setValue(true);
        componentEntry[this.index] = this.componentForm.getRawValue();
      } else {
        componentEntry.push(this.componentForm.getRawValue());
      }
      this.mainForm.get('componentEntry')?.setValue(componentEntry);
      this.clientService.showTopCenter('success', 'Success Message', (this.index > -1 ? 'Updated' : 'Saved') + ' Successfully');
      this.resetComponent();
    } else {
      this.componentForm.markAllAsTouched();
      ctrls.forEach(x => {
        this.componentForm.get(x).setValidators(Validators.required);
        this.componentForm.get(x).updateValueAndValidity();
      });
    }
  }
  resetComponent() {
    this.index = -1;
    this.componentEntryForm();
    this.subCompList = null;
    this.dt.reset();
    this.showBt = false;
    this.showCt = false;
    this.showNt = false;
    this.showWt = false;
    this.showIcons = false;
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
  downloadFile(data: any) {
    if (data.compFeeDocId > 0) {
      this.clientService.getDocumentDetail(data.compFeeDocId).subscribe(resp => {
        if (resp.document) {
          this.commonService.downloadDocument(data.compFeeDocId, resp.document, data.fileName);
        }
      });
    } else {
      this.commonService.saveByteArray(data.fileName, data.document);
    }
  }
  preview(data: any) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    // this.fname = fileName;
    // this.sid = screeningDocId;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.documentId == 0 || data.compFeeDocId == 0) {
        const blob = new Blob([data.document], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (data.documentId > 0) {
        this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.documentId == 0 || data.compFeeDocId == 0) {
        const blob = new Blob([data.document], { type: 'application/octet-stream' });
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
          (window.navigator as any).msSaveOrOpenBlob(blob, data.fileName);
        } else {
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display:none;');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        };
      }
      else if (data.documentId > 0) {
        this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        });
      }
      this.dialog.open(this.pdfDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else {
      this.downloadFile(data);
    }
  }
  pdftool(type: any) {
    switch (type) {
      case 'right':
        this.rvalue += 90;
        break;
      case 'left':
        this.rvalue -= 90;
        break;
      case 'zoomin':
        this.zoomval += 0.1;
        break;
      case 'zoomout':
        this.zoomval -= 0.1;
        break;
      case 'reset':
        this.zoomval = 1;
        this.rvalue = 0;
        break;
      case 'download':
        this.downloadFile(this.downldata);
        break;
      default:
        break;

    }
  }
  zoomin() {

    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;
    if (currWidth == 1500) return false;
    else {
      myImg.style.width = (currWidth + 100) + "px";
    }
  }

  zoomout() {
    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;

    if (currWidth == 100) return false;
    else {
      myImg.style.width = (currWidth - 100) + "px";
    }
  }
  rotateimg(route: any) {
    this.dir = route
    this.state = (this.state === 'default' ? 'rotated' : this.dir);
  }
  // Added By Naveen
  openInsuffHistory() {
    let client: any;
    client = this.mainForm.get('componentEntry')?.value;
    this.clientId = client[0].clientId;
    this.clientService.getInsuffHistoryDetail(this.clientId).subscribe(resp => {
      if (resp) {
        this.insuffHistoryData = resp;
        this.insuffHistoryData.forEach(ele => {
          ele.modifiedDate = this._datePipe.transform(ele.modifiedDate, 'dd-MM-yyyy');
          if (ele.subComponentEffectiveHistoryDetails != null) {
            ele.subComponentEffectiveHistoryDetails.forEach(e => {
              e.modifiedDate = this._datePipe.transform(e.modifiedDate, 'dd-MM-yyyy');
            })
          }
        })
      }
    });
    this.dialog.open(this.insuffHistory,
      { width: '800px', disableClose: true, });
  }
}
