
export class SalesClientMapping {
    salesClientMappingId: number;
    salePersonId: number;
    clientId: number;
    loggedId: number;
    deleteFlag?: boolean;
}

export class SalePersonDetails {
    userId: number;
    personName: string;
}


export class Agent {
    clientId: number;
    clientName: string;
    refNo: string;
    salesClientMappingId = 0;
}
export class Response {
    success = false;
    message: string;
    value: number;
}
export class SalesClientMappingDetails {
    salesClientMappingId: number;
    salePersonId: number;
    salePersonName: string;
    clientId: number;
    clientName: string;
    deleteFlag?: boolean;
    active?: boolean;
    clientList?: {
        clientId: number;
        clientName: string;
    }[] = [];
}
