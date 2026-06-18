import { Component, OnInit } from '@angular/core';
import { InvoiceService, sumOffData } from 'src/app/common-methods/services/invoice.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { I } from '@angular/cdk/keycodes';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {
  btnBack = true;
  kryalogo: any;
  kryaSeal: any;
  kryaSignature: any;
  cost: any[] = []; invoiceVal = `FYYYYY-YY/V2XXXXXX`;
  constructor(public invoiceService: InvoiceService, public common: CommonService,
    private router: Router, public messageService: MessageService, private sanitizer: DomSanitizer,
    public verificationService: VerificationService
  ) { }
  summOff = 0;
  totalAmount = ''; userData: any; currentDate = new Date();
  stateCode: any;
  invoiceTitle:string;
  enableLutFlag:boolean;
  ngOnInit() {
    this.invoiceService.manualInvoiveNo = new UntypedFormControl('', Validators.compose([Validators.required,
    Validators.pattern(/^[A-Za-z]{2}[0-9]{4}[-]+[0-9]{2}[/]+[0-9]{8}$/), Validators.maxLength(18)]));
    this.compFeeMapping();
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.invoiceService.preInvoiceValue) {
      if (this.invoiceService.preInvoiceValue.compWiseCostVm.length > 0) {
        this.invoiceService.preInvoiceValue.compWiseCostVm.forEach(e => {
          this.summOff += e.totalAmount;
        });
      }
      this.getSumOff();
      this.totalAmount = getASRs(this.invoiceService.sumOffDatavalue.grandTotal, this.invoiceService.preInvoiceValue.caseByPassFlag);
      this.stateCode = String(this.invoiceService.preInvoiceValue.billingClientVm.gstNo ? this.invoiceService.preInvoiceValue.billingClientVm.gstNo : 33).slice(0, 2)
      this.stateCode = Number(this.stateCode ? this.stateCode : 33);
      this.invoiceTitle= String(this.invoiceService.preInvoiceValue.billingClientVm.invoiceTitle ?this.invoiceService.preInvoiceValue.billingClientVm.invoiceTitle:"N/A" )
      this.enableLutFlag = Boolean(this.invoiceService.preInvoiceValue.billingClientVm.enableLutFlag ?this.invoiceService.preInvoiceValue.billingClientVm.enableLutFlag:"N/A")
    }

  }
  checkInvoiceNumber() {
    if (this.invoiceService.manualInvoiveNo.valid) {
      this.invoiceService.checkInvoiceNumber(this.invoiceService.manualInvoiveNo.value).subscribe(res => {
        if (res) {
          this.invoiceService.manualInvoiveNo.setErrors({ incorrect: true });
        } else {
          this.invoiceService.manualInvoiveNo.setErrors(null);
        }
      });
    }
  }
  getSumOff() {
    this.invoiceService.sumOffDatavalue.qtyTotal = this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'qty');
    this.invoiceService.sumOffDatavalue.rateTotal = this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'ratePerCheck');
    this.invoiceService.sumOffDatavalue.amountTotal = this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'rateTotal');
    this.invoiceService.sumOffDatavalue.taxableValueTotal = Math.round(this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'totalAmount'));
    this.invoiceService.sumOffDatavalue.cgstAmountTotal = this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'cgst');
    this.invoiceService.sumOffDatavalue.sgstAmountTotal = this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'sgst');
    this.invoiceService.sumOffDatavalue.igstAmountTotal = this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'igst');
    this.invoiceService.sumOffDatavalue.grandTotal = Math.round(this.sumOff(this.invoiceService.preInvoiceValue.compWiseCostVm, 'grandTotal'));
    // Case wise Total
    this.invoiceService.sumOffDatavalue.caseRateTotal = this.sumOff(this.invoiceService.preInvoiceValue.getCaseCostVm, 'ratePerCheck') +
      this.sumOff(this.invoiceService.preInvoiceValue.getCaseCostVm, 'packageAmount');
      //VTS2-2023-CRT-0139 point no: 19 ==> add total addfee ==> by janani
    this.invoiceService.sumOffDatavalue.caseAddFeeTotal = this.sumOff(this.invoiceService.preInvoiceValue.getCaseCostVm, 'additionalFee');
    this.invoiceService.sumOffDatavalue.caseGrandTotal = this.sumOff(this.invoiceService.preInvoiceValue.getCaseCostVm, 'totalAmount');

  }

  compFeeMapping() {
    var filtered = {};
    let Filterfee
    this.invoiceService.preInvoiceValue.getCaseCostVm.forEach(e => {
      Filterfee = e.componentFee.filter(x => x.compChargeType !== 'Individual')
      e.componentFee = e.componentFee.filter(x => x.compChargeType === 'Individual')
      e.componentFee.forEach(ec => {
        let x = filtered[ec.compId] || {};

        x = {
          compChargeType: ec.compChargeType,
          fee: (x.fee || 0) + ec.fee,
          compId: ec.compId,
          compName: ec.compName,
          currencyType: ec.currencyType,

        }
        filtered[ec.compId] = x;

      });
      var fin = Object.keys(filtered).map(item => filtered[item])
      if (Filterfee.length == 0) {
        e.componentFee = fin;
        e.componentFee = e.componentFee.sort((a, b) => b.compId - a.compId);
        filtered = {};
      }
      if (Filterfee.length > 0) {
        fin = fin.concat(Filterfee);
        e.componentFee = fin;
        e.componentFee = e.componentFee.sort((a, b) => b.compId - a.compId);
        filtered = {};
      }
    })
    this.kryalogo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.invoiceService.preInvoiceValue.companyDetails?.companyLogo?.logo);
    this.kryaSeal = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.invoiceService.preInvoiceValue.companyDetails?.companyLogo?.seal);
    this.kryaSignature = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.invoiceService.preInvoiceValue.companyDetails?.companyLogo?.signature);
    //this.test = "data:image/jpg;base64,this.invoiceService.preInvoiceValue.companyDetails.companyLogo.logo"
    // this.invoiceService.preInvoiceValue.getCaseCostVm.forEach(e => {
    // e.componentFee = fin;
    // e.componentFee = e.componentFee.sort((a, b) => b.compId - a.compId);
    // });

    this.invoiceService.preInvoiceValue.getCaseCostVm.forEach(e => {
      let individual = null; let addFee = null; let packg = null; let compFee = null; let cfee = [];
      let cfeeName = '';
      let compName= [];
      let pcompName = [];
      e.componentName.forEach(element => {
        if (element.compChargeType === 'Individual') {
          if(element.subComponentFlag){
            element.componentName = element.componentName +'-'+ element.subComponentName;
          }
          const cName = element.componentName + '-' + element.count;
          compName.push(cName);
        } else if (element.compChargeType === 'Package') {
          if(element.subComponentFlag){
            element.componentName = element.componentName +'-'+ element.subComponentName;
          }
          const cName = element.componentName + '-' + element.count;
          pcompName.push(cName);
        }

      });

      if (e.cancelFee.length > 0) {
        e.cancelFee.forEach(e1 => {
          let fees = null;
          if(e1.statusId == this.common.STP_CHKID){
           fees = ' (' + e1.compName + ' - ' + e1.cancelRemark + '- Stop Check )';
          }else if(e1.statusId == this.common.CLBY_CLIID){
            fees = ' (' + e1.compName + ' - ' + e1.cancelRemark + '- Cancel By Client )'; 
          }
          cfee.push(fees);

        });
        if (cfee.length > 0) {
          cfeeName = cfee.join(' + ');
        }
      }
      e.componentFee.forEach(ec => {
        if (ec.compChargeType === 'Individual') {
          if (!individual) {
            individual = ec.fee + ' ' + ec.currencyType;
          } else {
            individual += ' + ' + ec.fee + ' ' + ec.currencyType;
          }
        } else if (ec.compChargeType === 'Additional Fees') {
          if (!addFee) { addFee = ec.fee + ' ' + ec.currencyType; } else {
            addFee += ' + ' + ec.fee + ' ' + ec.currencyType;
          }
        } else if (ec.compChargeType === 'Component Fees') {
          if (!compFee) { compFee = ec.fee + ' ' + ec.currencyType; } else {
            compFee += ' + ' + ec.fee + ' ' + ec.currencyType;
          }
        }
      });
      if (e.packageAmount > 0) {
        if (!packg) { packg = e.packageAmount + ' INR'; } else {
          packg += ' + ' + e.packageAmount + ' INR';
        }
      }

      let cmp = '';

      if (e !== null && e.packageName !== null) {
        cmp = e.packageName + ' [' + pcompName.join(' + ') + ']';
      }
      if (compName.length > 0) {
        cmp += (cmp ? ' + ' : '') + 'INDV {' + compName.join(' + ') + '}';
      }

      e.componentDetails = cmp;

      e.componentFeeData = (packg ? (`${e.packageName}[` + packg + '] ') : '')
        + (individual ? ((packg ? '+ ' : '') + 'INDV {' + individual + '} ') : '')
        + (addFee ? (((packg || individual) ? '+ ' : '') + 'A.F (' + addFee + ')') : '')
        + (compFee ? (((packg || individual || addFee) ? '+ ' : '') + 'Comp Fee (' + compFee + ')') : '')
        + (cfeeName ? (((packg || individual || addFee || compFee) ? '+ ' : '') + 'C.F (' + cfeeName + ')') : '');
    });

  }

  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }

  sumOff(data: any[], key: string): number {
    let element = 0;
    for (const iterator of data) { element += iterator[key]; }
    return element;
  }

  closeForm() {
    this.router.navigate(['/dashboard/invoice/previewInvoice']);
  }
  getSignature(signatureList: any): string {
    let signature = '';
    if (signatureList !== null && signatureList.length > 0) {
      const sign = signatureList.filter(f => f.signatureType === 'Managing Director');
      if (sign.length > 0) {
        signature = sign[0].signature;
      }
    }
    return signature;
  }
}

class CompChargeType {
  individual = false;
  package = false;
  addFee = false;
}

// save Invoice

function getASRss(amount): string {
  const words = new Array();
  words[0] = 'Zero'; words[1] = 'One'; words[2] = 'Two'; words[3] = 'Three';
  words[4] = 'Four'; words[5] = 'Five'; words[6] = 'Six'; words[7] = 'Seven';
  words[8] = 'Eight'; words[9] = 'Nine'; words[10] = 'Ten'; words[11] = 'Eleven';
  words[12] = 'Twelve'; words[13] = 'Thirteen'; words[14] = 'Fourteen'; words[15] = 'Fifteen';
  words[16] = 'Sixteen'; words[17] = 'Seventeen'; words[18] = 'Eighteen'; words[19] = 'Nineteen';
  words[20] = 'Twenty'; words[30] = 'Thirty'; words[40] = 'Forty'; words[50] = 'Fifty';
  words[60] = 'Sixty'; words[70] = 'Seventy'; words[80] = 'Eighty'; words[90] = 'Ninety';
  let op;
  amount = amount.toString();
  const atemp = amount.split('.');
  // tslint:disable-next-line:variable-name
  const number = atemp[0].split(',').join('');
  const n_length = number.length;
  // tslint:disable-next-line:variable-name
  let words_string = '';
  if (n_length <= 9) {
    const n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const received_n_array = new Array();
    for (let i = 0; i < n_length; i++) {
      received_n_array[i] = number.substr(i, 1);
    }
    for (let i = 9 - n_length, j = 0; i < 9; i++ , j++) {
      n_array[i] = received_n_array[j];
    }
    for (let i = 0, j = 1; i < 9; i++ , j++) {
      if (i === 0 || i === 2 || i === 4 || i === 7) {
        if (n_array[i] === 1) {
          n_array[j] = 10 + parseInt('' + n_array[j], 0);
          n_array[i] = 0;
        }
      }
    }
    let value: any = '';
    for (let i = 0; i < 9; i++) {
      if (i === 0 || i === 2 || i === 4 || i === 7) {
        value = n_array[i] * 10;
      } else {
        value = n_array[i];
      }
      if (value !== 0) {
        words_string += words[value] + ' ';
      }
      if ((i === 1 && value !== 0) || (i === 0 && value !== 0 && n_array[i + 1] === 0)) {
        words_string += 'Crores ';
      }
      if ((i === 3 && value !== 0) || (i === 2 && value !== 0 && n_array[i + 1] === 0)) {
        words_string += 'Lakhs ';
      }
      if ((i === 5 && value !== 0) || (i === 4 && value !== 0 && n_array[i + 1] === 0)) {
        words_string += 'Thousand ';
      }
      if (i === 6 && value !== 0 && (n_array[i + 1] !== 0 && n_array[i + 2] !== 0)) {
        words_string += 'Hundred and ';
      } else if (i === 6 && value !== 0) {
        words_string += 'Hundred ';
      }
    }
    words_string = words_string.split(' ').join(' ');
  }
  return words_string;
}

function getASRs(value, caseByPassFlag) {
  const fraction = Math.round(frac(value) * 100);
  // tslint:disable-next-line:variable-name
  let f_text = '';
  let cur = '';
  if (caseByPassFlag == true) {
    cur = ' Dollar ';
    if (fraction > 0) {
      f_text = 'And ' + convert_number(fraction) + 'Cents';
    }
  } else {
    cur = ' Rupees ';
    if (fraction > 0) {
      f_text = 'And ' + convert_number(fraction) + ' Paise ';
    }
  }
// Formate Changed By Megala - VTS2-2024-CRT-0182
  return cur + convert_number(value) +  f_text + ' Only';
}

function frac(f: any) {
  return f % 1;
}

// tslint:disable-next-line:variable-name
function convert_number(number: number) {
  if ((number < 0) || (number > 999999999)) {
    return 'Number Out Of Range!';
  }
  const Gn = Math.floor(number / 10000000);  /* Crore */
  number -= Gn * 10000000;
  const kn = Math.floor(number / 100000);     /* lakhs */
  number -= kn * 100000;
  const Hn = Math.floor(number / 1000);      /* thousand */
  number -= Hn * 1000;
  const Dn = Math.floor(number / 100);       /* Tens (deca) */
  number = number % 100;               /* Ones */
  const tn = Math.floor(number / 10);
  const one = Math.floor(number % 10);
  let res = '';

  if (Gn > 0) {
    res += (convert_number(Gn) + ' Crore');
  }
  if (kn > 0) {
    res += (((res === '') ? '' : ' ') +
      convert_number(kn) + ' Lakh');
  }
  if (Hn > 0) {
    res += (((res === '') ? '' : ' ') +
      convert_number(Hn) + ' Thousand');
  }

  if (Dn) {
    res += (((res === '') ? '' : ' ') +
      convert_number(Dn) + ' Hundred');
  }

  const Ones = Array('', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
    'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen');
  const Tens = Array('', '', 'Twenty', 'Thirty', 'Fourty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety');

  if (tn > 0 || one > 0) {
    if (!(res === '')) {
      res += ' And ';
    }
    if (tn < 2) {
      res += Ones[tn * 10 + one];
    } else {
      res += Tens[tn];
      if (one > 0) {
        res += ('-' + Ones[one]);
      }
    }
  }

  if (res === '') {
    res = 'zero';
  }
  return res;
}

// function RsPaise(n: any) {
//   let nums = n.toString().split('.')
//   var whole = Rs(nums[0])
//   if (nums[1] == null) nums[1] = 0;
//   if (nums[1].length == 1) nums[1] = nums[1] + '0';
//   if (nums[1].length > 2) { nums[1] = nums[1].substring(2, length - 1) }
//   if (nums.length == 2) {
//     if (nums[0] <= 9) { nums[0] = nums[0] * 10 } else { nums[0] = nums[0] };
//     var fraction = Rs(nums[1])
//     if (whole == '' && fraction == '') { op = 'Zero only'; }
//     if (whole == '' && fraction != '') { op = 'paise ' + fraction + ' only'; }
//     if (whole != '' && fraction == '') { op = 'Rupees ' + whole + ' only'; }
//     if (whole != '' && fraction != '') { op = 'Rupees ' + whole + 'and paise ' + fraction + ' only'; }
//     amt = document.getElementById('amt').value;
//     if (amt > 999999999.99) { op = 'Oops!!! The amount is too big to convert'; }
//     if (isNaN(amt) == true) { op = 'Error : Amount in number appears to be incorrect. Please Check.'; }
//     document.getElementById('op').innerHTML = op;
//   }
// }
// RsPaise(Math.round(document.getElementById('amt').value * 100) / 100);
