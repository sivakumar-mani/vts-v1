
export class MailTemplate {
  privacyPolicyLink: string;
  clickhere: string;
  mailbodyheader: string;
  agreementAvailability: string;
  approvalStatus: string;
  requestedBy: string;
  comments: string;
  clientName: string;
  clientRefID: string;
  totalCaseDone: string;
  candidateName: string;
  tableData: string;
    requestedRate: string;
    validationCondition: string;
    component: string;
    mSPRate: string;
    nSPRate: string;
    remarks: string;
    requestedTat: string;
    originalTat: string;
    requestPerson: string;
    userName: string;
    Date: any;
    subComponent: string;
    PDFPwd: string;
    preApprovalWithoutLOA: any;
    sno: any;
    name: string;
    password: string;
    packageName: string;
    // added by Niranjana //
    // verificationId: string;
    // fees: string;
    // funcEntity: string; ///
}


export class MailData {
    htmlTemplate: string;
    fileAttachments: FileAttachment[] = [{
        filename: 'logo.png',
        path: '../assets/images/logo.png',
        cid: 'logo' // html tag img src
    }];

}
export class FileAttachment {
    filename: string;
    path?: string;
    cid?: string;
    content?: string;
    contentType?: string;
}

export class MailAttachment {
    fileName: string;
    bufferDoc: any;
    componentId: number;
    mailType: string;
    subComponentId: string;
  }