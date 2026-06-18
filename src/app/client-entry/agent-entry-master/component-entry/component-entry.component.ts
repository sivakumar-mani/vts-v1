import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
// tslint:disable-next-line: max-line-length
import { ComponentDetails, ComponentEntry, SubComponent, ClientEntry, componentNew, ClientFeesApprovalVm, ClientFeeDocumentVm, ClientNoFeeApprovalVm, ClientTATApprovalVm, ClientTATDocumentVm } from 'src/app/common-methods/models/agentEntryMaster';
import { CommonService } from 'src/app/common-methods/services/common.service';
// import { MatDialog, MatDatepicker } from '@angular/material';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
// import { DataTable } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { DatePipe } from '@angular/common';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-component-entry',
  templateUrl: './component-entry.component.html',
  styleUrls: ['./component-entry.component.css'],
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

export class ComponentEntryComponent implements OnInit {
  // @ViewChild('clientComponentPopUp', { static: true }) clientComponentPopUp;
  @ViewChild('clientComponentPopUp') clientComponentPopUp: any;
  // @ViewChild('dt') dt!: Table;

  dialogRef: any;
  value1: number;
  value2: number;
  tempClientFeeApproval: clientFeeApproval[] = [];
  clientFeeNoVm: clientNoFeeApprovalVm[] = [];
  clientFeeNoValue: ClientNoFeeApprovalVm[] = [];
  // @ViewChild('dt', { static: false }) dt: DataTable;
  @ViewChild('dt', { static: false }) dt!: Table;
  existItem: any[] = [];
  componentDetails: ComponentDetails[] = [];
  componentEntry = new ComponentEntry();
  // componentEntry = new ComponentEntry();
  componentName: SubComponent[] = [];
  subComponentEntry = new SubComponent();
  componentDescList: any[] = [];
  clientAddFlag: boolean;
  clientFeeApprovalFlag: boolean;
  ClientFeesApprovalVm = new ClientFeesApprovalVm();
  clientTATApproval = new ClientTATApprovalVm();
  iscomponentDescList = false;
  componentEntryHeading = null;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @ViewChild('feesConfirmation') feesConfirmation: any;
  @ViewChild('tatConfirmation') tatConfirmation: any;
  @ViewChild('checkTAT') checkTAT: any;

  // @ViewChild('feesConfirmation', { static: true }) feesConfirmation;
  // @ViewChild('tatConfirmation', { static: true }) tatConfirmation;
  // @ViewChild('checkTAT', { static: true }) checkTAT;
  componentId: number;
  subCompId: number;
  validationType: string;
  clientFeeApproval: clientFeeApproval[] = [];
  cnt = 0;
  flagFee: boolean;
  // @ViewChild('clientFeeDocument', { static: true }) clientFeeDocument;
  @ViewChild('clientTATDocument') clientTATDocument: any;
  @ViewChild('clientFeeDocument') clientFeeDocument: any;

  // @ViewChild('dt') dt!: Table;

  documentValidationFees: boolean;
  documentValidationFeesTotal: boolean;
  columnName = [
    { field: 'componentType', header: 'Component Type' },
    { field: 'componentDesc', header: 'Component Desc' },
    { field: 'fees', header: 'Fees' },
    { field: 'currencyId', header: 'Currency' },
    { field: 'effectiveDate', header: 'Effective Date' },
    { field: 'tat', header: 'TAT Days' },
  ];

  columns = [
    { field: 'componentType', header: 'Component Type	' },
    { field: 'componentDesc', header: 'Component Desc' },
    { field: 'fileName', header: 'File Name' },
    { field: 'msp', header: 'Msp' },
    { field: 'nrp', header: 'Nrp' },
    { field: 'requestedAmount', header: 'Requested Amount' },
    { field: 'Actions', header: 'Actions' },
  ];
  columnsTAT = [
    { field: 'componentType', header: 'Component Type	' },
    { field: 'componentDesc', header: 'Component Desc' },
    { field: 'fileName', header: 'File Name' },
    { field: 'originalTAT', header: 'TAT' },
    { field: 'requestedTAT', header: 'Requested TAT' },
    { field: 'Actions', header: 'Actions' },
  ];
  tooltip = false;
  index = -1;
  componentFlag: boolean;
  component12: SubComponent;
  componentnew = new ComponentEntry();
  dupClientFeeList: any[] = [];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  msp: number;
  nrp: number;
  errormsg: string;
  maxDate = new Date();
  subcomponentAlreadyExist = false;
  list: any;
  tempList: ComponentEntry[];
  flagcheck: boolean;
  documentValidation = true;
  cont = true;
  componentid: number;
  data: any;
  tat: any;
  flagTAT: any;
  componentIdTAT: number;
  subCompIdTAT: number;
  dupClientTATList: any[] = [];
  existItemTAT: any[] = [];
  documentValidationTAT: boolean;
  documentValidationTATTotal: boolean;
  documentTAT = true;
  componentControls!: AutoCompleteDropDown;
  abroadCompFlag: boolean;
  currencyControls!: AutoCompleteDropDown;
  @Input() currencyList: any;

  constructor(public agentEntryMasterService: AgentEntryMasterService, private message: MessageService, private datepipe: DatePipe,
    // tslint:disable-next-line:align
    public authService: AuthService, public dialog: MatDialog, public commonService: CommonService) { }

  ngOnInit() {
    this.getComponetDetails();
    this.agentEntryMasterService.componentEntryForm.reset();
    this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.setValue(this.maxDate);
    if (this.currencyList.length > 0) {
      this.agentEntryMasterService.componentEntryForm.get('currency')?.setValue(this.currencyList.
        find(x => x.currencyShortName.toLowerCase() === this.commonService.currencyInr).currencyId);
    }
    this.componentControls =
      new AutoCompleteDropDown('Component', 'component', 'serviceId', 'rptType', this.componentDetails,
        '', this.agentEntryMasterService.componentEntryForm, false, false, true);
    this.currencyControls =
      new AutoCompleteDropDown('Currency', 'currency', 'currencyId', 'currencyShortName', this.currencyList,
        '', this.agentEntryMasterService.componentEntryForm, false, false, true);
    this.getEnable();
  }

  getComponetDetails() {
    this.agentEntryMasterService.getComponentDetails(this.agentEntryMasterService.clientEntryForm
      .controls.indianClientFlag.value).subscribe(res => {
        this.componentDetails = res;
        console.log(this.componentDetails, 'componentDetails');
        this.componentControls =
          new AutoCompleteDropDown('Component', 'component', 'serviceId', 'rptType', this.componentDetails,
            '', this.agentEntryMasterService.componentEntryForm, false, false, true);
        // console.log(res);
      }, err => {
        // console.log(err);
      }, () => {
      });
  }
  openDate(Date1: MatDatepicker<Date>) {
    Date1.open();
  }
  getName(rowData: any) {
    if (rowData.currencyId) {
      return this.currencyList.find(x => x.currencyId === rowData.currencyId).currencyShortName;
    }
  }
  componentDetailChange(event: any) {
    if (event) {
      // this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValue(null);
      this.componentEntry = new ComponentEntry();
      const data: ComponentDetails = this.componentDetails.find(e => e.serviceId === event);
      this.componentEntryHeading = this.commonService.CloneObject(data.rptType);
      this.iscomponentDescList = this.commonService.CloneObject(data.isSubComponent === true);
      this.componentEntry.active = true;
      this.abroadCompFlag = data.abroadCompFlag;
      if (this.abroadCompFlag === true) {
        this.agentEntryMasterService.componentEntryForm.get('currency')?.setValue(this.currencyList.
          find(x => x.currencyShortName.toLowerCase() === this.commonService.currencyUsd).currencyId);
      } else {
        this.agentEntryMasterService.componentEntryForm.get('currency')?.setValue(this.currencyList.
          find(x => x.currencyShortName.toLowerCase() === this.commonService.currencyInr).currencyId);
      }
      this.componentEntry.clientComponentId = 0;
      this.componentEntry.isSubComponent = this.commonService.CloneObject(data.isSubComponent);
      this.componentEntry.componentDesc = this.commonService.CloneObject(data.rptDesc);
      this.componentEntry.componentType = this.commonService.CloneObject(data.rptType);
      this.componentEntry.componentId = this.commonService.CloneObject(data.serviceId);
      this.flagcheck = data.isSubComponent;
      if (!data.isSubComponent) {
        this.componentEntry.subComponentEntry = null;
        this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValue(data.rptDesc);
        if (this.index === -1) {
          this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(data.tat);
        }
        // this.checkTat();
        this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.disable();
        // if (this.index === -1) {
        //   this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
        //   this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
        //   this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
        // }
      } else {
        if (this.index === -1) {
          // this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
          this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
          this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
        }
        // if (this.componentEntry.clientComponentId > 0) {
        //   this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
        //   this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
        // }
        this.componentEntry.subComponentEntry = [];
        this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.enable();
        this.subComponentEntry.clientComponentId = data.clientComponentId;
        this.subComponentEntry.active = true;
        this.componentDescList = data.subComponent;
      }
      if (!this.componentEntry.isSubComponent) {
        this.existItem = this.agentEntryMasterService.componentEntryList.filter(x => x.componentId === event);
        if (this.existItem.length > 0 && this.index === -1) {
          this.showTopCenter('warn', 'Failure Message', 'Selected Component was already exists.');
          this.agentEntryMasterService.componentEntryForm.get('component')?.setValue(null);
          this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValue(null);
        }
      }
    }
    this.componentEntry.clientFeeApprovalFlag = false;
    this.matHintMethod();
  }
  matHintMethod() {
    const comVal = this.componentControls.selectFormGroup.get('component')?.value;
    const subVal = this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.value;
    const com = this.componentDetails.filter(e => e.serviceId === comVal);
    // const fees = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
    if (com.length > 0) {
      if (com[0].isSubComponent === true) {
        this.list = com[0].subComponent;
        if (subVal) {
          const sub = this.list.filter(ee => (ee.subComponentId === subVal) || (ee.subReportType === subVal));
          if (sub.length > 0) {
            this.msp = sub[0].msp;
            this.nrp = sub[0].nrp;
            this.componentEntry.componentDesc = sub[0].subReportType;
          } else {
            this.msp = 0;
            this.nrp = 0;
          }
        }
      } else {
        this.msp = com[0].msp;
        this.nrp = com[0].nrp;
        this.componentEntry.componentDesc = com[0].rptDesc;
      }
      this.componentEntry.componentType = com[0].rptType;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  componentChange(e: any) {
    if (e) {
      const data = this.componentDescList.filter(el => el.subComponentId === e)[0];
      this.subComponentEntry.clientSubComponentId = 0;
      this.subComponentEntry.subComponentId = data.subComponentId;
      this.componentEntry.componentDesc = data.subReportType;
      if (this.index === -1) {
        this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(data.tat);
      }
      // this.checkTat();
      if (this.index === -1) {
        // this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
        this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
      }
    }
    const dupsubcomponent = this.agentEntryMasterService.componentEntryList.filter(x => x.isSubComponent === true);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < dupsubcomponent.length; i++) {
      this.existItem = dupsubcomponent[i].subComponentEntry.filter(item => item.subComponentId === e);
      if (this.existItem.length > 0 && this.index === -1) {
        if (this.message) {
          this.showTopCenter('warn', 'Failure Message', 'Selected Sub Component was already exists.');
          this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValue(null);
          return;
        }
      }
    }
    // this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
    this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
    this.matHintMethod();
  }

  addComponent() {
    this.agentEntryMasterService.componentEntryForm.get('component')?.setValue
      (this.componentControls.selectFormGroup.get('component')?.value);
    this.effectiveDateChange();
    this.checkValidValue();
    this.add();
    this.clientAddFlag = true;
    if (this.agentEntryMasterService.componentEntryForm.valid) {

      if (!this.componentEntry.isSubComponent) {
        this.componentEntry.componentId = this.agentEntryMasterService.componentEntryForm.get('component')?.value;
        // tslint:disable-next-line:max-line-length
        const value = this.componentDetails.filter(x => x.serviceId === this.componentEntry.componentId);
        const rpt = value[0].rptType;
        this.componentEntry.componentType = rpt;

        // tslint:disable-next-line:max-line-length
        const values = this.componentDetails.filter(x => x.serviceId === this.componentEntry.componentId);
        const rptdesc = values[0].rptDesc;
        this.componentEntry.componentDesc = rptdesc;
        this.componentEntry.currencyId = this.agentEntryMasterService.componentEntryForm.get('currency')?.value;
        this.componentEntry.effectiveDate = this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
        this.componentEntry.fees = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
        this.componentEntry.tat = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
        this.componentEntry.deleteDisableFlag = this.agentEntryMasterService.componentEntryForm.get('deleteDisableFlag')?.value;
        if (this.index > -1) {
          if (this.agentEntryMasterService.componentEntryList) {
            this.agentEntryMasterService.componentEntryList[this.index] = this.commonService.CloneObject(this.componentEntry);
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.index = -1;
            this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
            this.subComponentEntry.subComponentId = 0;
            this.tooltip = false;
          }
        } else {
          this.componentEntryHeading = null;
          if (this.agentEntryMasterService.componentEntryList) {

            this.agentEntryMasterService.componentEntryList.push(this.commonService.CloneObject(this.componentEntry));
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            // this.agentEntryMasterService.componentEntryList = this.commonService.CloneObject(this.tempList);
          }
          this.agentEntryMasterService.componentEntryForm.reset();
        }

      }
      if (this.componentEntry.isSubComponent) {
        this.subComponentEntry.serviceId = this.agentEntryMasterService.componentEntryForm.get('component')?.value;
        // tslint:disable-next-line:max-line-length
        const value = this.componentDescList.filter(x => x.serviceId === this.subComponentEntry.serviceId);
        const subtype = value[0].subReportDesc;
        this.componentEntry.componentType = subtype;

        this.subComponentEntry.subComponentId = this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.value;
        // tslint:disable-next-line:max-line-length
        const values = this.componentDescList.filter(x => x.subComponentId === this.subComponentEntry.subComponentId);
        this.componentEntry.componentDesc = values[0].subReportType;
        this.subComponentEntry.subReportType = values[0].subReportType;
        this.componentEntry.subCompId = values[0].subComponentId;
        this.componentEntry.deleteDisableFlag = this.agentEntryMasterService.componentEntryForm.get('deleteDisableFlag')?.value;
        this.componentEntry.effectiveDate = this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
        this.componentEntry.fees = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
        this.componentEntry.tat = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
        this.subComponentEntry.fees = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
        this.subComponentEntry.tat = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
        this.componentEntry.currencyId = this.agentEntryMasterService.componentEntryForm.get('currency')?.value;
        this.subComponentEntry.currencyId = this.agentEntryMasterService.componentEntryForm.get('currency')?.value;
        this.componentEntry.subComponentEntry.push(this.commonService.CloneObject(this.subComponentEntry));
        if (this.index > -1) {
          if (this.agentEntryMasterService.componentEntryList) {
            this.agentEntryMasterService.componentEntryList[this.index] = this.componentEntry;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.index = -1;
            this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
            this.tooltip = false;
            this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.enable();
          }
        } else {
          if (this.agentEntryMasterService.componentEntryList) {
            this.agentEntryMasterService.componentEntryList.push(this.commonService.CloneObject(this.componentEntry));
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
        }
      }
      this.dt.reset();
      this.addComponentTB();
      this.addComponentTAT();
      this.agentEntryMasterService.componentEntryForm.reset();
      this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
      this.agentEntryMasterService.componentEntryForm.get('tat')?.enable();
      this.index = -1;
      this.msp = 0;
      this.nrp = 0;
      this.agentEntryMasterService.componentEntryForm.get('component')?.enable();
      this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.setValue(this.maxDate);
      if (this.currencyList.length > 0) {
        this.agentEntryMasterService.componentEntryForm.get('currency')?.setValue(this.currencyList.
          find(x => x.currencyShortName.toLowerCase() === this.commonService.currencyInr).currencyId);
      }
      this.agentEntryMasterService.componentEntryForm.get('fees')?.setValidators(Validators.min(1));
      this.agentEntryMasterService.componentEntryForm.get('tat')?.setValidators(Validators.min(1));
    }
  }
  addComponentTAT() {
    if (this.agentEntryMasterService.clientAddFlagTAT === true && this.agentEntryMasterService.componentEntryForm.valid) {
      if (this.componentEntry.isSubComponent === true) {
        // if ((this.subComponentEntry.clientFeesApproval.msp > this.subComponentEntry.clientFeesApproval.requestedAmount)
        //   && (this.subComponentEntry.clientFeesApproval.requestedAmount < this.subComponentEntry.clientFeesApproval.nrp)) {
        //   this.validationType = 'less than MSP and NRP';
        // } else {
        //   this.validationType = 'less than MSP';
        // }
        const obj: ClientTATApproval = {
          componentId: this.subComponentEntry.clientTATApproval.componentId,
          componentType: this.componentEntry.componentType,
          componentDesc: this.componentEntry.componentDesc,
          requestedTAT: this.subComponentEntry.clientTATApproval.requestedTAT,
          originalTAT: this.subComponentEntry.clientTATApproval.originalTAT,
          clientComponentId: this.subComponentEntry.clientTATApproval.clientComponentId,
          subCompId: this.subComponentEntry.clientTATApproval.subComponentId,
          fileName: '',
          comments: this.subComponentEntry.clientTATApproval.requestorComments,
        };
        // tslint:disable-next-line:max-line-length
        this.existItemTAT = this.agentEntryMasterService.clientTATPreApprovalEmail.filter(item => item.subCompId === this.subComponentEntry.subComponentId);
        // if (this.existItemTAT.length > 0) {
        //   this.existItemTAT[0].currentAmount = this.subComponentEntry.clientTATApproval.currentAmount;
        //   // alert('The Sub Component List has been already inserted');
        // } else {
        if (this.agentEntryMasterService.clientAddFlagTAT === true) {
          this.agentEntryMasterService.clientTATPreApprovalEmail.push(obj);
        }
        this.agentEntryMasterService.clientAddFlagTAT = false;
        // }
      } else {
        // if ((this.componentEntry.clientFeesApproval.msp > this.componentEntry.clientFeesApproval.requestedAmount)
        //   && (this.componentEntry.clientFeesApproval.requestedAmount < this.componentEntry.clientFeesApproval.nrp)) {
        //   this.validationType = 'less than MSP and NRP';
        // } else {
        //   this.validationType = 'less than MSP';
        // }
        const obj: ClientTATApproval = {
          componentId: this.componentEntry.clientTATApproval.componentId,
          componentType: this.componentEntry.componentType,
          componentDesc: this.componentEntry.componentDesc,
          requestedTAT: this.componentEntry.clientTATApproval.requestedTAT,
          originalTAT: this.componentEntry.clientTATApproval.originalTAT,
          clientComponentId: this.componentEntry.clientTATApproval.clientComponentId,
          subCompId: 0,
          fileName: '',
          comments: this.componentEntry.clientTATApproval.requestorComments,
        };
        // tslint:disable-next-line:max-line-length
        this.existItem = this.agentEntryMasterService.clientTATPreApprovalEmail.filter(item => item.componentId === this.componentEntry.componentId
        );
        // if (this.existItem.length > 0) {
        //   this.existItem[0].currentAmount = this.componentEntry.clientFeesApproval.currentAmount;
        // } else {
        if (this.agentEntryMasterService.clientAddFlagTAT === true) {
          this.agentEntryMasterService.clientTATPreApprovalEmail.push(obj);
        }
        // }
        this.agentEntryMasterService.clientAddFlagTAT = false;
      }
    }
  }
  addComponentTB() {
    if (this.agentEntryMasterService.clientAddFlag === true && this.agentEntryMasterService.componentEntryForm.valid) {
      if (this.componentEntry.isSubComponent === true) {
        if ((this.subComponentEntry.clientFeesApproval.msp > this.subComponentEntry.clientFeesApproval.requestedAmount)
          && (this.subComponentEntry.clientFeesApproval.requestedAmount < this.subComponentEntry.clientFeesApproval.nrp)) {
          this.validationType = 'less than MSP and NRP';
        } else {
          this.validationType = 'less than MSP';
        }
        const obj: clientFeeApproval = {
          clientApprovalFlag: this.subComponentEntry.clientFeesApproval.clientApprovalFlag,
          componentId: this.subComponentEntry.clientFeesApproval.componentId,
          componentType: this.subComponentEntry.clientFeesApproval.componentType,
          componentDesc: this.subComponentEntry.clientFeesApproval.componentDesc,
          currentAmount: this.subComponentEntry.clientFeesApproval.currentAmount,
          msp: this.subComponentEntry.clientFeesApproval.msp,
          nrp: this.subComponentEntry.clientFeesApproval.nrp,
          requestedAmount: this.subComponentEntry.clientFeesApproval.requestedAmount,
          clientComponentId: this.subComponentEntry.clientFeesApproval.clientComponentId,
          requestedEffectiveDate: this.subComponentEntry.clientFeesApproval.requestedEffectiveDate,
          componentFeeId: this.subComponentEntry.clientFeesApproval.componentFeeId,
          subCompId: this.subComponentEntry.clientFeesApproval.subComponentId,
          fileName: '',
          comments: this.subComponentEntry.clientFeesApproval.requestorComments,
          validationType: this.validationType
        };
        // tslint:disable-next-line:max-line-length
        this.existItem = this.agentEntryMasterService.clientFeePreApprovalEmail.filter(item => item.subCompId === this.subComponentEntry.subComponentId);
        if (this.existItem.length > 0) {
          this.existItem[0].currentAmount = this.subComponentEntry.clientFeesApproval.currentAmount;
          // alert('The Sub Component List has been already inserted');
        } else {
          if (this.agentEntryMasterService.clientAddFlag === true) {
            this.agentEntryMasterService.clientFeePreApprovalEmail.push(obj);
          }
          this.agentEntryMasterService.clientAddFlag = false;
        }
      } else {
        if ((this.componentEntry.clientFeesApproval.msp > this.componentEntry.clientFeesApproval.requestedAmount)
          && (this.componentEntry.clientFeesApproval.requestedAmount < this.componentEntry.clientFeesApproval.nrp)) {
          this.validationType = 'less than MSP and NRP';
        } else {
          this.validationType = 'less than MSP';
        }
        const obj: clientFeeApproval = {
          clientApprovalFlag: this.componentEntry.clientFeesApproval.clientApprovalFlag,
          componentId: this.componentEntry.clientFeesApproval.componentId,
          componentType: this.componentEntry.clientFeesApproval.componentType,
          componentDesc: this.componentEntry.clientFeesApproval.componentDesc,
          currentAmount: this.componentEntry.clientFeesApproval.currentAmount,
          msp: this.componentEntry.clientFeesApproval.msp,
          nrp: this.componentEntry.clientFeesApproval.nrp,
          requestedAmount: this.componentEntry.clientFeesApproval.requestedAmount,
          clientComponentId: this.componentEntry.clientFeesApproval.clientComponentId,
          requestedEffectiveDate: this.componentEntry.clientFeesApproval.requestedEffectiveDate,
          componentFeeId: this.componentEntry.clientFeesApproval.componentFeeId,
          subCompId: 0,
          fileName: '',
          comments: this.componentEntry.clientFeesApproval.requestorComments,
          validationType: this.validationType
        };
        // tslint:disable-next-line:max-line-length
        this.existItem = this.agentEntryMasterService.clientFeePreApprovalEmail.filter(item => item.componentId === this.componentEntry.componentId
        );
        if (this.existItem.length > 0) {
          this.existItem[0].currentAmount = this.componentEntry.clientFeesApproval.currentAmount;
        } else {
          if (this.agentEntryMasterService.clientAddFlag === true) {
            this.agentEntryMasterService.clientFeePreApprovalEmail.push(obj);
          }
        }
        this.agentEntryMasterService.clientAddFlag = false;
      }
    }
  }
  validationTAT() {
    if (this.documentValidation === true && this.documentTAT === true) {
      this.cont = true;
      const tatCount = Number(this.agentEntryMasterService.clientEntryForm.get('tatCount')?.value);
      this.agentEntryMasterService.componentEntryList.forEach(element1 => {
        element1.tat = Number(element1.tat);
        if (this.cont === true) {
          if (element1.tat > tatCount) {
            this.agentEntryMasterService.tatFlag = true;
            if (this.agentEntryMasterService.tatFlag === true) {
              this.dialogRef = this.dialog.open(this.checkTAT, {
                width: '510px',
                disableClose: true
              });
              return this.cont = false;
            }
          } else {
            this.agentEntryMasterService.tatFlag = false;
          }
        }
      });
    }
  }
  validationClienTAT() {
    if (this.documentValidation === true) {
      let count1 = 0;
      if (this.agentEntryMasterService.clientTATPreApprovalEmail.length > 0) {
        const value1 = this.agentEntryMasterService.tempClientTATDocumentList.length;
        if (value1 === 0) {
          this.documentTAT = false;
          this.agentEntryMasterService.documentTAT = false;
          this.documentValidationTAT = true;
          this.documentValidationTATTotal = false;
          this.dialogRef = this.dialog.open(this.clientTATDocument, {
            width: '510px',
            disableClose: true
          });
          this.agentEntryMasterService.componentEntryForm.get('componentTATDocument')?.setErrors({ incorrect: true });
          // alert('Upload the documents before Update');
          return;
        } else {
          const clientTATApprovalDou: any[] = [];
          const TempClientTATApprovalDoument: any[] = [];
          const clientTATApprovalDouComp: any[] = [];
          const TempClientTATApprovalDoumentComp: any[] = [];
          this.agentEntryMasterService.clientTATPreApprovalEmail.map(m => m.subCompId > 0 ? clientTATApprovalDou.push(m.subCompId) : '');
          // tslint:disable-next-line:max-line-length
          this.agentEntryMasterService.clientTATPreApprovalEmail.map(m => m.componentId > 0 ? clientTATApprovalDouComp.push(m.componentId) : '');
          // tslint:disable-next-line:max-line-length
          this.agentEntryMasterService.tempClientTATDocumentList.map(m => m.subComponentId > 0 ? TempClientTATApprovalDoument.push(m.subComponentId) : '');
          // tslint:disable-next-line:max-line-length
          this.agentEntryMasterService.tempClientTATDocumentList.map(m => m.componentId > 0 ? TempClientTATApprovalDoumentComp.push(m.componentId) : '');


          // tslint:disable-next-line:no-shadowed-variable
          this.agentEntryMasterService.clientTATPreApprovalEmail.forEach(element => {
            if (element.subCompId > 0) {
              // if (this.agentEntryMasterService.tempClientTATDocumentList.some(e => e.subComponentId
              //   !== element.subCompId && e.document)) {
              //   this.cnt++;
              // }
              if (TempClientTATApprovalDoument.indexOf(element.subCompId) === -1) {
                count1++;
              }
            }

            if (element.componentId && element.subCompId === 0) {
              // tslint:disable-next-line:no-unused-expression
              if (TempClientTATApprovalDoumentComp.indexOf(element.componentId) === -1) {
                count1++;
              }

            }
          });
        }
        if (count1 > 0) {
          this.documentTAT = false;
          this.agentEntryMasterService.documentTAT = false;
          this.documentValidationTATTotal = true;
          this.documentValidationTAT = false;
          // alert('Upload Files for all the components in the Service dropdownlist');
          this.dialogRef = this.dialog.open(this.clientTATDocument, {
            width: '510px',
            disableClose: true
          });
          this.agentEntryMasterService.componentEntryForm.get('componentTATDocument')?.setErrors({ incorrect: true });
          return;
        } else {
          this.documentTAT = true;
          this.agentEntryMasterService.documentTAT = true;
        }
      }
    }

  }
  validationClienFee() {
    let count = 0;
    if (this.agentEntryMasterService.clientFeePreApprovalEmail.length > 0) {
      const value1 = this.agentEntryMasterService.tempClientFeeDocumentList.length;
      if (value1 === 0) {
        this.documentValidation = false;
        this.agentEntryMasterService.documentValidation = false;
        this.documentValidationFees = true;
        this.documentValidationFeesTotal = false;
        this.dialogRef = this.dialog.open(this.clientFeeDocument, {
          width: '510px',
          disableClose: true
        });
        this.agentEntryMasterService.componentEntryForm.get('componentFeeDocument')?.setErrors({ incorrect: true });
        // alert('Upload the documents before Update');
        return;
      } else {
        const clientFeeApprovalDou: any[] = [];
        const TempClientFeeApprovalDoument: any[] = [];
        const clientFeeApprovalDouComp: any[] = [];
        const TempClientFeeApprovalDoumentComp: any[] = [];
        this.agentEntryMasterService.clientFeePreApprovalEmail.map(m => m.subCompId > 0 ? clientFeeApprovalDou.push(m.subCompId) : '');
        // tslint:disable-next-line:max-line-length
        this.agentEntryMasterService.clientFeePreApprovalEmail.map(m => m.componentId > 0 ? clientFeeApprovalDouComp.push(m.componentId) : '');
        // tslint:disable-next-line:max-line-length
        this.agentEntryMasterService.tempClientFeeDocumentList.map(m => m.subComponentId > 0 ? TempClientFeeApprovalDoument.push(m.subComponentId) : '');
        // tslint:disable-next-line:max-line-length
        this.agentEntryMasterService.tempClientFeeDocumentList.map(m => m.componentId > 0 ? TempClientFeeApprovalDoumentComp.push(m.componentId) : '');


        // tslint:disable-next-line:no-shadowed-variable
        this.agentEntryMasterService.clientFeePreApprovalEmail.forEach(element => {
          if (element.subCompId > 0) {
            // if (this.agentEntryMasterService.tempClientFeeDocumentList.some(e => e.subComponentId
            //   !== element.subCompId && e.document)) {
            //   this.cnt++;
            // }
            if (TempClientFeeApprovalDoument.indexOf(element.subCompId) === -1) {
              count++;
            }
          }

          if (element.componentId && element.subCompId === 0) {
            // tslint:disable-next-line:no-unused-expression
            if (TempClientFeeApprovalDoumentComp.indexOf(element.componentId) === -1) {
              count++;
            }

          }
        });
      }
      if (count > 0) {
        this.documentValidation = false;
        this.agentEntryMasterService.documentValidation = false;
        this.documentValidationFeesTotal = true;
        this.documentValidationFees = false;
        // alert('Upload Files for all the components in the Service dropdownlist');
        this.dialogRef = this.dialog.open(this.clientFeeDocument, {
          width: '510px',
          disableClose: true
        });
        this.agentEntryMasterService.componentEntryForm.get('componentFeeDocument')?.setErrors({ incorrect: true });
        return;
      } else {
        this.documentValidation = true;
        this.agentEntryMasterService.documentValidation = true;
      }
    }
  }
  okay() {
    this.dialogRef.close();
  }
  msgAdd() {
    this.errormsg = 'Please add atleast one Component';
  }
  add() {
    const component = this.agentEntryMasterService.componentEntryForm.get('component')?.value;
    if (component) {
      const controlNames = ['component', 'componentDesc', 'fees', 'effectiveDate', 'tat', 'currency'];
      for (const ctrl in this.agentEntryMasterService.componentEntryForm.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.value) {
            if (!this.agentEntryMasterService.componentEntryForm.get(ctrl).value) {
              this.agentEntryMasterService.componentEntryForm.get(ctrl).setValidators(Validators.required);
              this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
            }
          } else {
            this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValidators(Validators.required);
            this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.updateValueAndValidity();
          }
          if (this.agentEntryMasterService.componentEntryForm.get(ctrl).valid) {
            this.agentEntryMasterService.componentEntryForm.get(ctrl).clearValidators();
            this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
          }
        }
      }
    } else {
      this.agentEntryMasterService.componentEntryForm.get('component')?.setValidators(Validators.required);
      this.agentEntryMasterService.componentEntryForm.get('component')?.updateValueAndValidity();
    }
    this.agentEntryMasterService.componentEntryForm.get('componentFeeDocument')?.setErrors(null);
    this.agentEntryMasterService.componentEntryForm.get('componentTATDocument')?.setErrors(null);
  }
  getEnable() {
    this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
    this.agentEntryMasterService.componentEntryForm.get('tat')?.enable();
    this.componentControls.selectFormGroup.get('component')?.enable();
    setTimeout(() => {
      this.agentEntryMasterService.componentEntryForm.controls.componentDesc.enable();
    }, 10);
  }
  clear() {
    const controlNames = ['component', 'componentDesc', 'fees', 'effectiveDate', 'tat', 'currency'];
    for (const ctrl in this.agentEntryMasterService.componentEntryForm.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        this.agentEntryMasterService.componentEntryForm.get(ctrl).clearValidators();
        this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
      }
    }
    this.componentControls.selectFormGroup.get('component')?.reset();
    this.agentEntryMasterService.componentEntryForm.reset();
    this.agentEntryMasterService.initComponentEntryFormGroup();
    this.getEnable();
    this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.setValue(this.maxDate);
    if (this.currencyList.length > 0) {
      const val = this.currencyList.find(x => x.currencyShortName.toLowerCase() === this.commonService.currencyInr).currencyId;
      this.agentEntryMasterService.componentEntryForm.get('currency')?.setValue(val);
      this.currencyControls.selectFormGroup.get('currency')?.setValue(val);
    }
    this.msp = 0;
    this.nrp = 0;
    this.componentEntryHeading = '';
    this.index = -1;
    // this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
  }
  reset() {
    this.agentEntryMasterService.componentEntryForm.reset();
    this.agentEntryMasterService.componentEntryForm.markAsPristine();
    this.agentEntryMasterService.componentEntryForm.clearValidators();
  }
  editDelete(data, mode: string) {
    this.index = -1;
    this.index = this.agentEntryMasterService.componentEntryList.indexOf(data);
    if (mode === 'Del') {
      if (this.index > -1) {

        const ComponentEntryN: ComponentEntry[] = this.agentEntryMasterService.componentEntryList.filter(e =>
          e.componentId === this.agentEntryMasterService.componentEntryList[this.index].componentId);
        this.agentEntryMasterService.componentEntryList.splice(this.index, 1);

        if (ComponentEntryN.length === 1) {
          this.agentEntryMasterService.clientFeePreApprovalEmail = this.agentEntryMasterService.clientFeePreApprovalEmail.filter(e =>
            e.componentId !== ComponentEntryN[0].componentId);
        }

        if (data.subCompId > 0) {
          this.agentEntryMasterService.tempClientFeeDocumentList =
            this.agentEntryMasterService.tempClientFeeDocumentList.filter(e => e.subComponentId !== data.subCompId);
          this.agentEntryMasterService.clientFeePreApprovalEmail =
            this.agentEntryMasterService.clientFeePreApprovalEmail.filter(e => e.subCompId !== data.subCompId);
          this.agentEntryMasterService.clientFeePreApprovalEmailList =
            this.agentEntryMasterService.clientFeePreApprovalEmailList.filter(e => e.subCompId !== data.subCompId);
        } else {
          this.agentEntryMasterService.tempClientFeeDocumentList =
            this.agentEntryMasterService.tempClientFeeDocumentList.filter(e => e.componentId !== data.componentId);
          this.agentEntryMasterService.clientFeePreApprovalEmail =
            this.agentEntryMasterService.clientFeePreApprovalEmail.filter(e => e.componentId !== data.componentId);
          this.agentEntryMasterService.clientFeePreApprovalEmailList =
            this.agentEntryMasterService.clientFeePreApprovalEmailList.filter(e => e.componentId !== data.componentId);

        }
      }
      this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
      this.index = -1;
    } else if (mode === 'Edit') {
      this.agentEntryMasterService.componentEntryForm.get('component')?.disable();
      this.tooltip = true;
      if (!data.isSubComponent === true) {
        this.agentEntryMasterService.componentEntryForm.patchValue({
          clientComponentId: data.clientComponentId,
          componentType: data.componentType,
          componentDesc: data.componentId,
          fees: data.fees,
          tat: data.tat,
          componentId: data.componentId,
          component: data.componentId,
          clientId: data.clientId,
          effectiveDate: data.effectiveDate,
          isSubComponent: data.isSubComponent,
          subComponentId: data.subComponentId,
          deleteDisableFlag: data.deleteDisableFlag,
          currency: data.currencyId
        });
        this.componentControls.selectFormGroup.get('component')?.setValue(data.componentId);
        this.componentDetailChange(data.componentId);
        if (data.feeDisableFlag === true) {
          this.agentEntryMasterService.componentEntryForm.get('fees')?.disable();
          this.agentEntryMasterService.componentEntryForm.get('feeChange')?.setValue(false);
        } else if (data.feeDisableFlag === false) {
          this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
          this.agentEntryMasterService.componentEntryForm.get('feeChange')?.setValue(true);
        }
        if (data.tatDisableFlag === true) {
          this.agentEntryMasterService.componentEntryForm.get('tat')?.disable();
        } else if (data.tatDisableFlag === false) {
          this.agentEntryMasterService.componentEntryForm.get('tat')?.enable();
        }
        this.componentEntry.compEditFlag = true;
        this.componentEntry.feeDisableFlag = data.feeDisableFlag;
        this.componentEntry.tatDisableFlag = data.tatDisableFlag;
      } else {
        const list = data.subComponentEntry.filter(x => x.subReportType === data.componentDesc || x.subComponentId === data.subCompId);
        // tslint:disable-next-line:no-shadowed-variable
        list.forEach((element, i) => {
          this.agentEntryMasterService.componentEntryForm.patchValue({
            clientComponentId: element.clientComponentId,
            componentType: element.componentType,
            fees: element.fees,
            tat: element.tat,
            subCompId: element.subComponentId,
            componentDesc: element.subComponentId,
            componentId: element.componentId,
            clientId: element.clientId,
            effectiveDate: data.effectiveDate,
            isSubComponent: element.isSubComponent,
            component: element.serviceId,
            deleteDisableFlag: data.deleteDisableFlag,
            currency: element.currencyId
          });
          this.componentControls.selectFormGroup.get('component')?.setValue(element.serviceId);
          this.subComponentEntry.clientComponentId = data.subComponentEntry;
          if (list[0].feeDisableFlag === true) {
            this.agentEntryMasterService.componentEntryForm.get('fees')?.disable();
            this.agentEntryMasterService.componentEntryForm.get('feeChange')?.setValue(false);
          } else if (list[0].feeDisableFlag === false) {
            this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
            this.agentEntryMasterService.componentEntryForm.get('feeChange')?.setValue(true);
          }
          if (list[0].tatDisableFlag === true) {
            this.agentEntryMasterService.componentEntryForm.get('tat')?.disable();
          } else if (list[0].tatDisableFlag === false) {
            this.agentEntryMasterService.componentEntryForm.get('tat')?.enable();
          }
        });
        this.componentDetailChange(data.componentId);
        this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.disable();
        this.subComponentEntry.compEditFlag = true;
        this.subComponentEntry.feeDisableFlag = list[0].feeDisableFlag;
        this.subComponentEntry.tatDisableFlag = list[0].tatDisableFlag;
      }
      this.componentEntry.clientComponentId = data.clientComponentId;
      this.componentEntry.active = data.active;
      // tslint:disable-next-line:align\

      this.subComponentEntry.clientComponentId = data.subComponentEntry ? data.subComponentEntry[0].clientComponentId : 0;
      this.subComponentEntry.clientSubComponentId = data.subComponentEntry ? data.subComponentEntry[0].clientSubComponentId : 0;
    }
    this.dt.reset();
  }
  checkValidValue() {
    // this.value1 = Number(this.agentEntryMasterService.clientEntryForm.get('tatCount')?.value);
    // this.value2 = Number(this.agentEntryMasterService.componentEntryForm.get('tat')?.value);
    // if (this.value2 > 0) {
    //   if (this.value1 < this.value2) {
    //     this.agentEntryMasterService.componentEntryForm.get('tat')?.setErrors({ incorrect: true });
    //   } else {
    //     this.agentEntryMasterService.componentEntryForm.get('tat')?.setErrors(null);
    //   }
    // }
  }
  checkFees() {
    const comVal = this.componentControls.selectFormGroup.get('component')?.value;
    const subVal = this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.value;
    const com = this.componentDetails.filter(e => e.serviceId === comVal);
    const fees = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
    if (fees) {
      if (com[0].isSubComponent === true) {
        this.list = com[0].subComponent;
        const sub = this.list.filter(e => (e.subComponentId === subVal) || (e.subReportType === subVal));
        this.msp = sub[0].msp;
        this.nrp = sub[0].nrp;
        this.componentEntry.componentDesc = sub[0].subReportType;
      } else {
        this.msp = com[0].msp;
        this.nrp = com[0].nrp;
        this.componentEntry.componentDesc = com[0].rptDesc;
      }
      this.componentEntry.componentType = com[0].rptType;
    }

    if (fees > 0) {
      if ((fees) && (fees < this.msp)) {
        this.componentEntry.clientFeeApprovalFlag = true;
        this.dialogRef = this.dialog.open(this.feesConfirmation, {
          width: '510px',
          disableClose: true
        });
      } else {
        this.componentEntry.clientFeesApproval = null;
        this.subComponentEntry.clientFeesApproval = null;
        this.componentEntry.clientFeeApprovalFlag = false;
      }
    }
  }
  checkTat() {
    const comVal = this.componentControls.selectFormGroup.get('component')?.value;
    const subVal = this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.value;
    const com = this.componentDetails.filter(e => e.serviceId === comVal);
    const tat = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
    if (tat) {
      if (com[0].isSubComponent === true) {
        this.list = com[0].subComponent;
        const sub = this.list.filter(e => (e.subComponentId === subVal) || (e.subReportType === subVal));
        this.tat = sub[0].tat;
      } else {
        this.tat = com[0].tat;
      }
    }
    if (tat > 0) {
      if (tat > this.tat) {
        this.agentEntryMasterService.componentEntryForm.get('tat')?.setErrors({ incorrect: true });
        // this.showTopCenter('warn', 'Failure Message', 'Add Tat Days less than or equal to Component TAT');
        // this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
      } else {
        this.agentEntryMasterService.componentEntryForm.get('tat')?.setErrors(null);
        if ((tat) && (tat < this.tat)) {
          this.dialogRef = this.dialog.open(this.tatConfirmation, {
            width: '510px',
            disableClose: true
          });
        } else {
          this.componentEntry.clientTATApproval = null;
          this.subComponentEntry.clientTATApproval = null;
        }
      }
    }
  }
  approvalFunc() {
    // if (this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.value) {
    this.agentEntryMasterService.clientAddFlag = true;
    if (this.componentEntry.isSubComponent === true) {
      this.componentEntry.clientFeesApproval = null;
      this.subComponentEntry.clientFeesApproval = this.ClientFeesApprovalVm;
      this.subComponentEntry.clientFeesApproval.clientApprovalFlag = this.flagFee;
      this.subComponentEntry.clientFeesApproval.requestedAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.subComponentEntry.clientFeesApproval.currentAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.subComponentEntry.clientFeesApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.subComponentEntry.clientFeesApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.value;
      this.subComponentEntry.clientFeesApproval.msp = this.msp;
      this.subComponentEntry.clientFeesApproval.nrp = this.nrp;
      this.subComponentEntry.clientFeesApproval.componentType = this.componentEntry.componentType;
      this.subComponentEntry.clientFeesApproval.componentDesc = this.componentEntry.componentDesc;
      this.subComponentEntry.clientFeesApproval.componentId = this.componentEntry.componentId;
      this.subComponentEntry.clientFeesApproval.clientComponentId = this.componentEntry.clientComponentId;
      this.subComponentEntry.clientFeesApproval.subComponentId = this.subComponentEntry.subComponentId;
      this.dialogRef.close();
    } else {
      this.componentEntry.clientFeesApproval = this.ClientFeesApprovalVm;
      this.componentEntry.clientFeesApproval.clientApprovalFlag = this.flagFee;
      this.componentEntry.clientFeesApproval.requestedAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.componentEntry.clientFeesApproval.currentAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.componentEntry.clientFeesApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.componentEntry.clientFeesApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.value;
      this.componentEntry.clientFeesApproval.msp = this.msp;
      this.componentEntry.clientFeesApproval.nrp = this.nrp;
      this.componentEntry.clientFeesApproval.componentType = this.componentEntry.componentType;
      this.componentEntry.clientFeesApproval.componentDesc = this.componentEntry.componentDesc;
      this.componentEntry.clientFeesApproval.componentId = this.componentEntry.componentId;
      this.componentEntry.clientFeesApproval.clientComponentId = this.componentEntry.clientComponentId;
      this.dialogRef.close();
    }
    this.agentEntryMasterService.componentEntryForm.get('feeChange')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.clearValidators();
    this.dialogRef.close();
    // console.log(this.agentEntryMasterService.clientFeePreApprovalEmail, 'this.agentEntryMasterService.clientFeePreApprovalEmail');
    // }
  }
  notapprovalFunc() {
    // if (this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.value) {
    if (this.componentEntry.isSubComponent === true) {
      this.componentEntry.clientFeesApproval = null;
      this.subComponentEntry.clientFeesApproval = this.ClientFeesApprovalVm;
      this.subComponentEntry.clientFeesApproval.clientApprovalFlag = this.flagFee;
      this.subComponentEntry.clientFeesApproval.requestedAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.subComponentEntry.clientFeesApproval.currentAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.subComponentEntry.clientFeesApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.subComponentEntry.clientFeesApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.value;
      this.subComponentEntry.clientFeesApproval.msp = this.msp;
      this.subComponentEntry.clientFeesApproval.nrp = this.nrp;
      this.subComponentEntry.clientFeesApproval.componentType = this.componentEntry.componentType;
      this.subComponentEntry.clientFeesApproval.componentDesc = this.componentEntry.componentDesc;
      this.subComponentEntry.clientFeesApproval.componentId = this.componentEntry.componentId;
      this.subComponentEntry.clientFeesApproval.clientComponentId = this.componentEntry.clientComponentId;
      if ((this.subComponentEntry.clientFeesApproval.msp > this.subComponentEntry.clientFeesApproval.requestedAmount)
        && (this.subComponentEntry.clientFeesApproval.requestedAmount < this.subComponentEntry.clientFeesApproval.nrp)) {
        this.validationType = 'less than MSP and NRP';
      } else {
        this.validationType = 'less than MSP';
      }
      const obj: clientNoFeeApprovalVm = {
        clientApprovalFlag: this.subComponentEntry.clientFeesApproval.clientApprovalFlag,
        componentId: this.subComponentEntry.clientFeesApproval.componentId,
        componentType: this.subComponentEntry.clientFeesApproval.componentType,
        componentDesc: this.subComponentEntry.clientFeesApproval.componentDesc,
        currentAmount: this.subComponentEntry.clientFeesApproval.currentAmount,
        msp: this.subComponentEntry.clientFeesApproval.msp,
        nrp: this.subComponentEntry.clientFeesApproval.nrp,
        requestedAmount: this.subComponentEntry.clientFeesApproval.requestedAmount,
        clientComponentId: this.subComponentEntry.clientFeesApproval.clientComponentId,
        subCompId: this.subComponentEntry.clientFeesApproval.subComponentId,
        loggedIn: this.authService.userdata.userId,
        validationType: this.validationType,
        comments: this.subComponentEntry.clientFeesApproval.requestorComments,
      };
      // tslint:disable-next-line:max-line-length
      this.existItem = this.agentEntryMasterService.clientFeeApprovalEmail.filter(item => item.subCompId === this.subComponentEntry.subComponentId);
      if (this.existItem.length > 0) {
        this.existItem[0].currentAmount = this.subComponentEntry.clientFeesApproval.currentAmount;
        // alert('The Sub Component List has been already inserted');
      } else {
        // this.clientFeeNoValue.push(obj);
        this.agentEntryMasterService.clientFeeApprovalEmail.push(obj);
      }

      // console.log(this.agentEntryMasterService.clientFeeApprovalEmail, 'this.agentEntryMasterService.clientFeeApprovalEmail');
      this.dialogRef.close();
    } else {
      this.componentEntry.clientFeesApproval = this.ClientFeesApprovalVm;
      this.componentEntry.clientFeesApproval.clientApprovalFlag = this.flagFee;
      this.componentEntry.clientFeesApproval.requestedAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.componentEntry.clientFeesApproval.currentAmount = this.agentEntryMasterService.componentEntryForm.get('fees')?.value;
      this.componentEntry.clientFeesApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.componentEntry.clientFeesApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.value;
      this.componentEntry.clientFeesApproval.msp = this.msp;
      this.componentEntry.clientFeesApproval.nrp = this.nrp;
      this.componentEntry.clientFeesApproval.componentType = this.componentEntry.componentType;
      this.componentEntry.clientFeesApproval.componentDesc = this.componentEntry.componentDesc;
      this.componentEntry.clientFeesApproval.componentId = this.componentEntry.componentId;
      this.componentEntry.clientFeesApproval.clientComponentId = this.componentEntry.clientComponentId;
      if ((this.componentEntry.clientFeesApproval.msp > this.componentEntry.clientFeesApproval.requestedAmount)
        && (this.componentEntry.clientFeesApproval.requestedAmount < this.componentEntry.clientFeesApproval.nrp)) {
        this.validationType = 'less than MSP and NRP';
      } else {
        this.validationType = 'less than MSP';
      }
      const obj: clientNoFeeApprovalVm = {
        clientApprovalFlag: this.componentEntry.clientFeesApproval.clientApprovalFlag,
        componentId: this.componentEntry.clientFeesApproval.componentId,
        componentType: this.componentEntry.clientFeesApproval.componentType,
        componentDesc: this.componentEntry.clientFeesApproval.componentDesc,
        currentAmount: this.componentEntry.clientFeesApproval.currentAmount,
        msp: this.componentEntry.clientFeesApproval.msp,
        nrp: this.componentEntry.clientFeesApproval.nrp,
        requestedAmount: this.componentEntry.clientFeesApproval.requestedAmount,
        clientComponentId: this.componentEntry.clientFeesApproval.clientComponentId,
        loggedIn: this.authService.userdata.userId,
        validationType: this.validationType,
        subCompId: 0,
        comments: this.componentEntry.clientFeesApproval.requestorComments
      };
      // tslint:disable-next-line:max-line-length
      this.existItem = this.agentEntryMasterService.clientFeeApprovalEmail.filter(item => item.componentId === this.componentEntry.componentId);
      if (this.existItem.length > 0) {
        this.existItem[0].currentAmount = this.componentEntry.clientFeesApproval.currentAmount;
      } else {
        // this.clientFeeNoValue.push(obj);
        this.agentEntryMasterService.clientFeeApprovalEmail.push(obj);
      }

      this.dialogRef.close();
    }
    this.agentEntryMasterService.componentEntryForm.get('feeChange')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.clearValidators();
    this.dialogRef.close();
    // }
  }
  saveTAT() {
    const controlNames = ['TATChange', 'requestorCommentsTAT'];
    for (const ctrl in this.agentEntryMasterService.componentEntryForm.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!this.agentEntryMasterService.componentEntryForm.get(ctrl).value) {
          this.agentEntryMasterService.componentEntryForm.get(ctrl).markAsTouched();
          this.agentEntryMasterService.componentEntryForm.get(ctrl).setValidators(Validators.required);
          this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
        }
      } else {
        this.agentEntryMasterService.componentEntryForm.get(ctrl).clearValidators();
        this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
      }
    }
    this.flagTAT = this.agentEntryMasterService.componentEntryForm.get('TATChange')?.value;
    if (this.agentEntryMasterService.componentEntryForm.get('TATChange')?.valid
      && this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.valid) {
      if (this.flagTAT === true) {
        this.docUpload();
      }
      if (this.flagTAT === false) {
        this.mailSend();
      }
    }
  }
  docUpload() {
    this.agentEntryMasterService.clientAddFlagTAT = true;
    if (this.componentEntry.isSubComponent === true) {
      this.componentEntry.clientTATApproval = null;
      this.subComponentEntry.clientTATApproval = this.clientTATApproval;
      this.subComponentEntry.clientTATApproval.clientApprovalFlag = this.flagTAT;
      this.subComponentEntry.clientTATApproval.originalTAT = this.tat;
      this.subComponentEntry.clientTATApproval.requestedTAT = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
      this.subComponentEntry.clientTATApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.subComponentEntry.clientTATApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.value;
      this.subComponentEntry.clientTATApproval.componentId = this.componentEntry.componentId;
      this.subComponentEntry.clientTATApproval.clientComponentId = this.componentEntry.clientComponentId;
      this.subComponentEntry.clientTATApproval.subComponentId = this.subComponentEntry.subComponentId;
      this.dialogRef.close();
    } else {
      this.componentEntry.clientTATApproval = this.clientTATApproval;
      this.componentEntry.clientTATApproval.clientApprovalFlag = this.flagTAT;
      this.componentEntry.clientTATApproval.originalTAT = this.tat;
      this.componentEntry.clientTATApproval.requestedTAT = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
      this.componentEntry.clientTATApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.componentEntry.clientTATApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.value;
      this.componentEntry.clientTATApproval.componentId = this.componentEntry.componentId;
      this.componentEntry.clientTATApproval.clientComponentId = this.componentEntry.clientComponentId;
      this.dialogRef.close();
    }
    this.agentEntryMasterService.componentEntryForm.get('TATChange')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.clearValidators();
    this.dialogRef.close();
  }
  mailSend() {
    this.agentEntryMasterService.clientAddFlagTAT = true;
    if (this.componentEntry.isSubComponent === true) {
      this.componentEntry.clientTATApproval = null;
      this.subComponentEntry.clientTATApproval = this.clientTATApproval;
      this.subComponentEntry.clientTATApproval.clientApprovalFlag = this.flagTAT;
      this.subComponentEntry.clientTATApproval.originalTAT = this.tat;
      this.subComponentEntry.clientTATApproval.requestedTAT = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
      this.subComponentEntry.clientTATApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.subComponentEntry.clientTATApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.value;
      this.subComponentEntry.clientTATApproval.componentId = this.componentEntry.componentId;
      this.subComponentEntry.clientTATApproval.clientComponentId = this.componentEntry.clientComponentId;
      this.subComponentEntry.clientTATApproval.subComponentId = this.subComponentEntry.subComponentId;

      const obj: ClientNoTatApprovalVm = {
        componentId: this.subComponentEntry.clientTATApproval.componentId,
        componentType: this.componentEntry.componentType,
        componentDesc: this.componentEntry.componentDesc,
        requestedTAT: this.subComponentEntry.clientTATApproval.requestedTAT,
        originalTAT: this.subComponentEntry.clientTATApproval.originalTAT,
        clientComponentId: this.subComponentEntry.clientTATApproval.clientComponentId,
        subCompId: this.subComponentEntry.clientTATApproval.subComponentId,
        comments: this.subComponentEntry.clientTATApproval.requestorComments,
        requestedEffectiveDate: this.subComponentEntry.clientTATApproval.requestedEffectiveDate,
        clientApprovalFlag: this.subComponentEntry.clientTATApproval.clientApprovalFlag,
      };
      // tslint:disable-next-line:max-line-length
      this.existItemTAT = this.agentEntryMasterService.clientTATApprovalEmail.filter(item => item.subCompId === this.subComponentEntry.subComponentId);
      // if (this.existItemTAT.length > 0) {
      //   this.existItemTAT[0].currentAmount = this.subComponentEntry.clientTATApproval.currentAmount;
      //   // alert('The Sub Component List has been already inserted');
      // } else {
      if (this.agentEntryMasterService.clientAddFlagTAT === true) {
        this.agentEntryMasterService.clientTATApprovalEmail.push(obj);
      }
      this.agentEntryMasterService.clientAddFlagTAT = false;

      this.dialogRef.close();
    } else {
      this.componentEntry.clientTATApproval = this.clientTATApproval;
      this.componentEntry.clientTATApproval.clientApprovalFlag = this.flagTAT;
      this.componentEntry.clientTATApproval.originalTAT = this.tat;
      this.componentEntry.clientTATApproval.requestedTAT = this.agentEntryMasterService.componentEntryForm.get('tat')?.value;
      this.componentEntry.clientTATApproval.requestedEffectiveDate =
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value;
      this.componentEntry.clientTATApproval.requestorComments =
        this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.value;
      this.componentEntry.clientTATApproval.componentId = this.componentEntry.componentId;
      this.componentEntry.clientTATApproval.clientComponentId = this.componentEntry.clientComponentId;

      const obj: ClientNoTatApprovalVm = {
        componentId: this.componentEntry.clientTATApproval.componentId,
        componentType: this.componentEntry.componentType,
        componentDesc: this.componentEntry.componentDesc,
        requestedTAT: this.componentEntry.clientTATApproval.requestedTAT,
        originalTAT: this.componentEntry.clientTATApproval.originalTAT,
        clientComponentId: this.componentEntry.clientTATApproval.clientComponentId,
        subCompId: this.componentEntry.clientTATApproval.subComponentId,
        comments: this.componentEntry.clientTATApproval.requestorComments,
        requestedEffectiveDate: this.componentEntry.clientTATApproval.requestedEffectiveDate,
        clientApprovalFlag: this.componentEntry.clientTATApproval.clientApprovalFlag,
      };
      // tslint:disable-next-line:max-line-length
      this.existItemTAT = this.agentEntryMasterService.clientTATApprovalEmail.filter(item => item.subCompId === this.subComponentEntry.subComponentId);
      // if (this.existItemTAT.length > 0) {
      //   this.existItemTAT[0].currentAmount = this.subComponentEntry.clientTATApproval.currentAmount;
      //   // alert('The Sub Component List has been already inserted');
      // } else {
      if (this.agentEntryMasterService.clientAddFlagTAT === true) {
        this.agentEntryMasterService.clientTATApprovalEmail.push(obj);
      }
      this.agentEntryMasterService.clientAddFlagTAT = false;

      this.dialogRef.close();
    }
    this.agentEntryMasterService.componentEntryForm.get('TATChange')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.clearValidators();
    this.dialogRef.close();
  }
  saveFee() {
    // if ((!this.agentEntryMasterService.componentEntryForm.get('feeChange')?.value) &&
    //   (!this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.value)) {
    //   this.agentEntryMasterService.componentEntryForm.get('feeChange')?.markAsTouched();
    //   this.agentEntryMasterService.componentEntryForm.get('feeChange')?.setValidators(Validators.required);
    //   this.agentEntryMasterService.componentEntryForm.get('feeChange')?.updateValueAndValidity();
    //   this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.markAsTouched();
    //   this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.setValidators(Validators.required);
    //   this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.updateValueAndValidity();
    // } else {
    //   this.agentEntryMasterService.componentEntryForm.get('feeChange')?.clearValidators();
    //   this.agentEntryMasterService.componentEntryForm.get('feeChange')?.updateValueAndValidity();
    //   this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.clearValidators();
    //   this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.updateValueAndValidity();
    // }

    const controlNames = ['feeChange', 'requestorComments'];
    for (const ctrl in this.agentEntryMasterService.componentEntryForm.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!this.agentEntryMasterService.componentEntryForm.get(ctrl).value) {
          this.agentEntryMasterService.componentEntryForm.get(ctrl).markAsTouched();
          this.agentEntryMasterService.componentEntryForm.get(ctrl).setValidators(Validators.required);
          this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
        }
      } else {
        this.agentEntryMasterService.componentEntryForm.get(ctrl).clearValidators();
        this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
      }
    }

    // tslint:disable-next-line:max-line-length
    this.flagFee = this.agentEntryMasterService.componentEntryForm.get('feeChange')?.value;
    if (this.agentEntryMasterService.componentEntryForm.get('feeChange')?.valid
      && this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.valid) {
      if (this.flagFee === true) {
        this.approvalFunc();
      }
      if (this.flagFee === false) {
        this.notapprovalFunc();
      }
    }
  }
  closeTAT() {
    this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
    this.agentEntryMasterService.componentEntryForm.get('TATChange')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('TATChange')?.updateValueAndValidity();
    this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('requestorCommentsTAT')?.updateValueAndValidity();
    this.dialogRef.close();
  }
  close() {
    this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
    // this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.setValue(null);
    this.agentEntryMasterService.componentEntryForm.get('feeChange')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('feeChange')?.updateValueAndValidity();
    this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.clearValidators();
    this.agentEntryMasterService.componentEntryForm.get('requestorComments')?.updateValueAndValidity();
    this.dialogRef.close();
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
  categoryChange(e: any) {
    this.componentId = e.componentId;
    // tslint:disable-next-line:align
    this.subCompId = e.subCompId;
  }
  categoryChangeTAT(e: any) {
    this.componentIdTAT = e.componentId;
    this.subCompIdTAT = e.subCompId;
  }
  openUploadDoc(event: any) {
    const clientFeeDocument = new ClientFeeDocumentVm();
    clientFeeDocument.approvalFeeId = 0;
    clientFeeDocument.fileName = event.target.files[0].name;
    clientFeeDocument.compFeeDocId = 0;
    clientFeeDocument.document = event.target.files[0];
    clientFeeDocument.componentId = this.componentId;
    clientFeeDocument.subComponentId = this.subCompId;
    clientFeeDocument.type = 'clientFee';
    this.componentEntry.clientFeeDocument.push(clientFeeDocument);
    this.agentEntryMasterService.clientFeeDocumentList.push(clientFeeDocument);
    this.agentEntryMasterService.tempClientFeeDocumentList.push(clientFeeDocument);
    this.saveClientFeeDocument();
  }
  openUploadDocTAT(event: any) {
    const clientTatDocument = new ClientTATDocumentVm();
    clientTatDocument.approvalTATId = 0;
    clientTatDocument.fileName = event.target.files[0].name;
    clientTatDocument.compTATDocId = 0;
    clientTatDocument.document = event.target.files[0];
    clientTatDocument.componentId = this.componentIdTAT;
    clientTatDocument.subComponentId = this.subCompIdTAT;
    clientTatDocument.type = 'clientTAT';
    this.componentEntry.clientTATDocument.push(clientTatDocument);
    this.agentEntryMasterService.clientTATDocumentList.push(clientTatDocument);
    this.agentEntryMasterService.tempClientTATDocumentList.push(clientTatDocument);
    this.saveClientTATDocument();
  }
  saveClientTATDocument() {
    this.dupClientTATList =
      this.agentEntryMasterService.clientTATPreApprovalEmail.filter(e => e.subCompId === this.subCompIdTAT &&
        e.componentId === this.componentIdTAT);
    this.dupClientTATList.forEach(ele => {
      const tempClientTATApproval = new ClientTATApproval();
      tempClientTATApproval.componentDesc = ele.componentDesc;
      tempClientTATApproval.componentType = ele.componentType;
      tempClientTATApproval.originalTAT = ele.originalTAT;
      tempClientTATApproval.requestedTAT = ele.requestedTAT;
      tempClientTATApproval.componentId = ele.componentId;
      tempClientTATApproval.subCompId = ele.subCompId;
      tempClientTATApproval.fileName = this.agentEntryMasterService.clientTATDocumentList[0].fileName;
      this.agentEntryMasterService.clientTATPreApprovalEmailList.push(tempClientTATApproval);
    });
    this.agentEntryMasterService.clientTATDocumentList = [];
    this.dupClientTATList = [];
  }
  saveClientFeeDocument() {
    this.dupClientFeeList =
      this.agentEntryMasterService.clientFeePreApprovalEmail.filter(e => e.subCompId === this.subCompId &&
        e.componentId === this.componentId);
    this.dupClientFeeList.forEach(ele => {
      const tempClientFeeApproval = new clientFeeApproval();
      tempClientFeeApproval.componentDesc = ele.componentDesc;
      tempClientFeeApproval.componentType = ele.componentType;
      tempClientFeeApproval.msp = ele.msp;
      tempClientFeeApproval.nrp = ele.nrp;
      tempClientFeeApproval.requestedAmount = ele.requestedAmount;
      tempClientFeeApproval.componentId = ele.componentId;
      tempClientFeeApproval.subCompId = ele.subCompId;
      tempClientFeeApproval.fileName = this.agentEntryMasterService.clientFeeDocumentList[0].fileName;
      this.agentEntryMasterService.clientFeePreApprovalEmailList.push(tempClientFeeApproval);
    });
    this.agentEntryMasterService.clientFeeDocumentList = [];
    this.dupClientFeeList = [];
    // this.agentEntryMasterService.clientFeePreApprovalEmail = [];
    // console.log(this.agentEntryMasterService.clientFeePreApprovalEmailList, 'clientappppp');
  }
  removeDocumentTAT(index: any) {
    this.agentEntryMasterService.tempClientTATDocumentList.splice(index, 1);
    this.agentEntryMasterService.clientTATPreApprovalEmailList.splice(index, 1);
  }
  removeDocument(index: any) {
    // this.agentEntryMasterService.clientFeeDocumentList.splice(index, 1);
    this.agentEntryMasterService.tempClientFeeDocumentList.splice(index, 1);
    this.agentEntryMasterService.clientFeePreApprovalEmailList.splice(index, 1);
    // this.agentEntryMasterService.agreementDetailsForm.removeControl('componentFeeDocument');
  }
  editDeleteClientFee(data: any) {
    this.index = this.agentEntryMasterService.clientFeePreApprovalEmailList.indexOf(data);
    if (this.index > -1) {
      this.agentEntryMasterService.clientFeePreApprovalEmailList.splice(this.index, 1);
    }
  }
  openConfirmDialog(data): void {
    this.data = data;
    // if (data.deleteDisableFlag === false) {
    this.dialogRef = this.dialog.open(this.clientComponentPopUp, {
      width: '320px',
      disableClose: true
    });
    // }
  }
  dialogClose() {
    this.dialogRef.close();
  }
  effectiveDateChange() {
    const maxDate = this.datepipe.transform(this.maxDate, 'yyyy/MM/dd');
    const effectiveDate = this.datepipe.transform(this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.value, 'yyyy/MM/dd');
    if (effectiveDate > maxDate) {
      // tslint:disable-next-line:object-literal-key-quotes
      this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.setErrors({ 'incorrect': true });
    } else {
      this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.setErrors(null);
    }
  }
  removeClientComponent() {
    this.index = -1;
    this.index = this.agentEntryMasterService.componentEntryList.indexOf(this.data);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.agentEntryMasterService.componentEntryList.length; i++) {
      if (this.agentEntryMasterService.componentEntryList[i].subComponentEntry) {
        // tslint:disable-next-line:max-line-length
        const checklist = this.agentEntryMasterService.componentEntryList[i].subComponentEntry.filter(x => x.subComponentId === this.data.subCompId);
        if (checklist.length > 0) {
          checklist[0].active = false;
        }
      }
    }

    if (this.index > -1) {
      const ComponentEntryN: ComponentEntry[] = this.agentEntryMasterService.componentEntryList.filter(e =>
        e.componentId === this.agentEntryMasterService.componentEntryList[this.index].componentId);
      this.agentEntryMasterService.componentEntryList.splice(this.index, 1);

      if (ComponentEntryN.length === 1) {
        this.agentEntryMasterService.clientFeePreApprovalEmail = this.agentEntryMasterService.clientFeePreApprovalEmail.filter(e =>
          e.componentId !== ComponentEntryN[0].componentId);
        this.agentEntryMasterService.clientTATPreApprovalEmail = this.agentEntryMasterService.clientTATPreApprovalEmail.filter(e =>
          e.componentId !== ComponentEntryN[0].componentId);
      }
      if (this.data.subCompId > 0) {
        this.agentEntryMasterService.tempClientFeeDocumentList =
          this.agentEntryMasterService.tempClientFeeDocumentList.filter(e => e.subComponentId !== this.data.subCompId);
        this.agentEntryMasterService.clientFeePreApprovalEmail =
          this.agentEntryMasterService.clientFeePreApprovalEmail.filter(e => e.subCompId !== this.data.subCompId);
        this.agentEntryMasterService.clientFeePreApprovalEmailList =
          this.agentEntryMasterService.clientFeePreApprovalEmailList.filter(e => e.subCompId !== this.data.subCompId);

        this.agentEntryMasterService.tempClientTATDocumentList =
          this.agentEntryMasterService.tempClientTATDocumentList.filter(e => e.subComponentId !== this.data.subCompId);
        this.agentEntryMasterService.clientTATPreApprovalEmail =
          this.agentEntryMasterService.clientTATPreApprovalEmail.filter(e => e.subCompId !== this.data.subCompId);
        this.agentEntryMasterService.clientTATPreApprovalEmailList =
          this.agentEntryMasterService.clientTATPreApprovalEmailList.filter(e => e.subCompId !== this.data.subCompId);

      } else {
        this.agentEntryMasterService.tempClientFeeDocumentList =
          this.agentEntryMasterService.tempClientFeeDocumentList.filter(e => e.componentId !== this.data.componentId);
        this.agentEntryMasterService.clientFeePreApprovalEmail =
          this.agentEntryMasterService.clientFeePreApprovalEmail.filter(e => e.componentId !== this.data.componentId);
        this.agentEntryMasterService.clientFeePreApprovalEmailList =
          this.agentEntryMasterService.clientFeePreApprovalEmailList.filter(e => e.componentId !== this.data.componentId);

        this.agentEntryMasterService.tempClientTATDocumentList =
          this.agentEntryMasterService.tempClientTATDocumentList.filter(e => e.componentId !== this.data.componentId);
        this.agentEntryMasterService.clientTATPreApprovalEmail =
          this.agentEntryMasterService.clientTATPreApprovalEmail.filter(e => e.componentId !== this.data.componentId);
        this.agentEntryMasterService.clientTATPreApprovalEmailList =
          this.agentEntryMasterService.clientTATPreApprovalEmailList.filter(e => e.componentId !== this.data.componentId);

      }
    }
    this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
    this.dialogRef.close();
    this.index = -1;
    this.dt.reset();
  }
}
// tslint:disable-next-line:class-name
export class clientFeeApproval {
  componentFeeId: number;
  clientComponentId: number;
  componentId: number;
  currentAmount: number;
  requestedAmount: number;
  requestedEffectiveDate: Date;
  clientApprovalFlag: boolean;
  msp: number;
  nrp: number;
  componentType: string;
  componentDesc: string;
  subCompId: number;
  fileName: string;
  comments: string;
  validationType: string;
}
// tslint:disable-next-line:class-name
export class clientNoFeeApprovalVm {
  loggedIn: number;
  clientComponentId: number;
  componentId: number;
  currentAmount: number;
  requestedAmount: number;
  clientApprovalFlag: boolean;
  msp: number;
  nrp: number;
  componentType: string;
  componentDesc: string;
  subCompId: number;
  validationType: string;
  comments: string;
}
export class ClientTATApproval {
  clientComponentId: number;
  componentId: number;
  subCompId: number;
  originalTAT: number;
  requestedTAT: number;
  componentType: string;
  componentDesc: string;
  fileName: string;
  // validationType: string;
  comments: string;
}
export class ClientNoTatApprovalVm {
  // componentTATId: number;
  clientComponentId: number;
  componentId: number;
  subCompId: number;
  originalTAT: number;
  requestedTAT: number;
  requestedEffectiveDate: Date;
  comments: string;
  clientApprovalFlag: boolean;
  componentType: string;
  componentDesc: string;
  // validationType: string;
}

