import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { FinalReport, summaryContent, executiveDetailContent, docContent, ClientLogoReport } from 'src/app/common-methods/models/reponse-document';
import { CommonAddress } from 'src/app/common-methods/models/common-address';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrls: ['./generate-pdf.component.css']
})
export class GeneratePdfComponent implements OnInit, AfterViewChecked, AfterViewInit {


  @ViewChild('report') table!: ElementRef;
  finalReport: FinalReport = null;
  summaryContentList: summaryContent[] = [];
  executiveDetailContentlist: executiveDetailContent[] = [];
  documentName: string;
  docContentList: docContent[] = [];
  remarks = ''; currentDate = new Date();
  annexure = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  docContentPosition = false;
  drugResultTest: any[] = [];
  componentCustomFields: any;
  clientCustomField: any[] = [];
  clientLogoRep: ClientLogoReport;
  clientContact: any;
  clientContactName: any;
  // criminalDatabaseReportDetValue = new CriminalDatabaseReportDet();
  constructor(public verificationService: VerificationService, private datePipe: DatePipe, public router: Router,
    public commonService: CommonService) { }

  ngOnInit() {
    this.finalReport = (this.verificationService.finalReportvalue as any);
    // const fName = this.finalReport.candidateDetail.firstName;
    // const mName = this.finalReport.candidateDetail.middleName ? this.finalReport.candidateDetail.middleName : '';
    // const lName = this.finalReport.candidateDetail.lastName ? this.finalReport.candidateDetail.lastName : '';
    // this.finalReport.candidateDetail.firstName = fName + ' ' + mName + ' ' + lName;
    // this.finalReport.candidateDetail.dateInitiated = '' + (this.commonService.getTimezoneOffset(
    //   new Date(this.finalReport.candidateDetail.dateInitiated), false));
    this.docContentList = this.finalReport.document;
    this.verificationService.clientId = this.verificationService.finalReportvalue.candidateDetail.clientId;
    this.genrateData();
    this.documentName = '';
    window.scrollTo(0, 0);
    this.clientLogoRep = (this.verificationService.clientLogoaddress as any);
    if (this.clientLogoRep && this.clientLogoRep.clientContact) {
      this.clientContactName = this.clientLogoRep.clientContact;
    }
    // this.clientCustomField = this.finalReport.clientCustomFields;
    for (let i = 0; i < this.finalReport.clientCustomFields.length; i += 2) {
      this.clientCustomField.push(this.finalReport.clientCustomFields.slice(i, i + 2));
    }
    this.docContentPosition = this.finalReport.candidateDetail.reportLookName === 'Executive Summary-All Summary Details-All Annexure';
  }
  getHeader() {
    return (((this.finalReport.candidateDetail.reOpenFlag === true || this.finalReport.candidateDetail.subCheckFlag === true) &&
      this.router.url.includes('qualityCheckDetail')) || this.router.url.includes('verificationDetail'));
  }
  ngAfterViewChecked(): void {
    // if (this.verificationService.reportType === 'download' && this.verificationService.fromQC) {
    //   this.verificationService.generatePdfDocContent(this.verificationService.finalReportvalue.candidateDetail.clientId);
    // }
  }
  getEmployeeFlag() {
    return this.summaryContentList.some(x => x.allReportDefault && x.allReportDefault.employmentType === 'Current');
  }
  ngAfterViewInit(): void {
    // && this.verificationService.fromQC
    if (this.verificationService.reportType === 'download') {
      this.verificationService.generatePdfDocContent();
    }
  }
  ngOnDestroy(): void {
    this.verificationService.fromQC = false;
  }

  genrateData() {
    if (this.finalReport) {
      if (this.finalReport.summaryDetail) {
        let annexNameIndex = 0;
        this.finalReport.summaryDetail.forEach((element: any) => {
          // tslint:disable-next-line: no-use-before-declare
          const summaryData = new summaryContent();
          summaryData.compId = element.compId;
          summaryData.docContentList = this.docContentList.filter(comp => comp.screeningCompId === element.screeningCompId)
            .sort((a, b) => a.docId - b.docId);
          summaryData.docContentList.forEach(e => {
            e.annexureVal = this.annexure[annexNameIndex];
            if (annexNameIndex < 26) { annexNameIndex++; } else { annexNameIndex = 0; }
          });
          element.component.forEach((compElement: any, index) => {
            if (element.componentType === 'criminalCheckPCC3PCC3E') {
              // this.criminalDatabaseReportDetValue = compElement[element.componentType + 'ReportDet'];
              compElement[element.componentType + 'ReportDet'].faddress =
                this.concatAddress(compElement[element.componentType + 'ReportDet'].address as any);
            }
            const data = element.component[index];
            let reportDetData = null; let applicantDetData = null;
            const reportDet = compElement[element.componentType + 'ReportDet'];
            const appliacantDet = compElement[element.componentType + 'ApplicantDet'];

            if (element.componentType === 'drugTest') {
              if (reportDet && reportDet.drugTestResultReport && reportDet.drugTestResultReport.length > 0) {
                this.drugResultTest = reportDet.drugTestResultReport;
              }
            }
            //For Year Of Passing
            if (element.componentType === 'education' && this.finalReport.candidateDetail.ctsflag !== true) {
              summaryData.content = summaryData.content.filter(w => w.caption !== "Month & Year Of Passing")
            }
            summaryData.componentType = element.componentType;
            summaryData.header = element.header;
            if (index === 0) {
              summaryData.header = element.header;
              summaryData.remarks = (data[element.componentType + 'ReportDet'][element.componentType + "ReportContact"]['remarks']);
              summaryData.insuffRaisedFlag = (data[element.componentType + 'ApplicantDet']['insuffRaisedFlag']);
              summaryData.componentStatus = (data[element.componentType + 'ApplicantDet']['componentStatus']);
              summaryData.discrepancyRemarks = (data[element.componentType + 'ApplicantDet']['discrepancyRemarks']);
              summaryData.criminalDatabaseType = (data[element.componentType + 'ApplicantDet']['criminalDatabaseType']);
              summaryData.modeofVerification = (data[element.componentType + 'ReportDet']['modeofVerification']);
              summaryData.colorStatus = (data[element.componentType + 'ReportDet'][element.componentType + "ReportContact"]['colorStatus']);
            }
            if (element.componentType === 'companySiteVisit' || element.componentType === 'socialMedia' || element.componentType === 'employee'
              || element.componentType === 'referenceCheck' || element.componentType === 'education'
              || element.componentType === 'employmentSupervisor' || element.componentType === 'emergencyContactVerification') {
              summaryData.miscRepQns = compElement[element.componentType + 'ReportDet']['miscellaneousQuestion'];
              summaryData.miscAppQns = compElement[element.componentType + 'ApplicantDet']['miscellaneousQuestion'];
              if (element.component[0].displayCaption) {
                if (element.component[0].displayCaption === null) {
                  this.summaryContentList.push(summaryData);
                  return;
                }
                if (element.component[0].displayCaption.length === 0) {
                  this.summaryContentList.push(summaryData);
                  return;
                }
              }
            }
            summaryData.customRepFields = this.finalReport.componentCustomFields.filter(x => x.screeningCompId === element.screeningCompId);
            summaryData.customAppFields = this.finalReport.componentCustomFields.filter(x => x.screeningCompId === element.screeningCompId);
            switch (element.componentType) {
              case 'address': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                reportDetData.addressPCC1 = reportDet['npAddressFlag'] !== true ? this.concatAddress(reportDetData.address) : 'Not Applicable';
                reportDetData.periodOfStay = reportDet['periodOfStay'];
                reportDetData.periodOfStayTo = reportDet['periodOfStayTo'];
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                applicantDetData.periodOfStay = appliacantDet['periodOfStay'];
                applicantDetData.periodOfStayTo = appliacantDet['periodOfStayTo'];
                reportDetData['relationWithCandidate'] = reportDet['relationWithCandidate'];
                break;
              }
              case 'referenceCheck': {
                reportDetData = [reportDet, reportDet[element.componentType + "ReportContact"]].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData =
                  [appliacantDet, appliacantDet[element.componentType + "ApplicantDet"]].reduce(((r, c) => Object.assign(r, c)), {});
                break;
              }
              case 'voterId': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                if (reportDet['voterIdReportContact']['contactDate']) {
                  reportDet['voterIdReportContact']['contactDate'] = '' + (this.commonService.getTimezoneOffset(
                    new Date(reportDet['voterIdReportContact']['contactDate']), false));
                  const conDate = new Date(reportDet['voterIdReportContact']['contactDate']);
                  const newDate = this.commonService.getTimezoneOffset(conDate, true);
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd-MM-yyyy');
                  reportDetData['timeOfVerification'] = this.datePipe.transform(newDate, 'h:mm a');
                }
                break;
              }
              case 'drugTest': {
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                //reportDetData['collectionDate'] = this.commonService.getTimezoneOffset(reportDetData['collectionDate'], false);
                //reportDetData['testDate'] = this.commonService.getTimezoneOffset(reportDetData['testDate'], false);
                //reportDetData['reportDate'] = this.commonService.getTimezoneOffset(reportDetData['reportDate'], false);
                reportDetData['collectionSite'] = reportDet['drugTestReportContact']['collectionSite'];
                reportDetData['specimenId'] = reportDet['drugTestReportContact']['specimenId'];
                break;
              }
              case 'ndotComp': {
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                reportDetData['collectionDate'] = this.commonService.getTimezoneOffset(reportDetData['collectionDate'], false);
                reportDetData['testDate'] = this.commonService.getTimezoneOffset(reportDetData['testDate'], false);
                reportDetData['reportDate'] = this.commonService.getTimezoneOffset(reportDetData['reportDate'], false);
                reportDetData['collectionSite'] = reportDet['ndotCompReportContact']['collectionSite'];
                reportDetData['specimenId'] = reportDet['ndotCompReportContact']['specimenId'];
                break;
              }
              case 'nic': {
                reportDetData = [reportDet, reportDet['nicReportContact']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData = [appliacantDet, appliacantDet['nicReportContact']].reduce(((r, c) => Object.assign(r, c)), {});
                if (reportDet['nicReportContact']['contactDate']) {
                  reportDet['nicReportContact']['contactDate'] = '' + (this.commonService.getTimezoneOffset(
                    new Date(reportDet['nicReportContact']['contactDate']), false));
                  const conDate = new Date(reportDet['nicReportContact']['contactDate']);
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd-MM-yyyy');
                  reportDetData['timeOfVerification'] = this.datePipe.transform(conDate, 'h:mm a');
                }
                break;
              }
              case 'emergencyContactVerification': {
                // tslint:disable-next-line:max-line-length
                reportDetData = [reportDet, reportDet['emergencyContactVerificationReportContact']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData = [appliacantDet, appliacantDet['emergencyContactVerificationReportContact']].reduce(((r, c) =>
                  Object.assign(r, c)), {});
                if (reportDet['emergencyContactVerificationReportContact']['contactDate']) {
                  reportDet['emergencyContactVerificationReportContact']['contactDate'] = '' + (this.commonService.getTimezoneOffset(
                    new Date(reportDet['emergencyContactVerificationReportContact']['contactDate']), false));
                  const conDate = new Date(reportDet['emergencyContactVerificationReportContact']['contactDate']);
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd-MM-yyyy');
                  reportDetData['timeOfVerification'] = this.datePipe.transform(conDate, 'h:mm a');
                }
                break;
              }

              case 'jcr':
              case 'criminalCheckPCC1PCC2':
              case 'criminalCheckPCC3PCC3E': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                break;
              }
              case 'license':
              case 'crc': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                break;
              }
              case 'panIndiaOCRV': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                reportDetData.addressPCC1 = reportDet['npAddressFlag'] !== true ? this.concatAddress(reportDetData.address) : 'Not Applicable';
                reportDetData.periodOfStay = reportDet['periodOfStay'];
                reportDetData.periodOfStayTo = reportDet['periodOfStayTo'];
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                applicantDetData.periodOfStay = appliacantDet['periodOfStay'];
                applicantDetData.periodOfStayTo = appliacantDet['periodOfStayTo'];
                break;
              }
              case 'employee': {
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                // reportDetData['incorporationDate'] = new DatePipe('en-Us').transform(reportDetData['incorporationDate'], 'dd/MM/yyyy');
                // reportDetData['incorporationDate'] = this.commonService.getTimezoneOffset(reportDetData['incorporationDate'], false);
                break;
              }
              default: {
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                break;
              }
            }
            summaryData.allReportDefault = compElement[element.componentType + 'ReportDet'];
            (compElement['displayCaption'] as any).forEach(capttionEl => {
              if (capttionEl.key === 'addressCRC') {
                const rptval = reportDetData['address'] ?
                  (this.concatAddress(reportDetData['address'])) : '';
                const applicanttval = applicantDetData['address'] ?
                  (this.concatAddress(applicantDetData['address'])) : '';
                summaryData.content.push({
                  caption: capttionEl.caption,
                  reportVal: rptval,
                  dataType: capttionEl.dataType,
                  applicanttVal: applicanttval,
                  key: capttionEl.key,
                });
              } else
                if (capttionEl.key === 'candidateName' || capttionEl.key === 'verifiedPerson') {
                  summaryData.content.push({
                    caption: capttionEl.caption,
                    reportVal: (reportDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonFirstName' : 'firstName'] ?
                      ('' + (reportDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonFirstName' : 'firstName'])).trim() : '') +
                      (reportDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonMiddleName' : 'middleName'] ? ' ' +
                        ('' + (reportDetData[capttionEl.key === 'verifiedPerson' ?
                          'verifiedPersonMiddleName' : 'middleName'])).trim() : '') +
                      (reportDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonLastName' : 'lastName'] ? ' ' + ((''
                        + (reportDetData[capttionEl.key ===
                          'verifiedPerson' ? 'verifiedPersonLastName' : 'lastName'])).trim() + ' ') : ''),
                    dataType: capttionEl.dataType,
                    applicanttVal: (applicantDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonFirstName' : 'firstName']
                      ? (applicantDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonFirstName' : 'firstName']) : '') +
                      (applicantDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonMiddleName' : 'middleName']
                        ? ' ' + (applicantDetData[capttionEl.key ===
                          'verifiedPerson' ? 'verifiedPersonMiddleName' : 'middleName']) : '') +
                      (applicantDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonLastName' : 'lastName']
                        ? ' ' + (applicantDetData[capttionEl.key === 'verifiedPerson' ? 'verifiedPersonLastName' : 'lastName']) : ''),
                    key: capttionEl.key,
                  });
                } else {
                  const rptval = reportDetData[capttionEl.key] ?
                    (capttionEl.dataType === 'Date' ? this.retDate(reportDetData[capttionEl.key], 'string') :
                      reportDetData[capttionEl.key]) as any : '';
                  const applicanttval = applicantDetData[capttionEl.key] ?
                    (capttionEl.dataType === 'Date' ? this.retDate(applicantDetData[capttionEl.key], 'string') :
                      applicantDetData[capttionEl.key]) as any : '';
                  summaryData.content.push({
                    caption: capttionEl.caption,
                    reportVal: (capttionEl.key === 'institutionName' || capttionEl.key === 'instituteName') ? applicanttval : rptval,
                    dataType: capttionEl.dataType,
                    applicanttVal: applicanttval,
                    key: capttionEl.key,
                  });
                }
            });
            // }
          });
          if (summaryData.content.length > 0) {
            this.summaryContentList.push(summaryData);
          }
        });
      }
      if (this.finalReport.executiveDetail) {
        this.finalReport.executiveDetail.forEach(element => {
          // tslint:disable-next-line: no-use-before-declare
          const executiveData = new executiveDetailContent();
          executiveData.compId = element.compId;
          executiveData.docContentList = this.docContentList.filter(comp => comp.screeningCompId === element.screeningCompId)
            .sort((a, b) => a.docId - b.docId);
          element.component.forEach((compElement, index) => {
            if (index === 0) { executiveData.header = element.header; }
            compElement.component.forEach((comp: any, ind, totvalue: any) => {
              switch (element.componentType) {
                case 'panIndiaOCRV':
                case 'address':
                case 'crc':
                case 'criminalCheckPCC1PCC2':
                case 'criminalCheckPCC3PCC3E': {
                  totvalue[ind] = [comp, comp['address']].reduce(((r, c) => Object.assign(r, c)), {});
                  break;
                }
              }
            });
            // switch (element.componentType) {
            //   case 'panIndiaOCRV':
            //   case 'address':
            //   case 'crc':
            //   case 'criminalCheckPCC3PCC3E': {
            //     (compElement.component as any)[0] = [(compElement.component as any)[0],
            //     (compElement.component as any)[0]['address']].reduce(((r, c) => Object.assign(r, c)), {});
            //     break;
            //   }
            //   // default: {
            //   //   // element.component = element.component;
            //   //   break;
            //   // }
            // }
            executiveData.component = compElement.component;
            executiveData.componentType = compElement['componentType'];
          });
          this.executiveDetailContentlist.push(executiveData);
        });
      }
    }
  }
  getBriefDetailsFlag(edclComp: any) {
    return edclComp['briefDetails'].some(x => edclComp[x]);
  }
  getDocumentContent(compId: number): docContent[] {
    return this.docContentList.filter(comp => comp.compId === compId);
  }

  retDate(data: any, type: 'string' | 'newDate' | 'currDate'): string | Date {
    data = '' + data + '.000Z';
    const dateValue: Date = data;
    if (type === 'currDate') { return new Date(); }
    // if (new Date(dateValue).getFullYear() <= 1980) {
    //   const dat = this.commonService.getTimezoneOffset(new Date(), false);
    //   if (type === 'string') {
    //     return this.commonService.getTimezoneOffset(dat, false);
    //   } else if (type === 'newDate') {
    //     return dat;
    //   }
    // }
    if (isNaN((new Date(dateValue)).getDate())) {
      const dat = this.commonService.getTimezoneOffset(new Date(), false);
      if (type === 'string') {
        return this.commonService.getTimezoneOffset(dat, false);
      } else if (type === 'newDate') {
        return dat;
      }
    } else {
      const dat = this.commonService.getTimezoneOffset(new Date(dateValue), false);
      if (type === 'string') {
        return this.commonService.getTimezoneOffset(dat, false);
      } else if (type === 'newDate') {
        return dat;
      }
    }
  }

  concatAddress(address: {
    addLine1: string; addLine2: string; addLine3: string;
    city: string; district: string; country: string; place: string; state: string;
    postalCode: string;
  }): string {
    if (address) {
      const city = address.city ? 'Place:' + ' ' + this.retWithComma(address.city) : this.retWithComma(address.city);
      const place = address.place ? 'Village:' + ' ' + this.retWithComma(address.place) : this.retWithComma(address.place);
      return this.retWithComma(address.addLine1) + ' ' +
        this.retWithComma(address.addLine2) + ' ' +
        this.retWithComma(address.addLine3) + ' ' +
        place + ' ' +
        city + ' ' +
        'District:' + ' ' + this.retWithComma(address.district) + ' ' +
        'State:' + ' ' + this.retWithComma(address.state) + ' ' +
        'Country:' + ' ' + this.retWithComma(address.country) + ' ' +
        'Zipcode:' + ' ' + this.retWithComma(address.postalCode, true);
    } else {
      return '';
    }
  }

  retWithComma(data: string, isLast = false): string { return data ? data + (isLast ? '.' : ',') : ''; }

  getAsDateFormat(dateValue: Date): string {
    if (isNaN(dateValue.getDate())) { return 'N/A'; }
    return this.appendZero(dateValue.getDate()) + '/' + this.appendZero(dateValue.getMonth() + 1) + '/' + dateValue.getFullYear();
  }

  appendZero(val: any) { return ('' + val).length === 1 ? '0' + ('' + val) : ('' + val); }
}


class CriminalDatabaseReportDet {
  screeningCriminalCheckRptId: any;
  screeningCriminalCheckId: any;
  screeningComponentId: any;
  firstName: any;
  middleName: any;
  lastName: any;
  dateOfInfoFromPS: any;
  policeStation: any;
  psPhoneNo: any;
  policeOfficerDesig: any;
  court: any;
  jurisdiction: any;
  location: any;
  verificationRemarks: any;
  recordSearchDate: any;
  caseDetailFlag: any;
  underAct: any;
  underSection: any;
  firNo: any;
  year: any;
  disposition: any;
  remarks: any;
  fontColorStatus: any;
  criminalCheckPCC3PCC3EReportContact: {
    screeningRptId: any;
    contactPerson: any;
    contactPersonDesign: any;
    contactEmail: any;
    location: any;
    contactPersonPhone: any;
    contactDate: any;
    verifiedPersonFirstName: any;
    verifiedPersonMiddleName: any;
    verifiedPersonLastName: any;
    verifiedPersonDesign: any;
    remarks: any;
    colorStatus: any;
    colorStatusLookupId: any;
    contactDetail: any;
    responseCommentId: any;
    responseComment: any;
    verificationContactTrans: VerificationContactTrans[];
    screeningReportContactId: any;
    relationWithCandidate: any;
    remarksLookupId: any;
    collectionSite: any;
    specimenId: any;
    reportSignedFlag: any;
    reportDateAvailableFlag: any;
  };
  loggedIn: any;
  address: CommonAddress;
  dateOfBirth: Date;
  fatherName: string;
  verificationStatus: string;
  faddress: string;
}

class VerificationContactTrans {
  screeningContactTransId: number;
  contactId: number;
  contactLookup: string;
  contactLookupId: number;
  contactData: string;
}

class DrugTestReportDet {
  screeningDrugTestRptId: any;
  screeningDrugTestId: any;
  screeningComponentId: any;
  firstName: any;
  middleName: any;
  lastName: any;
  collectionDate: any;
  testDate: any;
  reportDate: any;
  testReason: any;
  testResult: any;
  fontColorStatus: any;
  drugKit: any;
  remarks: any;
  typeOfCheck: any;
  drugTestReportContact: {
    screeningRptId: any;
    contactPerson: any;
    contactPersonDesign: any;
    contactEmail: any;
    location: any;
    contactPersonPhone: any;
    contactDate: any;
    verifiedPersonFirstName: any;
    verifiedPersonMiddleName: any;
    verifiedPersonLastName: any;
    verifiedPersonDesign: any;
    remarks: any;
    colorStatus: any;
    colorStatusLookupId: any;
    contactDetail: any;
    responseCommentId: any;
    responseComment: any;
    verificationContactTrans: any;
    screeningReportContactId: any;
    relationWithCandidate: any;
    remarksLookupId: any;
    collectionSite: any;
    specimenId: any;
    reportSignedFlag: any;
    reportDateAvailableFlag: any;
  };
  loggedIn: any;
  drugTestResultReport: {
    screeningDrugTestResultRptId: any;
    screeningDrugTestId: any;
    drugId: any;
    drugShortCode: any;
    drugName: any;
    drugTestResultLookupId: any;
    drugTestResult: any;
    loggedIn: any;
  }[];
  collectionSite: any;
  specimenId: any;
}
