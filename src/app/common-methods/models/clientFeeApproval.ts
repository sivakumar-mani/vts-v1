
export class ClientCompFeeStatusTrans {
    loggedIn: number;
    comments: string;
    status: string;
    compFeeId: number;
    compTatId: number;
    clientFeeApproveDoc: ClientFeeApproveDoc[] = [];

}
export class ClientFeeApproveDoc {
    fileName: string;
    document;
    active: boolean;
    clientFeeDocId: number;
    compFeeDocId: number;
    documentId: number;
}
