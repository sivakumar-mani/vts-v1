
export class CommonAddress {
    addressId: number;
    addTypeLookupId: number;
    addLine1: string;
    addLine2: string;
    addLine3: string;
    // city: string;
    stateId: number;
    countryId: number;
    postalCode: string;
    active: boolean;
    createdUserId: number;
    cityId: number;
    districtId: number;
    locationId: number;
    addressPos:AddressPos;
}
export class AddressPos{
    addressId: number;
    addressPosId:number;
    periodOfStay: string;
    periodOfStayTo: string;
    screeningCompId:number;
    reportFlag:boolean;
}

