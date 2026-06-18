export class ClientCompTATStatusTrans {
    loggedIn: number;
    comments: string;
    status: string;
    compTATId: number;
    clientCompTatApproveDoc: ClientTATApproveDoc[] = [];
}
export class ClientTATApproveDoc {
    fileName: string;
    document;
    active: boolean;
    clientTATDocMapId: number;
    compTATDocId: number;
    documentId: number;
}
