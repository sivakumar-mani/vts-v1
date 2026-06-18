import { UntypedFormGroup } from '@angular/forms';
import { UserData } from './user';

export class CaseCreationView {
    screeningOwnerId: string;
    workFlow: string;
    LOANotAvailable: boolean;
    BGVNotAvailable: boolean;
    userId: number;
    caseStatus: string;
    deptId: number;
    teamId: number;
    subTeamId: number;
    teamName: string;
    subTeamName: string;
    applicationId: number;
    clientId: string[];
    loginUserDetVm: UserData;
}


export class SaveScopeCreationVm {
    caseNo: number;
    lOANotAvailable: boolean;
    bGVNotAvailable: boolean;
    PreApproval: boolean;
    packageId: number;
    remarks: string;
    autoAssign: boolean;
    loggedIn: number;
    deptId: number;
    teamId: number;
    action: string;
    stopCheckFlag: boolean;
    compReceivedDate: Date;
    compInitiationDate: Date;
    caseComponent: CaseComponentVm[] = [];
    caseDocument: CaseDocumentVm[] = [];
}

export class CaseComponentVm {
    caseComponentId: number;
    compId: number;
    compName: string;
    active: boolean;
    componentType: string;
    noOfComponent: number;
    subCompFlag: boolean;
    subCompName: string;
    maxNoOfComp: number;
    minNoofComp:number;
    abroadCompFlag: boolean;
    caseSubComponent: CaseSubComponentVm[] = [];
    type: string;
    currencyId: number;
    currencyType: string;
    price: number;
    subCheckFlag: boolean;
    compReceivedDate: Date;
    compInitiationDate: Date;
    daCompValidYear:any;
    daCompValidationFlag: boolean;
}

export class CaseDocumentVm {
    caseDocumentId: number;
    fileName: string;
    docType: string;
    document;
}

export class CaseSubComponentVm {
    caseSubCompId: number;
    subCompId: number;
    subCompName: string;
    noOfComponent: number;
    active: boolean;
    maxNoOfComp: number;
    type: string;
    currencyId: number;
    currencyType: string;
    price: number;
    ischecked: boolean;
    daCompValidYear:any;
    subCheckFlag: boolean;
    daCompValidationFlag: boolean;
}

export class AssignScreeningOwnerVm {
    assignCase: AssignCaseVm[] = [];
    deptId: number;
    screeningOwnerId: number;
    teamName: string;
    subTeamName: string;
    loggedIn: number;
    loginName: string;
    screeningOwnerName: string;
    assignflag:boolean;
}

export class AssignCaseVm {
    caseNo: number;
    clientReferenceNo: string;
    clientId: string;
    ScreeningCompId: number;
}

export class InvitationVm {
    clientId: number;
    siteId: number;
    firstName: string;
    lastName: string;
    middleName: string;
    clientName: string;
    siteName: string;
    applicationId: number;
    caseComponent: CaseComponentVm[] = [];
}
export class SaveInvitation {
    invitationId: number;
    caseNo: number;
    clientId: number;
    clientName: string;
    packageId: number;
    firstName: string;
    lastName: string;
    middleName: string;
    loggedId: number;
    invitationStatusLookupId: number;
    caseComponent: CaseComponentVm[] = [];
    userName: string;
    passWord: string;
    phoneNo: string;
    emailId: string;
    invitationExpiryLookupId: number;
    compReceivedDate: Date;
    compInitiationDate: Date;
    referenceNo: any;
}
export class AssignDEView {
    deptId: number;
    caseNo: number;
    userId: number;
    screeningOwnerId: number;
    caseStatus: string;
    teamId: number;
    subTeamId: number;
    teamName: string;
    subTeamName: string;
    applicationId: number;
    type: string;
    filters: string;
    page: number;
    pageSize: number;
    sorts: string;
    applyPaging: boolean;
    needTotal: boolean;
}
export class ApprovedDocVm {
    documentId: number;
    fileName: string;
    loaRemarks: string;
}

export class CaseEntry {
    applicantId: string;
    doj:Date;
    candidateFirstName: string;
    candidateMiddleName: string;
    candidateLastName: string;
    clientReferenceNo: string;
    caseRefNo: string;    
    candidateId = 0;
    employeeId :string;
    screeningOwnerId?: number;
    contactId: number;
    chargeCode: string;
    clientName: string;
    siteName: string;
    tat: number;
    caseNo: number;
    invitationExpiryLookupId: number;
    phoneNo?: string;
    emailId: string;
    consentLookupId: number;
    invitationId: number;
    packageId?: number;
    caseComponent?: any[] = [];
    mailContact: CcList[] = [];
    fileUpload?:any;
    componentDocument?:any;
}
export class CcList {
    transContactId: number;
    destLookupId: number;
    destName: string;
    contactId: number;
    contactData: any;
    active: boolean;
    lookupId: number;
    index: number;
  }
export class CommonComponentVm {
    componentFormGroup: UntypedFormGroup;
    packComponent: any;
    compCommonLists: any;
    packList: any;
    componentList: any;
    clientId: number;
    scopeList: any;
    type: string;
    constructor(componentFormGroup: UntypedFormGroup,
        packComponent: any,
        compCommonLists: any,
        packList: any,
        componentList: any,
        clientId: number,
        scopeList: any,
        type: string) {
        this.componentFormGroup = componentFormGroup;
        this.packComponent = packComponent;
        this.compCommonLists = compCommonLists;
        this.packList = packList;
        this.componentList = componentList;
        this.clientId =  clientId;
        this.scopeList = scopeList;
        this.type = type;
    }
}