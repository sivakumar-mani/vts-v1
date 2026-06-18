import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/Subject';
import { Subject } from 'rxjs';
import { CommonAlertsComponent } from '../common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { BreadcrumbFlags } from '../models/breadcrumb-flags';
import { Table, TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, UntypedFormArray, Validators, UntypedFormBuilder } from '@angular/forms';
import { VerificationService } from './verification.service';
import { MailTemplate } from '../mail-templates/mail-template';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { MasterService } from './master.service';
import { orgInfoFlags } from '../models/orgInfoFlags';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { differenceInCalendarQuarters, differenceInYears } from 'date-fns';
import { } from 'jquery';
// import { moment } from 'fullcalendar';
import moment from 'moment';
import { toBlob } from '@progress/kendo-drawing/pdf';
import { Router } from '@angular/router';
import { FdaComponent } from 'src/app/screening/DynamicComponents/fda/fda.component';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { FileDownloadService } from './file-download.service';
import { saveFile, byteArrayToBlob } from '../utils/file-download.utils';
import { FSCandidateVm } from '../models/screening-detail';
// import { FilterService } from '@progress/kendo-angular-grid/dist/es2015/filtering/filter.service';
// import { FilterService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  KRYA_SCREENING: string = 'KRYA SCREENING'
  siteList: Site[] = [];
  codec = new HttpUrlEncodingCodec;
  domesticCategoryId = 1;
  invoiceDtFlag: boolean = true;
  camApprovalId = 0;
  hideandShowFlag: boolean = false;
  techmcatId = 4;
  camFlagStatus: any[] = [];
  STP_CHKID = 22;
  CLBY_CLIID = 6;
  fromConditionList: any[] = [];
  toConditionList: any[] = [];
  // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
  MVCamFlag = false;
  MVCamRjFlag = false;
  CAM_STATUS_YES = 'Yes';
  camRejection = false;
  RECEIVED_FROM_VE = 'ReceivedFromVE';
  SEND_TO_CLIENT = 'SendToClient';
  // ended  - For (sprint -22) VTS2-2024-CRT-0195
  COMPLETED_STATUS = 'Completed';
  COMPLIANCE_LINK = 'COMPLIANCE LINK';
  DATABASE_GLOBAL = 'DATABASE GLOBAL';
  INDIA_SPECIFIC_REGULATORY_COMPLIANCE_DATABASE = 'INDIA SPECIFIC REGULATORY & COMPLIANCE DATABASE';
  ONLINE_SEARCH = 'Online Search';
  RECORD_FOUND_DISCREPANCY = 'Record Found- Discrepancy';
  screeningDetails: any;
  saveType: any;
  MvTlFlag = false;
  currentEmp = false;
  reassigned = false;
  docFlag = false;
  addressflag = false;
  isAdditionalPos: boolean = false;
  empdata: any;
  candidateData: any;
  fileSubmissionCom: UntypedFormGroup;
  currentDateTime: any;
  clientName = '';
  clientId: any;
  insuffCountFlag = false;
  caseFlag = false;
  caseHistoryFlag = false;
  isDEFlag = false;
  VeCountFlag = false;
  qcCountFlag = false;
  maxDob: Date;
  cityRes: any;
  maxDate: Date;
  statusFlag = true;
  instatusId = 0;
  indivisaveFlag = false;
  candidateName: string;
  suspicious = 'Suspicious'
  SEAL_TYPE = 'Seal';
  MANAGING_DIRECTOR = 'Managing Director';
  BANNER_LOGO_ONE = 'Banner Logo 1';
  NSR_LOGO_ONE = 'NSR';
  SIGNATURE_TYPE = 'Signature';
  KRYA_LOGO = 'Krya Logo';
  KRYA_SEAL = 'Krya Seal';
  countryList: any[] = [];
  stateList: any[] = [];
  statuscFlag = true;
  cityList: any[] = [];
  districtList: any[] = [];
  stateId = 0;
  educationType: any[] = [];
  hide = false;
  backFlag = false;
  globalList: any;
  CHANGEPASSWORD = 'CHANGEPASSWORD';
  screenTitle = '';
  addDataPath = '';
  ListPath = '';
  eventSubscription: Subscription;
  breadcrumbFlag = new BreadcrumbFlags();
  SESSIONOUT = 'SESSIONOUT';
  SESSIONSTAYTIME = 'SESSIONSTAYTIME';
  CANDIDATECONFIRM = 'CANDIDATECONFIRM';
  CANDIDATECONFIRMNO = 'CANDIDATECONFIRMNO';
  SAVE = 'SAVE';
  HIDE = 'HIDE';
  RESET = 'RESET';
  SHOW = 'SHOW';
  BACK = 'BACK';
  UPDATE = 'UPDATE';
  ADD = 'ADD';
  RESETTABLE = 'RESETTABLE';
  DELETECONFIRMATION = 'DELETECONFIRMATION';
  SHOWALL = 'SHOWALL';
  ALERT = 'ALERT';
  ALERTBULK = 'ALERTBULK';
  APPROVE = 'APPROVE';
  SOCIAL_MEDIA = 'SOCIAL MEDIA'
  OIG = 'OIG'
  MHCP = 'MHCP'
  OPEN_NAVIGATE = 'OPEN_NAVIGATE';
  OPEN_NNAVIGATE = 'OPEN_NNAVIGATE';
  OPEN_ANOTHER = 'OPEN_ANOTHER';
  SCRN_EMPLOYER_CREATION = 'Employer Creation';
  SCRN_INSTITUTION_CREATION = 'Institution Creation';
  SCRN_PROFESSIONAL_REFERENCE = 'Professional Reference';
  SCRN_LICENSE_CREATION = 'License Authority';
  FAKEEMPLOYER = true;
  GENUINEEMPLOYER = true;
  FAKEINSTITUTE = false;
  GENUINEINSTITUTE = false;
  PROESSIONALREF = false;
  tempResetData: any;
  newDesignation: any;
  // For Designer purpose - START
  A_CHECK = 'A-CHECK';
  NET_FORCE = 'NET FORCE';
  // UI
  popuptimeout = false;
  popupconfirmation = false;
  popupDialog = false;
  popupDialogDepartment = false;
  popupOTP = false;
  addFlag = false;
  showHint = false;
  componentName = '';
  showLable = false;
  ScreeningCasePriority = 33;
  // UI End
  fullyClearTab: boolean;
  // For Designer  purpose - END
  // MOD_CONFIGURE = 'Configure';
  //  MOD_CLIENT = 'Client';
  // MOD_SCREENING = 'Screening';
  // MOD_DIRECTAPP = 'Direct App';
  // MOD_VERIFICATION = 'Verification';
  // MOD_REPORT = 'Report';
  // SCRN_CREATEUSER = 'Create User';
  // SCRN_CLIENTUSER = 'Client User';
  // SCRN_CLIENT_FEES_APPROVAL = 'MSP & NRP Fee Approval';
  // SCRN_CLIENT_TAT_APPROVAL = 'Tat Approval';
  // SCRN_SITE_CREATION = 'Site Creation';
  // SCRN_CANCELLATIONRULE = 'Cancellation Rule';
  // SCRN_BILLINGRULE = 'Billing Rule';
  // SCRN_BILLINGCYCLE = 'Billing Cycle';
  // SCRN_PACKAGECREATION = 'Package Creation';
  // SCRN_COMPONENTS = 'Components';
  // SCRN_DEPT_COMPONENTS = 'Department Components';
  // SCRN_CLIENT_ROLES = 'Client Roles';
  // SCRN_ROLES = 'Roles';
  // SCRN_GROUPCREATION = 'group Creation';
  // SCRN_CLIENTCREATION = 'Client Creation';
  // SCRN_STATUS = 'Status';
  // SCRN_EMAILQUEUE = 'Email Queue';
  // SCRN_CALL_CHARGES_LIST = 'Call Charges';
  // SCRN_SCREENING_QUESTIONS = 'Screening Questions';
  // SCRN_VENDOR_MASTER = 'Vendor';
  // SCRN_DRUG_KIT = 'Drug Kit';
  // SCRN_EMAIL_CONFIG = 'Email Config';
  // SCRN_EMAIL_TEMPLATE = 'Email Template';
  // SCRN_SALES_TEAM_CLIENT_MAPPING = 'Sales Team-Client Mapping';
  // SCRN_CLIENT_AGREEMENT_APPROVAL = 'Client Agreement Approval';
  // SCRN_FAKE_EMPLOYER_INSTITUTION = 'Fake Employer/Institution Entry';
  EMPLOYER = 'Employer';
  INSTITUTION = 'Institution';
  SCRN_FAKE_EMPLOYER = 'Fake Employer';
  SCRN_FAKE_INSTITUTION = 'Fake Institution';
  // SCRN_AUDITING = 'Auditing';
  // SCRN_INSTITUTE_CREATION = 'Institute Creation';
  // SCRN_EMPLOYER_INSTITUTION = 'Employer/Institution Entry';
  // SCRN_FAKE_EMP_INS_IMPORT = 'Fake Employer/Institution Entry Import';
  // SCRN_GENUINE_EMP_INS_IMPORT = 'Genuine Employer/Institution';
  // SCRN_DRUG = 'Drug';
  // SCRN_DRUG_PANEL = 'Drug Panel';
  // SCRN_DEPARTMENT = 'Department';
  // SCRN_SUB_COMPONENT = 'Sub Component';
  // SCRN_ALERT_RULES = 'Alert Rule';
  INSUF_NOTIFICATION = 'Insufficiency Notification';
  CONSOLIDATE_AND_CUMULATIVE_INSUFFICIENCY = 'ConsolidateandCumulativeInsufficiency'
  DIR_APP_COMP_NOTIFICATION = 'DirectApp Completion Notification';
  ACKNOW_NOTIFI = 'Acknowledgement Notification';
  FINAL_REPORT = 'Final Report Notification';
  Consolidated_pending_insufficiencies = 'Consolidated pending insufficiencies';

  // SCRN_INSUFFICIENCY = 'Insufficiency';
  // SCRN_CREATEINVITATION = 'Create Invitation';
  // SCRN_MASTERDATAAPPROVAL = 'Master Data Approval';
  // SCRN_SCOPECREATION = 'Scope Creation';
  // SCRN_CASECREATION = 'Case Creation';
  // SCRN_DEPT_TEAM_USERS = 'Department Team Users';
  // SCRN_TEAM = 'Department Team';
  // SCRN_LOA_STATUS = 'LOA Approval';
  GEN_INS = 'General Instruction';
  SPE_INS = 'Special Instruction';
  PACKAGE = 'Package';
  // SCRN_CLIENT_ADDITIONAL_FIELDS = 'Client Custom Fields';
  // SCRN_PACKAGE_FEES_APPROVAL = 'Package Fee Approval';
  // SCRN_EMAIL_HISTORY = 'Email History';
  // SCRN_SEVENTH_DAY_REPORT = 'File Level Tracker';
  SUBMISSION_HISTORY = 'submission History';
  DATA_ENTRY_DEPARTMENT = "Data Entry Department"
  VE_HISTORY = 'Closed Checks';
  BT_POPUP = 'BT Details';
  WT_POPUP = 'WT Details';
  NT_POPUP = 'NT Details';
  CT_POPUP = 'CT Details';
  // SCREENING COMPONENT CONSTANTS
  ADDRESS = 'ADDRESS';
  ADDRESS_GEO = 'DIGITAL ADDRESS VERIFICATION';
  BANK_STATEMENT = 'BANK STATEMENT';
  BANK_STATEMENTId = 3;
  COMPANY_SITE_VISIT = 'COMPANY SITE VISIT';
  SOCIAL_MEDIAID = 39;
  Socialcompid: any;
  CREDIT_VERIFICATION = 'CREDIT VERIFICATION';
  CRIMINAL_FELONY_MISDEMEANOR_5_YEARS = 'CRIMINAL - FELONY & MISDEMEANOR 5 YEARS';
  CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS = 'CRIMINAL - FEDERAL NATIONWIDE 5 YEARS';
  CRIMINAL_COURT_RECORD = 'CRIMINAL (COURT RECORD)';
  CRIMINAL_DATABASE = 'DATABASE';
  CRIMINAL_DATABASEID = 12;
  FDAID = 50;
  // VTS2-2024-CRT-0216 - Added by Naveen
  DATABASE_CONDUCT = 'DATABASE – CONDUCT';
  DATABASE_ADVERSE_MEDIA = 'DATABASE – ADVERSE MEDIA';
  FACISLevel1 = 'FACIS (LEVEL 1)';
  FACISLevel2 = 'FACIS (LEVEL 2)';
  FACISLevel3 = 'FACIS (LEVEL 3)';
  FACIS1M = 'FACIS 1M';
  TENNESSEE = 'TENNESSEE CHECK';
  CriminalCheckGap = 'GAP CHECK';
  CV_VALIDATION = 'CV VALIDATION';
  DRUG_TEST = 'DRUG TEST';
  EDUCATION = 'EDUCATION';
  EDUCATION_INTERNATIONAL = 'EDUCATION INTERNATIONAL';
  EMPLOYMENT_INTERNATIONAL = 'EMPLOYMENT INTERNATIONAL';
  EMERGENCY_CONTACT_VERIFICATION = 'EMERGENCY CONTACT VERIFICATION';
  EMPHR_EMPSUP = 'EMPHR & EMPSUP';
  EMPLOYMENT_SUPERVISOR = 'EMPLOYMENT (SUPERVISOR)';
  EMPLOYMENT_HR = 'EMPLOYMENT (HR)';
  //For VTS2-2023-CRT-0131 - split emp -By Megala
  CURRENT_EMPLOYMENT_HR = 'CURRENT EMPLOYMENT';
  PREVIOUS_EMPLOYMENT_HR = 'PREVIOUS EMPLOYMENT';
  EMPLOYMENT_HRId = 18;
  CURRENT_EMPLOYMENT_HRId = 70;
  PREVIOUS_EMPLOYMENT_HRId = 71;
  EDUCATIONId = 15;
  EMPLOYMENT_UAN = 'EMPLOYMENT (UAN)';
  GSA = 'SAM/GSA';
  FDA = 'FDA';
  NSR = 'NSR CHECK';
  GAP_VERIFICATION = 'GAP VERIFICATION';
  GAP_VERIFICATION_ID = 19;

  JUDIS_COURT_RECORD = 'JUDIS COURT RECORD';
  LICENSE = 'LICENSE';
  NATIONAL_IDENTITY_CHECK = 'NATIONAL IDENTITY CHECK';

  NATIONWIDE_SEX_OFFENDER = 'NATIONWIDE SEX OFFENDER';
  NATIONWIDE_SEX_OFFENDER_5_YEARS = 'NATIONWIDE SEX OFFENDER 5 YEARS';
  CRIMINAL_SEARCH_STATEWIDE_10_YEARS = 'CRIMINAL SEARCH STATEWIDE 10 YEARS';
  CRIMINAL_FEDERAL_NATIONWIDE_10_YEARS = 'CRIMINAL - FEDERAL NATIONWIDE 10 YEARS';
  FEDERAL_DISTRICT_SEARCH_10_YEARS = 'FEDERAL DISTRICT SEARCH 10 YEARS';

  CRIMINAL_FELONY_MISDEMEANOR_10_YEARS = 'CRIMINAL - FELONY & MISDEMEANOR 10 YEARS';
  NATIONAL_CRIMINAL_DATABASE_SEARCH_10_YEARS = 'NATIONAL CRIMINAL DATABASE SEARCH 10 YEARS';
  NATIONAL_CRIMINAL_LOCATOR = 'NATIONAL CRIMINAL LOCATOR';
  CRIMINAL_SEARCH_OVERSEAS = 'CRIMINAL SEARCH - OVERSEAS';
  CREDIT_OVERSEAS = 'CREDIT - OVERSEAS';
  MVR = 'MVR';
  VERIFICATION_ROUTER = '';
  QUALITYCHECK_ROUTER = '';
  OFAC_SDN = 'OFAC';
  CRIMINAL_CHECK_PCC1 = 'CRIMINAL CHECK (PCC1)';
  CRIMINAL_CHECK_PCC2 = 'CRIMINAL CHECK (PCC2)';
  CRIMINAL_CHECK_PCC3 = 'CRIMINAL CHECK (PCC3)';
  CRIMINAL_CHECK_PCC3E = 'CRIMINAL CHECK (PCC3E)';
  ONLINE_CRC = 'ONLINE CRC';
  ONLINE_CRC_INTERNAL = 'ONLINE CRC (INTERNAL)';
  PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION = 'PAN INDIA ONLINE COURT RECORD VERIFICATION';
  PASSPORT = 'PASSPORT';
  REFERENCE_CHECK = 'REFERENCE CHECK';
  REFERENCE_SELF_EMPLOYED = 'REFERENCE SELF-EMPLOYED';
  SSN_TRACE = 'SSN TRACE';
  VOTER_ID = 'VOTER ID';
  PAN_CARD = 'PAN CARD';
  PAN_CARDID = 34;
  CURRENT_ADDRESS = 'CURRENT ADDRESS';
  CURRENT_ADDRESSID = 1;
  DACURRENT_ADDRESSID = 6;
  PERMANENT_ADDRESS = 'PERMANENT ADDRESS';
  NDOT_DRUG_SCREEN = 'NDOT DRUG SCREEN';
  DIRECTORSHIP = 'DIRECTORSHIP';
  GAPREASON = 'GAP REASON';
  ///////////////////////////////////////////////////////////////////////////////
  // VERIFICATION COMPONENT CONSTANTS
  SCRN_VERIFICATION = 'Verification';
  //MARRIED STATUS
  MARRIED = 480;
  UNMARRIED = 481;
  WIDOWED = 482;
  SEPERATED = 484;
  DIVORCED = 483;
  Others = 559;
  FrApprovedReject = 479;
  Genuine = 171;
  Suspicious = 170;
  VERIFIEDNUM = 168;
  ReverifyFR = 607;
  FORRESNUM = 167;
  FrWorkFlowId = 559;
  // SCREENING FLAGS
  PREQCREJECT = 'PREQCREJECT';
  SUBMISSION = 'SUBMISSION';
  PREQCCASE = 'PREQCCASE';
  QCREJECT = 'QCREJECT';
  VEREJECT = 'VEREJECT';
  FRREJECT = 'FRREJECT';
  reOpenSearchFlag: boolean = false;
  modifyAdditionalFeeFlag: boolean = false;
  modifyComponentFeeFlag: boolean = false;
  REOPEN = 'REOPEN';
  STOPCHECK = 'STOPCHECK';
  INSUFFCLEARANCE = 'INSUFFCLEARANCE';
  RAISEDINSUFFICIENCY = 'RAISEDINSUFFICIENCY';
  NOTAPPLICABLE = 'NOTAPPLICABLE';
  CLOSED = 'CLOSED';
  SEVENTHDAYTRACKER = 'SEVENTHDAYTRACKER';
  NEWCASE = 'NEWCASE';
  SUBCHECK = 'SUBCHECK';
  DASUBCHECK = 'DASUBCHECK';
  // MAIL TEMPLATE CONSTANTS
  CASE_CREATION = 'casecreation';
  // **Added for Nodemail** //
  // CLIENT_FEE_APPROVAL = 'clientfeeapproval';
  // CLIENT_FEE_PRE_APPROVAL = 'clientfeepreapproval';
  // CLIENT_TAT_APPROVAL = 'clienttatapproval';
  // CLIENT_TAT_PRE_APPROVAL = 'clienttatpreapproval';
  // CLIENT_AGREEMENT_APPROVAL = 'clientagreementapproval';
  // CLIENT_ONHOLD_BYCRT = 'clientonholdbycrt';
  // CLIENT_ONHOLD_RENEWEDCRT = 'clientonholdrenewedbycrt';
  // CLIENT_PDF_OPENPW = 'clientpdfreportopenpassword';
  // CLIENT_PDF_CRTPW = 'pdfreportopenpasswordforcrt';
  // SCOPE_LOA_APPROVAL = 'scopecreation';
  // INVITATION_CREATION = 'invitationcreation';
  // PACKAGE_FEE_APPROVAL = 'packagefeeapproval';
  // PACKAGE_FEE_PRE_APPROVAL = 'packagefeepreapproval';
  /////////

  //Team Name
  COMMONSUBCAMTEAM = 'CRTCAMTeam';
  COMMONCRTTEAM = 'CRTIndia';
  COMMONABROADTEAM = 'CRTAbroad';
  COMMONTECHMTEAM = 'CRTTechMahindra';
  SCRN_ORGINFO_COMPONENTS = 'Organization Info';
  SCRN_CORSEMASTER_COMPONENTS = 'Course Master';
  SCRN_RECORD_CHK = 'Record Check';
  RECORD_CHECK_CATEGORY = 'Record Check Category';
  DOC_REQ = 226;
  emailCommonDate: any;
  private subject = new Subject<any>();
  placeList: any[];
  OTHERS = 'Others';
  DEST_TYPE_TO = 'To';
  DEST_TYPE_CC = 'CC';
  empVerifyFlag = false;
  qcOrFqcFlag: boolean;
  Fqc: string;
  redcaseFlag = false;
  verifyOrQcRejected = null;
  eduId = 15;
  HSC = 496;
  empSupId = 18;
  refCheId = 31;
  drugResultList: any[] = [];
  feesValue: any;
  userData: any;
  safeUrl: SafeResourceUrl;
  orgnzFlagscr = new orgInfoFlags();
  indiaCountry = 'india';
  ADDI_FEE = 'Additional Fees';
  COMPON_FEE = 'Component Fees';
  RAISED = 'Raised';
  clientRefNoPrefix = '';
  approvalType: string;
  month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  mailTemplates: any[] = [];
  // added by Niranjana //
  // CLIENT_FEE_REQ = 'ClientFeeRequest';
  funcEntity: any;
  userName: string;
  password: string;
  otherCertificationCourse = 498;
  currencyInr = 'india - inr';
  selectedIteams: any;
  currencyUsd = 'united states - usd';
  INFO_REQ = 'Information Required';
  DOCU_REQ = 'Document Required';
  INFO_DOCU = 'Information & Document Required';
  Submitted = 'Submitted';
  App_Pend = 'Approval Pending';
  FULLY_CLE = 'Fully Cleared';
  PAR_CLE = 'Partially Cleared';
  HOLD_CLE = 'Hold';
  CRT_WORKFLOW_ID = 227;
  CLO_INS_QUERY = 'Close Insuff & Query';
  ClearInsuff = "Clear Insuff";
  GEN_VER = 'Close - Gen (Verbal Conf Rcvd.)';
  FAKE_VER = 'Close - Fake (Verbal Conf Rcvd.)';
  CLOSEINSUFFICIENCY = 'Close - Insufficiency';
  CLOSE_STOPCHECK = 'Close - Stop Check';
  // screening status
  CANC_INTE = 'Close - Cancelled Internally';
  CANC_BCLI = 'Close - Cancelled by Client';
  //NetForce Status
  UNABLE_TO_VERIFTY = 'Unable to Verify';
  UTV_INFO = 'UTV - Info not provided';
  CLOSE_UNVERIFIED = 'Close - Unverified';
  Positive = 'Positive';
  PositiveReview = 'Positive-Review';
  Negative = 'Negative';
  NegativePleaseReview = 'Negative-Please Review';
  TO_CLOSE = 'To Close';
  FOR_RE = 'For Research';
  FOR_FUR_RE = 'For Further Research';
  VERIFIED = 'Verified';
  Approval_Pending = 'Approval Pending';
  Rejected = 'Rejected';
  SCRN_LOOKUP_CATEGORY = 'Lookup Category';
  SCRN_LOOKUP = 'LookUp';
  SCRN_MODULE = 'Module';
  SCRN_SUB_MODULE = 'Sub Module';
  SCRN_SCREEN = 'Screen';
  SCRN_INVOICE_TAX = 'Invoice Tax';
  SCRN_HOLIDAY = 'Holiday';
  SCRN_INSUFFICIENCY_DOCUMENT = 'Insufficiency Document';
  SCRN_CITY = 'City';
  SCRN_PLACE = 'Place';
  SCRN_DISTRICT = 'District';
  SCRN_STATE = 'State';
  SCRN_CONTACT_REMARKS = 'Contact Remarks';
  applicationList: any[] = [];
  HIGH = 'High';
  DELTA = 'Delta';
  NORMAL = 'Normal';
  MEDIUM = 'Medium';
  VERIZON = 'Verizon';
  NORMAL_CASE = 'Normal case';
  PILOT_CASE = 'Pilot case';
  PRIORITY_CASE = 'Priority case';
  RUSH_CASE = 'Rush case';
  SENIOR_PROFILE = 'Senior Profile';
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  manualClientDetails: any;
  screenName: string;
  popCommonSearch: boolean;
  VE = false;
  agreementapproveFlag = null;
  MspApprovestatus: string;
  TatApprovestatus: string;
  loaActiveTabindex = 0;
  subCheckFlag = false;
  commonVeFlag: string | null = null;
  commonQcFlag: string;
  commonFrFlag: string;
  screeingCompidBy: number;
  underReviewStatus = "Under Review"
  categoryA = 'Category A';
  categoryB = 'Category B';
  categoryC = 'Category C';
  removebutton = new BehaviorSubject(null);
  commonHistoryflag = true;
  DE_QC_Error = 'DE-QC';
  OT_VE_Error = 'Operation Team Error';
  BOTH_Error = 'Both DE and Operation Team Error';
  BOTH_DE_PREQC_Error = 'Both DE Pre QC and Operation Team Error';
  DE_Error = 'DE Error';
  EmailRegX: any = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,100}$/;
  AcheckLoginId = 1;

  allEmpComponent: any;
  allEduComponent: any;
  colorCode: string;
  dob: any;
  dateRestrictionInPOS: boolean = false;

  vendorDDList: any[] = [];
  clientDDList: any[] = [];
  statusDDList: any[] = [];
  priorityDDList: any[] = [];
  componentDDList: any[] = [];
  clientScreeningIdDDList: any[] = [];
  ScreeningOwnerDDList: any[] = [];
  candidateDDList: any[] = [];
  historyClientId: any;
  private candidateInfoSource = new BehaviorSubject<FSCandidateVm>(null);
  candidateInfo$ = this.candidateInfoSource.asObservable();

  setCandidateInfo(info: FSCandidateVm) {
    this.candidateInfoSource.next(info);
  }

  getCandidateInfo(): FSCandidateVm {
    return this.candidateInfoSource.value;
  }
  candidateCountryId: number;
  subcompCount = 0;
  directAppcompList: any[] = [];
  constructor(public dialog: MatDialog, public datepipe: DatePipe, private fb: UntypedFormBuilder, public router: Router,
    // tslint:disable-next-line: align
    private verificationService: VerificationService, private fileDownloadService: FileDownloadService, private http: HttpClient) {

  }
  ConvertKeysToLowerCase(obj: any) {
    const output: any[] = [];
    for (const i in obj) {
      if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
        output[i.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1)))] = this.ConvertKeysToLowerCase(obj[i]);
      } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
        obj[i].Sno = i + 1;
        output[i.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1)))] = [];
        // tslint:disable-next-line: max-line-length
        output[i.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1)))].push(this.ConvertKeysToLowerCase(obj[i][0]));
      } else {
        output[i.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1)))] = obj[i];
      }
    }
    return output;
  }
  public getEducationTypeDetails(): Observable<any> {
    const dataUrl = 'Master/GetEducationTypeDetails';
    return this.http.get<any>(dataUrl);
  }
  getNameById(list, listId, listName, findId) {
    if (findId && list && list.length) {
      const name = list.find(x => x[listId] === findId)[listName];
      return name;
    }
  }
  getIdByName(list, listId, listName, findName) {
    if (findName && list && list.length) {
      const id = list.find(x => x[listName].toLowerCase() === findName.toLowerCase())[listId];
      return id;
    }
  }
  getCompNameByIndex(name, index, comp, sub) {
    let compName = '';
    if (name.toLowerCase() === this.EMPLOYMENT_HR.toLowerCase()) {
      compName = name + ' ( ' + (index === 1 ? 'CURRENT/LAST EMPLOYMENT' : ('PREVIOUS EMPLOYMENT ' + (index - 1))) + ' ) ';
    }
    else if (name.toLowerCase() === this.PREVIOUS_EMPLOYMENT_HR.toLowerCase()) {
      compName = name + ' ' + index;
    } else {
      if (!(comp > 0) && !(sub > 0)) {
        compName = name + ' ' + index;
      } else {
        compName = name;
      }
    }
    return compName;
  }
  getMaxDate() {
    return new Date();
  }
  capitalizeArrayVals(val: any): string[] {
    const data: any[] = []; val.forEach(element => { data.push(this.capitalize(element)); }); return data;
  }
  getApplicationList() {
    this.GetApplicationDetails().subscribe(resp => {
      if (resp) {
        this.applicationList = resp;
      }
    });
  }
  GetApplicationDetails(): Observable<any> {
    const dataUrl = 'Master/GetApplicationDetails';
    return this.http.get<any>(dataUrl);
  }
  capitalize(element: any) {
    // tslint:disable-next-line:one-variable-per-declaration  // tslint:disable-next-line:prefer-const
    let index = 0, res: any[] = [];
    // tslint:disable-next-line:no-conditional-assignment
    while ((index = element.indexOf(' ', index + 1)) > 0) { res.push(index); }
    // tslint:disable-next-line:max-line-length
    if (res.length === 0) { element = element ? this.replaceAt(element.toString().toLowerCase(), (0), element.toString().charAt(0).toUpperCase()) : element; }
    // tslint:disable-next-line:no-shadowed-variable
    res.forEach((val, index) => {
      if (index === 0) { element = this.replaceAt(element.toString().toLowerCase(), (index), element.charAt(index).toUpperCase()); }
      element = this.replaceAt(element, (val + 1), element.charAt(val + 1).toUpperCase());
    });
    return element;
  }
  replaceAt(param, index, replace) { return param.substring(0, index) + replace + param.substring(index + 1); }

  newEvent(event: any) {
    this.subject.next(event);
  }

  get events$() {
    return this.subject.asObservable();
  }

  FlagEvent(event: any) {
    this.subject.next(event);
  }

  get flagEvents$() {
    return this.subject.asObservable();
  }

  // Clone/assign object without reference
  CloneObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  // Clone/assign array without reference
  CloneArray(arr: any): any {
    return Object.assign([], arr);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.tempResetData = null;
  }
  setfalsedeleted(previews, current, param): any {
    let allitem: any[] = [];
    const previewsitem: any[] = previews;
    const currentitem: any[] = current;
    const currentids: any[] = [];
    if (current) {
      const ids = new Set(previewsitem.map(d => d[param]));
      currentitem.map(d => {
        currentids.push(d[param]);
      });
      allitem = [...previewsitem, ...currentitem.filter(d => !ids.has(d[param]))];

      // allitem = [...new Set([...previewsitem, ...currentitem])];
      allitem.forEach(element => {
        if (currentids.includes(element[param])) {
          element.active = true;
        } else {
          element.active = false;
        }
      });
    }
    return allitem;
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
  downloadDocument(id, doc, filename) {
    const sampleArr = this.base64ToArrayBuffer(doc);
    this.saveByteArray(filename, sampleArr);
  }

  ngEncode(param: string) {
    return this.codec.encodeValue(param);
  }

  ngDecode(param: string) {
    return this.codec.decodeValue(this.ngEncode(param));
  }

  downloadDocumentFromUrl(fileUrl: string, doc, filename: string) {
    if (!fileUrl) {
      this.saveByteArray(filename, doc);
    }
    else {
      fileUrl = this.ngEncode(fileUrl);
      this.fileDownloadService.downloadFileAsByte(fileUrl).subscribe(byteArray => {
        this.saveByteArray(filename, byteArray);
      }, error => {
        console.error('Download error:', error);
      });
    }
  }
  convertBase64ToFileObj(str: any) {
    const pos = str.indexOf(';base64,');
    const fileType = str.substring(5, pos);
    const b64 = str.substr(pos + 8);
    // decode base64
    const imageContent = atob(b64);
    // create an ArrayBuffer and a view (as unsigned 8-bit)
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);
    // fill the view, using the decoded base64
    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    // convert ArrayBuffer to Blob
    const blob = new Blob([buffer], { type: fileType });
    return blob;
  }
  breadcrumbFlags(pageinit = false): BreadcrumbFlags {
    if (pageinit) {
      this.breadcrumbFlag = new BreadcrumbFlags();
    } else {
      this.breadcrumbFlag.btnAdd = !this.breadcrumbFlag.btnAdd;
      this.breadcrumbFlag.btnResetTbl = !this.breadcrumbFlag.btnResetTbl;
      this.breadcrumbFlag.btnSave = !this.breadcrumbFlag.btnSave;
      this.breadcrumbFlag.btnReset = !this.breadcrumbFlag.btnReset;
      this.breadcrumbFlag.btnBack = !this.breadcrumbFlag.btnBack;
    }
    return this.breadcrumbFlag;
  }

  //  dateRangeFilter() {
  //   this.filterService.register('dateRangeFilter', (value: any, filter: any): boolean => {
  //     if (!filter || !value) return false;

  //     const formattedValue = this.datepipe.transform(value, 'yyyy/MM/dd');

  //     return formattedValue >= filter[0] && formattedValue <= filter[1];
  //   });
  // }

  dateRangeFilter(value: any, filter: any): boolean {
    if (!filter || !filter[0] || !filter[1]) return true;
    if (!value) return false;

    const valueDate = new Date(value);
    const startDate = new Date(filter[0]);
    const endDate = new Date(filter[1]);

    valueDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return valueDate >= startDate && valueDate <= endDate;
  }

  cloneForm(control: AbstractControl) {
    if (control instanceof UntypedFormControl) {
      return new UntypedFormControl(control.value, control.errors ? Validators.required : null);
    } else if (control instanceof UntypedFormGroup) {
      const copy = new UntypedFormGroup({});
      Object.keys(control.getRawValue()).forEach(key => {
        copy.addControl(key, this.cloneForm(control.controls[key]));
      });
      return copy;
    } else if (control instanceof UntypedFormArray) {
      const copy = new UntypedFormArray([]);
      control.controls.forEach(c => {
        copy.push(this.cloneForm(c));
      });
      return copy;
    }
  }
  initMiscForm(miscData: any): UntypedFormArray {
    if (miscData) {
      const arr = this.fb.array([]);
      if (miscData.length > 0) {
        for (let i = 0; miscData.length > i; i++) {
          const required = miscData[i].defaultQuestionFlag ? true : false;
          arr.push(new UntypedFormGroup({
            miscId: new UntypedFormControl(miscData[i].miscId),
            miscQuestion: new UntypedFormControl(miscData[i].miscQuestion, !required ? Validators.required : null),
            miscAnswer: new UntypedFormControl(miscData[i].miscAnswer, null),
            defaultQuestionFlag: new UntypedFormControl(miscData[i].defaultQuestionFlag),
          }));
        }
      }
      return arr;
    }
  }
  //gapVerification

  initGapForm(gapData: any, clientCatId): UntypedFormArray {

    // if (gapData) {
    const arr = this.fb.array([]);
    // if (gapData.length > 0) {
    for (let i = 0; i < 3; i++) {
      //const required = gapData[i].defaultQuestionFlag ? true : false;
      arr.push(new UntypedFormGroup({
        screeningGapVerifyId: new UntypedFormControl(0),
        screeningCompId: new UntypedFormControl(),
        gapType: new UntypedFormControl(null, clientCatId === this.techmcatId ? [Validators.required] : null),
        gapTypeLookupId: new UntypedFormControl(null, clientCatId === this.techmcatId ? [Validators.required] : null),
        gapFrom: new UntypedFormControl(null, clientCatId === this.techmcatId ? [Validators.required] : null),
        gapTo: new UntypedFormControl(null, clientCatId === this.techmcatId ? [Validators.required] : null),
        techMGapReason: new UntypedFormControl(null, clientCatId === this.techmcatId ? [Validators.required] : null),
      }));
      // }
    }
    return arr;
    // }
  }
  initGapVeriForm(gapData: any): UntypedFormArray {

    const arr = this.fb.array([]);
    if (gapData) {
      if (gapData.length > 0) {
        for (let i = 0; gapData.length > i; i++) {

          arr.push(new UntypedFormGroup({
            screeningGapVerifyId: new UntypedFormControl(gapData[i].screeningGapVerifyId),
            screeningCompId: new UntypedFormControl(gapData[i].screeningCompId),
            gapType: new UntypedFormControl(gapData[i].gapType),
            gapTypeLookupId: new UntypedFormControl(gapData[i].gapTypeLookupId),
            gapFrom: new UntypedFormControl(gapData[i].gapFrom),
            gapTo: new UntypedFormControl(gapData[i].gapTo),
            techMGapReason: new UntypedFormControl(gapData[i].techMGapReason),
          }));
        }
      }
    }

    return arr;
  }
  initCourtForm(CourtData: any): UntypedFormArray {

    const arr = this.fb.array([]);
    if (CourtData) {
      if (CourtData.length > 0) {
        for (let i = 0; CourtData.length > i; i++) {
          const required = CourtData[i].defaultQuestionFlag ? true : false;
          arr.push(new UntypedFormGroup({
            screeningJcrdetailsId: new UntypedFormControl(CourtData[i].screeningJcrdetailsId),
            ScreeningJcrid: new UntypedFormControl(CourtData[i].screeningJcrid),
            courtName: new UntypedFormControl(CourtData[i].courtName),
            jurisdiction: new UntypedFormControl(CourtData[i].jurisdictios),
            location: new UntypedFormControl(CourtData[i].location),
            remarks: new UntypedFormControl(CourtData[i].remarks),
            deleteFlag: new UntypedFormControl(CourtData[i].deleteFlag),
            active: new UntypedFormControl(CourtData[i].active),

          }));
        }
      }
    }
    return arr;

  }
  initPosForm(posData): UntypedFormArray {
    const candiadtevalidation = [this.validateInputDate];
    const date = [this.validateTillDate];
    if (posData) {
      const arr = this.fb.array([]);
      if (posData.length > 0) {
        for (let i = 0; i < posData.length; i++) {
          arr.push(new UntypedFormGroup({
            addressId: new UntypedFormControl(posData[i].addressId),
            screeningCompId: new UntypedFormControl(posData[i].screeningCompId),
            reportFlag: new UntypedFormControl(posData[i].reportFlag),
            addressPosId: new UntypedFormControl(posData[i].addressPosId),
            periodOfStay: new UntypedFormControl(posData[i].periodOfStay, [Validators.required, this.validateInputDate]),
            periodOfStayTo: new UntypedFormControl(posData[i].periodOfStayTo, [Validators.required, this.validateTillDate]),
            validationString: new UntypedFormControl([
              "SINCE BIRTH",
              "TILL DATE",
            ]),
          }));
        };
      }

      return arr;
    }
  }
  initCliPosForm(posData): UntypedFormArray {

    if (posData) {
      const arr = this.fb.array([]);
      if (posData.length > 0) {
        for (let i = 0; i < posData.length; i++) {
          arr.push(new UntypedFormGroup({
            addressId: new UntypedFormControl(posData[i].addressId),
            screeningCompId: new UntypedFormControl(posData[i].screeningCompId),
            reportFlag: new UntypedFormControl(posData[i].reportFlag),
            addressPosId: new UntypedFormControl(posData[i].addressPosId),
            periodOfStay: new UntypedFormControl(posData[i].periodOfStay, [Validators.required, this.validatedateInputStayFromwithBirt]),
            periodOfStayTo: new UntypedFormControl(posData[i].periodOfStayTo, [Validators.required, this.validatedateInputwitTilldate]),
            validationString: new UntypedFormControl([
              "NOT PROVIDED",
              "Not Provided",
              "SINCE BIRTH",
              "TILL DATE",
            ]),
          }));
        };
      }

      return arr;
    }
  }
  validatedateInputwitTilldate(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return notProviedREGEX.test(value) ||
        tillDateREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validatedateInputStayFromwithBirt(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX =
      /([Nn]){1}([Oo]){1}([Tt]){1}([ ]){1}([Pp]){1}([Rr]){1}([Oo]){1}([Vv]){1}([Ii]){1}([Dd]){1}([Ee]){1}([Dd]){1}?$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    // const yearsREGEX = /^([0-9]){2}( YEARS)?$/;
    // const yearREGEX = /^(([1])( YEAR)|[2-9]{2}( YEARS))?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return sincebrithREGEX.test(value) ||
        notProviedREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }

  validateInputDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (sincebrithREGEX.test(value) || ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validateTillDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (tillDateREGEX.test(value) || ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value)
        || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }

  moveToDashboard() {
    this.router.navigate(['dashboard/home']);
  }
  convertUtcToIst(utcDate: Date): Date {
    // IST offset in minutes (UTC+5:30)
    const istOffsetMinutes = 330;

    // Create a Date object from the provided UTC date
    const utcTime = utcDate.getTime();

    // Calculate the IST time by adding the offset
    const istTime = new Date(utcTime + (istOffsetMinutes * 60 * 1000));

    return istTime;
  }

  convertUtcToLocal(utcDate: Date): string {
    // Create a Date object from the provided UTC date string
    const utcTime = new Date(utcDate);

    // Convert the UTC time to local time
    const localTime = utcTime.toLocaleString();

    return localTime;
  }
  convertLocalToUtc(localDate: Date): string {
    // Create a Date object from the provided local date string
    const localTime = new Date(localDate);

    // Convert the local time to UTC time
    const utcTime = localTime.toISOString();

    return utcTime;
  }
  // Convert from UTC to Local Time
  convertUtcToLocalMoment(utcDate: string): string {
    return moment.utc(utcDate).local().format('YYYY-MM-DD HH:mm:ss');
  }

  // Convert from Local Time to UTC
  convertLocalToUtcMoment(localDate: string): string {
    return moment(localDate).utc().format('YYYY-MM-DD HH:mm:ss');
  }
  localToUtc(localDate: Date): Date {
    const utcTime = localDate.getTime() - localDate.getTimezoneOffset() * 60000;
    return new Date(utcTime);
  }
  utcToLocal(utcDate: Date): Date {
    const localTime = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    return localTime;
  }
  getTimezoneOffsetV2(dt, local: boolean): Date {
    if (dt != null) {
      if (local) {
        return this.utcToLocal(new Date(dt));
      } else {
        return this.localToUtc(new Date(dt));
      }
    } else {
      return dt;
    }
  }
  getTimezoneOffset(dt, local: boolean): Date {
    if (dt != null) {
      if (local) {
        return new Date(new Date(new Date(dt).getTime() + (new Date(dt).getTimezoneOffset() * 60000)).toJSON());
        //  return new Date(new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000)).toJSON());
      } else {
        return new Date(new Date(new Date(dt).getTime() - (new Date(dt).getTimezoneOffset() * 60000)).toJSON());
        // return new Date(new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toJSON());
      }
    } else {
      return dt;
    }
  }
  getFRTimezoneOffset(dt, local: boolean): Date {
    if (dt != null) {
      if (local) {
        return new Date(new Date(new Date(dt)).toJSON());
        //  return new Date(new Date(dt.getTime() + (dt.getTimezoneOffset() * 60000)).toJSON());
      } else {
        return new Date(new Date(new Date(dt)).toJSON());
        // return new Date(new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toJSON());
      }
    } else {
      return dt;
    }
  }
  checkScreeningStatusIsClose(form, statusList, id) {
    const index = this.checkStatusIsClose(form, statusList, id);
    if (index > -1 && this.verificationService.recivedDocument) {
      if (statusList.find(x => x.screeningStatusId === id).statusName.toLowerCase() !==
        this.CANC_INTE.toLowerCase() && statusList.find(x => x.screeningStatusId === id).statusName.toLowerCase() !== this.CANC_BCLI.toLowerCase()) {
        form.get('showGenrateResponse')?.setValue(true);
      }
      form.get('showGenrateResponse')?.setValue(true);
    } else if (index === -1) {
      const statusName = statusList.find(x => x.screeningStatusId === id);
      if (statusName.statusName.toLowerCase() === this.FAKE_VER.toLowerCase() || statusName.statusName.toLowerCase()
        === this.GEN_VER.toLowerCase() || statusName.statusName.toLowerCase() === this.CLOSE_UNVERIFIED.toLowerCase() ||
        statusName.statusName.toLowerCase() === this.CLOSE_STOPCHECK.toLowerCase() || statusName.statusName.toLowerCase() === this.Positive.toLowerCase() ||
        statusName.statusName.toLowerCase() === this.PositiveReview.toLowerCase() || statusName.statusName.toLowerCase() === this.Negative.toLowerCase() ||
        statusName.statusName.toLowerCase() === this.NegativePleaseReview.toLowerCase()) {
        form.get('showGenrateResponse')?.setValue(true);
      } else {
        form.get('showGenrateResponse')?.setValue(false);
      }
    }
  }
  checkStatusIsClose(form, statusList, id) {
    let screeningCloseStatusList: any[] = [];
    screeningCloseStatusList = statusList.filter(x => (x.statusName.includes('Close') || x.statusName.includes('Positive') || x.statusName.includes('Negative') || x.statusName.toLowerCase() === this.UTV_INFO.toLowerCase() || x.statusName.toLowerCase() === this.UNABLE_TO_VERIFTY.toLowerCase()) && x.statusName.toLowerCase() !==
      this.TO_CLOSE.toLowerCase() && x.statusName.toLowerCase() !== this.FAKE_VER.toLowerCase() && x.statusName.toLowerCase()
      !== this.GEN_VER.toLowerCase() && x.statusName.toLowerCase() !== this.CANC_INTE.toLowerCase() && x.statusName.toLowerCase() !== this.CANC_BCLI.toLowerCase() && x.statusName.toLowerCase() !== this.CLOSE_STOPCHECK.toLowerCase()
      && x.statusName.toLowerCase() !== this.CLOSE_UNVERIFIED.toLowerCase());
    const index = screeningCloseStatusList.findIndex(x => x.screeningStatusId === id);
    return index;
  }
  // last updated perdon name bind by Dhenral
  changeLastUpdatedUser(verificationForm: any) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    verificationForm.value['verificationTransBindDet']['statusLastUpdatedBy'] = this.userData.userName;
  }
  parseDate(obj: any) {
    // const dateFormat1 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
    // const dateFormat1 = /\d{4 }-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    const dateFormat1 = /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d.\d{3}Z/;
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (typeof obj === 'string' && dateFormat1.test(obj)) {
      const pdate = new Date(obj);

      if (pdate instanceof Date) {
        return this.getTimezoneOffset(pdate, false);
      }
    } else if (obj instanceof Object) {
      const keys = Object.keys(obj);
      keys.forEach((element, index) => {
        obj[element] = this.parseDate(obj[element]);
      });
    } else if (obj instanceof Array) {
      obj.forEach(o => {
        this.parseDate(o);
      });
    }
    return obj;
  }
  isString(value: any) {
    return typeof value === 'string' || value instanceof String;
  }
  // get only number From string
  getNuumberFromString(str: string) {
    if (typeof str === 'string') {
      if (this.isString(str)) {
        if (str) {
          let value;
          const val = str.match(/(\d+)/);
          if (val) {
            value = val[0];
          } else {
            value = null;
          }
          return value;
        }
      }
    } else {
      return str;
    }
  }
  convertDate(datestring): any {
    let year = 0;
    let month: any;
    let date = 0;
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const notProviedREGEX1 = /^(Not Provided)$/;
    if (ddmmyyyyREGEX.test(datestring) || notProviedREGEX1.test(datestring) || ddmmmyyyyREGEX.test(datestring) || yyyyREGEX.test(datestring) || (mmmyyyyREGEX.test(datestring)) || notProviedREGEX.test(datestring)) {
      if ((typeof datestring === 'string') && (datestring.indexOf('/') > -1)) {
        const str = datestring.split('/');
        if (str.length === 3) {
          if (isNaN(Number(str[1]))) {
            if (this.month.findIndex(f => f === str[1]) > -1) {
              year = Number(str[2]);
              month = this.month.findIndex(f => f === str[1]);
              date = Number(str[0]);
              return new Date(year, month, date);
            } else {
              return 'Invalid Date';
            }
          } else {
            if (Number(str[1]) > 12) {
              return 'Invalid Date';
            } else {
              year = Number(str[2]);
              month = Number(str[1]);
              date = Number(str[0]);
              return new Date(year, month - 1, date);
            }
          }
        } else if (str.length === 2) {
          if (isNaN(Number(str[0]))) {
            if (this.month.findIndex(f => f === str[0]) > -1) {
              year = Number(str[1]);
              month = isNaN(Number(str[0])) ? this.month.findIndex(f => f === str[0]) : str[0];
              return new Date(year, month, 1);
            } else {
              return 'Invalid Date';
            }
          }
          // else {
          //   if (Number(str[0]) > 12) {
          //     return 'Invalid date';
          //   } else {
          //     year = Number(str[1]);
          //     month = isNaN(Number(str[0])) ? this.common.month.findIndex(f => f === str[0]) : str[0];
          //     return new Date(year, month, 1);
          //   }
          // }
        }
      } else {
        if (datestring !== 'Not Provided' && datestring !== 'NOT PROVIDED') {
          const yyyyREGEX = /^(19|20)\d{2}$/;
          if (isNaN(Number(datestring))) {
            return 'Invalid Date';
          }
          return new Date(Number(datestring), 0, 1);
        } else {
          return '';
        }
      }
    } else {
      return 'Invalid Date';
    }
  }
  setNotProvide(mainForm: UntypedFormGroup, formControl) {
    return mainForm.get(formControl).setValue('Not Provided');
  }

  // Replace Mail Template data
  mailTemp(template: string, data: MailTemplate): string {
    if (template.includes('@@LogoPath')) {
      template = template.replace(/@@LogoPath/gi, 'cid:logo');
    }
    if (template.includes('@@Mailbodyheader')) {
      template = template.replace(/@@Mailbodyheader/gi, data.mailbodyheader);
    }
    if (template.includes('@@Clickhere')) {
      template = template.replace(/@@Clickhere/gi, 'http://localhost:4200');
    }
    if (template.includes('@@ClientName')) {
      template = template.replace(/@@ClientName/gi, data.clientName);
    }
    if (template.includes('@@CandidateName')) {
      template = template.replace(/@@CandidateName/gi, data.candidateName);
    }
    if (template.includes('@@AgreementAvailability')) {
      template = template.replace(/@@AgreementAvailability/gi, data.agreementAvailability);
    }
    if (template.includes('@@ApprovalStatus')) {
      template = template.replace(/@@ApprovalStatus/gi, data.approvalStatus);
    }
    if (template.includes('@@RequestedBy')) {
      template = template.replace(/@@RequestedBy/gi, data.requestedBy);
    }
    if (template.includes('@@Comments')) {
      template = template.replace(/@@Comments/gi, data.comments);
    }
    if (template.includes('@@ClientRefID')) {
      template = template.replace(/@@ClientRefID/gi, data.clientRefID);
    }
    if (template.includes('@@TotalCaseDone')) {
      template = template.replace(/@@TotalCaseDone/gi, data.totalCaseDone);
    }
    if (template.includes('@@PrivacyPolicyLink')) {
      template = template.replace(/@@PrivacyPolicyLink/gi, 'http://localhost:4200/privacy');
    }
    if (template.includes('@@TableData')) {
      template = template.replace(/@@TableData/gi, data.tableData);
    }
    // **Added for Nodemail** //
    // if (template.includes('@@RequestedRate')) {
    //   template = template.replace(/@@RequestedRate/gi, data.requestedRate);
    // }
    // if (template.includes('@@ValidationCondition')) {
    //   template = template.replace(/@@ValidationCondition/gi, data.validationCondition);
    // }
    // if (template.includes('@@Component')) {
    //   template = template.replace(/@@Component/gi, data.component);
    // }
    // if (template.includes('@@SubComponent')) {
    //   template = template.replace(/@@SubComponent/gi, data.subComponent);
    // }
    // if (template.includes('@@MSPRate')) {
    //   template = template.replace(/@@MSPRate/gi, data.mSPRate);
    // }
    // if (template.includes('@@NSPRate')) {
    //   template = template.replace(/@@NSPRate/gi, data.nSPRate);
    // }
    // if (template.includes('@@OriginalTat')) {
    //   template = template.replace(/@@OriginalTat/gi, data.originalTat);
    // }
    // if (template.includes('@@RequestedTat')) {
    //   template = template.replace(/@@RequestedTat/gi, data.requestedTat);
    // }
    // if (template.includes('@@Remarks')) {
    //   template = template.replace(/@@Remarks/gi, data.remarks);
    // }
    // if (template.includes('@@RequestPerson')) {
    //   template = template.replace(/@@RequestPerson/gi, data.requestPerson);
    // }
    // if (template.includes('@@AgreementAvailability')) {
    //   template = template.replace(/@@AgreementAvailability/gi, data.agreementAvailability);
    // }
    // if (template.includes('@@ApprovalStatus')) {
    //   template = template.replace(/@@ApprovalStatus/gi, data.approvalStatus);
    // }
    // if (template.includes('@@userName')) {
    //   template = template.replace(/@@userName/gi, data.userName);
    // }
    // if (template.includes('@@Date')) {
    //   template = template.replace(/@@Date/gi, data.Date);
    // }
    // if (template.includes('@@PDFPwd')) {
    //   template = template.replace(/@@PDFPwd/gi, data.PDFPwd);
    // }
    // if (template.includes('@@sno')) {
    //   template = template.replace(/@@sno/gi, data.sno);
    // }
    // if (template.includes('@@preApprovalWithoutLOA')) {
    //   template = template.replace(/@@preApprovalWithoutLOA/gi, data.preApprovalWithoutLOA);
    // }
    // if (template.includes('@@Name')) {
    //   template = template.replace(/@@Name/gi, data.name);
    // }
    // if (template.includes('@@Password')) {
    //   template = template.replace(/@@Password/gi, data.password);
    // }

    // added by Niranjana //
    // if (template.includes('@@Component')) {
    //   template = template.replace(/@@Component/gi, data.component);
    // }
    // if (template.includes('@@Fees')) {
    //   template = template.replace(/@@Fees/gi, data.fees);
    // }
    // if (template.includes('@@VerificationId')) {
    //   template = template.replace(/@@VerificationId/gi, data.verificationId);
    // }
    // if (template.includes('@@Remarks')) {
    //   template = template.replace(/@@Remarks/gi, data.remarks);
    // }
    // if (template.includes('@@ServiceType')) {
    //   template = template.replace(/@@ServiceType/gi, data.funcEntity);
    // }
    // if (template.includes('@@packageName')) {
    //   template = template.replace(/@@packageName/gi, data.packageName);
    // }
    return template;
  }
  dateCompare(fromDate: string, toDate: string, form: UntypedFormGroup) {
    if (form.controls[fromDate].value && form.controls[toDate].value) {
      if (new Date(form.controls[fromDate].value).setHours(0, 0, 0, 0) <= new Date(form.controls[toDate].value).setHours(0, 0, 0, 0)) {
        form.get(toDate).setErrors(null);
        form.get(toDate).updateValueAndValidity();
      } else {
        form.get(toDate).setErrors({ comparison: true });
      }
    }
  }
  scrollToTop() {
    const elements = document.querySelectorAll('mat-form-field.ng-invalid');
    if (elements.length === 0) {
      const element = document.querySelectorAll('mat-form-field.ng-valid');
      element[0].scrollIntoView(false);
    }
    if (elements.length > 0) {
      elements[0].scrollIntoView(false);
    }
  }
  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  orgInfoScreenFlag(pageinit = false): orgInfoFlags {
    if (pageinit) {
      this.orgnzFlagscr = new orgInfoFlags();
    } else {
      this.orgnzFlagscr.btnAdd = !this.orgnzFlagscr.btnAdd;
      this.orgnzFlagscr.btnResetTbl = !this.orgnzFlagscr.btnResetTbl;
      this.orgnzFlagscr.btnSave = !this.orgnzFlagscr.btnSave;
      this.orgnzFlagscr.btnReset = !this.orgnzFlagscr.btnReset;
      this.orgnzFlagscr.btnBack = !this.orgnzFlagscr.btnBack;
    }
    return this.orgnzFlagscr;
  }
  exportToExcel(dataExcelCols, excelDataList, excelName, designFlag = false, fromDate = null, toDate = null) {
    let tabtext = '<table border="1px">';
    let j = 0;
    const header = dataExcelCols;
    const filteredValue = excelDataList;
    const lines = filteredValue.length;
    let headerColos = '';
    let headerRow = '';
    if (lines > 0) {
      if (excelName === 'Monthly SLA with color code') {
        headerRow = headerRow + '<td bgcolor="#0E4872" colspan="11" style="text-align: center;font-size:15px;color:white">' + 'Monthly SLA Report for the period ' + this.datepipe.transform(fromDate, 'dd-MM-yyyy') + ' to ' + this.datepipe.transform(toDate, 'dd-MM-yyyy') + '</td>';
      }
      header.forEach(h => {
        if (designFlag === true) {
          headerColos = headerColos + '<th bgcolor="#a5d2db" style="font-size:15px;color:black">' + h.header + '</th>';
        } else {
          headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
        }
      });
      if (excelName === 'Monthly SLA with color code') {
        excelName = 'Monthly SLA Report for the period ' + this.datepipe.transform(fromDate, 'dd-MM-yyyy') + ' to ' + this.datepipe.transform(toDate, 'dd-MM-yyyy') + '';

        tabtext = tabtext + '<tr>' + headerRow + '</tr>' + '<tr>' + headerColos + '</tr>';
      } else {
        tabtext = tabtext + '<tr>' + headerColos + '</tr>';
      }

    }
    for (j = 0; j < lines; j++) {
      headerColos = '';
      header.forEach(h => {
        headerColos = headerColos + '<td style="font-size:12px">' + (filteredValue[j][h.field] ? h.field === 'caseInitiationDate' ?
          (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'confirmationReceivedDate' ?
            (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MM/yyyy')) : h.field === 'compInitiationDate' ?
              (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MM/yyyy')) : filteredValue[j]
              [h.field] === true ? 'Yes' : (filteredValue[j][h.field] === false ? 'No' : h.field === 'caseInititationDate' ?
                (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'caseInititationDate' ?
                  (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'caseReceivedDate' ?
                    (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'dob' ?
                      (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'doj' ?
                        (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'requestDate' ?
                          (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'reportSentOn' ?
                            (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'statementFrom' ?
                              (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'statementTo' ?
                                (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'submittedDate' ?
                                  (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'componentInitiationDate' ?
                                    (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'caseDueDate' ?
                                      (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'insuffRaisedDate' ?
                                        (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'insuffClearedDate' ?
                                          (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field === 'dateOfJoining' ?
                                            (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : h.field.includes('Date') ?
                                              (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MM/yyyy hh:mm:ss a')) :
                                              h.field === 'dateOfBirth' ?
                                                (this.datepipe.transform((this.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy')) : filteredValue[j][h.field]) : filteredValue[j][h.field] === 0 ? 0 : 'N/A') + '</td>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    tabtext = tabtext + '</table>';
    tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
    tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
    tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
    const fileName = designFlag === true ? (excelName + '.xlsx') : (excelName + ' List.xlsx');

    // Create a DOM element from the HTML table string
    const parser = new DOMParser();
    const doc = parser.parseFromString(tabtext, 'text/html');
    const table = doc.querySelector('table');

    // Convert HTML table to XLSX worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    for (var i in ws) {
      //console.log(ws[i]);
      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
        // styling for all cells
        font: {
          name: 'Calibri',
          sz: 7
        },
        alignment: {
          vertical: 'bottom',
          horizontal: 'left',
          wrapText: '1',
        },
        border: {
          right: {
            style: 'thin',
            color: '000000',
          },
          left: {
            style: 'thin',
            color: '000000',
          },
          bottom: {
            style: 'thin',
            color: '000000',
          },
          top: {
            style: 'thin',
            color: '000000',
          },
        },

      };
      if (cell.r == 0) {
        // Header
        ws[i].s = {
          border: {
            right: {
              style: 'thin',
              color: '000000',
            },
            left: {
              style: 'thin',
              color: '000000',
            }
          },
          font: {
            name: 'Calibri',
            sz: 9,
            color: { rgb: '00FFFFFF' },
            bold: true
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
            wrapText: '1',
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: 'ff0e4872' },
            bgColor: { rgb: 'ff0e4872' },
          }
        };
      }
    }

    // Convert the worksheet to a Blob
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    this.fixWidth(ws);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout: ArrayBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    const exceldata = new Blob([wbout], { type: 'application/octet-stream' });
    //const exceldata = new Blob([tabtext ], { type: this.EXCEL_TYPE });
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
  private fixWidth(worksheet: XLSX.WorkSheet) {
    const data = XLSX?.utils?.sheet_to_json<any>(worksheet);
    if (Object?.keys && data?.length > 0) {
      const colLengths = Object.keys(data[0]).map((k) => k.toString().length)
      for (const d of data) {
        Object.values(d).forEach((element: any, index) => {
          const length = element.toString().length
          if (colLengths[index] < length) {
            colLengths[index] = (length > 40) ? 40 : length
          }
        })
      }
      worksheet["!cols"] = colLengths.map((l) => {
        return {
          wch: l,
        }
      })
    }
  }
  fitToColumn(arrayOfArray: any) {
    // get maximum character of each column
    return arrayOfArray.map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i] ? a2[i].toString().length : 0)) }));
  }
  maxmDate() {
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  }
  birthDate() {
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
  }
  getDateCaluculationDiff(from, to, dob) {
    if (from.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided' || to.toString().toLowerCase().replace(/\s+/g, '') === 'notprovided') {
      return 'N/A';
    } else {
      let firstDate: any;
      let secondDate: any;
      if (from.toUpperCase().includes('SINCE BIRTH') && to.toUpperCase().includes('TILL DATE')) {
        if (dob) {
          firstDate = moment(dob, 'DD/MM/YYYY');
          secondDate = moment(new Date(new Date()));
        } else {
          return 'Please give Date Of Birth';
        }
      } else {
        if (from.toUpperCase().includes('SINCE BIRTH')) {
          if (dob) {
            firstDate = moment(dob, 'DD/MM/YYYY');
          } else {
            return 'Please give Date Of Birth';
          }
        }
        if (to.toUpperCase().includes('TILL DATE')) {
          secondDate = moment(new Date(new Date()));
        }
        //   if ((from === this.datepipe.transform(from, 'dd/MMM/yyyy' )
        // || to === this.datepipe.transform(from, 'dd/MMM/yyyy'))  || from === this.datepipe.transform(from, 'MM/yyyy' )
        // || to === this.datepipe.transform(from, 'MM/yyyy')) {
        //     firstDate = moment(new Date(this.datepipe.transform(from, 'dd/MMM/yyyy' ||'MM/yyyy')));
        //     secondDate = moment(new Date(this.datepipe.transform(to, 'dd/MMM/yyyy' || 'MM/yyyy')));
        //   } else if (from === this.datepipe.transform(from, 'dd/MM/yyyy' )
        //   || to === this.datepipe.transform(from, 'dd/MM/yyyy')) {
        //     firstDate = moment(new Date(this.datepipe.transform(from, 'dd/MM/yyyy')));
        //     secondDate = moment(new Date(this.datepipe.transform(to, 'dd/MM/yyyy')));
        //   } else  {
        const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
        const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
        const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
        let mapflag = false;
        if ((ddmmyyyyREGEX.test(from) || ddmmyyyyREGEX.test(to))) {
          mapflag = true;
        }
        if (mapflag === true) {
          if ((ddmmyyyyREGEX.test(from))) {
            firstDate = moment(firstDate ? firstDate : from, 'DD/MM/YYYY');
          }
          if ((ddmmyyyyREGEX.test(to))) {
            secondDate = moment(secondDate ? secondDate : to, 'DD/MM/YYYY');
          }
        }
        if ((ddmmmyyyyREGEX.test(from)
          || ddmmmyyyyREGEX.test(to)) || (mmmyyyyREGEX.test(from) || mmmyyyyREGEX.test(to))) {
          if ((ddmmmyyyyREGEX.test(from)) || ((mmmyyyyREGEX.test(from)))) {
            firstDate = moment(new Date(this.datepipe.transform(this.convertDate(firstDate ? firstDate : from),
              'dd/MMM/yyyy')));
          }
          if ((ddmmmyyyyREGEX.test(to)) || ((mmmyyyyREGEX.test(to)))) {
            secondDate = moment(new Date(this.datepipe.transform(this.convertDate(secondDate ? secondDate : to),
              'dd/MMM/yyyy')));
          }
        }
      }
      if (firstDate !== null && secondDate !== null) {
        if ((firstDate && firstDate.isValid() === true) && (secondDate && secondDate.isValid() === true)) {
          // .isValid() === true
          const years = secondDate.diff(firstDate, 'years');

          const months = secondDate.diff(firstDate, 'months') - (years * 12);

          firstDate.add(years, 'years').add(months, 'months');
          const days = secondDate.diff(firstDate, 'days');
          // let dayslist = Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 1000 / 60 / 60 / 24);
          // const months = dayslist / 30;
          let message: any;
          let dayCount = '';
          let monthCount = '';
          let yearCount = '';
          if (days > 0) {
            dayCount = days !== 0 ? days === 1 ? days + 'day' : days + 'days' : '';
          }
          if (years > 0) {
            yearCount = years !== 0 ? years === 1 ? years + 'year' : years + 'Years' : '';
          }
          if (months > 0) {

            monthCount = months !== 0 ? months === 1 ? months + 'month' : months + 'months' : '';
          }
          message = yearCount + ' ' + monthCount + ' ' + dayCount;
          return message;
        } else {
          return 'Give a Same date format for both columns';
        }
      }
    }
  }
  getBrowserVersion() {
    var userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(matchTest[1])) {

      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {

      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);

      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');

    }

    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);

    return matchTest.join(' ');

  }
  getIconsByComponent(component): string {
    if (component) {
      switch (component.toUpperCase()) {
        case this.PAN_CARD:
          return 'icon-pancard';
        case this.EMPLOYMENT_UAN:
          return 'icon-employement';
        case this.ADDRESS:
          return 'icon-address';
        case this.DRUG_TEST:
          return 'icon-drugtest';
        case this.NATIONAL_IDENTITY_CHECK:
          return 'icon-id';
        case this.DIRECTORSHIP:
          return 'icon-employement';
        case this.EMPLOYMENT_HR:
          return 'icon-employement';
        case this.EDUCATION:
          return 'icon-education';
        case this.ONLINE_CRC:
          return 'icon-onlinecrc';
        case this.LICENSE:
          return 'icon-license';
        case this.PASSPORT:
          return 'icon-passport';
        case this.CREDIT_VERIFICATION:
          return 'icon-creditcardverification';
        case this.ADDRESS_GEO:
          return 'icon-address';
        case this.VOTER_ID:
          return 'icon-voterid';
        case this.COMPANY_SITE_VISIT:
          return 'icon-companyvisit';
        case this.SOCIAL_MEDIA:
          return 'icon-referencecheck';
        case this.REFERENCE_CHECK:
          return 'icon-referencecheck';
        case this.REFERENCE_SELF_EMPLOYED:
          return 'icon-referencecheck';
        case this.EMPLOYMENT_SUPERVISOR:
          return 'icon-employement';
        case this.CRIMINAL_DATABASE:
          return 'icon-criminaldb';
        case this.OFAC_SDN:
          return 'icon-ofacandsdn';
        case this.ONLINE_CRC_INTERNAL:
          return 'icon-onlinecrc';
        case this.CRIMINAL_CHECK_PCC1:
          return 'icon-criminalcheck';
        case this.CRIMINAL_CHECK_PCC2:
          return 'icon-criminalcheck';
        case this.ONLINE_CRC:
          return 'icon-onlinecrc';
        case this.CRIMINAL_COURT_RECORD:
          return 'icon-criminalcourt';
        case this.CRIMINAL_CHECK_PCC3:
          return 'icon-criminalcheck';
        case this.CRIMINAL_CHECK_PCC3E:
          return 'icon-criminalcheck';
        case this.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
          return 'icon-pancard';
        case this.EMPHR_EMPSUP:
          return 'icon-employement';
        case this.GAP_VERIFICATION:
          return 'icon-verification';
        case this.JUDIS_COURT_RECORD:
          return 'icon-judiscourtrecord';
        case this.EMERGENCY_CONTACT_VERIFICATION:
          return 'icon-emergencycontact';
        case this.CV_VALIDATION:
          return 'icon-cvvalidation';
        case this.BANK_STATEMENT:
          return 'icon-bankstatement';
        case this.SSN_TRACE:
          return 'icon-ssntrace';
        case this.NATIONWIDE_SEX_OFFENDER_5_YEARS:
          return 'icon-sexoffender';
        case this.NDOT_DRUG_SCREEN:
          return 'icon-drugScreening';
        case this.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS:
          return 'icon-criminalcheck';
        case this.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS:
          return 'icon-criminalcourt';
        case this.CURRENT_EMPLOYMENT_HR:
          return 'icon-employement';
        case this.PREVIOUS_EMPLOYMENT_HR:
          return 'icon-employement';
        case this.DATABASE_CONDUCT:
          return 'icon-criminaldb';
        case this.DATABASE_ADVERSE_MEDIA:
          return 'icon-criminaldb';
      }
    } else {
      return '';
    }
  }

  getCompsave(component): string {
    if (component) {
      switch (component.toUpperCase()) {
        case this.TENNESSEE:
          return (this.saveType = "SaveTENNESSEEComponent");
        case this.FDA:
          return (this.saveType = "SaveFDAComponent");
        case this.PAN_CARD:
          return (this.saveType = "SavePAN");
        case this.EMPLOYMENT_UAN:
          return (this.saveType = "SaveUANComponent");
        case this.OIG:
          return (this.saveType = "SaveOigComponent");
        case this.MHCP:
          return (this.saveType = "SaveMhcpComponent");
        case this.NSR:
          return (this.saveType = "SaveNSRComponent");

        case this.ADDRESS:
          return (this.saveType = "SaveAddress");
        case this.DRUG_TEST:
          return (this.saveType = "SaveDrugTestComponent");
        case this.NATIONAL_IDENTITY_CHECK:
          return (this.saveType = "SaveNICComponent");
        case this.DIRECTORSHIP:
          return (this.saveType = "SaveDirectorship");
        case this.EMPLOYMENT_HR:
          return (this.saveType = "SaveEmployee");
        //iNTERNATIONCOM
        case this.EMPLOYMENT_INTERNATIONAL:
          return (this.saveType = "SaveEmployeeInternational");
        case this.EDUCATION_INTERNATIONAL:
          return (this.saveType = "SaveEducationInternational");
        case this.EDUCATION:
          return (this.saveType = "SaveEducation");
        case this.CriminalCheckGap:
          return (this.saveType = "SaveCriminalRecordCheckComponent");
        case this.ONLINE_CRC:
          return (this.saveType = "SaveCriminalRecordCheckComponent");
        case this.LICENSE:
          return (this.saveType = "SaveLicense");
        case this.PASSPORT:
          return (this.saveType = "SavePassportComponent");
        case this.CREDIT_VERIFICATION:
          return (this.saveType = "SaveCreditVerification");
        case this.ADDRESS_GEO:
          return (this.saveType = "SaveAddress");
        case this.VOTER_ID:
          return (this.saveType = "SaveVoterId");
        case this.COMPANY_SITE_VISIT:
          return (this.saveType = "SaveCompanySiteVisitComponent");
        case this.SOCIAL_MEDIA:
          return (this.saveType = "SaveSocialMedia");
        case this.REFERENCE_CHECK:
          return (this.saveType = "SaveReferenceCheck");
        case this.REFERENCE_SELF_EMPLOYED:
          return (this.saveType = "SaveReferenceSelfEmployedComponent");
        case this.EMPLOYMENT_SUPERVISOR:
          return (this.saveType = "SaveEmploymentSupervisor");
        case this.CRIMINAL_DATABASE:
          return (this.saveType = "SaveCriminalDatabaseandOFACSDNComponent");
        case this.OFAC_SDN:
          return (this.saveType = "SaveCriminalDatabaseandOFACSDNComponent");
        case this.ONLINE_CRC_INTERNAL:
          return (this.saveType = "SaveCriminalRecordCheckComponent");
        case this.CRIMINAL_CHECK_PCC1:
          return (this.saveType = "SaveCriminalCheckPCC1andPCC2Component");
        case this.CRIMINAL_CHECK_PCC2:
          return (this.saveType = "SaveCriminalCheckPCC1andPCC2Component");

        case this.CRIMINAL_COURT_RECORD:
          return (this.saveType = "SaveCriminalRecordCheckComponent");
        case this.CRIMINAL_CHECK_PCC3:
          return (this.saveType = "SaveCriminalCheckPCC3andPCC3EComponent");
        case this.CRIMINAL_CHECK_PCC3E:
          return (this.saveType = "SaveCriminalCheckPCC3andPCC3EComponent");
        case this.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
          return (this.saveType = "SavePanIndiaOCRV");
        case this.EMPHR_EMPSUP:
          return (this.saveType = "SaveEmploymentHRandSupervisor");
        case this.GAP_VERIFICATION:
          return (this.saveType = "SaveGapVerificationComponent");
        case this.JUDIS_COURT_RECORD:
          return (this.saveType = "SaveJudisCourtRecordComponent");
        case this.EMERGENCY_CONTACT_VERIFICATION:
          return (this.saveType = "SaveEmergencyContactVerficationComponent");
        case this.CV_VALIDATION:
          return (this.saveType = "SaveCVValidation");
        case this.BANK_STATEMENT:
          return (this.saveType = "SaveBankStatement");
        case this.SSN_TRACE:
          return (this.saveType = "SaveSsn");
        case this.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS:
          return (this.saveType = "SaveAbroad");
        case this.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS:
          return (this.saveType = "SaveAbroad");

        case this.NATIONWIDE_SEX_OFFENDER:
        case this.NATIONWIDE_SEX_OFFENDER_5_YEARS:
        case this.CRIMINAL_SEARCH_STATEWIDE_10_YEARS:
        case this.CRIMINAL_FEDERAL_NATIONWIDE_10_YEARS:
        case this.FEDERAL_DISTRICT_SEARCH_10_YEARS:
        case this.CRIMINAL_FELONY_MISDEMEANOR_10_YEARS:
        case this.NATIONAL_CRIMINAL_DATABASE_SEARCH_10_YEARS:
        case this.NATIONAL_CRIMINAL_LOCATOR:
        case this.CRIMINAL_SEARCH_OVERSEAS:
        case this.CREDIT_OVERSEAS:
        case this.MVR:
          return (this.saveType = "SaveNationwideSexOffender");

        case this.NDOT_DRUG_SCREEN:
          return (this.saveType = "SaveNdotComponent");
        case this.FACISLevel1:
          return (this.saveType = "SaveFAC1");
        case this.FACISLevel2:
          return (this.saveType = "SaveFAC2");
        case this.FACISLevel3:
          return (this.saveType = "SaveFAC3");
        case this.FACIS1M:
          return (this.saveType = "SaveFACIS1M");
        case this.EMPHR_EMPSUP:
          return (this.saveType = "SaveEmploymentHRandSupervisor");
        case this.GSA:
          return (this.saveType = "SaveGsa");
        //For VTS2-2023-CRT-0131 - split emp -By Megala
        case this.CURRENT_EMPLOYMENT_HR:
          return (this.saveType = "SaveEmployee");
        case this.PREVIOUS_EMPLOYMENT_HR:
          return (this.saveType = "SaveEmployee");
        case this.DATABASE_CONDUCT:
          return (this.saveType = "SaveCriminalContactandAdverseMediaComponent");
        case this.DATABASE_ADVERSE_MEDIA:
          return (this.saveType = "SaveCriminalContactandAdverseMediaComponent");
      }
    } else {
      return "";
    }
  }
  getEducationType() {

    this.getEducationTypeDetails().subscribe(res => {
      if (res) {
        this.educationType = res.sort((a, b) => a.displayOrder - b.displayOrder);
      }
    })
  }

  dateCompareFile(fromDate: string, toDate: string, index?: number, compId?: number) {
    return (form: any): { [key: string]: any } => {
      let startdate: any;
      let enddate: any;
      const valstring = ["NOT PROVIDED"]
      form = form.get('UntypedFormGroup') ? form.get('UntypedFormGroup') : form;
      const validationString = form.get('validationString')?.value != null ? form.get('validationString')?.value : valstring;

      if (form.controls[fromDate].value && form.controls[toDate].value) {
        // if (form.controls[fromDate].value !== 'NOT PROVIDED') {
        if ((form.controls[fromDate].valid && !validationString.some(s => s ===
          (form.controls[fromDate].value ? form.controls[fromDate].value.toUpperCase() : form.controls[fromDate].value)))) {
          startdate = this.convertDate(form.controls[fromDate].value);
          if ((startdate !== 'Invalid Date' && Object.prototype.toString.call(startdate) === '[object Date]')) {
            // if (form.controls[toDate].value !== 'NOT PROVIDED') {
            if ((form.controls[toDate].valid || form.controls[toDate].errors.comparison === true) &&
              !validationString.some(s => s === form.controls[toDate].value)) {
              enddate = this.convertDate(form.controls[toDate].value);

              if (enddate !== 'Invalid Date' && Object.prototype.toString.call(enddate) === '[object Date]') {
                // it is a date
                if (isNaN(startdate.getTime())) {  // d.valueOf() could also work
                  // date is not valid
                  form.get(toDate).setErrors({ date: { invalidPattern: true } });
                  return { date: { invalidPattern: true } };
                } else {
                  // date is valid
                  if (startdate.setHours(0, 0, 0, 0) <= enddate.setHours(0, 0, 0, 0)) {
                    if (index > 0 && compId > 0) {
                      let compArr: any[] = [];
                      const formRawValue = this.fileSubmissionCom.getRawValue();
                      compArr = formRawValue.screeningComponent.find(x => x.compId ===
                        compId).component;
                      for (let i = index; i >= 0; i--) {
                        if (i > 0) {
                          const validation = compArr[i - 1].compRef['validationString'];
                          const validstring = validation ? validation.some(s => s === compArr[i - 1].compRef[fromDate]) : '';
                          if (!validstring && compArr[i - 1].compRef[fromDate]) {
                            if (i > 0 && this.convertDate(compArr[i - 1].compRef[fromDate]) <=
                              this.convertDate(compArr[index].compRef[fromDate])) {
                              form.get(fromDate).setErrors(null);
                              form.get(fromDate).clearValidators();
                              form.get(fromDate).setErrors({ date: { overLap: true } });
                              return { date: { overLap: true } };
                            } else {
                              if (!isNaN(this.convertDate(compArr[i - 1].compRef[fromDate]).getTime())) {
                                form.get(fromDate).setErrors(null);
                                form.get(fromDate).clearValidators();
                                return {};
                              }
                            }
                          }
                        }

                      }
                    } else {
                      form.get(toDate).setErrors(null);
                      form.get(toDate).clearValidators();
                      form.get(fromDate).clearValidators();

                      return {};
                    }
                    form.get(toDate).setErrors({ comparison: false });
                    return { comparison: false };
                  } else {
                    form.get(toDate).setErrors({ comparison: true });
                    form.get(toDate).markAllAsTouched();
                    return { comparison: true };
                  }
                }
              } else {
                // not a date
                form.get(toDate).setErrors({ date: { invalidPattern: true } });
                form.get(toDate).markAllAsTouched();
                return { date: { invalidPattern: true } };
              }

            }
          } else {
            if (form.get(fromDate).value !== 'SINCE BIRTH') {
              form.get(fromDate).setErrors({ date: { invalidPattern: true } });
              return { date: { invalidPattern: true, overLap: null } };
            } else {
              form.get(fromDate).setErrors(null);
              return {};
            }
          }
        }
      } else if (index > 0 && compId > 0 && this.convertDate(form.controls[fromDate].value) !== 'Invalid date' &&
        Object.prototype.toString.call(this.convertDate(form.controls[fromDate].value)) === '[object Date]'
      ) {
        if (form.get(fromDate).value) {
          let compArr: any[] = [];
          const formRawValue = this.fileSubmissionCom.getRawValue();
          compArr = formRawValue.screeningComponent.find(x => x.compId ===
            compId).component;
          for (let i = index; i >= 0; i--) {
            if (i > 0) {
              const validation = compArr[i - 1].compRef['validationString'];
              const validstring = validation.some(s => s === compArr[i - 1].compRef[fromDate]);
              if (!validstring && compArr[i - 1].compRef[fromDate]) {
                if (i > 0 && this.convertDate(compArr[i - 1].compRef[fromDate]) <=
                  this.convertDate(compArr[index].compRef[fromDate])) {
                  form.get(fromDate).setErrors({ date: { overLap: true } });
                  form.get(fromDate).markAllAsTouched();
                  return { date: { overLap: true } };
                } else {
                  if (!isNaN(this.convertDate(compArr[i - 1].compRef[fromDate]).getTime())) {
                    form.get(fromDate).setErrors(null);
                    return {};
                  }
                }
              }
            }
          }
        }
      }

    };
  }
}
interface Site {
  siteId: number;
  siteName: string;
  siteNo: string;
}