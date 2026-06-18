import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  userData: any;
  constructor(private http: HttpClient) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);

  }
  getCriminalReportData(compId: number, clienId: number, statusId: number, dateStr: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const dataUrl = 'Report/GetCriminalReportByCompID?compId=' + compId + '&ClinetId=' + clienId + '&StatusId=' + statusId + '&DateStr=' + dateStr;
    return this.http.get(dataUrl);
  }
  GetAllPendingComponentListMultipleClientId(repInp): Observable<any> {
    const dataUrl = 'Report/GetAllPendingComponentListMultipleClientId';
    return this.http.post(dataUrl, repInp);
  }
  getCommonLookUpData(userData?: any): Observable<any> {
    const dataUrl = 'Report/GetCommonReportLookUp';
    return this.http.post(dataUrl, userData);
  }
  // Added by Megala For MIS -Report -08-04-2024
  getAddressMisDropdown(userData?: any): Observable<any> {
    const dataUrl = 'Report/getAddressMisDropdown';
    return this.http.post(dataUrl, userData);
  }
  getCriminalMisDropdown(userData?: any): Observable<any> {
    const dataUrl = 'Report/getCriminalMisDropdown';
    return this.http.post(dataUrl, userData);
  }
  getIdendityMisDropdown(userData?: any): Observable<any> {
    const dataUrl = 'Report/getIdendityMisDropdown';
    return this.http.post(dataUrl, userData);
  }
  getEducationMisDropdown(userData?: any): Observable<any> {
    const dataUrl = 'Report/getEducationMisDropdown';
    return this.http.post(dataUrl, userData);
  }
  getEmploymentMisDropdown(userData?: any): Observable<any> {
    const dataUrl = 'Report/getEmploymentMisDropdown';
    return this.http.post(dataUrl, userData);
  }
  getStatus(){
    const dataUrl ='Report/GetAllStatusGroup';
    return this.http.get<any>(dataUrl);
  }
  getMISClient(lstClientId): Observable<any> {
    const dataUrl = 'Report/GetMISClient';
    return this.http.post<any>(dataUrl, lstClientId);
  }
  //Ended By Megala
  GetQcReportType() {
    const dataUrl = 'Report/GetQcReportType';
    return this.http.get<any>(dataUrl);
  }
  // GetSubmissionPendingList(searchData: any): Observable<any> {
  //   const dataUrl = 'Report/GetSubmissionPendingList';
  //   return this.http.post(dataUrl, searchData);
  // }
  GetSubmissionQCPendingList(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetSubmissionQCPendingList';
    return this.http.post(dataUrl, loginUserDetVm);
  }
  GetOpenAndClosedChecksHistory(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetOpenAndClosedChecksHistory';
    return this.http.post(dataUrl, loginUserDetVm , { observe: 'response' as 'body' });
  }
  GetTechMOpenAndClosedChecksHistory(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetTechMOpenAndClosedChecksHistory';
    return this.http.post(dataUrl, loginUserDetVm , { observe: 'response' as 'body' });
  }
  GetSubmissionHistory(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetSubmissionHistory';
    // return this.http.post(dataUrl, loginUserDetVm);
    return this.http.post(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetClientWiseTracker(clientRefNoWiseSearch): Observable<any> {
    const dataUrl = 'Report/GetClientWiseTracker';
    return this.http.post(dataUrl, clientRefNoWiseSearch);
  }
  GetCEADetails(clientRefNoWiseSearch): Observable<any> {
    const dataUrl = 'Report/GetCEADetails';
    return this.http.post(dataUrl, clientRefNoWiseSearch);
  }
  GetTechMClient(clientRefNoWiseSearch): Observable<any> {
    const dataUrl = 'Report/GetTechMClient';
    return this.http.post(dataUrl, clientRefNoWiseSearch);
  }
  // GetSubmissionFinalQCPendingList(loginUserDetVm): Observable<any> {
  //   const dataUrl = 'Report/GetSubmissionFinalQCPendingList';
  //   return this.http.post(dataUrl, loginUserDetVm);
  // }
  GetClosedCasedNotSendQc(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetClosedCasedNotSendQc';
    return this.http.post(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetQcRejectHistory(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetQcRejectHistory';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetFQcRejectHistory(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetFQcRejectHistory';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetallQcRejectHistory(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetQcRejectHistoryList';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetallQcRejectHistoryMIS(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetallQcRejectHistory';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetMQCErrorReports(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetMQCErrorReports';
    return this.http.post(dataUrl, loginUserDetVm);
  }
  GetCompletedStatus(val: any) {
    const dataUrl = 'Report/GetCompletedStatus';
    return this.http.get<any>(dataUrl);
  }
  GetInsufficiencyRaisedList(dynamicReportForm): Observable<any> {
    const dataUrl = 'Screening/GetInsufficiencyRaisedList';
    return this.http.post<any>(dataUrl, dynamicReportForm, { observe: 'response' as 'body' });
  }
  GetTechMApplicationDetailsReport(applicationId): Observable<any> {
    const dataUrl = 'Report/GetTechMApplicationDetailsReport?applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  getAllLookUpCriminalReport() {
    const dataUrl = 'Report/GetLookUpDataCriminalReport';
    return this.http.get<any>(dataUrl);
  }
  getEmploymentReportDetails(empSerachData): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const dataUrl = 'Report/GetEmploymentReportDetailsByCompID';
    return this.http.post<any>(dataUrl, empSerachData);
  }
  getEmploymentReportList(): Observable<any> {
    const dataUrl = 'Report/GetEmploymentReportList';
    return this.http.get<any>(dataUrl);
  }
  GetInterimFinalReportByReferenceNo(interimFinalSearchVm): Observable<any> {
    const dataUrl = 'Report/GetInterimFinalReportByReferenceNo';
    return this.http.post(dataUrl, interimFinalSearchVm);
  }
  getCommonReportOutputDetails(repInp): Observable<any> {
    const dataUrl = 'Report/GetCommonReportDetails';
    return this.http.post(dataUrl, repInp, { observe: 'response' as 'body' });
  }
  getIqcPendingExcelReport(reportVm): Observable<any> {
    const dataUrl = 'Report/GetIqcPendingExcelReport';
    return this.http.post(dataUrl, reportVm);
  }
  getFqcPendingExcelReport(reportVm): Observable<any> {
    const dataUrl = 'Report/GetFqcPendingExcelReport';
    return this.http.post(dataUrl, reportVm);
  }
  dailyTrackerReportExcel(reportVm): Observable<any> {
    const dataUrl = 'Report/DailyTrackerReportExcel';
    return this.http.post(dataUrl, reportVm);
  }
  getEmailCategory() {
    const dataUrl = 'Report/GetEmailCategory';
    return this.http.get<any>(dataUrl);
  }
  getMailHistoryReport(data: any) {
    const dataUrl = 'Report/GetMailHistoryReport';
    return this.http.post<any>(dataUrl, data, { observe: 'response' as 'body' });
  }
  GetSeventhDayTracker(data: any) {
    const dataUrl = 'Report/GetSeventhDayTracker';
    return this.http.post<any>(dataUrl, data);
  }
  GetFileLevelTrackerList(data: any) {
    const dataUrl = 'Report/GetFileLevelTrackerList';
    return this.http.post<any>(dataUrl, data, { observe: 'response' as 'body' });
  }
  GetFileLevelTrackerDetails(data: any) {
    const dataUrl = 'Report/GetFileLevelTrackerDetails';
    // const dataUrl = 'Report/GetSeventhDayTracker';
    return this.http.post<any>(dataUrl, data);
  }
  getDropDownFileLevelTracker(loginUserDetVm: any) {
    const dataUrl = 'Report/GetDropDownFileLevelTracker';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetSeventhDayTrackerExport(data: any) {
    const dataUrl = 'Report/GetSeventhDayTrackerExport';
    return this.http.post<any>(dataUrl, data);
  }
  getSeventhdayDetails(userData: any): Observable<any> {
    const dataUrl = 'Report/GetSeventhDayTracker';
    return this.http.post<any>(dataUrl, userData);
  }
  GetJCRFileDownload() {
    const dataUrl = 'Report/GetJCRFileDownload';
    return this.http.get<any>(dataUrl);
  }
  GetStatisticsComponentList(statisticsVm): Observable<any> {
    const dataUrl = 'Report/GetStatisticsComponentList';
    return this.http.post<any>(dataUrl, statisticsVm);
  }
  GetComponentsCompletedMonthlylist(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetComponentsCompletedMonthlylist';
    // return this.http.post(dataUrl, loginUserDetVm);
    return this.http.post(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetCummulativeMonthly(clientRefNoWiseSearch): Observable<any> {
    const dataUrl = 'Report/GetCummulativeMonthlyCasesAndChecksCreated';
    return this.http.post(dataUrl, clientRefNoWiseSearch);
  }
  //Added By Megala
  GetMonthlyCompletedCasesComponentReport(loginUserDetVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetMonthlyCompletedCasesComponentReport';
    return this.http.post(dataUrl, loginUserDetVm , { observe: 'response' as 'body' });
  }
  GetTechmSubmissionPendingList(data: any) : Observable<any> {
    const dataUrl = 'Report/GetTechmSubmissionPendingList';
    return this.http.post<any>(dataUrl, data, { observe: 'response' as 'body' });
  }
  GetAllFrRejectDetails(loginUserDetVm): Observable<any> {
    const dataUrl = 'Report/GetAllFrRejectDetails';
    return this.http.post(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  RefreshReportDetails(compId: any): Observable<any> {
    const dataUrl = 'Report/SaveCommonReportDetails?compId='+compId;
    return this.http.post(dataUrl, null)
  }
  SaveCommonIQcReportDetails(compId: any): Observable<any> {
    const dataUrl = 'Report/SaveCommonIQcReportDetails?compId='+compId;
    return this.http.post(dataUrl, null)
  }
  fileLevelTrackerReportDetails(compId: any): Observable<any> {
    const dataUrl = 'Report/SaveCommonScreeningDetails?compId='+compId;
    return this.http.post(dataUrl, null)
  }
  //Added by Megala 19/12/2023
  //Add New Report API Call Automated Tracker
  GetSubmissionPendingTracker(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetSubmissionPendingList';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
   //Added By Megala - for VTS2-2024-DEV-0197
  GetTatReport(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetTatReportDetails';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetSubmissionDEQCPendingTracker(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetSubmissionDEQCPendingList';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetIQcRejectHistoryTracker(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetallQcRejectHistory';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
   //Added By Megala - For  VTS2-2023-Pre-QC-0112
   getPreQCRejectReport(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetDePreQcRejectReportDetails';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetFQcRejectHistoryTracker(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetallQcRejectHistory';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetClosedChecksHistoryTracker(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetClosedChecksHistory';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
  GetColourCodeCamApproval(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetColourCodeCamApproval';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetColorCodeCAMapprovalReportExcel(reportVm):Observable <any>{
    const dataUrl ='Report/GetColorCodeCAMapprovalReportExcel';
    return this.http.post(dataUrl, reportVm);
  }
    // Ended By Megala - For (sprint -22) VTS2-2024-CRT-0195

  GetFileLevelTrackerMIS(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetFileLevelTrackerList';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetFileLevelTrackerDetailsMIS(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetFileLevelTrackerDetails';
    return this.http.post(dataUrl, searchUserDataVm);
  }
  GetPreQCDACaseCompletionMIS(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetPreQCDACaseCompletionMIS';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetIqcApprovedListMIS(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetIqcApprovedList';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  GetAllMISReport(searchUserDataVm): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetAllMISReport';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }
  //added By megala  26/12/2023
  GetMonthlySLAWithColorCodeCompleted(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetMonthlySLAWithColorCodeCompleted';
    return this.http.post(dataUrl, searchUserDataVm);
  }
  GetModifiedDate(): Observable<any> {
    const dataUrl = 'ReportDenormalize/GetModifiedDate';
    return this.http.get(dataUrl);
  }

  GetclientSummaryDetails(searchUserDataVm): Observable<any> {
    const dataUrl = 'Report/GetclientSummaryDetails';
    return this.http.post(dataUrl, searchUserDataVm, { observe: 'response' as 'body' });
  }

  downloadMultipleReport(screeningIds: any[]): Observable<Blob> {
    const dataUrl = 'Report/DownloadMultipleFinalReport';
    return this.http.post<Blob>(dataUrl, screeningIds, { responseType: 'blob' as 'json' });
  }

}
