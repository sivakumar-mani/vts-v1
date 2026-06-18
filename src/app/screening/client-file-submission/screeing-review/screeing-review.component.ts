import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ElementRef,
  ViewChild,
  ɵConsole,
} from "@angular/core";
import { UntypedFormGroup, UntypedFormArray } from "@angular/forms";
import { ScreeningDetails } from "../../../../app/common-methods/models/screening-details";
import { ScreeningService } from "src/app/common-methods/services/screening.service";
import { MasterService } from "src/app/common-methods/services/master.service";
import { CommonService } from "src/app/common-methods/services/common.service";
import { User } from "src/app/common-methods/models/user";
import { DatePipe } from "@angular/common";
import moment from "moment";

@Component({
  standalone: false,
  selector: "app-screeing-review",
  templateUrl: "./screeing-review.component.html",
  styleUrls: ["./screeing-review.component.css"],
})
export class ScreeingReviewComponent implements OnInit {
  maritalStatus: any;
  PhnNoCode: any;
  AlterPhnNoCode: any;
  maritalStatusValue: string;
  gapArray: any[] = [];
  mstatus: string;
  phcode: any;
  @Input() inviteflag: boolean;
  @Input() screeningDetails = new ScreeningDetails();
  @Input() formgroupName: any;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetailslist: any;
  SocialMediaId;
  // screeningDetails = new ScreeningDetails();
  userData = new User();
  compBaseDetails: any;
  clientDetails: any;
  caseStatusName: any;
  casePriorityName: any;
  genderDetails: any;
  compid: any;
  refCheckReport: any;
  drugList: any;
  compcount: any[] = [];
  array: any[] = [];
  reviewDetails: any;
  filed = { key: "", type: "", value: "" };
  reviewValue: any[] = [];
  caseComponents: any[] = [];
  screeningCompInfo = [
    {
      key: "priorityId",
      type: "string",
      value: "",
      label: "Screening Priority",
    },
    { key: "screenStatusId", type: "string", value: "", label: "Status" },
    { key: "vendorId", type: "string", value: "", label: "Vendor Name" },
    { key: "currencyId", type: "string", value: "", label: "Currency" },
    {
      key: "reportSource",
      type: "string",
      value: "",
      label: "Report Source Name",
    },
  ];

  clientScreeningCompInfo = [
    {
      key: "priorityId",
      type: "string",
      value: "",
      label: "Screening Priority",
    },
    { key: "screenStatusId", type: "string", value: "", label: "Status" },
    { key: "currencyId", type: "string", value: "", label: "Currency" },
  ];

  addressrReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "addLine1",
        type: "string",
        value: "",
        label: "Address Line 1",
        isaddress: true,
      },
      {
        key: "addLine2",
        type: "string",
        value: "",
        label: "Address Line 2",
        isaddress: true,
      },
      {
        key: "addLine3",
        type: "string",
        value: "",
        label: "Landmark",
        isaddress: true,
      },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: true,
      },
      {
        key: "state",
        type: "string",
        value: "",
        label: "State",
        isaddress: true,
      },
      {
        key: "district",
        type: "string",
        value: "",
        label: "District",
        isaddress: true,
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: true,
      },
      {
        key: "place",
        type: "string",
        value: "",
        label: "Place",
        isaddress: true,
      },
      {
        key: "postalCode",
        type: "string",
        value: "",
        label: "Zip Code",
        isaddress: true,
      },
      // { key: 'periodOfStay', type: 'string', value: '', label: 'Period of Stay From' },
      // { key: 'periodOfStayTo', type: 'string', value: '', label: 'Period of Stay To' },
      {
        key: "overallStayYears",
        type: "string",
        value: "",
        label: "Overall Stay Years",
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  insuff = [
    {
      key: "screeningStatusId",
      type: "string",
      value: "",
      label: "Screening Status",
    },
    { key: "raisedDate", type: "date", value: "", label: "Raised Date" },
    {
      key: "levelLookupId",
      type: "string",
      value: "",
      label: "Insufficiency Level",
    },
    {
      key: "requiredLookupId",
      type: "string",
      value: "",
      label: "Required Type",
    },
    // { key: 'comments', type: 'string', value: '', label: 'Insufficiency Remark' }
  ];
  educationReviewJson = {
    header: "Education",
    screeningCompInfo: [],
    compref: [
      {
        key: "institutionName",
        type: "string",
        value: "",
        label: "university/Board",
      },
      // {
      //   key: "institutionType",
      //   type: "string",
      //   value: "",
      //   label: "Institution Type2",
      // },
      // {
      //   key: "educationCategoryName",
      //   type: "string",
      //   value: "",
      //   label: "Education Category Name",
      // },
      {
        key: "instituteName",
        type: "string",
        value: "",
        label: "institute/College Name",
      },
      {
        key: "registrationNumber",
        type: "string",
        value: "",
        label: "Registration/Roll/Seat Number",
      },
      // {
      //   key: "educationType",
      //   type: "string",
      //   value: "",
      //   label: "Education Type",
      // },
      {
        key: "otherCertificationCourse",
        type: "string",
        value: "",
        label: "Other Certification Course",
      },
      { key: "degree", type: "string", value: "", label: "Degree" },
      { key: "major", type: "string", value: "", label: "Major" },
      { key: "courseStart", type: "string", value: "", label: "Course Start" },
      {
        key: "courseCompletion",
        type: "string",
        value: "",
        label: "Course Completion",
      },
      {
        key: "certificateIssue",
        type: "string",
        value: "",
        label: "Certificate Issue",
      },
      { key: "gpa", type: "string", value: "", label: "GPA/CGPA/Percentage" },
      { key: "address", type: "string", value: "", label: "Address" },
      { key: "gapReason", type: "string", value: "", label: "GapReason" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  panReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [{ key: "pan", type: "string", value: "", label: "Pan Number" }],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  socialMediaCheckReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  empHrempSupReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "employerName",
        type: "string",
        value: "",
        label: "Company Name",
        compType: "employmentHR",
      },
      {
        key: "address",
        type: "string",
        value: "",
        label: "Address",
        compType: "employmentHR",
      },
      {
        key: "employmentNumber",
        type: "string",
        value: "",
        label: "Employment Number",
        compType: "employmentHR",
      },
      {
        key: "employeeId",
        type: "string",
        value: "",
        label: "Employee Id",
        compType: "employmentHR",
      },
      {
        key: "designation",
        type: "string",
        value: "",
        label: "Designation",
        compType: "employmentHR",
      },
      {
        key: "fromDate",
        type: "string",
        value: "",
        label: "From Date",
        compType: "employmentHR",
      },
      {
        key: "toDate",
        type: "string",
        value: "",
        label: "To Date",
        compType: "employmentHR",
      },
      {
        key: "ctc",
        type: "string",
        value: "",
        label: "CTC",
        compType: "employmentHR",
      },
      {
        key: "currentEmployerFlag",
        type: "boolean",
        value: "",
        label: "Current Employer",
        compType: "employmentHR",
      },
      {
        key: "professionalName",
        type: "string",
        value: "",
        label: "Supervisor Name",
        compType: "supervisor",
      },
      {
        key: "supervisorEmail",
        type: "string",
        value: "",
        label: "Supervisor Email",
        compType: "supervisor",
      },
      {
        key: "supervisorContactNo",
        type: "string",
        value: "",
        label: "Supervisor Contact Number",
        compType: "supervisor",
      },
      {
        key: "supervisorDesignation",
        type: "string",
        value: "",
        label: "Supervisor Designation",
        compType: "supervisor",
      },
      {
        key: "supervisorCompanyName",
        type: "string",
        value: "",
        label: "Supervisor Company Name",
        compType: "supervisor",
      },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: false,
        compType: "supervisor",
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: false,
        compType: "supervisor",
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  uanReviewJson = {
    header: "",
    screeningCompInfo: [],
    // compref: [{ key: "uan", type: "string", value: "", label: "Uan Number" }],
    compref: [
      { key: "uan", type: "string", value: "", label: "Uan Number" },
      { key: "fullName", type: "string", value: "", label: "Full Name" },
      { key: "remarks", type: "string", value: "", label: "Reason" }
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  cvReviewJson = {
    header: '',
    screeningCompInfo: [{ key: 'reportSource', type: 'string', value: '', label: 'Name of Applicant' },],
    compref: [],
    componentDocument: []
  };
  gsaReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "sourceused", type: "string", value: "", label: "Source Used" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  fdaReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "sourceused", type: "string", value: "", label: "Source Used" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [], insuff: [],
    componentDocument: [],
  };
  nsrReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "sourceused", type: "string", value: "", label: "Source Used" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  oigReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "sourceUsed", type: "string", value: "", label: "Source Used" },
    ],
    insuff: [],
    componentDocument: [],
  };
  mhcpReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "sourceUsed", type: "string", value: "", label: "Candidate Name" },
    ],
    insuff: [],
    componentDocument: [],
  };
  bankStatementReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "employerName",
        type: "string",
        value: "",
        label: "Employer Name",
      },
      { key: "fromDate", type: "string", value: "", label: "From Date" },
      { key: "toDate", type: "string", value: "", label: "To Date" },
      { key: "bankName", type: "string", value: "", label: "Bank Name" },
      { key: "branchName", type: "string", value: "", label: "Branch Name" },
      { key: "accountNo", type: "string", value: "", label: "Account Number" },
      {
        key: "statementFrom",
        type: "string",
        value: "",
        label: "Statement From",
      },
      { key: "statementTo", type: "string", value: "", label: "Statement To" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };

  companysiteVisitReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "companyName", type: "string", value: "", label: "Company Name" },
      { key: "address", type: "string", value: "", label: "Address" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  crcReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "addressTypeCheckLookupName",
        type: "string",
        value: "",
        label: "Address Type Check",
      },
      { key: "address", type: "string", value: "", label: "Address" },
      // { key: 'periodOfStayFrom', type: 'string', value: '', label: 'Period of Stay From' },
      // { key: 'periodOfStayTo', type: 'string', value: '', label: 'Period of Stay To' },
      { key: "gapDuration", type: "string", value: "", label: "Gap Duration" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  pcc12ReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "addressTypeCheckLookupName",
        type: "string",
        value: "",
        label: "Address Check Type",
      },
      { key: "addressType", type: "string", value: "", label: "Address Type" },
      { key: "address", type: "string", value: "", label: "Address" },
      // { key: 'periodOfStay', type: 'string', value: '', label: 'Period of Stay' },
      //{ key: 'periodOfStayFrom', type: 'string', value: '', label: 'Period of Stay From' },
      {
        key: "periodOfStayTo",
        type: "string",
        value: "",
        label: "Period of Stay To",
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  pcc33EReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "addressType", type: "string", value: "", label: "Address Type" },
      {
        key: "addressTypeCheckLookupName",
        type: "string",
        value: "",
        label: "Address Check Type",
      },
      { key: "address", type: "string", value: "", label: "Address" },
      // { key: 'periodOfStayFrom', type: 'string', value: '', label: 'Period of Stay From' },
      // { key: 'periodOfStayTo', type: 'string', value: '', label: 'Period of Stay To' },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };

  criminaldatabaseReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "sourceName", type: "string", value: "", label: "Source Name" },
      {
        key: "addressTypeCheck",
        type: "string",
        value: "",
        label: "DataBase Type",
      },
      // { key: 'addressTypeCheckLookupName', type: 'string', value: '', label: 'DataBase Type' },
      // { key: 'address', type: 'string', value: '', label: 'Address' },
      // { key: 'periodOfStayTo', type: 'string', value: '', label: 'Period of Stay To' },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  commondatabaseReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "sourceName", type: "string", value: "", label: "Candidate Name" }      
    ],
    insuff: [],
    componentDocument: [],
  };
  
  drugTestReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "kitType", type: "string", value: "", label: "Kit Type" },
      { key: "address", type: "string", value: "", label: "Address" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  NdotdrugscreenReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [{ key: "kitType", type: "string", value: "", label: "Kit Type" }],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  emergencycontacReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "contactPersonName",
        type: "string",
        value: "",
        label: "Contact Person Name",
      },
      {
        key: "contactNumber",
        type: "string",
        value: "",
        label: "Contact Phone No",
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  employmentsupervisorReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "professionalName",
        type: "string",
        value: "",
        label: "Supervisor Name",
      },
      {
        key: "supervisorEmail",
        type: "string",
        value: "",
        label: "Supervisor Email",
      },
      {
        key: "supervisorContactNo",
        type: "string",
        value: "",
        label: "Supervisor Contact Number",
      },
      {
        key: "supervisorDesignation",
        type: "string",
        value: "",
        label: "Supervisor Designation",
      },
      // { key: 'supervisorCompanyName', type: 'string', value: '', label: 'Supervisor Company Name' },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: false,
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: false,
      },
      // { key: 'address', type: 'string', value: '', label: 'Address' },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  employmentHrReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "employerName", type: "string", value: "", label: "Company Name" },
      {
        key: "currentEmployerFlag",
        type: "boolean",
        value: "",
        label: "Current Employer",
      },
      {
        key: "fresherFlag",
        type: "boolean",
        value: "",
        label: "Fresher Employer",
      },
      { key: "address", type: "string", value: "", label: "Address" },
      // { key: 'employmentNumber', type: 'string', value: '', label: 'Employment Number' },
      { key: "employeeId", type: "string", value: "", label: "Employee Id" },
      { key: "designation", type: "string", value: "", label: "Designation" },
      { key: "fromDate", type: "string", value: "", label: "From Date" },
      { key: "toDate", type: "string", value: "", label: "To Date" },
      { key: "ctc", type: "string", value: "", label: "CTC" },
      {
        key: "reasonForLeaving",
        type: "string",
        value: "",
        label: "Reason For Leaving",
      },
      { key: "gapReason", type: "string", value: "", label: "GapReason" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  //Added by megala
  currentemploymentHrReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "employerName", type: "string", value: "", label: "Company Name" },
      {
        key: "currentEmployerFlag",
        type: "boolean",
        value: "",
        label: "Current Employer",
      },
      {
        key: "fresherFlag",
        type: "boolean",
        value: "",
        label: "Fresher Employer",
      },
      { key: "address", type: "string", value: "", label: "Address" },
      // { key: 'employmentNumber', type: 'string', value: '', label: 'Employment Number' },
      { key: "employeeId", type: "string", value: "", label: "Employee Id" },
      { key: "designation", type: "string", value: "", label: "Designation" },
      { key: "fromDate", type: "string", value: "", label: "From Date" },
      { key: "toDate", type: "string", value: "", label: "To Date" },
      { key: "ctc", type: "string", value: "", label: "CTC" },
      {
        key: "reasonForLeaving",
        type: "string",
        value: "",
        label: "Reason For Leaving",
      },
      { key: "gapReason", type: "string", value: "", label: "GapReason" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  previousemploymentHrReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "employerName", type: "string", value: "", label: "Company Name" },
      {
        key: "currentEmployerFlag",
        type: "boolean",
        value: "",
        label: "Current Employer",
      },
      {
        key: "fresherFlag",
        type: "boolean",
        value: "",
        label: "Fresher Employer",
      },
      { key: "address", type: "string", value: "", label: "Address" },
      // { key: 'employmentNumber', type: 'string', value: '', label: 'Employment Number' },
      { key: "employeeId", type: "string", value: "", label: "Employee Id" },
      { key: "designation", type: "string", value: "", label: "Designation" },
      { key: "fromDate", type: "string", value: "", label: "From Date" },
      { key: "toDate", type: "string", value: "", label: "To Date" },
      { key: "ctc", type: "string", value: "", label: "CTC" },
      {
        key: "reasonForLeaving",
        type: "string",
        value: "",
        label: "Reason For Leaving",
      },
      { key: "gapReason", type: "string", value: "", label: "GapReason" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  ofacReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "addressType", type: "string", value: "", label: "Address Type" },
      { key: "address", type: "string", value: "", label: "Address" },
      // { key: 'periodOfStay', type: 'string', value: '', label: 'Period of Stay From' },
      // { key: 'periodOfStayTo', type: 'string', value: '', label: 'Period of Stay To' },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  referencecheckReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "professionalName",
        type: "string",
        value: "",
        label: "Referee Name",
      },
      { key: "refPhoneNo", type: "string", value: "", label: "Phone Number" },
      { key: "refEmail", type: "string", value: "", label: "Email Id" },
      {
        key: "refCompanyName",
        type: "string",
        value: "",
        label: "Referee Company",
      },
      {
        key: "refDesignation",
        type: "string",
        value: "",
        label: "Referee Designation",
      },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: false,
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: false,
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };

  voteridReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "voterId", type: "string", value: "", label: "Voter Id" },
      { key: "voterName", type: "string", value: "", label: "Voter Name" },
      { key: "gender", type: "string", value: "", label: "Gender" },
      {
        key: "address",
        type: "string",
        value: "",
        label: "Address",
        isaddress: false,
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  gapverificationReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      { key: "gapType", type: "string", value: "", label: "Gap Type" },
      { key: "gapFrom", type: "string", value: "", label: "Gap From" },
      { key: "gapTo", type: "string", value: "", label: "Gap To" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  licenseReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "issuingAuthority",
        type: "string",
        value: "",
        label: "Issuing Authority",
      },
      { key: "address", type: "string", value: "", label: "Address" },
      { key: "licenseNo", type: "string", value: "", label: "License No" },
      { key: "regNo", type: "string", value: "", label: "Registration No" },
      { key: "validFrom", type: "string", value: "", label: "Valid From" },
      { key: "validTo", type: "string", value: "", label: "Valid To" },
      { key: "scopeOfArea", type: "string", value: "", label: "Scope Of Area" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  nationalidentitycheckReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "aadhaarNumber",
        type: "string",
        value: "",
        label: "Aadhaar Number",
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  directorshipReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "identificationNumber",
        type: "string",
        value: "",
        label: "Identification Number",
      },
      {
        key: "organizationName",
        type: "string",
        value: "",
        label: "Name Of the Organisation",
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  passportReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "placeOfResidence",
        type: "string",
        value: "",
        label: "Place Of Residence",
      },
      { key: "dateOfIssue", type: "string", value: "", label: "Date Of Issue" },
      {
        key: "placeOfIssue",
        type: "string",
        value: "",
        label: "Place Of Issue",
      },
      { key: "expiryDate", type: "string", value: "", label: "Expiry Date" },
      {
        key: "passportNumber",
        type: "string",
        value: "",
        label: "Passport Number",
      },
      {
        key: "machineReadableZone",
        type: "string",
        value: "",
        label: "Machine Readable Zone",
      },
      { key: "address", type: "string", value: "", label: "Address" },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  referenceselfemployedReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "professionalName",
        type: "string",
        value: "",
        label: "Reported Name",
      },
      {
        key: "supervisorEmail",
        type: "string",
        value: "",
        label: "Supervisor Contact Number",
      },
      {
        key: "supervisorContactNo",
        type: "string",
        value: "",
        label: "Supervisor Contact Number",
      },
      {
        key: "supervisorDesignation",
        type: "string",
        value: "",
        label: "Supervisor Designation",
      },
      {
        key: "supervisorCompanyName",
        type: "string",
        value: "",
        label: "Supervisor Company Name",
      },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: false,
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: false,
      },
      // { key: 'address', type: 'string', value: '', label: 'Address' },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  PanindiaonlinecourtrecordReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "addLine1",
        type: "string",
        value: "",
        label: "Address Line 1",
        isaddress: true,
      },
      {
        key: "addLine2",
        type: "string",
        value: "",
        label: "Address Line 2",
        isaddress: true,
      },
      {
        key: "addLine3",
        type: "string",
        value: "",
        label: "Landmark",
        isaddress: true,
      },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: true,
      },
      {
        key: "state",
        type: "string",
        value: "",
        label: "State",
        isaddress: true,
      },
      {
        key: "district",
        type: "string",
        value: "",
        label: "District",
        isaddress: true,
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: true,
      },
      {
        key: "place",
        type: "string",
        value: "",
        label: "Place",
        isaddress: true,
      },
      {
        key: "postalCode",
        type: "string",
        value: "",
        label: "Zip Code",
        isaddress: true,
      },
      // { key: 'periodOfStay', type: 'string', value: '', label: 'Period of Stay From' },
      // { key: 'periodOfStayTo', type: 'string', value: '', label: 'Period of Stay To' },
      // { key: 'periodOfStay', type: 'string', value: '', label: 'Period Of Stay' },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  abroadReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "informationSource",
        type: "string",
        value: "",
        label: "Information Source",
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  ssnReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "fullName",
        type: "string",
        value: "",
        label: "Full Name",
      },
      {
        key: "fatherName",
        type: "string",
        value: "",
        label: "Father Name",
      },
      {
        key: "dob",
        type: "string",
        value: "",
        label: "Date of Birth",
      },
      {
        key: "addLine1",
        type: "string",
        value: "",
        label: "Address Line 1",
        isaddress: true,
      },
      {
        key: "addLine2",
        type: "string",
        value: "",
        label: "Address Line 2",
        isaddress: true,
      },
      {
        key: "addLine3",
        type: "string",
        value: "",
        label: "Landmark",
        isaddress: true,
      },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: true,
      },
      {
        key: "state",
        type: "string",
        value: "",
        label: "State",
        isaddress: true,
      },
      {
        key: "district",
        type: "string",
        value: "",
        label: "District",
        isaddress: true,
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: true,
      },
      {
        key: "place",
        type: "string",
        value: "",
        label: "Place",
        isaddress: true,
      },
      {
        key: "postalCode",
        type: "string",
        value: "",
        label: "Zip Code",
        isaddress: true,
      },
      {
        key: "ssnNo",
        type: "string",
        value: "",
        label: "SSN Number",
      }
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  nationReviewJson = {
    header: "",
    screeningCompInfo: [],
    compref: [
      {
        key: "fullName",
        type: "string",
        value: "",
        label: "Full Name",
      },
      {
        key: "fatherName",
        type: "string",
        value: "",
        label: "Father Name",
      },
      {
        key: "dateOfBirth",
        type: "string",
        value: "",
        label: "Date of Birth",
      },
      {
        key: "addLine1",
        type: "string",
        value: "",
        label: "Address Line 1",
        isaddress: true,
      },
      {
        key: "addLine2",
        type: "string",
        value: "",
        label: "Address Line 2",
        isaddress: true,
      },
      {
        key: "addLine3",
        type: "string",
        value: "",
        label: "Landmark",
        isaddress: true,
      },
      {
        key: "country",
        type: "string",
        value: "",
        label: "Country",
        isaddress: true,
      },
      {
        key: "state",
        type: "string",
        value: "",
        label: "State",
        isaddress: true,
      },
      {
        key: "district",
        type: "string",
        value: "",
        label: "District",
        isaddress: true,
      },
      {
        key: "city",
        type: "string",
        value: "",
        label: "City",
        isaddress: true,
      },
      {
        key: "place",
        type: "string",
        value: "",
        label: "Place",
        isaddress: true,
      },
      {
        key: "postalCode",
        type: "string",
        value: "",
        label: "Zip Code",
        isaddress: true,
      },
      {
        key: "idProofNumber",
        type: "number",
        value: "",
        label: "Id Proof Number",
        isaddress: true,
      },
      {
        key: "issuedBy",
        type: "string",
        value: "",
        label: "Issued By",
        isaddress: true,
      },
    ],
    misc: [],
    addressPos: [],
    jCRCourctDetailsVm: [],
    gapDetails: [],
    insuff: [],
    componentDocument: [],
  };
  gapreasonReviewJson = {
    header: "",
    gapReason: [
      {
        key: "gapTypeName",
        type: "string",
        value: "",
        label: "Gap between Education to Education",
      },
      { key: "remarks", type: "string", value: "", label: "Remarks" },
    ],
  };

  constructor(
    public scrService: ScreeningService,
    public master: MasterService,
    public common: CommonService, private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.compBaseDetails = this.scrService.baseDetail;
    this.SocialMediaId = 39;
    this.userData = JSON.parse(sessionStorage.getItem("user_data"));
    this.getInsuffDetailData();
    this.screeningDetails.candidate.dob = this.screeningDetails.candidate.dob != null ? this.common.getTimezoneOffset(this.screeningDetails.candidate.dob, false).toString() : '';
    this.screeningDetails.gapReason = this.screeningDetails.gapReason.filter(
      (f) => f.reasonFlag !== null
    );
    if (this.screeningDetails.gapReason) {
      this.gapArray = this.screeningDetails.gapReason.filter(
        (x) => x.reasonFlag !== null
      );
    }
    if (this.inviteflag) {
      const frmArray = this.mainForm.controls.screeningComponent as UntypedFormArray;
      for (let i = 0; frmArray.length > i; i++) {
        const frmGroup = frmArray.controls[i] as UntypedFormGroup;
        const componentArray = frmGroup.get("component") as UntypedFormArray;
        for (let j = 0; componentArray.length > j; j++) {
          const comprefGroup = componentArray.controls[j] as UntypedFormGroup;
          // if (comprefGroup.valid) {
          //   comprefGroup.get('active')?.setValue(true);
          // }
        }
      }
      this.caseComponents = this.scrService.componentList;
      this.screeningDetails.screeningComponent.map((m, index) => {
        m.component = m.component.filter(
          (f) =>
            (f.active === true &&
              f.screeningComponentInfo.notApplicableFlag !== true) ||
            f.screeningComponentInfo.screeningCompId > 0
        );
      });
    } else {
      this.caseComponents = this.screeningDetails.screeningCaseComponent;
    }
    this.reviewDetails = this.screeningDetails.screeningComponent;
    // this.caseComponents.map(m => m.compName = m.compName.toUpperCase());
    this.reviewDetails.forEach((element) => {
      const component = this.caseComponents.find(
        (f) => f.compId === element.compId
      );
      if (component) {
        component.compName = component.compName.toUpperCase();
        let data: any;
        switch (component.compName) {
          case this.common.EDUCATION:
            data = JSON.parse(JSON.stringify(this.educationReviewJson));
            break;
          case this.common.SOCIAL_MEDIA:
            data = JSON.parse(JSON.stringify(this.socialMediaCheckReviewJson));
            break;
          case this.common.SOCIAL_MEDIA:
            data = JSON.parse(JSON.stringify(this.socialMediaCheckReviewJson));
            break;
          case this.common.ADDRESS:
          case this.common.ADDRESS_GEO:
            // case this.common.JUDIS_COURT_RECORD:
            data = JSON.parse(JSON.stringify(this.addressrReviewJson));
            break;
          case this.common.PAN_CARD:
          case this.common.CREDIT_VERIFICATION:
            data = JSON.parse(JSON.stringify(this.panReviewJson));
            break;
          case this.common.EMPHR_EMPSUP:
            data = JSON.parse(JSON.stringify(this.empHrempSupReviewJson));
            break;

          case this.common.EMPLOYMENT_UAN:
            data = JSON.parse(JSON.stringify(this.uanReviewJson));
            break;
          case this.common.CV_VALIDATION:
            data = JSON.parse(JSON.stringify(this.cvReviewJson));
            break;
          case this.common.GSA:
            data = JSON.parse(JSON.stringify(this.gsaReviewJson));
            break;
          case this.common.FDA:
            data = JSON.parse(JSON.stringify(this.fdaReviewJson));
            break;
          case this.common.NSR:
            data = JSON.parse(JSON.stringify(this.nsrReviewJson));
            break;
          case this.common.OIG:
          case this.common.FACIS1M:
          case this.common.FACISLevel1:
          case this.common.FACISLevel2:
          case this.common.FACISLevel3:
          case this.common.TENNESSEE:
            data = JSON.parse(JSON.stringify(this.oigReviewJson));
            break;
          case this.common.MHCP:
            data = JSON.parse(JSON.stringify(this.mhcpReviewJson));
            break;
          case this.common.BANK_STATEMENT:
            data = JSON.parse(JSON.stringify(this.bankStatementReviewJson));
            break;
          case this.common.CRIMINAL_COURT_RECORD:
            data = JSON.parse(JSON.stringify(this.crcReviewJson));
            break;
          case this.common.CRIMINAL_CHECK_PCC1:
          case this.common.CRIMINAL_CHECK_PCC2:
            data = JSON.parse(JSON.stringify(this.pcc12ReviewJson));
            break;
          case this.common.CRIMINAL_CHECK_PCC3:
          case this.common.CRIMINAL_CHECK_PCC3E:
            data = JSON.parse(JSON.stringify(this.pcc33EReviewJson));
            break;
          case this.common.CRIMINAL_DATABASE:
            if (this.userData.teamName === "CTS-SubmissionTeam") {
              data = JSON.parse(
                JSON.stringify(this.criminaldatabaseReviewJson)
              );
            } else {
              this.criminaldatabaseReviewJson.compref.pop();
              data = JSON.parse(
                JSON.stringify(this.criminaldatabaseReviewJson)
              );
            }
            break;
          case this.common.DATABASE_CONDUCT:
          case this.common.DATABASE_ADVERSE_MEDIA:
            if (this.userData.teamName === "CTS-SubmissionTeam") {
              data = JSON.parse(
                JSON.stringify(this.commondatabaseReviewJson)
              );
            } else {
             // this.commondatabaseReviewJson.compref.pop();
              data = JSON.parse(
                JSON.stringify(this.commondatabaseReviewJson)
              );
            }
            break;
          case this.common.DRUG_TEST:
            data = JSON.parse(JSON.stringify(this.drugTestReviewJson));
            break;
          case this.common.EMERGENCY_CONTACT_VERIFICATION:
            data = JSON.parse(JSON.stringify(this.emergencycontacReviewJson));
            break;
          case this.common.EMPLOYMENT_SUPERVISOR:
            data = JSON.parse(
              JSON.stringify(this.employmentsupervisorReviewJson)
            );
            break;
          case this.common.EMPLOYMENT_HR:
            data = JSON.parse(JSON.stringify(this.employmentHrReviewJson));
            break;
            //added by megala 
            case this.common.CURRENT_EMPLOYMENT_HR:
              data = JSON.parse(JSON.stringify(this.currentemploymentHrReviewJson));
              break;
              case this.common.PREVIOUS_EMPLOYMENT_HR:
                data = JSON.parse(JSON.stringify(this.previousemploymentHrReviewJson));
                break;
          case this.common.OFAC_SDN:
            data = JSON.parse(JSON.stringify(this.ofacReviewJson));
            break;
          case this.common.REFERENCE_CHECK:
            data = JSON.parse(JSON.stringify(this.referencecheckReviewJson));
            break;
          case this.common.VOTER_ID:
            // this.getGenderDetails();
            data = JSON.parse(JSON.stringify(this.voteridReviewJson));
            break;
          case this.common.GAP_VERIFICATION:
            data = JSON.parse(JSON.stringify(this.gapverificationReviewJson));
            break;
          case this.common.COMPANY_SITE_VISIT:
            data = JSON.parse(JSON.stringify(this.companysiteVisitReviewJson));
            break;
          case this.common.LICENSE:
            data = JSON.parse(JSON.stringify(this.licenseReviewJson));
            break;
          case this.common.NATIONAL_IDENTITY_CHECK:
            data = JSON.parse(
              JSON.stringify(this.nationalidentitycheckReviewJson)
            );
            break;
          case this.common.DIRECTORSHIP:
            data = JSON.parse(JSON.stringify(this.directorshipReviewJson));
            break;
          case this.common.PASSPORT:
            data = JSON.parse(JSON.stringify(this.passportReviewJson));
            break;
          case this.common.ONLINE_CRC:
          case this.common.ONLINE_CRC_INTERNAL:
          case this.common.CriminalCheckGap:
            data = JSON.parse(JSON.stringify(this.crcReviewJson));
            break;
          case this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
          case this.common.JUDIS_COURT_RECORD:
            data = JSON.parse(
              JSON.stringify(this.PanindiaonlinecourtrecordReviewJson)
            );
            break;
          case this.common.NDOT_DRUG_SCREEN:
            data = JSON.parse(JSON.stringify(this.NdotdrugscreenReviewJson));
            break;
          case this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS:
          case this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS:
            data = JSON.parse(JSON.stringify(this.abroadReviewJson));
            break;
          case this.common.SSN_TRACE:
            data = JSON.parse(JSON.stringify(this.ssnReviewJson));
            break;
          case this.common.NATIONWIDE_SEX_OFFENDER_5_YEARS:
          case this.common.NATIONWIDE_SEX_OFFENDER:
          case this.common.CRIMINAL_SEARCH_STATEWIDE_10_YEARS:
          case this.common.CRIMINAL_FEDERAL_NATIONWIDE_10_YEARS:
          case this.common.FEDERAL_DISTRICT_SEARCH_10_YEARS:
          case this.common.CRIMINAL_FELONY_MISDEMEANOR_10_YEARS:
          case this.common.NATIONAL_CRIMINAL_DATABASE_SEARCH_10_YEARS:
          case this.common.NATIONAL_CRIMINAL_LOCATOR:
          case this.common.CRIMINAL_SEARCH_OVERSEAS:
          case this.common.CREDIT_OVERSEAS:
          case this.common.MVR:
            data = JSON.parse(JSON.stringify(this.nationReviewJson));
            break;
          case this.common.REFERENCE_SELF_EMPLOYED:
            data = JSON.parse(
              JSON.stringify(this.referenceselfemployedReviewJson)
            );
            break;
        }
        if (data) {
          element.component.forEach((comp, index) => {
            const Newdata = JSON.parse(JSON.stringify(data));
            Newdata.header = component.subCompFlag
              ? this.getCompHeader(
                component,
                comp["screeningComponentInfo"]["subCompId"],
                comp["screeningComponentInfo"]["compIndex"]
              )
              : component.compName === this.common.EDUCATION
                ? "HIGHEST QUALIFICATION " +
                comp["screeningComponentInfo"]["compIndex"]
                : component.compName === this.common.EMPLOYMENT_HR
                  ? comp["screeningComponentInfo"]["compIndex"] === 1
                    ? "CURRENT/LAST EMPLOYMENT"
                    : "PREVIOUS EMPLOYMENT " +
                    (comp["screeningComponentInfo"]["compIndex"] - 1)
                  : component.compName +
                  " " +
                  comp["screeningComponentInfo"]["compIndex"];
            if (
              (!this.inviteflag || this.screeningDetails.invitationFlag) &&
              Newdata.header.toUpperCase().includes("CURRENT ADDRESS")
            ) {
              // Newdata.compref.push({ key: 'periodOfStay', type: 'string', value: '', label: 'Period of Stay From' });
              // Newdata.compref.push({ key: 'periodOfStayTo', type: 'string', value: '', label: 'Period of Stay To' });
            } else {
              // Newdata.compref.push({ key: 'periodOfStay', type: 'string', value: '', label: 'Period of Stay' });
            }
            if (
              component.compName === this.common.EDUCATION &&
              this.screeningDetails.ctsFlag == true
            ) {
              Newdata.compref.push({
                key: "yearOfPassing",
                type: "string",
                value: "",
                label: "Year Of Passing",
              });
            }
            if (comp["screeningComponentInfo"]) {
              const CompInfo = JSON.parse(
                JSON.stringify(
                  this.userData.applicationId === 1
                    ? this.screeningCompInfo
                    : this.clientScreeningCompInfo
                )
              );
              CompInfo.forEach((info) => {
                info.value = this.getComponentstatus(
                  comp["screeningComponentInfo"][info.key],
                  info.key
                );
              });
              Newdata.screeningCompInfo = CompInfo;
              Newdata.componentDocument =
                comp["screeningComponentInfo"]["componentDocument"];
            }
            Newdata.compref.forEach((m) => {
              if (m["key"] === "address" && m.compType === "employmentHR" && m.fresherFlag != true) {
                m["value"] = (comp.compRef.address.addressId == this.scrService.defaultAddressId) ? 'NOT PROVIDED' :
                  comp["compRef"]["employmentHR"][m["key"]]["addLine1"] +
                  " " +
                  (comp["compRef"]["employmentHR"][m["key"]]["addLine2"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["addLine2"] +
                    ", "
                    : "") +
                  (comp["compRef"]["employmentHR"][m["key"]]["addLine3"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["addLine3"] +
                    ", "
                    : "") +
                  (comp["compRef"]["employmentHR"][m["key"]]["country"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["country"] +
                    ", "
                    : "") +
                  (comp["compRef"]["employmentHR"][m["key"]]["state"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["state"] + ", "
                    : "") +
                  (comp["compRef"]["employmentHR"][m["key"]]["district"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["district"] +
                    " "
                    : "") +
                  (comp["compRef"]["employmentHR"][m["key"]]["city"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["city"] + ", "
                    : "") +
                  (comp["compRef"]["employmentHR"][m["key"]]["place"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["place"] + ", "
                    : "") +
                  (comp["compRef"]["employmentHR"][m["key"]]["postalCode"]
                    ? comp["compRef"]["employmentHR"][m["key"]]["postalCode"]
                    : "");
              } else if (m["key"] === "address" && (comp['screeningComponentInfo']['notApplicableFlag'] == true || m.compType === "employmentHR" && m.fresherFlag == true)) {
                m["value"] = '--';
              }
              else if (m["key"] === "address" && comp['screeningComponentInfo']['notApplicableFlag'] != true && comp.compRef.address != null) {
                m["value"] = (comp.compRef.address.addressId == this.scrService.defaultAddressId) ? 'NOT PROVIDED' :
                  comp["compRef"]["address"]
                    ? (comp["compRef"][m["key"]]["addLine1"]
                      ? comp["compRef"][m["key"]]["addLine1"] + ","
                      : "") +
                    " " +
                    (comp["compRef"][m["key"]]["addLine2"]
                      ? comp["compRef"][m["key"]]["addLine2"] + ","
                      : "") +
                    (comp["compRef"][m["key"]]["addLine3"]
                      ? comp["compRef"][m["key"]]["addLine3"] + ","
                      : "") +
                    (comp["compRef"][m["key"]]["country"]
                      ? comp["compRef"][m["key"]]["country"] + ","
                      : "") +
                    (comp["compRef"][m["key"]]["state"]
                      ? comp["compRef"][m["key"]]["state"] + ","
                      : "") +
                    (comp["compRef"][m["key"]]["district"]
                      ? comp["compRef"][m["key"]]["district"] + ","
                      : "") +
                    (comp["compRef"][m["key"]]["city"]
                      ? comp["compRef"][m["key"]]["city"] + ", "
                      : "") +
                    (comp["compRef"][m["key"]]["place"]
                      ? comp["compRef"][m["key"]]["place"] + ", "
                      : "") +
                    (comp["compRef"][m["key"]]["postalCode"]
                      ? comp["compRef"][m["key"]]["postalCode"]
                      : "")
                    : "";
              } else if (
                m["isaddress"] &&
                m["isaddress"] === true &&
                (m["key"] === "addLine1" ||
                  m["key"] === "addLine2" ||
                  m["key"] === "addLine3" ||
                  m["key"] === "country" ||
                  m["key"] === "state" ||
                  m["key"] === "district" ||
                  m["key"] === "city" ||
                  m["key"] === "place" ||
                  m["key"] === "postalCode")
              ) {
                m.value = comp["compRef"]["address"][m["key"]];
              } else if (m.key === "genderLookupId") {
                setTimeout(() => {
                  m.value = this.getGender(comp["compRef"][m["key"]]);
                }, 100);
              } else if (m.key === "dob" || m.key === "dateOfBirth") {
                m['value'] = this.datePipe.transform(new Date(comp["compRef"][m["key"]]), 'dd/MMM/yyyy')
              } else {
                if (
                  component.compName === this.common.CRIMINAL_DATABASE &&
                  m["key"] === "addressTypeCheck" &&
                  this.scrService.DatabaseType
                ) {
                  let value = this.scrService.DatabaseType.filter(
                    (m) => m.lookUpId === comp.compRef.addressTypeCheckLookupId
                  );
                  if (value.length > 0) {
                    m.value = value[0].lookUpName;
                  }
                } else {
                  m.value = comp["compRef"][m["key"]];
                }
              }
              if (
                component.compName === this.common.EMPLOYMENT_SUPERVISOR ||
                component.compName === this.common.REFERENCE_SELF_EMPLOYED
              ) {
                if (m["key"] === "supervisorContactNo") {
                  m.value =
                    comp["compRef"]["supervisorContactNo"]["contactData"];
                } else if (m["key"] === "supervisorEmail") {
                  m.value = comp["compRef"]["supervisorEmail"]["contactData"];
                }
              }
              if (
                component.compName === this.common.EMPLOYMENT_HR ||
                component.compName === this.common.CURRENT_EMPLOYMENT_HR ||
                component.compName === this.common.EMPHR_EMPSUP
              ) {
                if (m["key"] === "currentEmployerFlag") {
                  m.value =
                    comp["compRef"]["currentEmployerFlag"] !== true
                      ? "No"
                      : "Yes";
                } else if (m["key"] === "fresherFlag") {
                  m.value =
                    comp["compRef"]["fresherFlag"] !== true ? "No" : "Yes";
                }
                if(this.screeningDetails.invitationFlag){
                 //Added by megala (Date Format issue)
                if(m["key"] === 'fromDate' && m.value !=null && m.value != 'TILL DATE'){
                  var [dateResult, isSuccess] = this.DateTransform( m.value,'YYYY-MM-DD','DD/MMM/YYYY'); 
                m.value =(isSuccess === true && dateResult !='Invalid date')? dateResult.toUpperCase() : m.value
                }else if(m["key"] === 'toDate'  && m.value !=null){
                  var [dateResult, isSuccess] = this.DateTransform( m.value,'YYYY-MM-DD','DD/MMM/YYYY'); 
                m.value =(isSuccess === true && dateResult !='Invalid date') ? dateResult.toUpperCase() : m.value
                }
                }
              }
              if (component.compName === this.common.BANK_STATEMENT) {
                if (
                  m["key"] === "statementFrom" &&
                  comp["compRef"]["statementFrom"]
                ) {
                  comp["compRef"]["statementFrom"] = new DatePipe("en-Us")
                    .transform(comp["compRef"]["statementFrom"], "dd/MMM/yyyy")
                    .toUpperCase();
                  m.value = comp["compRef"]["statementFrom"];
                } else if (
                  m["key"] === "statementTo" &&
                  comp["compRef"]["statementTo"]
                ) {
                  comp["compRef"]["statementTo"] = new DatePipe("en-Us")
                    .transform(comp["compRef"]["statementTo"], "dd/MMM/yyyy")
                    .toUpperCase();
                  m.value = comp["compRef"]["statementTo"];
                }
              }
              if (component.compName === this.common.EMPHR_EMPSUP) {
                if (m.compType === "employmentHR" && m.value === undefined) {
                  m.value = comp["compRef"]["employmentHR"][m["key"]];
                } else if (
                  m.compType === "employmentHR" &&
                  m["key"] === "currentEmployerFlag"
                ) {
                  m.value =
                    comp["compRef"]["employmentHR"]["currentEmployerFlag"] !==
                      true
                      ? "No"
                      : "Yes";
                } else if (
                  m.compType === "employmentHR" &&
                  m["key"] === "address"
                ) {
                  m["value"];
                } else if (m.compType === "supervisor") {
                  if (m["key"] === "supervisorContactNo") {
                    m.value =
                      comp["compRef"]["employmentSupervisor"][
                      "supervisorContactNo"
                      ]["contactData"];
                  } else if (m["key"] === "supervisorEmail") {
                    m.value =
                      comp["compRef"]["employmentSupervisor"][
                      "supervisorEmail"
                      ]["contactData"];
                  } else if (
                    m["key"] === "country" &&
                    comp.compRef.employmentSupervisor.countryId !== null
                  ) {
                    const countrydata = this.common.countryList.find(
                      (f) =>
                        f.countryId ===
                        comp.compRef.employmentSupervisor.countryId
                    );
                    m.value = comp["compRef"]["employmentSupervisor"][
                      "country"
                    ] = countrydata ? countrydata.country : "";
                  } else {
                    m.value = comp["compRef"]["employmentSupervisor"][m["key"]];
                  }
                }
              }

              if (
                component.compName === this.common.CRIMINAL_CHECK_PCC1 ||
                component.compName === this.common.CRIMINAL_CHECK_PCC2
              ) {
                if (m["key"] === "addressType" && comp.active === true && comp.screeningComponentInfo.notApplicableFlag != true) {
                  m.value = comp["compRef"]["address0"]["addressType"];
                } else if (
                  m["key"] === "addressType" &&
                  comp.active === undefined && comp.screeningComponentInfo.notApplicableFlag != true
                ) {
                  m.value = comp.compRef.address[0].addressType;
                } else if (m["key"] === "periodOfStay") {
                  m.value = comp["compRef"]["address0"]["periodOfStay"];
                }
              }
            });
            if (
              (comp.criminalCheckCount > 0 &&
                component.compName === this.common.CRIMINAL_CHECK_PCC1) ||
              component.compName === this.common.CRIMINAL_CHECK_PCC2
            ) {
              for (let i = 0; comp.criminalCheckCount > i; i++) {
                Newdata.compref.push({
                  key: "address" + i,
                  type: "string",
                  value:
                    comp["compRef"]["address" + i]["addLine1"] +
                    (comp["compRef"]["address" + i]["addLine2"]
                      ? ", " + comp["compRef"]["address" + i]["addLine2"]
                      : "") +
                    (comp["compRef"]["address" + i]["addLine3"]
                      ? ", " + comp["compRef"]["address" + i]["addLine3"]
                      : "") +
                    (comp["compRef"]["address" + i]["country"]
                      ? ", " + comp["compRef"]["address" + i]["country"]
                      : "") +
                    (comp["compRef"]["address" + i]["state"]
                      ? ", " + comp["compRef"]["address" + i]["state"]
                      : "") +
                    (comp["compRef"]["address" + i]["district"]
                      ? ", " + comp["compRef"]["address" + i]["district"]
                      : "") +
                    (comp["compRef"]["address" + i]["city"]
                      ? ", " + comp["compRef"]["address" + i]["city"]
                      : "") +
                    (comp["compRef"]["address" + i]["place"]
                      ? ", " + comp["compRef"]["address" + i]["place"]
                      : "") +
                    (comp["compRef"]["address" + i]["postalCode"]
                      ? ", " + comp["compRef"]["address" + i]["postalCode"]
                      : ""),
                  label: "Address" + " " + (i + 1),
                });
              }
            }
            if (
              this.screeningDetails.invitationFlag === true &&
              component.compName === this.common.EMPLOYMENT_HR ||component.compName === this.common.CURRENT_EMPLOYMENT_HR ||component.compName === this.common.PREVIOUS_EMPLOYMENT_HR
            ) {
              Newdata.compref.push(
                {
                  key: "hrName",
                  type: "string",
                  value: comp["compRef"]["hrName"],
                  label: "hrName",
                },
                // { key: 'reasonforLeaving', type: 'string', value: (comp['compRef']['reasonForLeaving']), label: 'reason for Leaving' },
                {
                  key: "hrContactNo",
                  type: "string",
                  value: comp["compRef"]["hrContactNo"],
                  label: "HR Contact Number",
                },
                {
                  key: "hrEmail",
                  type: "string",
                  value: comp["compRef"]["hrEmail"],
                  label: "HR Email",
                },
                //{ key: 'hrDesignation', type: 'string', value: (comp['compRef']['hrDesignation']), label: 'HR Designation' },
                {
                  key: "holdFlag",
                  type: "boolean",
                  value: comp["compRef"]["holdFlag"] !== true ? "No" : "Yes",
                  label: "Keep On Hold",
                },
                {
                  key: "empInitiationDate",
                  type: "Date",
                  value:
                    comp["compRef"]["holdFlag"] !== true
                      ? ""
                      : comp["compRef"]["empInitiationDate"],
                  label: "Employee Initiation Date",
                },
                {
                  key: "professionalName",
                  type: "string",
                  value: comp["compRef"]["supervisorDet"]["supervisorName"],
                  label: "Supervisor Name",
                },
                {
                  key: "supervisorEmail",
                  type: "string",
                  value:
                    comp["compRef"]["supervisorDet"]["supervisorEmail"][
                    "contactData"
                    ],
                  label: "Supervisor Email",
                },
                {
                  key: "supervisorContactNo",
                  type: "string",
                  value:
                    comp["compRef"]["supervisorDet"]["supervisorContactNo"][
                    "contactData"
                    ],
                  label: "Supervisor Contact Number",
                },
                {
                  key: "supervisorDesignation",
                  type: "string",
                  value:
                    comp["compRef"]["supervisorDet"]["supervisorDesignation"],
                  label: "Supervisor Designation",
                },
                // { key: 'supervisorCompanyName', type: 'string', value: (comp['compRef']['supervisorDet']['supervisorCompanyName']), label: 'Supervisor Company Name' },
                // {
                //   key: "officialName",
                //   type: "string",
                //   value: comp["compRef"]["officialName"],
                //   label: "Official Name",
                // },
                {
                  key: "city",
                  type: "string",
                  value: comp["compRef"]["supervisorDet"]["city"],
                  label: "City",
                  isaddress: false,
                }
              );
            }

            if (component.compName === this.common.CV_VALIDATION) {
              Newdata.compref.push({ key: 'reportSource', type: 'string', value: comp['screeningComponentInfo']['reportSource'], label: 'Name of Applicant' });
            }
            if (component.compName === this.common.EDUCATION
              &&
              comp.compRef.removeInstitutionTypeFlag === false) {
              Newdata.compref.push({
                key: "institutionType",
                type: "string",
                value: comp["compRef"]["institutionType"],
                label: "Institution Type",
              });
              Newdata.compref.push({
                key: "educationCategoryName",
                type: "string",
                value: comp["compRef"]["educationCategoryName"],
                label: "Education Category Name",
              });
            }
            if (component.compName === this.common.EDUCATION
              && comp.compRef.removeEducationCategoryFlag === false) {
              Newdata.compref.push({
                key: "educationType",
                type: "string",
                value: comp["compRef"]["educationType"],
                label: "Education Type",
              });
            }
            if (
              this.screeningDetails.invitationFlag === true &&
              component.compName === this.common.EDUCATION
            ) {
              if (comp.compRef.npReason !== "") {
                Newdata.compref.push({
                  key: "npReason",
                  type: "string",
                  value: comp["compRef"]["npReason"],
                  label: "Not Applicable Reason",
                });
              }
              if (
                comp.compRef.npRemarks !== "" ||
                comp.compRef.npReason === "others"
              ) {
                Newdata.compref.push({
                  key: "npRemarks",
                  type: "string",
                  value: comp["compRef"]["npRemarks"],
                  label: "Other Reason Remarks",
                });
              }
            }
            if (
              this.screeningDetails.invitationFlag === true &&
              (component.compName === this.common.EMPLOYMENT_HR || component.compName === this.common.CURRENT_EMPLOYMENT_HR || component.compName === this.common.PREVIOUS_EMPLOYMENT_HR) &&
              comp.compRef.supervisorDet.countryId !== null
            ) {
              const countrydata = this.common.countryList.find(
                (f) => f.countryId === comp.compRef.supervisorDet.countryId
              );
              Newdata.compref.push({
                key: "country",
                type: "string",
                value: (comp["compRef"]["supervisorDet"]["country"] =
                  countrydata ? countrydata.country : ""),
                label: "Country",
                isaddress: false,
              });
            }
            if (comp["componentCustomFields"]) {
              comp["componentCustomFields"].forEach((custom) => {
                Newdata.compref.push({
                  key: custom.fieldName,
                  type: custom.fieldType,
                  value: custom.fieldValue,
                  label: custom.fieldName,
                });
              });
            }
            if (comp["screeningComponentInfo"] && component.compName !== this.common.CV_VALIDATION) {
              Newdata.compref.push({
                key: "remark",
                type: "textArea",
                value: comp["screeningComponentInfo"]["remark"],
                label: "Remarks",
              });
            }

            // if (comp["compRef"]["address"] != undefined ? comp["compRef"]["address"]["addressPos"].length : 0 > 0)
            if (comp["compRef"]["address"] != undefined ? comp["compRef"]["address"]["addressPos"] != undefined ? comp["compRef"]["address"]["addressPos"].length : 0 : 0 > 0) {
              const addresspos: any[] = [];
              let i = 0;
              comp["compRef"]["address"]["addressPos"].forEach((add) => {
                if (add.periodOfStay !== '' || add.periodOfStayTo !== '') {
                  i = i + 1;
                  addresspos.push(
                    {
                      key: "",
                      type: "String",
                      value: add.periodOfStay,
                      label: "Period of Stay From " + i,
                    },
                    {
                      key: "",
                      type: "String",
                      value: add.periodOfStayTo,
                      label: "Period of Stay To " + i,
                    }
                  );
                }
              });
              Newdata.addressPos = addresspos;
            }
            //For Judis Court Details
            if (component.compName === this.common.JUDIS_COURT_RECORD && comp["compRef"]["jCRCourctDetailsVm"] != undefined ? comp["compRef"]["jCRCourctDetailsVm"] != undefined ? comp["compRef"]["jCRCourctDetailsVm"].length : 0 : 0 > 0) {
              const jCRCourctDetailsVm: any[] = [];
              let i = 0;
              comp["compRef"]["jCRCourctDetailsVm"].forEach((add) => {
                if (add.courtName !== '' || add.jurisdiction !== '' || add.location !== '' || add.remarks !== '') {
                  i = i + 1;
                  jCRCourctDetailsVm.push(
                    {
                      key: "",
                      type: "String",
                      value: add.courtName,
                      label: "Court Name " + i,
                    },
                    {
                      key: "",
                      type: "String",
                      value: add.jurisdiction,
                      label: "Jurisdiction " + i,
                    },
                    {
                      key: "",
                      type: "String",
                      value: add.location,
                      label: "Location " + i,
                    },
                    {
                      key: "",
                      type: "String",
                      value: add.remarks,
                      label: "Verification Remark " + i,
                    }
                  );
                }
              });
              Newdata.jCRCourctDetailsVm = jCRCourctDetailsVm;
            }
            //For Gap Details
            if (component.compName === this.common.GAP_VERIFICATION && comp["gapDetails"] != undefined ? comp["gapDetails"] != undefined ? comp["gapDetails"].length : 0 : 0 > 0) {
              const gapDetails: any[] = [];
              let i = 0;
              comp["gapDetails"].forEach((add) => {
                if (add.gapTypeLookupId !== '' || add.gapFrom !== '' || add.gapTo !== '' || add.techMGapReason !== '' || add.gapType != '') {
                  i = i + 1;
                  gapDetails.push(
                    {
                      key: "",
                      type: "String",
                      value: add.gapType,
                      label: "Gap Type " + i,
                    },
                    {
                      key: "",
                      type: "String",
                      value: add.gapFrom,
                      label: "Gap from " + i,
                    },
                    {
                      key: "",
                      type: "String",
                      value: add.gapTo,
                      label: "Gap To " + i,
                    },
                    {
                      key: "",
                      type: "String",
                      value: add.techMGapReason,
                      label: "Gap Reason " + i,
                    }

                  );
                }
              });
              const remark = Newdata.compref.filter(f => f.key == 'remark')
              Newdata.gapDetails = gapDetails;
              if (Newdata.gapDetails != null && Newdata.gapDetails.length > 0) {
                Newdata.gapDetails.push(remark[0]);
                Newdata.compref = [];
              }
            }

            if (comp["miscQuestion"]) {
              const miscData: any[] = [];
              comp["miscQuestion"].forEach((misc) => {
                miscData.push({
                  key: "",
                  type: "String",
                  value: misc.miscAnswer,
                  label: misc.miscQuestion,
                });
              });
              Newdata.misc = miscData;
            }
            if (comp["periodOfStayAddress"]) {
              Newdata.periodOfStayAddress = comp.periodOfStayAddress;
            }
            if (comp.screeningComponentInfo.insuffRaisedFlag) {
              const insufdata = JSON.parse(JSON.stringify(this.insuff));
              const insuffRemarks =
                comp["screeningInsufficiency"]["insuffDetail"];
              insuffRemarks.forEach((com) => {
                insufdata.push({
                  key: "comments",
                  type: "textArea",
                  value: com.comments,
                  label: "Insufficiency Remark",
                });
              });
              insufdata.forEach((f) => {
                if (f.key !== "comments") {
                  // f['value'] = comp['screeningInsufficiency']['insuffDetail'][f.key];
                  f["value"] = this.getInsuffDetail(
                    comp["screeningInsufficiency"][f.key],
                    f.key
                  );
                }
                // else {
                // f['value'] = this.getInsuffDetail(comp['screeningInsufficiency'][f.key], f.key);
                // }
              });
              Newdata.insuff = insufdata;
            } else {
             Newdata.insuff = [];
            }
            this.reviewValue.push(Newdata);
          });
        }
      }

    });

    this.getGenderDetails();
    this.getmaritalstatus();
    this.getPhoneCode();
    // this.getDrugKitList();
    // this.getRefReport();
    if (this.userData.applicationId === 1) {
      this.screeningClientDetails();
    }
    if (
      this.scrService.docList.length > 0 &&
      this.mainForm.value.document.length > 0
    ) {
      let docList: any[] = [];
      this.scrService.docList.forEach((ele) => {
        const docdata = this.mainForm.value.document.filter(
          (x) => x.docTypeId === ele.lookUpId
        );
        if (docdata.length > 0) {
          docdata[0].docName = ele.lookUpName;
          docList.push(docdata[0]);
        }
      });
      if (docList.length > 0) {
        this.mainForm.value.document.setValue(docList);
      }
    }
  }
// Date format conversion in review
  // Added by Megala
  DateTransform(dateStr: string, fromFormat: string = 'DD/MMM/YYYY', toFormat = 'YYYY-MM-DD'): [string | null, boolean] {
    let dateResult: string | null = null;
    let isSuccess: boolean = false;
    try {
      dateResult = moment(dateStr, fromFormat).format(toFormat);
      isSuccess = true;
    } catch (error) {
      console.error('Unhandled exception occurred during date transform:', dateStr, error);
    }
    return [dateResult, isSuccess];
  }
  getComponentstatus(id, type): string {
    if (this.inviteflag === true && this.compBaseDetails) {
      if (type === "priorityId") {
        const prioritylist = this.compBaseDetails.screeningPriority.find(
          (p) => p.lookUpId === id
        );
        if (prioritylist) {
          return prioritylist.lookUpName;
        } else {
          return "N/A";
        }
      } else if (type === "screenStatusId") {
        const status = this.compBaseDetails.screeningStatus.find(
          (s) => s.statusId === id
        );
        if (status) {
          return status.screeningStatus;
        } else {
          return "N/A";
        }
      } else if (type === "vendorId") {
        const vendor = this.compBaseDetails.vendor.find(
          (s) => s.vendorId === id
        );
        if (vendor) {
          return vendor.vendorName;
        } else {
          return "N/A";
        }
      } else if (type === "reportSource") {
        if (id) {
          return id;
        } else {
          return "N/A";
        }
      } else if (type === "currencyId") {
        const currency = this.compBaseDetails.currency.find(
          (s) => s.currencyId === id
        );
        if (currency) {
          return currency.currencyShortName;
        } else {
          return "N/A";
        }
      }
      if (type === "gapType") {
        const gap = this.compBaseDetails.gapVerificationType.find(
          (s) => s.lookUpId === id
        );
        if (gap) {
          return gap.lookUpName;
        } else {
          return "N/A";
        }
      }
    }
  }

  screeningClientDetails() {
    if (this.inviteflag === true) {
      const clientid = this.screeningDetails.screening.clientId;
      this.scrService.getScreeningClientDetails(clientid).subscribe((res) => {
        if (res) {
          this.clientDetails = res;
          const casestatusid = this.screeningDetails.screening.caseStatusId;
          const caseStatus = this.clientDetails.caseStatus.filter(
            (c) => c.lookUpId === casestatusid
          );
          if (caseStatus.length > 0) {
            this.caseStatusName = caseStatus[0].lookUpName;
          }
          const caseprioriyid = this.screeningDetails.screening.casePeriorityId;
          const casePriority = this.clientDetails.casePriority.filter(
            (c) => c.lookUpId === caseprioriyid
          );
          if (casePriority.length > 0) {
            this.casePriorityName = casePriority[0].lookUpName;
          }
        }
      });
    }
  }
  getInsuffDetailData() {
    this.scrService.getInsuffDetails(false).subscribe((res) => {
      if (res) {
        this.scrService.insuffDetail = res;
      }
    });
  }
  getInsuffDetail(id, type) {
    let value = null;
    switch (type) {
      case "screeningStatusId":
        if (this.scrService.insuffDetail.screeningStatus) {
          value = this.scrService.insuffDetail.screeningStatus.find(
            (f) => f.statusId === id
          );
        }
        return value && value.screeningStatus ? value.screeningStatus : "N/A";
      case "levelLookupId":
        if (this.scrService.insuffDetail.insuffLevel) {
          value = this.scrService.insuffDetail.insuffLevel.find(
            (f) => f.lookUpId === id
          );
        }
        return value && value.lookUpName ? value.lookUpName : "N/A";
      case "requiredLookupId":
        if (this.scrService.insuffDetail.insuffReqType) {
          value = this.scrService.insuffDetail.insuffReqType.find(
            (f) => f.lookUpId === id
          );
        }
        return value && value.lookUpName ? value.lookUpName : "N/A";
      default:
        return id;
    }
  }

  getDrugKitList() {
    // this.master.GetDrugKitList().subscribe(resp => {
    if (this.scrService.drugKitList) {
      setTimeout(() => {
        this.drugList = this.scrService.drugKitList;
      });
    }
    // });
  }
  getDrugKitListcomp(id: any) {
    if (this.drugList) {
      const drug = this.drugList.find((s) => s.kitId === id);
      if (drug) {
        return drug.kitName;
      } else {
        return "N/A";
      }
    }
  }
  getRefReport() {
    this.scrService.getRefCheckReport().subscribe((resp) => {
      if (resp) {
        setTimeout(() => {
          this.refCheckReport = resp;
        });
      }
    });
  }
  getReport(id: any) {
    if (this.refCheckReport) {
      const report = this.refCheckReport.find((p) => p.lookUpId === id);
      if (report) {
        return report.lookUpName;
      } else {
        return "N/A";
      }
    }
  }
  getGenderDetails() {
    this.scrService.getGenderDetails().subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.genderDetails = res;
        });
      }
    });
  }
  getGender(id: any) {
    if (this.genderDetails && this.genderDetails.length > 0) {
      const gender = this.genderDetails.find((p) => p.lookUpId === id);
      if (gender) {
        return gender.lookUpName;
      } else {
        return "N/A";
      }
    }
  }

  downloadFile(data, filename, docId, gapreason = false) {
    if (docId) {
      if (gapreason) {
        this.scrService.DownloadGapReasonDocument(docId).subscribe((resp) => {
          if (resp.document) {
            const sampleArr = this.base64ToArrayBuffer(resp.document);
            this.saveByteArray(filename, sampleArr);
          } else {
            alert("file does not exists");
          }
        });
      } else {
        this.scrService.downloadScreeningDocument(docId).subscribe((resp) => {
          if (resp.document) {
            const sampleArr = this.base64ToArrayBuffer(resp.document);
            this.saveByteArray(filename, sampleArr);
          } else {
            alert("file does not exists");
          }
        });
      }
    } else {
      const blob = new Blob([data.document], {
        type: "application/octet-stream",
      });
      if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        // for IE
        (window.navigator as any).msSaveOrOpenBlob(blob, filename);
      } else {
        // for Non-IE (chrome, firefox etc.)
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display:none;");
        const csvUrl = URL.createObjectURL(blob);
        a.href = csvUrl;
        a.download = filename;
        a.click();
        a.remove();
      }
    }
  }
  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  saveByteArray(filename, byte) {
    const blob = new Blob([byte], { type: "application/octet-stream" });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      // for IE
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      // for Non-IE (chrome, firefox etc.)
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display:none;");
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
    }
  }
  getCompHeader(components, subcompId, compind) {
    if (components.subCompFlag) {
      const subcomp = components.screeningSubComponent.find(
        (f) => f.subCompId === subcompId
      );
      if (subcomp) {
        return subcomp.subCompDesc + " - " + subcomp.subCompName + compind;
      } else {
        return "";
      }
    }
  }

  getmaritalstatus() {
    this.scrService.getMaritlStatus().subscribe((resp) => {
      if (resp) {
        this.maritalStatus = resp;
        if (this.screeningDetails.candidate.maritalStatusLookupId > 0) {
          const status = this.maritalStatus.filter(
            (x) =>
              x.lookUpId ===
              this.screeningDetails.candidate.maritalStatusLookupId
          );
          if (status.length > 0) {
            this.maritalStatusValue = status[0].lookUpName;
          }
        }
      }
    });
  }
  getPhoneCode() {
    this.scrService.getPhoneCodeList().subscribe((resp) => {
      this.phcode = resp;
      const Pcode = this.phcode.filter(
        (x) => x.countryId === this.screeningDetails.candidate.countryId
      );
      const AlternatePcode = this.phcode.filter(
        (x) =>
          x.countryId === this.screeningDetails.candidate.alternativeCountryId
      );
      const PhnCode = Pcode[0].countryCode;
      const val1 =
        PhnCode + "-" + this.screeningDetails.candidate.alternativeContactNo;
      const AlterPhnCode = AlternatePcode[0].countryCode;
      const val = AlterPhnCode + "-" + this.screeningDetails.candidate.phoneNo;
      if (
        this.screeningDetails.candidate.phoneNo === "" ||
        this.screeningDetails.candidate.phoneNo === null
      ) {
        this.PhnNoCode = "";
      } else {
        this.PhnNoCode = val;
      }
      if (
        this.screeningDetails.candidate.alternativeContactNo === "" ||
        this.screeningDetails.candidate.alternativeContactNo === null
      ) {
        this.AlterPhnNoCode = "";
      } else {
        this.AlterPhnNoCode = val1;
      }
    });
  }
}
