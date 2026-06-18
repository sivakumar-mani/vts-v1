
export class GroupCreation {
  groupCreationId: number;
  clientId: number;
  clientName: string;
  groupWiseId: number;
  groupName: string;
  ContactPerson: string;
  BillingPersonName: string;
  address: string;
  city: string;
  zipCode: number;
  stateName: string;
  stateId: number;
  countryId: number;
  countryName: string;
  active: boolean;
  groupSites: GroupSites[] = [];
  gSTNo: string;
  createdBy: number;
  modifiedBy: number;
  LoggedId: number;
}

export class GroupSites {
  siteName: string;
  siteId: string;
  active: boolean;
  rowCount: number;
}
