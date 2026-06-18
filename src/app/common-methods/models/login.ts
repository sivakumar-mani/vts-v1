
export class Login {
    userName: string;
    password: string;
}
export class ClosedCheckDto {
    closedCheckClientId : number;
    verificationId : string;
    clientRefNo : string;
    caseClosedFromDate : any;
    caseClosedToDate : any;
    closedUserId: number;
    applicationId: number;
    deptId: number;
    clientIds : any;
    loginUserDetVm: any;
    filters: string;
    page: number;
    pageSize: number;
    sorts: string;
    applyPaging: boolean;
    needTotal: boolean;

}
export class DashboardCountVm {
    teamId: number;
    teamName: string;
    userId: number;
    deptId: number;
    DeptName: string;
    applicationId: number;
    subTeamId: number;
    subTeamName: string;
    clientId: string[];
    teamLeadFlag: boolean;
    subTeamLeadFlag: boolean;
    workFlowLookupId: number;
    siteId: number[];
    SubmissionFlag: boolean;
    caseCreationFlag: boolean;
    dataSubmissionFlag: boolean;
    verificationFlag: boolean;
    qcFlag: boolean;
    insufficiencyFlag: boolean;
    adminFlag: boolean;

    filters: string;
    page: number;
    pageSize: number;
    sorts: string;
    applyPaging: boolean;
    needTotal: boolean;
    flag: boolean;
    caseHistoryFlag: boolean ;
    PreQcSubHistoryFlag: boolean ;
    submissionCountFlag: boolean ;
    submissionHistoryFlag: boolean ;
    subCheckFlag: boolean ;
    veCaseFlag: boolean = false;
    status : string;
    team : string;
}

