import { CommonAddress } from './common-address';

export class Vendor {
    // addressId: number;
    // addTypeLookupId: number;
    vendorId: number;
    vendorName: string;
    userId: number;
    name: string;
    owners: string;
    // addLine1: string;
    // countryName: string;
    // stateName: string;
    // phoneNo: string;
    // mobileNo: string;
    active: boolean;
    sendFlag: boolean;
    loggedId: number;
    deleteFlag: boolean;
    address: CommonAddress;
    contact: Contact[] = [];
    // countryId: number;
    // stateId: number;
}
// export class VendorContact {
//     vendorContactId: number;
//     contactLookupId: number;
//     // lookUpValue: string;
//     contactValue: string;
// }
export class Contact {
    contactId: number;
    lookupId: number;
    contactData: string;
    active: boolean;
    createdUserId: number;
}
