export class Filecreation {
    candidate: Candidate[] = [];
}
export class Candidate {
    candidateFName: string;
    candidateMName: string;
    candidateLName: string;
    reportSrcFName: string;
    reportSrcMName: string;
    reportSrcLName: string;
    candidateFullName: string;
    candidateAliasName: string;
    dateOfBirth: Date;
    casePriority?: number;
    clientApplicantId: string;
    fileStatus: string;
    clientReferenceNo: string;
}


