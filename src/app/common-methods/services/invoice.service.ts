import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UntypedFormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  clientId: string;
  siteId: string;
  groupId: string;
  fromDate: Date;
  toDate: Date;
  show=false;
  preInvoiceValue: PreInvoice;
  manualInvoiveNo = new UntypedFormControl('', Validators.compose([Validators.required,
    Validators.pattern(/^[A-Za-z]{2}[0-9]{4}[-]+[0-9]{2}[/]+[0-9]{8}$/), Validators.maxLength(18)]));
  enablePre = false;
  sumOffDatavalue = new sumOffData();
  isRevertInvoice = false;
  viewInvoice: any;
  constructor(private http: HttpClient) { }
  userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  // Invoice
  checkInvoiceNumber(invoiceNo: string): Observable<any> {
    const dataUrl = 'Invoice/CheckInvoiceNumber?invoiceNo=' + invoiceNo;
    return this.http.get(dataUrl);
  }
  getInvoiceClient(lstClientId): Observable<any> {
    const dataUrl = 'Invoice/GetInvoiceClient';
    return this.http.post<any>(dataUrl, lstClientId);
  }
  getCaseStatus(): Observable<any> {
    const dataUrl = 'Master/GetCaseStatus';
    return this.http.get<any>(dataUrl);
  }
  getCasePriority(): Observable<any> {
    const dataUrl = 'Master/GetCasePriority';
    return this.http.get<any>(dataUrl);
  }

  getManualInvoiceList(): Observable<any> {
    const dataUrl = 'Invoice/GetManualInvoiceList';
    return this.http.get<any>(dataUrl);
  }
  getBilledInvoiceList(clientId, fromDate, toDate): Observable<any> {
    const dataUrl = 'Invoice/GetBilledInvoiceList?clientId=' + clientId + '&fromDate=' + fromDate +
      '&toDate=' + toDate;
    return this.http.get<any>(dataUrl);
  }
  getUnBilledInvoiceList(unbilledInvoiceVm): Observable<any> {
    const dataUrl = 'Invoice/GetUnBilledInvoiceList';
    return this.http.post<any>(dataUrl,unbilledInvoiceVm, { observe: 'response' as 'body' });
  }
  getInvoiceSiteOrGroup(ClientId): Observable<any> {
    const dataUrl = 'Invoice/GetInvoiceSiteOrGroup?ClientId=' + ClientId;
    return this.http.get<any>(dataUrl);
  }
  getEstimateCost(data): Observable<any> {
    const dataUrl = 'Invoice/GetCaseEstimateCost';
    return this.http.post<any>(dataUrl, data);
  }
  getInvoiceExcelDetail(invoiceId): Observable<any> {
    const dataUrl = 'Invoice/GetInvoiceExcelDetail?invoiceId=' + invoiceId;
    return this.http.get<any>(dataUrl);
  }
  GetPreInvoice(data): Observable<any> {
    const dataUrl = 'Invoice/GetPreInvoice';
    return this.http.post<any>(dataUrl, data);
  }

  // GetInvoiceList(invoiceId: any) {
  //   const dataUrl = 'Invoice/GetInvoiceTransList?invoiceId=' + invoiceId;
  //   return this.http.get<any>(dataUrl);
  // }

  // GetPreInvoice(clientId, siteId, groupId, screeningId, fromDate, toDate) {
  //   let id = '';
  //   if (screeningId) {
  //     screeningId.forEach(element => {
  //       id = id + '&screeningId=' + element;
  //     });
  //   }
  //   console.log(id, 'id');
  //   const dataUrl = 'Invoice/GetPreInvoice?clientId=' + clientId + '&siteId=' + siteId + '&groupId=' + groupId +
  //     '&fromDate=' + fromDate + '&toDate=' + toDate + '&screeningId' + id;
  //   return this.http.get<any>(dataUrl);
  // }
  AddCompInvoiceFlag(compInvoiceVm): Observable<any> {
    const dataUrl = 'Invoice/AddCompInvoiceFlag';
    return this.http.post<any>(dataUrl, compInvoiceVm);
  }
  SaveInvoiceGeneration(data): Observable<any> {
    const dataUrl = 'Invoice/SaveInvoiceGeneration';
    return this.http.post<any>(dataUrl, data);
  }
  // View Invoice Details
  GetInvoiceViewDetails(lstClientId): Observable<any> {
    const dataUrl = 'Invoice/GetInvoiceViewDetails';
    return this.http.post<any>(dataUrl, lstClientId, { observe: 'response' as 'body' });

  }
  // InvoiceMailProcess(mailList: any) {
  //   const dataUrl = 'Invoice/InvoiceMailProcess';
  //   return this.http.post<any>(dataUrl, mailList);
  // }
  InvoiceMailProcess(clientId, invoiceId, logginId): Observable<any> {
    const dataUrl = 'Invoice/InvoiceMailProcess?clientId=' + clientId + '&invoiceId=' + invoiceId + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  // Get invoice delete Details
  deleteInvoiceGeneration(invoiceId: number): Observable<any> {
    const dataUrl = 'Invoice/DeleteInvoiceGeneration?invoiceId=' + invoiceId + '&logginId=' + this.userData.userId;
    return this.http.post<any>(dataUrl, null);
  }
  // Get Choose packageList
  getInvoicePackageList(clientId, clientRefNo,screeningId): Observable<any> {
    const dataUrl = 'Invoice/GetChoosePackageDetails?clientId=' + clientId + '&clientRefNo=' + clientRefNo+'&screeningId=' + screeningId;
    return this.http.get<any>(dataUrl);
  }
  CheckCaseIndivdualCompMatchPackComp(checkPackVm): Observable<any> {
    const dataUrl = 'Invoice/CheckCaseIndivdualCompMatchPackComp';
    return this.http.post<any>(dataUrl,checkPackVm);
  }
  UpdateComponentFeeType(data): Observable<any> {
    const dataUrl = 'Invoice/UpdateComponentFeeType';
    return this.http.post<any>(dataUrl, data);
  }
  getCaseFeeChangeHistory(clientRefNo):Observable<any>{
    const dataUrl='Invoice/getCaseFeeChangeHistory?clientRefNo='+clientRefNo+'';
    return this.http.get<any>(dataUrl)
  }
  getTax(): Observable<any> {
    const dataUrl = 'Invoice/GetTax';
    return this.http.get<any>(dataUrl);
  }
  saveTax(invoiceTaxVm): Observable<any> {
    const dataUrl = 'Invoice/AddTax';
    return this.http.post(dataUrl, invoiceTaxVm);
  }
  public deleteTaxById(taxId, userId): Observable<any> {
    const dataUrl = 'Invoice/DeleteTaxById?taxId=' + taxId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  GetSkipInvoice(): Observable<any> {
    const dataUrl = 'Invoice/GetSkipInvoice';
    return this.http.get<any>(dataUrl);
  }
  AddSkipInvoice(skipInvoiceVm): Observable<any> {
    const dataUrl = 'Invoice/AddSkipInvoice';
    return this.http.post(dataUrl, skipInvoiceVm);
  }
  AddManualInvoice(manualInvoiceVm): Observable<any> {
    const dataUrl = 'Invoice/AddManualInvoice';
    return this.http.post(dataUrl, manualInvoiceVm);
  }
  GetClientInvoiceList(inputData: any): Observable<any> {
    const dataUrl = 'Invoice/GetClientInvoiceList';
    return this.http.post(dataUrl, inputData , { observe: 'response' as 'body' });
  }


  getPaymentInvoice(caseSubmissionList, price) {
    let listComp: CompWiseCostVm[] = [];
    let pack = new CompWiseCostVm();
    if (caseSubmissionList.candidate.packageName) {
      pack.componentName = caseSubmissionList.candidate.packageName;
      pack.grandTotal = caseSubmissionList.candidate.packagePrice + ((caseSubmissionList.candidate.packagePrice) * (2.5 / 100) * 2);
      pack.cgst = (caseSubmissionList.candidate.packagePrice) * (2.5 / 100);
      pack.cgstPercentage = 2.5;
      pack.sgst = (caseSubmissionList.candidate.packagePrice) * (2.5 / 100);
      pack.sgstPercentage = 2.5;
      pack.igst = 0;
      pack.igstPercentage = 0;
      pack.qty = 0;
      pack.ratePerCheck = caseSubmissionList.candidate.packagePrice;
      pack.rateTotal = caseSubmissionList.candidate.packagePrice;
      pack.totalAmount = caseSubmissionList.candidate.packagePrice;// + ((caseSubmissionList.candidate.packagePrice) * (2.5/100) * 2);
    }
    caseSubmissionList.screeningCaseComponent.forEach(el => {
      let list = new CompWiseCostVm();
      if (el.subCompFlag) {
        el.screeningSubComponent.forEach(e => {
          if (e.fees) {
            list.componentName = el.compName + ' - ' + e.subCompName;
            list.grandTotal = e.noOfComponent * e.fees + ((e.noOfComponent * e.fees) * (2.5 / 100) * 2);
            list.cgst = (e.noOfComponent * e.fees) * (2.5 / 100);
            list.cgstPercentage = 2.5;
            list.sgst = (e.noOfComponent * e.fees) * (2.5 / 100);
            list.sgstPercentage = 2.5;
            list.igst = 0;
            list.igstPercentage = 0;
            list.qty = e.noOfComponent;
            list.ratePerCheck = e.fees;
            list.rateTotal = e.fees * e.noOfComponent;
            // list.compChargeType = el.compChargeType;
            list.totalAmount = e.noOfComponent * e.fees;// + ((e.noOfComponent * e.fees) * (2.5/100) * 2);
            listComp.push(list);
          }
        });
      } else {
        if (el.fees) {
          list.componentName = el.compName;
          list.grandTotal = el.noOfComponent * el.fees + ((el.noOfComponent * el.fees) * (2.5 / 100) * 2);
          list.cgst = (el.noOfComponent * el.fees) * (2.5 / 100);
          list.cgstPercentage = 2.5;
          list.sgst = (el.noOfComponent * el.fees) * (2.5 / 100);
          list.sgstPercentage = 2.5;
          list.igst = 0;
          list.igstPercentage = 0;
          list.qty = el.noOfComponent;
          list.ratePerCheck = el.fees;
          list.rateTotal = el.noOfComponent * el.fees;
          // list.compChargeType = el.compChargeType;
          list.totalAmount = el.noOfComponent * el.fees;// + ((el.noOfComponent * el.fees) * (2.5/100) * 2);
          listComp.push(list);
        }
      }
    });
    let list1 = new CaseWiseCostVm();
    list1.applicantId = caseSubmissionList.screening.applicantId;
    list1.caseRefNo = caseSubmissionList.screening.clientRefNo;
    list1.firstName = caseSubmissionList.candidate.firstName;
    list1.middleName = caseSubmissionList.candidate.middleName;
    list1.lastName = caseSubmissionList.candidate.lastName;
    list1.packageAmount = caseSubmissionList.candidate.packagePrice;
    list1.additionalFee = 0;
    list1.packageName = caseSubmissionList.candidate.packageName;
    list1.ratePerCheck = price;
    // list1.reportSentOn = '';
    list1.totalAmount = price;
    list1.componentName = [];
    list1.componentFee = [];
    listComp.forEach(elem => {
      list1.componentName.push({ componentName: elem.componentName, count: elem.qty, compChargeType: '',subComponentFlag:false, subComponentName:''});
    });
    if (caseSubmissionList.candidate.packageName) {
      listComp.push(pack);
    }
    listComp.forEach(elem => {
      list1.componentFee.push({
        compChargeType: ((caseSubmissionList.candidate.packageName && caseSubmissionList.candidate.packageName === elem.componentName)
          ? 'Package' : 'Individual'), compId: elem.compId, compName: elem.componentName, fee: elem.ratePerCheck, cancelRemark: ''
        , currencyType: 'INR', statusId: 0/*compFeeCurrencyType: '', addFeeCurrencyType: '', currencyId: 0, screeningCompId: 0, compChargeTypeLookUpId: 0,*/
      });
    });
    const pre = new PreInvoice();
    pre.compWiseCostVm = listComp;
    pre.getCaseCostVm.push(list1);
    this.preInvoiceValue = pre;
  }
}

/// preInvoiceClasses

class PreInvoice {
  getCaseCostVm: CaseWiseCostVm[] = [];
  caseByPassFlag: boolean;
  manualInvoiceFlag: boolean;
  compWiseCostVm: CompWiseCostVm[] = [];
  billingClientVm: BillingClientVm;
  companyDetails: CompanyDetailsVm;
  screeningCompCost: InvoiceScreeningCompTransVm[] = [];
  // componentFeeDetails: ComponentFeeType[] = [];
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
  cancelFee: ComponentFeeType[] = [];
  componentFeeData?: string = null;
  ratePerCheck?: number;
  additionalFee?: number;
  packageAmount?: number;
  packageName: string;
  totalAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  componentDetails: string;
}

class ComponentFeeType {
  compChargeType: string;
  fee?: number;
  compId: number;
  compName: string;
  cancelRemark: string;
  statusId: number;
  currencyType: string;
  addFee?: number;
  compFee?: number;
  // compFeeCurrencyType: string;
  // addFeeCurrencyType: string;
  // screeningCompId: number;
  // compChargeTypeLookUpId: number;
  // currencyId: number;
}

class CompVm {
  count: number;
  componentName: string;
  compChargeType: string;
  subComponentFlag: boolean;
  subComponentName:string;
}

class CompWiseCostVm {
  compId?: number;
  packageId?: number;
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

// class CompanyDetailsVm {
//   companyLogo: companyLogoVm;
// }

export interface CompanyDetailsVm {
  companyName?: string;

  companyDetail?: {
    gstinNumber?: string;
    panNumber?: string;
    cinNumber?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankBranch?: string;
    bankIFSC?: string;
    contactNumbers?: string;
    fax?: string;
    contactEmail?: string;
  };

  address?: {
    addLine1?: string;
    addLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  companyLogo?: {
    logo?: string;
    seal?: string;
    signature?: string;
  };
}

class companyLogoVm {
  logo: string;
  seal: string;
  signature:string;
}
class BillingClientVm {
  clientName: string;
  billingName: string;
  contactPerson: string;
  mobileNo: string;
  phoneNo: string;
  contactEmailId: string;
  address: CommonAddressVm;
  contact: LookUpValueVm[] = [];
  gstNo: string;
  serviceTaxFlag: boolean;
  invoiceTitle:string;
  enableLutFlag:boolean;
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
  stateCode: number;
  phoneCode: string;
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

export class sumOffData {
  qtyTotal = 0;
  rateTotal = 0;
  amountTotal = 0;
  taxableValueTotal = 0;
  cgstRateTotal = 0;
  cgstAmountTotal = 0;
  sgstRateTotal = 0;
  sgstAmountTotal = 0;
  igstRateTotal = 0;
  igstAmountTotal = 0;
  grandTotal = 0;
  caseRateTotal = 0;
  caseAddFeeTotal = 0;
  caseGrandTotal = 0;
}
