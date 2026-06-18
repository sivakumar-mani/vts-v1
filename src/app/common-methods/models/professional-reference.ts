import { CommonAddress } from './common-address';

export class EmpInsProf {
    PageType: number;
    Id: number;
    depId: number;
    name: string;
    additionalInformation: string;
    additionalInformationSub: string;
    contactPerson1: string;
    contactPerson2: string;
    designation1: string;
    designation2: string;
    department1: string;
    department2: string;
    loggedId: number;
    modeId: number;
    institutionTypeId: number;
    onlineUrl: string;
    empFlag: boolean;
    type: string;
    commonPhoneDet: Contact[] = [];
    commonEmailDet: Contact[] = [];
    address: CommonAddress;
    screeningCompId: number;
    researchMappingId: Number;
}
export class CommonMasContac {
    lookupId: number;
    contact: Contact[] = [];
}
export class Contact {
    contactId: number;
    transContactId: number;
    contactData: string;
    active: boolean;
}
