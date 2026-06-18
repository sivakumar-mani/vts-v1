import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { VerificationService } from '../../../../src/app/common-methods/services/verification.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { FinalReport, summaryContent, executiveDetailContent, docContent, ClientLogoReport } from '../../../../src/app/common-methods/models/reponse-document';
import { CommonAddress } from 'src/app/common-methods/models/common-address';
import { Router } from '@angular/router';
import { W } from '@angular/cdk/keycodes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import moment from 'moment';
import { differenceInCalendarDays } from 'date-fns';
@Component({
  standalone: false,
  selector: 'app-techm-response-document',
  templateUrl: './techm-response-document.component.html',
  styleUrls: ['./techm-response-document.component.css', './techmprint-n.css', './techmprint.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class TechmResponseDocumentComponent implements OnInit, AfterViewInit, OnDestroy {
  briefDetailsList: any[] = [];
  // mergedArrayContentList: any[] = [];
  componentType: string = '';
  isaddressPos = false;
@ViewChild('report', { static: true })
table!: ElementRef<any>;
  finalReport: FinalReport = null;
  summaryContentList: summaryContent[] = [];
  executiveDetailContentlist: executiveDetailContent[] = [];
  documentName: string;
  docContentList: docContent[] = [];
  doaDocumentList: docContent[] = [];
  componentCustomFields: any[] = [];
  remarks = ''; currentDate = new Date();
  annexure = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  docContentPosition = false;
  drugResultTest: any[] = [];
  clientLogoRep: ClientLogoReport;
  clientContact: any;
  clientContactName: any;
  clientCustomField: any[] = [];
  addList: any;
  dataList: any[] = [];
  CompFlag: any;
  verificationDate: any;
  qualificationname: any = '';
  status: string;
  modeofVerification: string;
  safeHtml: SafeHtml;
  dateDifference: any = '';
  crcExeHeader: any = [{ header: 'Civil Proceeding', status: '' }, { header: 'Criminal Proceeding', status: '' }]
  disclaimerContent = `This report is confidential and is meant for the exclusive use of the Client. This report has been prepared solely for the purpose set out pursuant to our letter of engagement 
  (LoE)/Agreement signed with you and is not to be used for any other purpose. The Client recognizes that we are not the source of the data gathered and our reports are based on the information made
  available to us as on the date of this report. Although every effort has been made to ensure accuracy,
  we are not responsible for employment decisions based on the information provided in this report`;
  empExeFromDate: any;
  empExeToDate: any;
  cibilScore: any;
  totalEmpList: any;
  empLength: any;
  iqcFlag: boolean;
  // criminalDatabaseReportDetValue = new CriminalDatabaseReportDet();
  constructor(public verificationService: VerificationService, private datePipe: DatePipe, public router: Router,
    public commonService: CommonService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.finalReport = (this.verificationService.finalReportvalue as any);
    this.dataList = this.finalReport.verificationOnlineDatabaseandCourtdetails.verficationcourtDetails;
    this.CompFlag = this.finalReport.summaryDetail[0].componentType;
    this.colorCode(this.finalReport.finalReportCaseDetails?.reportType, this.finalReport.candidateDetail.colorCode);
    if (this.finalReport.finalReportCaseDetails?.frDate != null) {
      this.finalReport.finalReportCaseDetails.frDate = this.datePipe.transform(this.finalReport.finalReportCaseDetails.frDate, 'dd/MMM/yyyy');
    }
    // this.finalReport.candidateDetail.dateInitiated = '' + (this.commonService.getTimezoneOffset(
    //   new Date(this.finalReport.candidateDetail.dateInitiated), false));
    this.docContentList = this.finalReport.document;
    this.doaDocumentList = this.finalReport.candidateDetail.doaDocument;
    this.iqcFlag = this.finalReport.candidateDetail.iqcFlag;
    this.verificationService.clientId = this.verificationService.finalReportvalue.candidateDetail.clientId;
    this.documentName = '';
    window.scrollTo(0, 0);
    this.docContentPosition = this.finalReport.candidateDetail.reportLookName === 'Executive Summary-All Summary Details-All Annexure';
    this.genrateData();
    if (this.finalReport.clientCustomFields.length > 0) {
      for (let i = 0; i < this.finalReport.clientCustomFields.length; i += 2) {
        this.clientCustomField.push(this.finalReport.clientCustomFields.slice(i, i + 2));
      }
    }
    if (this.finalReport.componentCustomFields.length > 0) {
      for (let i = 0; i < this.finalReport.componentCustomFields.length; i += 2) {
        this.componentCustomFields.push(this.finalReport.componentCustomFields.slice(i, i + 2));
      }
    }
  }

  ngAfterViewInit(): void {

    // if (this.verificationService.reportType === 'download' && this.verificationService.fromQC) {
    //below or(||) condition has added because of while preview, for both autoIQC && auto FQC config case report header not showing properly issue.
    if (this.verificationService.reportType === 'download' || (this.verificationService.enableAutoIqc === true && this.verificationService.enableAutoFqc === true && this.verificationService.reportType == 'preview')) {
      this.verificationService.generatePdfDocContent();
    }
    this.clientLogoRep = (this.verificationService.clientLogoaddress as any);
    if (this.clientLogoRep && this.clientLogoRep.clientContact.length > 0) {
      this.clientContactName = this.clientLogoRep.clientContact;
    }
  }

  colorCode(reportType, color) {
    if (reportType == 'Interim Report') {
      switch (color) {
        case 'Red': this.finalReport.candidateDetail.colorCode = 'IR- Red'; break;
        case 'Amber': this.finalReport.candidateDetail.colorCode = 'IR – Amber'; break;
        case 'Orange': this.finalReport.candidateDetail.colorCode = 'IR – Amber'; break;
        case 'Green': this.finalReport.candidateDetail.colorCode = 'IRCEP'; break;
        default: break;
      }
    } else {
      switch (color) {
        case 'Red': this.finalReport.candidateDetail.colorCode = 'Red- Discrepancy'; break;
        case 'Amber': this.finalReport.candidateDetail.colorCode = 'Amber – Unable to verify'; break;
        case 'Orange': this.finalReport.candidateDetail.colorCode = 'Amber – Unable to verify'; break;
        default: break;
      }
    }
  }
  getEmployeeFlag() {
    return this.summaryContentList.some(x => x.allReportDefault && x.allReportDefault.employmentType === 'Current');
  }
  ngOnDestroy(): void {
    this.verificationService.fromQC = false;
  }

  getExecutiveSummaryHeader(executiveDetailContent: any) {
    let unique_values = executiveDetailContent
      .map((item) => item.componentType)
      .filter(
        (value, index, current_value) => current_value.indexOf(value) === index
      );
    return unique_values;
  }

  getExecutiveSummarydetails(executiveDetailContent, type) {
    let unique_values: any[] = [];
    unique_values = executiveDetailContent.filter(
      e => e.componentType == type
    );
    return unique_values;
  }

  getDisclaimerReportHeaderName() {
    let string = '';
    if ((this.verificationService.screeningId > 0 &&
      this.verificationService.suppReportType !== 'interim' && this.verificationService.suppReportType !== 'iqcinterim' &&
      this.verificationService.suppReportType !== 'supplementary' && this.verificationService.individualQc === 0) || (this.verificationService.ReportTitle =='FinalReport')) {
      string = "End of Final Background Report";
    } else if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || (this.verificationService.screeningId === 0 && this.verificationService.suppReportType !== 'supplementary' &&
      (!this.finalReport.candidateDetail.caseByPassFlag || !this.finalReport.candidateDetail.iqcByPassFlag))) && this.verificationService.individualQc === 0 && !this.getHeader()) {
      string = "End of Interim Report";
    } else if (((this.router.url.includes('verificationDetail') || this.router.url.includes('qualityCheckDetail')) && this.verificationService.individualQc === 1) || this.verificationService.prebothconfigFlag === true) {
      string = "End of Individual Report";
    } else {
      if ((this.verificationService.suppReportType === 'supplementary') && !this.getHeader()) {
        string = " End of Supplementary Report";
      }
    }
    return string;
  }
  getHeader() {
    return (((this.finalReport.candidateDetail.reOpenFlag === true || this.finalReport.candidateDetail.subCheckFlag === true) &&
      this.router.url.includes('qualityCheckDetail')) || this.router.url.includes('verificationDetail'));
  }
  getClientAddressFormatted(): string {

    if (this.clientLogoRep.clientAddress) {
      const addressParts: string[] = [
        this.clientLogoRep.clientAddress.addLine1,
        this.clientLogoRep.clientAddress.addLine2 ? ',' + this.clientLogoRep.clientAddress.addLine2 : '',
        this.clientLogoRep.clientAddress.addLine3 ? ',' + this.clientLogoRep.clientAddress.addLine3 : '',
        ',' + this.clientLogoRep.clientAddress.place,
        ',' + this.clientLogoRep.clientAddress.city,
        ',' + this.clientLogoRep.clientAddress.district,
        ',' + this.clientLogoRep.clientAddress.state,
        ',' + this.clientLogoRep.clientAddress.country,
        ',' + this.clientLogoRep.clientAddress.postalCode
      ];

      return addressParts.join('');
    } else {
      return 'N/A';
    }
  }
  getClientDetails(client): { label: string, value: string } {
    let label = '';
    let value = '';

    switch (client.lookUpName) {
      case 'Mobile Phone':
        label = 'Tel:';
        value = client.lookUpValue;
        break;
      case 'Fax':
        label = 'Fax:';
        value = client.lookUpValue;
        break;
      case 'Email':
        label = 'Email:';
        value = client.lookUpValue;
        break;
      case 'Website':
        label = 'Website:';
        value = client.lookUpValue;
        break;
      default:
        break;
    }

    return { label, value };
  }
  genrateData() {
    if (this.finalReport) {
      // LOA annexure details by naveen
      if (this.finalReport.candidateDetail.doaDocument) {
        let annexDoaIndex = 0;
        this.finalReport.candidateDetail.doaDocument.forEach((element: any) => {
          this.doaDocumentList = this.doaDocumentList.sort((a, b) => a.docId - b.docId);
          this.doaDocumentList.forEach(e => {
            e.annexureVal = this.annexure[annexDoaIndex];
            if (annexDoaIndex < 26) { annexDoaIndex++; } else { annexDoaIndex = 0; }
          });
        })
        this.doaDocumentList = this.doaDocumentList.filter(e => e.documentType == "BGV");
      }
      if (this.finalReport.summaryDetail) {
        let annexNameIndex = 0;
        this.finalReport.summaryDetail.forEach((element: any) => {
          // tslint:disable-next-line: no-use-before-declare
          const summaryData = new summaryContent();
          // if (element.header == "OFAC" || element.componentType == "address" || element.componentType == "creditverification" || element.componentType == "panIndiaOCRV" || element.componentType == "criminalCheckPCC1PCC2" || element.componentType == "criminalCheckPCC3PCC3E" || element.componentType == "crc") {
          if (element.header == "OFAC" || element.componentType == "address" || element.componentType == "creditverification" || element.componentType == "panIndiaOCRV" || element.componentType == "criminalCheckPCC3PCC3E" || element.componentType == "crc") {
            const duFlag = element.component[0].displayCaption.filter(s => s.caption === "Duration")
            if (duFlag.length == 0 && element.component[0].isAdditionalPos == true) {
              element.component[0].displayCaption.push({
                caption: "Duration",
                dataType: null,
                key: "posDuration",
                maxLength: 200,
                required: true
              })
            } else if (element.component[0].isAdditionalPos != true) {
              element.component[0].displayCaption.push({
                caption: "Period Of Stay From",
                dataType: null,
                key: "periodOfStay",
                maxLength: 50,
                required: true
              }, {
                  caption: "Period Of Stay To",
                  dataType: null,
                  key: "periodOfStayTo",
                  maxLength: 50,
                  required: true
                })

            }
          }
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
              this.isaddressPos = element.component[0].isAdditionalPos;
              compElement[element.componentType + 'ReportDet'].faddress =
                this.concatAddress(compElement[element.componentType + 'ReportDet'].address as any);
              if (element.component[0].isAdditionalPos == true) {
                var Pdate = compElement[element.componentType + 'ReportDet'].address != null ? compElement[element.componentType + 'ReportDet'].address.posDuration : 'N/A';
                if (Pdate) {
                  Pdate = Pdate.replace('<center>', '');
                  Pdate = Pdate.replace('</center>', '');
                  Pdate = Pdate.replace('<br>', '');
                  Pdate = Pdate.replace('</br>', '');
                  if (compElement[element.componentType + 'ReportDet'].address != null) {
                    compElement[element.componentType + 'ReportDet'].address.posDuration = Pdate != '' ? Pdate : "Not Applicable";
                  }

                }
              }
            }
            const data = element.component[index];
            let reportDetData = null; let applicantDetData = null;
            const reportDet = compElement[element.componentType + 'ReportDet'];
            const appliacantDet = compElement[element.componentType + 'ApplicantDet'];

            // if (element.componentType === 'drugTest') {
            //   if (reportDet && reportDet.drugTestResultReport && reportDet.drugTestResultReport.length > 0) {
            //     this.drugResultTest = reportDet.drugTestResultReport;
            //   }
            // }
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
              summaryData.caseDetailFlag = (data[element.componentType + 'ReportDet']['caseDetailFlag']);
              summaryData.currentEmpFlag = (data[element.componentType + 'ApplicantDet']['currentEmpFlag']);
              summaryData.screeningStatus = (data[element.componentType + 'ApplicantDet']['screeningStatus']);
              summaryData.cvValidation = (data[element.componentType + 'ApplicantDet']['compRef']);
              summaryData.gapRemarks = (data[element.componentType + 'ApplicantDet']['gapRemarks']);
              summaryData.cVRemarks = (data[element.componentType + 'ApplicantDet']['cVRemarks']);
              summaryData.colorStatus = (data[element.componentType + 'ReportDet'][element.componentType + "ReportContact"]['colorStatus']);
              summaryData.screeningReportContactId = (data[element.componentType + 'ReportDet'][element.componentType + "ReportContact"]['screeningReportContactId']);
            }
            if (element.componentType === 'companySiteVisit' || element.componentType === 'employee'
              || element.componentType === 'criminalCheckPCC1PCC2'
              || element.componentType === 'employmentHrAndSupervisor'
              || element.componentType === 'referenceCheck' || element.componentType === 'education'
              || element.componentType === 'employmentSupervisor' || element.componentType === 'referenceSelfEmployed'
              || element.componentType === 'emergencyContactVerification') {
              summaryData.miscRepQns = compElement[element.componentType + 'ReportDet']['miscellaneousQuestion'];
              summaryData.miscAppQns = compElement[element.componentType + 'ApplicantDet']['miscellaneousQuestion']
              if (element.component[0].displayCaption) {
                if (element.component[0].displayCaption === null || element.component[0].displayCaption.length === 0) {
                  this.summaryContentList.push(summaryData);
                  return;
                }
              }

            }
            this.componentType = element.componentType;
            summaryData.customRepFields = this.finalReport.componentCustomFields.filter(x => x.screeningCompId === element.screeningCompId);
            summaryData.customAppFields = this.finalReport.componentCustomFields.filter(x => x.screeningCompId === element.screeningCompId);
            switch (element.componentType) {

              case 'address': {
                summaryData.reportContact.push(compElement[element.componentType + 'ReportDet']['addressReportContact']);
                summaryData.allReportDefault = compElement[element.componentType + 'ReportDet'];
                summaryData.allReportDefault.verificationDate = this.datePipe.transform(compElement[element.componentType + 'ReportDet'].verificationDate, 'dd/MMM/yyyy');
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                reportDetData.addressPCC1 = reportDet['npAddressFlag'] !== true ? this.concatAddress(reportDetData.address) : 'Not Applicable';
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                
                // VTS2-2024-DE-0169 - Need to create provisioning to add multiple POS for address and Criminal components, refer the SRS for detailed requirement - Added By Naveen
                if (element.component[0].isAdditionalPos != true) {
                  if (appliacantDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                      applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                  if (reportDet['address'] != null) {
                    if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                } else if (element.component[0].isAdditionalPos == true) {
                  // if (appliacantDet['address'] != null) {
                  //   if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                  //     applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                  //     applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                  //   }
                  // }
                  // if (reportDet['address'] != null) {
                  //   if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                  //     reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                  //     reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                  //   }
                  // }
                  if (appliacantDet['address'] != null && reportDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0 && reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      appliacantDet['address']['addressPos'].forEach((ele, index) => {
                        const reportEle = reportDet['address']['addressPos'][index];
                        summaryData.posDetails.push({
                          caption: 'Period of stay (From)' + ' ' + (index + 1),
                          reportVal: reportEle.periodOfStay ? typeof reportEle.periodOfStay === 'string' || reportEle.periodOfStay === null || reportEle.periodOfStay === undefined || reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? reportEle.periodOfStay : this.datePipe.transform(reportEle.periodOfStay, 'dd/MMM/yyyy') : 'Not Provided',
                          applicanttVal: ele.periodOfStay ? typeof ele.periodOfStay === 'string' || ele.periodOfStay === null || ele.periodOfStay === undefined || ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? ele.periodOfStay : this.datePipe.transform(ele.periodOfStay, 'dd/MMM/yyyy') : 'Not Provided',
                        });
                        summaryData.posDetails.push({
                          caption: 'Period of stay (To)' + ' ' + (index + 1),
                          reportVal: reportEle.periodOfStayTo ? typeof reportEle.periodOfStayTo === 'string' || reportEle.periodOfStayTo === null || reportEle.periodOfStayTo === undefined || reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? reportEle.periodOfStayTo : this.datePipe.transform(reportEle.periodOfStayTo, 'dd/MMM/yyyy') : 'Not Provided',
                          applicanttVal: ele.periodOfStayTo ? typeof ele.periodOfStayTo === 'string' || ele.periodOfStayTo === null || ele.periodOfStayTo === undefined || ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? ele.periodOfStayTo : this.datePipe.transform(ele.periodOfStayTo, 'dd/MMM/yyyy') : 'Not Provided',
                        });
                      });
                    }
                  }
                }
                reportDetData['relationWithCandidate'] = reportDet['relationWithCandidate'];
                summaryData.miscRepQns = compElement[element.componentType + 'ReportDet']['miscellaneousQuestion'];
                summaryData.miscAppQns = compElement[element.componentType + 'ApplicantDet']['miscellaneousQuestion']
                break;
              }
              case 'creditVerification': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                this.cibilScore = reportDetData.cibilScore;
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                reportDetData.addressPCC1 = reportDet['npAddressFlag'] !== true ? this.concatAddress(reportDetData.address) : 'Not Applicable';
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                reportDetData['relationWithCandidate'] = reportDet['relationWithCandidate'];
                if (element.component[0].isAdditionalPos == true) {
                  reportDetData.posDuration = reportDet['address'] != null ? reportDet['address']['posDuration'] != '' ? reportDet['address']['posDuration'] : 'Not Applicable' : 'N/A';
                  applicantDetData.posDuration = appliacantDet['address'] != null ? appliacantDet['address']['posDuration'] : 'N/A';
                } else if (element.component[0].isAdditionalPos != true) {
                  if (appliacantDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                      applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                  if (reportDet['address'] != null) {
                    if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                }
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
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd/MMM/yyyy');
                  //reportDetData['timeOfVerification'] = this.datePipe.transform(newDate, 'h:mm a');
                }
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
              case 'drugTest': {
                // let desiredArray: any[] = [];
                // const objectMap = new Map();
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                reportDetData['collectionSite'] = reportDet['drugTestReportContact']['collectionSite'];
                reportDetData['specimenId'] = reportDet['drugTestReportContact']['specimenId'];
                if (reportDetData.drugTestResultReport != null) {
                  let newCaptions = { 'Marijuana': 'Marijuana (Cannabinoids)', 'Phencyclidine': 'Phencyclidine (PCP)', 'Opiates / Morphine': 'Opiates', 'Cannabinoids': 'Cannabinoids',}
                  reportDetData.drugTestResultReport.forEach((summary, index) => {
                    let caption = summary.drugName;
                    if (newCaptions.hasOwnProperty(caption)) {
                      summary.drugName = newCaptions[caption];
                    }
                  })
                  reportDetData.drugTestResultReport = reportDetData.drugTestResultReport.filter(item => item !== undefined);
                };
                // desiredArray = ['Amphetamines', 'Cocaine', 'Marijuana (Cannabinoids)', 'Phencyclidine (PCP)', 'Opiates'];
                // reportDetData.drugTestResultReport.forEach(item => {
                //   let key = (item.key || item.fieldName || item.drugName).toString().toLowerCase().replace(/\s+/g, '');
                //   objectMap.set(key, item);
                // });
                // reportDetData.drugTestResultReport = desiredArray.map(key => {
                //   let loweredKey = key.toString().toLowerCase().replace(/\s+/g, '');
                //   return objectMap.get(loweredKey)
                // });                
                break;
              }
              case 'nic': {
                reportDetData = [reportDet, reportDet['nicReportContact']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData = [appliacantDet, appliacantDet['nicReportContact']].reduce(((r, c) => Object.assign(r, c)), {});
                if (reportDet['nicReportContact']['contactDate']) {
                  reportDet['nicReportContact']['contactDate'] = '' + (this.commonService.getTimezoneOffset(
                    new Date(reportDet['nicReportContact']['contactDate']), false));
                  const conDate = new Date(reportDet['nicReportContact']['contactDate']);
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd/MMM/yyyy');
                  //reportDetData['timeOfVerification'] = this.datePipe.transform(conDate, 'h:mm a');
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
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd/MMM/yyyy');
                  reportDetData['timeOfVerification'] = this.datePipe.transform(conDate, 'h:mm a');
                }
                break;
              }
              case 'jcr':
              case 'criminalDatabase': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);

                this.addList = reportDetData.addressPCC1;
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);

                if (element.header == "OFAC" && element.component[0].isAdditionalPos != true) {
                  if (appliacantDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                      applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                  if (reportDet['address'] != null) {
                    if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                } else if (
                  element.header == "OFAC" && element.component[0].isAdditionalPos == true) {
                  reportDetData.posDuration = reportDet['address'] != null ? reportDet['address']['posDuration'] != '' ? reportDet['address']['posDuration'] : 'Not Applicable' : 'N/A';
                  applicantDetData.posDuration = appliacantDet['address'] != null ? appliacantDet['address']['posDuration'] : 'N/A';
                }
                break;
              }

              // case 'criminalCheckPCC1PCC2':
              case 'criminalCheckPCC3PCC3E': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                if (element.component[0].isAdditionalPos == true) {
                  reportDetData.posDuration = reportDet['address'] != null ? reportDet['address']['posDuration'] != '' ? reportDet['address']['posDuration'] : 'Not Applicable' : 'N/A';
                  applicantDetData.posDuration = appliacantDet['address'] != null ? appliacantDet['address']['posDuration'] : 'N/A';
                } else if (element.component[0].isAdditionalPos != true) {
                  if (appliacantDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                      applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                  if (reportDet['address'] != null) {
                    if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                }
                break;
              }

              // VTS2-2024-DE-0169 - Need to create provisioning to add multiple POS for address and Criminal components, refer the SRS for detailed requirement - Added By Naveen
              case 'criminalCheckPCC1PCC2': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                // if (element.component[0].isAdditionalPos != true) {
                //   if (appliacantDet['address'] != null) {
                //     if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                //       applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                //       applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                //     }
                //   }
                //   if (reportDet['address'] != null) {
                //     if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                //       reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                //       reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                //     }
                //   }
                // } else if (element.component[0].isAdditionalPos == true) {
                  if (appliacantDet['address'] != null && reportDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0 && reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      appliacantDet['address']['addressPos'].forEach((ele, index) => {
                        const reportEle = reportDet['address']['addressPos'][index];
                        summaryData.posDetails.push({
                          caption: 'Period of stay (From)' + ' ' + (index + 1),
                          reportVal: reportEle.periodOfStay ? typeof reportEle.periodOfStay === 'string' || reportEle.periodOfStay === null || reportEle.periodOfStay === undefined || reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? reportEle.periodOfStay : this.datePipe.transform(reportEle.periodOfStay, 'dd/MMM/yyyy') : 'Not Provided',
                          applicanttVal: ele.periodOfStay ? typeof ele.periodOfStay === 'string' || ele.periodOfStay === null || ele.periodOfStay === undefined || ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? ele.periodOfStay : this.datePipe.transform(ele.periodOfStay, 'dd/MMM/yyyy') : 'Not Provided',
                        });
                        summaryData.posDetails.push({
                          caption: 'Period of stay (To)' + ' ' + (index + 1),
                          reportVal: reportEle.periodOfStayTo ? typeof reportEle.periodOfStayTo === 'string' || reportEle.periodOfStayTo === null || reportEle.periodOfStayTo === undefined || reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? reportEle.periodOfStayTo : this.datePipe.transform(reportEle.periodOfStayTo, 'dd/MMM/yyyy') : 'Not Provided',
                          applicanttVal: ele.periodOfStayTo ? typeof ele.periodOfStayTo === 'string' || ele.periodOfStayTo === null || ele.periodOfStayTo === undefined || ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? ele.periodOfStayTo : this.datePipe.transform(ele.periodOfStayTo, 'dd/MMM/yyyy') : 'Not Provided',
                        });
                      });
                    }
                  }
                // }
                break;
              }

              case 'crc': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                summaryData.repcityName = reportDet['address']['district'];
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                summaryData.appcityName = appliacantDet['address']['district'];
                summaryData.reportContact.push(compElement[element.componentType + 'ReportDet']['crcReportContact']);
                // summaryData.verificationDate = this.commonService.getTimezoneOffset(compElement[element.componentType + 'ReportDet'].verificationDate, true);                
                // summaryData.verificationDate.setHours(summaryData.verificationDate.getHours() + 1);
                summaryData.verificationDate = new Date(compElement[element.componentType + 'ReportDet'].verificationDate);
                summaryData.verificationDate.setHours(summaryData.verificationDate.getHours() + 5);
                summaryData.verificationDate.setMinutes(summaryData.verificationDate.getMinutes() + 30);
                summaryData.verificationDate = this.datePipe.transform(summaryData.verificationDate, 'dd/MMM/yyyy HH:mm:ss a');
                // if (element.component[0].isAdditionalPos != true) {
                //   reportDetData.posDuration = reportDet['address'] != null ? reportDet['address']['posDuration'] != '' ? reportDet['address']['posDuration'] : 'Not Applicable' : 'N/A';
                //   applicantDetData.posDuration = appliacantDet['address'] != null ? appliacantDet['address']['posDuration'] : 'N/A';
                // } else if (element.component[0].isAdditionalPos == true) {
                  // if (appliacantDet['address'] != null) {
                  //   if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                  //     applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                  //     applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                  //   }
                  // }
                  // if (reportDet['address'] != null) {
                  //   if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                  //     reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                  //     reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                  //   }
                  // }

                  // VTS2-2024-DE-0169 - Need to create provisioning to add multiple POS for address and Criminal components, refer the SRS for detailed requirement - Added By Naveen
                  if (appliacantDet['address'] != null && reportDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0 && reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      appliacantDet['address']['addressPos'].forEach((ele, index) => {
                        const reportEle = reportDet['address']['addressPos'][index];
                        summaryData.posDetails.push({
                          caption: 'Period of stay (From)' + ' ' + (index + 1),
                          reportVal: reportEle.periodOfStay ? typeof reportEle.periodOfStay === 'string' || reportEle.periodOfStay === null || reportEle.periodOfStay === undefined || reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            reportEle.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? reportEle.periodOfStay : this.datePipe.transform(reportEle.periodOfStay, 'dd/MMM/yyyy') : 'Not Provided',
                          applicanttVal: ele.periodOfStay ? typeof ele.periodOfStay === 'string' || ele.periodOfStay === null || ele.periodOfStay === undefined || ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            ele.periodOfStay.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? ele.periodOfStay : this.datePipe.transform(ele.periodOfStay, 'dd/MMM/yyyy') : 'Not Provided',
                        });
                        summaryData.posDetails.push({
                          caption: 'Period of stay (To)' + ' ' + (index + 1),
                          reportVal: reportEle.periodOfStayTo ? typeof reportEle.periodOfStayTo === 'string' || reportEle.periodOfStayTo === null || reportEle.periodOfStayTo === undefined || reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            reportEle.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? reportEle.periodOfStayTo : this.datePipe.transform(reportEle.periodOfStayTo, 'dd/MMM/yyyy') : 'Not Provided',
                          applicanttVal: ele.periodOfStayTo ? typeof ele.periodOfStayTo === 'string' || ele.periodOfStayTo === null || ele.periodOfStayTo === undefined || ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
                            || ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
                            ele.periodOfStayTo.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? ele.periodOfStayTo : this.datePipe.transform(ele.periodOfStayTo, 'dd/MMM/yyyy') : 'Not Provided',
                        });
                      });
                    }
                  }
                // }
                break;
              }
              case 'license':
                {
                  reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                  applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                  summaryData.allReportDefault = compElement[element.componentType + 'ReportDet'];
                  summaryData.customAppFields[1].fieldValue = this.datePipe.transform(summaryData.customAppFields[1].fieldValue, 'dd/MMM/yyyy');
                  summaryData.customRepFields[1].fieldValue = this.datePipe.transform(summaryData.customRepFields[1].fieldValue, 'dd/MMM/yyyy');
                  break;
                }
              case 'pan':
                {
                  reportDetData = reportDet;
                  applicantDetData = appliacantDet;
                  summaryData.allReportDefault = compElement[element.componentType + 'ReportDet'];
                  reportDetData.dob = this.datePipe.transform(reportDet.dob, 'dd/MMM/yyyy');
                  applicantDetData.dob = this.datePipe.transform(appliacantDet.dob, 'dd/MMM/yyyy');
                  summaryData.allReportDefault.verificationDate = this.datePipe.transform(compElement[element.componentType + 'ReportDet'].verificationDate, 'dd/MMM/yyyy');
                  break;
                }
              case 'panIndiaOCRV': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                reportDetData.addressPCC1 = this.concatAddress(reportDetData.address);
                reportDetData.addressPCC1 = reportDet['npAddressFlag'] !== true ? this.concatAddress(reportDetData.address) : 'Not Applicable';
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData.addressPCC1 = this.concatAddress(applicantDetData.address);
                if (element.component[0].isAdditionalPos == true) {
                  reportDetData.posDuration = reportDet['address'] != null ? reportDet['address']['posDuration'] != '' ? reportDet['address']['posDuration'] : 'Not Applicable' : 'N/A';
                  applicantDetData.posDuration = appliacantDet['address'] != null ? appliacantDet['address']['posDuration'] : 'N/A';
                } else if (element.component[0].isAdditionalPos != true) {
                  if (appliacantDet['address'] != null) {
                    if (appliacantDet['address']['addressPos'] != null && appliacantDet['address']['addressPos'].length > 0) {
                      applicantDetData.periodOfStay = appliacantDet['address']['addressPos'][0]['periodOfStay'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      applicantDetData.periodOfStayTo = appliacantDet['address']['addressPos'][0]['periodOfStayTo'] != null ? appliacantDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                  if (reportDet['address'] != null) {
                    if (reportDet['address']['addressPos'] != null && reportDet['address']['addressPos'].length > 0) {
                      reportDetData.periodOfStay = reportDet['address']['addressPos'][0]['periodOfStay'] != null ? reportDet['address']['addressPos'][0]['periodOfStay'] : 'N/A';
                      reportDetData.periodOfStayTo = reportDet['address']['addressPos'][0]['periodOfStayTo'] != null ? reportDet['address']['addressPos'][0]['periodOfStayTo'] : 'N/A';
                    }
                  }
                }
                break;
              }
              case 'employee': {
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                summaryData.reportContact.push(compElement[element.componentType + 'ReportDet']['employeeReportContact']);
                summaryData.allReportDefault = compElement[element.componentType + 'ReportDet'];
                // this.empExeFromDate = compElement[element.componentType + 'ReportDet'].fromDate;
                // this.empExeToDate = compElement[element.componentType + 'ReportDet'].toDate;
                summaryData.allReportDefault.verificationDate = this.datePipe.transform(compElement[element.componentType + 'ReportDet'].verificationDate, 'dd/MMM/yyyy');
                break;
              }
              case 'education': {
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                this.qualificationname = compElement[element.componentType + 'ReportDet'].degree;
                break;
              }
              case 'socialMedia': {
                summaryData.miscRepQns = compElement[element.componentType + 'ReportDet']['miscellaneousQuestion'];
                summaryData.miscAppQns = compElement[element.componentType + 'ApplicantDet']['miscellaneousQuestion']
                if (element.component[0].displayCaption) {
                  if (element.component[0].displayCaption) {
                    this.summaryContentList.push(summaryData);
                    return;
                  }
                  if (element.component[0].displayCaption.length !== 0) {
                    summaryData.allReportDefault = compElement[element.componentType + 'ReportDet'];
                    this.summaryContentList.push(summaryData);
                    return;
                  }
                }
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
              if (capttionEl.key === 'addressCRC' || capttionEl.key === 'addressLicense' || capttionEl.key === 'addressCredit') {
                let rptval: any;
                let applicanttval: any;
                if (summaryData.componentType === 'creditVerification' && capttionEl.key === 'addressCredit') {
                  rptval = reportDetData['address'].country ? reportDetData['address'].country : 'N/A';
                  applicanttval = applicantDetData['address'].country ? applicantDetData['address'].country : 'N/A';
                } else {
                  rptval = reportDetData['address'] ?
                    (this.concatAddress(reportDetData['address'])) : '';
                  applicanttval = applicantDetData['address'] ?
                    (this.concatAddress(applicantDetData['address'])) : '';
                }
                summaryData.content.push({
                  caption: capttionEl.caption,
                  reportVal: rptval,
                  dataType: capttionEl.dataType,
                  applicanttVal: applicanttval,
                  key: capttionEl.key,
                });
              } else if (capttionEl.key === 'candidateName' || capttionEl.key === 'verifiedPerson') {
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
              }
              else {
                const rptval = reportDetData[capttionEl.key] ?
                  (reportDetData[capttionEl.key]) as any : '';
                const applicanttval = applicantDetData[capttionEl.key] ?
                  //capttionEl.dataType === 'Date' ? this.retDate(applicantDetData[capttionEl.key], 'string') :
                  (applicantDetData[capttionEl.key]) as any : '';
                summaryData.content.push({
                  caption: capttionEl.caption,
                  reportVal: (capttionEl.key === 'institutionName' && summaryData.componentType !== 'education') || (capttionEl.key === 'instituteName' && summaryData.componentType !== 'education') ? applicanttval : rptval,
                  dataType: capttionEl.dataType,
                  applicanttVal: applicanttval,
                  key: capttionEl.key,
                });
              }
            });
            // }
          });
          if (summaryData.content.length > 0) {
            if (summaryData.componentType === "education" && this.finalReport.candidateDetail.ctsflag === true) {
              summaryData.content = summaryData.content.filter(w => w.caption != "Major" && w.caption != "Certificate Issued Date")
            }
            if (summaryData.componentType === 'education' && this.finalReport.candidateDetail.ctsflag !== true) {
              summaryData.content = summaryData.content.filter(w => w.caption !== "Month & Year Of Passing")
            }
            if (summaryData.componentType === "employee" && this.finalReport.candidateDetail.cinflag === true) {
              summaryData.content = summaryData.content.filter(w => w.caption != "CIN")
            }
            if (summaryData.componentType === "employee" && this.finalReport.candidateDetail.rocflag === true) {
              summaryData.content = summaryData.content.filter(w => w.caption != "ROC Code")
            }
            if (summaryData.componentType === "employee" && this.finalReport.candidateDetail.incorporationFlag === true) {
              summaryData.content = summaryData.content.filter(w => w.caption != "Date of Incorporation")
            }
            if (summaryData.componentType == "creditVerification") {
              summaryData.content = summaryData.content.filter(w => w.caption != "Credit Verification Remarks" && w.caption != "Scoring Factors"
                && w.caption != "Personal Loan Score" && w.caption != "Scoring Factors"
                && w.caption != "Credit Loan Score" && w.caption != "Pan Number" && w.caption != "Candidate Name")

            }
            if (summaryData.componentType === "education") {
              summaryData.content = summaryData.content.filter(w => w.key == "degree" || w.key == "courseCompletion"
                || w.key == "institutionName" || w.key === "instituteName")
              let newCaptions = {
                'Degree': 'Complete name of Qualification / Degree Attained',
                'Month & Year Of Course Completion': 'Year of Passing',
                'University / Board Name': 'University Name',
                'Institute Name': 'School / College / Institution attended (full name)'
              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
                // if (summary.key == 'courseCompletion' && summary.applicanttVal != null) {
                //   summary.applicanttVal = this.datePipe.transform(summary.applicanttVal, 'dd/MMM/yyyy');
                // }
                // if (summary.key == 'courseCompletion' && summary.reportVal != null) {
                //   summary.reportVal = this.datePipe.transform(summary.reportVal, 'dd/MMM/yyyy');
                // }
              })
            }
            if (summaryData.componentType === "license") {
              summaryData.content = summaryData.content.filter(w => w.key != "issuingAuthority" && w.key != "validFrom" && w.key != "validTo")
              let newCaptions = {
                'Candidate Name': 'Name of the candidate',
                'License Number': 'Driving license number',
              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
              })
            }
            if (summaryData.componentType === "employee") {
              summaryData.content = summaryData.content.filter(w => w.caption == "Company Name" || w.caption == "To Date" || w.caption == "From Date" || w.caption == "Employee ID" || w.caption == "Designation"
                || w.caption == "Reason For Leaving" || w.caption == "CTC"
              )
              let newCaptions = {
                'CTC': 'Remuneration : CTC/Net (Any one)',
                'Company Name': 'Employer Name',
                'From Date': ' Period of Employment (As per BVF)',
                'To Date': ' Period of Employment (As per document)',
              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
                // if (summary.key == 'fromDate' && summary.applicanttVal != null) {
                //   summary.applicanttVal = this.datePipe.transform(summary.applicanttVal, 'dd/MMM/yyyy');
                // }
                // if (summary.key == 'fromDate' && summary.reportVal != null) {
                //   summary.reportVal = this.datePipe.transform(summary.reportVal, 'dd/MMM/yyyy');
                // }
                // if (summary.key == 'toDate' && summary.applicanttVal != null && summary.applicanttVal.toString().toLowerCase().replace(/\s+/g, '') != 'tilldate') {
                //   summary.applicanttVal = this.datePipe.transform(summary.applicanttVal, 'dd/MMM/yyyy');
                // }
                // if (summary.key == 'toDate' && summary.reportVal != null && summary.reportVal.toString().toLowerCase().replace(/\s+/g, '') != 'tilldate') {
                //   summary.reportVal = this.datePipe.transform(summary.reportVal, 'dd/MMM/yyyy');
                // }
              })
            }

            if (summaryData.componentType === "pan") {
              summaryData.content = summaryData.content.filter(w => w.caption == "Candidate Name" || w.caption == "Date of Birth" || w.caption == "Identification Number"
              )
              let newCaptions = {
                'Candidate Name': 'Name as per pan card',
                'Date of Birth': 'Date of Birth',
                'Identification Number': 'Pan Card number',

              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
              })
            }
            if (summaryData.componentType === "referenceCheck") {
              summaryData.content = summaryData.content.filter(w => w.caption == "Referee Name" || w.caption == "Company name and Designation of the reference" || w.caption == "Contact Details"
              )
              let newCaptions = {
                'Referee Name': 'Name of  the Reference',
                'Contact Details': 'Contact number of the reference',
              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
              })
            } if (summaryData.componentType === "drugTest") {
              let newCaptions = {
                'Candidate Name': 'Name of  the Reference',
                'Contact Details': 'Contact number of the reference',
                'Company Name': 'Company Name',
                'Designation': 'Designation',
              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
              })
            }
            if (summaryData.componentType === "passport") {
              summaryData.content = summaryData.content.filter(w => w.key != "candidateName" && w.key != "placeOfResidence" && w.key != "machineReadZone")
              let newCaptions = {
                'Expiry Date': 'Date of Expiry'
              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
              })
              summaryData.content.forEach(element => {
                if (element.key == 'dateOfBirth') {
                  element.applicanttVal = (element.applicanttVal != undefined || element.applicanttVal != null || element.applicanttVal != '') ? this.datePipe.transform(element.applicanttVal, 'dd/MMM/yyyy') : element.applicanttVal;
                  element.reportVal = (element.reportVal != undefined || element.reportVal != null) ? this.datePipe.transform(element.reportVal, 'dd/MMM/yyyy') : element.reportVal;
                } else if (element.key == 'expiryDate') {
                  element.applicanttVal = (element.applicanttVal != undefined || element.applicanttVal != null || element.applicanttVal != '') ? this.datePipe.transform(element.applicanttVal, 'dd/MMM/yyyy') : element.applicanttVal;
                  element.reportVal = (element.reportVal != undefined || element.reportVal != null) ? this.datePipe.transform(element.reportVal, 'dd/MMM/yyyy') : element.reportVal;
                }
              })
            }
            if (summaryData.componentType === "crc") {
              summaryData.content = summaryData.content.filter(w => w.caption == "Address" || w.caption == "Original suit (Civil court)"
                || w.caption == "Appeals (High court)" || w.caption == "Criminal cases (CC)" || w.caption == "Private Compliant Report (PCR) to (Magistrate court)" || w.caption == "Criminal appeals (Sessions court)"
                || w.caption == "Criminal appeals (High court)" || w.caption == "Status" || w.caption == "Complete Details of Case (Detail information of Sections found against the associate)" || w.caption == "Department name"
              )
              let newCaptions = {
                'Complete Details of Case': 'Complete Details of Case (Detail information of Sections found against the associate)',
              }
              summaryData.customRepFields.forEach((summary, index) => {
                let caption = summary.fieldName;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.fieldName = newCaptions[caption];
                }
              })
              let crcStatus: any = summaryData.content.filter(w => w.key == "statusForCivil" || w.key == "statusForCriminal")
              this.crcExeHeader[0].status = crcStatus[0].reportVal;
              this.crcExeHeader[1].status = crcStatus[1].reportVal;
            }
            if (summaryData.componentType === "address") {
              summaryData.content = summaryData.content.filter(w => w.caption == "Address" || w.caption == "Period Of Stay From" || w.caption == "Period Of Stay To"
              )
              let newCaptions = {
                'Period Of Stay From': 'Period of stay (From)',
                'Period Of Stay To': 'Period of stay (To)',

              }
              summaryData.content.forEach((summary, index) => {
                let caption = summary.caption;
                if (newCaptions.hasOwnProperty(caption)) {
                  summary.caption = newCaptions[caption];
                }
              })
            }
            this.summaryContentList.push(summaryData);
          }
          // if (this.componentType === 'license' || this.componentType === 'creditVerification') {
          //   if (summaryData.content.length > 0) {
          //     summaryData.content.forEach((e => {
          //       this.mergedArrayContentList.push(e)
          //     }))
          //   }
          //   if (summaryData.customRepFields.length > 0) {
          //     summaryData.customRepFields.forEach(e => {
          //       this.mergedArrayContentList.push(e)
          //     })
          //   }
          //   if (summaryData.miscRepQns.length > 0) {
          //     summaryData.miscAppQns.forEach(e => {
          //       this.mergedArrayContentList.push(e)
          //     })
          //   }
          //   this.getAlignedContentList();
          // }
        });
      }

      if (this.finalReport.executiveDetail) {
        let compid = 0;
        let inx = 0;
        let compIndex = 0;
        this.finalReport.executiveDetail.forEach(element => {
          if (this.finalReport.candidateDetail.ctsflag && this.verificationService.individualQc === 0 && this.verificationService.screeningId > 0) {
            if (element.componentType != 'employee') {
              if (compid == 0 || compid != element.compId) {
                compid = element.compId
                inx = 0;
              }
              if (compid == element.compId) {
                inx++;
              }
              element.header = element.header + " " + inx;
            }
          }
          // tslint:disable-next-line: no-use-before-declare
          const executiveData = new executiveDetailContent();
          executiveData.index = compIndex;
          executiveData.compId = element.compId;
          executiveData.docContentList = this.docContentList.filter(comp => comp.screeningCompId === element.screeningCompId)
            .sort((a, b) => a.docId - b.docId);

          element.component.forEach((compElement, index) => {
            if (index === 0) { executiveData.header = element.header; }

            compElement.component.forEach((comp: any, ind, totvalue: any) => {
              switch (element.componentType) {
                case 'panIndiaOCRV':
                case 'criminalDatabase':
                case 'address':
                case 'crc':
                case 'criminalCheckPCC1PCC2':
                case 'criminalCheckPCC3PCC3E': {
                  totvalue[ind] = [comp, comp['address']].reduce(((r, c) => Object.assign(r, c)), {});
                  break;
                }
              }
              this.verificationDate = this.datePipe.transform(comp.verificationDate, 'dd/MMM/yyyy');
              this.status = comp.status;
              this.modeofVerification = comp.modeofVerification;
              //record
              executiveData.dataAppQns = comp.recordCheckCategory;

              if (executiveData.dataAppQns != null && executiveData.dataAppQns.length > 0) {
                const databaseqs: any[] = [];
                const arr1 = executiveData.dataAppQns.filter(f => f.recordCheckCategoryName == this.commonService.INDIA_SPECIFIC_REGULATORY_COMPLIANCE_DATABASE);
                databaseqs.push(arr1);
                const arr2 = executiveData.dataAppQns.filter(f => f.recordCheckCategoryName == this.commonService.COMPLIANCE_LINK);
                databaseqs.push(arr2);
                const arr3 = executiveData.dataAppQns.filter(f => f.recordCheckCategoryName == this.commonService.DATABASE_GLOBAL);
                databaseqs.push(arr3);
                executiveData.dataAppQns = databaseqs;
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
            executiveData.component.forEach(element => {
              if (this.finalReport.finalReportCaseDetails.reportType == 'Interim Report') {
                switch (element.status) {
                  case 'Red': element.status = 'IR- Red'; break;
                  case 'Amber': element.status = 'IR – Amber'; break;
                  case 'Orange': element.status = 'IR – Amber'; break;
                  case 'Green': element.status = 'IRCEP'; break;
                  default: break;
                }
              } else {
                switch (element.status) {
                  case 'Red': element.status = 'Red- Discrepancy'; break;
                  case 'Amber': element.status = 'Amber – Unable to verify'; break;
                  case 'Orange': element.status = 'Amber – Unable to verify'; break;
                  default: break;
                }
              }
            })
            executiveData.componentType = compElement['componentType'];
          });

          compIndex++;
          this.executiveDetailContentlist.push(executiveData);
        });
      }
      this.totalEmpList = this.executiveDetailContentlist.filter(e => e.componentType == 'employee');
    }
  }

  getHeader1(data): any {
    let header: any = '';
    for (let i = 0; i < data.clientCustomFields.length; i++) {
      header = data.clientCustomFields[i].fieldName;
      return header;
    }
  }
  shouldSpanRow(item: any): number {
    if ((item.componentType === 'referenceCheck' || item.componentType === 'employmentSupervisor') &&
      (this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || item.screeningStatus === 'Close - Insufficiency') &&
      item.insuffRaisedFlag) {
      return 2;
    } else {
      return 1;
    }
  }
  getCellContent(item: any, i: number): string {
    if (item.componentType === 'referenceCheck' || item.componentType === 'employmentSupervisor') {
      if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim') && !item.insuffRaisedFlag) {
        return item.miscRepQns ? item.miscRepQns[i].miscAnswer : "--";
      } else if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || item.screeningStatus === 'Close - Insufficiency') &&
        item.insuffRaisedFlag && item.currentEmpFlag) {
        return 'CE Hold';
      } else if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || item.screeningStatus === 'Close - Insufficiency') &&
        item.insuffRaisedFlag && !item.currentEmpFlag) {
        return 'Insufficiency';
      } else {
        return item.miscRepQns ? item.miscRepQns[i].miscAnswer : "--";
      }
    } else {
      if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || item.screeningStatus === 'Close - Insufficiency') &&
        item.insuffRaisedFlag && item.currentEmpFlag) {
        return 'CE Hold';
      } else if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || item.screeningStatus === 'Close - Insufficiency') &&
        item.insuffRaisedFlag && !item.currentEmpFlag) {
        return 'Insufficiency';
      } else if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || item.screeningStatus === 'Close - Insufficiency') &&
        !this.finalReport.candidateDetail.ctsflag && !item.insuffRaisedFlag) {
        return item.miscRepQns ? item.miscRepQns[i].miscAnswer : "Work in Progress";
      } else if ((this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || item.screeningStatus === 'Close - Insufficiency') &&
        this.finalReport.candidateDetail.ctsflag && !item.insuffRaisedFlag) {
        return item.miscRepQns ? item.miscRepQns[i].miscAnswer : item.screeningStatus;
      } else if ((this.verificationService.suppReportType !== 'interim' && this.verificationService.suppReportType !== 'iqcinterim' && item.screeningStatus !== 'Close - Insufficiency')) {
        return item.miscRepQns ? item.miscRepQns[i].miscAnswer : "--";
      } else {
        return "";
      }
    }
  }
  shouldShowCustomFieldCell(SCL: any, custom: any): boolean {
    return SCL.componentType !== 'companySiteVisit' && SCL.componentType !== 'socialMedia' && SCL.componentType !== 'creditVerification' && SCL.componentType !== 'employmentSupervisor' && SCL.componentType !== 'referenceCheck';
  }

  isAppFieldsVisible(componentType: string): boolean {
    return componentType !== 'referenceCheck' && componentType !== 'employmentSupervisor';
  }

  isReferenceCheckOrEmploymentSupervisor(componentType: string): boolean {
    return componentType === 'referenceCheck' || componentType === 'employmentSupervisor';
  }

  isOtherComponentType(componentType: string): boolean {
    return !this.isAppFieldsVisible(componentType) && !this.isReferenceCheckOrEmploymentSupervisor(componentType);
  }

  getCustomFieldCellContent(custom: any, isOtherComponent: boolean): string {
    return custom.fieldValue ? (custom.fieldType === "Date" ? (this.datePipe.transform(custom.fieldValue, 'dd/MMM/yyyy')) : custom.fieldValue) : (isOtherComponent ? "Not Provided" : "Work in Progress");
  }
  showMisc(SCL: any) {
    const showComponent = ['companySiteVisit', 'socialMedia', 'education', 'employmentHrAndSupervisor', 'employee', 'referenceCheck', 'referenceSelfEmployed', 'employmentSupervisor', 'emergencyContactVerification']
    return showComponent.includes(SCL.componentType)
  }
  showBasedOnComponent(item: any) {
    const excludedComponent = ['criminalCheckPCC3PCC3E', 'criminalDatabase', 'creditVerification', 'cvValidation', 'passport', 'ndotComp', 'drugTest', 'education', 'crc', 'employee', 'license', 'pan', 'referenceCheck', 'address', 'gapVerification'];
    return !excludedComponent.includes(item.componentType);
  }

  showReport(item: any) {
    const includedKey = ['UGC/ AICTE Approval Status', 'Suspicious Education Database check (Any Findings)', 'Additional Comments', 'Verifier name', 'Verifier designation', 'Department name', 'Verified date', 'Annexure details']
    return includedKey.includes(item.fieldName);
  }
  // passport - Condition Based code start
  showAppRep(item, compName) {
    if (compName === 'license' || compName === 'passport') {
      let name = (item.caption || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
      const includedKey = ['Additional Comments'].toString().toLowerCase().replace(/\s+/g, '');
      return includedKey.includes(name)
    }
  }
  //end
  showempReport(item: any) {
    const includedKey = ['reasonForLeaving', 'employeeId', 'employerName', 'designation', 'fromDate', 'toDate', 'ctc']
    return !includedKey.includes(item.key);
  }
  showcrcReport(item: any) {
    const includedKey = ['addressCRC']
    return !includedKey.includes(item.key);
  }

  showAppRepEducation(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    let includedKey = ['degree', 'courseCompletion', 'institutionName', 'instituteName'].toString().toLowerCase().replace(/\s+/g, '');
    return !includedKey.includes(name);
  }
  applicantExcludedDetails(item: any) {
    const excludedComponent = ['companySiteVisit', 'socialMedia', 'creditVerification', 'employmentSupervisor'];
    return !excludedComponent.includes(item.componentType);
  }
  excludedComponent(item: any) {
    const excludedKeys = ['criminalCheckPCC1PCC2', 'criminalCheckPCC3PCC3E', 'nic', 'gapVerification', 'drugTest', 'ndotComp', 'voterId', 'cvValidation', 'crc', 'address', 'gapVerification']
    return excludedKeys.includes(item.componentType);

  }
  exeComp(item: any) {
    const excludedKeys = ['crc', 'gapVerification']
    return !excludedKeys.includes(item.componentType);

  }
  // CRC - Condition Based code start
  getCivilContent(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const excludedKeys = ['civilCourtOriginalSuitForCivil', 'highCourtAppealsForCivil', 'civilCourtCriminalCaseForCivil', 'magistrateCourtPcRForCivil',
      'sessionsCourtCriminalAppealsForCivil', 'highCourtCriminalAppealsForCivil', 'statusForCivil', 'completeCaseDetailsForCivil'].toString().toLowerCase().replace(/\s+/g, '');
    return excludedKeys.includes(name);
  }
  getCriminalContent(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const excludedKeys = ['civilCourtOriginalSuitForCriminal', 'highCourtAppealsForCriminal', 'civilCourtCriminalCaseForCriminal', 'magistrateCourtPcRfOrCriminal',
      'sessionsCourtCriminalAppealsForCriminal', 'highCourtCriminalAppealsForCriminal', 'statusForCriminal', 'completeCaseDetailsForCriminal'].toString().toLowerCase().replace(/\s+/g, '');
    return excludedKeys.includes(name);
  }
  //End
  // Address - Condition Based code start
  getEmpContent1(data: any): any {
    let name = (data.key || data.fieldName || data.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const excludedKeys = ['employerName', 'employeeId'].toString().toLowerCase().replace(/\s+/g, '');
    return excludedKeys.includes(name);
  }
  getMisc1(data: any): any {
    let name = (data.key || data.fieldName || data.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const excludedKeys = ["Was this position: Permanent/Temporary/Contractual", "Reporting Manager's Name",
      "Rehire Eligibility (Yes/No): If No, Please specify the reason", "Exit formalities completed: (Yes/No): If No, Please confirm whether it is pending from Employer or Employee SIde",
      "Any issues reported during the candidate’s tenure (Please specify):", "Any issues pertaining to the employment",
      "Exit formalities completed", "Is the document authentic?", "Department name", 'Eligible for rehire'].toString().toLowerCase().replace(/\s+/g, '')
    return !excludedKeys.includes(name);
  }
  getMisc2(data: any): any {
    let name = (data.key || data.fieldName || data.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const excludedKeys = ["Any issues pertaining to the employment", "Exit formalities completed",
      "Eligible for rehire", "Is the document authentic?"].toString().toLowerCase().replace(/\s+/g, '');
    return excludedKeys.includes(name);
  }
  getEmpContent2(data: any): any {
    let name = (data.key || data.fieldName || data.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const excludedKeys = ['fromDate', 'toDate', 'designation', 'ctc'].toString().toLowerCase().replace(/\s+/g, '');
    return excludedKeys.includes(name);
  }
  showempcustomReport(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Period of Employment (As per document)', 'Period of Employment (As per BVF)',
      'Remuneration', 'Supervisor Name & Designation', 'Employer Name'].toString().toLowerCase().replace(/\s+/g, '');
    return !includedKey.includes(name);
  }

  getEmpCustom1(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Supervisor Name & Designation'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  getEmpCustom2(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Any Additional Comments'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  //End 

  // Address - Condition Based code start - by naveen 
  getRefOrder1(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['professionalName'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  getRefOrder2(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['companyandDesignation'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  getRefOrder3(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['phoneNumber'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  // end
  // Address - Condition Based code start - by naveen 
  getOtherDrug(data: any): any {
    let name = (data.drugName).toString().toLowerCase().replace(/\s+/g, '');
    const excludedKeys = ['amphetamines', 'cocaine', 'marijuana(cannabinoids)','cannabinoids', 'phencyclidine(pcp)', 'opiates'].toString().toLowerCase().replace(/\s+/g, '')
    return !excludedKeys.includes(name);
  }
  //end
  // Address - Condition Based code start
  showAddress(item: any) {
    let name = (item.caption || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Address', 'Period of stay (From)', 'Period of stay (To)'].toString().toLowerCase().replace(/\s+/g, '')
    return !includedKey.includes(name);
  }
  getAddressQues1(item: any) {
    let name = (item.caption || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Ownership status'].toString().toLowerCase().replace(/\s+/g, '')
    return includedKey.includes(name);
  }
  getAddressQues2(item: any) {
    let name = (item.caption || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Any additional comments'].toString().toLowerCase().replace(/\s+/g, '')
    return includedKey.includes(name);
  }
  getAddressQues3(item: any) {
    let name = (item.caption || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Results of Digital verification'].toString().toLowerCase().replace(/\s+/g, '')
    return includedKey.includes(name);
  }
  //end 
  // License - Condition Based code start  
  getlicField1(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Additional Comments'].toString().toLowerCase().replace(/\s+/g, '');
    return !includedKey.includes(name);
  }
  getlicField2(item: any) {
    let name = (item.key || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Additional Comments'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  showlicense(item: any) {
    let name = (item.caption || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Additional comments'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  //end
  // Pan - Condition Based code start
  showPanReport(item: any) {
    let name = (item.caption || item.fieldName || item.miscQuestion).toString().toLowerCase().replace(/\s+/g, '');
    const includedKey = ['Additional comments'].toString().toLowerCase().replace(/\s+/g, '');
    return includedKey.includes(name);
  }
  //end
  // Gap verification Based Code Start
  getTenure(item: any) {
    let tenure: any; let data1: any; let data2: any; let data3: any;
    data1 = item[0].gapFromTo ? item[0].gapFromTo : 'Not Provided';
    data2 = item[1].gapFromTo ? item[1].gapFromTo : 'Not Provided';
    data3 = item[2].gapFromTo ? item[2].gapFromTo : 'Not Provided';
    return tenure = data1 + ' & ' + data2 + ' & ' + data3;
  }

  getReason(item: any) {
    let tenure: any; let data1: any; let data2: any; let data3: any;
    data1 = item[0].teachMGapReason ? item[0].teachMGapReason : 'Not Provided';
    data2 = item[1].teachMGapReason ? item[1].teachMGapReason : 'Not Provided';
    data3 = item[2].teachMGapReason ? item[2].teachMGapReason : 'Not Provided';
    return tenure = data1 + ' & ' + data2 + ' & ' + data3;
  }

  //End

  // UGC/ AICTE Approval Status
  // Suspicious Education Database check (Any Findings)
  // Name As Per Driving License'
  // 'Date of Birth'
  // getAlignedContentList() {
  //   let desiredArray: any[] = [];
  //   switch (this.componentType) {
  //     case 'license': {
  //       desiredArray = ['addressLicense', 'candidateName', 'Name As Per Driving License', 'Date of Birth', 'licenseNo', 'Additional Comments'];
  //       break;
  //     }
  //     case 'creditVerification': {
  //       desiredArray = ['addressCredit', 'Additional Comments'];
  //       break;
  //     }
  //     case 'drugTest': {
  //       desiredArray = ['Amphetamines', 'Cocaine', 'Marijuana (Cannabinoids)', 'Phencyclidine (PCP)', 'Opiates'];
  //       break;
  //     }
  //   }

  //   if (this.componentType === 'license' || this.componentType === 'creditVerification' || this.componentType === 'drugTest') {
  //     const objectMap = new Map();
  //     this.mergedArrayContentList.forEach(item => {
  //       let key = (item.key || item.fieldName || item.drugName).toString().toLowerCase().replace(/\s+/g, '');
  //       objectMap.set(key, item);
  //     });
  //     this.mergedArrayContentList = desiredArray.map(key => {
  //       let loweredKey = key.toString().toLowerCase().replace(/\s+/g, '');
  //       return objectMap.get(loweredKey)
  //     });
  //   }
  // }
  // generateTableRowContent(edcl: any): SafeHtml {

  //   let htmlContent = '';
  //   switch (edcl.componentType) {

  //     case 'creditVerification':
  //       htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">Credit Check</th>
  //               <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
  //       break;
  //     case 'passport':
  //       htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Passport Investigation</th>
  //               <th colspan="2" width="50%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
  //       break;
  //     case 'education':
  //       htmlContent += `<th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;"scope="col">Educational Verification</th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">University/ College Name</th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> YOP</th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">Status</th>`;
  //       break;
  //     case 'employee':
  //       htmlContent += `<th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Employment Verification </th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Tenure (From) </th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Tenure (To Period) </th>
  //       <th colspan="1"" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Period Verified in Months </th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
  //       break;
  //     case 'pan':
  //       htmlContent += `<th colspan="3" class="th-header" style=" background: #dedede; border: 1px solid #bcbdbe;" scope="col">Permanent Account Number (PAN) Verification</th>       
  //       <th colspan="2" class="th-header" style="background: #dedede; border: 1px solid #bcbdbe;" scope="col">Status</th>`;
  //       break;
  //     case 'referenceCheck':
  //       htmlContent += `<th colspan="2" class="th-header" style=" background: #dedede;" scope="col">Reference Verification</th> 
  //       <th colspan="1" class="th-header" style="background: #dedede; border: 1px solid #bcbdbe;" scope="col">Written/Verbal</th>      
  //       <th colspan="2" class="th-header" style="background: #dedede; border: 1px solid #bcbdbe;" scope="col">Status</th>`;
  //       break;
  //     case 'drugTest':
  //       htmlContent += `<th colspan="3" class="th-header" style=" background: #dedede; border: 1px solid #bcbdbe;" scope="col">Drug Test Verification</th> 
  //         <th colspan="2" class="th-header" style="background: #dedede; border: 1px solid #bcbdbe;" scope="col">Status</th>`;
  //       break;
  //     case 'crc':
  //       htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;"  scope="col">Court Record verification</th>
  //       <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Verification Status </th>`;
  //       break;
  //     case 'address':
  //       htmlContent += `<th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;"  scope="col">Address Verification</th>
  //       <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Period of Stay </th>
  //      <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
  //       break;
  //     case 'criminalDatabase':
  //       htmlContent += ` <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Type Of Check</th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Verification Date</th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
  //       break;
  //     case 'gapVerification':
  //       htmlContent += ` <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> GAP Verification </th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Period </th>
  //       <th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Reason for Gap </th>`;
  //       break;
  //     default:
  //       htmlContent += `<th colspan="1" width="22%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;">Type of Check </th>
  //       <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Brief Details </th>
  //       <th colspan="1" width="20%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Verification Date</th>
  //       <th colspan="2" width="10%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status</th>`;
  //   }
  //   // return htmlContent;
  //   this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  //   return this.safeHtml;
  // }

  generateTableRowContent(edcl: any, summaryContentListIndex: number): SafeHtml {

    let htmlContent = '';

    if (edcl.componentType === 'creditVerification') {
      htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" > Credit Check</a></th>
                <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
    }
    else if (edcl.componentType === 'passport') {
      htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" > Passport Investigation</a></th>
                <th colspan="2" width="50%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
    }
    else if (edcl.componentType === 'education') {
      htmlContent += `<th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;"scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" > Educational Verification</a></th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">University/ College Name</th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> YOP</th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">Status</th>`;
    }
    else if (edcl.componentType === 'employee') {
      htmlContent += `<th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" > Employment Verification</a></th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Tenure (From) </th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Tenure (To Period) </th>
        <th colspan="1"" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Period Verified in Months </th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
    }
    else if (edcl.componentType === 'pan') {
      htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" > Permanent Account Number (PAN) Verification</a></th>       
        <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">Status</th>`;
    }
    else if (edcl.componentType === 'referenceCheck') {
      htmlContent += `<th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" >Reference Verification</a></th> 
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">Written/Verbal</th>      
        <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">Status</th>`;
    }
    else if (edcl.componentType === 'drugTest') {
      htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" >Drug Test Verification</a></th> 
          <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">Status</th>`;
    }
    else if (edcl.componentType === 'crc') {
      htmlContent += `<th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;"  scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" >Court Record verification</a></th>
        <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Verification Status </th>`;
    }
    else if (edcl.componentType === 'address') {
      htmlContent += `<th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;"  scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" >Address Verification</a></th>
        <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Period of Stay </th>
       <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
    }
    else if (edcl.componentType === 'criminalDatabase') {
      htmlContent += ` <th colspan="2" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" > Type Of Check</a></th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Verification Date</th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status </th>`;
    }
    else if (edcl.componentType === 'gapVerification') {
      htmlContent += ` <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" > GAP Verification</a> </th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Period </th>
        <th colspan="3" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Reason for Gap </th>`;
    }
    else {
      htmlContent += `<th colspan="1" width="22%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;">
        <a id="execSummary`+ summaryContentListIndex + `" href="#executive` + summaryContentListIndex + `" >Type of Check </a></th>
        <th colspan="1" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Brief Details </th>
        <th colspan="1" width="20%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Verification Date</th>
        <th colspan="2" width="10%" style="border: 1px solid #bcbdbe !important; padding: 6px 8px !important; background: #dedede !important; font-size: 13px !important; font-weight: 600 !important; vertical-align: middle !important; text-align: center !important;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif !important;" scope="col"> Status</th>`;
    }
    // return htmlContent;
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    return this.safeHtml;
  }

  getExp(edcl: any, edclIndex?: any): any {
    let totalYears = 0;
    let totalMonths = 0;
    let totalDays = 0;
   
    edcl.forEach((ele) => {
      const component = ele.component[0];
      const fromDate = component.fromDate;
      let toDate = component.todate;
 
      if (fromDate && toDate && fromDate !== 'Not Provided' && toDate !== 'Not Provided') {
        // Handle 'Till Date'
        toDate = toDate.toString().toLowerCase().replace(/\s+/g, '') === 'tilldate'
                 ? this.datePipe.transform(new Date(), 'dd/MMM/yyyy')
                 : toDate;
 
        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);
 
        // Calculate the difference in years, months, and days
        let years = date2.getFullYear() - date1.getFullYear();
        let months = date2.getMonth() - date1.getMonth();
        let days = date2.getDate() - date1.getDate();
 
        // Adjust the months and days if necessary
        if (days < 0) {
          months -= 1;
          const previousMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
          days += previousMonth.getDate();
        }
        if (months < 0) {
          years -= 1;
          months += 12;
        }
 
        // Accumulate the results
        totalYears += years;
        totalMonths += months;
        totalDays += days;
      }
    });
 
    // Adjust the accumulated totals for months and days
    if (totalDays >= 30) {
      totalMonths += Math.floor(totalDays / 30);
      totalDays = totalDays % 30;
    }
    if (totalMonths >= 12) {
      totalYears += Math.floor(totalMonths / 12);
      totalMonths = totalMonths % 12;
    }
 
    // Create the final message
    const yearCount = totalYears > 0 ? `${totalYears} year${totalYears > 1 ? 's' : ''}` : '';
    const monthCount = totalMonths > 0 ? `${totalMonths} month${totalMonths > 1 ? 's' : ''}` : '';
    const dayCount = totalDays > 0 ? `${totalDays} day${totalDays > 1 ? 's' : ''}` : '';
 
    const message = `${yearCount} ${monthCount} ${dayCount}`.trim();
 
    this.dateDifference = message || 'N/A';
    return this.dateDifference;
  }
  getExp1(edcl: any, edclIndex?: any): any {
    let message = '';
 
    const component = edcl.component[0];
    const fromDate = component.fromDate;
    let toDate = component.todate;
 
    // Check if fromDate and toDate are valid and not 'Not Provided'
    if (fromDate && toDate && fromDate !== 'Not Provided' && toDate !== 'Not Provided') {
      // Handle 'Till Date'
      toDate = toDate.toString().toLowerCase().replace(/\s+/g, '') === 'tilldate'
               ? this.datePipe.transform(new Date(), 'dd/MMM/yyyy')
               : toDate;
 
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);
 
      // Calculate year, month, and day differences using JS Date methods
      let years = date2.getFullYear() - date1.getFullYear();
      let months = date2.getMonth() - date1.getMonth();
      let days = date2.getDate() - date1.getDate();
 
      // Adjust the months and days if necessary
      if (days < 0) {
        months -= 1;
        const previousMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
        days += previousMonth.getDate();  // Add days from the previous month
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
 
      // Build the output message
      const yearCount = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
      const monthCount = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
      const dayCount = days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '';
 
      message = `${yearCount} ${monthCount} ${dayCount}`.trim();
    }
 
    this.dateDifference = message || 'N/A';
    return this.dateDifference;
  }

  getComponentContent(edclComp: any, edcl: any, edclCompindex: any, edclIndex?: any): any {

    if (edcl.componentType === 'creditVerification') {
      let cols = `<td colspan="3" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${this.cibilScore ?
        this.cibilScore : 'N/A'}</td>`;
      return cols

    } else if (edcl.componentType === 'passport') {
      let cols = `<td colspan="3" width="50%" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">Passport-MRZ</td>`;
      return cols
// Changed by Vignesh M - University Name not displayed correctly in FQC report | Live Tech-M environment
    } else if (edcl.componentType === 'education') {
      let cols = `
      <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.degree ? edclComp.degree : 'N/A'}</td>
      <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.institutionName ? edclComp.institutionName : 'N/A'}</td>
      <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.duration ? (typeof edclComp.duration !== 'string' ? this.datePipe.transform(edclComp.duration, 'dd/MMM/yyyy') : edclComp.duration) : 'N/A'}</td>

    `;
      return cols

    } else if (edcl.componentType === 'pan') {
      return `
      <td colspan="3" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">PAN Verification</td>
    `;
    }
    else if (edcl.componentType === 'referenceCheck') {
      return `
      <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.typeOfCheck : 'N/A'}</td>
      <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.modeofVerification ? edclComp.modeofVerification : 'N/A'}</td>
    `;
    }
    else if (edcl.componentType === 'drugTest') {
      return `
      <td colspan="3" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.drugKit + ' ' + edclComp.typeOfCheck : 'N/A'}</td>
      `;
    } else if (edcl.componentType === 'employee') {
      //  changed by Vignesh M - 12/14/2023 - Tech-M UAT Feedback | Requires immediate assistance
      this.getExp1(edcl, 0);
      let cols = `
      <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.employerName ? edclComp.employerName : 'N/A'}</td>
      <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.fromDate ? typeof edclComp.fromDate === 'string' || edclComp.fromDate === null || edclComp.fromDate === undefined || edclComp.fromDate.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
          || edclComp.fromDate.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
          edclComp.fromDate.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ? edclComp.fromDate : this.datePipe.transform(edclComp.fromDate, 'dd/MMM/yyyy') : 'Not Provided'}</td>
      <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">
      ${edclComp.todate ? typeof edclComp.todate === 'string' || edclComp.todate === null || edclComp.todate === undefined || edclComp.todate.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided'
          || edclComp.todate.toString().toLowerCase().replace(/\s+/g, '') === 'notapplicable' ||
          edclComp.todate.toString().toLowerCase().replace(/\s+/g, '') === 'n/a' ||
          edclComp.todate === 'TILL DATE' ? edclComp.todate : this.datePipe.transform(edclComp.todate, 'dd/MMM/yyyy') : 'Not Provided'}</td>
      <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${this.dateDifference ? this.dateDifference : 'N/A'}</td>
    `;
      return cols
    }
    else if (edcl.componentType === 'criminalDatabase') {
      let cols = `<td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.typeOfCheck : "N/A"} - ${edclCompindex + 1}</td>`;
      return cols

    } else if (edcl.componentType === 'address') {
      edclComp.address.posDuration = edclComp.address.posDuration.replace('<center>', '');
      edclComp.address.posDuration = edclComp.address.posDuration.replace('</center>', '');
      edclComp.address.posDuration = edclComp.address.posDuration.replace('<br>', '');
      edclComp.address.posDuration = edclComp.address.posDuration.replace('</br>', '');
      edclComp.address.posDuration = edclComp.address.posDuration.replace('<br/> & <br/>', '&');
      let cols = `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.typeOfCheck : "N/A"}</td>
      <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.address.posDuration ? edclComp.address.posDuration : 'N/A'}</td>`;
      return cols

    } else if (edcl.componentType === 'socialMedia') {
      let cols = edclComp.briefDetails.map((val: string, index: number) => {
        const isLast = index === edclComp.briefDetails.length - 1;
        return `<td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.typeOfCheck : "N/A"}</td>
        <td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp[val]}${!this.getBriefDetailsFlag(edclComp) && isLast ? "Online" : ""}${!isLast && edclComp[val] ? "," : ""}</td>`;
      }).join('');
      return cols

    } else if (this.exeComp(edcl) && edcl.header !== 'Court Check' && edcl.header !== 'Address Check' && edcl.header !== 'OFAC' && edcl.header !== 'Court Record Check') {
      let cols = `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.typeOfCheck : "N/A"}</td>
      ${this.briefDetailsList = []}
      ${edclComp.briefDetails.map((val: string, index: number) => {
        const isLast = index === edclComp.briefDetails.length - 1;
        // return `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp[val]}${!this.getBriefDetailsFlag(edclComp) && isLast ? "NOT APPLICABLE" : ""}${!isLast && edclComp[val] ? "," : ""}</td>`;
        this.briefDetailsList.push(edclComp[val] != null ? edclComp[val] : 'N/A');
        if (index === edclComp.briefDetails.length - 1) {
          let data: any = ''; data = this.briefDetailsList.filter(value => value !== null && value !== undefined && value !== 'N/A').join(', ');
          return `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${data}</td>`;
        }
      }).join('')}`;
      return cols

    }
    else {
      if (!this.excludedComponent(edcl) && edcl.componentType !== 'criminalDatabase') {
        let cols = '';
        switch (edcl.componentType) {
          case 'crc': {
            cols = `<td colspan="3" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.typeOfCheck : "N/A"}</td>`;
            break;
          } default: {
            cols = `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${edclComp.typeOfCheck ? edclComp.typeOfCheck : "N/A"}</td>`;
            break;
          }
        }
        return cols
      }
    }
    return '';
  }

  getCellContentAndStyle(edclComp: any, edcl: any): string {
    const statusClass = `${this.getStatusStyle(edclComp.status)}`;
    const result = { content: '', style: {} };
    if (!edclComp.insuffRaisedFlag) {
      if (edcl.componentType !== 'creditVerification' &&
        edcl.componentType !== 'passport' &&
        edcl.componentType !== 'crc' &&
        edcl.componentType !== 'employee' &&
        edcl.componentType !== 'education' &&
        edcl.componentType !== 'referenceCheck' &&
        edcl.componentType !== 'address' &&
        edcl.componentType !== 'drugTest' && edcl.componentType !== 'pan'
        && edcl.componentType !== 'gapVerification'
      ) {
        result.content = edclComp.verificationDate ?
          this.datePipe.transform(edclComp.verificationDate, 'dd/MMM/yyyy') : 'N/A';
        let cols = `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">${result.content}</td>`
        let extraCols = '';
        if (edcl.componentType === 'employmentSupervisor' || edcl.componentType === 'criminalCheckPCC3PCC3E' || edcl.componentType === 'criminalCheckPCC1PCC2' || edcl.componentType === 'license' || edcl.header == 'OFAC' || edcl.componentType === 'voterId' || edcl.componentType === 'gapCheck' || edcl.componentType === 'nic' || edcl.componentType === 'uan' || edcl.componentType === 'oig' || edcl.componentType === 'fda' || edcl.componentType === 'socialMedia') {
          result.content = edclComp.status || 'WIP';
          extraCols = `<td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;${statusClass}">${result.content}</td>`
        }
        let commonCols = extraCols != '' ? cols + extraCols :
          cols
        return commonCols
      } else {
        if (edcl.componentType !== 'gapVerification') {
          result.content = edclComp.status || 'WIP';
          let cols = '';
          switch (edcl.componentType) {
            case 'crc':
            case 'passport':
            case 'referenceCheck':
            case 'pan':
            case 'creditVerification':
            case 'address':
            case 'drugTest':
              cols = `<td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;${statusClass}">${result.content}</td>`
              break;
            default:
              cols = `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;${statusClass}">${result.content}</td>`
              break;
          }
          return cols
        }
      }
    } else if (edclComp.insuffRaisedFlag) {
      if (
        edcl.componentType !== 'creditVerification' &&
        edcl.componentType !== 'passport' &&
        edcl.componentType !== 'crc' &&
        edcl.componentType !== 'employee' &&
        edcl.componentType !== 'education') {
        result.content = edclComp.screeningStatus !== 'Close - Insufficiency' ?
          (edclComp.verificationDate ?
            this.datePipe.transform(edclComp.verificationDate, 'dd/MMM/yyyy') : 'N/A') :
          (edclComp.statusModifiedDate ?
            this.datePipe.transform(edclComp.verificationDate, 'dd/MMM/yyyy') : 'N/A');
        let cols = `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;" class="th-header">${result.content}</td>`
        let extraCols = '';
        if (edcl.componentType === 'license' || edcl.componentType === 'pan' || edcl.componentType === 'gapCheck' || edcl.componentType === 'voterId' || edcl.componentType === 'nic' || edcl.componentType === 'uan' || edcl.componentType === 'oig' || edcl.componentType === 'fda' || edcl.componentType === 'socialMedia') {
          result.content = edclComp.status || 'WIP';
          switch (edcl.componentType) {
            case 'crc':
            case 'passport':
            case 'referenceCheck':
            case 'pan':
            case 'creditVerification':
              extraCols = `<td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;${statusClass}">${result.content}</td>`
              break;
            default:
              extraCols = `<td colspan="1" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;${statusClass}">${result.content}</td>`
              break;
          }
        }
        let commonCols = extraCols != '' ? cols + extraCols :
          cols
        return commonCols
      } else {
        if (edclComp.screeningStatus !== 'Close - Insufficiency') {
          result.content = 'Insufficiency';
          let cols = `<td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;${statusClass}">${result.content}</td>`;
          return cols
        } else {
          result.content = edclComp.status || 'Orange';
          let cols = `<td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;${statusClass}">${result.content}</td>`;
          return cols
        }
      }
    }
    return ''
  }

  getStatusStyle(status: string): string {
    const defaultStyle = 'color:#121212;';
    switch (status) {
      case 'Green-Verified':
      case 'Magenta':
      
      case 'Green':
      case 'IRCEP':
      case 'Positive':
        return 'color:#08BA53;';
      case 'Stop':
        return 'color:#121212;';
      case 'Amber-Unable to verify':
      case 'IR – Amber':
      case 'Amber – Unable to verify':
      case 'Amber-Additional information required':
      case 'Amber-Inaccessible for verification':
      case 'Orange':
      case 'Positive-Review':
        return 'color: #FFA50A;';
      case 'Red-Discrepancy':
      case 'Red- Discrepancy':
      case 'IR- Red':
      case 'Red':
      case 'Negative':
        return 'color:#E53935;';
      case 'Yellow':
      case 'Negative-Please Review':
        return 'color:#FFE509;';
      default:
        return defaultStyle;
    }
  }
  concatenatedSafeHtml(edclComp, edcl, edclCompindex, edclIndex): SafeHtml {

    const safeHtml1 = this.getComponentContent(edclComp, edcl, edclCompindex, edclIndex);
    const safeHtml2 = this.getCellContentAndStyle(edclComp, edcl);
    const concatenatedContent = edcl.componentType !== 'crc' ? safeHtml1 + safeHtml2 : safeHtml1;

    return this.sanitizer.bypassSecurityTrustHtml((edcl.componentType !== 'criminalDatabase' || edcl.header === 'OFAC') ? concatenatedContent : '');
  }
  getTableCellContent(SCL: any): SafeHtml {

    let htmlContent = '';
    if (this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || SCL.screeningStatus === 'Close - Insufficiency' || this.router.url.includes('qualityCheckDetail') || this.router.url.includes('verificationDetail')) {
      if (SCL.insuffRaisedFlag) {
        htmlContent += `
        <th scope="row" style="border: 1px solid #bcbdbe; padding: 6px 8px; background: #dedede none repeat scroll 0 0;; font-size: 13px; font-weight: 600; vertical-align: middle; text-align: center;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">Annexure Details</th>
        <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: left;vertical-align: middle;">${SCL.componentStatus ? SCL.componentStatus : ''} - ${this.getAnnexureDetails(SCL)}</td>`;
      } else {
        htmlContent += `<th scope="row" style="border: 1px solid #bcbdbe; padding: 6px 8px; background: #dedede none repeat scroll 0 0;; font-size: 13px; font-weight: 600; vertical-align: middle; text-align: center;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">Annexure Details </th>
        <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: left;vertical-align: middle;">${SCL.remarks ? SCL.remarks : ' '}  ${this.getAnnexureDetails(SCL)}</td>`;
      }
    } else if (this.verificationService.suppReportType === 'interim' || this.verificationService.suppReportType === 'iqcinterim' || SCL.screeningStatus === 'Close - Insufficiency') {
      if (SCL.screeningReportContactId === 0 && !SCL.insuffRaisedFlag) {
        htmlContent += `<th scope="row" style="border: 1px solid #bcbdbe; padding: 6px 8px; background: #dedede none repeat scroll 0 0;; font-size: 13px; font-weight: 600; vertical-align: middle; text-align: center;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">Annexure Details </th>
        <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: left;vertical-align: middle;">${SCL.remarks ? SCL.remarks : 'Work in Progress'} - ${this.getAnnexureDetails(SCL)}</td>`;
      } else if (SCL.screeningReportContactId !== 0 && !SCL.insuffRaisedFlag) {
        htmlContent += `<th scope="row" style="border: 1px solid #bcbdbe; padding: 6px 8px; background: #dedede none repeat scroll 0 0;; font-size: 13px; font-weight: 600; vertical-align: middle; text-align: center;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">Annexure Details </th>
        <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: left;vertical-align: middle;">${SCL.remarks ? SCL.remarks : ' '}  ${this.getAnnexureDetails(SCL)}</td>`;
      }
    } else if (this.verificationService.suppReportType !== 'interim' && SCL.componentType !== 'gapVerification' && this.verificationService.suppReportType !== 'iqcinterim' && SCL.screeningStatus !== 'Close - Insufficiency') {
      htmlContent += `<th scope="row" style="border: 1px solid #bcbdbe; padding: 6px 8px; background: #dedede none repeat scroll 0 0;; font-size: 13px; font-weight: 600; vertical-align: middle; text-align: center;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">Annexure Details </th>
      <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: left;vertical-align: middle;">${SCL.remarks ? SCL.remarks : ' '}  ${this.getAnnexureDetails(SCL)}</td>`;
    } else if (this.verificationService.suppReportType !== 'interim' && this.verificationService.suppReportType !== 'iqcinterim' && SCL.screeningStatus !== 'Close - Insufficiency' && SCL.componentType === 'gapVerification') {
      htmlContent += `<th scope="row" style="border: 1px solid #bcbdbe; padding: 6px 8px; background: #dedede none repeat scroll 0 0;; font-size: 13px; font-weight: 600; vertical-align: middle; text-align: center;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">Annexure Details </th>
      <td colspan="2" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: left;vertical-align: middle;">${SCL.gapRemarks ? SCL.gapRemarks : ' '}  ${this.getAnnexureDetails(SCL)}</td>`;
    }
    // return '';
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    return this.safeHtml;
  }

  // LOA annexure details by naveen
  getDoaTableCellContent(SCL: any, index: any, flag?: any): SafeHtml {
    let htmlContent = '';
    if (SCL.length - 1 == index) {
      if (flag == true) {
        htmlContent += `<td width="50%" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;"> LOA </a></td>
        <td width="50%" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: center;vertical-align: middle;">Attached</td>`;
      } else {
        htmlContent += `<th width="30%" scope="row" style="border: 1px solid #bcbdbe; padding: 6px 8px; background: #dedede none repeat scroll 0 0;; font-size: 13px; font-weight: 600; vertical-align: middle; text-align: center;  font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;">Annexure Details </th>
        <td width="70%" style="font-family: Roboto,Calibri,Clear Sans,Helvetica Neue ,Helvetica,Arial,sans-serif;border: 1px solid #bcbdbe;padding: 6px 8px;font-weight: normal;font-size: 13px;text-align: left;vertical-align: middle;">${this.getDoaAnnexureDetails(SCL)}</td>`;
      }
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
      return this.safeHtml;
    }
  }
  // getBGV1(data: any) {
  //   let bgvList: any[] = [];
  //   bgvList = data.filter(e => e.documentType == "BGV");
  //   return bgvList;
  // }
  getAnnexureDetails(SCL: any) {
    if (SCL.docContentList.length > 0) {
      const generatedHtml =
        `<span><b>Annexure
        ${SCL.docContentList.map((dcl, i) => {
          const isLast = i === SCL.docContentList.length - 1;
          const annexureElement = this.finalReport.candidateDetail.annexureFlag
            ? `<a href="#docAnnexure${dcl.screeningCompId}${i}" target="_self">${dcl.annexureVal}</a>`
            : `<b>${dcl.annexureVal}</b>`;

          return `
            <ng-container>
              ${annexureElement}${!isLast ? ',' : ''}
            </ng-container>`;
        }).join('')}
      </b></span>`;
      return generatedHtml;
    }
    return 'N/A';
  }
  // LOA annexure details by naveen
  getDoaAnnexureDetails(SCL: any) {
    if (SCL.length > 0) {
      const generatedHtml =
        `<span><b>Annexure
        ${SCL.map((dcl, i) => {
          const isLast = i === SCL.length - 1;
          const annexureElement = this.finalReport.candidateDetail.annexureFlag
            ? `<a href="#docAnnexure${dcl.screeningCompId}${i}" target="_self">${dcl.annexureVal}</a>`
            : `<b>${dcl.annexureVal}</b>`;

          return `
            <ng-container>
              ${annexureElement}${!isLast ? ',' : ''}
            </ng-container>`;
        }).join('')}
      </b></span>`;
      return generatedHtml;
    }
    return 'N/A';
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
  posDuration: string;
  periodofStay: string;
  periofodStayTo: string;
  isAdditionalPos: boolean;
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
