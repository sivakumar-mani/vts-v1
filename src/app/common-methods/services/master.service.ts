import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country, State, District, City } from '../models/country';
import { Status } from '../models/status';
import { Registration } from '../../common-methods/models/registration';
import { GroupCreation } from '../models/group-creation';
import { SiteDetail } from '../models/site';
import { SalesClientMapping } from '../models/salesclientmapping';
import { Package } from '../models/package';
import { ClientCustomFields } from '../models/clientCustField';
import { AccessClient } from 'src/app/common-methods/models/clientEntryMaster';
import { CommonService } from './common.service';
import { CandidateDocumentInput } from '../components/bulk-export-import/bulk-export-import.component';
@Injectable({
  providedIn: 'root'
})
export class MasterService {
  userData: any;
  viewFlag = false;
  searchList:any[] = [];
  vendorapid = 4;
  constructor(private http: HttpClient, private common: CommonService) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);

  }

  // Vendor Master / Vendor Entry
  public getVendorsList(): Observable<any> {
    const dataUrl = 'Master/GetVendorDetails';
    return this.http.get<any>(dataUrl);
  }
  //getclient

  public GetClientbyId(clientid: any): Observable<any> {
    const dataUrl = 'Master/GetClientbyId?ClientId=' + clientid;
    return this.http.get<any>(dataUrl);
  }
  //create vendor
  public getNewVendorsList(): Observable<any> {
    const dataUrl = 'Vendor/GetNewVendorDetails';
    return this.http.get<any>(dataUrl);
  }
  public getNewVendorsListById(vendorCredentialId: number): Observable<any> {
    const dataUrl = 'Vendor/GetNewVendorDetailsByID?vendorCredentialId=' + vendorCredentialId;
    return this.http.get<any>(dataUrl);
  }
  public deleteNewVendorDetails(vendorCredentialId, userId): Observable<any> {
    const dataUrl = 'Vendor/DeleteNewVendor?vendorCredentialId=' + vendorCredentialId + '&loggedId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  public addNewVendor(createVendorVm: any): Observable<any> {
    const dataUrl = 'Vendor/AddNewVendor';
    return this.http.post<any>(dataUrl, createVendorVm);
  }
  public getVendorsContactTypes(): Observable<any> {
    const dataUrl = 'Master/GetVendorContactTypeAddressType';
    return this.http.get<any>(dataUrl);
  }

  public getVendorDetails(companyName: string, stateId: number, countryId: number): Observable<any> {
    const dataUrl = 'Master/GetVendorDetails?companyName=' + companyName + '&stateId=' + stateId + '&countryId=' + countryId;
    return this.http.get<any>(dataUrl);
  }
  public getVendorDetailsById(vendorId: number): Observable<any> {
    const dataUrl = 'Master/GetVendorDetailsByID?vendorId=' + vendorId;
    return this.http.get<any>(dataUrl);
  }

  public addVendor(vendorVm: any, ): Observable<any> {
    const dataUrl = 'Master/AddVendor ';
    return this.http.post<any>(dataUrl, vendorVm);
  }
  public deleteVendorDetails(vendorId:any, userId:any): Observable<any> {
    const dataUrl = 'Master/DeleteVendor?vendorId=' + vendorId + '&loggedId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  public CheckVendorName(vendorName:any, vendorId:any): Observable<any> {
    const dataUrl = 'Master/CheckVendorName?vendorName=' + vendorName + '&vendorId=' + vendorId;
    return this.http.get<any>(dataUrl);
  }
  // Alert Rule
  public getAlertRules(): Observable<any> {
    const dataUrl = 'Master/GetAlertRules';
    return this.http.get<any>(dataUrl);
  }
  public getAlertRuleDetails(): Observable<any> {
    const dataUrl = 'Master/GetAlertRuleDetails';
    return this.http.get<any>(dataUrl);
  }
  public getAlertRulesById(alertRuleId: number): Observable<any> {
    const dataUrl = 'Master/GetAlertRulesById?alertRuleId=' + alertRuleId;
    return this.http.get<any>(dataUrl);
  }
  public AddAlertRules(alertRule): Observable<any> {
    const dataUrl = 'Master/AddAlertRules';
    return this.http.post<any>(dataUrl, alertRule);
  }
  public deleteAlertRules(alertRuleId, createdUserId): Observable<any> {
    const dataUrl = 'Master/DeleteAlertRules?alertRuleId=' + alertRuleId + '&createdUserId=' + createdUserId;
    return this.http.post<any>(dataUrl, alertRuleId, createdUserId);
  }
  // clientCancelRuleDetail
  getCancelRuleLookup(): Observable<any> {
    const dataUrl = 'Master/GetFromToCondition';
    return this.http.get<any>(dataUrl);
  }
  getClientCancelRuleById(id: number): Observable<any> {
    const dataUrl = 'Master/GetClientCancelRuleById/?cancelRuleId=' + id;
    return this.http.get<any>(dataUrl);
  }
  getClientCancelRule(): Observable<any> {
    const dataUrl = 'Master/GetClientCancelRule';
    return this.http.get<any>(dataUrl);
  }
  deleteAgentCancelRuleDetail(CancelRuleId, loggedId): Observable<any> {
    const dataUrl = 'Master/DeleteClientCancelRule/?CancelRuleId=' + CancelRuleId + '&loggedId=' + loggedId;
    return this.http.get<any>(dataUrl);
  }
  saveAgentCancelRuleDetail(agentCancelRuleDetail): Observable<any> {
    const dataUrl = 'Master/AddClientCancelRule';
    return this.http.post<any>(dataUrl, agentCancelRuleDetail);
  }
  // ins Entry
  // getAllInstituteEntryList(): Observable<any> {
  //   const dataUrl = 'Master/GetInstitute';
  //   return this.http.get<any>(dataUrl);
  // }
  deleteInstituteEntryDetail(data): Observable<any> {
    const dataUrl = 'Master/DeleteInstitute';
    return this.http.post<any>(dataUrl, data);
  }
  saveInstituteEntryDetail(ins): Observable<any[]> {
    const dataUrl = 'Master/UpdateInstitute';
    return this.http.post<any[]>(dataUrl, ins);
  }
  // Billing Cycle / Billing Rule (LookUp Names)
  GetContactLookup(): Observable<any> {
    const dataUrl = 'Master/GetContactLookup';
    return this.http.get<any>(dataUrl);
  }
  getBillingCycle(lookupCatId: number): Observable<any> {
    const dataUrl = 'Master/GetLookupCategoryMasterBcList?LookupCatId=' + lookupCatId;
    return this.http.get<any>(dataUrl);
  }
  getBillingRule(lookupCatId: number): Observable<any> {
    const dataUrl = 'Master/GetLookupCategoryMasterBrList?LookupCatId=' + lookupCatId;
    return this.http.get<any>(dataUrl);
  }
  saveLookUpNames(lookups): Observable<any[]> {
    const dataUrl = 'Master/AddLookupMaster';
    return this.http.post<any[]>(dataUrl, lookups);
  }
  updateReOrderedRows(lookups): Observable<any> {
    const dataUrl = 'Master/UpdateLookUp';
    return this.http.post<any[]>(dataUrl, lookups);
  }
  updateBrTblRows(lookups): Observable<any> {
    const dataUrl = 'Master/UpdateLookUp';
    return this.http.post<any[]>(dataUrl, lookups);
  }
  getLookUpMasterById(lookupId: number): Observable<any> {
    const dataUrl = 'Master/GetLookupMasterById?LookupId=' + lookupId;
    return this.http.get<any>(dataUrl);
  }
  deleteLookUpMaster(lookupId: number, loggedIn: number): Observable<any> {
    const dataUrl = 'Master/DeleteBillLookupMaster?lookupId=' + lookupId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  // Country
  getCountry(): Observable<Country[]> {
    return this.http.get<Country[]>('Master/GetCountries');
  }
  getRegion(): Observable<Country[]> {
    return this.http.get<Country[]>('Master/GetRegion');
  }
  GetCountryLst(): Observable<Country[]> {
    return this.http.get<Country[]>('Master/GetCountryLst');
  }
  getCountryById(countryId: number): Observable<any> {

    return this.http.get<number>('Master/GetCountryById?countryId=' + countryId);
  }

  createCountry(country: Country): Observable<any> {

    return this.http.post<Country>('Master/AddCountry', country);
  }

  deleteCountry(countryId: number): Observable<any> {

    return this.http.get<any>('Master/DeleteCountry?countryId=' + countryId);
  }
  // Status
  GetStatusById(screeningStatusId: number): Observable<any> {
    const dataUrl = 'Master/GetStatusDetailById?screeningStatusId=' + screeningStatusId;
    return this.http.get<any>(dataUrl);
  }
  GetStatusCategory(): Observable<any> {
    const dataUrl = 'Master/GetStatus';
    return this.http.get<any>(dataUrl);
  }
  saveStatusDetails(status: Status): Observable<any[]> {
    const dataUrl = 'Master/AddStatus';
    return this.http.post<any>(dataUrl, status);
  }
  getStatus(): Observable<any> {
    const dataUrl = 'Master/GetStatusDetails';
    return this.http.get<any>(dataUrl);
  }
  DeleteStatus(screeningStatusId: any, CreateUserId:any): Observable<any> {
    const dataUrl = 'Master/DeleteStatus/?screeningStatusId=' + screeningStatusId + '&CreateUserId=' + CreateUserId;
    return this.http.get<any>(dataUrl);
  }
  // Call Charges
  getServiceType(): Observable<any> {
    const dataUrl = 'Master/GetServiceType';
    return this.http.get<any>(dataUrl);
  }
  getCallCharges(): Observable<any> {
    const dataUrl = 'Master/GetCallChargeList';
    return this.http.get<any>(dataUrl);
  }
  saveCallCharges(data): Observable<any[]> {
    const dataUrl = 'Master/AddCallCharge';
    return this.http.post<any>(dataUrl, data);
  }
  getCallChargesById(CallChargeId: number): Observable<any> {
    const dataUrl = 'Master/GetCallChargeListById?CallChargeId=' + CallChargeId;
    return this.http.get<any>(dataUrl);
  }
  deletecallCharge(callChargeId, createdUserId): Observable<any> {
    const dataUrl = 'Master/DeleteCallCharge?CallChargeId=' + callChargeId + '&CreatedUserId=' + createdUserId;
    return this.http.post<any>(dataUrl, callChargeId, createdUserId);
    // ('Master/DeleteCountry?countryId=' + countryId + '&cancelledBy=' + cancelledBy);
  }
  //
  public addUpdateProfessionalReference(professionalReference: any): Observable<any> {
    const dataUrl = 'Master/AddUpdateProfessionalReference';
    return this.http.post<any>(dataUrl, professionalReference);
  }
  getCountryStateDetails(): Observable<any> {
    const dataUrl = 'Master/GetCountryStateDetails';
    return this.http.get<any>(dataUrl);
  }
  getProfessionalReferenceDetails(countryId: number): Observable<any> {
    const dataUrl = 'Master/GetProfessionalReferenceDetails?countryId=' + countryId;
    return this.http.get<any>(dataUrl);
  }
  getProfessionalDetailsByProfessionalID(profId: number): Observable<any> {
    const dataUrl = 'Master/GetProfessionalDetailsByProfessionalID?profId=' + profId;
    // console.log(dataUrl, 'dataUrl');
    return this.http.get<any>(dataUrl);
  }
  professionalDetailDelete(profId: number, cancelledBy: string): Observable<any> {
    const dataUrl = 'Master/ProfessionalDetailDelete?profId=' + profId + '&CancelledBy=' + cancelledBy;
    return this.http.get<any>(dataUrl);
  }

  // SiteEntry Details
  public getEmailConfigDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetSiteCategoryDetails';
    return this.http.get<any>(dataUrl);
  }
  public saveSite(sitevm: any): Observable<any> {
    const dataUrl = 'ClientEntries/SaveSiteEntry';
    // console.log(sitevm, 'sitevm');
    return this.http.post<any>(dataUrl, sitevm);
  }
  public getSiteDetails(siteNo: string, siteName: string, agentId: number, hrmailId: string): Observable<any> {
    const dataUrl = 'ClientEntries/GetSiteEntryDetails?siteNo=' + siteNo + '&siteName=' + siteName + '&agentId=' + agentId +
      '&hrmailId' + hrmailId;
    return this.http.get<any>(dataUrl);
  }

  public deleteSiteDetail(siteNo: string, cancelledBy: number): Observable<any> {
    const dataUrl = 'ClientEntries/DeleteSite?siteNo=' + siteNo + '&cancelledBy=' + cancelledBy;
    return this.http.get<any>(dataUrl);
  }

  public GetSiteDetailById(siteId: number): Observable<any> {
    const dataUrl = 'Master/GetSiteDetailById?siteId=' + siteId;
    return this.http.get<any>(dataUrl);
  }
  // Clone/assign object without reference
  CloneObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  // Clone/assign array without reference
  CloneArray(arr: any): any {
    return Object.assign([], arr);
  }
  getContactDetails(): Observable<any> {
    const dataUrl = 'User/GetContactDetails';
    return this.http.get<any>(dataUrl);
  }
  getEmailDestination(): Observable<any> {
    const dataUrl = 'Master/GetEmailDestination';
    return this.http.get<any>(dataUrl);
  }
  getComponentByDeptId(deptId: string): Observable<any[]> {
    const dataUrl = 'User/GetComponentByDeptId?deptId=' + deptId;
    return this.http.get<any>(dataUrl);
  }
  InsertUserCredential(regist: Registration): Observable<any> {
    const dataUrl = 'User/CreateUser';
    return this.http.post<any>(dataUrl, regist);
  }
  // Group Creation Details
  getGroupDetail(): Observable<any> {
    const dataUrl = 'Master/GetGroupDetail';
    return this.http.get<any>(dataUrl);
  }
  getStateByCountryId(countryId: number): Observable<any[]> {
    const dataUrl = 'Master/GetStateByCountryId?countryId=' + countryId;
    return this.http.get<any>(dataUrl);
  }

  // Get group name list
  getAllGroupNames(clientId: number) {
    clientId = clientId ?? 0;
    const dataUrl = 'Master/GetAllGroupNames?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  // Get All Site names
  getSiteNoByAgentId(clientId: number, groupName: string): Observable<any> {
    const dataUrl = 'Master/GetSiteNoByClientId?clientId=' + clientId + '&groupName=' + groupName;
    return this.http.get<any>(dataUrl);
  }
  // Save Group Creation Details
  saveGroupCreation(group: GroupCreation): Observable<any> {
    const dataUrl = 'Master/SaveGroupCreation';
    return this.http.post<any>(dataUrl, group);
  }
  // Get Group Creation Details
  getGroupCreationDetails(clientId: number): Observable<any[]> {
      clientId = clientId ?? 0;
    const dataUrl = 'Master/GetGroupCreationDetails?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  GetEmpInsProfDetails(pageType: number, empFlag: boolean, depId: number): Observable<any[]> {
    const dataUrl = 'Master/GetEmpInsProfDetails?pageType=' + pageType + '&&empFlag=' + empFlag + '&depId=' + depId;
    return this.http.get<any>(dataUrl);
  }
  GetPackageByClientId(clientId: any, teamname: string): Observable<any> {
    const dataUrl = 'Master/GetPackageDetailsByClientId?clientId=' + clientId + '&&teamname=' + teamname;
    return this.http.get<any>(dataUrl);
  }
  getClientUser(applicationId: number): Observable<any> {
    const dataUrl = 'User/GetClientUser?applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  saveDesignation(designation: string, desc: string, userid: number): Observable<any> {
    const dataUrl = 'User/SaveDesignation?designation=' + designation + '&description=' + desc + '&userId=' + userid;
    return this.http.get<any>(dataUrl);
  }
  getDesignation(): Observable<any[]> {
    const dataUrl = 'User/GetDesignation';
    return this.http.get<any>(dataUrl);
  }
  editUserDetails(userid: number): Observable<any> {
    const dataUrl = 'User/GetUserDetailsById?userId=' + userid;
    return this.http.get<any>(dataUrl);
  }
  getInstitutionddl(): Observable<any> {
    const dataUrl = 'Master/GetInstitutionddl';
    return this.http.get<any>(dataUrl);
  }
  public AddUpdateInsEmpProfMasterDet(commonMasDetailVm: any): Observable<any> {
    const dataUrl = 'Master/AddUpdateInsEmpProfMasterDet';
    return this.http.post<any>(dataUrl, commonMasDetailVm);
  }
  public deleteEmployerInstitute(employerInstution: any): Observable<any> {
    const dataUrl = 'Master/DeleteEmployerInstitute';
    return this.http.post<any>(dataUrl, employerInstution);
  }
  GetClient(): Observable<any> {
    const dataUrl = 'Master/GetClient';
    return this.http.get<any>(dataUrl);
  }
  GetPackClient(GetPackClientVM: any): Observable<any> {
    const dataUrl = 'Master/GetPackClientName';
    return this.http.post<any>(dataUrl, GetPackClientVM);
  }

  checkvalidUserName(userName: string): Observable<any> {
    const dataUrl = 'User/CheckValidUserName?userName=' + userName;
    return this.http.get<any>(dataUrl);
  }

  checkValidEmailId(userId: number, emailId: string): Observable<any> {
    const dataUrl = 'User/CheckValidEmailId?userId=' + userId + '&emailId=' + emailId;
    return this.http.get<any>(dataUrl);
  }
  GetSiteDetails(): Observable<any> {
    const dataUrl = 'Master/GetSiteDetails';
    return this.http.get<any>(dataUrl);
  }
  GetSiteList(data: AccessClient): Observable<any> {
    const dataUrl = 'Master/GetSiteList';
    return this.http.post<any>(dataUrl, data);
  }
  public AddSite(sitedetail: FormData): Observable<any> {
    const dataUrl = 'Master/AddSite';
    return this.http.post<any>(dataUrl, sitedetail);
  }
  public CheckClientSiteNo(site): Observable<any> {
    const dataUrl = 'Master/CheckClientSiteNo';
    return this.http.post(dataUrl, site);
  }
  GetCountryList(): Observable<any> {
    const dataUrl = 'Master/GetCountryList';
    return this.http.get<any>(dataUrl);
  }
  GetStatesList(countryId: number): Observable<State[]> {
    const dataUrl = 'Master/GetStatesList?countryId=' + countryId;
    return this.http.get<State[]>(dataUrl);
  }
  GetCityList(districtId: number): Observable<City[]> {
    const dataUrl = 'Master/GetCityList?districtId=' + districtId;
    return this.http.get<City[]>(dataUrl);
  }
  getPlaceList(cityId: number, postalCode: string): Observable<any[]> {
    const dataUrl = 'Master/GetLocationList?cityId=' + cityId + '&postalCode=' + postalCode;
    return this.http.get<City[]>(dataUrl);
  }
  // Add by Vignesh
  GetDistrictListMaster(stateId: number): Observable<District[]> {
    const dataUrl = 'Master/GetDistrictListMaster?stateId=' + stateId;
    return this.http.get<District[]>(dataUrl);
  }
  GetStatesListMaster(countryId: number): Observable<State[]> {
    const dataUrl = 'Master/GetStatesListMaster?countryId=' + countryId;
    return this.http.get<State[]>(dataUrl);
  }
  GetCityListMaster(districtId: number): Observable<City[]> {
    const dataUrl = 'Master/GetCityListMaster?districtId=' + districtId;
    return this.http.get<City[]>(dataUrl);
  }
  getPlaceListMaster(cityId: number): Observable<any[]> {
    const dataUrl = 'Master/GetLocationListMaster?cityId=' + cityId;
    return this.http.get<City[]>(dataUrl);
  }
  // updateDistrict(districtVm): Observable<any> {
  //   const dataUrl = 'Master/UpdateDistrict';
  //   return this.http.post<any>(dataUrl, districtVm);
  // }
  // updateCity(cityVm): Observable<any> {
  //   const dataUrl = 'Master/UpdateCity';
  //   return this.http.post<any>(dataUrl, cityVm);
  // }
  // UpdateLocation(locationVm): Observable<any> {
  //   const dataUrl = 'Master/UpdateLocation';
  //   return this.http.post<any>(dataUrl, locationVm);
  // }
  // getCity(): Observable<any> {
  //   const dataUrl = 'Master/GetCity';
  //   return this.http.get<any>(dataUrl);
  // }
  // getCityById(cityId): Observable<any> {
  //   const dataUrl = 'Master/GetCityById?cityId=' + cityId;
  //   return this.http.get<any>(dataUrl);
  // }
  // public deleteCity(cityId, userId): Observable<any> {
  //   const dataUrl = 'Master/DeleteCity?cityId=' + cityId + '&loggedIn=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }
  // getPlace(): Observable<any> {
  //   const dataUrl = 'Master/GetPlace';
  //   return this.http.get<any>(dataUrl);
  // }
  // getPlaceById(placeId): Observable<any> {
  //   const dataUrl = 'Master/GetPlaceById?placeId=' + placeId;
  //   return this.http.get<any>(dataUrl);
  // }
  // public deletePlace(placeId, userId): Observable<any> {
  //   const dataUrl = 'Master/DeletePlace?placeId=' + placeId + '&loggedIn=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }
  // getDistrict(): Observable<any> {
  //   const dataUrl = 'Master/GetDistrict';
  //   return this.http.get<any>(dataUrl);
  // }
  // getDistrictById(districtId): Observable<any> {
  //   const dataUrl = 'Master/GetDistrictById?districtId=' + districtId;
  //   return this.http.get<any>(dataUrl);
  // }
  // public deleteDistrict(districtId, userId): Observable<any> {
  //   const dataUrl = 'Master/DeleteDistrict?districtId=' + districtId + '&loggedIn=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }
  // getState(): Observable<any> {
  //   const dataUrl = 'Master/GetState';
  //   return this.http.get<any>(dataUrl);
  // }
  // getStateById(stateId): Observable<any> {
  //   const dataUrl = 'Master/GetStateById?stateId=' + stateId;
  //   return this.http.get<any>(dataUrl);
  // }
  // getCountryDtById(countryId): Observable<any> {
  //   const dataUrl = 'Master/GetCountryDtById?countryId=' + countryId;
  //   return this.http.get<any>(dataUrl);
  // }
  // updateState(stateVm): Observable<any> {
  //   const dataUrl = 'Master/UpdateState';
  //   return this.http.post<any>(dataUrl, stateVm);
  // }
  // public deleteState(stateId, userId): Observable<any> {
  //   const dataUrl = 'Master/DeleteState?stateId=' + stateId + '&loggedIn=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }
  // // end by Vignesh
  // getAddressDetailByZipCode(zipCode: string): Observable<any> {
  //   const dataUrl = 'Master/GetCountryListByZip?zipCode=' + zipCode;
  //   return this.http.get<any>(dataUrl);
  // }
  // GetDistrictList(stateId: number): Observable<District[]> {
  //   const dataUrl = 'Master/GetDistrictList?stateId=' + stateId;
  //   return this.http.get<District[]>(dataUrl);
  // }
  // public deleteSite(siteId: number, createdUserId: number): Observable<any> {
  //   const dataUrl = 'Master/DeleteSite?siteId=' + siteId + '&createdUserId=' + createdUserId;
  //   return this.http.get<any>(dataUrl);
  // }
  // public DeletePackage(packageId: number, ClientId: number, createdUserId: number): Observable<any> {
  //   const dataUrl = 'Master/DeletePackage?packageId=' + packageId + '&ClientId=' + ClientId + '&createdUserId=' + createdUserId;
  //   return this.http.get<any>(dataUrl);
  // }

  // /* #region SalesClientMappingComponent */
  // public getSalesPersonDetails(): Observable<any> {
  //   const dataUrl = 'Master/GetSalesPersonDetails';
  //   return this.http.get<any>(dataUrl);
  // }

  // public checkSalesPersonById(userId: number): Observable<State[]> {
  //   const dataUrl = 'Master/CheckSalesPersonById?personId=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }

  // public getSalesClient(): Observable<any> {
  //   const dataUrl = 'Master/GetSalesClient';
  //   return this.http.get<any>(dataUrl);
  // }

  // public addSalesClientMapping(salesClientMapping: SalesClientMapping[]): Observable<any> {
  //   const dataUrl = 'Master/AddSalesClientMapping';
  //   return this.http.post<any>(dataUrl, salesClientMapping);
  // }

  // public getSalesClientMappingDetailsById(personId: number): Observable<any> {
  //   const dataUrl = 'Master/GetSalesClientMappingDetailsById?personId=' + personId;
  //   return this.http.get<any>(dataUrl);
  // }

  // public getSalesClientMappingDetails(): Observable<any> {
  //   const dataUrl = 'Master/GetSalesClientMappingDetails';
  //   return this.http.get<any>(dataUrl);
  // }

  // public deleteSalesClientMapping(personId: number, loggedId: number): Observable<any> {
  //   const dataUrl = 'Master/DeleteSalesClientMapping?personId=' + personId + '&loggedId=' + loggedId;
  //   return this.http.post<any>(dataUrl, null);
  // }

  // /* #endregion */
  // public DeletePackageHistory(PackageHisId: number, CreatedUserId: number): Observable<any> {
  //   const dataUrl = 'Master/DeletePackageHistory?PackageHisId=' + PackageHisId + '&CreatedUserId=' + CreatedUserId;
  //   return this.http.get<any>(dataUrl);
  // }
  // // EMAIL QUEUE
  // getEmailQueueList(): Observable<any> {
  //   const dataUrl = 'Master/GetEmailQueue';
  //   return this.http.get<any>(dataUrl);
  // }
  // saveEmailQueue(data): Observable<any> {
  //   const dataUrl = 'Master/AddEmailQueue';
  //   return this.http.post<any>(dataUrl, data);
  // }
  // getEmailQueueById(emailQueueId): Observable<any> {
  //   const dataUrl = 'Master/GetEmailQueueById?emailQueueId=' + emailQueueId;
  //   return this.http.get<any>(dataUrl);
  // }
  // deleteEmailQueue(emailQueueId, loggedIn): Observable<any> {
  //   const dataUrl = 'Master/DeleteEmailQueue?emailQueueId=' + emailQueueId + '&loggedIn=' + loggedIn;
  //   return this.http.get<any>(dataUrl);
  // }
  // // GetDepartment
  // public getDepartment(): Observable<any> {
  //   const dataUrl = 'Master/GetDepartment';
  //   return this.http.get(dataUrl);
  // }
  // public AddPackageName(packagedetail): Observable<any> {
  //   const dataUrl = 'Master/AddPackageName';
  //   return this.http.post<any>(dataUrl, packagedetail);
  // }
  // GetPackageDetailById(PackageId): Observable<any> {
  //   const dataUrl = 'Master/GetPackageDetailById?PackageId=' + PackageId;
  //   return this.http.get<any>(dataUrl);
  // }
  // getScreenPermission(applicationId: number): Observable<any> {
  //   const dataUrl = 'User/GetScreenPermission?applicationId=' + applicationId;
  //   return this.http.get<any>(dataUrl);
  // }

  updateDistrict(districtVm: any): Observable<any> {
  return this.http.post<any>('Master/UpdateDistrict', districtVm);
}

updateCity(cityVm: any): Observable<any> {
  return this.http.post<any>('Master/UpdateCity', cityVm);
}

UpdateLocation(locationVm: any): Observable<any> {
  return this.http.post<any>('Master/UpdateLocation', locationVm);
}

getCity(): Observable<any> {
  return this.http.get<any>('Master/GetCity');
}

getCityById(cityId: number): Observable<any> {
  return this.http.get<any>(`Master/GetCityById?cityId=${cityId}`);
}

deleteCity(cityId: number, userId: number): Observable<any> {
  return this.http.get<any>(`Master/DeleteCity?cityId=${cityId}&loggedIn=${userId}`);
}

getPlace(): Observable<any> {
  return this.http.get<any>('Master/GetPlace');
}

getPlaceById(placeId: number): Observable<any> {
  return this.http.get<any>(`Master/GetPlaceById?placeId=${placeId}`);
}

deletePlace(placeId: number, userId: number): Observable<any> {
  return this.http.get<any>(`Master/DeletePlace?placeId=${placeId}&loggedIn=${userId}`);
}

getDistrict(): Observable<any> {
  return this.http.get<any>('Master/GetDistrict');
}

getDistrictById(districtId: number): Observable<any> {
  return this.http.get<any>(`Master/GetDistrictById?districtId=${districtId}`);
}

deleteDistrict(districtId: number, userId: number): Observable<any> {
  return this.http.get<any>(`Master/DeleteDistrict?districtId=${districtId}&loggedIn=${userId}`);
}

getState(): Observable<any> {
  return this.http.get<any>('Master/GetState');
}

getStateById(stateId: number): Observable<any> {
  return this.http.get<any>(`Master/GetStateById?stateId=${stateId}`);
}

getCountryDtById(countryId: number): Observable<any> {
  return this.http.get<any>(`Master/GetCountryDtById?countryId=${countryId}`);
}

updateState(stateVm: any): Observable<any> {
  return this.http.post<any>('Master/UpdateState', stateVm);
}

deleteState(stateId: number, userId: number): Observable<any> {
  return this.http.get<any>(`Master/DeleteState?stateId=${stateId}&loggedIn=${userId}`);
}

getAddressDetailByZipCode(zipCode: string): Observable<any> {
  return this.http.get<any>(`Master/GetCountryListByZip?zipCode=${zipCode}`);
}

GetDistrictList(stateId: number): Observable<District[]> {
  return this.http.get<District[]>(`Master/GetDistrictList?stateId=${stateId}`);
}

deleteSite(siteId: number, createdUserId: number): Observable<any> {
  return this.http.get<any>(`Master/DeleteSite?siteId=${siteId}&createdUserId=${createdUserId}`);
}

DeletePackage(packageId: number, ClientId: number, createdUserId: number): Observable<any> {
  return this.http.get<any>(`Master/DeletePackage?packageId=${packageId}&ClientId=${ClientId}&createdUserId=${createdUserId}`);
}

// Sales Client Mapping

getSalesPersonDetails(): Observable<any> {
  return this.http.get<any>('Master/GetSalesPersonDetails');
}

checkSalesPersonById(userId: number): Observable<any> {
  return this.http.get<any>(`Master/CheckSalesPersonById?personId=${userId}`);
}

getSalesClient(): Observable<any> {
  return this.http.get<any>('Master/GetSalesClient');
}

addSalesClientMapping(salesClientMapping: any[]): Observable<any> {
  return this.http.post<any>('Master/AddSalesClientMapping', salesClientMapping);
}

getSalesClientMappingDetailsById(personId: number): Observable<any> {
  return this.http.get<any>(`Master/GetSalesClientMappingDetailsById?personId=${personId}`);
}

getSalesClientMappingDetails(): Observable<any> {
  return this.http.get<any>('Master/GetSalesClientMappingDetails');
}

deleteSalesClientMapping(personId: number, loggedId: number): Observable<any> {
  return this.http.post<any>(`Master/DeleteSalesClientMapping?personId=${personId}&loggedId=${loggedId}`, null);
}

DeletePackageHistory(PackageHisId: number, CreatedUserId: number): Observable<any> {
  return this.http.get<any>(`Master/DeletePackageHistory?PackageHisId=${PackageHisId}&CreatedUserId=${CreatedUserId}`);
}

// Email Queue

getEmailQueueList(): Observable<any> {
  return this.http.get<any>('Master/GetEmailQueue');
}

saveEmailQueue(data: any): Observable<any> {
  return this.http.post<any>('Master/AddEmailQueue', data);
}

getEmailQueueById(emailQueueId: number): Observable<any> {
  return this.http.get<any>(`Master/GetEmailQueueById?emailQueueId=${emailQueueId}`);
}

deleteEmailQueue(emailQueueId: number, loggedIn: number): Observable<any> {
  return this.http.get<any>(`Master/DeleteEmailQueue?emailQueueId=${emailQueueId}&loggedIn=${loggedIn}`);
}

// Department & Package

getDepartment(): Observable<any> {
  return this.http.get<any>('Master/GetDepartment');
}

AddPackageName(packagedetail: any): Observable<any> {
  return this.http.post<any>('Master/AddPackageName', packagedetail);
}

GetPackageDetailById(PackageId: number): Observable<any> {
  return this.http.get<any>(`Master/GetPackageDetailById?PackageId=${PackageId}`);
}

getScreenPermission(applicationId: number): Observable<any> {
  return this.http.get<any>(`User/GetScreenPermission?applicationId=${applicationId}`);
}

  // SCREENING QUESTIONS
  getScreeningQuestion(): Observable<any> {
    const dataUrl = 'Master/GetScreeningQuestion';
    return this.http.get(dataUrl);
  }
  getScreeningQuestionById(clientId, compId, questionClientMapId): Observable<any> {
    const dataUrl = 'Master/GetScreeningQuestionById?clientId=' + clientId + '&compId=' + compId
      + '&questionClientMapId=' + questionClientMapId;
    return this.http.get<any>(dataUrl);
  }
  getScreeningQuestionList(lstClientId): Observable<any> {
    const dataUrl = 'Master/GetScreeningQuestionList';
    return this.http.post<any>(dataUrl, lstClientId);
  }

  getScreeningQuesServiceType(): Observable<any> {
    const dataUrl = 'Master/GetScreeningQuesServiceType';
    return this.http.get(dataUrl);
  }
  addScreeningQuestion(screeningQuestions): Observable<any> {
    const dataUrl = 'Master/AddScreeningQuestion';
    return this.http.post<any>(dataUrl, screeningQuestions);
  }
  updateScreeningQuestion(screeningQuestions): Observable<any> {
    const dataUrl = 'Master/UpdateScreeningQuestion';
    return this.http.post<any>(dataUrl, screeningQuestions);
  }
  deleteScreeningQuestion(screeningQuestionDeleteVm): Observable<any> {
    const dataUrl = 'Master/DeleteScreeningQuestion';
    return this.http.post<any>(dataUrl, screeningQuestionDeleteVm);
  }
  GetSiteNoByClientId(clientId: string): Observable<any> {
    const dataUrl = 'User/GetSiteNoByClientId?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  getGroupCreationDetailById(client: number, groupId: number): Observable<any> {
    const dataUrl = 'Master/GetGroupCreationDetailById?clientId=' + client + '&groupId=' + groupId;
    return this.http.get<any>(dataUrl);
  }
  removeGroupDetailById(client: number, groupId: number, logginId): Observable<any> {
    const dataUrl = 'Master/DeleteGroupById?clientId=' + client + '&groupId=' + groupId + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  getUserTypeDept(): Observable<any> {
    const dataUrl = 'User/GetUserTypeDept';
    return this.http.get<any>(dataUrl);
  }

  saveRolePermission(SaveRolePermissionData): Observable<any> {
    const dataUrl = 'User/SaveRolePermission';
    return this.http.post<any>(dataUrl, SaveRolePermissionData);
  }
  //Added By Megala 28/03/2024
  CheckUserHaveMultipleDept(DeactiveUserInput): Observable<any> {
    const dataUrl = 'User/CheckUserHaveMultipleDept';
    return this.http.post<any>(dataUrl, DeactiveUserInput);
  }
  GetAssignedChecksByUser(teamId,subTeamId,userId,deptId): Observable<any> {
    const dataUrl = 'User/GetAssignedChecksByUser?teamId=' + teamId + '&subTeamId=' + subTeamId + '&userId=' + userId+ '&deptId=' + deptId;
    return this.http.get<any>(dataUrl);
  }
  GetDepartmentUser(teamId,subTeamId,userId): Observable<any> {
    const dataUrl = 'User/GetDepartmentUser?teamId=' + teamId + '&subTeamId=' + subTeamId + '&userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  GetUserDeptTeamDetails(deptId, userId): Observable<any> {
    const dataUrl = 'User/GetUserDeptTeamDetails?deptId=' + deptId + '&userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  ReassignChecks(reassignedChecksVm): Observable<any> {
    const dataUrl = 'User/ReassignChecks';
    return this.http.post<any>(dataUrl,reassignedChecksVm);
  }
  
  //Ended By Megala
  GetRole(applicationId: number) {
    const dataUrl = 'User/GetRole?applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  GetRolePermissionByRoleId(roleId: number, applicationId: number) {
    const dataUrl = 'User/GetRolePermissionByRoleId?roleId=' + roleId + '&applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }

  getUserTypeByApplicationId(applicationId: number): Observable<any[]> {
    const dataUrl = 'User/getUserTypeByApplicationId?applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }

  checkValidRole(roleName: string): Observable<any> {
    const dataUrl = 'User/CheckValidRole?roleName=' + roleName;
    return this.http.get<any>(dataUrl);
  }
  // Department Component
  getAllComponents() {
    const dataUrl = 'Master/GetComponent';
    return this.http.get<any>(dataUrl);
  }
  getAllClientComponents() {
    const dataUrl = 'Master/GetClientComponent';
    return this.http.get<any>(dataUrl);
  }
  saveDeptComponent(deptComp): Observable<any> {
    const dataUrl = 'Master/AddDepartComp';
    return this.http.post<any>(dataUrl, deptComp);
  }
  getComponentDepartment(deptId: number) {
    const dataUrl = 'Master/GetDeptComp?deptId=' + deptId;
    return this.http.get<any>(dataUrl);
  }
  getScreenPermissionDetail(): Observable<any[]> {
    const dataUrl = 'User/GetScreenPermissionDetail';
    return this.http.get<any>(dataUrl);
  }
  // Email Config
  // getEmailConfigLookupDet() {
  //   const dataUrl = 'Master/getEmailConfigLookupDet';
  //   return this.http.get<any>(dataUrl);
  // }
  saveEmailConfig(emailConfig): Observable<any> {
    const dataUrl = 'Master/AddEmailConfig';
    return this.http.post<any>(dataUrl, emailConfig);
  }
  getEmailConfigLookupDet(emailConfig: boolean): Observable<any> {
    const dataUrl = 'Master/GetEmailLookup?emailConfig=' + emailConfig;
    return this.http.get<any>(dataUrl);
  }
  getEmailTemplates(): Observable<any> {
    const dataUrl = 'Master/GetEmailTemplate';
    return this.http.get<any>(dataUrl);
  }
  getEmailTemplateById(emailTempId: number): Observable<any> {
    const dataUrl = 'Master/GetEmailTemplateById?emailTempId=' + emailTempId;
    return this.http.get<any>(dataUrl);
  }

  public getEmailConfig(): Observable<any[]> {
    const dataUrl = 'Master/GetEmailConfigDetails';
    return this.http.get<any[]>(dataUrl);
  }

  getEmailConfigDet() {
    const dataUrl = 'Master/GetEmailConfigDet';
    return this.http.get<any>(dataUrl);
  }
  saveEmailConfigTemplate(emailConfig): Observable<any> {
    const dataUrl = 'Master/AddEmailTemplate';
    return this.http.post<any>(dataUrl, emailConfig);
  }
  checkTemplateValidation(emailCatLookupId: number, emailGroupLookupId: number, clientId: string, templateName: string): Observable<any> {
    const dataUrl = 'Master/GetTemplateValidation?emailCatLookupId=' + emailCatLookupId + '&emailGroupLookupId=' +
      emailGroupLookupId + '&clientId=' + clientId + '&templateName=' + templateName;
    return this.http.get(dataUrl);
  }
  deleteEmailTemplate(emailTempId, CreatedUserId) {
    const dataUrl = 'Master/DeleteEmailTemplate?emailTempId=' + emailTempId + '&CreatedUserId=' + CreatedUserId;
    return this.http.get(dataUrl);
  }
  // GetSubComponentList
  public GetSubComponentList(): Observable<any> {
    const dataUrl = 'Master/GetSubComponentList';
    return this.http.get(dataUrl);
  }
  updateSubComponentTblRows(reOrderRows): Observable<any> {
    const dataUrl = 'Master/UpdateSubComponentOrder';
    return this.http.post<any[]>(dataUrl, reOrderRows);
  }
  // AddSubComponents
  public AddSubComponents(data: any): Observable<any> {
    const dataUrl = 'Master/AddSubComponents';
    return this.http.post<any>(dataUrl, data);
  }

  // GetSubComponentsById
  public GetSubComponentsById(id: number): Observable<any> {
    const dataUrl = 'Master/GetSubComponentsById?subCompId=' + id;
    return this.http.get(dataUrl);
  }

  // GetComponentdrop
  GetComponentList(): Observable<any> {
    const dataUrl = 'Master/GetComponents';
    return this.http.get(dataUrl);
  }

  // GetDepartmentNotify
  public GetDepartmentNotify(deptId = 0): Observable<any> {
    const dataUrl = 'Master/GetDepartmentNotify?deptId=' + deptId;
    return this.http.get(dataUrl);
  }

  // AddDepartmentNotify
  AddDepartmentNotify(Component: any): Observable<any> {
    const dataUrl = 'Master/AddDepartmentNotify';
    return this.http.post(dataUrl, Component);
  }

  // CheckDepartmentName
  CheckDepartmentName(departmentName: string): Observable<any> {
    const dataUrl = 'Master/CheckDepartmentName?deptName=' + departmentName;
    return this.http.get(dataUrl);
  }

  // DeleteDepartmentNotify
  public DeleteDepartmentNotify(deptId: number, LogginId: number): Observable<any> {
    const dataUrl = 'Master/DeleteDepartmentNotify?deptId=' + deptId + '&LogginId=' + this.userData.userId;
    return this.http.get(dataUrl);
  }

  // GetDepartmentEmailTypes
  public GetDepartmentEmailTypes(): Observable<any> {
    const dataUrl = 'Master/GetDepartmentEmailTypes';
    return this.http.get(dataUrl);
  }

  // GetValidationSubComp
  public GetValidationSubComp(componentId: number, subCompId: number, subCompName: string): Observable<any> {
    const dataUrl = 'Master/GetValidationSubComp?componentId=' + componentId + '&subCompId=' + subCompId + '&subCompName=' + subCompName;
    return this.http.get(dataUrl);
  }

  // GetAuditTrans
  public GetAuditTrans(auditTransSearch: any): Observable<any> {
    const dataUrl = 'Master/GetAuditTrans';
    return this.http.post(dataUrl, auditTransSearch);
  }
  // added by vignesh
  public getAuditDetailsList(): Observable<any> {
    const dataUrl = 'Master/GetAuditDetailsList';
    return this.http.get<any>(dataUrl);
  }
  // GetAuditDetails
  public GetAuditDetails(applicationId: number): Observable<any> {
    const dataUrl = 'Master/GetAuditDetails?applicationId=' + applicationId;
    return this.http.get(dataUrl);
  }

  // FAKE EMPLOYER / INSTITUTION ENTRY
  // public getApprovedList(flag): Observable<any> {
  //   const dataUrl = 'Master/GetEmpInsName?empFlag=' + flag;
  //   return this.http.get(dataUrl);
  // }
  public GetEmpName(depId): Observable<any> {
    const dataUrl = 'Master/GetEmpName?depId=' + depId;
    return this.http.get<any>(dataUrl);
  }
  public GetInsName(depId): Observable<any> {
    const dataUrl = 'Master/GetInsName?depId=' + depId;
    return this.http.get<any>(dataUrl);
  }
  getProfessionalReferenceApprovedList(): Observable<any> {
    const dataUrl = 'Master/GetProfessionalReferenceList';
    return this.http.get(dataUrl);
  }
  getLicenseAuthorityNameList(): Observable<any> {
    const dataUrl = 'Master/GetLicenseAuthorityNameList';
    return this.http.get(dataUrl);
  }
  // public getGenuineList(genuineFlag): Observable<any> {
  //   const dataUrl = 'Master/GetInstitutionApprovedList?empFlag=' + genuineFlag;
  //   return this.http.get(dataUrl);
  // }
  public getFakeEmpInsCatType(): Observable<any> {
    const dataUrl = 'Master/GetFakeEmpInsCatType';
    return this.http.get(dataUrl);
  }
  public getFakeEmpInsDetails(empflag: boolean): Observable<any> {
    const dataUrl = 'Master/GetFakeEmpInsDetails?empflag=' + empflag;
    return this.http.get(dataUrl);
  }
  public GetFakeEmpDetailById(empInsId: number): Observable<any> {
    const dataUrl = 'Master/GetFakeEmpDetailById?empInsId=' + empInsId;
    return this.http.get(dataUrl);
  }
  public GetFakeInsDetailById(empInsId: number): Observable<any> {
    const dataUrl = 'Master/GetFakeInsDetailById?empInsId=' + empInsId;
    return this.http.get(dataUrl);
  }
  public saveFakeEmpIns(data: any): Observable<any> {
    const dataUrl = 'Master/AddFakeEmpIns';
    return this.http.post(dataUrl, data);
  }
  DeleteFakeInsById(fakeEmpInsId: number, logginId: number, removedReason: string): Observable<any> {
    const dataUrl = 'Master/DeleteFakeInsById?fakeEmpInsId=' + fakeEmpInsId +
      '&logginId=' + logginId + '&removedReason=' + removedReason;
    return this.http.get(dataUrl);
  }
  DeleteFakeEmpById(fakeEmpInsId: number, logginId: number, removedReason: string): Observable<any> {
    const dataUrl = 'Master/DeleteFakeEmpById?fakeEmpInsId=' + fakeEmpInsId +
      '&logginId=' + logginId + '&removedReason=' + removedReason;
    return this.http.get(dataUrl);
  }
  public getInstitution(): Observable<any> {
    const dataUrl = 'Master/GetInstitution';
    return this.http.get(dataUrl);
  }
  public getInstitute(): Observable<any[]> {
    const dataUrl = 'Master/GetInstitute';
    return this.http.get<any[]>(dataUrl);
  }

  public saveInstitute(saveInstitute: any): Observable<any> {
    const dataUrl = 'Master/AddInstitute';
    return this.http.post(dataUrl, saveInstitute);
  }

  public getInstituteById(instituteId: number): Observable<any> {
    const dataUrl = 'Master/GetInstituteById?instituteId=' + instituteId;
    return this.http.get(dataUrl);
  }
  public deleteInstitute(instituteId: number, loggedIn: number): Observable<any> {
    const dataUrl = 'Master/DeleteInstitute?instituteId=' + instituteId + '&loggedIn=' + loggedIn;
    return this.http.get(dataUrl);
  }
  saveInstitutionFees(institutefee): Observable<any> {
    const dataUrl = 'Master/AddInstitutionFees';
    return this.http.post<any>(dataUrl, institutefee);
  }
  public getInstitutionFees(): Observable<any[]> {
    const dataUrl = 'Master/GetInstitutionFees';
    return this.http.get<any[]>(dataUrl);
  }
  public getInstitutionFeesById(feesId: number): Observable<any> {
    const dataUrl = 'Master/GetInstitutionFeesByFeesId?FeesId=' + feesId;
    return this.http.get(dataUrl);
  }
  public deleteInstitutionFees(feesId: number, loggedIn: number): Observable<any> {
    const dataUrl = 'Master/DeleteInstitutionFees?FeesId=' + feesId + '&loggedIn=' + this.userData.userId;
    return this.http.get(dataUrl);
  }

  // BULK UPLOAD EMP / INS
  GetImportTemplete(empFlag: boolean, genFlag: boolean, instituteFlag: boolean, empHrContactFlag: boolean): Observable<any> {
    const dataUrl = 'Master/GetImportTemplete?empFlag=' + empFlag + '&genFlag=' + genFlag + '&instituteFlag=' + instituteFlag+ '&empHrContactFlag=' + empHrContactFlag;
    return this.http.get(dataUrl);
  }
  InstituteImport(data: FormData): Observable<any> {
    const dataUrl = 'Master/InstituteImport';
    return this.http.post(dataUrl, data);
  }
  saveFakeEmpInsImport(data: FormData): Observable<any> {
    const dataUrl = 'Master/FakeEmpInsImport';
    return this.http.post(dataUrl, data);
  }
  employerHrContactImport(obj: FormData): Observable<any> {
    const dataUrl = 'Master/EmployerHrContactImport';
    return this.http.post(dataUrl, obj);
  }
  saveDrugDetails(drug: FormData): Observable<any> {
    const dataUrl = 'Master/AddUpdateDrugName';
    return this.http.post(dataUrl, drug);
  }
  getDrugDetailList(): Observable<any[]> {
    const dataUrl = 'Master/GetDrugList';
    return this.http.get<any[]>(dataUrl);
  }
  editDrugDetail(drugId: number): Observable<any> {
    const dataUrl = 'Master/GetDrugDetails?drugId=' + drugId;
    return this.http.get(dataUrl);
  }
  deleteDrugDetail(drugId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteDrug?drugId=' + drugId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  checkDuplicateDrugName(drugName, drugId): Observable<any> {
    const dataUrl = 'Master/CheckDuplicateDrugName?drugName=' + drugName + '&drugId=' + drugId;
    return this.http.get<any>(dataUrl);
  }
  public GetDrugKitList(): Observable<any[]> {
    const dataUrl = 'Master/GetDrugKitList';
    return this.http.get<any[]>(dataUrl);
  }
  AddUpdateDrugKitName(DrugKit): Observable<any> {
    const dataUrl = 'Master/AddUpdateDrugKitName';
    return this.http.post(dataUrl, DrugKit);
  }
  public GetDrugKitDetails(drugKitId: number): Observable<any> {
    const dataUrl = 'Master/GetDrugKitDetails?drugKitId=' + drugKitId;
    return this.http.get(dataUrl);
  }
  public DeleteDrugKit(drugKitId: number, loggedIn: number): Observable<any> {
    const dataUrl = 'Master/DeleteDrugKit?drugKitId=' + drugKitId + '&loggedIn=' + this.userData.userId;
    return this.http.get(dataUrl);
  }
  public CheckDuplicateKitName(kitName: number, kitId: number): Observable<any> {
    const dataUrl = 'Master/CheckDuplicateKitName?kitName=' + kitName + '&kitId=' + kitId;
    return this.http.get(dataUrl);
  }
  saveDrugPanel(drugPanel: FormData): Observable<any> {
    const dataUrl = 'Master/AddUpdateDrugPanel';
    return this.http.post(dataUrl, drugPanel);
  }
  getDrugPanelList(): Observable<any[]> {
    const dataUrl = 'Master/GetDrugPanelList';
    return this.http.get<any[]>(dataUrl);
  }
  getDrugPanelDetails(): Observable<any> {
    const dataUrl = 'Master/GetDrugPanelDetails';
    return this.http.get<any>(dataUrl);
  }
  editDrugPanel(drugPanelMappingId: number): Observable<any> {
    const dataUrl = 'Master/GetDrugPanelInfo?drugPanelMappingId=' + drugPanelMappingId;
    return this.http.get(dataUrl);
  }
  deleteDrugPanel(drugId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteDrugPanelMapping?drugPanelMappingId=' + drugId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  panelAvailCheck(drugId): Observable<any> {
    const dataUrl = 'Master/CheckDrugPanelAvailability?drugId=' + drugId;
    return this.http.get<any>(dataUrl);
  }
  getEmployerInstitutionModeOfInitiation(): Observable<any> {
    const dataUrl = 'Master/GetEmployerInstitutionModeOfInitiation';
    return this.http.get<any>(dataUrl);
  }
  getEmployerInstitutionInstitutionType(): Observable<any> {
    const dataUrl = 'Master/GetEmployerInstitutionInstitutionType';
    return this.http.get<any>(dataUrl);
  }
  getProfessionalDetailsById(pageType: number, id: number, empFlag: boolean, addressId: number): Observable<any> {
    const dataUrl = 'Master/GetProfessionalDetailsById?pageType=' + pageType + '&&id=' + id + '&&empFlag=' + empFlag + '&&addressId=' + addressId;
    return this.http.get<any>(dataUrl);
  }
  public deleteEmailConfig(emailConfigId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteEmailConfigById?emailConfigId=' + emailConfigId + '&loggedIn=' + userId;
    return this.http.post<any>(dataUrl, null);
  }

  deleteInsEmpProfMasterDetById(pageType: number, id: number, loggedIn: number, empFlag: boolean, addressId: number) {
    const dataUrl = 'Master/deleteInsEmpProfMasterDetById?pageType=' + pageType + '&&id=' + id + '&&addressId=' + addressId +
      '&&loggedIn=' + loggedIn + '&&empFlag=' + empFlag;
    return this.http.get<any>(dataUrl);
  }
  getReportTypeByCatId(lookupName: any) {
    const dataUrl = 'Master/GetSiteReportTypes?lookupName=' + lookupName;
    return this.http.get<any>(dataUrl);
  }
  getFrequencyMas() {
    const dataUrl = 'Master/getFrequencyMas';
    return this.http.get<any>(dataUrl);
  }
  GetEmailConfigById(emailConfigId: number): Observable<any> {
    const dataUrl = 'Master/GetEmailConfigById?emailConfigId=' + emailConfigId;
    return this.http.get<any>(dataUrl);
  }
  getMasterScreenList(): Observable<any[]> {
    const dataUrl = 'Master/GetMasterApproval';
    return this.http.get<any>(dataUrl);
  }
  getMasterDataListForApproval(screenId): Observable<any> {
    const dataUrl = 'Master/GetMasterScreenForApproval?screenId=' + screenId;
    return this.http.get<any>(dataUrl);
  }
  approveRejectData(approveScreen: any): Observable<any> {
    const dataUrl = 'Master/AddMasterApproval';
    return this.http.post(dataUrl, approveScreen);
  }
  getApprovedVendorName(): Observable<any[]> {
    const dataUrl = 'Master/GetApprovedVendorName';
    return this.http.get<any>(dataUrl);
  }
  public getVendorOwners(): Observable<any> {
    const dataUrl = 'Master/GetVendorOwners';
    return this.http.get<any>(dataUrl);
  }
  getVendorSoundex(input): Observable<any[]> {
    const dataUrl = 'Master/GetVendorNameBySoundex?input=' + input;
    return this.http.get<any>(dataUrl);
  }
  getInstitutionNameAndEmployerBySoundex(input, flag, depId): Observable<any[]> {
    const dataUrl = 'Master/GetInstitutionNameAndEmployerBySoundex?input=' + input + '&flag=' + flag + 'depId=' + depId;
    return this.http.get<any>(dataUrl);
  }
  GetFakeInstitutionAndEmployerNameBySoundex(input, flag): Observable<any[]> {
    const dataUrl = 'Master/GetFakeInstitutionAndEmployerNameBySoundex?input=' + input + '&flag=' + flag;
    return this.http.get<any>(dataUrl);
  }
  getProfessionalRefBySoundex(input, flag): Observable<any[]> {
    const dataUrl = 'Master/GetEmpProfessionalReferenceBySoundex?input=' + input + '&flag=' + flag;
    return this.http.get<any>(dataUrl);
  }
  getLicenseAuthorityBySoundex(input): Observable<any[]> {
    const dataUrl = 'Master/GetLicenseAuthorityBySoundex?input=' + input;
    return this.http.get<any>(dataUrl);
  }
  getInstituteNameBySoundex(input): Observable<any[]> {
    const dataUrl = 'Master/GetInstituteNameBySoundex?input=' + input;
    return this.http.get<any>(dataUrl);
  }
  getResearchStatus(empFlag): Observable<any> {
    const dataUrl = 'Research/GetResearchStatus?empFlag=' + empFlag;
    return this.http.get<any>(dataUrl);
  }
  getResearchEmpInsDet(empFlag: boolean, isAssigned: boolean, researchStatusId: number, loginUserDet, activepath, employerFilter): Observable<any> {
    var dataUrl;
    switch (activepath) {
      case "forresearch": {
        dataUrl = 'Research/GetEmpInsForResearchPending';
        break;
      }
      case "clientsuspect": {
        dataUrl = 'Research/GetEmpInsForResearchClientSuspect';
        break;
      }
      case "underreview": {
        dataUrl = 'Research/GetEmpInsForResearchUnderReview';
        break;
      }
      case "approvalpending": {
        dataUrl = 'Research/GetEmpInsForResearchApprovalPending';
        break;
      }
      case "rejected": {
        dataUrl = 'Research/GetEmpInsForResearchReject';
        break;
      }
      case "verified": {
        dataUrl = 'Research/GetEmpInsForResearchVerified';
        break;
      }
      case "reverify": {
        dataUrl = 'Research/GetSixMonthEmployerDetails';
        break;
      }
    }
    const researchSearchVm = { empFlag, isAssigned, researchStatusId, loginUserDet, employerFilter};
    // return this.http.post(dataUrl, researchSearchVm);
    return this.http.post<any>(dataUrl, researchSearchVm, { observe: 'response' as 'body' });
  }
  getResearchQuestAnswer(empFlag: boolean, screeingCompidBy, empInsId: number, businessCategoryLookUpId: number, empInsAddressId: number): Observable<any> {
    const dataUrl = 'Research/GetResearchQuestAnswer?empFlag=' + empFlag + '&&empInsId=' + empInsId + '&&screeningCompId=' + screeingCompidBy + '&&empInsAddressId=' + empInsAddressId + '&&businessCategoryLookUpId=' + businessCategoryLookUpId;
    return this.http.get<any>(dataUrl);
  }
  GetBusinessCategoryLookUp(): Observable<any> {
    const dataUrl = 'Research/GetBusinessCategoryLookUp';
    return this.http.get<any>(dataUrl);
  }
  GetOneYearEmployerDetails(LoginUseDetvm: any): Observable<any> {
    const dataUrl = 'Research/GetOneYearEmployerDetails';
    return this.http.post<any>(dataUrl, LoginUseDetvm);
    // return this.http.get<any>(dataUrl);
  }
  MoveToForResearch(moveToForResearchVm): Observable<any> {
    const dataUrl = 'Research/MoveToForResearch';
    return this.http.post(dataUrl, moveToForResearchVm);
  }

  AddMoveToFRandVE(data: any): Observable<any> {
    const dataUrl = 'Research/ReverifyMoveToFRandVE';
    return this.http.post(dataUrl, data);
  }
  getResearchLookUp(): Observable<any> {
    const dataUrl = 'Research/GetResearchLookUp';
    return this.http.get<any>(dataUrl);
  }
  GetEmployerScreeningCompId(empId, teamName, clientId): Observable<any> {
    const dataUrl = 'Research/GetEmployerScreeningCompId?empId=' + empId + '&&teamName=' + teamName + '&&clientId=' + clientId;
    return this.http.get(dataUrl);
  }
  AddUpdateResearch(data: FormData): Observable<any> {
    const dataUrl = 'Research/AddUpdateResearch';
    return this.http.post(dataUrl, data);
  }

  loadFrFlowList(empFlag: boolean, empInsId: number, empInsAddressId: number, teamName: string, clientId: number, userId: number, frSatusName: string): Observable<any> {
    const dataUrl = 'Research/GetResearchCases?empFlag=' + empFlag + '&&empInsId=' + empInsId + '&&empInsAddressId=' + empInsAddressId + '&&teamName=' + teamName + '&&clientId=' + clientId + '&&userId=' + userId + '&&frSatusName=' + frSatusName;
    return this.http.get(dataUrl);
  }

  GetUserName(deptId: any) {
    const dataUrl = 'Master/GetUserName?deptId=' + deptId;
    return this.http.get<any>(dataUrl);
  }
  getClientTeamRole(): Observable<any> {
    const dataUrl = 'Master/GetClientRole';
    return this.http.get<any>(dataUrl);
  }
  getTeamDetail(): Observable<any> {
    const dataUrl = 'Master/GetTeamDetail';
    return this.http.get<any>(dataUrl);
  }
  getUsersByDeptID(departmentId: number): Observable<any> {
    const dataUrl = 'Master/DeptBasedDetails?deptId=' + departmentId;
    return this.http.get<any>(dataUrl);
  }
  GetTeamName(): Observable<any> {
    const dataUrl = 'Master/GetTeamName';
    return this.http.get<any>(dataUrl);
  }
  GetDepartment(): Observable<any> {
    const dataUrl = 'Master/GetDepartment';
    return this.http.get<any>(dataUrl);
  }
  //ApproveRejectEmployerInstitutionMas(approveRejectEmpInsMasVm): Observable<any> {
  ApproveRejectEmployerInstitutionMas(data: FormData): Observable<any> {
    const dataUrl = 'Research/ApproveRejectEmployerInstitutionMas';
    return this.http.post(dataUrl, data);
    //return this.http.post(dataUrl, approveRejectEmpInsMasVm);
  }
  SaveTeam(saveDeptTeamVm): Observable<any> {
    const dataUrl = 'Master/SaveTeam';
    return this.http.post(dataUrl, saveDeptTeamVm);
  }
  SaveSubTeamDetails(saveDeptTeamVm): Observable<any> {
    const dataUrl = 'Master/SaveSubTeam';
    return this.http.post(dataUrl, saveDeptTeamVm);
  }
  saveClientTeam(saveClientTeamVm): Observable<any> {
    const dataUrl = 'Master/SaveClientTeam';
    return this.http.post(dataUrl, saveClientTeamVm);
  }
  SaveSubTeam(saveSubTeamVm): Observable<any> {
    const dataUrl = 'Master/SaveSubTeam';
    return this.http.post(dataUrl, saveSubTeamVm);
  }
  EditTeam(teamId: any) {
    const dataUrl = 'Master/EditTeam?teamId=' + teamId;
    return this.http.get<any>(dataUrl);
  }
  getTeam(teamId: number): Observable<any> {
    const dataUrl = 'Master/GetTeam?teamId=' + teamId;
    return this.http.get<any>(dataUrl);
  }
  getClientTeam(): Observable<any> {
    const dataUrl = 'Master/GetClientTeam';
    return this.http.get<any>(dataUrl);
  }
  getSubTeam(subTeamId: number): Observable<any> {
    const dataUrl = 'Master/GetSubTeam?subTeamId=' + subTeamId;
    return this.http.get<any>(dataUrl);
  }
  DeleteTeam(teamId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteTeam?teamId=' + teamId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  deleteClientTeam(teamId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteClientTeam?teamId=' + teamId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  deleteSubTeam(subTeamId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteSubTeam?subTeamId=' + subTeamId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  getPackageSubComponent(clientId, compId): Observable<any> {
    const dataUrl = 'Master/getPackageSubComponent?clientId=' + clientId + '&compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  // getInstituteApprovedList(): Observable<any[]> {
  //   const dataUrl = 'Master/GetInstitute';
  //   return this.http.get<any>(dataUrl);
  // }
  // client custom-info fields
  getClientcustominfo(): Observable<any[]> {
    const dataUrl = 'Master/GetClientCustomInfo';
    return this.http.get<any>(dataUrl);
  }
  GetClientCustomComponent(clientId): Observable<any[]> {
    const dataUrl = 'Master/GetClientCustomComponent?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  CheckDuplicateClientCustomField(customFieldVm: any) {
    const dataUrl = 'Master/CheckDuplicateClientCustomField';
    return this.http.post<any>(dataUrl, customFieldVm);
  }
  addClientCustomfields(customFieldVm: any) {
    const dataUrl = 'Master/AddUpdateClientCustomFields';
    return this.http.post<any>(dataUrl, customFieldVm);
  }
  getClientcustomlist(): Observable<any[]> {
    const dataUrl = 'Master/GetClientCustomFieldDetails';
    return this.http.get<any>(dataUrl);
  }
  getFieldList(clientCustomFieldId): Observable<any[]> {
    const dataUrl = 'Master/GetClientCustomFieldInfo?clientCustomFieldId=' + clientCustomFieldId;
    return this.http.get<any>(dataUrl);
  }
  deleteCustomField(clientCustomFieldId, loggedIn): Observable<any[]> {
    const dataUrl = 'Master/DeleteClientCustomField?clientCustomFieldId=' + clientCustomFieldId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  // Captcha Validation
  getCaptcha(): Observable<any[]> {
    //const dataUrl = 'Auth/GetCaptcha';
    const dataUrl = 'Captch/GetCaptcha';
    return this.http.get<any>(dataUrl);
  }
  // get Email Templates
  sendEmail(obj): Observable<any> {
    const dataUrl = '/sendMail';
    return this.http.post<any>(dataUrl, obj);
  }
  // Added By Salman on 17-DEC-2019
  // Organization Info
  getAllOrganizationInfo(): Observable<any[]> {
    const dataUrl = 'Master/GetAllOrgnz';
    return this.http.get<any>(dataUrl);
  }
  getOrgnzLokupData() {
    const dataUrl = 'Master/GetOrgLookUp';
    return this.http.get<any>(dataUrl);
  }

  editOrgInfo(orgzId: number): Observable<any> {
    const dataUrl = 'Master/GetOrgnzByID?OrgID=' + orgzId;
    return this.http.get(dataUrl);
  }
  saveOrgDetails(Orgnz: FormData): Observable<any> {
    const dataUrl = 'Master/AddOrgnzDetl';
    return this.http.post(dataUrl, Orgnz);
  }
  public deleteOrgnzDetails(OrgID, userId): Observable<any> {
    const dataUrl = 'Master/DeleteOrg?OrgID=' + OrgID + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }

  getAllCourseInfo(): Observable<any[]> {
    const dataUrl = 'Master/GetAllDegree';
    return this.http.get<any>(dataUrl);
  }
  // editCourse(dgrId: number): Observable<any> {
  //   const dataUrl = 'Master/GetDegreeByID?degreeId=' + dgrId;
  //   return this.http.get(dataUrl);
  // }
  saveCourseDetails(degree): Observable<any> {
    const dataUrl = 'Master/AddDegreeDetl';
    return this.http.post(dataUrl, degree);
  }
  public deleteCourse(dgrId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteDegree?degreeId=' + dgrId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  getAllDegreeLookup(): Observable<any[]> {
    const dataUrl = 'Master/GetAllDegreeLkp';
    return this.http.get<any>(dataUrl);
  }
  // added by vignesh
  getRecordCheckList(): Observable<any> {
    const dataUrl = 'Master/GetRecordCheck';
    return this.http.get<any>(dataUrl);
  }
  saveRecordCheck(RecordCheck): Observable<any> {
    const dataUrl = 'Master/AddRecordCheck';
    return this.http.post(dataUrl, RecordCheck);
  }
  // editRecordCheck(RecordCheckCategoryId: number): Observable<any> {
  //   const dataUrl = 'Master/GetRecordCheckById?RecordCheckCategoryId=' + RecordCheckCategoryId;
  //   return this.http.get<any>(dataUrl);
  // }
  public deleteRecordCheckCategory(recordCheckCategryId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteRecordCheckCategory?recordCheckCategryId=' + recordCheckCategryId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }

  // Added by Salman For Record Check Master Screen
  getAllRecordCheck() {
    const dataUrl = 'Master/GetAllRecordCheck';
    return this.http.get<any>(dataUrl);
  }
  saveRecordCheckDetails(recChK): Observable<any> {
    const dataUrl = 'Master/AddRecordCheckDetl';
    return this.http.post(dataUrl, recChK);
  }
  public deleteRecordCheck(recChkId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteRecordCheck?recordId=' + recChkId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }

  // Added by Salman For Record Check Mapping Screen
  getAllRecordCheckMapping() {
    const dataUrl = 'Master/GetAllRecordCheckMapping';
    return this.http.get<any>(dataUrl);
  }
  saveRecordCheckMappingDetails(recChK): Observable<any> {
    const dataUrl = 'Master/AddRecordCheckMappingDetl';
    return this.http.post(dataUrl, recChK);
  }
  public deleteRecordCheckMapping(recChkId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteRecordCheckMapping?recordMapId=' + recChkId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  getAllLookUpRecordCheckMapping() {
    const dataUrl = 'Master/GetLookUpDataRecordCheckMapping';
    return this.http.get<any>(dataUrl);
  }
  // Added by vignesh
  getImportAddressTagging(verflag: boolean): Observable<any> {
    const dataUrl = 'Master/GetImportAddressTagging?verflag=' + verflag;
    return this.http.get(dataUrl);
  }
  getEmployerHrContacts(employerName,empInsAddressId): Observable<any> 
  {
    const dataUrl = 'Master/GetByEmployerName?employerName=' + employerName + '&empAddressId=' + empInsAddressId;
    return this.http.get<any>(dataUrl);
  }
  getEmployerHrContactHistory(hrContactId): Observable<any> 
  {
    const dataUrl = 'Master/GetEmployerHrContactsHistory?hrContactId=' + hrContactId;
    return this.http.get<any>(dataUrl);
  }
  getAllEmployerHrContacts(): Observable<any> 
  {
    const dataUrl = 'Master/GetAllEmployerHrContacts';
    return this.http.get<any>(dataUrl);
  }
  addEmployerHrContacts(employerHRContact): Observable<any> 
  {
    const dataUrl = 'Master/EmployerHRContact';
    return this.http.post<any>(dataUrl, employerHRContact);
  }
  getImportEmployerHrContact(empHrContactFlag: boolean): Observable<any> {
    const dataUrl = 'Master/GetImportEmployerHrContact?empHrContactFlag=' + empHrContactFlag;
    return this.http.get(dataUrl);
  }
  saveAddressTagging(data: FormData): Observable<any> {
    const dataUrl = 'Master/AddressTaggingImport';
    return this.http.post(dataUrl, data);
  }
  checkPackageName(data): Observable<any> {
    const dataUrl = 'Master/CheckPackageName';
    return this.http.post(dataUrl, data);
  }
  // public saveAddiFeeType(feeTypeVm: any): Observable<any> {
  //   const dataUrl = 'Master/SaveAddiFeeType';
  //   return this.http.post<any>(dataUrl, feeTypeVm);
  // }
  // deleteAddiFeeType(feetypeId: number): Observable<any> {
  //   const dataUrl = 'Master/DeleteAddiFeeType?feetypeId=' + feetypeId;
  //   return this.http.get(dataUrl);
  // }
  // editAddiFeeType(feetypeId: number): Observable<any> {
  //   const dataUrl = 'Master/EditAddiFeeType?feetypeId=' + feetypeId;
  //   return this.http.get(dataUrl);
  // }
  getInsuffDocumentList(): Observable<any> {
    const dataUrl = 'Master/GetInsuffDocument';
    return this.http.get<any>(dataUrl);
  }
  getInsuffDocumentById(compId, insuffDocId): Observable<any> {
    const dataUrl = 'Master/GetInsuffDocumentById?compId=' + compId + '&insuffDocId=' + insuffDocId;
    return this.http.get<any>(dataUrl);
  }
  saveInsuffDocument(InsufficiencyDocument): Observable<any> {
    const dataUrl = 'Master/AddInsuffDocument';
    return this.http.post(dataUrl, InsufficiencyDocument);
  }
  public deleteInsuffDoc(insuffDocDeleteVm): Observable<any> {
    const dataUrl = 'Master/DeleteInsuffDoc';
    return this.http.post<any>(dataUrl, insuffDocDeleteVm);
  }
  getHolidays(): Observable<any> {
    const dataUrl = 'Master/GetHolidays';
    return this.http.get<any>(dataUrl);
  }
  savehoilday(holidayVm): Observable<any> {
    const dataUrl = 'Master/AddHoliday';
    return this.http.post(dataUrl, holidayVm);
  }
  getHolidayById(holidayId): Observable<any> {
    const dataUrl = 'Master/GetHolidayById?holidayId=' + holidayId;
    return this.http.get<any>(dataUrl);
  }
  public deleteHoliday(holidayId, userId): Observable<any> {
    const dataUrl = 'Master/DeleteHoliday?holidayId=' + holidayId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  // lookups
  GetAllLookupCategory(): Observable<any> {
    const dataUrl = 'Master/GetAllLookupCategory';
    return this.http.get<any>(dataUrl);
  }
  DeleteLookupById(lookupId, lookupCatId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteLookupById?lookupId=' + lookupId + '&lookupCatId=' + lookupCatId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  DeleteLookupCategoryById(lookupCatId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteLookupCategoryById?lookupCatId=' + lookupCatId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  GetLookupById(lookupId): Observable<any> {
    const dataUrl = 'Master/GetLookupById?lookupId=' + lookupId;
    return this.http.get<any>(dataUrl);
  }
  GetLookupCategoryById(lookupCatId): Observable<any> {
    const dataUrl = 'Master/GetLookupCategoryById?lookupCatId=' + lookupCatId;
    return this.http.get<any>(dataUrl);
  }
  AddUpdateLookupCategory(LookUpValueVm): Observable<any> {
    const dataUrl = 'Master/AddUpdateLookupCategory';
    return this.http.post(dataUrl, LookUpValueVm);
  }
  AddUpdateLookupValue(addLookupValue): Observable<any> {
    const dataUrl = 'Master/AddUpdateLookupValue';
    return this.http.post(dataUrl, addLookupValue);
  }
  GetAllLookupValue(catId): Observable<any> {
    const dataUrl = 'Master/GetAllLookupValue?catId=' + catId;
    return this.http.get<any>(dataUrl);
  }
  //Recruiter
  GetRecruiterById(recruiterId): Observable<any> {
    const dataUrl = 'Master/GetRecruiterById?recruiterId=' + recruiterId;
    return this.http.get<any>(dataUrl);
  }
  DeleteRecruiter(RecruiterId, CreatedUserId): Observable<any> {
    const dataUrl = 'Master/GetRecruiterById?RecruiterId=' + RecruiterId + '&CreatedUserId=' + CreatedUserId
    return this.http.get<any>(dataUrl);
  }
  AddRecruiter(recruitervm): Observable<any> {
    const dataUrl = 'Master/AddRecruiter';
    return this.http.post(dataUrl, recruitervm);
  }
  // Module
  GetAllModule(): Observable<any> {
    const dataUrl = 'Master/GetAllModule';
    return this.http.get<any>(dataUrl);
  }
  GetModuleById(moduleId): Observable<any> {
    const dataUrl = 'Master/GetModuleById?moduleId=' + moduleId;
    return this.http.get<any>(dataUrl);
  }
  AddUpdateModule(moduleVm): Observable<any> {
    const dataUrl = 'Master/AddUpdateModule';
    return this.http.post(dataUrl, moduleVm);
  }
  DeleteModuleById(moduleId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteModuleById?moduleId=' + moduleId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  // SubModule
  GetAllSubmodule(subModuleId): Observable<any> {
    const dataUrl = 'Master/GetAllSubmodule?subModuleId=' + subModuleId;
    return this.http.get<any>(dataUrl);
  }
  // GetSubModuleById(subModuleId): Observable<any> {
  //   const dataUrl = 'Master/GetSubModuleById?subModuleId=' + subModuleId;
  //   return this.http.get<any>(dataUrl);
  // }
  AddUpdateSubModule(addSubModuleVm): Observable<any> {
    const dataUrl = 'Master/AddUpdateSubModule';
    return this.http.post(dataUrl, addSubModuleVm);
  }
  DeleteSubModuleById(subModuleId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteSubModuleById?subModuleId=' + subModuleId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  // Screens
  GetAllScreen(): Observable<any> {
    const dataUrl = 'Master/GetAllScreen';
    return this.http.get<any>(dataUrl);
  }
  GetScreenById(screenId): Observable<any> {
    const dataUrl = 'Master/GetScreenById?screenId=' + screenId;
    return this.http.get<any>(dataUrl);
  }
  AddUpdateScreen(screenVm): Observable<any> {
    const dataUrl = 'Master/AddUpdateScreen';
    return this.http.post(dataUrl, screenVm);
  }
  DeleteScreenById(screenId, loggedIn): Observable<any> {
    const dataUrl = 'Master/DeleteScreenById?screenId=' + screenId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  // research emp & ins
  GetResearchEmpIns(questionId: any) {
    const dataUrl = 'Research/GetEmployeeResearchQuestion?questionId=' + questionId;
    return this.http.get<any>(dataUrl);
  }
  GetResearchEmpInsList() {
    const dataUrl = 'Research/GetEmployeeResearchQuestion';
    return this.http.get<any>(dataUrl);
  }
  AddtResearchBusinessCatQues(businesscatquesVm): Observable<any> {
    const dataUrl = 'Research/AddtResearchBusinessCatQuestion';
    return this.http.post<any>(dataUrl, businesscatquesVm);
  }
  GetResearchBusinessCatQuestion(businessQuestionTransId): Observable<any> {
    const dataUrl = 'Research/GetResearchBusinessCatQuestion?businessQuestionTransId=' + businessQuestionTransId;
    return this.http.get<any>(dataUrl);
  }
  DeleteResearchBusinessCatQuestion(logginId, businessQuestionTransId) {
    const dataUrl = 'Research/DeleteResearchBusinessCatQuestion?logginId=' + logginId + '&businessQuestionTransId=' +
      businessQuestionTransId;
    return this.http.get<any>(dataUrl);
  }
  GetAllResearchBusinessCatQuestion() {
    const dataUrl = 'Research/GetAllResearchBusinessCatQuestion';
    return this.http.get<any>(dataUrl);
  }
  addEmployeeResearchQuestion(researchEmpQues): Observable<any> {
    const dataUrl = 'Research/AddEmployeeResearchQuestion';
    return this.http.post(dataUrl, researchEmpQues);
  }
  GetInstitutionResearchQuestion(questionId: any) {
    const dataUrl = 'Research/GetInstitutionResearchQuestion?questionId=' + questionId;
    return this.http.get<any>(dataUrl);
  }
  addInstitutionResearchQuestion(researchEmpQues): Observable<any> {
    const dataUrl = 'Research/AddInstitutionResearchQuestion';
    return this.http.post(dataUrl, researchEmpQues);
  }
  GetEmployeeResearchQuestionAnswer(questionId: any) {
    const dataUrl = 'Research/GetEmployeeResearchQuestionAnswer?questionId=' + questionId;
    return this.http.get<any>(dataUrl);
  }
  addEmployeeResearchAnswer(researchEmpQues): Observable<any> {
    const dataUrl = 'Research/AddEmployeeResearchQuestionAnswer';
    return this.http.post(dataUrl, researchEmpQues);
  }
  GetInstitutionResearchQuestionAnswer(questionId: any) {
    const dataUrl = 'Research/GetInstitutionResearchQuestionAnswer?questionId=' + questionId;
    return this.http.get<any>(dataUrl);
  }
  AddInstitutionResearchQuestionAnswer(researchEmpQues): Observable<any> {
    const dataUrl = 'Research/AddInstitutionResearchQuestionAnswer';
    return this.http.post(dataUrl, researchEmpQues);
  }
  DeleteEmployeeResearchAnswer(answerId, logginId) {
    const dataUrl = 'Research/DeleteEmployeeResearchAnswer?answerId=' + answerId + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  DeleteInstitutionResearchAnswer(answerId, logginId) {
    const dataUrl = 'Research/DeleteInstitutionResearchAnswer?answerId=' + answerId + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  DeleteEmployeeResearchQuestion(questionId, logginId) {
    const dataUrl = 'Research/DeleteEmployeeResearchQuestion?questionId=' + questionId + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  DeleteInstitutionResearchQuestion(questionId, logginId) {
    const dataUrl = 'Research/DeleteInstitutionResearchQuestion?questionId=' + questionId + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  GetOptions() {
    const dataUrl = 'Research/GetOptions';
    return this.http.get<any>(dataUrl);
  }
  GetResearchSubDetailLookUp() {
    const dataUrl = 'Research/GetResearchSubDetailLookUp';
    return this.http.get<any>(dataUrl);
  }
   // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
  GetClosureAdviceApprovalDetail(loginUserDetailVm: any) {
    const dataUrl ='Case/ClosureAdviceApprovalDetail';
    return this.http.post(dataUrl,loginUserDetailVm);
  }
  GetEmployeeResearchQuestionAnswerSubDetail(questionId: any) {
    const dataUrl = 'Research/GetEmployeeResearchQuestionAnswerSubDetail?questionId=' + questionId;
    return this.http.get<any>(dataUrl);
  }
  GetInstitutionResearchQuestionAnswerSubDetail(questionId: any) {
    const dataUrl = 'Research/GetInstitutionResearchQuestionAnswerSubDetail?questionId=' + questionId;
    return this.http.get<any>(dataUrl);
  }
  AddEmployeeResearchQuestionAnswerSubDetail(researchEmpQues): Observable<any> {
    const dataUrl = 'Research/AddEmployeeResearchQuestionAnswerSubDetail';
    return this.http.post(dataUrl, researchEmpQues);
  }
  AddInstitutionResearchQuestionAnswerSubDetail(researchEmpQues): Observable<any> {
    const dataUrl = 'Research/AddInstitutionResearchQuestionAnswerSubDetail';
    return this.http.post(dataUrl, researchEmpQues);
  }
  UpdateEmployeeResearchQuestionDisplayOrder(lstEmpqa): Observable<any> {
    const dataUrl = 'Research/UpdateEmployeeResearchQuestionDisplayOrder';
    return this.http.post(dataUrl, lstEmpqa);
  }
  UpdateInstitutionResearchQuestionDisplayOrder(lstEmpqa): Observable<any> {
    const dataUrl = 'Research/UpdateInstitutionResearchQuestionDisplayOrder';
    return this.http.post(dataUrl, lstEmpqa);
  }
  UpdateEmployeeResearchQuestionAnswerDisplayOrder(lstEmpqa): Observable<any> {
    const dataUrl = 'Research/UpdateEmployeeResearchQuestionAnswerDisplayOrder';
    return this.http.post(dataUrl, lstEmpqa);
  }
  UpdateInstitutionResearchQuestionAnswerDisplayOrder(lstEmpqa): Observable<any> {
    const dataUrl = 'Research/UpdateInstitutionResearchQuestionAnswerDisplayOrder';
    return this.http.post(dataUrl, lstEmpqa);
  }
  GetInstitutionAndEmpApprovedList(Flag, depId): Observable<any> {
    const dataUrl = 'Master/GetInstitutionAndEmpApprovedList?Flag=' + Flag + '&depId=' + depId;
    return this.http.get(dataUrl);
  }
  GetProfessionalReferenceApprovedList(): Observable<any> {
    const dataUrl = 'Master/GetProfessionalReferenceApprovedList';
    return this.http.get(dataUrl);
  }
  GetLicenseAuthorityList(): Observable<any> {
    const dataUrl = 'Master/GetLicenseAuthorityList';
    return this.http.get(dataUrl);
  }
  AddAddressDetails(getCityVm): Observable<any> {
    const dataUrl = 'Master/AddAddressDetails';
    return this.http.post(dataUrl, getCityVm);
  }
  // DOJ bulk upload
  GetImportCandidatePendingList(): Observable<any> {
    const dataUrl = 'Master/GetImportCandidatePendingList';
    return this.http.get(dataUrl);
  }
  CandidatePendingListImport(obj): Observable<any> {
    const dataUrl = 'Master/CandidatePendingListImport';
    return this.http.post(dataUrl, obj);
  }
  GetDOJLapsedCandidatePendingList(): Observable<any> {
    const dataUrl = 'Master/GetDOJLapsedCandidatePendingList';
    return this.http.get(dataUrl);
  }
  ScopeByPassCaseCreationImport(obj: FormData): Observable<any> {
    const dataUrl = 'Master/ScopeByPassCaseCreationImport';
    return this.http.post(dataUrl, obj);
  }
  IqcByPassCaseCreationImport(obj: FormData): Observable<any> {
    const dataUrl = 'Master/IqcByPassCaseCreationImport';
    return this.http.post(dataUrl, obj);
  }
  ScopeByPassCaseCreationImportBulkNew(obj: FormData): Observable<any> {
    const dataUrl = 'Master/ScopeByPassCaseCreationImportBulkNew';
    return this.http.post(dataUrl, obj);
  }
  IqcByPassCaseCreationImportBulkNew(obj: FormData): Observable<any> {
    const dataUrl = 'Master/IqcByPassCaseCreationImportBulkNew';
    return this.http.post(dataUrl, obj);
  }
  ForResearchTeamAssignOwnerList(empFlag, teamname, subteamname, depid): Observable<any> {
    const dataUrl = 'Research/ForResearchTeamAssignOwnerList?empFlag=' + empFlag + '&teamname=' + teamname + '&subteamname=' + subteamname + '&depid=' + depid;
    return this.http.get(dataUrl);
  }
  AssignResearchScreeningOwner(assignScreeningOwnerVm): Observable<any> {
    const dataUrl = 'Research/AssignResearchScreeningOwner';
    return this.http.post(dataUrl, assignScreeningOwnerVm);
  }
  GetAllCaseDetails(loginUserDetVm): Observable<any> {
    const dataUrl = 'Master/GetAllCaseDetails';
    return this.http.post(dataUrl, loginUserDetVm);
  }
  // GetAllCaseHistoryDetails(caseHistoryVm): Observable<any> {
  //   const dataUrl = 'Master/GetAllCaseHistoryDetails';
  //   //return this.http.post(dataUrl, caseHistoryVm);
  //   return this.http.post<any>(dataUrl, caseHistoryVm, { observe: 'response' as 'body' });
  // }
  // GetAllCaseHistoryDetailsExport(caseHistoryVm): Observable<any> {
  //   const dataUrl = 'Master/GetAllCaseHistoryDetailsExport';
  //   return this.http.post(dataUrl, caseHistoryVm);
  // }
  getAllCaseHistory(caseHistoryVm, isExport, isShowAll): Observable<any> {
    const dataUrl = isExport || isShowAll ? 'Master/GetAllCaseHistoryDetailsExport' : 'Master/GetAllCaseHistoryDetails';
    return this.http.post(dataUrl, caseHistoryVm, { observe: 'response' as 'body' });

  }
  updateCountry(countryVm): Observable<any> {
    const dataUrl = 'Master/SaveCountry';
    return this.http.post<any>(dataUrl, countryVm);
  }
  AssignDEPreQCInsuffClearScreeningOwner(assignScreeningOwnerVm): Observable<any[]> {
    const dataUrl = 'Master/AssignDEPreQCInsuffClearScreeningOwner';
    return this.http.post<any>(dataUrl, assignScreeningOwnerVm);
  }
  AssignDEInsuffClearScreeningOwner(assignScreeningOwnerVm): Observable<any[]> {
    const dataUrl = 'Master/AssignDEInsuffClearScreeningOwner';
    return this.http.post<any>(dataUrl, assignScreeningOwnerVm);
  }
  public ThemeChange(userId, ThemeChangeVM): Observable<any> {
    const dataUrl = 'User/ThemeChange?userId=' + userId;
    return this.http.post<any>(dataUrl, ThemeChangeVM);
  }
  getcandidateDoc(candidateDocuments: FormData): Observable<any> {
    const dataUrl = 'Case/CandidateDocumentUpload';
    return this.http.post(dataUrl, candidateDocuments);
  }

  viewcandidateDoc(docViewVm: CandidateDocumentInput): Observable<any> {
    const dataUrl = 'Case/GetCandidateUploadedDocument';
    return this.http.post<any>(dataUrl, docViewVm);
  }
  GetDocByFilePath(filePath: any) {
    const dataUrl = 'ClientEntries/GetDocByFilePath?filePath=' + filePath;
    return this.http.get<any>(dataUrl);
  }
  DownloadSiteDocument(logoDocTransId: number): Observable<any> {
    const dataUrl = 'Master/DownloadSiteDocument?logoDocTransId=' + logoDocTransId;
    return this.http.get<any>(dataUrl);
  }
  DeleteSiteLogo(logoDocTransId: number, logginId): Observable<any> {
    const dataUrl = 'Master/DeleteSiteLogo?logoDocTransId=' + logoDocTransId+ '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  GetModeOfVerificationComp(compId: number) {
    const dataUrl = 'Master/GetModeOfVerificationComp?compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  getAllModeofVerification(){
    const dataUrl = 'Master/GetAllModeofVerification';
    return this.http.get<any>(dataUrl);
  }
  AddModeofVerificationComp(componentTypeVm): Observable<any> {
    const dataUrl = 'Master/AddModeofVerificationComp';
    return this.http.post<any>(dataUrl, componentTypeVm);
  }
}
