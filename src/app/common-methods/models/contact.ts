export class Contact {
    contactId: number;
    transContactId: number;
    contactData: string;
    lookupId: number;
    active: boolean;
    destName: string;
    destLookupId: number;
}
export class CommonContact {
    lookupId: number;
    contact: Contact[] = [];
}
