import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FinalReport, ClientLogoReport } from '../models/verification';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private digitalPVReportCache: any[] | null = null;
  prebothconfigFlag: boolean = false;
  enableAutoIqc: boolean = false;
  enableAutoFqc: boolean = false;
  socialId = 39;
  showsnp: boolean;
  closedCheck = false;
  globalSearchFlag = false;
  userData: any;
  tempData: any;
  individualQc = 0;
  frStatusId = 0;
  // screeningStatus: false;
  recivedDocument = false;
  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();
  empMcaStatus = 'http://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do';
  previewData: any;
  finalReportvalue: FinalReport;
  screeningId = 0;
  screeningCompId = 0;
  paymentId = 0;
  paymentClass: any;
  isFinalReport = false;
  dataBaseFlag = false;
  verificationPreFlag: any = '';
  reportType = 'preview';
  caseDetailFlag = false;
  componentDet: any;
  pdfvalue: { docId: number; document: any; fileName: string; filePath: string };
  fileNamePdf = '';
  //fileLogo: { Logo: string;  seal: string; signature: string; };
  fileLogo: any;
  clientLogoaddress: ClientLogoReport;
  commonCasesFlag: boolean;
  verificationSearchData: any[] = [];
  fromQC = false;
  annexDocFlag = false;
  clientId = 0;
  suppReportType: string;
  reportDownload: string;
  show = false;
  supScreeningCompIds: string;
  screeningStatusId = 0;
  digiLockerCallUrl:any;
  searchValue: any;
  assControl: any;
  searchArray: any;
  backFlag = false;
  assignedOrNotAssigned = '';
  veType: string;
  qcFlag = false;
  smsDetails: any;
  casePriorityLookupId: number;
  FeeApprovalFlag: boolean;
  copyDataForPwd: any;
  filters = '';
  ReportTitleID: any;
  isReportColorChanged: any = false;
  modifyAdditionalFeeFlag: boolean;
  modifyComponentFeeFlag: boolean;
  ReportTitle: any;
  //ForCount
  DataEntry = "DataEntry";
  InternationalDataEntry = "InternationalDataEntry";
  TechMDataEntry = "TechMDataEntry";
  DEPreQC = "DEPre-QC";
  PreQCTeam = "DEPreQC";
  CTSSubmissionTeam = "CTS-SubmissionTeam";
  CTSDEPreQC = "CTSDEPreQC";
  CrtIndia = "CRTIndia";
  CrtTechM = "CRTTechMahindra";
  CTSCRTTeam = "CTS-CRTTeam";
CRTAbroad = "CRTAbroad";
  EmploymentIndia = "EmploymentIndia";
  ForResearchEducationTeam = "ForResearchEducationTeam";
  ForResearchEmploymentTeam = "ForResearchEmploymentTeam";
  EducationTeam = "EducationTeam";
  CriminalTeam = "CriminalTeam";
  AddressTeam = "AddressTeam";
  IdentityTeam = "IdentityTeam";
  EmploymentAbroad = "EmploymentAbroad";
  EmploymentTechM = "EmploymentTechM";
  EducationOverseas = "EducationOverseas";
  CTSEducationTeam = "CTS-EducationTeam";
  CTSEmploymentTeam = "CTS-EmploymentTeam";
  CTSAddressTeam = "CTS-AddressTeam";
  CTSCriminalTeam = "CTS-CriminalTeam";
  CTSIdentityTeam = "CTS-IdentityTeam";
  isBothConfig: boolean = false;
  isFinalQCConfig: boolean = false;

  constructor(private http: HttpClient, private router: Router,
    private message: MessageService,) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  }
  changeMessage(message: number) {
    this.messageSource.next(message);
  }
  //Added by megala SRS - VTS2-2024-CRT-0195
  GetVerificationCAMRejectDetails(SearchData: any) {
    const dataUrl = 'verification/GetVerificationCompDetails';
    return this.http.post<any>(dataUrl, SearchData, { observe: 'response' as 'body' });
  }
  GetCamFlag() {
    const dataUrl = 'verification/GetFlagStatus';
    return this.http.get<any>(dataUrl);
  }
  GetscenarioType() {
    const dataUrl = 'verification/GetSenarioSelection';
    return this.http.get<any>(dataUrl);
  }
    //ended by megala SRS - VTS2-2024-CRT-0195

  GetUserList(userData: any) {
    const dataUrl = 'verification/GetUserList';
    return this.http.post<any>(dataUrl, userData);
  }
  getVerificationSearchDetails(SearchData: any) {
    const dataUrl = 'verification/GetVerificationCompDetails';
    return this.http.post<any>(dataUrl, SearchData);
  }
  GetVerificationCompDetails(SearchData: any) {
    const dataUrl = 'verification/GetVerificationCompDetails';
    return this.http.post<any>(dataUrl, SearchData, { observe: 'response' as 'body' });
  }
  //Ajith:- VTS2-2024-EMP-0201
GetScreeningEmployerFollowupHistory(SearchData: any) {
    const dataUrl = 'verification/GetScreeningEmployerFollowupHistory';
    return this.http.post<any>(dataUrl, SearchData);
  }
  SendBulkFollowupMail(verificationDetails: any) {
    const dataUrl = 'verification/SendBulkFollowupMail';
    return this.http.post<any>(dataUrl, verificationDetails);
  }
  GetEmployeeMatch(loginUserDetVm: any) {
    const dataUrl = 'verification/GetEmployeeMatch';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetEmployeeDateMatch(screeningId: any) {
    const dataUrl = 'verification/GetEmployeeDateMatch?screeningId=' + screeningId;
    return this.http.get<any>(dataUrl);
  }

  GetCaseDetailsClient(loginUserDetVm: any) {
    const dataUrl = 'master/GetCaseDetailsClient';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  getVerificationCompDetails(clientRefNo: any) {
    const dataUrl = 'master/GetVerification?clientRefNo=' + clientRefNo;
    return this.http.get<any>(dataUrl);
  }
  GetClientCommentCases(DefaultData: any) {
    const dataUrl = 'DashBoard/GetClientCommentCases';
    return this.http.post<any>(dataUrl, DefaultData);
  }
  addVerificationOwner(verificationDetails: any) {
    const dataUrl = 'verification/AssignVerificationScreeningOwner';
    return this.http.post<any>(dataUrl, verificationDetails);
  }
  addVerificationOrgOwner(verificationDetails: any) {
    const dataUrl = 'verification/AssignOrgVerificationScreeningOwner';
    return this.http.post<any>(dataUrl, verificationDetails);
  }
  getVerificationDetails(verificationDetails: any) {
    const dataUrl = 'verification/GetVerificationTransDet';
    return this.http.post<any>(dataUrl, verificationDetails);
  }
  GetVerificationQcRejectDetails(verificationDetails: any) {
    const dataUrl = 'verification/GetVerificationQcRejectDetails';
    return this.http.post<any>(dataUrl, verificationDetails, { observe: 'response' as 'body' });
  }
  GetVerificationCurrentEmpDetails(employmentDetails: any) {
    const dataUrl = 'verification/GetVerificationCurrentEmpDetails';
    return this.http.post<any>(dataUrl, employmentDetails, { observe: 'response' as 'body' });
  }
  GetVerificationRedEduDetails(loginUserDetVm: any) {
    const dataUrl = 'verification/TeamLeadVerificationDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetReAssignVerificationDetails(loginUserDetVm: any) {
    const dataUrl = 'verification/GetReAssignVerificationDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }

  TeamLeadApprovedOrRejected(verificationMoveToQcVm: any) {

    const dataUrl = 'verification/TeamLeadApprovedOrRejected';
    return this.http.post<any>(dataUrl, verificationMoveToQcVm);
  }
  GetComponentDetailsSearch(searchVm: any) {
    const dataUrl = 'verification/GetComponentDetailsSearch';
    return this.http.post<any>(dataUrl, searchVm, { observe: 'response' as 'body' });
  }
  getDefaultVerificationDetails(verificationDetails: any) {
    const dataUrl = 'verification/GetVerificationTransBindDet';
    return this.http.post<any>(dataUrl, verificationDetails);
  }

  updateCandidateDetails(candidateData: any) {
    const dataUrl = 'verification/UpdateCandidateDetails';
    return this.http.post<any>(dataUrl, candidateData);
  }
  UpdateScreeningOwnerAndVendorName(candidateData: any) {
    const dataUrl = 'verification/UpdateScreeningOwnerAndVendorName';
    return this.http.post<any>(dataUrl, candidateData);
  }
  updateScreeningStatus(screeningStatus: any) {
    const dataUrl = 'verification/UpdateScreeningStatus';
    return this.http.post<any>(dataUrl, screeningStatus);
  }
  updateCaseDetails(caseData: any) {
    const dataUrl = 'verification/updateCaseDetails';
    return this.http.post<any>(dataUrl, caseData);
  }
  addAdditionalFee(additionalFeeDetails): Observable<any> {
    const url = 'verification/AddAdditionalFeeAndComponentDetail';
    return this.http.post<any>(url, additionalFeeDetails);
  }
  UpdateScreeningComponentCurrency(screeningCompId, currencyId, loggedIn): Observable<any> {
    const dataUrl = 'verification/UpdateScreeningComponentCurrency?screeningCompId=' + screeningCompId
      + '&currencyId=' + currencyId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  addVerificationComments(commentsFollowUpDetails): Observable<any> {
    const url = 'verification/AddVerificationComments';
    return this.http.post<any>(url, commentsFollowUpDetails);
  }
  addSupportingDocument(additionalFeeDetails): Observable<any> {
    const url = 'verification/AddSupportingDocument';
    return this.http.post<any>(url, additionalFeeDetails);
  }
  addVerificationDocument(additionalFeeDetails): Observable<any> {
    const url = 'verification/AddVerificationDocument';
    return this.http.post<any>(url, additionalFeeDetails);
  }
  deleteAdditionalFee(screeningCompFeeId, userId): Observable<any> {
    const dataUrl = 'verification/RemoveAdditionalFeeComponent?screeningCompFeeId=' + screeningCompFeeId + '&userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  deleteVerificationComments(TransactionId, userId): Observable<any> {
    const dataUrl = 'verification/DeleteVerificationComments?TransactionId=' + TransactionId + '&userId=' + userId;
    return this.http.post<any>(dataUrl, TransactionId, userId);
  }
  getAdditionalFeesByScreeningCompId(screeningCompId: number) {
    const dataUrl = 'verification/GetAdditionalFeesByScreeningCompId?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  //ClientRefNo Added By Megala - for VTS2-2023-DEV-0141 (Comment History Added In Global Search)
  getComponentComments(screeningCompId: number, ScreeningId: number,clientRefNo: string) {
    const dataUrl = 'verification/GetComponentComments?screeningCompId=' + screeningCompId + '&screeningId=' + ScreeningId +'&clientRefNo='+clientRefNo;
    return this.http.get<any>(dataUrl);
  }
  saveResponseDocumentDetails(compData: any, compName: string): Observable<any> {
    const dataUrl = 'verification/' + compName + 'UpdateRptDetails';
    return this.http.post<any>(dataUrl, compData);
  }
  getCriminalComponentStatus() {
    const dataUrl = 'verification/GetCriminalComponentStatus';
    return this.http.get<any>(dataUrl);
  }
  getNICRemarks() {
    const dataUrl = 'verification/GetNICRemarks';
    return this.http.get<any>(dataUrl);
  }
  getComponentStatus(screeningCompId: number = 0) {
    const dataUrl = 'verification/GetComponentStatus?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  addComponentComments(policyComments): Observable<any> {
    const url = 'verification/AddComponentComments';
    return this.http.post<any>(url, policyComments);
  }
  sendMailToQc(sendMailToQc: any) {
    const dataUrl = 'verification/ComponentMoveToQc';
    return this.http.post<any>(dataUrl, sendMailToQc);
  }
  sendMailToTl(colorstatus, screeningCompId, teamName) {
    const dataUrl = 'verification/SaveSendToTL?colorStatus=' + colorstatus + '&screeningCompId=' + screeningCompId + '&teamName=' + teamName;
    return this.http.get<any>(dataUrl);
  }

  sendMailToCAM(verificationCamVm: any) {
    const dataUrl = 'verification/ComponentToCAMApproval';
    return this.http.post<any>(dataUrl,verificationCamVm);
  }
  CamRejectToCAMApproval(verificationCamVm: any) {
    const dataUrl = 'verification/CamRejectToCAMApproval';
    return this.http.post<any>(dataUrl,verificationCamVm);
  }
  GetClientFeeApproval(clientId): Observable<any> {
    const dataUrl = 'verification/GetClientFeeApproval?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  AddClientFeeApproval(lstClientApprovalFeeVm: any) {
    const dataUrl = 'verification/AddClientFeeApproval';
    return this.http.post<any>(dataUrl, lstClientApprovalFeeVm);
  }
  ComponentQcMailView(data: any) {
    const dataUrl = 'verification/ComponentQcMailView';
    return this.http.post<any>(dataUrl, data);
  }
  GetResponseDocument(screeningId: number = 0, screeningCompId: number = 0, type?:string) {
    const dataUrl = 'verification/GetResponseDocument?screeningId=' + screeningId + '&screeningCompId=' + screeningCompId + '&screeningCompId=' + '&type=' + type;
    return this.http.get<any>(dataUrl);
  }

  getEmpInsNameBySoundex(id: number, screeningId: number = 0, flag: boolean) {
    const dataUrl = 'master/GetEmpInsNameBySoundex?id=' + id + '&screeningId=' + screeningId + '&flag=' + flag;
    return this.http.get<any>(dataUrl);
  }
  UpdateVerified(screeningId: number = 0, screeningCompId: number = 0, createdUserId: number = 0) {
    const dataUrl = 'verification/UpdateVerified?screeningId=' + screeningId +
      '&screeningCompId=' + screeningCompId + '&createdUserId=' + createdUserId;
    return this.http.get<any>(dataUrl);
  }
  // Drug Test
  getDrugDetails(panelId, screeningDrugTestId) {
    const dataUrl = 'verification/GetDrugDetails?panelId=' + panelId + '&screeningDrugTestId=' + screeningDrugTestId;
    return this.http.get<any>(dataUrl);
  }
  getDrugLookupDetails() {
    const dataUrl = 'verification/GetDrugTestResultType';
    return this.http.get<any>(dataUrl);
  }
  AddUpdateDrugTestResultDetails(lstDrugTestVm: any) {
    const dataUrl = 'verification/AddUpdateDrugTestResultDetails';
    return this.http.post<any>(dataUrl, lstDrugTestVm);
  }
  GetVerificationRejectRemarks(screeningCompId: any) {
    const dataUrl = 'verification/GetVerificationRejectRemarks?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  getContactRemarksDetailList(contactRemarkId): Observable<any> {
    const dataUrl = 'verification/GetContactRemark?contactRemarkId=' + contactRemarkId;
    return this.http.get<any>(dataUrl);
  }
  getFreezeContactRemarkTransId(clientId, compId, screeningStatusId) {
    const dataUrl = 'verification/GetFreezeContactRemarkTransId?clientId=' + clientId + '&compId=' + compId +
      '&screeningStatusId=' + screeningStatusId;
    return this.http.get<any>(dataUrl);
  }
  // getContactRemarksCompNameList(): Observable<any> {
  //   const dataUrl = 'verification/GetContactRemarkList';
  //   return this.http.get<any>(dataUrl);
  // }
  deleteContactRemarksDetail(ContactRemarkId, loggedIn): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const dataUrl = 'verification/DeleteContactRemark?ContactRemarkId=' + ContactRemarkId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  saveContactRemarksDetail(ScreeningRptContactRemarks): Observable<any> {
    const dataUrl = 'verification/AddContactRemark';
    return this.http.post(dataUrl, ScreeningRptContactRemarks);
  }
  editContactRemarksDetail(ScreeningRptContactRemarksId: number): Observable<any> {
    const dataUrl = 'verification/GetContactRemarkById?ScreeningRptContactRemarksId=' + ScreeningRptContactRemarksId;
    return this.http.get(dataUrl);
  }
  QCApproveGeneratePdf(data: any) {
    this.copyDataForPwd = data;
    const dataUrl = 'verification/QCApproveGeneratePdf';
    return this.http.post<any>(dataUrl, data);
  }
  GeneratePdf(data: any) {
    this.copyDataForPwd = data;
    let dataUrl = ''
    if (this.individualQc != null) {
      dataUrl = this.individualQc === 0 ? 'verification/GeneratePdf?type=fqc' : 'verification/GeneratePdf?type=iqc';
    } else {
      dataUrl = 'verification/GeneratePdf';
    }
    return this.http.post<any>(dataUrl, data);
  }
  GenerateBytePdf(data: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.post<any>('pdf', data, { headers: headers, responseType: 'blob' as 'json' });
  }
  SupplementaryReportGeneratePdf(data: any) {
    const dataUrl = 'verification/SupplementaryReportGeneratePdf';
    return this.http.post<any>(dataUrl, data);
  }
  InterimReportGeneratePdf(data: any) {
    const dataUrl = 'verification/InterimReportGeneratePdf';
    return this.http.post<any>(dataUrl, data);
  }
  getPaymentModeList(): Observable<any> {
    const dataUrl = 'verification/GetPaymentMode';
    return this.http.get<any>(dataUrl);
  }
  savePaymentDetails(data): Observable<any> {
    const dataUrl = 'verification/AddPaymentDetail';
    return this.http.post<any>(dataUrl, data);
  }
  getCommunicationModeList(): Observable<any> {
    const dataUrl = 'verification/GetCommunicationModeStatusDetails';
    return this.http.get<any>(dataUrl);
  }
  saveCommunicationDetails(data): Observable<any> {
    const dataUrl = 'verification/AddCommunicationDetail';
    return this.http.post<any>(dataUrl, data);
  }
  saveOverrideFee(data): Observable<any> {
    const dataUrl = 'verification/AddOverrideFeeDetail';
    return this.http.post<any>(dataUrl, data);
  }
  // Address pvform
  GetemailTemplate() {
    const dataUrl = 'verification/GetEmailTemplateById';
    return this.http.get<any>(dataUrl);
  }

  GetPreviousClosedcases(empInsId,empEduFlag,clientCategoryID) {
    const dataUrl = 'verification/GetPreviousClosedcasesCount?empInsId=' + empInsId + '&empEduFlag=' + empEduFlag + '&clientCategoryID=' + clientCategoryID;
    return this.http.get<any>(dataUrl);
  }
  GetComponentDetails() {
    const dataUrl = 'verification/GetComponentDetails';
    return this.http.get<any>(dataUrl);
  }
  GetPriorityCount(userData: any) {
    const dataUrl = 'verification/GetPriorityCount';
    return this.http.post<any>(dataUrl, userData);
  }
  // GetPriority(PriorityLookup, loggedIn, applicationId) {
  //   const dataUrl = 'verification/GetPriority?PriorityLookup=' + PriorityLookup + '&loggedIn=' + loggedIn
  //     + '&applicationId=' + applicationId;
  //   return this.http.get<any>(dataUrl);
  // }
  GetPriority(getPriorityVm: any) {
    const dataUrl = 'verification/GetPriority';
    return this.http.post<any>(dataUrl, getPriorityVm);
  }

  GetDashboardCallBackList(name, loggedIn, teamName) {
    const dataUrl = 'verification/GetDashboardCallBackList?name=' + name + '&loggedIn=' + loggedIn + '&teamName=' + teamName;
    return this.http.get<any>(dataUrl);
  }

  GetSearchDetails(searchDetailsVm): Observable<any> {
    const dataUrl = 'verification/GetSearchDetails';
    return this.http.post<any>(dataUrl, searchDetailsVm);
  }
  getRecordCheckList() {
    const dataUrl = 'verification/GetRecordCheckList';
    return this.http.get<any>(dataUrl);
  }
  getRecordCategoryList(recordCheckId, clientId) {
    const dataUrl = 'verification/GetRecordCheckCategoryList?recordCheckId=' + recordCheckId + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  saveRecordCheckDetails(recordCheckDetails: any) {
    const dataUrl = 'verification/AddUpdateRecordCheckDetails';
    return this.http.post<any>(dataUrl, recordCheckDetails);
  }
  generateAnnexure(clientId, screeningCompId, candidateName, screeningCriminalDatabaseId, loggedIn) {
    const dataUrl = 'verification/GenerateAnnexure?clientId=' + clientId + '&screeningCompId=' + screeningCompId +
      '&CandidateName=' + candidateName + '&screeningCriminalDatabaseId=' + screeningCriminalDatabaseId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  deleteAnnexure(screeningCompId, loggedIn) {
    const dataUrl = 'verification/DeleteAnnexure?screeningCompId=' + screeningCompId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  getRecordCheckDetails(screeningCriminalDatabaseId: any) {
    const dataUrl = 'verification/GetRecordCheckDetail?screeningCriminalDatabaseId=' + screeningCriminalDatabaseId;
    return this.http.get<any>(dataUrl);
  }
  getAnnexureDocument(screeningCompId: any) {
    const dataUrl = 'verification/GetAnnexureDocument?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  getOrganizationLogo(clientId: any) {
    const dataUrl = 'Invoice/GetClientLogo?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  GetSupplementaryReportDocument(supplementaryReport: any) {
    const dataUrl = 'verification/GetSupplementaryReportDocument';
    return this.http.post<any>(dataUrl, supplementaryReport);
  }
  GetInterimReportDocument(screeningId, loggedIn, reportTitleId) {
    const dataUrl = 'verification/GetInterimReportDocument?screeningId=' + screeningId + '&loggedIn=' + loggedIn + '&reportStatusTitleId=' + reportTitleId;
    return this.http.get<any>(dataUrl);
  }
  sendInterimReportMail(screeningId, clientId, colorCode, loggedIn) {
    const dataUrl = 'verification/SendInterimReportMail?screeningId=' + screeningId + '&clientId=' + clientId + '&colorCode=' + colorCode + '&loggedIn=' + loggedIn;
    return this.http.post<any>(dataUrl, null);
  }
  GetColorStatusRemarksId(clientId, compId, colorStatusLookupId) {
    const dataUrl = 'verification/GetColorStatusRemarksId?clientId=' + clientId + '&compId=' + compId + '&colorStatusLookupId=' +
      colorStatusLookupId;
    return this.http.get<any>(dataUrl);
  }
  getClientReportHeaderFooter(clientId: any) {
    const dataUrl = 'Invoice/GetClientReportHeaderFooter?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  AddAuditUser(auditVm: any) {
    const dataUrl = 'Verification/AddAuditUser';
    return this.http.post<any>(dataUrl, auditVm);
  }
  verificationReject(verificationRejectVm: any) {
    const dataUrl = 'Verification/VerificationReject';
    return this.http.post<any>(dataUrl, verificationRejectVm);
  }
  camReject(verificationCamRejectVm: any) {
    const dataUrl = 'Verification/SaveCamRejectionRemarks';
    return this.http.post<any>(dataUrl, verificationCamRejectVm);
  }
  camApproval(VerificationMoveToQcVm: any) {
    const dataUrl = 'Verification/SaveCamApproval';
    return this.http.post<any>(dataUrl, VerificationMoveToQcVm); 
  }
  bulkCamApproval(VerificationMoveToQcVm: any) {
    const dataUrl = 'Verification/SaveCamBulkApproval';
    return this.http.post<any>(dataUrl, VerificationMoveToQcVm); 
  }
  FRReject(ForResearchRejectVm: any) {
    const dataUrl = 'Verification/ForResearchReject';
    return this.http.post<any>(dataUrl, ForResearchRejectVm);
  }
  GetSendSmsTemplate(clientId, screeningCompId) {
    const dataUrl = 'Verification/GetMobileSendSmsTemplate?clientId=' + clientId + '&screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  GetAddressSendSmsTemplate(clientId, screeningCompId) {
    const dataUrl = 'Verification/GetAddressSendSmsTemplate?clientId=' + clientId + '&screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  AddressSendSMSMail(data: any) {
    const dataUrl = 'Verification/AddressSendSMSMail';
    return this.http.post<any>(dataUrl, data);
  }
  digitalAddressCheckPVReport(loginUserDetVm: any) {
    if (this.digitalPVReportCache) {
      return of(this.digitalPVReportCache);
    }
    const dataUrl = 'Verification/DigitalAddressCheckPVReport';
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap(data => { this.digitalPVReportCache = data; })
    );
  }

  clearDigitalPVReportCache() {
    this.digitalPVReportCache = null;
  }
  digitalAddressCheckGeo(loginUserDetVm: any) {
    const dataUrl = 'Verification/DigitalAddressCheckGeo';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  public getDigitalDocument(docId: number): Observable<any> {
    const dataUrl = 'Verification/GetDigitalDocument?docId=' + docId;
    return this.http.get(dataUrl);
  }
  public getMailDetails(Comid: number, compName: string, clientId, siteId, discloseFlag): Observable<any> {
    const dataUrl = 'Verification/GetMailTemplate?screeningCompId=' + Comid + '&compName=' + compName + '&clientId=' + clientId + '&siteId=' + siteId + '&discloseFlag=' + discloseFlag;
    return this.http.get(dataUrl);
  }
  public getSupervisorMail(Comid: number): Observable<any> {
    const dataUrl = 'Verification/GetSupMailTemplate?screeningCompId=' + Comid;
    return this.http.get(dataUrl);
  }
  public getMail(Comid: number): Observable<any> {
    const dataUrl = 'Verification/Getemployermailid?empId=' + Comid;
    return this.http.get(dataUrl);
  }
  public getSupMail(Comid: number): Observable<any> {
    const dataUrl = 'Verification/Getsupermailid?empId=' + Comid;
    return this.http.get(dataUrl);
  }
  public sendVerficationMail(obj: FormData): Observable<any> {
    const dataUrl = 'Verification/SendVerficationMail';
    return this.http.post(dataUrl, obj);
  }
  public sendCamAprvMail(obj: FormData): Observable<any> {
    const dataUrl = 'Verification/SendClosureAdviceMail';
    return this.http.post(dataUrl, obj);
  }
  public sendDigilockerFinalMail(obj: FormData): Observable<any> {
    const dataUrl = 'Verification/SendDigiLockerMail';
    return this.http.post(dataUrl, obj);
  }
  public SendSupervisorMail(Verfication: any): Observable<any> {
    const dataUrl = 'Verification/SendSupervisorMail';
    return this.http.post(dataUrl, Verfication);
  }
  getClientComponentFee(screeningCompId): Observable<any> {
    const dataUrl = 'verification/GetClientComponentFee?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  public GetColorCode(screeningId: number, screeningCompId: number): Observable<any> {
    const dataUrl = 'Verification/GetColorCode?screeningId=' + screeningId + '&screeningCompId=' + screeningCompId;
    return this.http.get(dataUrl);
  }
  //VTS2-2024-IDE-0213 -point hold
  // public GenerateDatabaseAnnexure(screeningCompId:any,loggedIn:number,clientId :any): Observable<any> {
  //   const dataUrl = 'Verification/GenerateDatabaseAnnexure?screeningCompId=' + screeningCompId+ '&loggedIn='+loggedIn+'&clientId='+clientId+'';
  //   return this.http.post<any>(dataUrl, null);
  // }
  // public RemoveDatabaseAnnexure(screeningCompId:any,loggedIn:number): Observable<any> {
  //   const dataUrl = 'Verification/RemoveDatabaseAnnexure?screeningCompId=' + screeningCompId+ '&loggedIn='+loggedIn+'';
  //   return this.http.post<any>(dataUrl, null);
  // }
  public SendMailtoGenerateDigiLockerURL(screeningId :any,screeningCompId:any,loggedIn:any): Observable<any> {
    const dataUrl = 'Verification/SendMailtoGenerateDigiLockerURL?screeningId=' + screeningId + '&screeningCompId=' + screeningCompId+ '&loggedIn=' + loggedIn;
    return this.http.post<any>(dataUrl, null);
  }
  public GetDigiLockerMailTemplate(screeningId :any,screeningCompId:any,loggedIn:any): Observable<any> {
    const dataUrl = 'Verification/GetDigiLockerMailTemplate?screeningId=' + screeningId + '&screeningCompId=' + screeningCompId+ '&loggedIn=' + loggedIn;
    return this.http.post<any>(dataUrl, null);
  }
  generatePdfDoc(clientId?: number) {
    this.getOrganizationLogo(clientId).subscribe(resp => {
      if (resp) {
        this.fileLogo = resp;
        this.generatePdfDocContent();
      }
    }, err => { }, () => {
      // this.generatePdfDocContent(clientId);
    });
  }

  GetModifyInterimReportStatus(clientId?: number): Observable<any> {
    const dataUrl = 'Qc/GetModifyInterimReportStatus?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  generatePdfDocContent() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // const reportHeader = document.getElementById('reportHeader').innerHTML;
    // const reportHeader2 = document.getElementById('reportHeader2').innerHTML;
    // const reportBody = document.getElementById('reportBody').innerHTML;

    let reportContent1 = document.getElementById('report').innerHTML;
    reportContent1 = reportContent1.replace('unsafe:', '');
    // let reportContent2 = document.getElementById('reportContent2').innerHTML;
    // reportContent2 = reportContent2.replace('unsafe:', '');
    // const reportFooter = document.getElementById('reportFooter').innerHTML;
    if (this.dataBaseFlag === true) {
      this.individualQc = 0;
    }
    this.dataBaseFlag = false;
    const individualQc = this.individualQc;
    const screeningId = individualQc === 1 ? 0 : this.screeningId;
    //const screeningCompId = this.screeningCompId;
    const colorCode = this.finalReportvalue.candidateDetail.colorCode;
    const screeningCompId = individualQc === 1 ? this.screeningCompId : screeningId === 0 ?
      +this.tempData.verificationScreeningDet.screeningCompId : 0;
    const generatePdfValue: GeneratePdf = {
      screeningId,
      screeningCompId,
      colorCode,
      clientId: this.clientId,
      firstHtmlHeader: null, //reportHeader as any,
      secondHtmlHeader: null, // reportHeader2 as any,
      htmlExecutiveContent: '',
      htmlSummaryContent: '',
      htmlContent: reportContent1 as any,
      htmlContent2: null,// reportContent2 as any,
      htmlFooter: null,
      pdfPassword: 'test',
      setPdfPassword: false,
      createdUserId: this.userData.userId,
      htmlDisclaimer: '' as any,
      supScreeningCompIds: this.supScreeningCompIds,
      reportTitleId: this.ReportTitleID,
      isColorCodeChanged: this.isReportColorChanged,
      isBothConfig: this.isBothConfig,
      isFinalQCConfig: this.isFinalQCConfig
    };
    if (this.suppReportType === 'supplementary') {
      this.SupplementaryReportGeneratePdf(generatePdfValue).subscribe((res:
        { docId: number; document: any; fileName: string; filePath: string }) => {
        if (res) {
          this.pdfvalue = res;
          // const words = this.pdfvalue.filePath.split('\\');
          // this.pdfvalue.fileName = words[words.length - 1];
          const sampleArr = this.base64ToArrayBuffer(this.pdfvalue.document);
          this.saveByteArray(this.pdfvalue.fileName, sampleArr);
        }
      });
    } else if (this.suppReportType === 'interim') {
      if (this.ReportTitle === 'Case Status') {
        generatePdfValue.colorCode = ''

      }

      this.InterimReportGeneratePdf(generatePdfValue).subscribe((res:
        { docId: number; document: any; fileName: string; filePath: string }) => {
        if (res) {
          this.pdfvalue = res;
          // const words = this.pdfvalue.filePath.split('\\');
          // this.pdfvalue.fileName = words[words.length - 1];
          const sampleArr = this.base64ToArrayBuffer(this.pdfvalue.document);
          this.saveByteArray(this.pdfvalue.fileName, sampleArr);
        }
      });
    } else if (this.suppReportType === 'iqcinterim') {
      this.InterimReportGeneratePdf(generatePdfValue).subscribe((res:
        { docId: number; document: any; fileName: string; filePath: string }) => {
        if (res) {
          this.pdfvalue = res;
          if (this.pdfvalue) {
            const interimColorCode = this.finalReportvalue.candidateDetail.colorCode;
            this.sendInterimReportMail(this.screeningId, this.clientId, interimColorCode, this.userData.userId).subscribe(res => {
              if (res) {
                this.router.navigate(['/dashboard/qc/qualitycheck']);
              }
            });
          }
          // const words = this.pdfvalue.filePath.split('\\');
          // this.pdfvalue.fileName = words[words.length - 1];
          //const sampleArr = this.base64ToArrayBuffer(this.pdfvalue.document);
          //this.saveByteArray(this.pdfvalue.fileName, sampleArr);
        }
      });
    } else if (this.suppReportType === 'qcPreview') {
      this.GenerateBytePdf(generatePdfValue).subscribe((res) => {
        if (res) {
          // const sampleArr = this.base64ToArrayBuffer(res);
          this.saveByteArray((this.fileNamePdf + '.pdf'), res);
        }
      });
    } else if (this.suppReportType === 'fqcData') {
      this.copyDataForPwd = generatePdfValue;
    } else {
      if (this.reportDownload === 'reportDown') {
        this.GeneratePdf(generatePdfValue).subscribe((res:
          { docId: number; document: any; fileName: string; filePath: string }) => {
          if (res) {
            this.pdfvalue = res;
            this.show = false;
            const sampleArr = this.base64ToArrayBuffer(this.pdfvalue.document);
            this.saveByteArray(this.pdfvalue.fileName, sampleArr);

          }
        });
      } else {
        this.showsnp = true;
        this.GeneratePdf(generatePdfValue).subscribe((res:
          { docId: number; document: any; fileName: string; filePath: string }) => {
          this.pdfvalue = res;
          if (this.pdfvalue) {
            this.showsnp = false;
          }
          // if (this.tempData !== undefined) {
          //   if (this.tempData.enableAutoIqc === true && this.tempData.enableAutoFqc === true) {
          //     this.copyDataForPwd.screeningId = this.tempData.screeningId;
          //     this.QCApproveGeneratePdf(this.copyDataForPwd).subscribe(res => {
          //       this.showTopCenter('success', 'Success Message', res.message);
          //     });
          //   }
          // }
          // const words = this.pdfvalue.filePath.split('\\');
          // this.pdfvalue.fileName = words[words.length - 1];
        }, err => {
        }, () => {
          this.isFinalReport = this.reportType === 'preview';
        });
      }
    }
    this.ReportTitle = '';
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  saveByteArray(filename, byte) {
    const blob = new Blob([byte], { type: 'application/octet-stream' });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else { // for Non-IE (chrome, firefox etc.)
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none;');
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
    }
  }
  getCommonFileLogo(list, name, subName): string {
    let retValue = '';
    if (list && list !== null && list.length > 0) {
      const listValue = list.filter(x => x.logoLookupName === name);
      if (listValue.length > 0 && subName) {
        retValue = list.find(x => x.signatureLookupName === subName).filePath;
      } else if (listValue.length > 0 && !subName) {
        retValue = listValue[0].filePath;
      }
    }
    return retValue;
  }
  GetClosureAdviceMailTemplate(screeningCompId: any) {
    const dataUrl = 'verification/GetClosureAdviceMailTemplate?screeningCompId='+screeningCompId;
    return this.http.get<any>(dataUrl);
  }
}

class GeneratePdf {
  screeningId: number;
  screeningCompId: number;
  firstHtmlHeader: object;
  secondHtmlHeader: object;
  htmlFooter: object;
  pdfPassword: string;
  setPdfPassword: boolean;
  htmlContent: object;
  htmlContent2: object;
  htmlExecutiveContent: string;
  htmlSummaryContent: string;
  htmlDisclaimer: object;
  clientId: number;
  createdUserId: number;
  supScreeningCompIds: string;
  colorCode: string;
  reportTitleId: any;
  isColorCodeChanged: any;
  isBothConfig: boolean;
  isFinalQCConfig: boolean
}
