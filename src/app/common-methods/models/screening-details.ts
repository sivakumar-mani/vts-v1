import { CommonAddress } from './common-address';
import { GapReasonComponent } from 'src/app/screening/DynamicComponents/gap-reason/gap-reason.component';

export class ScreeningDetails {
  loggedIn: number;
  candidate: ScreeningCandidate;
  screening: ClientDetails;
  screeningComponent: ScreeningComponent[] = [];
  document: ScreeningDocument[] = [];
  qcRejectFlag: boolean;
  preQCRejectApproveFlag: boolean;
  applicantId: number;
  screeningCaseComponent: CaseComponent[] = [];
  gapReason: ScreeningGapReason[] = [];
  invitationFlag: boolean;
  ctsFlag: boolean;
  educationDet: any[] = [];
  employerDet: any[] = [];
  bulkCaseFlag: boolean;
  teamName: string;
  pcC3ECount: number;
  directAppAddressFlag: boolean;
}

export class ScreeningCandidate {
  document: ScreeningDocument[] = [];
  infoceptDocument: ScreeningDocument[] = [];
  clientBulkCaseDocument: ScreeningDocument[] = [];
  caseInititationDate: Date;
  candidateId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  candidateAliasId: number;
  aliasFirstName: string;
  aliasMiddleName: string;
  aliasLastName: string;
  active: boolean;
  fatherName: string;
  phoneNo: string;
  countryId: number;
  alternativeContactNo: string;
  alternativeCountryId: number;
  email: string;
  loadocumentHtml: string;
  address: CommonAddress;
  iagreeFlag: boolean;
  consentSignature: string;
  paymentBeforeCandidateFlag?: boolean;
  maritalStatusLookupId: number;
  spouseName: string;
  uan?: any;
  bestVisitAddress: string;
  periodOfStay: string;
  periodOfStayTo: string;
  ssnFlag: boolean;
}
export class ClientDetails {
  screeningId: number;
  candidateId: number;
  applicantId: string;
  clientId: number;
  clientRefNo: string;
  caseReceivedDate: Date;
  caseInititationDate: Date;
  casePeriorityId: number;
  clientCustomFields: CustomFields[] = [];
  siteId: number;
  urlName: string;
  clientName: string;
  caseStatusId: number;
  flag: boolean;
  chargeCode: string;
  chargeCodeFlag: boolean;
  CaseComponent: CaseComponent[] = [];
  scopeByPassFlag: boolean;
  caseNo: number;
  directorshipPANMandatory: any;
}
export class CaseComponent {
  caseComponentId: number;
  compId: number;
  compName: string;
  noOfComponent: number;
  subCompFlag: boolean;
  active: boolean;
  caseSubComponent: CaseSubComponent[] = [];
}
export class CaseSubComponent {
  caseSubCompId: number;
  subCompId: number;
  subCompName: number;
  noOfComponent: number;
  maxNoOfComp: number;
  active: boolean;
}

export class CustomFields {
  clientCustomFieldId: number;
  fieldName: string;
  fieldType: string;
  fieldValue: string;
  mandatoryFlag: boolean;
  screeningClientCustomFieldId: number;
}
export class ScreeningComponent {
  compId: number;
  component: Component[] = [];
  criminalCheckCount: number;
}
export class Component {
  active: boolean;
  preQCApproveFlag: boolean;
  preQCRejectFlag: boolean;
  reOpenFlag : boolean;
  submittedFlag: boolean;
  rejectComments: string;
  qcRejectComments: string;
  compType: string;
  screeningComponentInfo: ScreeningComponentInfo;
  gapDetails: any;
  compRef: any;
  applicationId: number;
  loginId: number;
  compRefDetail: any;
  criminalCheckCount: number;
  screeningInsufficiency: ScreeningInsufficiency;
  miscQuestion: MiscQuestion[] = [];
  addedByCandidateFlag: boolean;
  scopeByPassFlag: boolean;
  componentCustomFields: CustomFields;
  periodOfStayAddress: any;
  //employeeDaAddress: any;
}
export class MiscQuestion {
  miscId: number;
  miscQuestion: string;
  miscAnswer: string;
}
export class ScreeningComponentInfo {
  screeningCompId: number;
  screeningId: number;
  subCompId: number;
  compId: number;
  vendorId: number;
  siteId: number;
  caseNo: number;
  urlName: string;
  requestedDate: Date;
  statusModifiedDate: Date;
  tatDays: number;
  screenStatusId: number;
  screeningStatusId: number;
  priorityId: number;
  caseStatusId: number;
  insuffRaisedFlag: boolean;
  deqcFlag: boolean;
  notApplicableFlag: boolean;
  componentDocument: ScreeningDocument[] = [];
  remark: string;
  currencyId: number;
  ownerId: number;
  compIndex: number;
  insuffRemark: string[] = [];
  insuffRaiseRemark: string[] = [];
  invitationFlag: boolean;
  qcRejectFlag: boolean;
  countryTypeLookUpId: number;
  caseTypeLookUpId: number;
  verificationRejectFlag: boolean;
  forResearchRejectFlag: boolean;
  subCheckFlag: boolean;
  screeningComponentInfo: any;
  clientScreeningId: number;
  clientApprovalFlag: boolean;
  compInitiationDate: Date;
  scopeByPassFlag: boolean;
  reportSource: string;
  driectAppIndex: number;
  reOpenFlag: boolean;
  preQCRejectApproveFlag: boolean;
  verificationModeId: number;
  dateOfVerification: Date;


}
export class ScreeningDocument {
  screeningDocId: number;
  fileName: string;
  document;
  docName: any;
  filePath: string;
  docTypeId: number;
  docSubTypeId: number;
  responseConfirmationId: number;
  insuffDocFlag: boolean;
  cvDocId : number;
}
export class ScreeningInsufficiency {
  insufficiencyId: number;
  screeningStatusId: number;
  screeningCompId: number;
  statusLookupId: number;
  levelLookupId: number;
  requiredLookupId: number;
  raisedDate: Date;
  clearedDate: Date;
  insuffDetail: InsuffDetail;
  insuffDocument: InsuffDocument[] = [];
  createdUserId: number;
}
export class InsuffDetail {
  insuffDetailId: number;
  insufficiencyId: number;
  insuffDate: Date;
  comments: string;
  statusLookupId: number;
  createdUserId: number;
}
export class InsuffDocument {
  insuffDocId: number;
  insuffDocTransId: number;
  componentId: number;
  description: string;
  createdUserId: number;
}
export class PreQCRejectVm {
  screeningId: number;
  screeningCompId: number;
  comments: string;
  loggedIn: number;
  type: string;
}
export class CandidateAddedComponent {
  userId: number;
  compId: number;
  subCompFlag: boolean;
  subCompId: number;
  type: string;
  screeningCompId: number;
  caseNo: number;
}
export class ScreeningAbroad {
  clientId: number;
  siteId: number;
  country: string;
  candidateId: number;
  refNo: string;
  compId: number;
  statusId: number;
  fee: number;
  informationSource: string;
  location: string;
  completedDate: Date;
  colorCodeId: number;
  clientReviewFlag: boolean;
  document: ScreeningDocument[] = [];
  loggedIn: number;
}

export class ScreeningGapReason {
  GapReasonId: number;
  screeningId: number;
  candidateName: string;
  typeLookupId: number;
  remarks: string;
  reasonFlag: boolean;
  loggedIn: number;
  gapTypeName: string;
  reasonDoument: ScreeningDocument[] = [];
}
