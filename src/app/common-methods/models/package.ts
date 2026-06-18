export class Package {
    createdUserId: number;
    clientId: number;
    fees: number;
    packageName: string;
    packComp: PackComp[] = [];
    effectiveDate: string;
    effectiveReason: string;
    oldFees: number;
    currentMSP: number;
    currentNRP: number;
    reason: string;
    packFeeApprovalFlag: boolean;
    packFeeStatusFlag: boolean;
    siteDetails: SiteDetails[]=[];
}
export class PackageDocument {
    fileName: string;
    document;
}
export class SiteDetails {
    siteId :number;
    siteName:string
    siteNo :string;
    clientUserName :string;
    active:boolean;
}
export class PackComp {
    componentId: number;
    noOfComp: number;
    noofyear:number;
    packageCompId: number;
    packageSubCompId: number;
    subComponentId: number;
    componentName: string;
    subComponentName: string;
    subComponent: PackSubCompVm[] = [];
    msp: number;
    tatDays: number;
}

export class PackSubCompVm {
    packageSubCompId: number;
    packageCompId: number;
    subComponentId: number;
    noOfComp: number;
    msp: number;
    subComponentName: string;
    tatDays: number;
    noofyear:number;
}

export class PackFeeApproveVm {
    packFeeId: number;
    comments: string;
    status: string;
    loggedIn: number;
    FileName: any[] = [];
}
