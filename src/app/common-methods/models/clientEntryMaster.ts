export class AccessClient {
    loggedIn: number;
    clientId: [];
}
export class AccessClientlist {
    loggedIn: number;
    clientId: [];
    pageSize: number;
    page: number;
    filters: string;
    sorts: string;
    applyPaging: boolean;
    needTotal: boolean;
}
export class Password {
    finalReportPassword: string;
    individualReportPassword: string;
    interimReportPassword: string;
    supplementaryReportPassword: string;
    clientId: number;
    sendCrtFlag: boolean;
    IsFinalRptPwEnable: boolean;
    IsIndividualRptPwEnable: boolean;
    IsInterimRptPwEnable: boolean;
    IsSuplementaryRptPwEnable: boolean;
    loggedIn: number;
    FinalFlag: boolean;
    SuppFlag: boolean;
    InterimFlag: boolean;
    IndiduvalFalg: boolean;

}
export class ClientName {
    clientId: number;
    clientName: string;
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
export class AgreementDocument {
    agreementDocId: number;
    fileName: string;
    document;
    type: string;
}
export class CustomLoaDocument {
    fileName: string;
    filePath: string;
    document;
}
export class ClientFeeApprovalEmail {
    componentId: number;
    subCompId: number;
    requestedAmount: number;
    nrp: number;
    msp: number;
    validationType: string;
    comments: string;
}
export class ClientTatApprovalEmail {
    componentId: number;
    subCompId: number;
    originalTAT: number;
    requestedTAT: number;
    comments: string;
}
