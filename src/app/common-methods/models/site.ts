import { CommonAddress } from '../models/common-address';
export class Site {
    siteId: number;
    clientId: number;
    addressId: number;
    siteNo: string;
    siteName: string;
    contactPerson: string;
    billingName: string;
    centralHREmailId: string;
    active: boolean;
    gstNumber: string;
    isDAVEnabled: boolean;
    logoToAppearFlag: boolean;
}

export class SiteMail {
    siteNotifyId: number;
    categoryLookupId: number;
    emailLookupId: number;
    sendTypeLookupId: number;
    reportLookupId: number;
    emailAddress: string;
    sendFlag: boolean;
    active: boolean;
}

export class SiteDetail {
    createdUserId: number;
    emailConfig: SiteMail[] = [];
    address: CommonAddress;
    siteDetails: Site;
    clientLogo :SiteDocument[];
}
export class SiteDocument {
  // docId: number;
  // fileName: string;
  // document: string;
  logoTransId: number;
    logoDocTransId: number;
    fileName: string;
    filePath: string;
    document;
    active: boolean;
}
export class SiteNumber {
    clientId: number;
    siteId: number;
    siteNo: string;
}

