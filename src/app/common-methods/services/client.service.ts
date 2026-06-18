import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessClient, ClientName } from '../models/clientEntryMaster';
import { MessageService } from 'primeng/api';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient, private messageService: MessageService, private commonService: CommonService) { }

  savePassword(password): Observable<any> {
    const dataUrl = 'ClientEntries/AddPdfPassword';
    return this.http.post<any>(dataUrl, password);
  }
  public getInsufficiency(): Observable<any> {
    const dataUrl = 'Insufficiency/GetInsufficiencyType';
    return this.http.get(dataUrl);
  }
  public getWorkflow(): Observable<any> {
    const dataUrl = 'DropDown/GetWorkFlow';
    return this.http.get(dataUrl);
  }
   // Added By Megala - For VTS2-2025-CRT-0253
  GetEntitySelection():Observable<any>{
    const dataUrl = 'Master/GetEntitySelection';
    return this.http.get(dataUrl);
  }
  getPassword(clientId: any) {
    const dataUrl = 'ClientEntries/GetClientPassword?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  GetInsufficiencyLevelOneWorlFlowMapping(clientId): Observable<any> {
    const dataUrl = 'Insufficiency/GetInsufficiencyLevelOneWorlFlowMapping=' + clientId
    return this.http.get<any>(dataUrl);
  }
  getClientSetting(clientId: any) {
    const dataUrl = 'ClientEntries/GetClientSettingsMaster?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  public getClientDetails(data: AccessClient): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientDetails';
    return this.http.post(dataUrl, data, { observe: 'response' as 'body' });
  }
  public GetClientDetails(clientId, userId): Observable<any> {
    const dataUrl = 'ClientEntries/GetAllEntryDetails?clientId=' + clientId + '&loggedIn=' + userId;
    return this.http.get(dataUrl);
  }
  GetDocByFilePath(filePath: any) {
    const dataUrl = 'ClientEntries/GetDocByFilePath?filePath=' + filePath;
    return this.http.get<any>(dataUrl);
  }
  public DeleteClientDetails(clientId, userId): Observable<any> {
    const dataUrl = 'ClientEntries/DeleteClientDetails?clientId=' + clientId + '&loggedIn=' + userId;
    return this.http.get(dataUrl);
  }
  public getClientMasterDetails(teamId: number, subTeamId: number): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientMasterDetails?teamId=' + teamId + '&subTeamId=' + subTeamId;
    return this.http.get(dataUrl);
  }
  public checkClientName(value, id): Observable<any> {
    const client = new ClientName();
    client.clientId = id;
    client.clientName = value;
    const dataUrl = 'ClientEntries/CheckClientName';
    return this.http.post(dataUrl, client);
  }
  public checkClientRefPrefixNo(refPrefix: string, clientid: number): Observable<any> {
    const dataUrl = 'ClientEntries/CheckClientRefPrefixNo?refPrefix=' + refPrefix + '&clientid=' + clientid;
    return this.http.get(dataUrl);
  }
  public getComponentDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetComponentDetails?indianClientFlag=' + true;
    return this.http.get(dataUrl);
  }
  public getAgreementDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetAgreementDetails';
    return this.http.get(dataUrl);
  }
  public getDocumentDetail(docId: number): Observable<any> {
    const dataUrl = 'ClientEntries/getDocumentDetails?docId=' + docId;
    return this.http.get(dataUrl);
  }
  public getClientInstructionDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientInstructionDetails?indianClientFlag=' + true;
    return this.http.get(dataUrl);
  }
  public GetClientAndSiteLookup(): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientAndSiteLookup';
    return this.http.get(dataUrl);
  }
  public getCurrencyDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetCurrencyDetail';
    return this.http.get(dataUrl);
  }
  public saveClientEntryDetails(saveClientEntry: FormData): Observable<any> {
    const dataUrl = 'ClientEntries/InsertClientEntryDetails';
    return this.http.post(dataUrl, saveClientEntry);
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  downloadFile(data, fileName, docId) {
    if (docId > 0) {
      this.getDocumentDetail(docId).subscribe(resp => {
        if (resp.document) {
          this.commonService.downloadDocument(docId, resp.document, fileName);
        }
      });
    } else {
      this.commonService.saveByteArray(fileName, data.document);
    }
  }
  public getInsuffHistoryDetail(clientId: number): Observable<any> {
    const dataUrl = 'Client/GetComponentEntryHistoryDetails?clientId=' + clientId;
    return this.http.get(dataUrl);
  }
  public GetClientPassWordHistoryDetails(clientId: number, reportTypeId: number): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientPassWordHistoryDetails?ClientId=' + clientId + '&ReportTypeId=' + reportTypeId;
    return this.http.get(dataUrl);
  }
}
