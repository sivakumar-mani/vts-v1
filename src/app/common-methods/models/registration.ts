export class Registration {
    firstName: string;
    lastName: string ;
    userName: string ;
    password: string ;
    email: string ;
    groupName: string ;
    designation: string ;
    userType: string ;
    accessType: string ;
    active: boolean ;
    roleId: number ;
    agentId: number ;
    agent: string;
    applicationId: number;
    userId: number ;
    localUser: number;
    reTypePassword: string;
    createUser: CreateUser;
    clientUser: ClientUser;
    designationLookupId: number;
    deptId: number;
    loggedIn: number;
    clientId: number;
    site: GroupSite[];
    role: Role[];
    teamId: number;
    invoiceNotificationFlag: boolean;
}
export class Department {
    departmentId: number ;
    departmentName: string ;
    active: boolean;
}
export class Components {
    componentId: number ;
    componentName: string ;
    active: boolean;
}

export class Role {
    roleId: number;
    roleName: string;
    active: boolean;
}
export class Client {
    clientId: number;
    clientName: string;
    active: boolean;
}

export class CreateUser {
    userAppId: number;
    userAppTransId: number;
    designationLookupId: number;
    deptId: number;
    active: boolean;
    client: Client[];
    role: Role[];
    omponent: Components[];
}
export class GroupSite {
    siteId: number;
    siteName: string;
    siteNo: string;
    active: boolean;
}
export class ClientUser {
    clientId: number;
    userAppId: number;
    site: GroupSite[];
    role: Role[];
}
export class ClientDetail {
    active: boolean;
    clientId: number;
    userAppTransId: number;
    site: GroupSite[];
    role: Role[];
}

