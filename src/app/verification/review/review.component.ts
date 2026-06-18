import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  HostListener,
  QueryList,
  AfterContentInit,
  AfterViewChecked,
  DoCheck,
  AfterContentChecked,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormGroup,
  FormGroupDirective,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
  UntypedFormArray,
  Form,
  NgForm,
} from "@angular/forms";
import { VerificationService } from "src/app/common-methods/services/verification.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from "rxjs";
import { CommonService } from "src/app/common-methods/services/common.service";
import { FinalReport } from "src/app/common-methods/models/verification";
import {
  SummaryContent,
  ExecutiveDetailContent,
  DocContent,
  VerificationMoveToQc,
  MailBody,
  GenerateResponseLabel,
} from "src/app/common-methods/models/generate-response";
import { AutoCompleteDropDown } from "src/app/common-methods/models/autoComplete";
import { CommonAlertsComponent } from "src/app/common-methods/common-alerts/common-alerts.component";
import { DatePipe } from "@angular/common";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AuthService } from "src/app/common-methods/services/auth.service";
// import { ValueTemplateDirective } from '@progress/kendo-angular-dropdowns';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  standalone: false,
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.css"],
})
export class ReviewComponent implements OnInit, OnDestroy, AfterViewChecked {
  componentName: any;
  dialogRef: any;
  headerText = " ";
  messageAlert = "";
  messageOne = "";
  UnderReviewStatusName = "";
  messagetwo = "";
  dateMax = new Date();
   // Added By Megala - For (sprint -22) VTS2-2024-CRT-019
   verificationToCAMApprovalVM  =new VerificationToCAMApprovalVM();
  @ViewChild('rejectionPopUP', { static: true }) rejectionPopUP;
  camFlagStatus: any[] = [];
  scenarioTypeStatus: any[] = [];
  @ViewChild("documentEditForm")
  documentEditForm: FormGroupDirective;
  @Input() responseDocument: UntypedFormGroup;
  @Input() verificationTransBindDet: any;
  @Input() verificationForm: UntypedFormGroup;
  generateResponseLabelData = new GenerateResponseLabel();
  pdfName: string;
  isTech = false;
  NtFlag = false;
  controlType: { controlId: number; controlValue: string };
  controlData: any[] = [];
  dataType: string;
  colorStatus: any[] = [];
  onlineVerfStatus: any[] = [];
  contacttype: any[] = [];
  nicRemarks: any[] = [];
  componentStatus: string;
  criminalStatus: any[] = [];
  naFlag = false;
  componentLabelData: any;
  componentFieldsData: any;
  fontColor = null;
  contactDet: UntypedFormGroup;
  reportDetFormGroup: UntypedFormGroup;
  JCROnlineDataVerification: UntypedFormGroup;
  contactDetailsEdit = false;
  contactData: any[] = [];
  verContent: {
    caption: any;
    dataType: string;
    reportVal: string;
    applicanttVal: string;
    key: string;
    required: boolean;
    minLength: number;
    maxLength: number;
    maxDates?:  Date | null;
  }[] = [];
  userData: any;
  sendMailToQc: UntypedFormGroup;
  currentDate = new Date();

  addressFormGroup: UntypedFormGroup;
  addressData = new BehaviorSubject(null);
  miscQnList: any[] = [];
  customFieldList: any[] = [];
  AddressForm: UntypedFormGroup;
  miscForm: UntypedFormGroup;
  misc: UntypedFormArray;
  databaseForm: UntypedFormGroup;
  dbase: UntypedFormArray;
  npAddressFlag = true;
  component: any = {};
  componentType = "";
  reportDetFlag = "";
  applicantDetFlag = "";
  reportContactFlag = "";
  mailBodyValue: MailBody;
  @ViewChild("reviewSaveTemplate", { static: true }) reviewSaveTemplate: TemplateRef<any>;
  @ViewChild("report", { static: true }) table: ElementRef<any>;
  @ViewChild('UnderReviewFR', { static: true }) UnderReviewFR;
  finalReport: FinalReport = null;
  summaryContentList: SummaryContent[] = [];
  executiveDetailContentlist: ExecutiveDetailContent[] = [];
  documentName: string;
  docContentList: DocContent[] = [];
  remarks = "";
  contactRemarksLookupId1 = new UntypedFormControl();
  remarksControls!: AutoCompleteDropDown;

  remarksList: any[] = [];
  @ViewChild("f", { static: true }) f: NgForm;
  stringDate = new UntypedFormControl();

  statusFlag = true;
  statusListControl!: AutoCompleteDropDown;
  contactRemarks: any[] = [];

  displayReturnValue: any;

  autocompleteFilterValue: any;
  degreeFlag = false;
  minmDate = new Date();
  maxDate = new Date();
  customFieldApp: any;
  customFieldRpt: any;
  colorFlag: boolean;
  confirmEmailFlag: boolean;
  confirmPhFlag: boolean;
  safeHtml: SafeHtml;
  screenAuth:any;
  constructor(
    public verificationService: VerificationService,
    private message: MessageService,
    private el: ElementRef,
    private router: Router,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public commonService: CommonService,
    public dateP: DatePipe,
    public sanitizer: DomSanitizer,
    public authService: AuthService
  ) {
    // this.maxDate = new Date(
    //   this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
    // );
  }
  setMinDateError(item: any) {
    const data = this.f.form.value;
    if (item.key === "fromDate" || item.key === "toDate") {
      const fromDate = this.convertDate(data.fromDate);
      const toDate = this.convertDate(data.toDate);
      if (toDate && fromDate) {
        if (
          fromDate !== "Invalid date" &&
          toDate !== "Invalid date" &&
          !isNaN(fromDate.getTime()) &&
          !isNaN(toDate.getTime())
        ) {
          if (fromDate > toDate) {
            this.f.form.get("toDate").setErrors({ date: { overLap: true } });
            return { date: { overLap: true } };
          } else {
            this.f.form.get("fromDate").setErrors(null);
            this.f.form.get("toDate").setErrors(null);
            return {};
          }
        }
      }
    } else if (
      item.key === "courseCompletion" ||
      item.key === "yearOfPassing" ||
      item.key === "certificateIssue"
    ) {
      const fDate = this.convertDate(data.courseCompletion);
      const yDate = this.convertDate(data.yearOfPassing);
      const tDate = this.convertDate(data.certificateIssue);

      if (
        fDate !== "Invalid date" &&
        tDate !== "Invalid date" &&
        yDate !== "Invalid date" &&
        !isNaN(fDate.getTime()) &&
        !isNaN(tDate.getTime()) &&
        !isNaN(yDate.getTime())
      ) {
        if (tDate.getFullYear() <= 1900) {
          this.f.form.get("courseCompletion").setErrors(null);
          this.f.form.get("yearOfPassing").setErrors(null);
          this.f.form.get("certificateIssue").setErrors(null);
          return {};
        } else {
          if (fDate > tDate) {
            this.f.form
              .get("certificateIssue")
              .setErrors({ date: { overLap: true } });
            return { date: { overLap: true } };
          } else {
            this.f.form.get("courseCompletion").setErrors(null);
            this.f.form.get("certificateIssue").setErrors(null);
            return {};
          }
        }
      }
    } else if (item.key === "validFrom" || item.key === "validTo") {
      // let vfDate;
      // let vtDate;
      const vfDate = this.convertDate(data.validFrom);
      const vtDate = this.convertDate(data.validTo);
      const ddmmmyyyyREGEX =
        /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;

      if (
        vfDate !== "Invalid date" &&
        vtDate !== "Invalid date" &&
        !isNaN(vfDate.getTime()) &&
        !isNaN(vtDate.getTime())
      ) {
        if (vfDate > vtDate) {
          this.f.form.get("validTo").setErrors({ date: { overLap: true } });
          this.f.form.get("validTo").markAsTouched();
          return { date: { overLap: true } };
        } else {
          this.f.form.get("validFrom").setErrors(null);
          this.f.form.get("validTo").setErrors(null);
          return {};
        }
      }
    } else if (
      item.key === "periodOfStay" ||
      item.key === "periodOfStayFrom" ||
      item.key === "periodOfStayTo"
    ) {
      const vfDate =
        item.key === "periodOfStay"
          ? this.convertDate(data.periodOfStay)
          : this.convertDate(data.periodOfStayFrom);
      const vtDate = this.convertDate(data.periodOfStayTo);

      if (
        vfDate !== "Invalid date" &&
        vtDate !== "Invalid date" &&
        !isNaN(vfDate.getTime()) &&
        !isNaN(vtDate.getTime())
      ) {
        if (vfDate > vtDate) {
          this.f.form
            .get("periodOfStayTo")
            .setErrors({ date: { overLap: true } });
          this.f.form.get("periodOfStayTo").markAsTouched();
          return { date: { overLap: true } };
        } else {
          this.f.form.get("periodOfStay").setErrors(null);
          this.f.form.get("periodOfStayTo").setErrors(null);
          return {};
        }
      }
    } else if (item.key === "gapFrom" || item.key === "gapTo") {
      // let vfDate;
      // let vtDate;
      const vfDate = this.convertDate(data.gapFrom);
      const vtDate = this.convertDate(data.gapTo);

      if (
        vfDate !== "Invalid date" &&
        vtDate !== "Invalid date" &&
        !isNaN(vfDate.getTime()) &&
        !isNaN(vtDate.getTime())
      ) {
        if (vfDate > vtDate) {
          this.f.form.get("gapTo").setErrors({ date: { overLap: true } });
          this.f.form.get("gapTo").markAsTouched();
          return { date: { overLap: true } };
        } else {
          this.f.form.get("gapFrom").setErrors(null);
          this.f.form.get("gapTo").setErrors(null);
          return {};
        }
      }
    }
  }
  getMinDate(item: any) {
    const data = this.f.form.value;
    if (item.key === "expiryDate" && data.dateOfIssue) {
      return data.dateOfIssue;
    } else {
      return this.verificationService.tempData.verificationScreeningDet
        .requestDate;
    }
  }
  convertDate(datestring): any {
    let year = 0;
    let month: any;
    let date = 0;
    if (typeof datestring === "string" && datestring.indexOf("/") > -1) {
      const str = datestring.split("/");
      if (str.length === 3) {
        if (isNaN(Number(str[1]))) {
          if (
            this.commonService.month.findIndex(
              (f) => f === str[1].toUpperCase()
            ) > -1
          ) {
            year = Number(str[2]);
            month = this.commonService.month.findIndex(
              (f) => f === str[1].toUpperCase()
            );
            date = Number(str[0]);
            return new Date(year, month, date);
          } else {
            return "Invalid date";
          }
        } else {
          if (
            Number(str[1]) > 12 ||
            Number(str[2]) > 9999 ||
            Number(str[2]) === 1900
          ) {
            return "Invalid date";
          } else {
            year = Number(str[2]);
            month = Number(str[1]);
            date = Number(str[0]);
            return new Date(year, month - 1, date);
          }
        }
      } else if (str.length === 2) {
        if (isNaN(Number(str[0]))) {
          if (
            this.commonService.month.findIndex(
              (f) => f === str[0].toUpperCase()
            ) > -1
          ) {
            year = Number(str[1]);
            month = isNaN(Number(str[0]))
              ? this.commonService.month.findIndex(
                (f) => f === str[0].toUpperCase()
              )
              : str[0];
            return new Date(year, month, 1);
          } else {
            return "Invalid date";
          }
        }
      }
    } else {
      if (isNaN(Number(datestring)) && datestring !== "Not Applicable") {
        return "Invalid date";
      }
      return new Date(Number(datestring), 0, 1);
    }
  }
  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.commonService.VERIFICATION_ROUTER);
    // this.dateMax =this.commonService.getTimezoneOffset(new Date(),false);
    this.componentLabelData = this.generateResponseLabelData.componentLabels;
    this.componentFieldsData = this.generateResponseLabelData.componentFields;
    // tslint:disable-next-line:max-line-length
    this.initParams();
    this.getCriminalstatus();
    if(this.verificationService.tempData.verificationScreeningDet.isDisableClosureFlag == false){ 
      this.getCamFlagStatus();
      
      }
    this.contactData =
      this.verificationService.tempData.responseDocument.component[0][
        this.reportDetFlag
      ][this.reportContactFlag].verificationContactTrans;
    this.componentName =
      this.verificationService.tempData.responseDocument.componentName;
    if (!this.contactData) {
      this.contactData = [];
    }
    this.contactDet =
      // tslint:disable-next-line:no-string-literal
      this.responseDocument["controls"]["component"]["controls"][
      "reportContact"
      ];
    this.JCROnlineDataVerification =
      this.responseDocument["controls"]["component"]["controls"][
      "reportContact"
      ];
    if (
      this.verificationService.tempData.statusAndColorRemark.statusRemarks
        .length > 0
    ) {
      this.getConfirmationType(false);
    }
    // this.statusListControl = new AutoCompleteDropDown('Color Status', 'colorStatusRemarksId',
    //   'lookUpId', 'lookUpName', this.verificationService.tempData['colorStatusRemarks'], '',
    //   this.responseDocument['controls']['component']['controls']['reportContact'], false, false, false);
    this.remarksControls = new AutoCompleteDropDown(
      "Remarks List",
      "contactRemarksLookupId",
      "screeningRptContactRemarksId",
      "remarks",
      this.verificationService.tempData.contactRemarks,
      "",
      // tslint:disable-next-line:no-string-literal
      this.responseDocument["controls"]["component"]["controls"][
      "reportContact"
      ],
      false,
      false,
      false
    );

    // tslint:disable-next-line:no-string-literal
    this.reportDetFormGroup =
      this.responseDocument["controls"]["component"]["controls"][
      "reportDetail"
      ];
    this.generateRpt();
    this.getComponentStatus();
    this.contactDet.controls.colorStatus.setValue(this.getColorName());
    if (this.component.reportDetail.address ? this.component.reportDetail.address.addressPos : false ||
      this.component.reportDetail.address ? this.component.reportDetail.address.addressPos.length : 0 > 0
    ) {

      this.AddressForm = this.fb.group({
        misc: this.fb.array([this.createAddressForm()]),
      });
      if (this.component.reportDetail.address.addressPos.length !== 0) {
        if (this.component.reportDetail.address.addressPos.length < this.component.applicantDetail.address.addressPos.length) {

          for (var i = 0, l = this.component.applicantDetail.address.addressPos.length; i < l; i++) {

            if (this.component.applicantDetail.address.addressPos[i] && this.component.reportDetail.address.addressPos[i] == undefined) {
              this.component.reportDetail.address.addressPos.push(this.component.applicantDetail.address.addressPos[i]);
              this.component.reportDetail.address.addressPos[i].addressPosId = 0;

            }

          }

        }

      }

      if (this.component.reportDetail.address.addressPos.length === 0) {
        this.component.reportDetail.address.addressPos =
          this.component.applicantDetail.address.addressPos;
        for (var i = 0, l = this.component.reportDetail.address.addressPos.length; i < l; i++) {
          this.component.reportDetail.address.addressPos[i].addressPosId = 0;
        }
      }

      for (
        let index = 0;
        index < +this.component.reportDetail.address.addressPos.length;
        index++
      ) {
        // (this.miscForm.controls[index] as UntypedFormGroup).setValue(this.component['reportDetail'].miscellaneousQuestion[index])
        // tslint:disable-next-line:no-string-literal
        this.component.reportDetail.address.addressPos[index].reportFlag = true;
        (
          this.AddressForm.controls["misc"]["controls"][index] as UntypedFormGroup
        ).setValue(this.component.reportDetail.address.addressPos[index]);
        this.addAdd("initial");
      }
    }

    this.initContactVals();
    this.initsendMailToQcForm();
    this.fontColor =
      this.verificationService.tempData.responseDocument.component[0][
        this.reportDetFlag
      ].fontColorStatus;
    //if (this.fontColor === true) { this.getFinalReprt('download'); }
    (this.controlData =
      this.verificationService.tempData.responseDocument.controlType),
      [0];
    this.autocompleteFilterValue = Object.assign([], this.controlData);
    if (this.componentType === "license") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .licenseReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }
    if (this.componentType === "creditVerification") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .creditVerificationReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }
    if (this.componentType === "panIndiaOCRV") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .panIndiaOCRVReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }

    if (this.componentName !== 'OFAC' &&
      this.componentType == "criminalDatabase" && this.verificationService.tempData.verificationScreeningDet.clientCategoryId === 4) {
      this.databaseForm = this.fb.group({
        dbase: this.fb.array([this.creadResearchForm()]),
      });
      if (
        this.component.reportDetail.recordCheckCategory ||
        this.component.applicantDetail.recordCheckCategory.length > 0
      ) {
        if (this.component.reportDetail.recordCheckCategory.length === 0) {
          this.component.reportDetail.recordCheckCategory =
            this.component.applicantDetail.recordCheckCategory;
        }
        for (
          let index = 0;
          index < this.component.reportDetail.recordCheckCategory.length;
          index++
        ) {

          (
            this.databaseForm.controls["dbase"]["controls"][index] as UntypedFormGroup
          ).setValue(this.component.reportDetail.recordCheckCategory[index]);
          if (index < (this.component.reportDetail.recordCheckCategory.length - 1)) {
            this.adddatabase("initial");
          }

        }

      }
    }
    if (
      //this.componentType === "criminalCheckPCC1PCC2" ||
      // || this.componentType === 'referenceSelfEmployed'       || this.componentType === 'referenceCheck'
      // || this.componentType === 'employmentSupervisor' || this.componentType === 'companySiteVisit'
      // || this.componentType === 'emergencyContactVerification'
      this.componentType == "employmentHrAndSupervisor"
    ) {
      this.miscForm = this.fb.group({
        misc: this.fb.array([this.createMiscForm()]),
      });
      if (
        this.component.reportDetail.miscellaneousQuestion ||
        this.component.applicantDetail.miscellaneousQuestion.length > 0
      ) {
        if (this.component.reportDetail.miscellaneousQuestion.length === 0) {
          this.component.reportDetail.miscellaneousQuestion =
            this.component.applicantDetail.miscellaneousQuestion;
        }
        for (
          let index = 0;
          index < +this.component.reportDetail.miscellaneousQuestion.length;
          index++
        ) {
          // (this.miscForm.controls[index] as UntypedFormGroup).setValue(this.component['reportDetail'].miscellaneousQuestion[index])
          // tslint:disable-next-line:no-string-literal
          (
            this.miscForm.controls["misc"]["controls"][index] as UntypedFormGroup
          ).setValue(this.component.reportDetail.miscellaneousQuestion[index]);
          this.addMisc("initial");
        }
      }
    }
    if (this.componentType === "criminalCheckPCC1PCC2") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .criminalCheckPCC1PCC2ReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }
    if (this.componentType === "criminalCheckPCC3PCC3E") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .criminalCheckPCC3PCC3EReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }
    if (this.componentType === "crc") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .crcReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }
    if (this.componentType === "criminalDatabase") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .criminalDatabaseReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }
    if (this.componentType === "jcr") {
      const AdData =
        this.verificationService.tempData.responseDocument.component[0]
          .jcrReportDet.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
    }
    if (this.componentType === "address") {
      // const AdData = this.verificationService.tempData.responseDocument.component[0].addressReportDet.address;
      // tslint:disable-next-line:no-string-literal
      const AdData =
        this.responseDocument.controls["component"]["controls"].reportDetail
          .value.address;
      this.addressData = new BehaviorSubject(AdData);
      this.addressData.next(AdData);
      this.initAddressFormGroup();
      if (this.componentName != "Digital Address Verification") {
        this.verContent = this.verContent.filter(
          (w) => w.caption != "Location Type"
        );
      }
    }
    if (
      this.componentType === "referenceCheck" ||
      this.componentType === "uan" ||
      this.componentType === "referenceSelfEmployed" ||
      this.componentType === "employmentSupervisor" ||
      this.componentType === "companySiteVisit" ||
      this.componentType === "employee" ||
      this.componentType === "currentemployee" ||
      this.componentType === "previousemployee" ||
      this.componentType === "emergencyContactVerification" ||
      this.componentType === "education" ||
      this.componentType === "address"
    ) {
      if (this.component.reportDetail.miscellaneousQuestion) {
        if (this.componentType === "companySiteVisit") {
          const csvList =
            this.component.reportDetail.miscellaneousQuestion.filter(
              (x) => x.miscAnswer === ""
            );
          if (csvList.length > 0) {
            this.component.reportDetail.miscellaneousQuestion.map(
              (m) => (m.miscId = 0)
            );
          }
        }
        if (
          this.componentType === "education" &&
          this.verificationService.tempData.verificationScreeningDet.ctsFlag ===
          true
        ) {
          this.verContent = this.verContent.filter(
            (w) =>
              w.caption != "Major" && w.caption != "Certificate Issued Date"
          );
        }
        if (
          this.componentType === "education" &&
          this.verificationService.tempData.verificationScreeningDet.ctsFlag !==
          true
        ) {
          this.verContent = this.verContent.filter(
            (w) => w.caption !== "Month & Year Of Passing"
          );
        }
        if ((this.componentType === "employee" || this.componentType === "currentemployee" || this.componentType == "previousemployee") && (this.verificationService.tempData.verificationScreeningDet.cinFlag === true)
        ) {
          this.verContent = this.verContent.filter(
            (w) =>
              w.caption != "CIN"
          );
        }
        if ((this.componentType === "employee" || this.componentType === "currentemployee" || this.componentType == "previousemployee") && (this.verificationService.tempData.verificationScreeningDet.incorporationFlag === true)
        ) {
          this.verContent = this.verContent.filter(
            (w) =>
              w.caption != "Date of Incorporation"
          );
        }
        if ((this.componentType === "employee" || this.componentType === "currentemployee" || this.componentType == "previousemployee") && (this.verificationService.tempData.verificationScreeningDet.rocFlag === true)
        ) {
          this.verContent = this.verContent.filter(
            (w) =>
              w.caption != "ROC Code"
          );
        }

        const dataLength = this.verContent.length;
        // tslint:disable-next-line:no-string-literal
        if (
          this.responseDocument.controls["component"]["controls"][
            "applicantDetail"
          ].value["miscellaneousQuestion"].length > 0
        ) {
          // tslint:disable-next-line:no-string-literal
          const miscApp =
            this.responseDocument.controls["component"]["controls"][
              "applicantDetail"
            ].value["miscellaneousQuestion"];
          miscApp.forEach((element) => {
            if (element.deleteFlag !== true) {
              this.verContent.push({
                caption: element.miscQuestion,
                reportVal: element.miscAnswer,
                dataType: "misq",
                applicanttVal: element.miscAnswer,
                key: element.miscAnswer,
                required: true,
                minLength: 2,
                maxLength: 1000,
              });
            }
          });

          // if (miscApp.length > 0) {
          //   miscApp.forEach((ele, i) => {
          //     if (ele.deleteFlag === true) {
          //       let val = i;
          //       this.responseDocument.controls["component"]["controls"][
          //         "reportDetail"
          //       ].value["miscellaneousQuestion"][val] = "";
          //     }
          //   });
          //   let misqList: any[] = [];
          //   this.responseDocument.controls["component"]["controls"][
          //     "reportDetail"
          //   ].value["miscellaneousQuestion"].forEach((element) => {
          //     if (element) {
          //       const ele = element;
          //       misqList.push(ele);
          //     }
          //   });
          //   if (misqList.length > 0) {
          //     this.responseDocument.controls["component"]["controls"][
          //       "reportDetail"
          //     ].value.miscellaneousQuestion = misqList;
          //   }
          // }
          // tslint:disable-next-line:no-string-literal
          const miscRpt =
            this.responseDocument.controls["component"]["controls"][
              "reportDetail"
            ].value["miscellaneousQuestion"];
          miscRpt.forEach((element, index) => {
            if (element) {
              this.verContent[dataLength + index].reportVal =
                element.miscAnswer;
            }
          });
        }
      }

      if (
        this.componentType === "education" && this.verificationService.tempData.verificationScreeningDet.clientCategoryId !== 4) {
        this.verContent = this.verContent.filter((w) => w.caption !== "Gap Reason");
      }
      if (
        this.componentType === "employee" && this.verificationService.tempData.verificationScreeningDet.clientCategoryId !== 4) {
        this.verContent = this.verContent.filter((w) => w.caption !== "Gap Reason");
      }
    }
    // if (this.component.applicantDetail.address?this.component.applicantDetail.address.addressPos.length:0 > 0) {
    //   const dataLength = this.verContent.length;
    //   // tslint:disable-next-line:no-string-literal
    //    if (
    //     this.responseDocument.controls["component"]["controls"][
    //       "applicantDetail"
    //     ].value["address"]["addressPos"].length
    //   ) {
    //     // tslint:disable-next-line:no-string-literal
    //     const miscApp =
    //       this.responseDocument.controls["component"]["controls"][
    //         "applicantDetail"
    //       ].value["address"]["addressPos"];

    //     let i = 0;
    //     const miscRpt =
    //     this.responseDocument.controls["component"]["controls"][
    //       "reportDetail"
    //     ].value["address"]["addressPos"];

    //     miscApp.forEach((element,index) => {
    //       i = i + 1;
    //       this.verContent.push(
    //         {
    //           caption: "Period Of Stay From " + i,
    //           reportVal: miscRpt[index].periodOfStay?miscRpt[index].periodOfStay:element.periodOfStay,
    //           dataType: "pos",
    //           applicanttVal: element.periodOfStay,
    //           key: "PeriodOfStayFrom" + i,
    //           required: true,
    //           minLength: 2,
    //           maxLength: 700,
    //         },
    //         {
    //           caption: "Period Of Stay To " + i,
    //           reportVal: miscRpt[index].periodOfStayTo?miscRpt[index].periodOfStayTo:element.periodOfStayTo,
    //           dataType: "pos",
    //           applicanttVal: element.periodOfStayTo,
    //           key: "PeriodOfStayTo",
    //           required: true,
    //           minLength: 2,
    //           maxLength: 700,
    //         }
    //       );
    //     });
    //        // tslint:disable-next-line:no-string-literal

    //   }
    // }

    if (this.componentType === "socialMedia") {
      if (this.component.reportDetail.miscellaneousQuestion) {
        const dataLength = this.verContent.length;
        // tslint:disable-next-line:no-string-literal
        if (
          this.responseDocument.controls["component"]["controls"][
            "applicantDetail"
          ].value["miscellaneousQuestion"].length > 0
        ) {
          // tslint:disable-next-line:no-string-literal
          const miscApp =
            this.responseDocument.controls["component"]["controls"][
              "applicantDetail"
            ].value["miscellaneousQuestion"];
          miscApp.forEach((element) => {
            if (element.deleteFlag !== true) {
              this.verContent.push({
                caption: element.miscQuestion,
                reportVal: element.miscAnswer,
                dataType: "misq",
                applicanttVal: "N/A",
                key: element.miscAnswer,
                required: true,
                minLength: 2,
                maxLength: 700,
              });
            }
          });
          // tslint:disable-next-line:no-string-literal
          const miscRpt =
            this.responseDocument.controls["component"]["controls"][
              "reportDetail"
            ].value["miscellaneousQuestion"];
          miscRpt.forEach((element, index) => {
            this.verContent[dataLength + index].reportVal = element.miscAnswer;
          });
        }
      }
    }

    this.customFieldApp =
      this.verificationService.tempData.componentCustomFields.filter(
        (e) => e.reportFlag === false
      );
    this.customFieldRpt =
      this.verificationService.tempData.componentCustomFields.filter(
        (e) => e.reportFlag === true
      );
    if (this.customFieldApp.length > 0) {
      if (
        this.customFieldRpt.length === 0 ||
        this.customFieldApp.length !== 0
      ) {
        this.customFieldApp.forEach((element) => {
          this.customFieldRpt.push({
            clientCustomFieldId: 0,
            fieldName: element.fieldName,
            fieldType: element.fieldType,
            fieldTypeLookupId: element.fieldTypeLookupId,
            fieldValue: element.fieldValue,
            mandatoryFlag: element.mandatoryFlag,
            reportFlag: true,
            screeningClientCustomFieldId: element.screeningClientCustomFieldId,
            screeningCompId: element.screeningCompId,
            screeningId: element.screeningId,
          });
        });
      }
    }
    this.updateValidation();
    // if (this.componentType === 'companySiteVisit') {
    if (this.customFieldRpt) {
      const dataLength = this.verContent.length;
      if (this.customFieldRpt.length > 0) {
        const customFieldApp = this.customFieldRpt;
        customFieldApp.forEach((element) => {
          this.verContent.push({
            caption: element.fieldName,
            reportVal: element.fieldValue,
            dataType: element.fieldType,
            applicanttVal: element.fieldValue,
            key: element.fieldName,
            required: element.mandatoryFlag,
            minLength: element.minLength,
            maxLength: 500,
          });
        });
        // const customFieldRpt = this.verificationService.tempData.componentCustomFields;
        // customFieldRpt.forEach((element, index) => {
        //   this.verContent[dataLength + index].reportVal = element.fieldValue;
        // });
      }
    }
    //  }
    this.getFreezeId();
    this.getNICRemarks();
    
    this.contactValidation();
    // if (this.verificationService.tempData.statusAndColorRemark.colorStatusRemark.length === 0) {
    //   this.contactDet.controls.contactRemarksLookupId.disable();
    // }
    if (
      this.verificationService.tempData.verificationScreeningDet.ctsFlag &&
      this.componentName === "Database"
    ) {
      const removeCaption = ["Father Name", "Gender"];
      this.verContent = this.verContent.filter(
        (item: any) => !removeCaption.includes(item.caption),
      );
    } else if (
      this.verificationService.tempData.verificationScreeningDet.ctsFlag &&
      this.componentName === "OFAC"
    ) {
      const removeCaption = [
        "Father Name",
        "Date of Birth",
        "Gender",
        "Address",
        "Period Of Stay From 1",
        "Period Of Stay To 1",
      ];
      this.verContent = this.verContent.filter(
        (item: any) => !removeCaption.includes(item.caption),
      );
    }
    //this new SRS based on CTS client
    const validationComponet = [
      "Online CRC",
      "Gap Check",
      "Criminal Check (PCC2)",
    ];
    if (
      this.verificationService.tempData.verificationScreeningDet.ctsFlag &&
      validationComponet.includes(this.componentName)
    ) {
      const colorData = this.contactDet.get("colorStatusLookupId").value;
      const result = this.colorStatus.find(
        (item) => item.lookUpId === colorData,
      );
      if (result.lookUpName === "Positive") {
        const data = this.verContent.find(
          (item: any) => item.caption === "Report Comment",
        );
        if (data) {
          data.reportVal = data.reportVal ? data.reportVal : "No Record Found";
        }
      }
    }
  }
  // contachRemarks() {
  //   if (this.verificationService.tempData.verificationScreeningDet.clientCategoryId === 4) {
  //     switch (this.responseDocument.controls.componentType.value) {
  //       case 'employee':
  //       case 'license':
  //       case 'passport':
  //       // case 'education':
  //       return true;
  //     }
  //   } 
  // }

  ngAfterViewChecked() {
    if (
      this.responseDocument.controls.componentType.value === "education" ||
      this.responseDocument.controls.componentType.value === "employee" ||
      this.responseDocument.controls.componentType.value === "currentemployee" ||
      this.responseDocument.controls.componentType.value === "previousemployee" ||
      this.responseDocument.controls.componentType.value === "license"
    ) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.verContent.length; i++) {
        this.setMinDateError(this.verContent[i]);
      }
    }
  }
  getNICRemarks() {
    this.verificationService.getNICRemarks().subscribe((res) => {
      if (res) {
        this.nicRemarks = res;
      }
    });
  }
  getComponentStatus() {
    this.verificationService
      .getComponentStatus(
        this.verificationService.tempData.verificationScreeningDet
          .screeningCompId
      )
      .subscribe((res) => {
        if (res) {
          this.componentStatus = res.statusName;
        }
      });
  }
  getCriminalstatus() {
    this.verificationService.getCriminalComponentStatus().subscribe((res) => {
      if (res) {
        this.criminalStatus = res;
       if(this.verificationService.tempData.verificationScreeningDet.ctsFlag) {
        this.checkComponetStatus();
         }
      }
    });
  }
   // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
  getCamFlagStatus() {
    this.verificationService.GetCamFlag().subscribe((res) => {
      if (res) {
        this.getScenarioType();
        this.camFlagStatus = res;
        if(this.contactDet.controls.camApprovalId.value>0){       
          this.contactDet.controls.camApproval.setValue(this.getCamFlagName());        
        }      
      }
    });
  }
  getScenarioType() {
    this.verificationService.GetscenarioType().subscribe((res) => {
      if (res) {
        this.scenarioTypeStatus = res;
        if(this.contactDet.controls.scenarioTypeId.value>0){
          this.contactDet.controls.scenarioType.setValue(this.getScenarioTypeName());
        }
    
      }
    });
  }
     // ended By Megala - For (sprint -22) VTS2-2024-CRT-0195

  initsendMailToQcForm() {
    this.sendMailToQc = new UntypedFormGroup({
      candidateName: new UntypedFormControl(
        this.verificationService.tempData.screeningCandidateDet.firstName +
        this.verificationService.tempData.screeningCandidateDet.middleName +
        this.verificationService.tempData.screeningCandidateDet.lastName
      ),
      screeningCompId: new UntypedFormControl(
        this.verificationService.tempData.verificationScreeningDet.screeningCompId
      ),
      clientRefNo: new UntypedFormControl(
        this.verificationService.tempData.verificationScreeningDet.referenceNo
      ),
      clientId: new UntypedFormControl(
        this.verificationService.tempData.verificationScreeningDet.clientId
      ),
      clientName: new UntypedFormControl(
        this.verificationService.tempData.verificationScreeningDet.clientName
      ),
      loggedIn: new UntypedFormControl(this.userData.userId),
      screeningId: new UntypedFormControl(
        this.verificationService.tempData.screeningId
      ),
      componentName: new UntypedFormControl(
        this.verificationService.tempData.responseDocument.componentName
      ),
      colorCode: new UntypedFormControl(
        this.commonService.colorCode
      ),
    camApprovalId:new UntypedFormControl (this.contactDet.value.camApprovalId),

    });
  }

  checkFormControls(param): boolean {
    let retVal = false; /// === 'cRC' ? 'crc' : this.componentType
    const component = this.componentFieldsData.filter(
      (e) => e[this.componentType]
    );
    if (component.length > 0) {
      if (component[0][this.componentType]) {
        retVal =
          component[0][this.componentType].filter((res) => res === param)
            .length === 0;
        if (!retVal) {
          this.contactDet.get(param).setValidators([]); // or clearValidators()
          this.contactDet.get(param).updateValueAndValidity();
        }
      }
    } else {
      retVal = true;
    }
    return retVal;
  }

  initParams() {
    this.componentType = this.responseDocument.controls.componentType.value === "Criminal-Federal Nationwide 5 Years" ? "abroadComp" :
      this.responseDocument.controls.componentType.value === "cRC"
        ? "crc"
        : this.responseDocument.controls.componentType.value;

    this.reportDetFlag = this.componentType + "ReportDet";
    this.applicantDetFlag = this.componentType + "ApplicantDet";
    this.reportContactFlag = this.componentType + "ReportContact";

    this.colorStatus = this.verificationTransBindDet.colorStatus;
    this.onlineVerfStatus = this.verificationTransBindDet.onlineVerificationStatus;
    this.contactRemarks =
      this.verificationService.tempData.statusAndColorRemark.colorStatusRemark
        .length > 0
        ? this.verificationService.tempData.statusAndColorRemark
          .colorStatusRemark
        : [];
    this.contacttype = this.verificationTransBindDet.contactType;
    this.component = this.responseDocument.controls.component.value;
    this.userData = JSON.parse(sessionStorage.getItem("user_data"));
  }

  initContactVals() {
    this.initContactDat();

    if (
      this.contactData.filter((e) => e.contactLookup === "Email").length > 0
    ) {
      this.contactDet.controls.contactEmail.setValue(
        this.contactData.filter((e) => e.contactLookup === "Email")[0]
          .contactData
      );
    }
    if (
      this.contactData.filter((e) => e.contactLookup === "Business Phone")
        .length > 0
    ) {
      this.contactDet.controls.contactPersonPhone.setValue(
        this.contactData.filter((e) => e.contactLookup === "Business Phone")[0]
          .contactData
      );
    }
  }
  getCrcContentForCivil(item): SafeHtml {
    let content = '';
    content += `<p style="font-size: 15px !important;font-weight: 1000 !important">${item.key === "civilCourtOriginalSuitForCivil" ? 'Civil Proceedings' : 'Criminal Proceedings'}</p>
    <span>${item.caption}</span>`;
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(content);
    return this.safeHtml;
  }
  generateRpt() {
    // tslint:disable-next-line:no-string-literal
    // if (this.responseDocument.value.componentType == 'cRC') {
    //   var civilProceeding = ''; 
    //   civilProceeding = 'Civil Proceeding';
    //   var criminalProceeding = ''; 
    //   criminalProceeding = 'Criminal Proceeding';
    // } 
    if (this.verContent.length === 0) {
      this.verContent = [];
      const val = this.responseDocument.controls["component"]["controls"];
      let displayCaption = (this.responseDocument.controls.component as UntypedFormGroup)
        .controls.displayCaption.value;
      // [reportDet, reportDet['address']].reduce(((r, c) => Object.assign(r, c)), {});e['key'] !== 'contactPerson' &&
      if (this.componentType === "referenceCheck") {
        displayCaption = displayCaption.filter(
          (e) => e.key !== "verifiedPerson" && e.key !== "phoneNumber"
        );
      }
      if (displayCaption) {
        displayCaption.forEach(
          (element: {
            caption: string;
            dataType: string;
            key: string;
            required: boolean;
            minLength: number;
            maxLength: number;
          }) => {
            if (element.key === "addressCRC" || element.key === "addressLicense" || element.key === "addressCredit") {
              const rptval = val.reportDetail.value.address
                ? this.concatAddress(val.reportDetail.value.address)
                : "N/A";
              const applicanttval = val.applicantDetail.value.address
                ? this.concatAddress(val.applicantDetail.value.address)
                : "N/A";
              this.verContent.push({
                caption: element.caption,
                reportVal: rptval,
                dataType: element.dataType,
                applicanttVal: applicanttval,
                key: element.key,
                required: element.required,
                minLength: element.minLength,
                maxLength: element.maxLength,
              });
            } else if (element.key === "periodOfStay" && this.verificationService.tempData.verificationScreeningDet.clientCategoryId === 4 && this.responseDocument.value.componentType == 'cRC') {
              // if (element.key === "periodOfStay") {
              const miscApp1 =
                this.responseDocument.controls["component"]["controls"][
                  "applicantDetail"
                ].value["address"]["addressPos"];
              const miscRpt1 = this.responseDocument.controls["component"]["controls"][
                "reportDetail"
              ].value["address"] != null ? this.responseDocument.controls["component"]["controls"][
                "reportDetail"
              ].value["address"]["addressId"] != 0 ?
                this.responseDocument.controls["component"]["controls"][
                  "reportDetail"
                ].value["address"]["addressPos"] : [] : [];
              let index1 = 0;
              miscApp1.forEach((element, index) => {
                index1 = index1 + 1;
                this.verContent.push(
                  {
                    caption: "Period Of Stay From " + index1,
                    reportVal: miscRpt1.length > 0 ? miscRpt1[index] != undefined ? miscRpt1[index].periodOfStay ? miscRpt1[index].periodOfStay : element.periodOfStay : element.periodOfStay : "Not Applicable",
                    dataType: "pos",
                    applicanttVal: element.periodOfStay,
                    key: "PeriodOfStayFrom" + index1,
                    required: true,
                    minLength: 2,
                    maxLength: 700,
                  }
                );
                this.verContent.push(
                  {
                    caption: "Period Of Stay To " + index1,
                    reportVal: miscRpt1.length > 0 ? miscRpt1[index] != undefined ? miscRpt1[index].periodOfStayTo ? miscRpt1[index].periodOfStayTo : element.periodOfStayTo : element.periodOfStayTo : "Not Applicable",
                    dataType: "pos",
                    applicanttVal: element.periodOfStayTo,
                    key: "PeriodOfStayTo" + index1,
                    required: true,
                    minLength: 2,
                    maxLength: 700,
                  }
                );
              });
              // }                        
            } 
            // else if (element.key === "PeriodOfStayTo" && this.verificationService.tempData.verificationScreeningDet.clientCategoryId === 4 && this.responseDocument.value.componentType == 'cRC') {
            //   const miscApp =
            //     this.responseDocument.controls["component"]["controls"][
            //       "applicantDetail"
            //     ].value["address"]["addressPos"];
            //   const miscRpt = this.responseDocument.controls["component"]["controls"][
            //     "reportDetail"
            //   ].value["address"] != null ? this.responseDocument.controls["component"]["controls"][
            //     "reportDetail"
            //   ].value["address"]["addressId"] != 0 ?
            //       this.responseDocument.controls["component"]["controls"][
            //         "reportDetail"
            //       ].value["address"]["addressPos"] : [] : [];
            //   let i = 0;
            //   miscApp.forEach((element, index) => {
            //     i = i + 1;
            //     this.verContent.push(
            //       {
            //         caption: "Period Of Stay To " + i,
            //         reportVal: miscRpt.length > 0 ? miscRpt[index] != undefined ? miscRpt[index].periodOfStayTo ? miscRpt[index].periodOfStayTo : element.periodOfStayTo : element.periodOfStayTo : "Not Applicable",
            //         dataType: "pos",
            //         applicanttVal: element.periodOfStayTo,
            //         key: "PeriodOfStayTo" + i,
            //         required: true,
            //         minLength: 2,
            //         maxLength: 700,
            //       }
            //     );
            //   });
            // } 
            else if (element.key === "candidateName") {
              this.verContent.push({
                caption: element.caption,
                reportVal:
                  (val.reportDetail.value.firstName
                    ? ("" + val.reportDetail.value.firstName).trim()
                    : "") +
                  (val.reportDetail.value.middleName
                    ? " " + ("" + val.reportDetail.value.middleName).trim()
                    : "") +
                  (val.reportDetail.value.lastName
                    ? " " + ("" + val.reportDetail.value.lastName.trim() + " ")
                    : ""),
                dataType: element.dataType,
                applicanttVal:
                  (val.applicantDetail.value.firstName
                    ? val.applicantDetail.value.firstName
                    : "") +
                  (val.applicantDetail.value.middleName
                    ? " " + val.applicantDetail.value.middleName
                    : "") +
                  (val.applicantDetail.value.lastName
                    ? " " + val.applicantDetail.value.lastName
                    : ""),
                key: element.key,
                required: element.required,
                minLength: element.minLength,
                maxLength: element.maxLength,
              });
            }
             else {
              const nullDateArr = ["dob", "dateOfBirth", "dateOfIssue", "Dob"];
              let rptval: any;
              let applicanttval: any;
              if (element.key === "reportComment" && this.componentType === "databaseConductMedia") {
                rptval = val.reportDetail.value.reportComment;
              }
              if (element.key === "sourceUsed" && this.componentType === "databaseConductMedia") {
                rptval = val.reportDetail.value.sourceUsed;
              }
              const testdate = this.commonService.getTimezoneOffset(
                val.reportDetail.value.dateOfBirth,
                false
              );
              if (
                this.componentType !== "address" &&
                this.componentType !== "jcr" &&
                this.componentType !== "panIndiaOCRV" &&
                this.componentType !== "databaseConductMedia"
              ) {
                if (element.key === "addressPCC1") {
                  rptval = this.concatAddress(val.reportDetail.value.address);
                  applicanttval = this.concatAddress(
                    val.applicantDetail.value.address
                  );
                } else {
                  rptval =
                    element.dataType !== "Date" &&
                      element.dataType !== "DateTime" &&
                      element.dataType !== "Dob"
                      ? val.reportDetail.value[element.key]
                      : nullDateArr.some((x) => x === element.key) &&
                        !val.reportDetail.value[element.key]
                        ? null
                        : this.commonService.getTimezoneOffset(
                          val.reportDetail.value[element.key],
                          false
                        );
                  if (
                    this.responseDocument.value.componentType === "drugTest" &&
                    element.dataType === "DateTime"
                  ) {
                    rptval = this.commonService.getTimezoneOffset(
                      this.verificationService.tempData.responseDocument
                        .component[0].drugTestReportDet[element.key],
                      false
                    );
                  }
                  if (
                    this.verificationService.tempData.responseDocument
                      .componentType === "ndotComp" &&
                    element.dataType === "DateTime"
                  ) {
                    rptval = this.commonService.getTimezoneOffset(
                      this.verificationService.tempData.responseDocument
                        .component[0].ndotCompReportDet[element.key],
                      false
                    );
                  }
                  if (this.responseDocument.value.componentType === "commonComp") {
                    if (element.key == 'ssnNo') {
                      rptval = val.reportDetail.value.idProofNumber;
                    }

                  }
                  if (element.key === 'ssnNo') {
                    applicanttval = val.applicantDetail.value.ssnNo;
                  } else {
                    applicanttval = val.applicantDetail.value[element.key]
                      ? element.dataType !== "Date" &&
                        element.dataType !== "Dob" &&
                        element.dataType !== "DateTime"
                        ? val.applicantDetail.value[element.key]
                        : this.commonService.getTimezoneOffset(
                          new Date(val.applicantDetail.value[element.key]),
                          false
                        )
                      : "";
                  }

                }
              } else {
                if (
                  element.key === "addressPCC1" &&
                  val.reportDetail.value.npAddressFlag !== true
                ) {
                  rptval = this.concatAddress(val.reportDetail.value.address);
                  applicanttval = this.concatAddress(
                    val.applicantDetail.value.address
                  );
                } else if (
                  element.key === "addressPCC1" &&
                  val.reportDetail.value.npAddressFlag === true
                ) {
                  val.reportDetail.value.npAddressFlag = "Not Applicable";
                  rptval = val.reportDetail.value.npAddressFlag
                    ? val.reportDetail.value.npAddressFlag
                    : "";
                  applicanttval = this.concatAddress(
                    val.applicantDetail.value.address
                  );
                } else if (
                  element.key === "periodOfStay" ||
                  element.key === "periodOfStayFrom"
                ) {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : "";
                  applicanttval = val.applicantDetail.value[element.key]
                    ? val.applicantDetail.value[element.key]
                    : "";
                } else if (element.key === "periodOfStayTo") {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : "";
                  applicanttval = val.applicantDetail.value[element.key]
                    ? val.applicantDetail.value[element.key]
                    : "";
                } else if (element.key === "overallStayYears") {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : "";
                  applicanttval = val.applicantDetail.value[element.key]
                    ? val.applicantDetail.value[element.key]
                    : "";
                } else if (element.key === "latitude") {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : "";
                  applicanttval = val.applicantDetail.value[element.key]
                    ? val.applicantDetail.value[element.key]
                    : "";
                } else if (element.key === "longitude") {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : "";
                  applicanttval = val.applicantDetail.value[element.key]
                    ? val.applicantDetail.value[element.key]
                    : "";
                } else if (element.key === "caseDetailFlag") {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : false;
                } else if (element.key === "locationType") {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : "";
                  applicanttval = val.applicantDetail.value[element.key]
                    ? val.applicantDetail.value[element.key]
                    : "";
                } else if (element.key === "reportSourceName") {
                  rptval = val.reportDetail.value[element.key]
                    ? val.reportDetail.value[element.key]
                    : "";
                  applicanttval = val.applicantDetail.value[element.key]
                    ? val.applicantDetail.value[element.key]
                    : "";
                } else if (
                  element.key === "fatherName" ||
                  element.key === "dateOfBirth"
                ) {
                  rptval =
                    element.dataType !== "Date" && element.dataType !== "Dob"
                      ? val.reportDetail.value[element.key]
                      : this.commonService.getTimezoneOffset(
                        val.reportDetail.value[element.key],
                        false
                      );
                  // new Date();
                  applicanttval = val.applicantDetail.value[element.key]
                    ? element.dataType !== "Date"
                      ? val.applicantDetail.value[element.key]
                      : this.commonService.getTimezoneOffset(
                        new Date(val.applicantDetail.value[element.key]),
                        false
                      )
                    : "";
                } else {
                  if (
                    this.componentType === "jcr" &&
                    !val.reportDetail.value.address.hasOwnProperty(element.key)
                  ) {
                    rptval = val.reportDetail.value[element.key];
                  }
                  if (
                    val.reportDetail.value.address &&
                    val.reportDetail.value.address.hasOwnProperty(element.key)
                  ) {
                    rptval = val.reportDetail.value.address[element.key];
                  }

                  // rptval = (element.dataType !== 'Date') ? val['reportDetail'].value['address'][element.key]
                  //   : this.retDate(val['reportDetail'].value['address'][element.key]);
                  applicanttval = val.applicantDetail.value.address[element.key]
                    ? element.dataType !== "Date"
                      ? val.applicantDetail.value.address[element.key]
                      : this.getAsDateFormat(
                        new Date(val.applicantDetail.value.address[element.key])
                      )
                    : "";
                }
              }
              if (this.componentType === "jcr" && element.key !== "courtName" && element.key !== "jurisdiction" && element.key !== "location") {
                this.verContent.push({
                  caption: element.caption,
                  reportVal: rptval,
                  dataType: element.dataType,
                  applicanttVal: applicanttval,
                  key: element.key,
                  required: element.required,
                  minLength: element.minLength,
                  maxLength: element.maxLength,
                });
              }

              else if (this.componentType !== "jcr") {
                if (this.responseDocument.value.componentType === 'cRC' && element.key === "periodOfStayTo") {
                 
                } else {
                  this.verContent.push({
                    caption: element.caption,
                    reportVal: rptval,
                    dataType: element.dataType,
                    applicanttVal: applicanttval,
                    key: element.key,
                    required: element.required,
                    minLength: element.minLength,
                    maxLength: element.maxLength,
                  });
                }              
              }
            }
          }
        );
      }

      if (
        this.componentType === "education" ||
        //this.componentType === "criminalCheckPCC1PCC2" ||
        this.componentType === "emergencyContactVerification"
      ) {
        this.miscQnList = val.applicantDetail.value.miscellaneousQuestion;
      }
      if ((this.component.applicantDetail.address ? this.component.applicantDetail.address.addressPos != undefined ? this.component.applicantDetail.address.addressPos.length : 0 : 0 > 0) && (this.checkPOS())) {
        const dataLength = this.verContent.length;
        // tslint:disable-next-line:no-string-literal
        if (
          this.responseDocument.controls["component"]["controls"][
            "applicantDetail"
          ].value["address"]["addressPos"].length
        ) {
          // tslint:disable-next-line:no-string-literal
          const miscApp =
            this.responseDocument.controls["component"]["controls"][
              "applicantDetail"
            ].value["address"]["addressPos"];

          let i = 0;

          const miscRpt = this.responseDocument.controls["component"]["controls"][
            "reportDetail"
          ].value["address"] != null ? this.responseDocument.controls["component"]["controls"][
            "reportDetail"
          ].value["address"]["addressId"] != 0 ?
            this.responseDocument.controls["component"]["controls"][
              "reportDetail"
            ].value["address"]["addressPos"] : [] : [];

          miscApp.forEach((element, index) => {
            i = i + 1;
            this.verContent.forEach(e => {
              if (e.key == "addressPCC1") {
                this.NtFlag = e.reportVal == "Not Applicable" ? true : false;
              }
            })
            this.verContent.push(
              {
                caption: "Period Of Stay From " + i,
                reportVal: this.NtFlag != true ? miscRpt.length > 0 ? miscRpt[index] != undefined ? miscRpt[index].periodOfStay ? miscRpt[index].periodOfStay : element.periodOfStay : element.periodOfStay : element.periodOfStay : "Not Applicable",
                dataType: "pos",
                applicanttVal: element.periodOfStay,
                key: "PeriodOfStayFrom" + i,
                required: true,
                minLength: 2,
                maxLength: 700,
                maxDates: new Date(),
              },
              {
                caption: "Period Of Stay To " + i,
                reportVal: this.NtFlag != true ? miscRpt.length > 0 ? miscRpt[index] != undefined ? miscRpt[index].periodOfStayTo ? miscRpt[index].periodOfStayTo : element.periodOfStayTo : element.periodOfStayTo : element.periodOfStayTo : "Not Applicable",
                dataType: "pos",
                applicanttVal: element.periodOfStayTo,
                key: "PeriodOfStayTo" + i,
                required: true,
                minLength: 2,
                maxLength: 700,
                maxDates: new Date(),
              }
            );
          });
          // tslint:disable-next-line:no-string-literal

        }
      }

      //for JCR component added by megha
      if (this.component.reportDetail.jCRCourctDetailsVm ? this.component.reportDetail.jCRCourctDetailsVm != undefined ? this.component.reportDetail.jCRCourctDetailsVm.length : 0 : 0 > 0) {
        const dataLength = this.verContent.length;
        if (
          this.responseDocument.controls["component"]["controls"][
            "applicantDetail"
          ].value["jCRCourctDetailsVm"].length
        ) {
          const jcrApp =
            this.responseDocument.controls["component"]["controls"][
              "applicantDetail"
            ].value["jCRCourctDetailsVm"];

          let i = 0;

          this.component.reportDetail.jCRCourctDetailsVm.forEach((element, index) => {
            i = i + 1;

            this.verContent.push(
              {
                caption: "Court Name " + i,
                reportVal: element.courtName,
                dataType: element.dataType,
                applicanttVal: jcrApp[index].courtName,
                key: element.courtName + i,
                required: false,
                minLength: element.minLength,
                maxLength: element.maxLength,
              },
              {
                caption: "Jurisdiction " + i,
                reportVal: element.jurisdiction,
                dataType: element.dataType,
                applicanttVal: jcrApp[index].jurisdiction,
                key: element.jurisdiction + i,
                required: false,
                minLength: element.minLength,
                maxLength: element.maxLength,
              },
              {
                caption: "Location " + i,
                reportVal: element.location,
                dataType: element.dataType,
                applicanttVal: jcrApp[index].location,
                key: element.location + i,
                required: false,
                minLength: element.minLength,
                maxLength: element.maxLength,
              },
              {
                caption: "Verification Remarks " + i,
                reportVal: element.remarks,
                dataType: element.dataType,
                applicanttVal: jcrApp[index].remarks,
                key: element.remarks + i,
                required: false,
                minLength: element.minLength,
                maxLength: element.maxLength,
              }

            );
          });
          // tslint:disable-next-line:no-string-literal

        }
      }
    }
  }

  checkPOS() {
    if (this.verificationService.tempData.verificationScreeningDet.clientCategoryId === 4 && this.responseDocument.value.componentType === 'cRC') {
      return false;
    } else {
      return true;
    }
  }
  retDate(data: any): Date {
    const dateValue: Date = data;
    if (new Date(dateValue).getFullYear() <= 1980) {
      return new Date();
    }
    if (isNaN(new Date(dateValue).getDate())) {
      return new Date();
    } else {
      return new Date(dateValue);
    }
  }
  getAsDateFormat(dateValue: Date): string {
    if (isNaN(dateValue.getDate())) {
      return "N/A";
    }
    return (
      this.adZero(dateValue.getDate()) +
      "/" +
      this.adZero(dateValue.getMonth() + 1) +
      "/" +
      dateValue.getFullYear()
    );
  }

  adZero(val: any) {
    return ("" + val).length === 1 ? "0" + ("" + val) : "" + val;
  }

  initContactDat() {
    // if (this.contactData.length === 0) {
    // this.contactData = [
    //   {
    //     screeningContactTransId: 0, contactId: 0, contactLookup: '',
    //     contactLookupId: this.getContactlookIpID('Email'), contactData: ''
    //   },
    //   {
    //     screeningContactTransId: 0, contactId: 0, contactLookup: '',
    //     contactLookupId: this.getContactlookIpID('Business Phone'), contactData: ''
    //   }
    // ];
    // } else {
    if (
      this.contactData.filter((e) => e.contactLookup === "Email").length === 0
    ) {
      const emailLookUp = this.getContactlookIpID("Email");
      this.contactData.push({
        screeningContactTransId: 0,
        contactId: 0,
        contactLookup: "Email",
        contactLookupId: emailLookUp,
        contactData: "",
      });
    }
    if (
      this.contactData.filter((e) => e.contactLookup === "Business Phone")
        .length === 0
    ) {
      const phoneLookUp = this.getContactlookIpID("Business Phone");
      this.contactData.push({
        screeningContactTransId: 0,
        contactId: 0,
        contactLookup: "Business Phone",
        contactLookupId: phoneLookUp,
        contactData: "",
      });
    }
  }
 //Added by megala SRS - VTS2-2024-CRT-0195 
 camRejectionComments(){
  this.dialogRef = this.dialog.open(this.rejectionPopUP, {
    width: '800px',
  });
}
 //ended by megala SRS - VTS2-2024-CRT-0195 

  async updateContactDetails(from: "Destroy" | "updateData", fm?) {
    // if (fm && fm.form.invalid) {
    //   fm.form.markAllAsTouched();
    //   return;
    // }
    if (this.contactDet.controls.colorStatusLookupId.value === 0) {
      this.contactDet.get("colorStatusLookupId").setValue(null);
    } else if (this.contactDet.controls.colorStatusLookupId.value > 0) {
      this.contactDet.value.colorStatusLookupId =
        this.contactDet.controls.colorStatusLookupId.value;
        this.contactDet.value.camApprovalId =
        // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
        this.contactDet.controls.camApprovalId.value;
        this.contactDet.value.scenarioTypeId =
        this.contactDet.controls.scenarioTypeId.value;
        if ((this.componentType === 'education' || this.componentType === 'employee' ||  this.componentType === 'currentemployee'  ||  
        this.componentType === 'previousemployee'))
        //  && (this.verificationService.tempData.verificationScreeningDet.ctsFlag ===
        //   false && this.verificationService.tempData.verificationScreeningDet.clientCategoryId !== 4)) 
          {        
      if (
        (this.contactDet.value.colorStatus =
          this.colorStatus
            .filter(
              (e) =>
                e.lookUpId ===
                this.contactDet.controls.colorStatusLookupId.value
            )[0]
            .lookUpName.toLowerCase() == "red") 
            //Revert code for sprint13-VTS2-2023-EMP-0109
            // || 
            // ((this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Minor Discrepancy"
            // ||
            // this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Unverified"
            // ||
            // this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Verified Amber")
            // && (this.componentType === 'employee' ||  this.componentType === 'currentemployee'  ||  
            // this.componentType === 'previousemployee'))
          )
      {
        this.commonService.MvTlFlag = true;
      } else {
        this.commonService.MvTlFlag = false;
      }
    }
    else{
      this.commonService.MvTlFlag = false;
    }
    }
    if (this.componentType === 'jcr' && this.verificationService.tempData.verificationScreeningDet.removeContactDetailsFlag == true) {
      this.contactDet.get("colorStatusLookupId").clearValidators();
      this.contactDet.get("contactPersonDesign").clearValidators();
      this.contactDet.get("scenarioTypeId").clearValidators();
      this.contactDet.get("camApprovalId").clearValidators();
      this.contactDet.get("scenarioTypeId").updateValueAndValidity();
      this.contactDet.get("camApprovalId").updateValueAndValidity();
      this.contactDet.get("colorStatusLookupId").updateValueAndValidity();
      this.contactDet.get("contactPersonDesign").updateValueAndValidity();
    }
    if (
      (!this.contactDet.valid && from === "updateData") ||
      (fm && fm.form.invalid)
    ) {
      this.contactDetailsEdit = true;
      this.contactDet.markAllAsTouched();
      fm.form.markAllAsTouched();
      this.commonService.scrollToTop();
      return;
    }
    let misqList: any[] = [];
    if (this.verContent.length > 0) {
      let misqCount = this.verContent.filter(
        (x) => x.dataType === "misq"
      ).length;
      await this.verContent.forEach((element, index) => {
        if (element.dataType === "misq" && !element.reportVal) {
          if (fm) {
            fm.form.get("miscQues" + index).setValidators(Validators.required);
            fm.form.get("miscQues" + index).markAllAsTouched();
            fm.form.get("miscQues" + index).updateValueAndValidity();
          }
        }
        if (element.key === "candidateName") {
          this.component.reportDetail.firstName = element.reportVal;
        } else {
          this.component.reportDetail[element.key] = element.reportVal;
        }
        if (this.component.applicantDetail.jCRCourctDetailsVm != null && this.component.applicantDetail.jCRCourctDetailsVm.length > 0) {
          this.component.applicantDetail.jCRCourctDetailsVm.forEach((e, i) => {
            let j = i + 1;
            if (element.applicanttVal === e.courtName && element.caption === "Court Name " + j) {
              this.component.reportDetail.jCRCourctDetailsVm[i].courtName = element.reportVal;
            }
            if (element.applicanttVal === e.jurisdiction && element.caption === "Jurisdiction " + j) {
              this.component.reportDetail.jCRCourctDetailsVm[i].jurisdiction = element.reportVal;
            }
            if (element.applicanttVal === e.location && element.caption === "Location " + j) {
              this.component.reportDetail.jCRCourctDetailsVm[i].location = element.reportVal;
            }
            if (element.applicanttVal === e.remarks && element.caption === "Verification Remarks " + j) {
              this.component.reportDetail.jCRCourctDetailsVm[i].remarks = element.reportVal;
            }
          });
        }
        if (element.dataType === "misq" && element.reportVal && misqCount > 0) {
          if (
            misqCount !==
            this.component.reportDetail.miscellaneousQuestion.length
          ) {
            this.component.reportDetail[element.key] = element.reportVal;
            let ansList: any[] = [];
            if (
              this.component.reportDetail.miscellaneousQuestion.filter(
                (x) => x.miscId > 0
              ).length > 0 &&
              this.component.reportDetail.miscellaneousQuestion.filter(
                (x) => x.miscAnswer === element.reportVal
              ).length === 0
            ) {
              const obj = {
                createdDate: null,
                defaultQuestionFlag: true,
                miscAnswer: element.reportVal,
                miscId: 0,
                miscQuestion: element.caption,
              };
              ansList.push(obj);
              this.component.reportDetail.miscellaneousQuestion.push(
                ansList[0]
              );
            }
          } else {
            misqList.push(element.reportVal);
            if (misqList.length > 0) {
              misqList.forEach((element, i) => {
                this.component.reportDetail.miscellaneousQuestion[
                  i
                ].miscAnswer = element;
              });
            }
          }
        }
      });
    }
    this.initContactDat();
    if (
      this.contactData.filter((e) => e.contactLookup === "Email").length > 0
    ) {
      this.contactData.filter(
        (e) => e.contactLookup === "Email"
      )[0].contactData = this.contactDet.controls.contactEmail.value;
    }
    if (
      this.contactData.filter((e) => e.contactLookup === "Business Phone")
        .length > 0
    ) {
      this.contactData.filter(
        (e) => e.contactLookup === "Business Phone"
      )[0].contactData = this.contactDet.controls.contactPersonPhone.value;
    }
    if (
      (this.componentType === "address" ||
        this.componentType === "panIndiaOCRV" || this.componentType === "license" || this.componentType === "creditVerification") &&
      this.component.reportDetail.addressPCC1 === "Not Applicable"
    ) {
      this.component.reportDetail.address = this.addressData.getValue();
      this.component.reportDetail.npAddressFlag = true;
    }
    this.contactDet.value.verificationContactTrans = this.contactData;
    this.updateColorName();
    this.contactDet.value.screeningCompId =
      this.verificationService.tempData.verificationScreeningDet.screeningCompId;
    this.contactDet.value.colorStatusLookupId = this.contactDet.get(
      "colorStatusLookupId"
    ).value;
    this.component.reportDetail[this.reportContactFlag] = this.contactDet.value;
    this.component.reportDetail[this.reportContactFlag].colorStatusLookupId =
      this.contactDet.get("colorStatusLookupId").value;
    this.component.reportDetail.loggedIn = this.userData.userId;
    // if (this.componentType === 'employee' || this.componentType === 'criminalCheckPCC1PCC2') {
    //   this.checkMiscQns('save');
    //   this.component.reportDetail.miscellaneousQuestion = this.miscForm.value.misc;
    // }
    if (from === "Destroy") {
      this.component.reportDetail.middleName = "";
      this.component.reportDetail.lastName = "";
    }
    if (from === "updateData") {
      // const data = this.sendRetrieveDateAsGMT(this.component['reportDetail'], true);
      this.saveRptDetails(this.component.reportDetail);
    }
  }
  getErrorAlert() {
    if (
      this.verificationService.isFinalReport === true &&
      this.verificationService.pdfvalue &&
      !(
        this.verificationService.pdfvalue.fileName &&
        this.verificationService.pdfvalue.filePath
      )
    ) {
      this.showTopCenter("warn", "Failure Message", "Pdf is not generated");
    }
  }
  checkdatabaseQns(type: "save" | "add"): boolean {
    const removeIndex: any[] = [];
    let check = true;
    const dbLength = +(this.databaseForm.get("dbase") as UntypedFormGroup).controls
      .length;
    if (dbLength === 0) {
      (this.databaseForm.value.misc as UntypedFormArray).setValue([]);
    }

    for (let index = 0; index < dbLength; index++) {
      const formValid = (
        (this.databaseForm.get("dbase") as UntypedFormGroup).controls[index] as UntypedFormGroup
      ).invalid;
      if (formValid) {
        if (type === "add") {
          (
            (this.databaseForm.get("dbase") as UntypedFormGroup).controls[
            index
            ] as UntypedFormGroup
          ).markAsTouched();
          check = false;
        } else {
          removeIndex.push(index);
        }
      }
    }

    if (type === "save" && removeIndex.length > 0) {

      let remIndex = 0;
      removeIndex.forEach((element, index) => {

        ((this.databaseForm.get("dbase") as UntypedFormArray as any).controls as []).splice(
          element - remIndex,
          1
        );
        remIndex++;
      });
    }
    return check;
  }
  checkMiscQns(type: "save" | "add"): boolean {
    const removeIndex: any[] = [];
    let check = true;
    const miscLength = +(this.miscForm.get("misc") as UntypedFormGroup).controls
      .length;
    if (miscLength === 0) {
      (this.miscForm.value.misc as UntypedFormArray).setValue([]);
    }
    // if (this.miscForm.get('misc') as UntypedFormGroup) {
    for (let index = 0; index < miscLength; index++) {
      const formValid = (
        (this.miscForm.get("misc") as UntypedFormGroup).controls[index] as UntypedFormGroup
      ).invalid;
      if (formValid) {
        if (type === "add") {
          (
            (this.miscForm.get("misc") as UntypedFormGroup).controls[
            index
            ] as UntypedFormGroup
          ).markAsTouched();
          check = false;
        } else {
          removeIndex.push(index);
        }
      }
    }
    // }
    if (type === "save" && removeIndex.length > 0) {
      // if ((((this.miscForm.get('misc') as UntypedFormArray) as any).controls as UntypedFormGroup).invalid){

      // }
      let remIndex = 0;
      removeIndex.forEach((element, index) => {
        // ((this.miscForm.get('misc.controls') as UntypedFormGroup) as any).splice(element - remIndex, 1);
        ((this.miscForm.get("misc") as UntypedFormArray as any).controls as []).splice(
          element - remIndex,
          1
        );
        remIndex++;
      });
    }
    return check;
  }
  checkAddress(type: "save" | "add"): boolean {
    const removeIndex: any[] = [];
    let check = true;
    const miscLength = +(this.AddressForm.get("misc") as UntypedFormGroup).controls
      .length;
    if (miscLength === 0) {
      (this.AddressForm.value.misc as UntypedFormArray).setValue([]);
    }
    // if (this.miscForm.get('misc') as UntypedFormGroup) {
    for (let index = 0; index < miscLength; index++) {
      const formValid = (
        (this.AddressForm.get("misc") as UntypedFormGroup).controls[index] as UntypedFormGroup
      ).invalid;
      if (formValid) {
        if (type === "add") {
          (
            (this.AddressForm.get("misc") as UntypedFormGroup).controls[
            index
            ] as UntypedFormGroup
          ).markAsTouched();
          check = false;
        } else {
          removeIndex.push(index);
        }
      }
    }
    // }
    if (type === "save" && removeIndex.length > 0) {
      // if ((((this.miscForm.get('misc') as UntypedFormArray) as any).controls as UntypedFormGroup).invalid){

      // }
      let remIndex = 0;
      removeIndex.forEach((element, index) => {
        // ((this.miscForm.get('misc.controls') as UntypedFormGroup) as any).splice(element - remIndex, 1);
        ((this.miscForm.get("misc") as UntypedFormArray as any).controls as []).splice(
          element - remIndex,
          1
        );
        remIndex++;
      });
    }
    return check;
  }

  saveRptDetails(data: any) {
    this.component.reportDetail = data;
    const Addressvalue = this.AddressForm ? this.AddressForm.get("misc") as UntypedFormArray : null;
    if (Addressvalue ? Addressvalue.length : 0 > 0) {
      const addData = Addressvalue.value.filter(x => x.periodOfStay != null)
      this.component.reportDetail["address"]["addressPos"] = addData;
    }

    this.component.reportDetail.componentCustomFields = this.customFieldRpt;
    try {
      if (
        this.component.reportDetail.miscellaneousQuestion &&
        (this.componentType == "employmentHrAndSupervisor")
      ) {
        this.component.reportDetail.miscellaneousQuestion =
          this.miscForm.get("misc").value;
      }
      if (this.componentName !== 'OFAC' &&
        this.component.reportDetail.recordCheckCategory && this.verificationService.tempData.verificationScreeningDet.clientCategoryId === 4 &&
        (this.componentType === "criminalDatabase")
      ) {

        this.component.reportDetail.recordCheckCategory =
          this.databaseForm.get("dbase").value;

      }

      if (
        (this.componentType === "address" ||
          this.componentType === "panIndiaOCRV") &&
        this.component.reportDetail.addressPCC1 !== "Not Applicable"
      ) {
        this.component.reportDetail.npAddressFlag = false;
      } else if (
        (this.componentType === "address" ||
          this.componentType === "panIndiaOCRV") &&
        this.component.reportDetail.addressPCC1 === "Not Applicable"
      ) {
        this.component.reportDetail.npAddressFlag = true;
      }
      // if (this.component.reportDetail.miscellaneousQuestion && (this.componentType === 'referenceCheck' || this.componentType === 'referenceSelfEmployed'
      //   || this.componentType === 'employmentSupervisor' || this.componentType == 'socialMedia'
      //   || this.componentType === 'uan' || this.componentType === 'companySiteVisit'
      //   || this.componentType === 'emergencyContactVerification' || this.componentType === 'education' || this.componentType === 'employee'
      // )) {
      //   if (this.component.reportDetail.miscellaneousQuestion.length) {
      //     // const rptDatalength = this.verContent.length - this.component.reportDetail.miscellaneousQuestion.length;
      //     // this.component.reportDetail.miscellaneousQuestion.forEach((element, index) => {
      //     //   element.miscAnswer = this.verContent[index + rptDatalength].reportVal;
      //     this.component.reportDetail.miscellaneousQuestion.forEach((element, index) => {
      //       element.miscAnswer = this.verContent.filter(e => e.caption === element.miscQuestion)[0].reportVal;
      //     });
      //   }
      // }

      if (this.component.reportDetail.componentCustomFields) {
        this.component.reportDetail.componentCustomFields.forEach(
          (element, index) => {
            element.fieldValue = this.verContent.filter(
              (e) => e.caption === element.fieldName
            )[0].reportVal;
          }
        );
      }

      this.component.reportDetail[
        this.componentType + "ReportContact"
      ].contactDate = this.commonService.getTimezoneOffset(
        this.contactDet.controls.contactDate.value,
        false
      );
      this.component.reportDetail[
        this.componentType + "ReportContact"
      ].verificationReceivedDate = this.commonService.getTimezoneOffset(
        this.contactDet.controls.verificationReceivedDate.value,
        false
      );
      const compName =
        this.componentType.charAt(0).toUpperCase() +
        this.componentType.slice(1);
      if (this.componentType == 'pan') {
        data.dob = this.dateP.transform(data.dob, 'yyyy-MM-dd HH:mm:ss');
      } else if (this.componentType == 'passport') {
        data.dateOfBirth = this.dateP.transform(data.dateOfBirth, 'yyyy-MM-dd HH:mm:ss');
        data.expiryDate = this.dateP.transform(data.expiryDate, 'yyyy-MM-dd HH:mm:ss');
      }
      this.verificationService
        .saveResponseDocumentDetails(data, compName)
        .subscribe(
          (res) => {
            if (res.success) {   
              if(this.commonService.MVCamFlag == true)   {
                this.commonService.MVCamRjFlag = true;
              }        
              // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - condition altered by Naveen
              if (this.verificationService.tempData.verificationScreeningDet.ctsFlag ===
                true && (this.verificationForm.value.responseDocument.componentName ===
                  "Database" || this.verificationForm.value.responseDocument.componentName ===
                  "Online CRC" || this.verificationForm.value.responseDocument.componentName ===
                  "Gap Check") || (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === true) || 
                  (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === false)) {
                this.getFinalReprt('download');
              }
              for (const property in this.component.reportDetail) {
                if (property.endsWith("ddress")) {
                  this.component.reportDetail[property].addressPos = res.addressPOS;
                  if (this.responseDocument["controls"]["component"]["controls"]["reportDetail"].value.address.addressPos != undefined) {
                    this.responseDocument["controls"]["component"]["controls"]["reportDetail"].value.address.addressPos = res.addressPOS;
                    for (let index = 0; index < +this.component.reportDetail.address.addressPos.length; index++) {
                      // (this.miscForm.controls[index] as UntypedFormGroup).setValue(this.component['reportDetail'].miscellaneousQuestion[index])
                      // tslint:disable-next-line:no-string-literal

                      (
                        this.AddressForm.controls["misc"]["controls"][index] as UntypedFormGroup
                      ).setValue(this.component.reportDetail.address.addressPos[index]);
                    }
                  }
                } else if (property.endsWith("RptId")) {
                  this.component.reportDetail[property] = res.screeningRptId;
                } else if (property.endsWith("ReportContact")) {
                  for (const el in this.component.reportDetail[property]) {
                    if (el === "verificationContactTrans") {
                      for (
                        let i = 0;
                        this.component.reportDetail[property]
                          .verificationContactTrans.length > i;
                        i++
                      ) {
                        this.component.reportDetail[
                          property
                        ].verificationContactTrans[i].contactId = res.contactId[
                          i
                        ]
                            ? res.contactId[i]
                            : 0;
                        this.component.reportDetail[
                          property
                        ].verificationContactTrans[i].screeningContactTransId =
                          res.screeningRptContactTransId[i]
                            ? res.screeningRptContactTransId[i]
                            : 0;
                      }
                    } else if (el === "screeningReportContactId") {
                      // tslint:disable-next-line:no-string-literal
                      this.responseDocument["controls"]["component"][
                        "controls"
                      ]["reportContact"]["controls"][
                        // tslint:disable-next-line:no-string-literal
                        "screeningReportContactId"
                      ].setValue(res.screeningRptContactId);
                      this.component.reportDetail[property][el] =
                        res.screeningRptContactId;
                    }
                  }
                }
              }
              // tslint:disable-next-line:no-string-literal
              this.responseDocument.controls["component"]["controls"][
                "reportDetail"
              ].value["middleName"] = "";
              // tslint:disable-next-line:no-string-literal
              this.responseDocument.controls["component"]["controls"][
                "reportDetail"
              ].value["lastName"] = "";
              this.fontColor =
                this.verificationService.tempData.responseDocument.component[0][
                  this.reportDetFlag
                ].fontColorStatus = true;
              this.showTopCenter(
                "success",
                "Success Message",
                "Updated Successfully"
              );
            }
          },
          (err) => { },
          () => {
            this.contactDetailsEdit = false;
          }
        );
    } catch (error) {
      console.error(error);
      // this.component.reportDetail = this.sendRetrieveDateAsGMT(this.component['reportDetail'], false);
    }
  }

  updateColorName() {
    if (this.contactDet.controls.colorStatusLookupId.value) {
      this.contactDet.value.colorStatus = this.colorStatus.filter(
        (e) => e.lookUpId === this.contactDet.controls.colorStatusLookupId.value
      )[0].lookUpName;
    } else {
      return null;
    }
  }
   // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
  updateScenarioType() {
    if (this.contactDet.controls.scenarioTypeId.value) {
      this.contactDet.value.scenarioTypeId = this.scenarioTypeStatus.filter(
        (e) => e.lookUpId === this.contactDet.controls.scenarioTypeId.value
      )[0].lookUpName;
    } else {
      return null;
    }
  }
  updateCamApproval() {
    if (this.contactDet.controls.camApproval.value) {
      this.contactDet.value.camApprovalId = this.camFlagStatus.filter(
        (e) => e.lookUpId === this.contactDet.controls.camApproval.value
      )[0].lookUpName;
    } else {
      return null;
    }
  }
  updateValidation(){
    if(this.verificationService.tempData.verificationScreeningDet.isDisableClosureFlag == false){
      const CamApprvalId= this.commonService.camFlagStatus.filter(f=>f.lookUpName == this.commonService.CAM_STATUS_YES)[0].lookUpId;
    if(this.contactDet.controls.camApprovalId.value == CamApprvalId){
      this.commonService.MVCamFlag = true;
      this.commonService.MVCamRjFlag =true;
      this.contactDet.get('scenarioTypeId')?.setValidators(Validators.required);
      this.contactDet.get('scenarioTypeId')?.updateValueAndValidity();
    }else{
      this.commonService.MVCamFlag = false;
      this.commonService.MVCamRjFlag =false;
      this.contactDet.get('scenarioTypeId')?.setValidators([]); // or clearValidators()
      this.contactDet.get('scenarioTypeId')?.updateValueAndValidity();
    }
  }else{
    this.commonService.MVCamFlag = false;
    this.commonService.MVCamRjFlag =false;
    this.contactDet.get('camApproval')?.setValidators([]); // or clearValidators()
    this.contactDet.get('camApproval')?.updateValueAndValidity();
    this.contactDet.get('camApprovalId')?.setValidators([]); // or clearValidators()
    this.contactDet.get('camApprovalId')?.updateValueAndValidity();
    this.contactDet.get('scenarioTypeId')?.setValidators([]); // or clearValidators()
    this.contactDet.get('scenarioTypeId')?.updateValueAndValidity();
  }
  }
 // Ended By Megala - For (sprint -22) VTS2-2024-CRT-0195
  updateContactDetail() {
    this.documentEditForm.ngSubmit.emit();
    if (this.contactDet.valid) {
      this.contactDetailsEdit = false;
    }
  }

  
  
  getCamFlagName(): string {
    if (this.contactDet.controls.camApprovalId.value > 0) {    
      const CamApprvalId= this.commonService.camFlagStatus.filter(f=>f.lookUpName == this.commonService.CAM_STATUS_YES)[0].lookUpId;
      if(this.contactDet.controls.camApprovalId.value == CamApprvalId){
        this.commonService.MVCamFlag = true;
      }
      return (this.contactDet.value.camApproval = this.camFlagStatus.filter(
        (e) => e.lookUpId === this.contactDet.controls.camApprovalId.value
      )[0].lookUpName);
    } else {
      return null;
    }
  }
  
  getScenarioTypeName(): string {
    if (this.contactDet.controls.scenarioTypeId.value > 0) {      
      return (this.contactDet.value.scenarioType = this.scenarioTypeStatus.filter(
        (e) => e.lookUpId === this.contactDet.controls.scenarioTypeId.value
      )[0].lookUpName);
    } else {
      return null;
    }
  }
  
  getColorName(): string {
    if (this.contactDet.controls.colorStatusLookupId.value > 0) {
      if ((this.componentType === 'education' || this.componentType === 'employee' ||  this.componentType === 'currentemployee'  ||  
      this.componentType === 'previousemployee' ))
      //  && (this.verificationService.tempData.verificationScreeningDet.ctsFlag ===
      //   false && this.verificationService.tempData.verificationScreeningDet.clientCategoryId !== 4)) 
        {      
      if (
        (this.contactDet.value.colorStatus =
          this.colorStatus
            .filter(
              (e) =>
                e.lookUpId ===
                this.contactDet.controls.colorStatusLookupId.value
            )[0]
            .lookUpName.toLowerCase() == "red" 
            //Revert code for sprint13-VTS2-2023-EMP-0109
            // ||  ((this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Minor Discrepancy"
            // ||
            // this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Unverified"
            // ||
            // this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Verified Amber")
            // && (this.componentType === 'employee' ||  this.componentType === 'currentemployee'  ||  
            // this.componentType === 'previousemployee'))
        )
      ) {
        this.commonService.MvTlFlag = true;
      } else {
        this.commonService.MvTlFlag = false;
      }
    }
    else{
      this.commonService.MvTlFlag = false;
    }
      return (this.contactDet.value.colorStatus = this.colorStatus.filter(
        (e) => e.lookUpId === this.contactDet.controls.colorStatusLookupId.value
      )[0].lookUpName);
    } else {
      return null;
    }
  }

  getContactlookIpID(lookUpName): number {
    if (this.contacttype.length > 0) {
      return this.contacttype.filter((e) => e.lookUpName === lookUpName)[0]
        .lookUpId;
    } else {
      return 0;
    }
  }

  getContactName(lookUpName): string {
    if (this.contactData.length === 0) {
      return this.contactData.filter((e) => e.contactLookup === lookUpName)[0]
        .contactData;
    } else {
      return null;
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  // private sub: Subscription;

  // sendMail() {
  //   this.verificationService.previewData = {
  //     verForm: this.verificationForm,
  //     qcVal: this.sendMailToQc.value,
  //   };
  //   // this.sub = 
  //   this.verificationService.sendMailToQc(this.sendMailToQc.value).subscribe(
  //     (res) => {
  //       if (res.success) {
  //         // this.getFinalReprt();
  //         this.showTopCenter(
  //           "success",
  //           "Success Message",
  //           "Notification Sent Successfully"
  //         );
  //         this.router.navigate(["dashboard/verification/verification"]);
  //         this.verificationService.assignedOrNotAssigned =
  //           this.verificationService.assControl;
  //       } else {
  //         this.showTopCenter("warn", "Failure Message", "Record not sent");
  //       }
  //       // setTimeout(() => {
  //       //   this.sub.unsubscribe();
  //       // }, 500);
  //     },
  //     (err) => { },
  //     () => {
  //       this.verificationService.pdfvalue = null;
  //       this.router.navigate(["dashboard/verification/verification"]);
  //       this.dialog.closeAll();
  //     }
  //   );
  // }
  sendMail() {
    // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
    if ((this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === true) || (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === false)) {
      this.getFinalReprtBasedOnConfig('download');
    } else {
      // VTS2 - 2023 - INT - 0135 - moveToqc new method added seperately because of color code not binded in mail template & fonal report list when we enable both auto IQC and auto FQC flag in client setting. - By Naveen
      this.moveToqc();
    }    
  }
  moveToqc() {
    this.initsendMailToQcForm();
    this.verificationService.previewData = {
      verForm: this.verificationForm,
      qcVal: this.sendMailToQc.value,
    };
    // this.sub = 
    this.verificationService.sendMailToQc(this.sendMailToQc.value).subscribe(
      (res) => {
        if (res.success) {
          // this.getFinalReprt();
          this.showTopCenter(
            "success",
            "Success Message",
            "Notification Sent Successfully"
          );
          this.router.navigate(["dashboard/verification/verification"]);
          this.verificationService.assignedOrNotAssigned =
            this.verificationService.assControl;
        } else {
          this.showTopCenter("warn", "Failure Message", "Record not sent");
        }
        // setTimeout(() => {
        //   this.sub.unsubscribe();
        // }, 500);
      },
      (err) => { },
      () => {
        this.verificationService.pdfvalue = null;
        this.router.navigate(["dashboard/verification/verification"]);
        this.dialog.closeAll();
      }
    );
  }

  openDialog(
    templateRef: TemplateRef<any>,
    height,
    width,
    tempName: string = null
  ) {

    if (this.responseDocument.controls["component"]["controls"].reportDetail.value.address === null || this.responseDocument.controls["component"]["controls"].reportDetail.value.address.addressId === 0) {
      this.component.reportDetail.address = this.component.applicantDetail.address;
      this.AddressForm = this.fb.group({
        misc: this.fb.array([this.createAddressForm()]),
      });
      for (let index = 0; index < +this.component.applicantDetail.address.addressPos.length; index++) {

        (this.AddressForm.controls["misc"]["controls"][index] as UntypedFormGroup).setValue(this.component.reportDetail.address.addressPos[index]);

        this.component.reportDetail.address.addressPos[index].reportFlag = true;
        this.component.reportDetail.address.addressPos[index].addressPosId = 0;
        this.addAdd("initial");
      }

      this.responseDocument.controls["component"]["controls"].reportDetail.value.address = this.responseDocument.controls["component"]["controls"].applicantDetail.value.address;

    }

    if (tempName === "mailTemplate") {
      // this.getMailData();
      // this.getFinalReprt();
    }
    if (height) {
      this.dialog.open(templateRef, {
        disableClose: true,
        height,
        width,
      });
    } else {
      this.dialog.open(templateRef, {
        disableClose: true,
      });
    }
  }
  public openDialogTl() {
    const popupData = {
      action: this.commonService.APPROVE,
      headerText: "Confirmation",
      bodyText: "Do you want move to Verification Team Leader?",
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "320px",
      data: popupData,
      disableClose: true,
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const action = String(result.type);
          if (action === this.commonService.APPROVE) {
            this.sendToTl();
            this.verificationService.isFinalReport = false;
          }
        }
      });
    }
  }
   //Added by megala SRS - VTS2-2024-CRT-0195
   public openDialogCAM() {
    if(this.contactDet.valid){
    const popupData = {
      action: this.commonService.APPROVE,
      headerText: "Confirmation",
      bodyText: "Would you like to send this case for CAM approval?",
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "320px",
      data: popupData,
      disableClose: true,
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const action = String(result.type);
          if (action === this.commonService.APPROVE) {
            this.sendToCam();
            this.verificationService.isFinalReport = false;
          }
        }
      });
    }
  }else{
    this.contactDet.markAllAsTouched();
    return;
  }
  }
  sendToCam(){
    this.verificationToCAMApprovalVM.camApprovalId = this.contactDet.controls.camApprovalId.value;
    this.verificationToCAMApprovalVM.scenarioTypeId = this.contactDet.controls.scenarioTypeId.value;
    this.verificationToCAMApprovalVM.screeningCompId =this.verificationService.tempData.verificationScreeningDet.screeningCompId ;
    this.verificationToCAMApprovalVM.loggedIn =this.userData.userId ;
    this.verificationToCAMApprovalVM.screeningId = this.verificationService.tempData.screeningId ;
    this.verificationToCAMApprovalVM.colorStatusLookupId = this.contactDet.value.colorStatusLookupId;
    if(this.commonService.MVCamRjFlag === true && this.verificationService.tempData.verificationScreeningDet.camRejectStatus != null && this.verificationService.tempData.verificationScreeningDet.camRejectStatus === 'Rejection'){
      this.verificationService
        .CamRejectToCAMApproval(this.verificationToCAMApprovalVM)
        .subscribe((res) => {
          if (res) {
            this.commonService.MVCamRjFlag = false;
            this.showTopCenter(
              "success",
              "Success Message",
              "Case Send Successfully"
            );
            this.router.navigate(["dashboard/verification/verification"]);
            this.dialog.closeAll();
          } else {
            this.showTopCenter("warn", "Failure Message", "Record not sent");
          }

        });
    } else {
      this.verificationService
        .sendMailToCAM(this.verificationToCAMApprovalVM)
        .subscribe((res) => {
          if (res) {
            this.commonService.MVCamRjFlag = false;
            this.showTopCenter(
              "success",
              "Success Message",
              "Case Send Successfully"
            );
            this.router.navigate(["dashboard/verification/verification"]);
            this.dialog.closeAll();
          } else {
            this.showTopCenter("warn", "Failure Message", "Record not sent");
          }

        });
    }
  }
    // ended By Megala - For (sprint -22) VTS2-2024-CRT-0195

  public openDialogQc() {
    const popupData = {
      action: this.commonService.APPROVE,
      headerText: "Confirmation",
      bodyText: "Do you want move to QC?",
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "320px",
      data: popupData,
      disableClose: true,
	    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const action = String(result.type);
          if (action === this.commonService.APPROVE) {
            this.confirmationDialog();
            // this.sendMail();
            // this.verificationService.isFinalReport = false;
          }
        }
      });
    }

  }
  continuetoQc() {
    this.dialogRef.close({
      type: this.commonService.APPROVE,
    });
  }
  public confirmationDialog() {
    if (this.verificationService.tempData.empInsMasterDet.forResearchFlag && this.verificationService.tempData.empInsMasterDet.underReviewStatus !== null) {
      this.headerText = 'Alert!'
      this.messageOne = 'This employer is in Under Review queue as ';
      this.messagetwo = ' status, do you want to move the case to QC?';
      this.UnderReviewStatusName = this.verificationService.tempData.empInsMasterDet.underReviewStatus;

      this.dialogRef = this.dialog.open(this.UnderReviewFR, {
        width: '320px',
        disableClose: true
      });
      if (this.dialogRef) {
        this.dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            const action = String(result.type);
            if (action === this.commonService.APPROVE) {
              this.sendMail();
              this.verificationService.isFinalReport = false;
            }
          }
        });
      }
    } else {
      this.sendMail();
      this.verificationService.isFinalReport = false;
    }
  }

  sendToTl() {
    this.verificationService
      .sendMailToTl(
        "Red",
        this.verificationService.tempData.verificationScreeningDet
          .screeningCompId,
        this.userData.teamName
      )
      .subscribe((res) => {
        if (res) {
          this.showTopCenter(
            "success",
            "Success Message",
            "Case Send Successfully"
          );
          this.router.navigate(["dashboard/verification/verification"]);
          this.dialog.closeAll();
        } else {
          this.showTopCenter("warn", "Failure Message", "Record not sent");
        }
      });
  }
  notProvide() {
    let data: any;
    data = this.verContent.find((x) => x.key === "addressPCC1");
    this.NtFlag = true;
    if (data) {
      data.reportVal = "Not Applicable";
      this.dialog.closeAll();
      this.verContent.forEach(e => {
        if (e.key.startsWith("PeriodOfStay")) {
          e.reportVal = "Not Applicable"
        }
      })

      return data.reportVal;
    }

  }
  setAddress() {
    let data: any;
    data = this.verContent.find((x) => x.caption === "Address");
    if (data) {
      data.reportVal = this.addressData.value ? this.concatAddress(this.addressData.value)
        : "Not Applicable";
      this.dialog.closeAll();
      return data.reportVal;
    }
  }
  closeDialog() {
    if (this.addressFormGroup.valid) {
      let data: any;
      let candidateName: any;
      this.addressData = new BehaviorSubject(
        this.addressFormGroup.value.address
      );
      this.addressData.next(this.addressFormGroup.value.address);

      if (this.addressData.value.addressId == 0 && this.addressData.value.countryId != 0) {
        if (this.component.reportDetail.address.addressPos.length == 0) {
          this.component.reportDetail.address.addressPos = this.component.applicantDetail.address.addressPos;
          for (let index = 0; index < +this.component.applicantDetail.address.addressPos.length; index++) {
            this.component.reportDetail.address.addressPos[index].reportFlag = true;
            this.component.reportDetail.address.addressPos[index].addressPosId = 0;
            this.component.reportDetail.address.addressPos[index].addressId = 0;
            (this.AddressForm.controls["misc"]["controls"][index] as UntypedFormGroup).setValue(this.component.reportDetail.address.addressPos[index]);
            this.verContent.forEach(e => {
              if (e.key = "PeriodOfStay" + (index + 1)) {
                e.reportVal = this.component.reportDetail.address.addressPos[index].periodOfStay;
              }
              if (e.key = "PeriodOfStayTo" + (index + 1)) {
                e.reportVal = this.component.reportDetail.address.addressPos[index].periodOfStayTo;
              }
            })

            this.addAdd("initial");
          }
        } else if (this.component.reportDetail.address.addressPos.length != 0) {
          for (let index = 0; index < +this.component.reportDetail.address.addressPos.length; index++) {
            this.component.reportDetail.address.addressPos[index].reportFlag = true;
            this.component.reportDetail.address.addressPos[index].addressPosId = 0;
            this.component.reportDetail.address.addressPos[index].addressId = 0;
            (this.AddressForm.controls["misc"]["controls"][index] as UntypedFormGroup).setValue(this.component.reportDetail.address.addressPos[index]);
            if (this.NtFlag == true) {
              const inpos = index + 1;
              this.verContent.forEach(e => {
                if (e.key == "PeriodOfStayFrom" + inpos) {
                  e.reportVal = this.component.reportDetail.address.addressPos[index].periodOfStay;
                }
                if (e.key == "PeriodOfStayTo" + inpos) {
                  e.reportVal = this.component.reportDetail.address.addressPos[index].periodOfStayTo;
                }
              })
            }
            this.addAdd("initial");
          }
        }

      }

      this.setAddress();
      this.NtFlag = false;
      // this.addressData = this.addressFormGroup.value['address'];
      data = this.verContent.find((x) => x.key === "candidateName");
      if (data) {
        candidateName = data.reportVal;
      }
      let data1 = this.verContent.find((x) => x.key === "periodOfStay");
      if (data1) {
        this.responseDocument.controls["component"][
          "controls"
        ].reportDetail.value.periodOfStay = data1.reportVal;
      }
      let data2 = this.verContent.find((x) => x.key === "periodOfStayTo");
      if (data2) {
        this.responseDocument.controls["component"][
          "controls"
        ].reportDetail.value.periodOfStayTo = data2.reportVal;
      }
      const rptAddresssPos = this.responseDocument.controls["component"][
        "controls"
      ].reportDetail.value.address.addressPos;
      // tslint:disable-next-line:no-string-literal
      this.responseDocument.controls["component"][
        "controls"
      ].reportDetail.value.address = this.addressData.getValue();
      this.responseDocument.controls["component"][
        "controls"
      ].reportDetail.value.address.addressPos = rptAddresssPos;
      this.responseDocument.controls["component"][
        "controls"
      ].reportDetail.value.npAddressFlag = false;
      // this.responseDocument.get['component.reportDetail.address'].setValue(this.addressData);
      this.generateRpt();
      if (data) {
        // tslint:disable-next-line:no-string-literal
        this.responseDocument.controls["component"][
          "controls"
        ].reportDetail.candidateName = candidateName;
        this.verContent
          .filter((x) => x.key === "candidateName")
          .map((y) => (y.reportVal = candidateName));
      }
      this.showTopCenter("success", "Success Message", "Updated Successfully");
      this.dialog.closeAll();
    }
  }
  validatedateInputStayFromwithBirt(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX =
      /([Nn]){1}([Oo]){1}([Tt]){1}([ ]){1}([Pp]){1}([Rr]){1}([Oo]){1}([Vv]){1}([Ii]){1}([Dd]){1}([Ee]){1}([Dd]){1}?$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    // const yearsREGEX = /^([0-9]){2}( YEARS)?$/;
    // const yearREGEX = /^(([1])( YEAR)|[2-9]{2}( YEARS))?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return sincebrithREGEX.test(value) ||
        notProviedREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validatedateInputwitTilldate(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return notProviedREGEX.test(value) ||
        tillDateREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  initAddressFormGroup() {
    const othervalidation = [
      Validators.required,
      this.validatedateInputStayFromwithBirt,
    ];
    const validation = [Validators.required, this.validatedateInputwitTilldate];
    this.addressFormGroup = this.fb.group({
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addTypeLookName: new UntypedFormControl(""),
        addTypeLookupId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl("", Validators.required),
        addLine2: new UntypedFormControl(""),
        addLine3: new UntypedFormControl(""),
        addressTypeLookupId: new UntypedFormControl(0),
        cityId: new UntypedFormControl(0),
        city: new UntypedFormControl(""),
        stateId: new UntypedFormControl(0, Validators.required),
        countryId: new UntypedFormControl("", Validators.required),
        districtId: new UntypedFormControl(0),
        postalCode: new UntypedFormControl("", Validators.required),
        place: new UntypedFormControl(),
        active: new UntypedFormControl(true),
        createdUserId: new UntypedFormControl(this.userData.userId),
        locationId: new UntypedFormControl(0),
        country: new UntypedFormControl(""),
        //periodOfStay: new UntypedFormControl(''),
        state: new UntypedFormControl(""),
        district: new UntypedFormControl(""),
        addressPos: this.fb.array([])
      }),
    });
  }

  // sendRetrieveDateAsGMT(data: any, type: boolean): any {
  //   const caption = (this.responseDocument.controls['component'] as UntypedFormGroup).controls['displayCaption'].value;
  //   const dateData = caption.filter(e => e.dataType === 'Date');
  //   if (dateData.length > 0) {
  //     // dateData.forEach(element => {
  //     //   data[element.key] = this.commonService.getTimezoneOffset(data[element.key], type);
  //     // });
  //   }
  //   // else {
  //   //   return data;
  //   // }
  //   return data;
  // }

  getMailData() {
    const MailDate: VerificationMoveToQc = {
      candidateName:
        this.verificationForm.get("screeningCandidateDet.firstName").value +
        " " +
        this.verificationForm.get("screeningCandidateDet.middleName").value +
        " " +
        this.verificationForm.get("screeningCandidateDet.lastName").value,
      screeningCompId:
        this.verificationService.tempData.verificationScreeningDet
          .screeningCompId,
      screeningId: 0,
      clientRefNo: this.verificationForm.get("clientRefNo").value,
      clientId: 0,
      clientName: "",
      verificationId: 0,
      componentName: "",
      serviceType: "",
      fees: 0,
      remarks: "",
      applicationId: 0,
      loggedIn: this.userData.userId,
    };

    this.verificationService.ComponentQcMailView(MailDate).subscribe((res) => {
      this.mailBodyValue = res;
    });
  }

  ngOnDestroy() {
    this.updateContactDetails("Destroy");
  }

  getFinalReprt(reportType = "preview") {
    this.verificationService.individualQc = 1;
    this.verificationService.prebothconfigFlag = false;
    this.verificationService.enableAutoIqc = false;
    this.verificationService.enableAutoFqc = false;
    // this.verificationService.tempData.verificationScreeningDet.screeningCompId
    this.verificationService
      .GetResponseDocument(
        0,
        this.verificationService.tempData.verificationScreeningDet
          .screeningCompId
      )
      .subscribe(
        (res) => {
          // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
          // this.commonService.colorCode = res.candidateDetail.colorCode;

          this.verificationService.finalReportvalue = res;
          if (this.verificationService.finalReportvalue) {
            if (res.candidateDetail) {
              const cD = res.candidateDetail;
              this.pdfName =
                getTrimValue(cD.referenceNo) +
                "_" +
                getTrimValue(cD.firstName) +
                "_" +
                getTrimValue(cD.middleName) +
                "_" +
                getTrimValue(cD.lastName) +
                "_" +
                getTrimValue(cD.clientName) +
                ".pdf";
            }
          }          
          this.verificationService
            .getClientReportHeaderFooter(
              this.verificationService.tempData.verificationScreeningDet
                .clientId
            )
            .subscribe((resp) => {
              if (resp) {
                //this.getErrorAlert();
                this.verificationService.clientLogoaddress = resp;
              }
            });
          this.verificationService
            .getOrganizationLogo(
              this.verificationService.tempData.verificationScreeningDet
                .clientId
            )
            .subscribe(
              (resp) => {
                if (resp) {
                  this.verificationService.fileLogo = resp;
                }
              },
              (err) => { },
              () => {
                this.verificationService.isFinalReport = true; // reportType === 'preview';
                this.verificationService.reportType = reportType; // download
                this.verificationService.dataBaseFlag = true;
                if (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === true && this.verificationService.reportType === 'preview') {
                  this.verificationService.screeningCompId = this.verificationService.tempData.screeningCompId;
                  this.verificationService.screeningId = 0;
                  this.verificationService.prebothconfigFlag = true;
                  this.verificationService.isBothConfig = false;
                  this.verificationService.isFinalQCConfig = false;
                  this.verificationService.enableAutoIqc = this.verificationService.tempData.enableAutoIqc ? this.verificationService.tempData.enableAutoIqc : false;
                  this.verificationService.enableAutoFqc = this.verificationService.tempData.enableAutoFqc ? this.verificationService.tempData.enableAutoFqc : false;
                }
                if ((this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === true && this.verificationService.reportType === 'download') ||
                  (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === false && this.verificationService.reportType === 'download')) {
                  // this.verificationService.screeningId = this.verificationService.tempData.screeningId;
                  // this.verificationService.individualQc = 0;
                  // this.verificationService.ReportTitle = 'FinalReport';
                  // this.verificationService.isBothConfig = true;

                  this.verificationService.isFinalReport = true; // reportType === 'preview';
                  this.verificationService.reportType = 'download'; // download
                  this.verificationService.dataBaseFlag = false;
                  this.verificationService.prebothconfigFlag = false;
                  this.verificationService.screeningCompId = this.verificationService.tempData.screeningCompId;
                  this.verificationService.isFinalQCConfig = true;
                }
              }
            );
          // this.verificationService.generatePdfDoc(this.verificationService.finalReportvalue.candidateDetail.clientId);
          // this.verificationService.isFinalReport = true; // reportType === 'preview';
          // this.verificationService.reportType = reportType;  // download
        },
        (err) => { },
        () => {
          // if (reportType === 'download') {
          //   // this.verificationService.finalReportvalue.candidateDetail.clientId
          //   this.verificationService.generatePdfDocContent();
          // }
        }
      );

  }
  getFinalReprtBasedOnConfig(reportType = "preview") {
    if (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === true) {
      this.verificationService.individualQc = 0;
      this.verificationService
        .GetResponseDocument(
          0,
          this.verificationService.tempData.verificationScreeningDet
            .screeningCompId
        )
        .subscribe(
          (res) => {
            // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
            this.commonService.colorCode = res.candidateDetail.colorCode;
            this.initsendMailToQcForm();
            this.moveToqc();

            this.verificationService.finalReportvalue = res;
            if (this.verificationService.finalReportvalue) {
              if (res.candidateDetail) {
                const cD = res.candidateDetail;
                this.pdfName =
                  getTrimValue(cD.referenceNo) +
                  "_" +
                  getTrimValue(cD.firstName) +
                  "_" +
                  getTrimValue(cD.middleName) +
                  "_" +
                  getTrimValue(cD.lastName) +
                  "_" +
                  getTrimValue(cD.clientName) +
                  ".pdf";
              }
            }
            this.verificationService
              .getClientReportHeaderFooter(
                this.verificationService.tempData.verificationScreeningDet
                  .clientId
              )
              .subscribe((resp) => {
                if (resp) {
                  this.verificationService.clientLogoaddress = resp;
                }
              });
            this.verificationService
              .getOrganizationLogo(
                this.verificationService.tempData.verificationScreeningDet
                  .clientId
              )
              .subscribe(
                (resp) => {
                  if (resp) {
                    this.verificationService.fileLogo = resp;
                  }
                },
                (err) => { },
                () => {
                  this.verificationService.isFinalReport = true; // reportType === 'preview';
                  this.verificationService.reportType = reportType; // download
                  this.verificationService.dataBaseFlag = true;
                  this.verificationService.screeningId = this.verificationService.tempData.screeningId;
                  this.verificationService.ReportTitle = 'FinalReport';
                  this.verificationService.isBothConfig = true;
                  this.verificationService.prebothconfigFlag = false;
                }
              );
          },
          (err) => { },
          () => {
          }
        );
    }
    if (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === false) {
      this.verificationService.individualQc = 1;
      this.verificationService
        .GetResponseDocument(
          0,
          this.verificationService.tempData.verificationScreeningDet
            .screeningCompId
        )
        .subscribe(
          (res) => {
            // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
            this.commonService.colorCode = res.candidateDetail.colorCode;
            this.initsendMailToQcForm();
            this.moveToqc();

            this.verificationService.finalReportvalue = res;
            if (this.verificationService.finalReportvalue) {
              if (res.candidateDetail) {
                const cD = res.candidateDetail;
                this.pdfName =
                  getTrimValue(cD.referenceNo) +
                  "_" +
                  getTrimValue(cD.firstName) +
                  "_" +
                  getTrimValue(cD.middleName) +
                  "_" +
                  getTrimValue(cD.lastName) +
                  "_" +
                  getTrimValue(cD.clientName) +
                  ".pdf";
              }
            }
            this.verificationService
              .getClientReportHeaderFooter(
                this.verificationService.tempData.verificationScreeningDet
                  .clientId
              )
              .subscribe((resp) => {
                if (resp) {
                  this.verificationService.clientLogoaddress = resp;
                }
              });
            this.verificationService
              .getOrganizationLogo(
                this.verificationService.tempData.verificationScreeningDet
                  .clientId
              )
              .subscribe(
                (resp) => {
                  if (resp) {
                    this.verificationService.fileLogo = resp;
                  }
                },
                (err) => { },
                () => {
                  // if (this.verificationService.tempData.enableAutoIqc === true && this.verificationService.tempData.enableAutoFqc === true && this.verificationService.reportType === 'download') {
                  //   this.verificationService.screeningId = this.verificationService.tempData.screeningId;
                  //   this.verificationService.individualQc = 0;
                  //   this.verificationService.ReportTitle = 'FinalReport';
                  //   this.verificationService.isBothConfig = true;
                  // } else {
                  this.verificationService.isFinalReport = true; // reportType === 'preview';
                  this.verificationService.reportType = 'download'; // download
                  this.verificationService.dataBaseFlag = false;
                  this.verificationService.prebothconfigFlag = false;
                  this.verificationService.isFinalQCConfig = true;
                  this.verificationService.screeningCompId = this.verificationService.tempData.screeningCompId;
                  // }

                }
              );
          },
          (err) => { },
          () => {
          }
        );
    }
  }

  public getPDFfile() {
    // const options = {
    //   render: 'download', // force to download fix for IE
    //   embedLocalImages: true, // enable images in PDF
    //   filename: 'finalreport' // filename changed
    // };
    // const data = xepOnline.Formatter.Format(['report'], options);
    // return data;

    this.commonService.downloadDocument(
      0,
      this.verificationService.pdfvalue.document,
      this.verificationService.pdfvalue.fileName
    );
  }

  createMiscForm() {
    return this.fb.group({
      createdDate: new UntypedFormControl(),
      miscId: new UntypedFormControl(0),
      miscQuestion: new UntypedFormControl("", Validators.required),
      miscAnswer: new UntypedFormControl(""),
      defaultQuestionFlag: new UntypedFormControl(false),
    });
  }

  creadResearchForm() {
    return this.fb.group({
      screeningRecordCheckId: new UntypedFormControl(0),
      screeningCriminalDatabaseId: new UntypedFormControl(0),
      remark: new UntypedFormControl("", Validators.required),
      recordCheckCategoryQuesId: new UntypedFormControl(0),
      recordCheckCategoryQues: new UntypedFormControl(""),
      recordCheckCategoryId: new UntypedFormControl(0),
      recordCheckCategoryName: new UntypedFormControl(""),
      displayOrder: new UntypedFormControl(0)

    });
  }
  createAddressForm() {
    return this.fb.group({

      addressPosId: new UntypedFormControl(0),
      periodOfStay: new UntypedFormControl(null, Validators.required),
      periodOfStayTo: new UntypedFormControl(null, Validators.required),
      addressId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      reportFlag: new UntypedFormControl(true),
    });
  }

  createCustomForm() {
    return this.fb.group({
      ScreeningClientCustomFieldId: new UntypedFormControl(0),
      fieldValue: new UntypedFormControl(""),
      fieldName: new UntypedFormControl(""),
    });
  }
  addMisc(type: "add" | "initial") {
    let check = true;
    this.misc = this.miscForm.get("misc") as UntypedFormArray;
    if (type === "add") {
      check = this.checkMiscQns("add");
    }
    if (check) {
      this.misc.push(this.createMiscForm());
    }
  }
  adddatabase(type: "add" | "initial") {
    let check = true;
    this.misc = this.databaseForm.get("dbase") as UntypedFormArray;
    if (type === "add") {
      check = this.checkdatabaseQns("add");
    }
    if (check) {
      this.misc.push(this.creadResearchForm());
    }
  }
  addAdd(type: "add" | "initial") {
    let check = true;
    this.misc = this.AddressForm.get("misc") as UntypedFormArray;
    if (type === "add") {
      check = this.checkAddress("add");
    }
    if (check) {
      this.misc.push(this.createAddressForm());
    }
  }

  changeCheck(e, data) {
    if (e.checked === true) {
      this.verificationService.caseDetailFlag = true;
    } else {
      this.verificationService.caseDetailFlag = false;
      this.verContent.forEach((loop) => {
        if (
          loop.key === "underAct" ||
          loop.key === "underSection" ||
          loop.key === "firNo" ||
          loop.key === "year" ||
          loop.key === "disposition" ||
          loop.key === "remarks" ||
          loop.key === "overallStayYears" ||
          loop.key === "latitude" ||
          loop.key === "longitude"
        ) {
          loop.reportVal = "";
        }
      });
    }
  }
  // removeMisc(data: any) {
  //   const frmlength = this.misc.length;
  //   if (frmlength > 1) {
  //     const control = this.miscForm.get('misc') as UntypedFormArray;
  //     control.removeAt(data);
  //   }
  // }
  dialogClose() {
    this.dialog.closeAll();
  }

  // Mail Template
  documentApply() {
    for (let index = 0; index < this.docContentList.length; index++) {
      document.getElementById("image" + index)["src"] =
        "data:image/png;base64," + this.docContentList[index].document;
    }
  }

  public downloadss() {
    const options = {
      render: "none", // force to download fix for IE
      embedLocalImages: true, // enable images in PDF
      filename: "finalreport", // filename changed
    };
    const data = xepOnline.Formatter.Format(["report"], options);
    return data;
  }

  concatAddress(address: {
    addLine1: string;
    addLine2: string;
    addLine3: string;
    city: string;
    district: string;
    country: string;
    place: string;
    state: string;
    postalCode: string;
  }): string {
    const city = address
      ? address.city
        ? "Place:" + " " + this.retWithComma(address.city)
        : this.retWithComma(address.city)
      : "";
    const place = address
      ? address.place
        ? "Village:" + " " + this.retWithComma(address.place)
        : this.retWithComma(address.place)
      : "";
    return address
      ? this.retWithComma(address.addLine1) +
      " " +
      this.retWithComma(address.addLine2) +
      " " +
      this.retWithComma(address.addLine3) +
      " " +
      place +
      " " +
      city +
      " " +
      "District:" +
      " " +
      this.retWithComma(address.district) +
      " " +
      "State:" +
      " " +
      this.retWithComma(address.state) +
      " " +
      "Country:" +
      " " +
      this.retWithComma(address.country) +
      " " +
      "Zipcode:" +
      " " +
      this.retWithComma(address.postalCode, true)
      : "";
  }

  retWithComma(data: string, isLast = false): string {
    return data ? data + (isLast ? "." : ",") : "";
  }

  genrateData() {
    if (this.finalReport) {
      if (this.finalReport.summaryDetail) {
        this.finalReport.summaryDetail.forEach((element) => {
          // tslint:disable-next-line: no-use-before-declare
          const summaryData = new SummaryContent();
          element.component.forEach((compElement, index) => {
            const data = element.component[index];
            let reportDetData = null;
            let applicantDetData = null;
            const reportDet = compElement[element.componentType + "ReportDet"];
            const appliacantDet =
              compElement[element.componentType + "ApplicantDet"];
            switch (element.componentType) {
              case "address":
              case "voterId":
              case "license":
              case "jcr":
              case "cRC": {
                reportDetData = [reportDet, reportDet.address].reduce(
                  (r, c) => Object.assign(r, c),
                  {}
                );
                applicantDetData = [
                  appliacantDet,
                  appliacantDet.address,
                ].reduce((r, c) => Object.assign(r, c), {});
                break;
              }
              default: {
                reportDetData = reportDet;
                applicantDetData = appliacantDet;
                break;
              }
            }
            if (index === 0) {
              summaryData.header = element.header;
              summaryData.remarks =
                data[element.componentType + "ReportDet"][
                  element.componentType + "ReportContact"
                ].remarks;
            }
            (compElement.displayCaption as any).forEach((capttionEl) => {
              if (capttionEl.key === "candidateName") {
                summaryData.content.push({
                  caption: capttionEl.caption,
                  reportVal:
                    (reportDetData.firstName
                      ? ("" + reportDetData.firstName).trim()
                      : "") +
                    (reportDetData.middleName
                      ? " " + ("" + reportDetData.middleName).trim()
                      : "") +
                    (reportDetData.lastName
                      ? " " + (("" + reportDetData.lastName).trim() + " ")
                      : ""),
                  dataType: capttionEl.dataType,
                  applicanttVal:
                    (applicantDetData.firstName
                      ? applicantDetData.firstName
                      : "") +
                    (applicantDetData.middleName
                      ? " " + applicantDetData.middleName
                      : "") +
                    (applicantDetData.lastName
                      ? " " + applicantDetData.lastName
                      : ""),
                  key: capttionEl.key,
                  required: capttionEl.required,
                  maxLength: capttionEl.maxLength,
                });
              } else {
                const rptval = reportDetData[capttionEl.key]
                  ? ((capttionEl.dataType === "Date"
                    ? this.retDate(reportDetData[capttionEl.key])
                    : reportDetData[capttionEl.key]) as any)
                  : "N/A";
                const applicanttval = applicantDetData[capttionEl.key]
                  ? ((capttionEl.dataType === "Date"
                    ? this.retDate(applicantDetData[capttionEl.key])
                    : applicantDetData[capttionEl.key]) as any)
                  : "N/A";
                summaryData.content.push({
                  caption: capttionEl.caption,
                  reportVal: rptval,
                  dataType: "",
                  applicanttVal: applicanttval,
                  key: capttionEl.key,
                  required: capttionEl.required,
                  maxLength: capttionEl.maxLength,
                });
              }
            });
          });
          if (summaryData.content.length > 0) {
            this.summaryContentList.push(summaryData);
          }
        });
      }
      if (this.finalReport.executiveDetail) {
        this.finalReport.executiveDetail.forEach((element) => {
          // tslint:disable-next-line: no-use-before-declare
          const executiveData = new ExecutiveDetailContent();
          element.component.forEach((compElement, index) => {
            if (index === 0) {
              executiveData.header = element.header;
            }
            executiveData.component = compElement.component;
            // executiveData.caption = compElement.caption;
          });
          this.executiveDetailContentlist.push(executiveData);
        });
      }
    }
  }
  retCurrentDate(data): Date {
    // if(data.key !== 'testDate' && data.key !== 'reportDate') {
    if (
      (this.verificationService.tempData.responseDocument.componentType !==
        "drugTest" &&
        this.verificationService.tempData.responseDocument.componentType !==
        "ndotComp") ||
      ((this.verificationService.tempData.responseDocument.componentType ===
        "drugTest" ||
        this.verificationService.tempData.responseDocument.componentType ===
        "ndotComp") &&
        data.key === "collectionDate")
    ) {
      return new Date();
    }
  }
  respName(data): Date | string {
    if (
      this.verificationService.tempData.responseDocument.componentType ===
      "drugTest" ||
      this.verificationService.tempData.responseDocument.componentType ===
      "ndotComp"
    ) {
      // if (data.key === 'collectionDate') {
      //   return this.verificationService.tempData.verificationScreeningDet.requestDate;
      // }
      const minData1 = this.verContent.filter(
        (x) => x.key === "collectionDate" && x.reportVal !== null
      );
      if (minData1.length > 0 && minData1[0].reportVal) {
        if (data.key === "testDate") {
          return minData1[0].reportVal;
        }
      }
      const minData2 = this.verContent.filter(
        (x) => x.key === "testDate" && x.reportVal !== null
      );
      if (minData2.length > 0 && minData2[0].reportVal) {
        if (data.key === "reportDate") {
          return minData2[0].reportVal;
        }
      }
    } else {
      return this.verificationService.tempData.verificationScreeningDet
        .requestDate;
    }
  }
  minDate(data: any) {
    if (
      this.verificationService.tempData.responseDocument.componentType ===
      "drugTest" ||
      this.verificationService.tempData.responseDocument.componentType ===
      "ndotComp"
    ) {
      if (data.key === "testDate" || data.key === "reportDate") {
        this.respName(data);
      }
    }
  }
  getContactRemarksList(statusId: any) {
    if (statusId > 0) {
      this.verificationService
        .GetColorStatusRemarksId(
          this.verificationService.tempData.verificationScreeningDet.clientId,
          this.verificationService.tempData.verificationComponentDet.compId,
          statusId
        )
        .subscribe((resp) => {
          if (resp.length > 0) {
            this.contactRemarks = resp;
          } else {
            if (
              this.verificationService.tempData.statusAndColorRemark
                .colorStatusRemarks &&
              this.verificationService.tempData.statusAndColorRemark
                .colorStatusRemarks.length > 0
            ) {
              this.contactRemarks =
                this.verificationService.tempData.statusAndColorRemark
                  .colorStatusRemarks.length > 0
                  ? this.verificationService.tempData.statusAndColorRemark
                    .colorStatusRemarks
                  : [];
            }
          }
        });
    } else {
      this.contactRemarks =
        this.verificationService.tempData.verificationTransBindDet.contactRemarks;
      this.contactDet.controls.contactRemarksLookupId.enable();
    }
  }
  getConfirmationType(type: any) {
    const remarksValue: any[] = [];
    const val = this.verificationForm
      .get("responseDocument")
      .get("component")
      .get("reportContact").value;
    const remarksList =
      this.verificationService.tempData.statusAndColorRemark.statusRemarks.filter(
        (x) =>
          x.screeningStatusId ===
          this.verificationForm.controls.screeningStatus.value.screeningStatusId
      );
    if (remarksList.length > 0) {
      remarksList.forEach((element) => {
        const singleRemarks = element.remarks;
        remarksValue.push({ remarks: singleRemarks });
      });

      const confirmValue = remarksValue.map((m) => m.remarks).join(" , ");
      // if(confirmValue: any) {
      //   this.readOnlyFlag = true;
      // } else {
      //   this.readOnlyFlag = false;
      // }
      const person = this.contactDet.get("contactPerson").value
        ? this.contactDet.get("contactPerson").value
        : "";

      const relation = this.contactDet.get("relationWithCandidate").value
        ? this.contactDet.get("relationWithCandidate").value
        : "";
      const design = this.contactDet.get("contactPersonDesign").value
        ? this.contactDet.get("contactPersonDesign").value
        : "";

      let bindValue = "";
      if (val.remarks) {
        this.contactDet.get("remarks").setValue(val.remarks);
        bindValue = confirmValue.replace("Respondent Name", person);
        if (confirmValue.includes("VerifierName")) {
          bindValue = confirmValue.replace("VerifierName", person);
        }
        if (bindValue.includes("Relationship")) {
          bindValue = bindValue.replace("Relationship", relation);
        }
        if (bindValue.includes("Desig")) {
          bindValue = bindValue.replace("Desig", design);
        }
        this.contactDet.get("remarks").setValue(val.remarks);
      } else if (!val.remarks) {
        if (type === true) {
          bindValue = confirmValue.replace("VerifierName", person);
          bindValue = bindValue.replace("Desig", design);
          if (this.contactDet.get("relationWithCandidate").value) {
            bindValue = confirmValue.replace("VerifierName", person);
            bindValue = bindValue.replace("Desig", relation);
            this.contactDet.get("remarks").setValue(bindValue);
          }
          this.contactDet.get("remarks").setValue(bindValue);
        }
        if (type === false) {
          const repDet = this.componentType.split('"') + "ReportDet";
          const repCon = this.componentType.split('"') + "ReportContact";
          if (
            this.verificationService.tempData.responseDocument.component[0][
              repDet
            ][repCon].screeningReportContactId > 0
          ) {
            if (this.contactDet.get("contactPerson").value) {
              this.contactDet.get("remarks").setValue(confirmValue);
            }
            if (this.contactDet.get("contactPersonDesign").value) {
              this.contactDet.get("remarks").setValue(confirmValue);
            }
            if (this.contactDet.get("relationWithCandidate").value) {
              this.contactDet.get("remarks").setValue(confirmValue);
            }
            this.contactDet.get("remarks").setValue(confirmValue);
          } else {
            this.contactDet.get("remarks").setValue(confirmValue);
          }
        }
      }
    }
    // const confirmTypeList: any[] = [];
    // const confirmType = this.verificationForm.get('verificationResponseDocument')?.value
    //   .receivedResponseDocument.document;
    // confirmType.forEach(element => {
    //  const cType = this.verificationService.tempData.verificationTransBindDet.
    //  receivedConfirmationType.filter(x => x.lookUpId === element.responseConfirmationId);
    //  confirmTypeList.push({ lookupName: cType[0].lookUpName});
    //  });
    // const confirmValue = confirmTypeList.map(m => m.lookupName).join(' , ' );
  }
  assignResourceCopy(pro: any) {
    if (this.degreeFlag === false) {
      this.autocompleteFilterValue[0][pro] = Object.assign(
        [],
        this.controlData[0][pro]
      );
      if (pro === "degreeMajor") {
        const keyList = this.verContent.filter(
          (x) => x.key === "degree" && x.reportVal !== null
        );
        if (keyList.length > 0 && keyList[0].reportVal !== null) {
          const majorList = this.autocompleteFilterValue[0][pro].filter(
            (x) => x.id === keyList[0].reportVal
          );
          this.autocompleteFilterValue[0][pro] = majorList;
        }
        const majorList1 = this.verContent.filter(
          (x) => x.key === "degree" && !x.reportVal
        );
        if (majorList1.length > 0 && !majorList1[0].reportVal) {
          this.autocompleteFilterValue[0][pro] = Object.assign(
            [],
            this.controlData[0][pro]
          );
        }
      }
    } else {
      if (pro === "degree") {
        this.autocompleteFilterValue = Object.assign([], this.controlData);
      } else {
        let degList: any[] = [];
        if (this.verContent.length > 0) {
          degList = this.verContent.filter((x) => x.key === "degree");
          if (degList[0].reportVal) {
            const majorList = this.autocompleteFilterValue[0][pro].filter(
              (x) => x.id === degList[0].reportVal
            );
            this.autocompleteFilterValue[0][pro] = majorList;
          }
        }
      }
    }
  }
  setItems(value, pro) {
    let index = 0;
    // this.controlData = this.verificationService.tempData.responseDocument.controlType, [0];
    // this.controlData[0][pro].push({id:'notprovided',value: 'Not Provided'})
    if (value) {
      index = this.controlData[0][pro].findIndex(
        (f) => f.value.toLowerCase() === value.toLowerCase()
      );
    }
    if (index > -1) {
      // this.genuineEmpInsList.splice(index, 1);
    }
    if (!value) {
      this.assignResourceCopy(pro);
    }
    if (value) {
      if (this.degreeFlag === false) {
        this.autocompleteFilterValue[0][pro] = Object.assign(
          [],
          this.controlData[0][pro]
        ).filter(
          (x) => x.value.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      } else {
        let degList: any[] = [];
        if (this.verContent.length > 0) {
          degList = this.verContent.filter((x) => x.key === "degree");
          if (degList[0].reportVal) {
            const majorList = this.autocompleteFilterValue[0][pro].filter(
              (x) => x.id === degList[0].reportVal
            );
            this.autocompleteFilterValue[0][pro] = majorList;
          }
        }
      }
    }
  }
  keyUpFunction(event, value, pro) {
    if (event.key === "enter" || event.key === "tab") {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.autocompleteFilterValue[0][pro].filter(
          (x) => x.value.toLowerCase() === value.toLowerCase()
        );
        if (data.length > 0) {
          // this.keyUp = true;
        } else {
          // this.keyUp = true;
        }
      } else {
        // this.keyUp = false;
      }
    }
  }
  display(pro: any) {
    const dataNew = (data: any) => {
      if (data == null || data === undefined || data === "") {
        return null;
      } else {
        if (this.autocompleteFilterValue) {
          if (
            this.autocompleteFilterValue[0][pro] &&
            this.autocompleteFilterValue[0][pro].length > 0
          ) {
            data = this.autocompleteFilterValue[0][pro].find(
              (x) => x.value === data
            );
            if (data) {
              return data.value;
            }
          } else {
            return null;
          }
        }
      }
    };
    return dataNew;
  }

  get displayDataFn() {
    const dataNew = (data: any) => {
      if (data == null || data === undefined || data === "") {
        return null;
      } else {
        if (this.displayReturnValue) {
          if (
            this.displayReturnValue.length &&
            this.displayReturnValue.length > 0
          ) {
            data = this.displayReturnValue.find((x) => x.value === data);
            if (data) {
              return data.value;
            }
          } else {
            return null;
          }
        }
      }
    };
    return dataNew;
  }
  getFreezeId() {
    const repDet = this.componentType.split('"') + "ReportDet";
    const repCon = this.componentType.split('"') + "ReportContact";

    const statusList =
      this.verificationService.tempData.verificationTransBindDet.status.filter(
        (x) =>
          x.screeningStatusId ===
          this.verificationForm.value.screeningStatus.screeningStatusId
      );
    if (statusList.length > 0) {
      if (statusList[0].colourStatusLookupId > 0) {
        this.colorFlag = true;
        const colorList =
          this.verificationService.tempData.verificationTransBindDet.colorStatus.filter(
            (x) => x.lookUpId === statusList[0].colourStatusLookupId
          );
        if (colorList.length > 0) {
          if(this.verificationService.tempData.verificationScreeningDet.camRejectStatus !='Rejection'){
            this.contactDet
            .get("colorStatusLookupId")
            .setValue(colorList[0].lookUpId);
          }
            if(this.verificationService.tempData.verificationScreeningDet.camRejectStatus !='Rejection'){
          this.contactDet.get("colorStatusLookupId").disable();
            }else if(this.verificationService.tempData.verificationScreeningDet.camRejectStatus ==='Rejection'){
              this.contactDet.disable();              
              this.contactDet.get("colorStatusLookupId").enable();
              if(this.verificationService.tempData.responseDocument.component[0][repDet][repCon].colorStatusLookupId  >0){
                this.contactDet.get("colorStatusLookupId")
                .setValue(this.verificationService.tempData.responseDocument.component[0][
                  repDet
                ][repCon].colorStatusLookupId);
              }
            }
          this.contactDet.value.colorStatusLookupId = this.contactDet.get(
            "colorStatusLookupId"
          ).value;
          if (this.contactDet.controls.colorStatusLookupId.value > 0) {
            this.getContactRemarksList(
              this.contactDet.controls.colorStatusLookupId.value
            );
            if ((this.componentType === 'education' || this.componentType === 'employee' ||  this.componentType === 'currentemployee'  ||  
            this.componentType === 'previousemployee' ))
            //  && (this.verificationService.tempData.verificationScreeningDet.ctsFlag ===
            //   false && this.verificationService.tempData.verificationScreeningDet.clientCategoryId !== 4)) 
              { 
            if (
              (this.contactDet.value.colorStatus =
                this.colorStatus
                  .filter(
                    (e) =>
                      e.lookUpId ===
                      this.contactDet.controls.colorStatusLookupId.value
                  )[0]
                  .lookUpName.toLowerCase() == "red") 
                  //Revert code for sprint13-VTS2-2023-EMP-0109
            //       ||  ((this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Minor Discrepancy"
            //       ||
            // this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Unverified"
            //       ||
            //       this.verificationForm.controls.screeningStatus.value.screeningStatusName === "Close - Verified Amber")
            // && (this.componentType === 'employee' ||  this.componentType === 'currentemployee'  ||  
            // this.componentType === 'previousemployee'))
            ) {
              this.commonService.MvTlFlag = true;
            } else {
              this.commonService.MvTlFlag = false;
            }
          }
          else{
            this.commonService.MvTlFlag = false;
          }
        } else {
            this.contactRemarks =
              this.verificationService.tempData.statusAndColorRemark
                .colorStatusRemarks.length > 0
                ? this.verificationService.tempData.statusAndColorRemark
                  .colorStatusRemarks
                : [];
          }
        } else {
          if(this.verificationService.tempData.verificationScreeningDet.camRejectStatus =='Rejection'){
            this.contactDet.disable();
            this.colorFlag = false;
            this.contactDet.get("colorStatusLookupId").enable();
          }else{
            this.colorFlag = false;
            this.contactDet.get("colorStatusLookupId").enable();
          }
          
          // this.contactDet.get('colorStatusLookupId')?.setValue('');
        }
      } else {
        if(this.verificationService.tempData.verificationScreeningDet.camRejectStatus =='Rejection'){
          this.contactDet.disable();
          this.colorFlag = false;
          this.contactDet.get("colorStatusLookupId").enable();
        }else{
          this.colorFlag = false;
          this.contactDet.get("colorStatusLookupId").enable();
        }
      }
    }
    // this.verificationService.getFreezeContactRemarkTransId(this.verificationForm.value.verificationScreeningDet.clientId,
    //   this.verificationForm.value.verificationScreeningDet.compId,
    //   this.verificationForm.value.screeningStatus.screeningStatusId).subscribe(resp => {
    //     if (resp > 0) {
    //       const remarksId = this.verificationService.tempData.statusAndColorRemark.
    //       colorStatusRemark.find(m => m.contactRemarkTransId === resp);
    //       const cs = this.colorStatus.filter(x => x.lookUpId === remarksId.colorStatusLookUpId);
    //       this.colorFlag = true;
    //       this.contactDet.get('colorStatusLookupId')?.setValue(cs[0].lookUpId);
    //     } else {
    //       this.colorFlag = false;
    //     }
    //   });
  }
  changeDegree(e, key) {
    if (e && key === "degree") {
      this.degreeFlag = true;
      let degList: any[] = [];
      if (this.verContent.length > 0) {
        degList = this.verContent.filter((x) => x.key === "degreeMajor");
        if (degList[0].reportVal) {
          degList[0].reportVal = "";
        }
      }
    } else {
      this.autocompleteFilterValue = Object.assign([], this.controlData);
      this.degreeFlag = false;
    }
  }
  setdate(value, iname) {
    const index = iname.slice(-1)

    const name = iname.substring(0, iname.length - 1);
    const fieldname = name == "PeriodOfStayFrom" ? "periodOfStay" : "periodOfStayTo"
    const Addfrm = this.AddressForm.get('misc') as UntypedFormArray;
    Addfrm.controls[index - 1].get(fieldname).setValue(value);

  }
  setNotProvide(item): string {
    item.reportVal = "Not Applicable";
    return item.reportVal;
  }
  contactValidation() {
    if (this.verificationForm.value.screeningStatus.screeningStatusId > 0) {
      const emailList =
        this.verificationForm.value.verificationTransBindDet.status.filter(
          (x) =>
            x.screeningStatusId ===
            this.verificationForm.value.screeningStatus.screeningStatusId
        );
      if (emailList.length > 0) {
        const confirmList = emailList.filter((x) =>
          x.statusName.includes("Email")
        );
        const verbalList = emailList.filter(
          (x) =>
            x.statusName.includes("Verbal") &&
            this.verificationForm.value.responseDocument.componentName !==
            "Education"
        );
        if (confirmList.length > 0) {
          this.confirmEmailFlag = true;
        } else {
          this.confirmEmailFlag = false;
          this.contactDet.get("contactEmail").clearValidators();
          this.contactDet.get("contactEmail").updateValueAndValidity();
        }
        if (verbalList.length > 0) {
          this.confirmPhFlag = true;
        } else {
          this.confirmPhFlag = false;
          this.contactDet.get("contactPersonPhone").clearValidators();
          this.contactDet.get("contactPersonPhone").updateValueAndValidity();
        }
      }
    }
  }
  dateChange(dae: any) {
    if (dae.key === "fromDate") {
      this.f.form
        .get("fromDate")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "toDate") {
      this.f.form
        .get("toDate")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "courseCompletion") {
      this.f.form
        .get("courseCompletion")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "yearOfPassing") {
      this.f.form
        .get("yearOfPassing")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "validFrom") {
      this.f.form
        .get("validFrom")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "validTo") {
      this.f.form
        .get("validTo")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "periodOfStay" || dae.key === "periodOfStayFrom") {
      dae.key === "periodOfStay"
        ? this.f.form
          .get("periodOfStay")
          .setValue(
            new DatePipe("en-Us")
              .transform(dae.reportVal, "dd/MMM/yyyy")
              .toUpperCase()
          )
        : this.f.form
          .get("periodOfStayFrom")
          .setValue(
            new DatePipe("en-Us")
              .transform(dae.reportVal, "dd/MMM/yyyy")
              .toUpperCase()
          );
    } else if (dae.key === "periodOfStayTo") {
      this.f.form
        .get("periodOfStayTo")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "gapFrom") {
      this.f.form
        .get("gapFrom")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "gapTo") {
      this.f.form
        .get("gapTo")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "dateOfIssue") {
      this.f.form
        .get("dateOfIssue")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else if (dae.key === "incorporationDate") {
      this.f.form
        .get("incorporationDate")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
      this.f.form.get("incorporationDate").value.toUpperCase();
    } else if (dae.key === "certificateIssue") {
      this.f.form
        .get("certificateIssue")
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    } else {
      this.f.form
        .get(dae.key)
        .setValue(
          new DatePipe("en-Us")
            .transform(dae.reportVal, "dd/MMM/yyyy")
            .toUpperCase()
        );
    }
  }
  // this new SRS based on CTS client
  checkComponetStatus() {
    const validComponents = [
      "Database",
      "OFAC",
      "SAM/GSA",
      "FACIS (Level 1)",
      "FACIS (Level 2)",
      "FACIS (Level 3)",
      "Oig",
      "Mhcp",
    ]
      if (validComponents.includes(this.componentName)) {
    const reportKeyMap: any = {
  "Database": "criminalDatabaseReportDet",
  "OFAC": "criminalDatabaseReportDet",
  "SAM/GSA": "gsaReportDet",
  "FACIS (Level 1)": "faC1ReportDet",
  "FACIS (Level 2)": "faC2ReportDet",
  "FACIS (Level 3)": "faC3ReportDet",
  "Oig": "oigReportDet",
  "Mhcp": "mhcpReportDet",
};
const component =
  this.verificationService.tempData.responseDocument.component[0];
const reportKey = reportKeyMap[this.componentName];
if (reportKey && component[reportKey].componentStatusLookupId === null || !component[reportKey].componentStatusLookupId) {
    // const validComponents = [
    //   "Database",
    //   "OFAC",
    //   "SAM/GSA",
    //   "FACIS (Level 1)",
    //   "FACIS (Level 2)",
    //   "FACIS (Level 3)",
    // ]
      // if (validComponents.includes(this.componentName)) {
 const colorData = this.contactDet.get("colorStatusLookupId").value;
      const result = this.colorStatus.find(
        (item) => item.lookUpId === colorData,
      );
const captions = [
  "Component Status",
  "FACIS1 Remarks",
  "FACIS2 Remarks",
  "FACIS3 Remarks",
  "General Service Administration Remarks",
];
    this.verContent = this.verContent.map((item: any) => {
  if (captions.includes(item.caption)) {

    if (result.lookUpName === "Positive") {

      const componentStatus = this.criminalStatus.find(
        (s) => s.lookUpName === "No Record"
      );

      if (componentStatus && item.reportVal == null) {
        item.reportVal = `${componentStatus.lookUpId}`;
      }

    } else {
      // when NOT Positive → reset value
      item.reportVal = item.applicanttVal || null;
    }

  }
  return item;
});

  }
}  
  }
}

function getTrimValue(data: string): string {
  return ("" + data).trim();
}

export class VerificationToCAMApprovalVM {
  screeningCompId:number;
  screeningId:number;
  camApprovalId:string;
  scenarioTypeId:string;
  clientId:number;
  verificationId:string;
  componentName:string;
  remarks:string;
  loggedIn:number;
  siteId:number;
  CandidateName:string;
  clientName:string;
  referenceNo:string;
  rejectComments:string;
  colorStatusLookupId:number;
}
