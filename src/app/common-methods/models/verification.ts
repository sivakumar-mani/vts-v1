import { UserData } from './user';

export class Verification {
    ScreeningId: number;
    screeningCompId: number;
    verificationId: number;
    clientRefNo: string;
    applicationId: string;
    screenStatusId: number;
    insuffRaisedFlag: boolean;
}

export class FinalReport {
    summaryDetail: any[] = [];
    executiveDetail;
    candidateDetail: {
        applicantId: string;
        clientName: string;
        colorCode: string;
        dateInitiated: string;
        dateOfBirth: string;
        dateOfReport: string;
        firstName: string;
        lastName: string;
        middleName: string;
        packageType: string;
        referenceNo: string;
        screeningCompId: string;
        clientId: number;
        employeeID: string;
        ctsflag: boolean;
        clientDateOfJoining: string;
    };
}

export class VerificationDetails {
    screeningCompId: number;
    loginUserDetVm: UserData;
}
export class ClientApprovalFeeVm {
    screeningCompFeeId: number;
    clientRefNo: string;
    firstName: string;
    middleName: string;
    lastName: string;
    componentName: string;
    fees: number;
    requestDate: Date;
    comments: string;
    feeStatusId: number;
    createdUserId: number;
    feesStatus: any[] = [];
    remarks: any[] = [];
}
export class EmailHistorySearchVm {
    clientId: number;
    fromDate: any;
    toDate: any;
    loginUserDetVm: UserData;
    compId: any[] = [];
}
export class FileLevelTrackerVm {
    screeningId: number;
    clientId: any[] = [];    
    fromDate: any;
    toDate: any;
    loginUserDetVm: UserData;
    compId: any[] = [];
    pageSize: number;
    page: number;
    applyPaging: boolean;
    filters: string;
    sorts: string;
    needTotal: boolean;
    caseStatus:string;
    clientRefNo:string;

}
export class FilterVm {
    priority: any[] = [];
    casePriority: any[] = [];
    componentStatus: any[] = [];
    ScreeningCompId: any[] = [];
}
export class VerificationDetFilterVm {
    loginUserDetVm: UserData;
    FilterVm: FilterVm = new FilterVm();
}
export class ClientLogoReport {
    clientLogo: any[] = [];
    clientContact;
    clientAddress: {
        addLine2: string;
        addLine1: string;
        city: string;
        country: string;
        district: string;
        place: string;
        addLine3: string;
        addressId: number;
        state: string;
        postalCode: number;
    };
}

