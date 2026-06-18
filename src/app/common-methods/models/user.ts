export class User {
  active: boolean;
  applicationId: number;
  team:string;
  // tslint:disable-next-line:variable-name
  auth_token: string;
  deptId: number;
  deptName: string;
  emailId: string;
  subTeamId:number;
  teamLeadFlag:boolean;
  subTeamLeadFlag:boolean;
  empFlag:boolean;
  // tslint:disable-next-line:variable-name
  expires_in: any;
  firstName: string;
  isLoggedIn: boolean;
  lastLogIn: any;
  lastLogOut: any;
  lastName: string;
  loginAttemptExceed: boolean;
  password: string;
  roleId: any;
  userId: number;
  userName: string;
  subTeamName: string;
  teamName: string;
  teamId: number;
  paymentFlag:any;
}


export class UserData {
  userId: number;
  deptId: number;
  deptName: string;
  applicationId: number;
  teamId: number;
  subTeamId: number;
  subTeamName: string;
  teamName: string;
  team: string;
  clientId: any[];
  teamLeadFlag: boolean;
  subTeamLeadFlag: boolean;
  workFlowLookupId: number;
  siteId: any[];
  firstName: string;
  lastName: string;
  levelOneFlag : boolean;
  Fqc: string;
  pageSize: number;
  page: number;
  filters: string;
  sorts: string;
  applyPaging: boolean;
  needTotal: boolean;
  singleCheck: boolean;
  redCaseFlag : boolean;
  normalCheckFlag: boolean;
  qcRejectFlag: boolean ;
  AssignedStatus : boolean;
  veOpenCheck : boolean;
  fromDate :Date;
  toDate:Date;
  camRejectFlag:boolean;
  // sieveModel: any;
}
