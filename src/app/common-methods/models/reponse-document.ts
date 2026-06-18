export class summaryContent {
    compId: number;
    header: string;
    remarks: string;
    insuffRaisedFlag: boolean;
    componentStatus: string;
    discrepancyRemarks: string;
    modeofVerification: string;
    caseDetailFlag: string;
    criminalDatabaseType: string;
    colorStatus: string;
    currentEmpFlag: string;
    screeningStatus: string;
    gapRemarks: string;
    cVRemarks: string;
    screeningReportContactId: number;
    cvValidation: any[] = [];
    miscRepQns: any[] = [];
    reportContact: any[] = [];
    miscAppQns: any[] = [];
    customRepFields: any[] = [];
    customAppFields: any[] = [];
    componentType = '';
    allReportDefault?: any;
    content:
        {
            caption: any;
            dataType: string;
            reportVal: string;
            applicanttVal: string;
            key: string;
        }[] = [];
    posDetails?: any[] = []; 
    annexureLength?: number[] = [];
    docContentList: docContent[] = [];
    repcityName: any;
    appcityName: any;
    verificationDate: any;
}

export class executiveDetailContent {
    header: string;
    index: number;
    compId: number;
    componentType: string;
    caption: [];
    component: any;
    dataAppQns: any[] = [];
    content:
        {
            caption: [];
            dataType: string;
            reportVal: string;
            applicanttVal: string;
            key: string
        }[] = [];
    docContentList: docContent[] = [];
}

export class FinalReport {
    summaryDetail: {
        caption: string;
        compId: number
        component: [];
        componentType: string;
        header: string;
        screeningCompId: number;
    }[];
    candidateDetail: {
       // Added By Megala - For VTS2-2024-CRT-0217
        enableHyperLinkRptFlag : boolean;
        annexureFlag: boolean;
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
        applicantLabel: string;
        chargeCode: string;
        siteName: string;
        reportLookName: string;
        displaySiteFlag: any;
        fatherName: string;
        displayChargeCodeFlag: any;
        caseByPassFlag: any;
        reOpenFlag?: boolean;
        subCheckFlag?: boolean;
        clientScreeningId: string;
        iqcByPassFlag: any;
        compInitiationDate: string;
        scopeByPassFlag: any;
        subCheckDate: string;
        ctsflag: boolean;
        negativeRemarks: string;
        vendorName: string;
        employeeID: string;
        location: string;
        dateofJoining: string;
        projectID: string;
        caseID: string;
        accountName: string;
        projectName: string;
        closedDate: string;
        cinflag: boolean;
        rocflag: boolean;
        incorporationFlag: boolean;
        onlineVerificationJcrFlag: boolean;
        doaDocument: docContent[];
        iqcFlag: boolean;
        dateOfReportForDrugTest: boolean;
        companyLogo: companyLogoVm;
    };
    executiveDetail: {
        compId: number;
        screeningCompId: number;
        component: {
            caption: [],
            component: []
        }[];
        componentType: string;
        header: string;
    }[];
    componentCustomFields: {
        caption: string;
        compId: number
        component: [];
        screeningCompId: number;
    }[];
    clientCustomFields: {
        clientCustomFieldId: number;
        fieldName: string;
        fieldType: string;
        fieldValue: string;
        mandatoryFlag: boolean;
        screeningId: number;
        screeningCompId: number;
    }[];
    document: docContent[];
    verificationOnlineDatabaseandCourtdetails: {
        verficationcourtDetails: [];
    }
    finalReportCaseDetails: any = [];
}

export class docContent {
    docId: number;
    document: any;
    fileName: number;
    filePath: number;
    annexureVal = '';
    compId: number;
    screeningCompId: number;
    verificationMode: string;
    caption: string;
    documentType: string;
}
export class companyLogoVm {
    logo: string;
  }

export class GeneratePdf {
    screeningId: number;
    screeningCompId: number;
    firstHtmlHeader: string;
    secondHtmlHeader: string;
    htmlFooter: string;
    pdfPassword: string;
    setPdfPassword: false;
    htmlContent: string;
    htmlExecutiveContent: string;
    htmlSummaryContent: string;
}
export class OrganizationLogo {
    logo: string;
    seal: string;
    signature: string;
}
export class ClientLogoReport {
    clientAddress: {
        addressId: number;
        addLine1: string;
        addLine2: string;
        addLine3: string;
        city: string;
        country: string;
        district: string;
        place: string;
        state: string;
        postalCode: number;
    };
    clientContact: {
        lookUpName: string;
        contactId: number
        lookUpValue: [];
        lookUpId: number;
    }[];
}