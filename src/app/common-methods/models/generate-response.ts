export class GenerateResponse {
}
export class VerificationMoveToQc {
    candidateName: string;
    screeningCompId: number;
    screeningId: number;
    clientRefNo: string;
    clientId: number;
    clientName: string;
    verificationId: number;
    componentName: string;
    serviceType: string;
    fees: number;
    remarks: string;
    applicationId: number;
    loggedIn: number;
}

export class MailBody {
    attachments: any;
    bccMailAddress: any;
    ccMailAddress: any;
    logginId: any;
    mailBody: any;
    subject: any;
    toMailAddress: any;
}

export class SummaryContent {
    header: string;
    remarks: string;
    content:
        {
            caption: any;
            dataType: string;
            reportVal: string;
            applicanttVal: string;
            key: string;
            required: boolean;
            maxLength: number;
        }[] = [];
}

export class ExecutiveDetailContent {
    header: string;
    caption: [];
    component: [];
    content:
        {
            caption: [];
            dataType: string;
            reportVal: string;
            applicanttVal: string;
            key: string;
            required: boolean
        }[] = [];
}

export class FinalReport {
    summaryDetail: {
        caption: string;
        compId: number
        component: [];
        componentType: string;
        header: string;
    }[];
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
    };
    executiveDetail: {
        compId: number;
        component: {
            caption: [],
            component: []
        }[];
        componentType: string;
        header: string;
    }[];
    document: DocContent[];
}

export class DocContent {
    docId: number;
    document: any;
    fileName: number;
    filePath: number;
}
export class GenerateResponseLabel {
     // Added camApproval & ScrenarioType field for all  Component- (Sprint -22) VTS2-2024-CRT-0195 -  by Megala
    public componentLabels = {
        employee: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        //For VTS2-2023-CRT-0131 - split emp -by Megala
        currentemployee: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        previousemployee: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        ndotComp: {
            verifiedBy: 'Verified By', personName: 'Drug Test Conducted by(Field Associate/Executive)', colorStatus: 'Status Color',
            position: 'Position', remarks: 'Verifier Remarks', collectionSite: 'Collection Site', specimenId: 'Specimen Id',
            verifierRemarks: 'Report Remarks', contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        employmentHrAndSupervisor: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        education: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        pan: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        uan: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        gsa: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        fda: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        nsr: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        voterId: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', contactDate: 'Date of Verification', location: 'Location', personPhone: 'Contact Person Phone',
            contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        license: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation/Information Source',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contacted Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        crc: {
            verifiedBy: 'Verified By', personName: 'Advocate Person', personDesign: 'Advocate Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Verifier Comment', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        address: {
            verifiedBy: 'Verified By', personName: 'Contact Name',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With the Candidate', remarks: 'Verifier Comment', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        passport: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        nic: {
            verifiedBy: 'Verified By', location: 'Location',
            contactDate: 'Date of Verification', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            remarks: 'Remarks', verifierRemarks: 'Verifier Remarks', position: 'Position', contactRemarksLookupId: 'Contact Remarks',
            camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        directorship: {
            personName: 'Contact Person Name',
            personDesign: 'Contact Person Designation', location: 'Location',
            verifiedBy: 'Verified By', colorStatus: 'Status Color', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        creditVerification: {
            verifiedBy: 'Verified By', contactDetail: 'Verification Source', location: 'Location', colorStatus: 'Status Color',
            remarks: 'Remarks', position: 'Position', contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        criminalDatabase: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', location: 'Location', colorStatus: 'Status Color',
            position: 'Position', remarks: 'Verifier Comments', verifierRemarks: 'Report Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        databaseConductMedia: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', location: 'Location', colorStatus: 'Status Color',
            position: 'Position', remarks: 'Verifier Comments', verifierRemarks: 'Report Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        drugTest: {
            verifiedBy: 'Verified By', personName: 'Drug Test Conducted by(Field Associate/Executive)', colorStatus: 'Status Color',
            position: 'Position', remarks: 'Verifier Remarks', collectionSite: 'Collection Site', specimenId: 'Specimen Id',
            verifierRemarks: 'Report Remarks', contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        panIndiaOCRV: {
            verifiedBy: 'Verified By', location: 'Location', personName: 'Contact Person Name',
            relationWithCandidate: 'Relation with the Candidate',
            position: 'Position', colorStatus: 'Status Color', verifierRemarks: 'Report Remarks', remarks: 'Verifier Comments',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        referenceSelfEmployed: {
            verifiedBy: 'Verified By', position: 'Position', colorStatus: 'Status Color', remarks: 'Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        referenceCheck: {
            personName: 'Contact Person Name',
            personDesign: 'Contact Person Designation', mail: 'Contact Person Email ID', location: 'Location',
            personPhone: 'Contact Person Phone', contactDate: 'Contacted Date',
            verifiedBy: 'Verified By', colorStatus: 'Status Color', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        employmentSupervisor: {
            personName: 'Contact Person Name',
            personDesign: 'Contact Person Designation', location: 'Location',
            verifiedBy: 'Verified By', colorStatus: 'Status Color', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        criminalCheckPCC1PCC2: {
            verifiedBy: 'Verified By', location: 'Location', personName: 'Contact Person Name', personPhone: 'Contact Person Phone',
            personDesign: 'Contact Person Designation', position: 'Position', colorStatus: 'Status Color', remarks: 'Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        gapVerification: {
            verifiedBy: 'Verified By', location: 'Contact Location', position: 'Position', colorStatus: 'Status Color',
            remarks: 'Remarks', verifierRemarks: 'Report Remarks', contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        companySiteVisit: {
            verifiedBy: 'Verified By', position: 'Position', colorStatus: 'Status Color', remarks: 'Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        socialMedia: {
            verifiedBy: 'Verified By', position: 'Position', colorStatus: 'Status Color', remarks: 'Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        oig: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        mhcp: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        facm: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        faC1: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        faC2: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        faC3: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        ten: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone',
            contactDate: 'Contact Date', contactDetail: 'Contact Detail', colorStatus: 'Status Color',
            relationWithCandidate: 'Relation With Candidate', remarks: 'Remarks', position: 'Position',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection'
        },
        criminalCheckPCC3PCC3E: {
            verifiedBy: 'Verified By', position: 'Position', colorStatus: 'Status Color', remarks: 'Remarks',
            verifierRemarks: 'Report Remarks', contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        emergencyContactVerification: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', personDesign: 'Contact Person Designation', position: 'Position',
            mail: 'Contact Person Email ID', location: 'Location', personPhone: 'Contact Person Phone', contactDate: 'Contacted Date',
            colorStatus: 'Status Color', remarks: 'Remarks', verifierRemarks: 'Report Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        jcr: {
            verifiedBy: 'Verified By', position: 'Position', colorStatus: 'Status Color', remarks: 'Remarks',
            contactRemarksLookupId: 'Contact Remarks', onlinedatabaseremarks: 'Online Database Verification Remarks',
            onlineVerfStatus: 'Online Database Verification Status',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        bankStatement: {
            verifiedBy: 'Verified By', position: 'Position', colorStatus: 'Status Color', remarks: 'Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        abroadComp: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', position: 'Position',
            location: 'Location', contactDate: 'Contacted Date',
            colorStatus: 'Status Color', remarks: 'Remarks', verifierRemarks: 'Report Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        ssn: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', position: 'Position',
            location: 'Location', contactDate: 'Contacted Date',
            colorStatus: 'Status Color', remarks: 'Remarks', verifierRemarks: 'Report Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
        commonComp: {
            verifiedBy: 'Verified By', personName: 'Contact Person Name', position: 'Position',
            location: 'Location', contactDate: 'Contacted Date',
            colorStatus: 'Status Color', remarks: 'Remarks', verifierRemarks: 'Report Remarks',
            contactRemarksLookupId: 'Contact Remarks',camApproval: 'Send For CAM Approval',scenarioType: 'Scenario Selection',verificationReceivedDate:'Verification Received Date'
        },
    };

    public componentFields = [
        { sample: [] },
        {
            employee: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            currentemployee: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            previousemployee: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            employmentHrAndSupervisor: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            education: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            pan: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            uan: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            oig: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            mhcp: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            facm: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            faC1: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            faC2: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            faC3: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            ten: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            gsa: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            fda: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            nsr: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign',
                'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            voterId: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign',
                'contactEmail', 'contactPersonPhone', 'remarksLookupId', 'verifiedPersonDesign'
                , 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            license: ['relationWithCandidate', 'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        }, // all
        {
            crc: ['relationWithCandidate', 'contactEmail', 'contactPersonPhone', 'contactDate', 'contactDetail',
                'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            address: ['contactPersonDesign', 'contactEmail', 'contactPersonPhone', 'contactDetail',
                'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            passport: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign', 'contactEmail',
                'contactPersonPhone', 'contactDate', 'remarksLookupId', 'verifiedPersonDesign', 'collectionSite', 'specimenId',
                'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            nic: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign', 'contactEmail', 'contactPersonPhone',
                'collectionSite', 'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            directorship: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'contactPersonPhone',
                'personPhone', 'relationWithCandidate', 'contactDetail', 'contactEmail', 'reportSignedFlag', 'reportDateAvailableFlag',
                'collectionSite', 'specimenId', 'personName', 'personDesign', 'mail', 'contactDate'
            ]
        },
        {
            creditVerification: ['relationWithCandidate', 'contactPerson', 'contactPersonDesign', 'contactEmail', 'contactPersonPhone',
                'contactDate', 'remarksLookupId', 'collectionSite', 'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            criminalDatabase: ['relationWithCandidate', 'contactPersonDesign', 'contactDetail', 'contactEmail', 'contactPersonPhone',
                'contactDate', 'collectionSite', 'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            databaseConductMedia: ['relationWithCandidate', 'contactPersonDesign', 'contactDetail', 'contactEmail', 'contactPersonPhone',
                'contactDate', 'collectionSite', 'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            drugTest: ['relationWithCandidate', 'contactPersonDesign', 'contactDetail', 'contactEmail', 'contactPersonPhone',
                'contactDate', 'location']
        },
        {
            ndotComp: ['relationWithCandidate', 'contactPersonDesign', 'contactDetail', 'contactEmail', 'contactPersonPhone',
                'contactDate', 'location']
        },
        {
            panIndiaOCRV: ['contactPersonDesign', 'contactDetail', 'contactEmail', 'contactPersonPhone', 'contactDate', 'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            referenceSelfEmployed: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'mail', 'contactPersonDesign',
                'personPhone', 'relationWithCandidate', 'contactDetail', 'contactPerson',
                'contactEmail', 'reportSignedFlag', 'reportDateAvailableFlag', 'collectionSite', 'specimenId', 'personName', 'personDesign',
                'location', 'contactDate', 'contactPersonPhone'
            ]
        },
        {
            referenceCheck: ['relationWithCandidate', 'contactDetail', 'remarksLookupId',
                'personPhone', 'contactPersonDesign', 'relationWithCandidate', 'contactDetail',
                'collectionSite', 'specimenId', 'personName', 'personDesign', 'reportSignedFlag', 'reportDateAvailableFlag'
            ]
        },
        {
            employmentSupervisor: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'contactPersonPhone',
                'personPhone', 'relationWithCandidate', 'contactDetail', 'contactEmail', 'reportSignedFlag', 'reportDateAvailableFlag',
                'collectionSite', 'specimenId', 'personName', 'personDesign', 'mail', 'contactDate'
            ]
        },
        {
            criminalCheckPCC1PCC2: ['relationWithCandidate', 'contactDetail', 'contactEmail', 'contactDate', 'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag', 'remarksLookupId']
        },
        {
            gapVerification: ['relationWithCandidate', 'contactDetail', 'contactEmail', 'contactDate', 'contactPersonPhone',
                'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag', 'contactPersonDesign', 'contactPerson']
        },
        {
            companySiteVisit: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'mail', 'contactPersonDesign',
                'personPhone', 'relationWithCandidate', 'contactDetail', 'contactPerson', 'contactEmail',
                'collectionSite', 'specimenId', 'personName', 'personDesign',
                'reportSignedFlag', 'reportDateAvailableFlag', 'location', 'contactDate', 'contactPersonPhone'
            ]
        },
        {
            socialMedia: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'mail', 'contactPersonDesign',
                'personPhone', 'relationWithCandidate', 'contactDetail', 'contactPerson', 'contactEmail',
                'collectionSite', 'specimenId', 'personName', 'personDesign',
                'reportSignedFlag', 'reportDateAvailableFlag', 'location', 'contactDate', 'contactPersonPhone'
            ]
        },
        {
            criminalCheckPCC3PCC3E: [
                'relationWithCandidate', 'contactDetail', 'contactEmail', 'contactDate', 'contactPersonPhone', 'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag', 'contactPersonDesign', 'contactPerson', 'location']
        },
        {
            emergencyContactVerification: ['relationWithCandidate', 'contactDetail', 'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag']
        },
        {
            jcr: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'mail', 'contactPersonDesign',
                'personPhone', 'relationWithCandidate', 'contactDetail', 'contactPerson', 'contactEmail',
                'collectionSite', 'specimenId', 'personName', 'personDesign',
                'reportSignedFlag', 'reportDateAvailableFlag', 'location', 'contactDate', 'contactPersonPhone'
            ]
        },
        {
            bankStatement: ['relationWithCandidate', 'contactDetail', 'remarksLookupId', 'mail', 'contactPersonDesign',
                'personPhone', 'relationWithCandidate', 'contactDetail', 'contactPerson', 'contactEmail',
                'collectionSite', 'specimenId', 'personName', 'personDesign',
                'reportSignedFlag', 'reportDateAvailableFlag', 'location', 'contactDate', 'contactPersonPhone'
            ]
        },
        {
            abroadComp: ['relationWithCandidate', 'contactDetail', 'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag', 'contactPersonDesign', 'contactEmail',
                'contactPersonPhone', 'remarksLookupId']
        },
        {
            ssn: ['relationWithCandidate', 'contactDetail', 'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag', 'contactPersonDesign', 'contactEmail',
                'contactPersonPhone', 'remarksLookupId']
        },
        {
            commonComp: ['relationWithCandidate', 'contactDetail', 'collectionSite',
                'specimenId', 'reportSignedFlag', 'reportDateAvailableFlag', 'contactPersonDesign', 'contactEmail',
                'contactPersonPhone', 'remarksLookupId']
        }

    ];
}

