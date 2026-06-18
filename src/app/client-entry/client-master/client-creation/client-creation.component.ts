import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { AgreementDocument, ClientLogoTransVm, CustomLoaDocument } from 'src/app/common-methods/models/clientEntryMaster';
import { ClientService } from 'src/app/common-methods/services/client.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { ComponentDetails, ComponentEntry, SubComponent } from 'src/app/common-methods/models/agentEntryMaster';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { Table, TableModule } from 'primeng/table';
@Component({
  standalone: false,
  selector: 'app-client-creation',
  templateUrl: './client-creation.component.html',
  styleUrls: ['./client-creation.component.css'],
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
export class ClientCreationComponent implements OnInit {
  state: string = 'default';
  cancelrmdata: any;
  settingsArray: UntypedFormArray;
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
  componentEntryHeading = null;
  iscomponentDescList = false;
  componentDescList: any[] = [];
  clientAddFlag: boolean;
  existItem: any[] = [];
  tooltip = false;
  list: any;
  msp: number;
  nrp: number;
  response: any;
  subComponentEntry = new SubComponent();
  componentDetails: ComponentDetails[] = [];
  componentEntry = new ComponentEntry();
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
  @ViewChild('dt', { static: false }) dt!: Table;
  @Input() mainForm: UntypedFormGroup;
  @Input() customLOAForm: UntypedFormGroup;
  @Input() clientForm: UntypedFormGroup;
  @Input() clientEntryForm: UntypedFormGroup;
  @Input() userData: any;
  @Input() bindData: any;
  @Input() address: any;
  @Input() insuffClientId: any;
  @Input() stepList: any;
  clientId: Number;
  clients: any[] = [];
  clientSettingsBooleanArray: any[] = [];
  flagcheck: boolean;
  componentControls!: AutoCompleteDropDown;
  insufficiencyData: any;
  componentData: any;
  workFlowData: any;
  index = -1;
  InsuffFormGroup: UntypedFormGroup;
  columnName = [
    { field: 'insuffTypeName', header: 'Insufficiency Type' },
    { field: 'compName', header: 'Component Name' },
    { field: 'subCompName', header: 'Sub Component Name' },
    { field: 'workFlowLookUpName', header: 'WorkFlow Type' }
  ];
  ;

  accManagerControls!: AutoCompleteDropDown;
  codeControls!: AutoCompleteDropDown;
  message: any;
  itemperpage: any;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  packAndCompList: any;
  sendSiteValue: any[] = [];
  htmlContent: string;
  bulkUploadDoc: any;
  entitySelection: any[] = [];
  constructor(public agentEntryMasterService: AgentEntryMasterService, private sanitizer: DomSanitizer, public dialog: MatDialog, public clientService: ClientService, public commonService: CommonService, public masterSerice: MasterService,
    public screening: ScreeningService, private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.accManagerControls = new AutoCompleteDropDown('Client Account Manager', 'clientAccountManagerId', 'userId',
      'firstName', this.bindData.accountManager, '', this.clientForm, false, false, true);
    this.codeControls = new AutoCompleteDropDown('Code', 'codeId', 'countryId',
      'phoneCode', this.commonService.countryList, '', this.clientForm, false, true, false);
    this.getEntitySolution();
    this.getInsufficiency();
    this.getComponet();
    this.getWFlow();
    this.initInsuffForm();
    this.clientForm.get('clientSettings');
  }
  // Added By Megala - For VTS2-2025-CRT-0253
  getEntitySolution() {
    this.clientService.GetEntitySelection().subscribe((res: any) => {

      if (res) {

        this.entitySelection = res;

        if (
          this.clientForm.get('companyId')?.value == null ||
          this.clientForm.get('companyId')?.value == '' ||
          this.clientForm.get('companyId')?.value == 0
        ) {

          const krsrnvl = this.entitySelection.filter(
            (f: any) =>
              f.companyName.toUpperCase() == this.commonService.KRYA_SCREENING
          );

          if (krsrnvl && krsrnvl.length > 0) {
            this.clientForm
              .get('companyId')
              ?.setValue(krsrnvl[0].companyId);
          }
        }
      }
    });
  }

  getInsufficiency() {
    this.clientService.getInsufficiency().subscribe(res => {
      if (res) {
        this.insufficiencyData = res;
      }
    });
  }
  getWFlow() {
    this.clientService.getWorkflow().subscribe(res => {
      if (res) {
        const FilterData = res.filter(x => x.workFlowName === 'DEPreQC');
        this.workFlowData = FilterData;
      }
    })
  }

  downloadDoc(data: any) {
    this.commonService.downloadDocumentFromUrl(data.filePath, data.document, data.fileName);
  }
  getComponet() {
    this.agentEntryMasterService.getComponentDetails(true).subscribe(res => {
      this.componentDetails = res;

      this.componentControls = new AutoCompleteDropDown('Component', 'componentId', 'serviceId', 'rptType', this.componentDetails,
        '', this.InsuffFormGroup, false, false, true);
    },
    );
    this.screening.getCasePackageComponent(this.insuffClientId, false, 0).subscribe(res => {
      if (res) {
        this.packAndCompList = res.component; // noOfComponent

        this.componentControls = new AutoCompleteDropDown('Component', 'componentId', 'serviceId', 'rptType', this.packAndCompList,
          '', this.InsuffFormGroup, false, false, true);
      }
    });
  }
  componentDetailChange(event: any) {
    if (event) {
      // this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValue(null);
      this.componentEntry = new ComponentEntry();
      const data: ComponentDetails = this.componentDetails.find(e => e.serviceId === event);
      this.componentEntryHeading = this.commonService.CloneObject(data.rptType);
      this.iscomponentDescList = this.commonService.CloneObject(data.isSubComponent === true);
      this.componentEntry.active = true;
      // this.abroadCompFlag = data.abroadCompFlag;
      // if (this.abroadCompFlag === true) {
      //   this.agentEntryMasterService.componentEntryForm.get('currency')?.setValue(this.currencyList.
      //     find(x => x.currencyShortName.toLowerCase() === this.commonService.currencyUsd).currencyId);
      // } else {
      //   this.agentEntryMasterService.componentEntryForm.get('currency')?.setValue(this.currencyList.
      //     find(x => x.currencyShortName.toLowerCase() === this.commonService.currencyInr).currencyId);
      // }
      this.componentEntry.clientComponentId = 0;
      this.componentEntry.isSubComponent = this.commonService.CloneObject(data.isSubComponent);
      this.componentEntry.componentDesc = this.commonService.CloneObject(data.rptDesc);
      this.componentEntry.componentType = this.commonService.CloneObject(data.rptType);
      this.componentEntry.componentId = this.commonService.CloneObject(data.serviceId);
      this.flagcheck = data.isSubComponent;
      if (!data.isSubComponent) {
        this.componentEntry.subComponentEntry = null;

        this.clientForm.get('compId')?.setValue(data.serviceId);
        this.clientForm.get('subcompId')?.setValue(data.rptDesc);
        this.clientForm.get('compId')?.disable();
        this.clientForm.get('subcompId')?.setValue(data.rptDesc);

        //this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValue(data.rptDesc);

        //this.clientForm.controls.insufficiency.get('componentDesc')?.setValue(data.rptDesc);

        // if (this.index === -1) {
        // this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(data.tat); }
        // this.checkTat();

        //this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.disable();

        //this.clientForm.controls.insufficiency.get('componentDesc')?.disable();

        // if (this.index === -1) {
        //   this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
        //   this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
        //   this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
        // }
      } else {
        // if (this.index === -1) {
        //   // this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
        //   // this.agentEntryMasterService.componentEntryForm.get('fees')?.enable();
        // }
        // if (this.componentEntry.clientComponentId > 0) {
        //   this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
        //   this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
        // }

        this.clientForm.get('compId')?.setValue(data.serviceId);
        this.clientForm.get('compId')?.disable();
        this.componentEntry.subComponentEntry = [];
        // this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.enable();

        // this.clientForm.controls.insufficiency.get('componentDesc')?.enable();

        this.subComponentEntry.clientComponentId = data.clientComponentId;
        this.subComponentEntry.active = true;

        this.componentDescList = data.subComponent;
      }
      // if (!this.componentEntry.isSubComponent) {
      //   this.existItem = this.agentEntryMasterService.componentEntryList.filter(x => x.componentId === event);
      //   if (this.existItem.length > 0 && this.index === -1) {
      //     this.showTopCenter('warn', 'Failure Message', 'Selected Component was already exists.');
      //     this.agentEntryMasterService.componentEntryForm.get('component')?.setValue(null);
      //     this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValue(null);
      //     //this.clientForm.get('subcompId')?.setValue(null);

      //     // this.clientForm.controls.insufficiency.get('component')?.setValue(null);
      //     // this.clientForm.controls.insufficiency.get('componentDesc')?.setValue(null);
      //   }
      // }
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
      // if (this.index === -1) {
      // this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(data.tat); }
      // this.checkTat();
      // if (this.index === -1) {
      //   // this.agentEntryMasterService.componentEntryForm.get('tat')?.setValue(null);
      //   this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
      // }
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
    // this.agentEntryMasterService.componentEntryForm.get('fees')?.setValue(null);
    this.matHintMethod();
  }

  bindvalue() {
    console.log(this.InsuffFormGroup)
  }
  initInsuffForm() {
    this.InsuffFormGroup = this.fb.group({
      insufficiencyTypeId: new UntypedFormControl(0),
      compId: new UntypedFormControl(),
      insuffTypeName: new UntypedFormControl(),
      workFlowLookUpName: new UntypedFormControl(),
      compName: new UntypedFormControl(),
      active: new UntypedFormControl(false),
      deleteFlag: new UntypedFormControl(false),
      workFlowName: new UntypedFormControl(),
      workFlowLookUpId: new UntypedFormControl(),
      InsuffWorkflowId: new UntypedFormControl(0),
      subCompId: new UntypedFormControl(),
      subCompName: new UntypedFormControl(),
      clientId: new UntypedFormControl(),
      clientComponentId: new UntypedFormControl(0),
      componentDesc: new UntypedFormControl(''),
      componentId: [],
      subComponentId: new UntypedFormControl(null),
      isSubComponent: new UntypedFormControl(),
    });
    // this.componentControls =  new AutoCompleteDropDown('Component', 'component', 'serviceId', 'rptType', this.componentDetails,
    //   '', this.InsuffFormGroup, false, false, true);
    this.componentControls = new AutoCompleteDropDown('Component', 'componentId', 'serviceId', 'rptType', this.packAndCompList,
      '', this.InsuffFormGroup, false, false, true);
  }
  //   initclientSettings(resp: any) {
  //     // const array = this.fb.array([]);
  //     let array = this.clientForm.get('clientSettings') as UntypedFormArray;

  //       array.push(new UntypedFormGroup({
  //         clientId: new UntypedFormControl(resp.clientId),
  //         clientSettingId: new UntypedFormControl(resp.clientSettingId),
  //         configLookupId: new UntypedFormControl(resp.configLookupId),
  //         // createdDate: new UntypedFormControl(resp.createdDate),
  //         // createdUserId: new UntypedFormControl(resp.createdUserId),
  //         // displayOrder: new UntypedFormControl(resp.displayOrder),
  //         isActive: new UntypedFormControl(resp.isActive),
  //         // isDelete: new UntypedFormControl(resp.isDelete),
  //         lookUpName: new UntypedFormControl(resp.lookUpName),
  //       }))
  //     // console.log(array)

  //     // this.clienttSettings();

  //     // return array
  // }
  getIsDisable(lookUpId): boolean {
    if (this.bindData && this.bindData.defaultClientId &&
      this.bindData.defaultClientId !== this.clientForm.get('clientId')?.value &&
      lookUpId == 600
    ) {
      return true
    }
    return false;
  }
  getClientSettings() {
    let clientArray = this.clientForm.get('clientSettings') as UntypedFormArray;
    // for (let i = 0; i < clientArray.length; i++) {
    //   this.clientSettingsBooleanArray.push({ isHide: false })
    // }

    return clientArray;
  }
  changeCheck(event, index, id) {
    let cSettings = this.clientForm.get('clientSettings') as UntypedFormArray;
    cSettings.at(index).get('isActive')?.setValue(event.checked)
    if (id == 613) { // direct app invitation if checked or unchecked
      cSettings.at(this.findIndex(614)).get('isVisible')?.setValue(event.checked); // DA
      cSettings.at(this.findIndex(615)).get('isVisible')?.setValue(event.checked); // invitation
      cSettings.at(this.findIndex(616)).get('isVisible')?.setValue(event.checked); //bgv
      cSettings.at(this.findIndex(617)).get('isVisible')?.setValue(event.checked); // doc
      cSettings.at(this.findIndex(614)).get('isActive')?.setValue(false); // DA
      cSettings.at(this.findIndex(615)).get('isActive')?.setValue(false); // invitation
      cSettings.at(this.findIndex(616)).get('isActive')?.setValue(false); //bgv
      cSettings.at(this.findIndex(617)).get('isActive')?.setValue(false);
    }
    if (id == 606) { //case
      cSettings.at(this.findIndex(607)).get('isVisible')?.setValue(event.checked); //screening
      cSettings.at(this.findIndex(607)).get('isActive')?.setValue(false);
      if (cSettings.at(this.findIndex(608)).get('isActive')?.value == true) { //scope
        cSettings.at(this.findIndex(608)).get('isActive')?.setValue(false) // scope
      }
    }
    if (id == 608) { // scope
      if (cSettings.at(this.findIndex(606)).get('isActive')?.value == true) { // case
        cSettings.at(this.findIndex(606)).get('isActive')?.setValue(false) //case
        cSettings.at(this.findIndex(607)).get('isVisible')?.setValue(false)//screening
      }
    }

  }
  findIndex(lookupid): number {
    let array = this.clientForm.get('clientSettings') as UntypedFormArray;
    let index = array.value.findIndex(val => val.configLookupId == lookupid)
    return index;
  }
  caseOrScope(event, ctrl) {
    if (event) {
      this.clientForm.get(ctrl).setValue(false);
    }
  }
  setCode(list = []) {
    this.clientForm.get('codeId')?.setValue(this.clientForm.get('address.countryId')?.value);
    this.codeControls = new AutoCompleteDropDown('Code', 'codeId', 'countryId',
      'phoneCode', list, '', this.clientForm, false, true, false);
    const country = (this.clientForm.get('address.countryId')?.value && list.length > 0) ? this.commonService.getNameById(list,
      'countryId', 'country', this.clientForm.get('address.countryId')?.value).toLowerCase() : '';
    // zip code validation
    if (country && this.clientForm.get('indianClientFlag')?.value === true) {
      !(country === this.commonService.indiaCountry) ? this.clientForm.get('address.postalCode')?.clearValidators() :
        this.clientForm.get('address.postalCode')?.setValidators([Validators.required, Validators.pattern(/^[0-9]+$/)]);
      this.clientForm.get('address.postalCode')?.updateValueAndValidity();
    }
    // gst validation
    if (country && !this.clientForm.get('siteCreationFlag')?.value === true) {
      !(country === this.commonService.indiaCountry) ? this.clientForm.get('cgstin')?.clearValidators() :
        this.clientForm.get('cgstin')?.setValidators([Validators.minLength(15), Validators.required]);
      this.clientForm.get('cgstin')?.updateValueAndValidity();
    }
  }
  getContactFormgroup() {
    return (this.clientForm.get('clientContact') as UntypedFormArray).controls;
  }
  getOwnerFormgroup() {
    return (this.clientForm.get('ownerContact') as UntypedFormArray).controls;
  }
  checkSite(event: any) {
    if (event === false) {
      this.clientForm.get('cgstin')?.setValidators([Validators.minLength(15), Validators.required]);
      this.clientForm.get('cgstin')?.updateValueAndValidity();
      if (!this.stepList.some(x => x.name === 'Client Mail Id')) {
        this.stepList.splice(4, 0, { name: 'Client Mail Id', value: 4, cls: 'icon-mail' });
      }
      if (this.clientForm.value.billingTypeId) {
        const name = this.commonService.getNameById(this.bindData.billingType, 'lookUpId', 'lookUpName',
          this.clientForm.value.billingTypeId).toLowerCase();
        if (name.includes('group') || name.includes('site')) {
          this.clientForm.get('billingTypeId')?.setValue(null);
        }
      }
    } else {
      this.clearValidation('cgstin');
      if (this.stepList.some(x => x.name === 'Client Mail Id')) {
        this.stepList.splice(4, 1);
      }
    }
    this.setCode(this.commonService.countryList);
  }
  clearValidation(ctrl: any) {
    this.clientForm.get(ctrl).clearValidators();
    this.clientForm.get(ctrl).updateValueAndValidity();
    if (ctrl == 'invoiceTitleLookupId') {
      this.clientForm.get(ctrl).setValue(0);
    } else {
      this.clientForm.get(ctrl).setValue(null);
    }

  }
  onTypeChange(value: any) {
    const ctrls = ['refNo', 'dataRetentionPolicyDays', 'applicantIdColumnName', 'address.postalCode'];
    if (value === true) {
      this.clientForm.get('formatFlag')?.enable();
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < ctrls.length; i++) {
        this.clientForm.get(ctrls[i]).setValidators(ctrls[i] === 'dataRetentionPolicyDays' ?
          [Validators.min(90), Validators.required] :
          ctrls[i] === 'applicantIdColumnName' ? [Validators.required, Validators.minLength(3)] :
            ctrls[i] === 'address.postalCode' ? [Validators.required, Validators.pattern(/^[0-9]+$/)] : Validators.required);
        this.clientForm.get(ctrls[i]).updateValueAndValidity();
      }
    } else {
      this.clientForm.get('formatFlag')?.disable();
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < ctrls.length; i++) {
        this.clearValidation(ctrls[i]);
      }
    }
    this.setCode(this.commonService.countryList);
  }
  formatChange(value: any) {
    this.accManagerControls = new AutoCompleteDropDown('Client Account Manager', 'clientAccountManagerId', 'userId',
      'firstName', this.bindData.accountManager, '', this.clientForm, false, false, true);
    if (value === true) {
      // EX: XX-XXX-
      // this.clientForm.get('refNo')?.setValidators(Validators.compose([Validators.required,
      // Validators.pattern(/^[A-Za-z]{2}[-]+[A-Za-z]{3}[-]$/), Validators.max(7)]));
      // EX: XXXXX-XXX-
      this.clientForm.get('refNo')?.setValidators(Validators.compose([Validators.required,
      Validators.pattern(/^[A-Za-z]{5}[-]+[A-Za-z]{3}[-]$/), Validators.max(10)]));
    } else {
      this.clientForm.get('refNo')?.clearValidators();
    }
    this.clientForm.get('refNo')?.updateValueAndValidity();
  }
  checkName(value, ctrl, method) {
    if (value && this.clientForm.get(ctrl).valid) {
      this.response = [];
      this.clientService[method](value, this.clientForm.get('clientId')?.value).subscribe(res => {
        this.response = res;
        if (this.response.isExist) {
          const popupData = {
            action: this.commonService.ALERT,
            bodyText: 'The provided prefix is already with the client <b>' + this.response.clientName + '</b>, please change the same'
          };
          const dialogRef = this.dialog.open(CommonAlertsComponent, {
            width: '320px',
            data: popupData,
            disableClose: true
          });
          this.clientForm.get(ctrl).setValue(null);
          this.clientForm.get(ctrl).setErrors({ incorrect: true });
        } else {
          this.clientForm.get(ctrl).setErrors(null);
        }
      });
    }
  }
  // getClient(clientId: any) {
  //   this.clientService.getClientSetting(clientId).subscribe(resp =>{
  //   this.clients = (resp);
  //   console.log(this.clients)
  //   })
  // }
  clienttSettings() {
    // this.settingsArray =   (this.clientForm.get('clientSettings') as UntypedFormArray);
    // console.log(this.settingsArray)
    return (this.clientForm.get('clientSettings') as UntypedFormArray).controls
  }
  selectTitle(value: any) {

    if (value > 0) {
      const bilType = this.bindData.billingType.filter(f => f.lookUpId == value);
      if (bilType[0].lookUpName === 'Site') {
        this.commonService.invoiceDtFlag = false;
        this.clearValidation('invoiceTitleLookupId');
        this.clearValidation('enableLutFlag');
        this.clearValidation('serviceTaxFlag');
      } else {
        this.clientForm.get('invoiceTitleLookupId')?.setValidators(Validators.required);
        this.clientForm.get('invoiceTitleLookupId')?.updateValueAndValidity();
        this.commonService.invoiceDtFlag = true;
      }
    } else {
      this.commonService.invoiceDtFlag = true;
    }
  }

  supDocTypeChange(event: any) {
    const value = this.clientForm.controls.clientLogo.value;
    if (!(this.commonService.getNameById(this.bindData.logoType, 'lookUpId', 'lookUpName', event.value)
      .includes(this.commonService.SIGNATURE_TYPE))) {
      this.clientForm.get('signatureLookUpId')?.setValue(0);
    }
  }
  openLogoDoc(event, id) {
    const acceptFlag = event.target.files[0].type.includes('image');
    const boole = id ? this.commonService.getNameById(this.bindData.logoType, 'lookUpId', 'lookUpName', id).
      includes(this.commonService.SIGNATURE_TYPE) : false;
    if (!id || (id && ((boole && !this.clientForm.get('signatureLookUpId')?.value) || (!acceptFlag === true)))) {
      this.clientService.showTopCenter('warn', 'Failure Message', 'Please Select ' + (!id ? 'Document' : boole ? 'Signature' :
        'Valid File ( Acceptable File Formats : .png, .jpg, .JPG, .jpeg, .gif, .psd, .bmp )') + ' Type');
      return;
    }
    this.uploadLogoDoc(event);
  }
  uploadLogoDoc(event: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const clientLogo: ClientLogoTransVm = {
        logoTransId: 0,
        logoDocTransId: 0,
        logoLookupId: this.clientForm.get('docType')?.value,
        isSignature: this.clientForm.get('signatureLookUpId')?.value > 0 ? true : false,
        signatureLookupId: this.clientForm.get('signatureLookUpId')?.value,
        fileName: event.target.files[i].name,
        filePath: '',
        document: event.target.files[i],
        active: true,
        loggedIn: this.userData.userId
      };
      const val = this.clientForm.controls.clientLogo.value;
      let value;
      clientLogo.isSignature === true ? value = val.filter(x => x.signatureLookupId === clientLogo.signatureLookupId).length > 0 :
        value = val.filter(x => x.logoLookupId === clientLogo.logoLookupId).length > 0;
      if (value) {
        this.clientForm.get('supportingDocument')?.setValue(null);
        this.clientService.showTopCenter('warn', 'Failure Message',
          ((clientLogo.isSignature === true ? 'Signature' : 'Document') + ' Type already exists'));
      } else {
        this.clientForm.controls.clientLogo.value.push(clientLogo);
        this.clientForm.get('clientLogo')?.setValue(this.clientForm.controls.clientLogo.value);
      }
    }
  }
  removeLogoDoc(index: any) {
    if (index > -1) {
      this.clientForm.controls.clientLogo.value.splice(index, 1);
      this.clientForm.get('clientLogo')?.setValue(this.clientForm.controls.clientLogo.value);
    }
  }
  downloadFile(data: any) {
    if (data.logoTransId > 0) {
      if (data.document) {
        this.commonService.downloadDocument(data.logoTransId, data.document, data.fileName);
      }
    } else {
      this.commonService.saveByteArray(data.fileName, data.document);
    }
  }
  preview(data: any) {
    this.rotateimg('reset');
    this.downldata = data;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.logoTransId == 0) {
        const blob = new Blob([data.document], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (data.logoTransId > 0) {
        this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + data.document);
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
  }
  downloadimg() {
    this.downloadFile(this.downldata)
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
  public deleteInsuff(index: any) {
    const popupData = {
      action: this.commonService.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this row?'
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
          if (action === this.commonService.DELETECONFIRMATION) {
            const insuffEntry = this.mainForm.get('insufficiencyWorkFlowMappingVm')?.value;
            insuffEntry[index].deleteFlag = true;
            insuffEntry[index].active = false;
            this.mainForm.get('insufficiencyWorkFlowMappingVm')?.setValue(insuffEntry);
            this.resetComponent();

          }
        }
      });
    }
  }
  addComponent() {
    this.InsuffFormGroup.get('insufficiencyTypeId')?.setValue(this.clientForm.get('insufficiencyTypeId')?.value);
    this.InsuffFormGroup.get('compId')?.setValue(this.clientForm.get('compId')?.value);
    this.InsuffFormGroup.get('workFlowLookUpId')?.setValue(this.clientForm.get('WorkFlowLookUpId')?.value);
    const insuffTypeName = this.insufficiencyData.find(x => x.lookUpId === this.clientForm.get('insufficiencyTypeId')?.value).insufficiencyTypeName;
    const wFlow = this.workFlowData.find(x => x.lookUpId === this.clientForm.get('WorkFlowLookUpId')?.value).workFlowName;
    const wFlowId = this.workFlowData.find(x => x.lookUpId === this.clientForm.get('WorkFlowLookUpId')?.value).workFlowLookUpId;
    //const Compname = this.packAndCompList.find(x =>x.compId === this.clientForm.get('compId')?.value).compName;
    this.clientForm.controls.insuffComponent.value.forEach(ele => {
      const Compname = this.packAndCompList.find(x => x.componentId === ele.componentId).compName;
      this.InsuffFormGroup.get('compId')?.setValue(ele.componentId);
      this.InsuffFormGroup.get('compName')?.setValue(Compname);
      if (ele.subCompFlag == true) {
        ele.packageSubComponent.forEach(ele1 => {
          this.InsuffFormGroup.get('subCompId')?.setValue(ele1.subCompId);
          this.InsuffFormGroup.get('subCompName')?.setValue(ele1.subCompName);
        })
      }
      this.InsuffFormGroup.get('insuffTypeName')?.setValue(insuffTypeName);
      this.InsuffFormGroup.get('workFlowLookUpName')?.setValue(wFlow);
      this.InsuffFormGroup.get('workFlowLookUpId')?.setValue(wFlowId);
      const clientid = this.clientForm.get('clientId')?.value;
      this.InsuffFormGroup.get('clientId')?.setValue(clientid);
      this.InsuffFormGroup.get('InsuffWorkflowId')?.setValue(0);
      this.InsuffFormGroup.get('active')?.setValue(true);
      this.InsuffFormGroup.get('deleteFlag')?.setValue(false);
      const insuffEntry = this.mainForm.get('insufficiencyWorkFlowMappingVm')?.value;
      const Exists = insuffEntry.filter(x => x.clientId === clientid && x.insufficiencyTypeId === this.InsuffFormGroup.get('insufficiencyTypeId')?.value
        && x.compId === this.InsuffFormGroup.get('compId')?.value && x.subCompId === this.InsuffFormGroup.get('subCompId')?.value && x.workFlowLookUpId === this.InsuffFormGroup.get('workFlowLookUpId')?.value
        && x.deleteFlag === false);
      if (Exists.length > 0) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Selected combination was already exists');
        this.resetComponent();
      } else {
        if (this.index > -1) {
          insuffEntry[this.index] = this.InsuffFormGroup.getRawValue();
        } else {
          insuffEntry.push(this.InsuffFormGroup.getRawValue());
        }
        this.mainForm.get('insufficiencyWorkFlowMappingVm')?.setValue(insuffEntry);
        this.resetComponent();
      }
    });
    this.clientService.showTopCenter('success', 'Success Message', (this.index > -1 ? 'Updated' : 'Add') + ' Successfully');
  }
  setSubCompValue(value, main, sub) {
    const val = this.commonService.CloneObject(main);
    val.packageSubComponent = [];
    val.packageSubComponent.push(sub);
    return val;
  }
  showall() {
    if (this.mainForm.get('insufficiencyWorkFlowMappingVm')?.value.length > 0) {
      this.itemperpage = this.mainForm.get('insufficiencyWorkFlowMappingVm')?.value.length;
    }
  }
  getTotalPages(totalRecords, rows) {
    //this.totalpages = Math.ceil((totalRecords) / rows);
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
  cancelDetails() {
    return ((this.clientForm.get('cancelDetails')) as UntypedFormArray
    ).controls;

  }

  addcrule() {

    let array = (this.clientForm.get('cancelDetails')) as UntypedFormArray;
    if (this.clientForm.get('cancelDetails')?.valid) {
      array.push(this.fb.group({
        cancelRuleId: new UntypedFormControl(0),
        clientId: new UntypedFormControl(this.clientForm.get('clientId')?.value, Validators.required),
        fromLookupId: new UntypedFormControl('', Validators.required),
        toLookupId: new UntypedFormControl('', Validators.required),
        fromHours: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[1-9]\d{0,2}(?:\,\d{1,3})?$/)]),
        toHours: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[1-9]\d{0,2}(?:\,\d{1,3})?$/)]),
        percentage: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[0-9]$|^[1-9][0-9]$|^(100)$/)]),
        active: new UntypedFormControl(true),
        description: new UntypedFormControl(''),
        loggedId: new UntypedFormControl(this.userData.userId)
      }))
    } else {
      this.clientForm.get('cancelDetails')?.markAllAsTouched();
    }

  }
  removecrule(i, cancelRuleId) {

    let array = (this.clientForm.get('cancelDetails')) as UntypedFormArray;
    if (array.controls[i].valid) {
      if (cancelRuleId > 0) {
        array.controls[i].get('active')?.setValue(false)
      } else if (cancelRuleId == 0) {
        array.removeAt(i);
      }
      if (array) {
        const arrayfl = array.value;
        if (arrayfl.length > 0) {
          this.cancelrmdata = arrayfl.filter(f => f.active == true)
        }
      }
    }
  }
  //Remove mantitary operation for cancel rule 
  createCrule() {
    if (this.clientForm.get("cancelDetails").value == null || this.clientForm.get("cancelDetails").value.length == 0) {
      this.clientForm.removeControl("cancelDetails")
      this.clientForm.addControl("cancelDetails", this.initcancelDVm())
    } else {
      let array = (this.clientForm.get('cancelDetails')) as UntypedFormArray;
      array.controls[0].get('active')?.setValue(true);
    }
  }
  initcancelDVm(): UntypedFormArray {

    const arr = this.fb.array([]);
    for (let i = 0; i < 1; i++) {
      arr.push(new UntypedFormGroup({
        cancelRuleId: new UntypedFormControl(0),
        clientId: new UntypedFormControl(this.clientForm.get('clientId')?.value, Validators.required),
        fromLookupId: new UntypedFormControl('', Validators.required),
        toLookupId: new UntypedFormControl('', Validators.required),
        fromHours: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[1-9]\d{0,2}(?:\,\d{1,3})?$/)]),
        toHours: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[1-9]\d{0,2}(?:\,\d{1,3})?$/)]),
        percentage: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[0-9]$|^[1-9][0-9]$|^(100)$/)]),
        active: new UntypedFormControl(true),
        description: new UntypedFormControl(''),
        loggedId: new UntypedFormControl(this.userData.userId)
      }));
    }
    return arr;

  }

  resetComponent() {
    this.index = -1;
    this.initInsuffForm();
    this.clientForm.get('insufficiencyTypeId')?.setValue(null);
    this.clientForm.get('compId')?.setValue(null);
    this.clientForm.get('WorkFlowLookUpId')?.setValue(null);
    this.clientForm.get('subcompId')?.setValue(null);
    this.clientForm.get('insuffComponent')?.setValue(null);
    this.dt.reset();
  }
  canValidation(type, i, value) {
    const canruleDts = this.clientForm.get('cancelDetails') as UntypedFormArray;
    let canruleDt = (canruleDts.value.length > 0) ? canruleDts.value.filter(f => f.active != false) : true;
    if (canruleDt.length > 0) {
      let valCandt = canruleDt;
      if (type == "fromHours" || type == "toHours" || type == "percentage") {
        for (let i = 0; i < valCandt.length; i++) {

          const j = i + 1;

          //comparision fromhr
          if (valCandt[i] != undefined) {
            if (valCandt[i].toHours != "" && valCandt[i].fromHours != "") {
              if (Number(valCandt[i].toHours) <= Number(valCandt[i].fromHours)) {
                canruleDts.controls[i].get('fromHours')?.setErrors({ comparison: true });
              } else if (valCandt[i].toHours < 999 && ((valCandt[j] == undefined) || (Number(valCandt[j].fromHours) > Number(valCandt[i].toHours)))) {
                if (canruleDts.controls[i].get('fromHours')?.errors != null && !canruleDts.controls[i].get('fromHours')?.errors.incorrect && !canruleDts.controls[i].get('fromHours')?.errors.pattern) {
                  canruleDts.controls[i].get('fromHours')?.setErrors(null);
                }
              }
            }
          }
          //fromhr preTohr
          if (valCandt[j] != undefined) {
            if (Number(valCandt[j].fromHours) <= Number(valCandt[i].toHours)) {
              canruleDts.controls[j].get('fromHours')?.setErrors({ incorrect: true });
            } else if (valCandt[i].fromHours < 999 && (Number(valCandt[i].toHours) > Number(valCandt[i].fromHours))) {
              if (canruleDts.controls[j].get('fromHours')?.errors != null && !canruleDts.controls[j].get('fromHours')?.errors.comparison && !canruleDts.controls[j].get('fromHours')?.errors.pattern) {
                canruleDts.controls[j].get('fromHours')?.setErrors(null);
              }

            }
          }
          //comparision tohrs
          if (valCandt[i] != undefined) {
            if (valCandt[i].toHours != "" && valCandt[i].fromHours != "") {
              if (Number(valCandt[i].toHours) <= Number(valCandt[i].fromHours)) {
                canruleDts.controls[i].get('toHours')?.setErrors({ incorrect: true });
              } else if (valCandt[i].toHours < 999 && !canruleDts.controls[i].get('toHours')?.errors.pattern) {
                canruleDts.controls[i].get('toHours')?.setErrors(null);
              }
            }
          }
          //percentage calculation
          if (valCandt[j] != undefined) {
            if (Number(valCandt[j].percentage) <= Number(valCandt[i].percentage)) {
              canruleDts.controls[j].get('percentage')?.setErrors({ incorrect: true });
            } else if (canruleDts.controls[j].get('percentage')?.errors != null && !canruleDts.controls[j].get('percentage')?.errors.comparision) {
              canruleDts.controls[j].get('percentage')?.setErrors(null);
            }
          }
          //percentage of 100 validation
          if (valCandt[i] != undefined) {
            if (Number(valCandt[i].percentage) > 100) {
              canruleDts.controls[i].get('percentage')?.setErrors({ comparision: true });
            } else if (canruleDts.controls[i].get('percentage')?.errors != null && !canruleDts.controls[i].get('percentage')?.errors.incorrect) {
              canruleDts.controls[i].get('percentage')?.setErrors(null);
            }
          }
        }
      }
    }
  }


  onLoaChange(value: any) {
    if (value === false) {

      this.customLOAForm.controls.customLoaDocument.get('fileName')?.clearValidators();
      this.customLOAForm.controls.customLoaDocument.get('fileName')?.updateValueAndValidity();

      //this.bulkUploadDoc = '';

      // this.customLOAForm.get('clientId')?.setValue(null);
      //this.customLOAForm.get('clientName')?.setValue(null);
      this.customLOAForm.get('fileName')?.setValue(null);
      // this.customLOAForm.get('docTypeLookupId')?.setValue(null);
      this.customLOAForm.get('docTypeLookupName')?.setValue(null);

      // this.customLOAForm.controls.customLoaDocument.get('ClientLoaId')?.setValue(null);
      // this.customLOAForm.controls.customLoaDocument.get('customLoaDocId')?.setValue(null);
      // this.customLOAForm.controls.customLoaDocument.get('documentTypeId')?.setValue(null);
      this.customLOAForm.controls.customLoaDocument.get('fileName')?.setValue(null);
      this.customLOAForm.controls.customLoaDocument.get('filePath')?.setValue(null);
      this.customLOAForm.controls.customLoaDocument.get('fileType')?.setValue(null);
    }
    else if (value === true) {
      this.customLOAForm.controls.customLoaDocument.get('fileName')?.setValidators(Validators.required);
      this.customLOAForm.controls.customLoaDocument.get('fileName')?.markAsTouched();
      this.customLOAForm.controls.customLoaDocument.get('fileName')?.updateValueAndValidity();
    }

  }
  removeDocument() {
    this.customLOAForm.controls.customLoaDocument.get('fileName')?.setValue(null);
    this.customLOAForm.controls.customLoaDocument.get('filePath')?.setValue(null);
    // this.bulkUploadDoc = '';
    // this.bulkUploadDoc = [];
  }
  openUploadDoc(event: any) {
    // this.bulkUploadDoc = '';
    const fileName = event.target.files[0].name;
    const fileExtn = fileName.split('.').pop();
    if (fileExtn === 'doc' || fileExtn === 'docx') {
      //this.bulkUploadDoc = event.target.files[0];
      this.customLOAForm.controls.customLoaDocument.get('fileName')?.setValue(event.target.files[0])
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Please upload a file with Extensions: docx,doc');
    }
    const customLoaDocument = new CustomLoaDocument();
    customLoaDocument.fileName = event.target.files[0].name;
    customLoaDocument.document = event.target.files[0];

    this.customLOAForm.get('clientId')?.setValue(this.clientForm.get('clientId')?.value);
    this.customLOAForm.get('clientName')?.setValue(this.clientForm.get('clientName')?.value);
    this.customLOAForm.get('fileName')?.setValue(customLoaDocument.fileName);
    this.customLOAForm.get('docTypeLookupId')?.setValue(this.customLOAForm.get('docTypeLookupId')?.value);
    this.customLOAForm.get('docTypeLookupName')?.setValue(this.customLOAForm.get('docTypeLookupName')?.value);
    this.customLOAForm.controls.customLoaDocument.patchValue({
      document: event.target.files[0]
    });

    this.customLOAForm.controls.customLoaDocument.get('ClientLoaId')?.setValue(this.customLOAForm.controls.customLoaDocument.get('ClientLoaId')?.value);
    this.customLOAForm.controls.customLoaDocument.get('customLoaDocId')?.setValue(this.customLOAForm.controls.customLoaDocument.get('customLoaDocId')?.value);
    this.customLOAForm.controls.customLoaDocument.get('documentTypeId')?.setValue(this.customLOAForm.controls.customLoaDocument.get('documentTypeId')?.value);
    this.customLOAForm.controls.customLoaDocument.get('fileName')?.setValue(customLoaDocument.fileName);
    this.customLOAForm.controls.customLoaDocument.get('fileType')?.setValue(fileExtn);
    this.customLOAForm.controls.customLoaDocument.get('document')?.setValue(customLoaDocument.document);

  }
}


