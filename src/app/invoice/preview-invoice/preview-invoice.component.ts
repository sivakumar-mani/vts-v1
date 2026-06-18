import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { MessageService } from 'primeng/api';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { Table, TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { AuthService } from 'src/app/common-methods/services/auth.service';
@Component({
  standalone: false,
  selector: 'app-preview-invoice',
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.css']
})
export class PreviewInvoiceComponent implements OnInit, OnDestroy {
  // SearchCriFilter = false;
  selectedScreeningCompId: any[] = [];
  execeldata: any;
  selectedCase: any;
  // compdetail = []
  // selectedBindListcm: any[] = [];
  itemperpage;
  btnBack: boolean = false;
  @ViewChild('InvoiceCompopup', { static: true }) InvoiceCompopup;
  outputExcel: any[] = [];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  invoiceCols = [
    // { field: 'checkBox', header: 'checkBox' },
    { field: 'candidateName', header: 'Candidate Name' },
    { field: 'caseRefNo', header: 'Case Ref.No' },
    { field: 'applicantId', header: 'Applicant Id' },
    { field: 'selectedComponents', header: 'Selected Components' },
    { field: 'components', header: 'Components' },
    { field: 'reportSentOn', header: 'Report Sent on' },
    { field: 'ratePerCheck', header: 'Rate Per Check' },
    { field: 'additionalFee', header: 'Add.Fee' },
    { field: 'totalAmount', header: 'Total Amount' }
  ];
  // frozenCols = [
  //   { field: 'action', header: 'Action' },
  // ];
  // invoiceCompCols = [
  //   { field: 'componentName', header: 'Components' },
  //   { field: 'count', header: 'Count' }
  // ]
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Invoice / Un-billed Invoice Generation';
  agentvalue: any[] = [];
  sitevalue: any[] = [];
  userData: any;
  checkFlag: boolean;
  bindBilledList: any[] = [];
  selectedBindList: any[] = [];
  clientId = new UntypedFormControl(null);
  siteId = new UntypedFormControl({ value: null, disabled: true });
  groupId = new UntypedFormControl({ value: null, disabled: true });
  fromDate = new UntypedFormControl('');
  toDate = new UntypedFormControl('');
  monthly = new UntypedFormControl();
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  // enablePre = false;
  headerChecked = true;
  // tslint:disable-next-line: no-use-before-declare
  preInvoiceSearch = new PreInvoiceSearch();
  viewInvoiceRevertValue: any;
  searchValueArr: any[] = [];
  clientname = new UntypedFormControl();
  clientNameControl!: AutoCompleteDropDown;
  invoiceClientListForm: UntypedFormGroup;
  screenAuth: any = {};

  constructor(private dateP: DatePipe, public common: CommonService, public dialog: MatDialog, public invoiceService: InvoiceService,
    public messageService: MessageService, public verificationService: VerificationService, public router: Router,private auth: AuthService) { }

  ngOnInit() {
    // this.getOrganizationLogo();
    this.invoiceService.show = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.itemperpage = 50;
    this.initForGroupForAutoComplete();
    this.getInvoiceClient();
    // this.getPreInvoice();
    if (this.invoiceService.isRevertInvoice === true) {
      // Un comment by rajesh for duble calling check
      this.revertInvoiceList();
      this.breadcrumbFlags.toolTip = 'Update Invoice';
    }
  }
  revertInvoiceList() {
    let invoice = {
      clientId: this.invoiceService.viewInvoice.clientId, fromDate: this.getInvoiceDate(new Date(this.invoiceService.viewInvoice.fromDate)),
      toDate: this.getInvoiceDate(new Date(this.invoiceService.viewInvoice.toDate)), groupId: this.invoiceService.viewInvoice.groupId,
      siteId: this.invoiceService.viewInvoice.siteId, screeningId: this.invoiceService.viewInvoice.lstOfScreeningId, viewInvoice: true
    }
    invoice.groupId = invoice.groupId === 0 ? null : invoice.groupId;
    invoice.siteId = invoice.siteId === 0 ? null : invoice.siteId;
    this.viewInvoiceRevertValue = invoice;
    this.getEstimateCost(invoice);
  }
  goBack() {
    if (this.invoiceService.isRevertInvoice === true && !this.invoiceService.enablePre) {
      this.router.navigate(['/dashboard/invoice/viewInvoice']);
    } else {
      this.invoiceService.enablePre = false;
    }
  }
  getInvoiceClient() {
    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      if (res) {
        this.agentvalue = res;
      }
      this.initautoCompleteCtrl();
    });
  }
  initForGroupForAutoComplete() {
    this.invoiceClientListForm = new UntypedFormGroup({
      clientId: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    // this.clientControls = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName',
    // this.clientList, '', this.screeningForm, false, false, true);

    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.agentvalue,
      '', this.invoiceClientListForm, false, false, false, 'standard');
  }
  autocompleteData() {
    this.agentvalue = Array.from(new Map
      (this.agentvalue.map(x => ({ clientName: x.clientName }))
        .map(e => [e.clientName, e])).values());
    // this.agentvalue = Array.from(new Map
    //       (this.finalReportList.map(x => ({ this.clientId: x.clientId }))
    //         .map(e => [e.clientId, e])).values());
    this.initautoCompleteCtrl();
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
      for (const ctrl in this.invoiceClientListForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
          }
        }
      }
    }
  }
  siteName(e: any) {
    const clientId = this.invoiceClientListForm.value.clientId;
    // this.invoiceClientListForm.value.clientId= clientId;
    // if (this.clientList.length > 0 && clientId > 0) {
    //   this.mainForm.get('screening.clientName')?.setValue(this.clientList.find(f => f.clientId === clientId).clientName);
    // }
    if (clientId) {
      this.invoiceService.getInvoiceSiteOrGroup(clientId).subscribe(resp => {
        // this.sitevalue = resp;
        if (resp.group && resp.group.length > 0) {
          this.checkFlag = true;
          this.sitevalue = resp.group;
          this.groupId.enable();
          this.siteId.disable();
          this.groupId.setValidators(Validators.required);
          this.groupId.updateValueAndValidity();
          this.siteId.reset();
        } else if (resp.site && resp.site.length > 0) {
          this.checkFlag = false;
          this.sitevalue = resp.site;
          this.siteId.enable();
          this.groupId.disable();
          this.siteId.setValidators(Validators.required);
          this.siteId.updateValueAndValidity();
          this.groupId.reset();
        } else {
          this.sitevalue = [];
          this.siteId.disable();
          this.groupId.disable();
          this.siteId.reset();
          this.groupId.reset();
        }
      });
    } else {
      this.sitevalue = [];
      this.siteId.disable();
      this.groupId.disable();
    }
  }

  searchInvoice() {

    const site = (this.sitevalue.length > 0 && (this.siteId.value || this.groupId.value)) || (this.sitevalue.length === 0);
    if (this.invoiceClientListForm.value.clientId && this.fromDate.value && this.toDate.value && site) {
      this.preInvoiceSearch.clientId = this.invoiceClientListForm.value.clientId;
      this.clientId = this.invoiceClientListForm.value.clientId;
      this.preInvoiceSearch.siteId = this.siteId.value;
      this.preInvoiceSearch.groupId = this.groupId.value;
      this.preInvoiceSearch.screeningId = null;
      this.preInvoiceSearch.fromDate = this.getInvoiceDate(this.fromDate.value);
      this.preInvoiceSearch.toDate = this.getInvoiceDate(this.toDate.value);
      this.invoiceService.siteId = this.siteId.value ? this.siteId.value : 0;
      this.invoiceService.groupId = this.groupId.value ? this.groupId.value : 0;
      // this.clientId.value, this.siteId.value,
      //   this.groupId.value, new Date(this.fromDate.value).toJSON(), new Date(this.toDate.value).toJSON()
      this.getOrganizationLogo(this.invoiceClientListForm.value.clientId);
      this.getEstimateCost(this.preInvoiceSearch);
    } else {
      this.invoiceClientListForm.get('clientId')?.setValidators(Validators.required);
      this.invoiceClientListForm.get('clientId')?.updateValueAndValidity();
      this.fromDate.setValidators(Validators.required); this.fromDate.updateValueAndValidity();
      this.toDate.setValidators(Validators.required); this.toDate.updateValueAndValidity();
      this.invoiceClientListForm.markAllAsTouched(); this.fromDate.markAllAsTouched(); this.toDate.markAllAsTouched();
      !this.checkFlag === true ? this.siteId.markAllAsTouched() : this.groupId.markAllAsTouched();
      // this.showTopCenter('warn', 'Failure Message', (!site === true ? 'Select Client,' + (!this.checkFlag === true ? 'Site' : 'Group')
      //  + ' and Valid Dates' : 'Select Client and Valid Dates'));
    }
  }
  getInvoiceDate(date: any) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), new Date().getMinutes());
  }
  getEstimateCost(preInvoiceSearch: any) {
    this.invoiceService.show = true;
    this.invoiceService.getEstimateCost(preInvoiceSearch).subscribe(resp => {
      if (resp) {
        this.invoiceService.show = false;
        this.bindBilledList = resp;
        this.selectedBindList = resp;

        resp.forEach((element, i) => {
          element.firstName = element.firstName ? element.firstName : 'N/A';
          element.lastName = element.lastName ? element.lastName : '';
          element.middleName = element.middleName ? element.middleName : '';
          element.packageAmount = element.packageAmount ? element.packageAmount : 0;
          element.ratePerCheck = element.ratePerCheck ? element.ratePerCheck : 0;
          this.bindBilledList[i].ratePerCheck = element.ratePerCheck + element.packageAmount;
          this.bindBilledList[i].candidateName = element.firstName + ' ' + element.middleName + ' ' + element.lastName;
        });
        this.selectedBindList.forEach((element, i) => {
          element.componentName.forEach(cn => {
            if (cn.compChargeType === 'Individual') {            
              if(cn.subComponentFlag){
                cn.componentName =cn.componentName + '-' +cn.subComponentName
              }} else if (cn.compChargeType === 'Package') {
                if(cn.subComponentFlag){
                  cn.componentName = cn.componentName + '-' +cn.subComponentName
                }}
        });
        });
        if (this.bindBilledList && this.bindBilledList.length === 0) {
          this.showTopCenter('warn', 'Failure Message', 'No Record Found');
        }
      }
    });
  }
  //Vignesh P 08/11/2023
  //Invoice table reset after Invoice generate
  clearInvoice() {
    this.clientId =  null;
    this.siteId.reset();
    this.groupId.reset();
    this.fromDate.reset();
    this.invoiceClientListForm.reset();
    this.toDate.reset();
    this.bindBilledList = [];
    this.sitevalue = [];
    this.monthly.setValue('');
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
  getPreInvoice() {
    if (this.selectedBindList && this.selectedBindList.length > 0) {
      if (this.invoiceService.isRevertInvoice === true) {
        const selectedScreeningId = this.common.CloneObject(this.viewInvoiceRevertValue);
        selectedScreeningId.screeningId = this.selectedBindList.map(x => x.screeningId);
        this.PreInvoice(selectedScreeningId);
      } else {
        if (this.invoiceClientListForm.value.clientId && this.fromDate.value && this.toDate.value) {
          // this.clientId.value || (this.siteId.value || this.groupId.value) && this.fromDate.value && this.toDate.value
          this.preInvoiceSearch.clientId = this.invoiceClientListForm.value.clientId;
          this.preInvoiceSearch.siteId = this.siteId.value;
          this.preInvoiceSearch.groupId = this.groupId.value;
          const screeningId = this.selectedBindList.map(x => x.screeningId);
          this.preInvoiceSearch.screeningId = screeningId;
          this.preInvoiceSearch.fromDate = new Date(this.fromDate.value.getFullYear(), this.fromDate.value.getMonth(), this.fromDate.
            value.getDate(), new Date().getHours(), new Date().getMinutes());
          this.preInvoiceSearch.toDate = new Date(this.toDate.value.getFullYear(), this.toDate.value.getMonth(), this.toDate.
            value.getDate(), new Date().getHours(), new Date().getMinutes());
          // this.invoiceService.GetPreInvoice(this.clientId.value, this.siteId.value, this.groupId.value,
          //   this.selectedBindList.map(x => x.screeningId), from, to)
          this.PreInvoice(this.preInvoiceSearch);
        }
      }
    } else {
      this.showTopCenter('info', 'Failure Message', 'Select at least one Candidate to preview');
    }
  }
  PreInvoice(preInvoiceSearch: any) {
    this.invoiceService.GetPreInvoice(preInvoiceSearch)
      .subscribe((res) => {
        if (res) {
          this.invoiceService.preInvoiceValue = res;
          this.invoiceService.clientId = preInvoiceSearch.clientId;
          this.invoiceService.siteId = preInvoiceSearch.siteId;
          this.invoiceService.fromDate = preInvoiceSearch.fromDate;
          this.invoiceService.toDate = preInvoiceSearch.toDate;
          // this.router.navigate(['/dashboard/invoice/generateInvoice']);
          this.invoiceService.enablePre = true;
        }
      }, (err) => {
        console.error(err);
      }, () => {
      });
  }
  getOrganizationLogo(clientId: any) {
    this.verificationService.getOrganizationLogo(clientId).subscribe(resp => {
      if (resp) {
        this.verificationService.fileLogo = resp;
      }
    }, err => { }, () => {
      // if (this.verificationService.reportType === 'download') {
      //   this.verificationService.generatePdfDoc();
      // }
    });
  }

  SaveInvoiceGeneration() {
    // manual invoice number start
    if ((this.invoiceService.preInvoiceValue.manualInvoiceFlag === true && this.invoiceService.manualInvoiveNo.valid) ||
      this.invoiceService.preInvoiceValue.manualInvoiceFlag !== true) {
      if (this.invoiceService.isRevertInvoice === true) {
        this.invoiceService.deleteInvoiceGeneration(this.invoiceService.viewInvoice.invoiceId).subscribe(resp => {
          if (resp) {
            this.saveInvoice();
          }
        });
      } else {
        this.saveInvoice();
      }
    } else {
      // manual invoice number start
      this.showTopCenter('warn', 'Failure Message', 'Please enter valid manual invoice number');
      return;
      // manual invoice number end
    }
  }
  saveInvoice() {
    // manual invoice number end
    const invoiceGeneration: InvoiceGeneration = {
      invoiceId: 0,
      invoiceNo: '',
      fromDate: this.invoiceService.fromDate as any, // search
      toDate: this.invoiceService.toDate as any, // search
      clientId: +this.invoiceService.clientId, // search
      siteId: +this.invoiceService.siteId, // search
      groupId: +this.invoiceService.groupId, // search
      noOfQty: this.invoiceService.preInvoiceValue.getCaseCostVm.length,
      totalAmount: this.invoiceService.sumOffDatavalue.taxableValueTotal,
      iGST: this.invoiceService.sumOffDatavalue.igstAmountTotal,
      cGST: this.invoiceService.sumOffDatavalue.cgstAmountTotal,
      sGST: this.invoiceService.sumOffDatavalue.sgstAmountTotal,
      iGSTPercentage: this.invoiceService.preInvoiceValue.compWiseCostVm[0]?.igstPercentage,
      cGSTPercentage: this.invoiceService.preInvoiceValue.compWiseCostVm[0]?.cgstPercentage,
      sGSTPercentage: this.invoiceService.preInvoiceValue.compWiseCostVm[0]?.sgstPercentage,
      discount: 0, // sum
      grandTotal: this.invoiceService.sumOffDatavalue.grandTotal,
      active: true,
      deleteFlag: false,
      // manual invoice number start
      manualInvoiceNo: this.invoiceService.manualInvoiveNo.value
      // manual invoice number end
    };
    /*
    const screeningCompFeeList: ComponentFeeType[] = [];
    this.invoiceService.preInvoiceValue.componentFeeDetails.forEach(e => {
      const feeDetails: ComponentFeeType = {
        compId: e.compId,
        fee: e.fee,
        screeningCompId: e.screeningCompId,
        compChargeTypeLookUpId: e.compChargeTypeLookUpId,
        compChargeType: "",
        compName: e.compName,
        cancelRemark: '',
        statusId: 0,
        currencyType: e.currencyType,
        currencyId: e.currencyId,
        addFee: 0,
        compFee: 0,
        compFeeCurrencyType: '',
        addFeeCurrencyType: '',

      };
      screeningCompFeeList.push(feeDetails);
    });
*/
    const invoiceGenerationTransList: InvoiceGenerationTransVm[] = [];
    this.invoiceService.preInvoiceValue.compWiseCostVm.forEach(e => {
      const invoiceGenerationTrans: InvoiceGenerationTransVm = {
        invoiceDetId: 0,
        invoiceId: 0,
        compId: e.compId, // e.packageId !== null ? e.compId : 0 ,
        packageId: !e.packageId ? 0 : e.packageId,
        description: '',
        compQty: e.qty,
        ratePerUnit: !e.ratePerCheck ? 0 : e.ratePerCheck,
        additionalFee: e.additionalFee === null ? 0 : e.additionalFee,
        totalAmount: e.totalAmount,
        iGST: e.igst,
        cGST: e.cgst,
        sGST: e.sgst,
        discount: e.discount ? e.discount : 0,
        grandTotal: e.grandTotal,
        active: true,
        deleteFlag: false,
      };
      invoiceGenerationTransList.push(invoiceGenerationTrans);
    });
    const invoiceScreeningTransList: InvoiceScreeningTransVm[] = [];
    this.invoiceService.preInvoiceValue.getCaseCostVm.forEach(e => {
      const invoiceScreeningTrans: InvoiceScreeningTransVm = {
        invoiceScreeningId: 0,
        invoiceId: 0,
        screeningId: e.screeningId,  // addable
        additionalFee: e.additionalFee,
        totalAmount: e.ratePerCheck,
        iGST: e.igst === null ? 0 : e.igst,
        cGST: e.cgst === null ? 0 : e.cgst,
        sGST: e.sgst === null ? 0 : e.sgst,
        discount: 0,
        grandTotal: e.totalAmount,
        active: true,
        deleteFlag: false,
      };
      invoiceScreeningTransList.push(invoiceScreeningTrans);
    });
    const firstHtmlHeader = document.getElementById('firstHtmlHeader').innerHTML;
    const secondHtmlHeader = document.getElementById('firstHtmlHeader').innerHTML;
    // manual invoice number start
    var inputs = document.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].maxLength === 18) {
        var text = document.createTextNode(inputs[i].value);
        inputs[i].parentNode.replaceChild(text, inputs[i]);
      }
    }
    // manual invoice number end
    const htmlContent: any = document.getElementById('htmlContent').innerHTML;
    const htmlFooter = document.getElementById('htmlFooter').innerHTML;
    const generatePdfContent: GeneratePdf = {
      screeningId: 0,
      screeningCompId: 0,
      firstHtmlHeader,
      secondHtmlHeader,
      htmlContent,
      htmlFooter,
      pdfPassword: 'test',
      setPdfPassword: false,
      htmlDisclaimer: '',
      createdUserId: this.userData.userId,
    };
    const invoiceGenerationSaveVal: InvoiceGenerationSave = {
      invoiceGenerationVm: invoiceGeneration,
      invoiceGenerationTransVm: invoiceGenerationTransList,
      invoiceScreeningTransVm: invoiceScreeningTransList,
      invoiceScreeningCompTransVm: this.invoiceService.preInvoiceValue.screeningCompCost,
      //componentFeeDetails: screeningCompFeeList,

      logginId: this.userData.userId,
      generatePdf: generatePdfContent,
      active: false,
      deleteFlag: false,
      revertInvoiceFlag: this.invoiceService.isRevertInvoice,
      revertInvoiceId: this.invoiceService.isRevertInvoice === true ? this.invoiceService.viewInvoice.invoiceId : 0
    };
    this.invoiceService.SaveInvoiceGeneration(invoiceGenerationSaveVal).subscribe((res) => {
      if (res.success) {
        this.showTopCenter('success', 'Success Message', 'Invoice' + (invoiceGenerationSaveVal.revertInvoiceFlag === true ? ' Updated ' : ' Generated ') + 'Successfully');
        this.invoiceService.enablePre = false;
        this.clearInvoice();
        if (invoiceGenerationSaveVal.revertInvoiceFlag === true) {
          this.router.navigate(['/dashboard/invoice/viewInvoice']);
        }
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Invoice' + (invoiceGenerationSaveVal.revertInvoiceFlag === true ? ' Updation ' : ' Generation ') + 'Failed');
      }
    }, err => { }, () => {
    });
  }
  showall() {
    if (this.bindBilledList.length > 0) {
      this.itemperpage = this.bindBilledList.length;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  ngOnDestroy() {
    this.invoiceService.enablePre = false;
    this.invoiceService.viewInvoice = null;
    this.invoiceService.isRevertInvoice = false;
  }
  monthlyChange(event: any) {
    if (event === true) {
      const date = new Date();
      this.fromDate.setValue(new Date(date.getFullYear(), date.getMonth(), 1));
      this.toDate.setValue(new Date());
    }
    else {
      this.fromDate.setValue('');
      this.toDate.setValue('');
    }
  }
  getExcel() {
    this.execeldata = [];

    // let packremarks = '';
    if ((this.selectedBindList && this.selectedBindList.length > 0) &&
      (this.invoiceClientListForm.value.clientId && this.fromDate.value && this.toDate.value)) {
      this.outputExcel = this.selectedBindList;

      this.outputExcel.forEach((ele, i) => {
        let compName= [];
        let pcompName = [];
        let fee = [];
        let packageFee = '';
        let cmp = '';
        let feeName = '';
        let ifeeName = '';
        let ifee = [];
        let cfee = [];
        let cfeeName = '';
        let compFee: any[] = [];
        let compFeeRm = '';
        ele.componentName.forEach(cn => {
          if (cn.compChargeType === 'Individual') {            
            const cName = cn.componentName + '-' + cn.count;
            compName.push(cName);
          } else if (cn.compChargeType === 'Package') {
             const cName = cn.componentName + '-' + cn.count;
            pcompName.push(cName);
          }
        });

        if (ele !== null && ele.packageName !== null) {
          ele.packageName = ele.packageName.replace(/’/g, '&#39;');
          ele.packageName = ele.packageName.replace(/'/g, '&#39;');
          ele.packageName = ele.packageName.replace(/–/g, '&#8209;');
          ele.packageName = ele.packageName.replace(/-/g, '&#8209;');
          cmp = ele.packageName + ' [' + pcompName.join(' + ') + ']';
        }
        if (compName.length > 0) {
          cmp += (cmp ? ' + ' : '') + 'INDV {' + compName.join(' + ') + '}';
        }
        ele.componentFee.forEach(element1 => {
          if (element1.compChargeType !== 'Package' && element1.compChargeType === 'Additional Fees') {
            const curSymbol = element1.currencyType === 'INR' ? '₹' : '$'
            const adRemark = element1.feeRemark != null ? element1.feeRemark : 'Verification fee'
            const fees = element1.compName + ' - ' + adRemark + ' ' + element1.fee + ' ' + element1.currencyType;
            fee.push(fees);
          }
          // '('+element.componentName+' - Verification fee ' + element.fee + ' '+ element.currencyType +')';
          if (element1.compChargeType !== 'Package' && element1.compChargeType !== 'Additional Fees' && element1.compChargeType === 'Individual') {
            const curSymbol = element1.currencyType === 'INR' ? '₹' : '$';
            const fees = element1.fee + ' ' + element1.currencyType;
            ifee.push(fees);
          }
          //Add Component Fee Remark
          if ( element1.compChargeType === 'Component Fees') {
            const curSymbol = element1.currencyType === 'INR' ? '₹' : '$';
            const fees = element1.fee + ' ' + element1.currencyType;
            compFee.push(fees);
          }
          compFeeRm = compFee.length > 0 ? ' COMPONENT FEE{' + compFee.join(' + ') + '}' : '';
          feeName = fee.length > 0 ? ' ADDITIONAL FEE{' + fee.join(' + ') + '}' : '';

        });
        if (ifee.length > 0) {
          ifeeName = 'INDV FEE {' + ifee.join(' + ') + '}';
        }
        if (ele !== null && ele.packageName !== null) {
          ele.packageName = ele.packageName.replace(/’/g, '&#39;');
          ele.packageName = ele.packageName.replace(/'/g, '&#39;');
          ele.packageName = ele.packageName.replace(/–/g, '&#8209;');
          ele.packageName = ele.packageName.replace(/-/g, '&#8209;');
          // ele.packageDetail.packageName = ele.packageDetail.packageName.replace(/’/g, '\'');
          packageFee = ele.packageName + '[' + ele.packageAmount + ' INR]';
          // packageFee = 'Package Fee [' + ele.packageAmount + ']';
        }
        if (ele.cancelFee.length > 0) {
          ele.cancelFee.forEach(element1 => {
            const canfee = element1.fee != 0 ? element1.fee + ' ' + element1.currencyType : ''
            let fees = null;
            if(element1.statusId == this.common.STP_CHKID){
             fees = '( ' + element1.compName + ' - ' + element1.cancelRemark + '- Stop Check )';
            }else if(element1.statusId == this.common.CLBY_CLIID){
              fees = '( ' + element1.compName + ' - ' + element1.cancelRemark + '- Cancel By Client )';
            }
            cfee.push(fees);

          });
          if (cfee.length > 0) {
            cfeeName = cfee.join(' + ');
          }
        }
        //compName.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
        // pac1kremarks = feeName;
        // compName= [];
        // fee = [];
        //let remarkFee: any[] = [];

        // if (cfeeName.length <= 0) {
        //   ele.feeName = ifeeName + feeName;
        // }
        ele.feeName = ifeeName + ((ifeeName && feeName) ? ',' : '') + feeName;
        if (cfeeName.length > 0) {
          ele.feeName += ((ele.feeName) ? ',' : '') + ' C.F ' + cfeeName;
        }
        if (compFee.length > 0) {
          ele.feeName = ele.feeName + ((ele.feeName!="" && compFeeRm) ? ',' : '') + compFeeRm;
        }
        if (packageFee.length > 0) {
          ele.feeName = packageFee + ((ele.feeName) ? ',' : '') + ele.feeName;
        }
        ele.cmp = cmp;
        ele.sNo = i + 1;
        compName= [];
        pcompName = [];
        fee = [];
        cfee = [];
        ifee = [];
        cmp = '';
        ele.reportSentOn = this.dateP.transform(ele.reportSentOn, 'dd/MM/yyyy');
        ele.candidateName = ele.firstName + '' + ele.middleName + '' + ele.lastName;
        //   this.execeldata.push({
        //     'Candidate Name': ele.firstName + '' + ele.middleName + '' + ele.lastName,
        //     'Case Ref No': ele.caseRefNo,
        //     ' Applicant Id ': ele.applicantId,
        //     'Components Detail': cmp,
        //     'Individual Fee (₹)': feeName,
        //     'Additional Fee (₹)': ele.additionalFee,
        //     'Rate PerCheck (₹)': ele.ratePerCheck,
        //     'Report Sent on': ele.reportSentOn ?
        //       (this.dateP.transform(ele.reportSentOn, 'dd-MM-yyyy')) : 'N/A',
        //     'Total Amount (₹)': ele.totalAmount,
        //   });
      });
      // const ws = XLSX.utils.json_to_sheet(this.execeldata);
      // const wb: XLSX.WorkBook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, 'Estimated Cost');
      // XLSX.writeFile(wb, 'Estimated Cost.xlsx');
      const cols = [
        { field: 'sNo', header: 'S.No' },
        { field: 'caseRefNo', header: 'Case Ref Number' },
        { field: 'applicantId', header: 'Applicant Id' },
        { field: 'candidateName', header: 'Candidate Name' },
        { field: 'aaaa', header: 'Reference Name' },
        { field: 'cmp', header: 'Components Detail Package[Component :Nos+...] + Indv{Component :Nos+...}' },
        { field: 'reportSentOn', header: 'Report sent on' },
        { field: 'feeName', header: 'Remarks' },
        { field: 'ratePerCheck', header: 'Rate Per Check (Rupees)' },
        { field: 'additionalFee', header: 'Add.Fee (Rupees)' },
        { field: 'totalAmount', header: 'Total Amount (Rupees)' }
      ];

      const clientName = this.agentvalue.find(f => f.clientId === this.invoiceClientListForm.value.clientId).clientName;
      var ratePerCheckTotal = this.selectedBindList.reduce((sum, current) => sum + current.ratePerCheck,0);
      //var grandTotal = this.selectedBindList.reduce((sum, current) => sum + current.grandTotal, 0);
      var grandTotal = this.selectedBindList.reduce((sum, current) => sum + current.totalAmount, 0);
      var additionalFeeTotal = this.selectedBindList.reduce((sum, current) => sum + current.additionalFee, 0);
      this.exportToExcelInvoice(cols, this.outputExcel, clientName, true, ratePerCheckTotal ,grandTotal, additionalFeeTotal);
      // this.common.exportToExcel(cols, this.outputExcel, clientName, true);
    } else {
      this.showTopCenter('info', 'Failure Message', 'Select at least one Candidate to Estimated Export');
    }
  }

  exportToExcelInvoice(dataExcelCols, excelDataList, excelName, designFlag = false, ratePerCheckTotal ,grandTotal, additionalFeeTotal) {
    let tabtext = '<table border="1px">';
    let j = 0;
    const header = dataExcelCols;
    const filteredValue = excelDataList;
    const lines = filteredValue.length;
    let headerColos = '';
    if (lines > 0) {
      header.forEach(h => {
        if (designFlag === true) {
          headerColos = headerColos + '<th bgcolor="#a5d2db" style="font-size:15px;color:black">' + h.header + '</th>';
        } else {
          headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
        }
      });
      let  from = this.dateP.transform(this.fromDate.value, 'dd-MMM-yyyy');
      let  todate = this.dateP.transform(this.toDate.value, 'dd-MMM-yyyy');
      tabtext = tabtext + '<tr><th colspan="' + header.length + '" bgcolor="#0E4872" style="font-size:15px;color:white">Invoice Period From ' + from + ' to ' + todate + '</th> </tr > ' + ' <tr> ' + headerColos + ' </tr>';
    }
    for (j = 0; j < lines; j++) {
      headerColos = '';
      header.forEach(h => {
        headerColos = headerColos + '<td style="font-size:12px">' + (filteredValue[j][h.field] === '' ? 'N/A' : filteredValue[j][h.field]) + '</td>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    const total = '<tfoot><tr><td></td><td></td><td></td><td></td><td></td><td></td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">TOTAL AMOUNT (EXCLUDING SERVICE TAX)</td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;"></td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">' + ratePerCheckTotal + '</td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">' + additionalFeeTotal + '</td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">' + grandTotal + '</td></tr><tfoot>'
    tabtext = tabtext + total;
    tabtext = tabtext + '</table>';
    tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
    tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
    tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
    const fileName = designFlag === true ? (excelName + '.xls') : (excelName + ' List.xls');
    const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });
    if ((window.navigator as any).msSaveBlob) { // IE 10+
      (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
    } else {
      const link = document.createElement('a'); // create link download file
      link.href = window.URL.createObjectURL(exceldata); // set url for link download
      link.setAttribute('download', fileName); // set attribute for link created
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  openInvocompdialog(data: any) {
    this.selectedCase = this.common.CloneObject(data);
    // this.selectedCase.listOfComponent.listOfComponent = this.selectedCase.listOfComponent.listOfComponent.filter(x => x.compInvoiceFlag === true);
    this.selectedScreeningCompId = data.listOfComponent.listOfComponent.filter(x => x.compInvoiceFlag === true);
    const dialogRef = this.dialog.open(this.InvoiceCompopup, {
      width: '800px',
      disableClose: true
    });
  }
  selectComp() {
    if (this.selectedScreeningCompId.length > 0) {
      this.selectedCase.listOfComponent.listOfComponent.forEach(ele => {
        ele.compInvoiceFlag = false;
        this.selectedScreeningCompId.forEach(e => {
          if (ele.screeningCompId === e.screeningCompId) {
            ele.compInvoiceFlag = true;
          }
        });
      });
      this.selectedCase.listOfComponent.createdUserId = this.userData.userId;
      this.invoiceService.AddCompInvoiceFlag(this.selectedCase.listOfComponent).subscribe(resp => {
        if (resp.success) {
          this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          this.dialog.closeAll();
          this.searchInvoice();
        }
      });
    }
    else {
      this.showTopCenter('info', 'Failure Message', 'Select atleast one Component to View Invoice');
    }
  }
}

/// preInvoiceClasses

class PreInvoice {
  getCaseCostVm: CaseWiseCostVm[] = [];
  compWiseCostVm: CompWiseCostVm[] = [];
  billingClientVm: BillingClientVm;
  screeningCompCost: InvoiceScreeningCompTransVm[] = [];
  // totalAmount : number;
}

class CaseWiseCostVm {
  screeningId: number;
  clientName: string;
  caseRefNo: string;
  applicantId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  componentName: CompVm[] = [];
  reportSentOn?: Date;
  componentFee: ComponentFeeType[] = [];
  ratePerCheck?: number;
  additionalFee?: number;
  totalAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

class ComponentFeeType {
  compChargeType: string;
  fee?: number;
  /*
  compId: number;
  compName: string;
  cancelRemark: string;
  statusId: number;
  currencyType: string;
  addFee?: number;
  compFee?: number;
  compFeeCurrencyType: string;
  addFeeCurrencyType: string;
  screeningCompId: number;
  compChargeTypeLookUpId: number;
  currencyId: number;
  */
}

class CompVm {
  count: number;
  componentName: string;
}

class CompWiseCostVm {
  compId: number;
  componentName: string;
  qty: number;
  discount?: number;
  ratePerCheck?: number;
  additionalFee?: number;
  rateTotal?: number;
  totalAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  cgstPercentage?: number;
  sgstPercentage?: number;
  igstPercentage?: number;
  grandTotal?: number;
}

class BillingClientVm {
  clientName: string;
  billingName: string;
  address: CommonAddressVm;
  contact: LookUpValueVm[] = [];
  gstNo: string;
}

class LookUpValueVm {
  contactId: number;
  lookUpCatId: number;
  lookUpId?: number;
  lookUpName: string;
  active?: boolean;
  lookUpValue: string;
  lookUpDesc: string;
  displayOrder?: number;
  disabled?: boolean;
}

class CommonAddressVm {
  addressId: number;
  addTypeLookupId: number;
  addTypeLookName: string;
  addLine1: string;
  addLine2: string;
  addLine3: string;
  cityId?: number;
  city: string;
  stateId: number;
  state: string;
  countryId: number;
  districtId?: number;
  district: string;
  postalCode: string;
  place: string;
  active: boolean;
  createdUserId: number;
  locationId?: number;
  country: string;
  periodOfStay: string;
  addressTypeLookupId?: number;
  addressType: string;
}

// InvoiceGenerationSave

class InvoiceGenerationSave {
  invoiceGenerationVm: InvoiceGeneration;
  invoiceGenerationTransVm: InvoiceGenerationTransVm[] = [];
  invoiceScreeningTransVm: InvoiceScreeningTransVm[] = [];
  invoiceScreeningCompTransVm: InvoiceScreeningCompTransVm[] = [];
  //componentFeeDetails: ComponentFeeType[] = [];

  generatePdf: GeneratePdf;
  logginId: number;
  active: boolean;
  deleteFlag: boolean;
  revertInvoiceFlag = false;
  revertInvoiceId: number;
}

class InvoiceGeneration {
  invoiceId: number;
  invoiceNo: string;
  manualInvoiceNo: any;
  fromDate: Date;
  toDate: Date;
  clientId: number;
  siteId: number;
  groupId: number;
  noOfQty: number;
  totalAmount: number;
  iGST: number;
  cGST: number;
  sGST: number;
  iGSTPercentage: number;
  cGSTPercentage: number;
  sGSTPercentage: number;
  discount: number;
  grandTotal: number;
  active: boolean;
  deleteFlag: boolean;
}

class InvoiceGenerationTransVm {
  invoiceDetId: number;
  invoiceId: number;
  compId: number;
  packageId: number;
  description: string;
  compQty: number;
  ratePerUnit: number;
  additionalFee: number;
  totalAmount: number;
  iGST: number;
  cGST: number;
  sGST: number;
  discount: number;
  grandTotal: number;
  active: boolean;
  deleteFlag: boolean;

}
export class PreInvoiceSearch {
  screeningId: any;
  clientId: number;
  siteId: number;
  groupId: number;
  fromDate: any;
  toDate: any;
  viewInvoice = false;
}
class InvoiceScreeningTransVm {
  invoiceScreeningId: number;
  invoiceId: number;
  screeningId: number;
  additionalFee: number;
  totalAmount: number;
  iGST: number;
  cGST: number;
  sGST: number;
  discount: number;
  grandTotal: number;
  active: boolean;
  deleteFlag: boolean;
}

class InvoiceScreeningCompTransVm {
  invoiceScreeningDetId: number;
  invoiceScreeningId: number;
  screeningId: number;
  screeningCompId: number;
  totalAmount: number;
  additionalFee: number;
  iGST: number;
  cGST: number;
  sGST: number;
  discount: number;
  grandTotal: number;
  active: boolean;
  deleteFlag: boolean;
}

class GeneratePdf {
  screeningId: number;
  screeningCompId: number;
  firstHtmlHeader: string;
  secondHtmlHeader: string;
  htmlContent: string;
  htmlFooter: string;
  pdfPassword: string;
  setPdfPassword: boolean;
  htmlDisclaimer: string;
  createdUserId: number;
}
