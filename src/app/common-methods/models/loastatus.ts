export class Documents {
    caseDocumentId: number;
    fileName: string;
    docType: string;
    document;
}
export class CaseLoa {
    caseNo: number;
    lOARemarks: string;
    loggedIn: number;
    // caseReferenceNo: number;
    // clientReferenceNo: number;
    // clientName: string;
    // applicantId: number;
    // caseReceivedDate: Date;
    // caseInitiationDate: Date;
    // candidateName: string;
    // remarks: string;
    // accManagerName: string;
    // subOwner: string;
    // comments: string;
    caseDocument: Documents[] = [];
}
