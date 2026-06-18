import { clientNoFeeApprovalVm } from 'src/app/client-entry/agent-entry-master/component-entry/component-entry.component';
import { CommonAddress } from './common-address';

export class AgentDetails {
    agentId: number;
    agentName: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zipCode?: number;
    active?: boolean;
    emailId: string;
    contactPerson: string;
    phoneNumber: string;
    dssiContact: string;
    dssiToEmailId: string;
    dssiCcEmailId: string;
    dssiOwner?: number;
    firstName: string;
    lastName: string;
    accessType: string;
    addressOption?: number;
    countyId?: number;
    stateId?: number;
}

export class ClientMaster {
    country: Country[];
    state: State[];
    billingCycle: LookUpValue[];
    billingRule: LookUpValue[];
    billingType: LookUpValue[];
    finalReportType: LookUpValue[];
    dssiOwner: DssiOwner[];
    accountManager: AccountManager[];
    colorStatus: LookUpValue[];
    signatureType: LookUpValue[];
    logoType: LookUpValue[];
}

export class ClientInstruction {
    instructionType: LookUpValue[];
    component: ComponentDetails[];
}

export class Instruct {
    instructionType: string;
    componentId: any;  // number
    componentName: string;
    instruction: string;
}

export class AgreementDetails {
    agreementAvailability: LookUpValue[];
    typeOfAgreement: LookUpValue[];
    autoRenewal: LookUpValue[];
    reminderforRenewal: LookUpValue[];
}

export class ClientMailID {
    emailCategoryType: LookUpValue[];
    typeOfAgreement: LookUpValue[];
    reportType: LookUpValue[];
    sendType: LookUpValue[];
}

export class SaveClientEntry {
    loggedIn: number;
    clientEntry: ClientEntry;
    componentEntry: ComponentEntry[];
    clientInstruction: ClientInstructions[];
    clientAgreement: ClientAgreement;
    clientEmailConfig: ClientEmailConfig[]; /*Future Use---20-08-2019*/
    clientAgreementDocument: AgreementDocument[] = [];
    clientFeeDocument: ClientFeeDocumentVm[] = [];
    clientFeeApprovalEmail: ClientNoFeeApprovalVm[] = [];
    clientFeePreApprovalEmail: clientFeeApproval[] = [];

    clientTATDocument: ClientTATDocumentVm[] = [];
    clientTATApprovalEmail: ClientTATNoApprovalEmail[] = [];
    clientTATPreApprovalEmail: ClientTATApprovalEmail[] = [];
    reviewFlag = false;

}


export class ClientEntry {
    clientId: number;
    indianClientFlag: boolean;
    clientName: string;
    address: CommonAddress;
    // address1: string;
    // address2: string;
    // address3: string;
    // city: string;
    // stateId: number;
    // countryId: number;
    // zipCode: string;
    createdDate?: Date;
    createdBy?: number;
    modifyBy?: number;
    modifiedDate?: Date;
    active?: boolean;
    emailId: string;
    contactPerson: string;
    phoneNumber: string;
    isEmail?: boolean;
    dssiContact: string;
    dssiToEmailId: string;
    dssiCcEmailId: string;
    // dssiOwner?: number;
    accessType: string;
    // addressOption?: number;
    cancel?: boolean;
    refNo: number;
    ruleId?: number;
    bcId?: number;
    pan: string;
    serviceTaxNo: string;
    mobileNo: string;
    // tatCount?: number;
    tatRuleId?: number;
    billingTypeId?: number;
    cgstin: string;
    siteCreationFlag: boolean;
    clientStatus?: boolean;
    serviceTaxFlag?: boolean;
    dataRetentionPolicyDays?: number;
    applicantIdColumnName: string;
    finalReportTypeId?: number;
    annexureLinkFlag: boolean;
    refNoManuallyFlag: boolean;
    displaySiteNameFlag: boolean;
    clientAccountManagerId?: number;
    chargeCodeFlag: boolean;
    // caseCreationFlag?: boolean;
    optionToCreateInvitation: boolean;
    clientActiveDate: Date;
    clientDeActiveDate: Date;
    clientContact: LookUpValue[];
    ownerContact: LookUpValue[];
    completeFlag: boolean;
    paymentFlag: boolean;
    contactRemarkFlag: boolean;
    clientColorStatus: LookUpValue[];
    clientLogo: ClientLogoTransVm[];
    approvalLimitFlag: boolean;
    formatFlag: boolean;
    caseByPassFlag: boolean;
    caseDatesFlag: boolean;
    calendarDaysTATFlag: boolean;
    caseCountryFlag: boolean;
    caseTypeFlag: boolean;
    finalReportTitle: string
}
export class ClientLogoTransVm {
    logoTransId: number;
    logoDocTransId: number;
    logoLookupId: number;
    isSignature: boolean;
    signatureLookupId: number;
    fileName: string;
    filePath: string;
    document;
    active: boolean;
    loggedIn: number;
}
// class CommonAddress {
//     addressId: number;
//     addTypeLookupId: number;
//     addLine1: string;
//     addLine2: string;
//     addLine3: string;
//     cityId: number;
//     city: number;
//     stateId: number;
//     countryId: number;
//     districtId: number;
//     postalCode: string;
//     place: string;
//     active: boolean;
//     createdUserId: number;
// }

export class ComponentEntry {
    clientComponentId?: number;
    componentType: string;
    // componentValue: string;
    componentDesc: string;
    fees?: number;  // double
    tat: number;  // byte ?
    componentId: number;
    clientId: number;
    active: boolean;
    isSubComponent: boolean;
    effectiveDate: Date;
    subCompId: number; // myself
    clientsubid: number;
    clientFeeApprovalFlag: boolean;
    // tslint:disable-next-line: no-use-before-declare
    clientFeesApproval: ClientFeesApprovalVm = new ClientFeesApprovalVm();
    clientTATApproval: ClientTATApprovalVm = new ClientTATApprovalVm();
    subComponentEntry: SubComponent[] = [];
    clientFeeDocument: ClientFeeDocumentVm[] = [];
    clientTATDocument: ClientTATDocumentVm[] = [];
    feeDisableFlag: boolean;
    tatDisableFlag: boolean;
    deleteDisableFlag: boolean;
    compEditFlag: boolean;
    currencyId: number;
}
// tslint:disable-next-line:class-name
export class componentNew {
    clientComponentId?: number;
    componentType: string;
    componentDesc: string;
    fees?: number;  // double
    tat: number;  // byte ?
    componentId: number;
    clientId: number;
    effectiveDate: Date;
    isSubComponent: boolean;
    subComponentId?: number;
}
// tslint:disable-next-line:class-name
export class clientFeeApproval {
    componentFeeId: number;
    clientComponentId: number;
    componentId: number;
    currentAmount: number;
    requestedAmount: number;
    requestedEffectiveDate: Date;
    clientApprovalFlag: boolean;
    msp: number;
    nrp: number;
    componentType: string;
    componentDesc: string;
    subCompId: number;
    fileName: any;
    comments: string;
    validationType: string;
}
export class ClientFeesApprovalVm {
    componentFeeId: number;
    clientComponentId: number;
    componentId: number;
    currentAmount: number;
    requestedAmount: number;
    requestedEffectiveDate: Date;
    requestorComments: string;
    clientApprovalFlag: boolean;
    msp: number;
    nrp: number;
    componentType: string;
    componentDesc: string;
    clientFeeDocument: ClientFeeDocumentVm[] = [];
    subComponentId: number;
    // approverComments: string;
    // status: string;
    // createdBy: number;
    // createdDate: Date;
    // approvedBy: number;
    // approvedDate: Date;
    // cancel: string;
    // tat: number;
    // type: string;
    // reportDesc: string;
}

export class ClientFeeDocumentVm {
    compFeeDocId: number;
    approvalFeeId: number;
    fileName: string;
    subComponentId: number;
    componentId: number;
    document;
    type: string;
}
export class ClientTATApprovalVm {
    componentTATId: number;
    clientComponentId: number;
    componentId: number;
    subComponentId: number;
    requestedTAT: number;
    originalTAT: number;
    requestedEffectiveDate: Date;
    requestorComments: string;
    clientApprovalFlag: boolean;
    clientTATDocument: ClientTATDocumentVm[] = [];
}

export class ClientTATDocumentVm {
    compTATDocId: number;
    approvalTATId: number;
    fileName: string;
    subComponentId: number;
    componentId: number;
    document;
    type: string;
}
export class SubComponent {
    subComponentId?: number;
    clientComponentId: number;
    clientSubComponentId: number;
    serviceId: number;
    fees: number;
    tat?: number;
    subReportType: string;
    subReportDesc: string;
    active?: boolean;
    msp?: number;
    nrp?: number;
    feeDisableFlag: boolean;
    tatDisableFlag: boolean;
    clientFeesApproval: ClientFeesApprovalVm = new ClientFeesApprovalVm();
    clientTATApproval: ClientTATApprovalVm = new ClientTATApprovalVm();
    compEditFlag: boolean;
    currencyId: number;
}


export class ComponentDetails {
    serviceId: number;
    rptDesc: string;
    displayOrder?: number;
    noOfAnnexure?: number;
    rptType: string;
    cancel: string;
    isSubComponent?: boolean;
    msp?: number;
    nrp?: number;
    archive?: boolean;
    clientComponentId?: number;
    folderPath: string;
    forApproval: string;
    filePath: string;
    checked: string;
    approvalRequiredStatus: string;
    emailApproval: string;
    tat: string;
    subComponent: [];
    abroadCompFlag: boolean;
}

export class ClientInstructions {
    clientPolicyId: number;
    clientId: number;
    componentId: number;
    reportType: string;
    instructionTypeId: number;
    instruction: string;
    createdBy: number;
    createdDate: Date;
    updatedBy: number;
    updatedDate: Date;
    active: boolean;
    lookUpName: string;
    rptType: string;
}

export class ClientAgreement {
    clientId: number;
    clientName: string;
    agreementAvailabilityFlag: boolean;
    approvalDate: Date;
    approvalStatus: string;
    typeOfAgreement: number;
    remarks: string;
    dateOfAgreement: Date;
    validity: string;
    autoRenewal: boolean;
    dateOfExpiry: Date;
    reasonofNonAvailability: string;
    fileName: string;
    createdBy: number;
    clientStatus: boolean;
    createdDate: Date;
    reminder: number;
    autoRenewalPeriod: number;
    agreementName: string;
    reminderName: string;
    agreementApprovalFlag: boolean;
}


export class ClientEmailConfig1 {
    clientEmailId: number;
    clientId: number;
    emailCategoryType: string;
    emailDestType: string;
    emailId: string;
    mailNotification: boolean;
    createdBy: number;
    createdDate: Date;
    reportLookupId: string;
    modifiedBy: number;
    modifiedDate: Date;
}


export class ClientEmailConfig {
    // clientEmailId: number;
    // clientId: number;
    // categoryName: string;
    // typeName: string;
    // categoryLookupId: number;
    // emailLookupId: number;
    // emailId: string;
    // mailNotification: boolean;
    // createdBy: number;
    // createdDate: Date;
    // reportLookupId: string;
    // modifiedBy: number;
    // modifiedDate: Date;
    // reportName: string;

    notifyId: number;
    clientId: number;
    categoryLookupId: number;
    reportLookupId: string;
    sendTypeLookupId: number;
    mailNotification: boolean;
    active: boolean;
    commonEmailDet: CommonEmailVm [] = [];
    categoryName: string;
    reportName: string;
    sendTypeName: string;
}
export class CommonEmailVm {
    transContactId: number;
    destLookupId: number;
    contactId: number;
    contactData: string;
    active: boolean;
    destName: string;
    lookupId: number;
}

export class AgreementDocument {
    agreementDocId: number;
    fileName: string;
    document;
    type: string;
}

class Country {
    countryId: number;
    country: string;
    specificInfo: string;
    phoneCode: string;
}

class State {
    stateId: number;
    countryId: number;
    stateName: string;
    specificInfo: string;
    nStateNo?: number;
}

class BillingCode {
    bcid: number;
    billingTransaction: string;
    createdBy?: number;
    createdDate?: Date;
    updatedBy?: number;
    updatedDate?: Date;
    cancel?: boolean;
}

class BillingRule {
    ruleId: number;
    rule: string;
    ruleType: string;
    cancel?: boolean;
    availableRule?: number;
}

class LookUpValue {
    contactId: number;
    lookUpCatId: number;
    lookUpId: number;
    lookUpName: string;
    lookUpValue: string;
}

class DssiOwner {
    userId: number;
    firstName: string;
    lastName: string;
    fullName: string;
    departmentID: number;
}

class AccountManager {
    userId: number;
    firstName: string;
    lastName: string;
    departmentId: number;
}
export class AccessClient {
    loggedIn: number;
    clientId: [];
}
// tslint:disable-next-line:class-name
export class ClientNoFeeApprovalVm {
    loggedIn: number;
    clientComponentId: number;
    componentId: number;
    currentAmount: number;
    requestedAmount: number;
    clientApprovalFlag: boolean;
    msp: number;
    nrp: number;
    componentType: string;
    componentDesc: string;
    subCompId: number;
    validationType: string;
    comments: string;
}

export class ClientTATApprovalEmail {
    clientComponentId: number;
    componentId: number;
    subCompId: number;
    originalTAT: number;
    requestedTAT: number;
    componentType: string;
    componentDesc: string;
    fileName: string;
    // validationType: string;
    comments: string;
}
export class ClientTATNoApprovalEmail {
    // componentTATId: number;
    clientComponentId: number;
    componentId: number;
    subCompId: number;
    originalTAT: number;
    requestedTAT: number;
    requestedEffectiveDate: Date;
    comments: string;
    clientApprovalFlag: boolean;
    componentType: string;
    componentDesc: string;
    // validationType: string;
}
export class ClientName {
    clientId: number;
    clientName: string;
}
export class PackageCheck{
    packageId: number;
    packageName: string;
    }