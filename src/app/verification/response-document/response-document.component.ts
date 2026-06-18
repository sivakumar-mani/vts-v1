import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { FinalReport, summaryContent, executiveDetailContent, docContent, ClientLogoReport } from '../../../../src/app/common-methods/models/reponse-document';
import { CommonAddress } from 'src/app/common-methods/models/common-address';
import { Router } from '@angular/router';
import { W } from '@angular/cdk/keycodes';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-response-document',
  templateUrl: './response-document.component.html',
  styleUrls: ['./response-document.component.css', './print-n.css', './print.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class ResponseDocumentComponent implements OnInit, AfterViewInit, OnDestroy {
  isaddressPos = false;
  dbCompFlag : boolean = false;
  @ViewChild('report') table!: ElementRef;
  finalReport: FinalReport = null;
  summaryContentList: summaryContent[] = [];
  executiveDetailContentlist: executiveDetailContent[] = [];
  documentName: string;
  docContentList: docContent[] = [];
  componentCustomFields: any[]=  [];
  remarks = ''; currentDate = new Date();
  annexure = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','AA','AB',
    'AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ',
    'AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF',
    'BG','BH','BI','BJ','BK','BK'];
  docContentPosition = false;
  drugResultTest: any[] = [];
  clientLogoRep: ClientLogoReport;
  clientContact: any;
  clientContactName: any;
  clientCustomField: any[] = [];
  addList: any;
  dataList: any[] = [];
  CompFlag: any;
  verReportDate: any;
  fdaFlag : boolean = false;
 kryalogo: any;
  // criminalDatabaseReportDetValue = new CriminalDatabaseReportDet();
  constructor(public verificationService: VerificationService, private datePipe: DatePipe, public router: Router,
    private sanitizer: DomSanitizer, public commonService: CommonService) { }

  ngOnInit() {
    this.finalReport = (this.verificationService.finalReportvalue as any);
    this.dataList = this.finalReport.verificationOnlineDatabaseandCourtdetails.verficationcourtDetails;
    this.CompFlag = this.finalReport.summaryDetail[0].componentType;
    // this.finalReport.candidateDetail.dateInitiated = '' + (this.commonService.getTimezoneOffset(
    //   new Date(this.finalReport.candidateDetail.dateInitiated), false));
    this.docContentList = this.finalReport.document;
    this.verificationService.clientId = this.verificationService.finalReportvalue.candidateDetail.clientId;
    this.genrateData();
    this.checkFDAFlag();
    this.documentName = '';
    window.scrollTo(0, 0);
    for (let i = 0; i < this.finalReport.clientCustomFields.length; i += 2) {
      this.clientCustomField.push(this.finalReport.clientCustomFields.slice(i, i + 2));
    }
    this.docContentPosition = this.finalReport.candidateDetail.reportLookName === 'Executive Summary-All Summary Details-All Annexure';
    this.clientLogoRep = (this.verificationService.clientLogoaddress as any);
    if (this.clientLogoRep && this.clientLogoRep.clientContact.length > 0) {
      this.clientContactName = this.clientLogoRep.clientContact;
    }
  this.kryalogo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.finalReport.candidateDetail.companyLogo.logo);
   
  // this for Synechron client change Orange to Amber
      if (this.finalReport.candidateDetail.clientName === "Synechron Technologies Pvt. Ltd" ) {
    this.finalReport.candidateDetail.colorCode = this.finalReport.candidateDetail.colorCode ==="Orange"?"Amber":this.finalReport.candidateDetail.colorCode;
    this.executiveDetailContentlist = this.executiveDetailContentlist.map((item:any)=>({
  ...item,
  component:item.component.map((comp:any)=>({
    ...comp,
    status:comp.status==="Orange"?"Amber":comp.status
      }))
    }))     
  }

  
  }
  checkDbFDA(data: any) {
    for(let i=0;i<data.length;i++){
      if(data[i].component != null &&data[i].component.length>0 ){
     if(data[i].component[0].criminalDatabaseApplicantDet != null && data[i].component[0].criminalDatabaseApplicantDet && data[i].component[0].criminalDatabaseApplicantDet.criminalDatabaseType === "FDA Debarment Database"){
      return true;
     }else{
      
     }
      }
    }
    
  }
  checkFDAFlag(){
     const databaseComp = this.verificationService.finalReportvalue.summaryDetail.filter(f=>f.compId == this.commonService.CRIMINAL_DATABASEID);
     const FDAComp = this.verificationService.finalReportvalue.summaryDetail.filter(f=>f.compId == this.commonService.FDAID);
     var dbCompName = '';
     if(databaseComp != null && FDAComp != null && databaseComp.length>0 && FDAComp.length>0){      
      this.dbCompFlag =  this.checkDbFDA(databaseComp)
      
     }
    if(this.verificationService.finalReportvalue.candidateDetail.ctsflag && databaseComp != null && FDAComp != null &&FDAComp.length>0 &&(databaseComp.length>4 || this.dbCompFlag)){
      this.fdaFlag = true;
    }else{
      this.fdaFlag = false;
    }
  }
  getHeader() {
    return (((this.finalReport.candidateDetail.reOpenFlag === true || this.finalReport.candidateDetail.subCheckFlag === true) &&
      this.router.url.includes('qualityCheckDetail')) || this.router.url.includes('verificationDetail'));
  }
  ngAfterViewInit(): void {
    // if (this.verificationService.reportType === 'download' && this.verificationService.fromQC) {
    //below or(||) condition has added because of while preview, for both autoIQC && auto FQC config case report header not showing properly issue.
    if (this.verificationService.reportType === 'download' || (this.verificationService.enableAutoIqc === true && this.verificationService.enableAutoFqc === true && this.verificationService.reportType == 'preview')) {
      this.verificationService.generatePdfDocContent();
    }
  }
  getEmployeeFlag() {
    return this.summaryContentList.some(x => x.allReportDefault && (x.allReportDefault.employmentType === 'Current' || x.allReportDefault.employmentType === 'Current Employment' || x.allReportDefault.employmentType === 'Current/Last Employment'));
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
          // Remove Father Name  and Gender section in Database 01 Mar 2026
     if (this.verificationService.finalReportvalue.candidateDetail.ctsflag && element.header === "Database") 
      {
        const removeCaption = ["Father Name", "Gender"];
        element.component[0].displayCaption =
          element.component[0].displayCaption.filter(
            (item) => !removeCaption.includes(item.caption),
          );
      } 
      if (this.verificationService.finalReportvalue.candidateDetail.ctsflag && element.header === "OFAC") 
        {
        const removeCaption = [
          "Father Name",
          "Date of Birth",
          "Gender",
          "Address",
          "Period Of Stay From",
          "Period Of Stay To",
        ];
        element.component[0].displayCaption =
          element.component[0].displayCaption.filter(
            (item) => !removeCaption.includes(item.caption),
          );
      }
          if (element.componentType == "address" || element.componentType == "creditverification" || element.componentType == "panIndiaOCRV" || element.componentType == "criminalCheckPCC1PCC2" || element.componentType == "criminalCheckPCC3PCC3E" || element.componentType == "crc") {
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
          if (this.docContentList !== null) {
            summaryData.docContentList = this.docContentList.filter(comp => comp.screeningCompId === element.screeningCompId)
              .sort((a, b) => a.docId - b.docId/* && a.displayOrder - b.displayOrder*/);
            summaryData.docContentList.forEach(e => {
              e.annexureVal = this.annexure[annexNameIndex];
              if (annexNameIndex < 64) { annexNameIndex++; } else { annexNameIndex = 0; }
            });
          }
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

            if (element.componentType === 'drugTest') {
              if (reportDet && reportDet.drugTestResultReport && reportDet.drugTestResultReport.length > 0) {
                this.drugResultTest = reportDet.drugTestResultReport;
              }
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
              summaryData.verificationDate = (data[element.componentType + 'ReportDet']['verificationDate']);
              summaryData.caseDetailFlag = (data[element.componentType + 'ReportDet']['caseDetailFlag']);
              summaryData.currentEmpFlag = (data[element.componentType + 'ApplicantDet']['currentEmpFlag']);
              summaryData.screeningStatus = (data[element.componentType + 'ApplicantDet']['screeningStatus']);
              summaryData.cvValidation = (data[element.componentType + 'ApplicantDet']['compRef']);
              summaryData.gapRemarks = (data[element.componentType + 'ApplicantDet']['gapRemarks']);
              summaryData.cVRemarks = (data[element.componentType + 'ApplicantDet']['cVRemarks']);
              summaryData.colorStatus = (data[element.componentType + 'ReportDet'][element.componentType + "ReportContact"]['colorStatus']);
              summaryData.screeningReportContactId = (data[element.componentType + 'ReportDet'][element.componentType + "ReportContact"]['screeningReportContactId']);
            }
            if (this.verificationService.finalReportvalue.candidateDetail.ctsflag && element.componentType === "referenceCheck") {
             element.component[0].displayCaption = element.component[0].displayCaption.filter(
             (e) => e.key !== "verifiedPerson" );
             }
            if (element.componentType === 'companySiteVisit' || element.componentType === 'employee' || element.componentType === 'previousemployee'
              || element.componentType === 'criminalCheckPCC1PCC2' || element.componentType === 'currentemployee'
              || element.componentType === 'employmentHrAndSupervisor'
              || element.componentType === 'referenceCheck' || element.componentType === 'education'
              || element.componentType === 'employmentSupervisor' || element.componentType === 'referenceSelfEmployed'
              || element.componentType === 'emergencyContactVerification') {
              summaryData.miscRepQns = compElement[element.componentType + 'ReportDet']['miscellaneousQuestion'];
              summaryData.miscAppQns = compElement[element.componentType + 'ApplicantDet']['miscellaneousQuestion']
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
                reportDetData['relationWithCandidate'] = reportDet['relationWithCandidate'];
                break;
              }
              case 'creditverification': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
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
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd-MM-yyyy');
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
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                //reportDetData['collectionDate'] = this.commonService.getTimezoneOffset(reportDetData['collectionDate'], false);
                //reportDetData['testDate'] = this.commonService.getTimezoneOffset(reportDetData['testDate'], false);
                //reportDetData['reportDate'] = this.commonService.getTimezoneOffset(reportDetData['reportDate'], false);
                reportDetData['collectionSite'] = reportDet['drugTestReportContact']['collectionSite'];
                reportDetData['specimenId'] = reportDet['drugTestReportContact']['specimenId'];
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
                  reportDetData['dateOfVerification'] = this.datePipe.transform(conDate, 'dd-MM-yyyy');
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

              case 'criminalCheckPCC1PCC2':
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

              case 'crc': {
                reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
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
              case 'license':
                {
                  reportDetData = [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});
                  applicantDetData = [appliacantDet, appliacantDet['address']].reduce(((r, c) => Object.assign(r, c)), {});

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
                // reportDetData['incorporationDate'] = new DatePipe('en-Us').transform(reportDetData['incorporationDate'], 'dd/MM/yyyy');
                // reportDetData['incorporationDate'] = this.commonService.getTimezoneOffset(reportDetData['incorporationDate'], false);
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
                    (reportDetData[capttionEl.key]) as any : '';
                  const applicanttval = applicantDetData[capttionEl.key] ?
                    //capttionEl.dataType === 'Date' ? this.retDate(applicantDetData[capttionEl.key], 'string') :
                    (applicantDetData[capttionEl.key]) as any : '';
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
            if (summaryData.componentType === "education" && this.finalReport.candidateDetail.ctsflag === true) {
              summaryData.content = summaryData.content.filter(w => w.caption != "Major" && w.caption != "Certificate Issued Date")
            }
            if (summaryData.componentType === 'education' && this.finalReport.candidateDetail.ctsflag !== true) {
              summaryData.content = summaryData.content.filter(w => w.caption !== "Month & Year Of Passing")
            }
            if (summaryData.componentType === 'education' && this.finalReport.candidateDetail.ctsflag !== true) {
              summaryData.content = summaryData.content.filter(w => w.caption !== "Month & Year Of Passing")
            }
            if (summaryData.componentType === 'education' && this.finalReport.candidateDetail.clientName === this.finalReport.candidateDetail.clientName) {
              summaryData.content = summaryData.content.filter(w => w.caption !== "Gap Reason")
            }
            if (summaryData.componentType === 'employee' && this.finalReport.candidateDetail.clientName === this.finalReport.candidateDetail.clientName) {
              summaryData.content = summaryData.content.filter(w => w.caption !== "Gap Reason")
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
            // this for Credit Verification Check address -by visvesvaran
           if(this.verificationService.finalReportvalue.candidateDetail.ctsflag){
            summaryData.content = summaryData.content.map((data: any) => {
               if (data.key === "addressCredit") {
                return {
               ...data,
                reportVal: this.concatAddress(summaryData.allReportDefault.address),
              applicanttVal: this.concatAddress(summaryData.allReportDefault.address),
               };
                 }
              return data;
            });
           }
            this.summaryContentList.push(summaryData);
          }
        });
      }
      if (this.finalReport.executiveDetail) {
        let compid = 0;
        let inx = 0;
        this.finalReport.executiveDetail.forEach(element => {
          if (this.finalReport.candidateDetail.ctsflag && this.verificationService.individualQc === 0 && this.verificationService.screeningId > 0) {
            if (element.componentType != 'employee' && element.componentType != 'databaseConductMedia') {
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
              if (element.componentType == 'drugTest' && this.finalReport.candidateDetail.dateOfReportForDrugTest == true) {
                if (comp.reportDate != null) {
                  this.verReportDate = this.datePipe.transform(comp.reportDate, 'dd-MMM-yyy');
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
