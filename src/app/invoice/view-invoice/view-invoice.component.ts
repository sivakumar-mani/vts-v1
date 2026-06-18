import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css'],
})
export class ViewInvoiceComponent implements OnInit {

  showdSearch = true;
  // tslint:disable-next-line:variable-name
  show_Search = true;
  viewInvoiceForm: UntypedFormGroup;
  clientControl!: AutoCompleteDropDown;
  userData: any;
  viewInvoiceList: any[] = [];
  viewInvoiceListExcel: any[] = [];
  searchValueArr: any[] = [];
  isDesc: boolean;
  column: any;
  direction: number;
  agentvalue: any[] = [];
  itemPerPage;
  page = 1;
  @ViewChild('TABLE', { static: true }) table: ElementRef;
  tabIndex = 0;
  clientNameControl!: AutoCompleteDropDown;
  invoiceNoControl!: AutoCompleteDropDown;
  clientList: any[] = [];
  invoiceNoList: any[] = [];
  routePath = 'Invoice / View Invoice';
  menubar = [{ menuName: 'View Invoice' }, { menuName: 'Generate Invoice' }];
  execeldata: any[] = [];
  // SearchCriFilter = false;
  preInvoiceSearch = new PreInvoiceSearch();
  bindBilledList: any[] = [];
  mailList: any[] = [];
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 20;
  Pagination = true;
  screenAuth: any = {};
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  constructor(public invoiceService: InvoiceService, public messageService: MessageService, public router: Router, private auth: AuthService,
    public dialog: MatDialog, public common: CommonService, private dateP: DatePipe, public screeningService: ScreeningService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.GetViewInvoiceDetails();
    this.itemPerPage = 10;


  }
  initFormGroup() {
    this.viewInvoiceForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      invoiceNo: new UntypedFormControl(null),
      fromDate: new UntypedFormControl(null),
      todate: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();

  }

  initautoCompleteCtrl() {
    this.clientNameControl = new AutoCompleteDropDown('Select Client', 'clientName', 'name', 'name', this.clientList,
      '', this.viewInvoiceForm, false, false, false, 'standard');
    this.invoiceNoControl = new AutoCompleteDropDown('Invoice Number', 'invoiceNo', 'name', 'name', this.invoiceNoList,
      '', this.viewInvoiceForm, false, false, false, 'standard');

  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.GetViewInvoiceDetails();
  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.shievePageNo = 1;
      this.shievePageSize = this.shieveTotalCount;
      this.Pagination = false;
      this.GetViewInvoiceDetails();
    }
  }
  // getInvoiceClient() {
  //   this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
  //     this.agentvalue = res;
  //     this.GetViewInvoiceDetails();
  //   });

  // }
  getClientName() {
    this.screeningService.getClients(this.userData).subscribe(res => {
      if (res) {
        this.clientList = res;
        this.initautoCompleteCtrl()
      }
    });
  }
  getInvoiceNo() {
    this.screeningService.getInvoiceNo(this.userData).subscribe(res => {
      if (res) {
        this.invoiceNoList = res;
        this.initautoCompleteCtrl()
      }
    });
  }
  preventInfinite(event: any) {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  applyPagination() {
    let filter = '';
    if (this.viewInvoiceForm.value.clientName && this.viewInvoiceForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.viewInvoiceForm.value.clientName;
    }
    if (this.viewInvoiceForm.value.invoiceNo && this.viewInvoiceForm.get('invoiceNo')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'invoiceNo@=' + this.viewInvoiceForm.value.invoiceNo;
    }
    if (this.viewInvoiceForm.value.fromDate && this.viewInvoiceForm.get('fromDate')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'fromDate>=' + new DatePipe('en-Us').transform(this.viewInvoiceForm.value.fromDate, 'yyyy-MM-dd');
    } if (this.viewInvoiceForm.value.todate && this.viewInvoiceForm.get('todate')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'todate<=' + new DatePipe('en-Us').transform(this.viewInvoiceForm.value.todate, 'yyyy-MM-dd');
    }

    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter ? filter : '';
    let sort = this.column;
    this.userData.sorts = this.direction ? this.direction == -1 ? '-' + sort : sort : '';
    this.userData.applyPaging = this.Pagination;
    this.userData.needTotal = true;
  }

  // getData(data: any) {
  //   this.invoiceService.GetInvoiceList(data.invoiceId).subscribe(res => {
  //     if (res) {
  //       const resp = res;
  //       // const preInvoiceSearch = new PreInvoiceSearch();
  //       // preInvoiceSearch.clientId = data.clientId;
  //       // preInvoiceSearch.siteId = data.siteId;
  //       // preInvoiceSearch.groupId = data.groupId;
  //       // preInvoiceSearch.fromDate = data.fromDate;
  //       // preInvoiceSearch.toDate = data.toDate;
  //       // preInvoiceSearch.screeningId = res;
  //       // this.invoiceService.getEstimateCost(preInvoiceSearch).subscribe(resp => {
  //       //   if (resp) {
  //       //     const bindBilledList = resp;
  //       //     this.exportExcel(resp);
  //       //   }
  //       // });
  //     }
  //   });
  // }
  // exportExcel(data: any) {
  //   this.execeldata = [];
  //   if (this.bindBilledList.length > 0) {
  //     // const compList = this.bindBilledList[0].listOfComponent.join(',');
  //     // const compFeeI = this.bindBilledList[0].componentFee.filter(m => m.compChargeType === 'Individual');
  //     // const feeI = compFeeI.map(x => x.fee).join('+');
  //     // const compFeeA = this.bindBilledList[0].componentFee.filter(m => m.compChargeType === 'Additional Fees');
  //     // let feeA = compFeeA.map(x => x.fee).join('+');
  //     // if (!feeA) {
  //     // feeA = 0;
  //     // }
  //     // const packfee = this.bindBilledList[0].packageName + '[' + this.bindBilledList[0].packageAmount + ' ]' + '+ '
  //     // + 'INDV' + '{' + feeI + '}' + '+' + 'A.F' + '(' + feeA + ')';
  //     // const num = compFeeI.map(x => x.fee);
  //     // let numvalue = 0;
  //     // num.forEach(element => {
  //     // numvalue = numvalue + element;
  //     // });
  //     // const ratecheck = this.bindBilledList[0].packageAmount + numvalue;
  //     let compName= [];
  //     let compList = '';
  //     let fee = [];
  //     let feeName = '';
  //     let packremarks = '';
  //     this.bindBilledList.forEach(ele => {
  //       ele.listOfComponent.forEach(element => {
  //         const cName = (element.subComponentName !== null ? element.componentName + ' - ' + element.subComponentName :
  //           element.componentName);
  //         compName.push(cName);
  //         compList = compName.map(m => m).join(',');
  //         const fees = element.feeCategory + '{' + element.fee + '}';
  //         fee.push(fees);
  //         feeName = fee.join('+');
  //       });
  //       packremarks = feeName;
  //       if (ele.packageDetail !== null) {
  //         packremarks = ele.packageDetail.packageName + '[' + ele.packageDetail.packageFee + ']' + '+' + feeName;
  //       }
  //     });

  //     this.execeldata.push({
  //       // 'S.No': i + 1,
  //       'Client Name': data.clientName,
  //       'Invoice No': data.invoiceNo,
  //       'Site/Group Name': data.siteName ? data.siteName : data.groupName,
  //       'No Of Candidate': data.noOfQty,
  //       'Components Detail': compList,
  //       // 'Report sent on' : this.dateP.transform(this.bindBilledList[0].reportSentOn, 'dd-MM-yyyy'),
  //       'Remarks ': packremarks,
  //       // 'Rate Per Check' : fee,
  //       'Add.Fee': this.bindBilledList[0].additionalFee,
  //       'Total Amount': this.bindBilledList[0].totalAmount,
  //       'Invoice Gen.on': data.created ?
  //         (this.dateP.transform(data.created, 'dd-MM-yyyy')) : 'N/A',
  //       'From Date': data.fromDate ?
  //         (this.dateP.transform(data.fromDate, 'dd-MM-yyyy')) : 'N/A',
  //       'To Date': data.toDate ?
  //         (this.dateP.transform(data.toDate, 'dd-MM-yyyy')) : 'N/A',
  //       'Grand Total': data.totalAmount,
  //     });
  //     const ws = XLSX.utils.json_to_sheet(this.execeldata);
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'View Invoice');
  //     XLSX.writeFile(wb, 'View Invoice.xlsx');
  //   } else {
  //     this.showTopCenter('warn', 'Failure Message', 'No Record Found');
  //   }
  // }
  getComponentDetails(rowdata: any) {
    this.preInvoiceSearch.clientId = rowdata.clientId;
    this.preInvoiceSearch.siteId = rowdata.siteId;
    this.preInvoiceSearch.groupId = rowdata.groupId;
    this.preInvoiceSearch.fromDate = rowdata.fromDate;
    this.preInvoiceSearch.toDate = rowdata.toDate;
    this.preInvoiceSearch.screeningId = rowdata.lstOfScreeningId;
    this.preInvoiceSearch.ViewInvoice = true;
    this.invoiceService.getInvoiceExcelDetail(rowdata.invoiceId).subscribe(resp => {
      if (resp) {
        this.bindBilledList = resp;
        // this.invoiceService.getEstimateCost(this.preInvoiceSearch).subscribe(res => {
        //   if (res) {
        //   this.bindBilledList1 = res;
        //   this.exportExcel(rowdata);
        //   }
        //   });
        this.exportExcel(rowdata);
      }
    });
  }
  // autocompleteData() {
  //   this.clientList = Array.from(new Map
  //     (this.viewInvoiceList.map(x => ({ clientName: x.clientName }))
  //       .map(e => [e.clientName, e])).values());
  //   this.invoiceNoList = Array.from(new Map
  //     (this.viewInvoiceList.map(x => ({ invoiceNo: x.invoiceNo }))
  //       .map(e => [e.invoiceNo, e])).values());
  //   this.initautoCompleteCtrl();
  // }
  GetViewInvoiceDetails() {
    this.applyPagination();
    this.invoiceService.GetInvoiceViewDetails(this.userData).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        this.viewInvoiceList = resp.body;
        this.viewInvoiceList.forEach(element => {
          element.checked = false;
        });
        this.Pagination = true;
        this.getInvoiceNo();
        this.getClientName();
      }
    });
  }
  GetViewInvoiceExcel() {
    this.Pagination = false;
    this.applyPagination();
    this.invoiceService.GetInvoiceViewDetails(this.userData).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        this.viewInvoiceListExcel = resp.body;
        this.viewInvoiceListExcel.forEach(element => {
          element.checked = false;
        });
        // this.autocompleteData();
        const column = [
          { field: 'clientName', header: 'Client Name' },
          { field: 'invoiceNo', header: 'Invoice No' },
          { field: 'siteName', header: 'Site Name' },
          { field: 'groupName', header: 'Group Name' },
          { field: 'noOfQty', header: 'No.of Candidate' },
          { field: 'fromDate', header: 'From Date' },
          { field: 'toDate', header: 'To Date' },
          { field: 'created', header: 'Inv.Gen.On' },
          { field: 'grandTotal', header: 'Grand Total' },
        ];
        this.common.exportToExcel(column, this.viewInvoiceListExcel, 'View Invoice');
      }
    });
  }
  downloadFile(doc, filename) {
    const sampleArr = this.common.base64ToArrayBuffer(doc);
    this.common.saveByteArray(filename, sampleArr);
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
      for (const ctrl in this.viewInvoiceForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  removeSearchValue(key, index) {
    // tslint:disable-next-line: forin
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.viewInvoiceForm.controls) {
      if (ctrl === key) {
        this.viewInvoiceForm.get(ctrl).setValue('');
      }
    }
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
    this.GetViewInvoiceDetails();
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(ind): number {
    if (this.viewInvoiceList.length) {
      return Math.ceil(this.viewInvoiceList.length / this.itemPerPage[ind]);
    }
  }
  toggle(data: any) {
    this.show_Search = !this.show_Search;
    if (this.show_Search) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  deleteInvoice(invoiceNo: number) {
    this.invoiceService.deleteInvoiceGeneration(invoiceNo).subscribe(res => {
      if (res) {
        this.GetViewInvoiceDetails();
        this.showTopCenter('success', 'Success Message', 'Invoice deleted successfully');
      }
    });
  }
  public openDialog(src: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      id: src,
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
            this.deleteInvoice(src);
          }
        }
      });
    }
  }
  goToRevert(viewInvoice: any) {
    this.invoiceService.isRevertInvoice = true;
    this.invoiceService.viewInvoice = viewInvoice;
    this.router.navigate(['/dashboard/invoice/previewInvoice']);
  }
  clearInvoice() {
    this.viewInvoiceForm.reset();
    this.searchValueArr = [];
    this.userData.filters = "";
    this.shievePageNo = 1;
    this.shievePageSize = 20;
    this.GetViewInvoiceDetails();
  }
  assignMail(checked, data) {
    if (checked) {
      data.checked = true;
      this.mailList.push({ invoiceId: data.invoiceId });
    } else {
      data.checked = false;
      const index = this.mailList.findIndex(x => x.invoiceId === data.invoiceId);
      if (index > -1) {
        this.mailList.splice(index, 1);
      }
    }
  }
  sendMail(data: any) {
    this.invoiceService.InvoiceMailProcess(data.clientId, data.invoiceId, this.userData.userId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Mail Sent Successfully');
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Mail not sent');
      }
    });
  }
  exportExcelAll() {
    this.shievePageNo = 1;
    this.shievePageSize = this.shieveTotalCount;
    this.GetViewInvoiceExcel();
  }
  exportExcel(data: any) {
    this.execeldata = [];
    if (this.bindBilledList.length > 0) {
      let compName= [];
      let pcompName = [];
      let compList = '';
      let fee = [];
      let ifee = [];
      let feeName = '';
      let ifeeName = '';
      let cfee = [];
      let cfeeName = '';
      let packremarks = '';
      let count = {};
      this.bindBilledList.forEach((ele, i) => {
        // Vignesh p Cancel Fee Remark Reset
        cfeeName ='';
        ele.cancelComponent.forEach(ele1 => {
          const canfee = ele1.fee > 0 ? ele1.fee + ' ' + ele1.currencyType : '';
          //Cancellation rule added vignesh p 18/10/2023
          let fees =null;
          if(ele1.statusId == this.common.STP_CHKID){
          fees = '( ' + ele1.componentName + ' - ' + ele1.cancelRemark + '- Stop Check )';
          }else if (ele1.statusId == this.common.CLBY_CLIID){
            fees = '( ' + ele1.componentName + ' - ' + ele1.cancelRemark + '- Cancel By Client )'; 
          }
          cfee.push(fees);
        });
        if (cfee.length > 0) {
          cfeeName = cfee.join(' + ');
        }

        ele.listOfComponent.forEach(cn => {
          count[i] = (count[i] || 0) + 1;
          if (cn.feeCategory === 'Individual') {
            if(cn.subCompId>0){
              cn.componentName =cn.componentName +'-'+cn.subComponentName
            }
            const cName = cn.componentName + '-' + count[i];
            compName.push(cName);
            count = {};
          } else if (cn.feeCategory === 'Package') {
            if(cn.subCompId>0){
              cn.componentName =cn.componentName +'-'+cn.subComponentName
            }
            const cName = cn.componentName + '-' + count[i];
            pcompName.push(cName);
            count = {};
          }
        });

        let individual = null;
        let addFee = null;
        let compFee = null;
        let packg = null;

        ele.listOfComponent.forEach(ec => {
          if (ec.feeCategory === 'Individual') {
            if (!individual) {
              individual = ec.fee + ' ' + ec.currencyType;
            } else {
              individual += ' + ' + ec.fee + ' ' + ec.currencyType;
            }
          } else if (ec.feeCategory === 'Additional Fees') {
            if (!addFee) { addFee = ec.fee + ' ' + ec.currencyType; } else {
              addFee += ' + ' + ec.fee + ' ' + ec.currencyType;
            }
          } else if (ec.feeCategory === 'Component Fees') {
            if (!compFee) { compFee = ec.fee + ' ' + ec.currencyType; } else {
              compFee += ' + ' + ec.fee + ' ' + ec.currencyType;
            }
          }
        });

        // ele.listOfComponent.forEach(element => {
        //   // if (element.feeCategory !== 'Additional Fees') {
        //   //   const cName = (element.subComponentName !== null ? element.componentName + ' - ' + element.subComponentName :
        //   //     element.componentName);
        //   //   compName.push(cName);
        //   // }
        //   // compList = compName.map(m => m).join(',');
        //   if (element.feeCategory !== 'Package' && element.feeCategory === 'Additional Fees') {
        //     const adRemark = element.feeRemark != null ? element.feeRemark : 'Verification fee';
        //     const fees = '(' + element.componentName + ' - ' + adRemark + ' ' + element.fee + ' ' + element.currencyType + ')';
        //     fee.push(fees);
        //   }
        //   if (element.feeCategory !== 'Package' && element.feeCategory !== 'Additional Fees') {
        //     // const curSymbol = element.currencyType ==='INR'?'₹':'$'
        //     const fees = element.fee + ' ' + element.currencyType;
        //     ifee.push(fees);
        //   }
        //   feeName = fee.length > 0 ? ',ADDITIONAL FEE{' + fee.join('+') + '}' : '';

        //   ifeeName = (ifee.length > 0) ? 'INDV FEE{' + ifee.join('+') + '}' : '';
        // });
        // tslint:disable-next-line:only-arrow-functions
        // compName.forEach(function(i: any) { count[i] = (count[i] || 0) + 1; });
        // compList = JSON.stringify(count);
        // compList = compList.replace(/"/g, '');
        // compList = compList.replace(/[{}]/g, '');
        // compList = compList.replace(/,/g, '+');
        // compList = compList.replace(/:/g, '-');
        // if (cfeeName.length <= 0) {
        //   packremarks = ifeeName + feeName;
        // }
        // else { // if (cfeeName.length > 0) {
        //   packremarks = ifeeName + feeName + ', C.F ' + cfeeName;
        // }
        if (ele.packageDetail !== null) {
          ele.packageDetail.packageName = ele.packageDetail.packageName.replace(/’/g, '&#39;');
          ele.packageDetail.packageName = ele.packageDetail.packageName.replace(/'/g, '&#39;');
          ele.packageDetail.packageName = ele.packageDetail.packageName.replace(/–/g, '&#8209;');
          ele.packageDetail.packageName = ele.packageDetail.packageName.replace(/-/g, '&#8209;');
          // ele.packageDetail.packageName = ele.packageDetail.packageName.replace(/’/g, '\'');
          packg = ele.packageDetail.packageName + '[' + ele.packageDetail.packageFee + 'INR]' + ' + ';
          compList = ele.packageDetail.packageName + ' [' + pcompName.join(' + ') + ']';
        }

        packremarks = (packg ? packg : '')
          + (individual ? ((packg ? '+ ' : '') + 'INDV {' + individual + '} ') : '')
          + (addFee ? (((packg || individual) ? '+ ' : '') + 'A.F (' + addFee + ')') : '')
          + (compFee ? (((packg || individual || addFee) ? '+ ' : '') + 'Comp Fee (' + compFee + ')') : '')
          + (cfeeName ? (((packg || individual || addFee || compFee) ? '+ ' : '') + 'C.F (' + cfeeName + ')') : '');

        if (compName.length > 0) {
          compList = (compList ? ' ' : '') + 'INDV {' + compName + '}';
        }

        compName= [];
        fee = [];
        ifee = [];
        feeName = '';
        ifeeName = '';
        cfee = [];
        pcompName = [];
        count = {};
        // this.execeldata.push({
        //   // 'S.No': i + 1,
        //   'Client Name': data.clientName,
        //   'Case Ref No': ele.clientRefNo,
        //   'Invoice No': ele.invoiceNo,
        //   // 'Site/Group Name': data.siteName ? data.siteName : data.groupName,
        //   'Candidate Name': ele.candidateName,
        //   'Components Detail': compList,
        //   // 'Report sent on' : this.dateP.transform(this.bindBilledList[0].reportSentOn, 'dd-MM-yyyy'),
        //   'Remarks ': packremarks,
        //   // 'Rate Per Check' : fee,
        //   'Add.Fee': ele.additionalFee,
        //   'Invoice Gen.on': data.created ?
        //     (this.dateP.transform(data.created, 'dd-MM-yyyy')) : 'N/A',
        //   'From Date': data.fromDate ?
        //     (this.dateP.transform(data.fromDate, 'dd-MM-yyyy')) : 'N/A',
        //   'To Date': data.toDate ?
        //     (this.dateP.transform(data.toDate, 'dd-MM-yyyy')) : 'N/A',
        //   'Total Amount': ele.grandTotal,
        // });
        ele.compList = compList;
        ele.packremarks = packremarks;
        ele.invoiceGen = this.dateP.transform(data.created, 'dd-MM-yyyy');
        ele.invoiceFrom = this.dateP.transform(data.fromDate, 'dd-MM-yyyy');
        ele.invoiceTo = this.dateP.transform(data.toDate, 'dd-MM-yyyy');
        ele.reportSentOn = this.dateP.transform(ele.reportSentOn, 'dd-MM-yyyy');
        ele.sNo = i + 1;
      });
      // const ws = XLSX.utils.json_to_sheet(this.execeldata);
      // const wb: XLSX.WorkBook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, 'View Invoice');
      // XLSX.writeFile(wb, 'View Invoice.xlsx');
      const cols = [
        { field: 'sNo', header: 'S.No' },
        { field: 'clientRefNo', header: 'Case Ref Number' },
        // { field: 'applicantId', header: 'Applicant Id' },
        { field: 'candidateName', header: 'Candidate Name' },
        { field: 'compList', header: 'Components Detail Package[Component :Nos+...] + Indv{Component :Nos+...}' },
        { field: 'reportSentOn', header: 'Report sent on' },
        { field: 'packremarks', header: 'Remarks' },
        { field: 'ratePerCheck', header: 'Rate Per Check (Rupees)' },
        { field: 'additionalFee', header: 'Add.Fee (Rupees)' },
        { field: 'grandTotal', header: 'Total Amount (Rupees)' },
        { field: 'invoiceNo', header: 'Invoice Number' },
        { field: 'invoiceGen', header: 'Invoice Generated Date' },
        { field: 'invoiceFrom', header: 'From Date' },
        { field: 'invoiceTo', header: 'To Date' },
      ];
      var ratePerCheckTotal = this.bindBilledList.reduce((sum, current) => sum + current.ratePerCheck, 0);
      var grandTotal = this.bindBilledList.reduce((sum, current) => sum + current.grandTotal, 0);
      var additionalFeeTotal = this.bindBilledList.reduce((sum, current) => sum + current.additionalFee, 0);
      this.exportToExcelInvoice(cols, this.bindBilledList, data.clientName, true, ratePerCheckTotal, grandTotal, additionalFeeTotal);
    } else {
      this.showTopCenter('warn', 'Failure Message', 'No Record Found');
    }
  }
  exportToExcelInvoice(dataExcelCols, excelDataList, excelName, designFlag = false, ratePerCheckTotal, grandTotal, additionalFeeTotal) {
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
      let  from = this.dateP.transform(this.preInvoiceSearch.fromDate, 'dd-MMM-yyyy');
      let  todate = this.dateP.transform(this.preInvoiceSearch.toDate, 'dd-MMM-yyyy');
      tabtext = tabtext + '<tr><th colspan="' + header.length + '" bgcolor="#0E4872" style="font-size:15px;color:white">Invoice Period From ' + from + ' to ' + todate + '</th> </tr > ' + ' <tr> ' + headerColos + ' </tr>';
    }
    for (j = 0; j < lines; j++) {
      headerColos = '';
      header.forEach(h => {
        headerColos = headerColos + '<td style="font-size:12px">' + (filteredValue[j][h.field] === '' ? 'N/A' : filteredValue[j][h.field]) + '</td>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    const total = '<tfoot><tr><td></td><td></td><td></td><td></td><td></td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">TOTAL AMOUNT (EXCLUDING SERVICE TAX)</td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;"> ' + ratePerCheckTotal + ' </td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">' + additionalFeeTotal + '</td><td style="border: 1px solid #6e91aa;padding: 4px;background: #abbfce;font-size: 12px;font-weight: 700;font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">' + grandTotal + '</td><td><td></td></td><td></td></tr><tfoot>'
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
  showall() {
    if (this.viewInvoiceList.length > 0) {
      this.itemPerPage = this.viewInvoiceList.length;
    }
  }
}
export class PreInvoiceSearch {
  screeningId: any;
  clientId: number;
  siteId: number;
  groupId: number;
  fromDate: any;
  toDate: any;
  ViewInvoice: any;
}
