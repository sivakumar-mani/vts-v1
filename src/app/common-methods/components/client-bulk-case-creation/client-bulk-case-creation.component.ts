import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CaseCreationView } from '../../models/caseCreationView';
import { ScreeningService } from '../../services/screening.service';
import { AutoCompleteDropDown } from '../../models/autoComplete';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AuthService } from '../../services/auth.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatOptionSelectionChange } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BreadcrumbFlags } from '../../models/breadcrumb-flags';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { DatePipe } from '@angular/common';


@Component({
  standalone: false,
  selector: 'app-client-bulk-case-creation',
  templateUrl: './client-bulk-case-creation.component.html',
  styleUrls: ['./client-bulk-case-creation.component.css']
})
export class ClientBulkCaseCreationComponent implements OnInit {
  userData: any;
  routePath = 'Screening / Bulk Case Creation with Document Upload';
  btnExport = true;
  btnAddUpload = true;
  btnValidate = true;
  btnReset = true;
  btnSave = true;
  toolTip = 'Save'
  fileName: any;
  @ViewChild('dt', { static: false }) dt: Table;
  @ViewChild('history', { static: false }) history: TemplateRef<any>;
  @ViewChild('getTemplate', { static: false }) getTemplate: TemplateRef<any>;
  bulkFormGroup: UntypedFormGroup;
  clientId = new UntypedFormControl();
  siteNo = new UntypedFormControl();
  clients = [];
  clientControls: AutoCompleteDropDown;
  // tslint:disable-next-line: no-use-before-declare
  model = new ClientBulkUploadDoc();
  sites = [];
  sitefilterlist = [];
  docList = [];
  dataList: any[] = [];
  tabledetailsColumnsheaders: any[] = [];
  clientBulkUploadDoc: any;
  @ViewChild('uploadConfirm', { static: false }) uploadConfirm: TemplateRef<any>;
  @ViewChild('previewTemplate', { static: false }) previewTemplate!: TemplateRef<any>;
  displayedImportCol = [
    { field: 'sNo', header: 'Row Number' },
    { field: 'name', header: 'Candidate Name' },
    { field: 'detail', header: 'Error Details' },
    { field: 'status', header: 'Status' },
  ];
  docErrorList = [];
  dupErrorList = [];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  packAndCompList: any;
  priortyList: any;
  viewError: any;
  screenAuth: any = {};
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  isSaved: boolean = false;
  showGrid: boolean = true;
  bulkClientCaseColumns: any[] = [];
  packAndCompList1: any = {};
 genderDetails = [];
 countryNameList=[];
  bulkInvitationList: BulkCaseCandidate[] = [];
currentDate = new Date();
  isBulkInvValid: boolean = true;
  isExcelValid: boolean = false;
  isApplyAll: boolean = false;
  isInvitationSent: boolean = false;
  isAllowExistInvitation: boolean = false;
  defaultCountryId: any = null;
  selectedSiteId: any;
  isSubmitted = false;
 breadcrumbFlags = new BreadcrumbFlags();
 
  constructor(public screening: ScreeningService, private message: MessageService, public common: CommonService,
    public dialog: MatDialog, private sanitizer: DomSanitizer, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data'));
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.getClients();
    this.getCasePriorty();
    this.getSiteLocation()
    //this.getCaseImportTemplete();
   // this.bulkFormGroup.get('siteNo').disable();
    this.initializeColumns();
    this.updateCandidateRows()
    this.getGenderDetails();
    this.getCountryName();
    this.getCasePackageComponent(this.userData.clientId,0);
    this.bulkFormGroup.controls.siteNo.valueChanges.subscribe(val => {
  if (!val) {
    this.selectedSiteId = null; // ← clears disabled state
    this.bulkInvitationList.forEach(row => row.siteLocation = '');
    this.updateCandidateRows();
  }
});
  }
  // Define Table Columns
  initializeColumns() {
    this.bulkClientCaseColumns = [
     { field: 'sno',              header: 'S.No' },
    { field: 'applicantId',      header: 'Applicant ID' },
    { field: 'firstName',        header: 'First Name' },
    { field: 'lastName',         header: 'Last Name' },
    { field: 'gender',           header: 'Gender' },
    { field: 'dob',              header: 'DOB' },
    { field: 'citizenship',      header: 'Citizenship' },
    { field: 'uan',              header: 'UAN' },
    { field: 'contactNumber',    header: 'Contact Number' },
    { field: 'emailId',          header: 'Email ID' },
    { field: 'currentlyWorking', header: 'Currently Working' },
    { field: 'age',              header: 'Age' },
     { field: 'siteLocation',     header: 'Site Name / Location' },
    { field: 'packageId',        header: 'Package' },
   
    { field: 'priorityId',       header: 'Priority' },
    { field: 'document',         header: 'Documents' },


    ];
  }

onReset() {
  this.bulkInvitationList = [];
  this.isSubmitted = false;
  this.clientBulkUploadDoc = '';
  this.showGrid = false;
   this.selectedSiteId = null;
  this.bulkFormGroup.reset({
    clientId: '',
    siteNo: '',
    noOfCandidate: 1,
    receivedDateTime: new Date()  // ← reset to current datetime
  });
     this.getSiteLocation()
     this.getCasePackageComponent(Number(this.userData.clientId[0]), 0);
    setTimeout(() => {
    this.updateCandidateRows();   // ← runs after reset settles
  });
}


  packageName(val, data) {
    if (val !== undefined) {
      this.screening.getComponentByPackageId(val).subscribe(res => {
        if (res) {
          data.packCompList = res;
        }
      });
    }
    else {
      data.packCompList = [];
    }
    if (this.isApplyAll)
      this.isApplyAll = false;
  }


  onSubCompSelectionChange(event: MatOptionSelectionChange): void {
    if (event.isUserInput && this.isApplyAll)
      this.isApplyAll = false;
  }

  openViewDialog(doc: any) {
  const ext = doc.fileName.split('.').pop().toLowerCase();
  const fileUrl = doc.fileUrl || URL.createObjectURL(doc.file);

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
  const isPdf = ext === 'pdf';

  // ✅ Images need bypassSecurityTrustUrl
  // ✅ PDFs need bypassSecurityTrustResourceUrl
  const safeUrl = isPdf
    ? this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl)
    : this.sanitizer.bypassSecurityTrustUrl(fileUrl);

  this.dialog.open(this.previewTemplate, {
    width: '80vw',
    height: '90vh',
    data: { fileName: doc.fileName, fileUrl, safeUrl, isImage, isPdf }
  });
}




  // setSubCompValue(value, main, sub) {
  //   if (value) {
  //     const val = this.common.CloneObject(main);
  //     val.packageSubComponent = [];
  //     val.packageSubComponent.push(sub);
  //     return val;
  //   }
  // }

  compareComponents = function (a, b) {
    if (!a || !b) return false;

    if (a.subCompFlag && b.subCompFlag) {
      const aSub = a.packageSubComponent && a.packageSubComponent.length > 0 ? a.packageSubComponent[0] : null;
      const bSub = b.packageSubComponent && b.packageSubComponent.length > 0 ? b.packageSubComponent[0] : null;

      return a.compId === b.compId &&
        aSub && bSub &&
        aSub.subCompId === bSub.subCompId;
    }

    return a.compId === b.compId;
  };



  setSubCompValue(main, sub) {
    const val = { ...main }; // shallow clone is enough if packageSubComponent is overwritten
    val.packageSubComponent = [sub];
    return val;
  }

  initFormGroup() {
    this.bulkFormGroup = new UntypedFormGroup({
      clientId: new UntypedFormControl(''),
      siteNo: new UntypedFormControl(''),
      noOfCandidate: new UntypedFormControl(1, [
  Validators.required,
  Validators.min(1)
]),
   receivedDateTime: new UntypedFormControl({ value: new Date(), disabled: true })
      

    });
    
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
        '', this.bulkFormGroup, false, false, true);
  }
  getCaseImportTemplete() {
    this.screening.getClientCaseImportTemplete().subscribe(res => {
      if (res) {
        this.docList = res;
        const sampleArr = this.common.base64ToArrayBuffer(res.document);
        this.bulkInvitationExcel(sampleArr, res.fileName);
      }
    });
  }

  bulkInvitationExcel(sampleArr: any, fileName: string) {
    const blob = new Blob([sampleArr], { type: 'application/octet-stream' });
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(blob);

    fileReader.onload = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const data = new Uint8Array(arrayBuffer);
      const arr = Array.from(data, byte => String.fromCharCode(byte));
      const bstr = arr.join("");

      const XLbook = XLSX.read(bstr, { type: "binary" });
      const firstSheetName = XLbook.SheetNames[0];
      const XLsheet = XLbook.Sheets[firstSheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(XLsheet, { header: 1, raw: true });

      if (rows.length === 0) return;

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(fileName);

      // Add header row
      const headerRow = worksheet.addRow(rows[0]);

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'bed6fa' },
          bgColor: { argb: 'b570f5' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Set column widths based on first row content
      rows[0].forEach(function (cell, index) {
        var length = (cell && cell.toString()) ? cell.toString().length : 10;
        worksheet.getColumn(index + 1).width = length > 27 ? length / 2 : 27;
      });

      // Add remaining rows
      for (let i = 1; i < rows.length; i++) {
        worksheet.addRow(rows[i]);
      }

      // Save the Excel file
      workbook.xlsx.writeBuffer().then((data) => {
        const exportBlob = new Blob([data], { type: this.EXCEL_TYPE });
        fs.saveAs(exportBlob, fileName);
      });
    };
  }
onFileSelect(event: any, rowData: any): void {
  const files: File[] = Array.from(event.target.files);

  const MAX_SIZE = 150 * 1024 * 1024; // 15 MB

  // Existing uploaded files size
  let existingSize = 0;

  if (rowData.componentDocuments.length) {
    existingSize = rowData.componentDocuments.reduce(
      (sum: number, doc: any) => sum + (doc.size || 0),
      0
    );
  }

  // New selected files size
  const newFilesSize = files.reduce(
    (sum, file) => sum + file.size,
    0
  );
 

  const totalSize = existingSize + newFilesSize;

  if (totalSize > MAX_SIZE) {
      this.showTopCenter(
    'error',
    'Failure Message',
    'Total upload size per candidate cannot exceed 15 MB'
  );

    event.target.value = '';
    return;
  }

  // Initialize if needed
  if (!rowData.componentDocuments) {
    rowData.componentDocuments = [];
  }

  // Add files
  files.forEach(file => {
    rowData.componentDocuments.push({
      fileName: file.name,
      size: file.size,
      file: file
    });
  });

  event.target.value = '';
}
  // Remove a specific file
  removeFile(index: number, rowData: any) {
    rowData.componentDocuments.splice(index, 1);
  }

  // View a file (Open in new tab)
  viewFile(doc: any) {
    if (doc.fileRaw) {
      const url = URL.createObjectURL(doc.fileRaw);
      window.open(url, '_blank');
    } else if (doc.url) {
      window.open(doc.url, '_blank');
    }
  }


  bulkInvitationExcel_OLD(sampleArr, fileName) {
    let comp = []; let pack = []; let compDrop = []; let packDrop = [];
    this.packAndCompList.component.forEach((element, index) => {
      comp.push((index + 1) + ').' + (element.subCompFlag === true ? element.compName + ' - ' +
        (element.packageSubComponent.map(x => x = x.subCompName).join(',')) : element.compName));
      if (element.subCompFlag == true) {
        element.packageSubComponent.forEach(subele => {
          compDrop.push(element.compName + ' - ' + subele.subCompName);
        });
      } else {
        compDrop.push(element.compName);
      }
    });
    this.packAndCompList.package.forEach((e, i) => {
      pack.push((i + 1) + ').' + (e.packageName));
      packDrop.push(e.packageName);
    });
    const blob = new Blob([sampleArr], { type: 'application/octet-stream' });
    let arrayBuffer;
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(blob);
    fileReader.onload = (e) => {
      arrayBuffer = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      const list1 = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, });
      this.exportBulkInvitationExcel(comp, pack, list1[1], fileName, list1[0], compDrop, packDrop);
    }
  }
  exportBulkInvitationExcel(comp, pack, json, excelFileName: string, headersArray, compDrop, packDrop) {
    const i1 = headersArray.findIndex(x => x === 'Client Components List');
    const i2 = headersArray.findIndex(x => x === 'Client Packages List');
    json[i1] = comp.join(', ');
    json[i2] = pack.join(', ');
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(excelFileName);
    const headerRow = worksheet.addRow(headersArray);

    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'bed6fa' }, bgColor: { argb: 'b570f5' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    headersArray.forEach((headers, i) => {
      if ((i === i1 || i === i2) && (json[i].length > 270)) {
        worksheet.getColumn(i + 1).width = json[i].length / 8;
      } else {
        worksheet.getColumn(i + 1).width = 27;
      }
    });
    worksheet.addRow(json);
    for (var i = 0; i <= 1000; i++) {
      worksheet.getCell('N' + (+i + 2)).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['=CompDropList'] //['"' + compDrop + '"']
        //formulae: ['"1).Address - Current Address,Permanent Address,Previous Address, 2).Address - Geo - Previous Address,Permanent Address,Current Address, 3).Bank Statement, 4).Company Site Visit, 5).Credit Verification, 6).Criminal - Federal Nationwide 5 Years, 8).Criminal (Court Record), 9).Criminal Check (PCC1), 10).Criminal Check (PCC2), 11).Criminal Check (PCC3), 12).Criminal Check (PCC3E), 13).Criminal Database, 14).CV Validation, 15).Directorship, 16).Drug Test - 5 Panel, 17).Education, 18).Emergency Contact Verification, 20).EMPLOYEMENT (UAN), 21).Employment (HR), 22).Employment (Supervisor), 23).Gap Verification, 24).Judis Court Record, 25).License, 26).National Identity Check, 27).Nationwide Sex Offender 5 Years, 28).NDOT Drug Screen, 30).Online CRC, 31).Online CRC (Internal), 32).PAN Card, 33).PAN India Online Court Record Verification - Current Address,Previous Address, 34).Passport, 35).Reference Check, 36).Reference Self-employed, 37).SSN Trace, 38).Voter ID"']
      };
    };
    if (json[i2] != null && json[i2] != "") {
      for (var i = 0; i <= 1000; i++) {
        worksheet.getCell('M' + (+ i + 2)).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['=CompDropList']  //['"' + packDrop + '"']
        };
      }
    }
    worksheet.getCell('J2').alignment = {
      wrapText: true
    };
    worksheet.getCell('K2').alignment = { wrapText: true };
    worksheet.getCell('L2').alignment = { wrapText: true };
    workbook.xlsx.writeBuffer().then((data1) => {
      const blob = new Blob([data1], { type: this.EXCEL_TYPE });
      fs.saveAs(blob, excelFileName);
    });
  }

  getClients() {
    const data = new CaseCreationView();
    data.teamId = this.userData.teamId;
    data.applicationId = this.userData.applicationId;
    data.clientId = this.userData.clientId;
    data.teamName = this.userData.teamName;
    this.screening.getInvitationClientName(data).subscribe(resp => {
      if (resp) {
        this.clients = resp;
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
            '', this.bulkFormGroup, false, false, true);
      }
    });
  }
  // getClientId(clientId) {
  //   if (clientId) {
  //     this.removeDocument();
  //     if (this.clients.find(x => x.clientId === clientId).agreementPendingFlag === true) {
  //       this.showTopCenter('warn', 'Failure Message', 'The client has pending in agreement approval...');
  //       this.bulkFormGroup.get('clientId').setValue(null); return;
  //     } else {
  //       this.sites = [];
  //       this.bulkFormGroup.controls.siteNo.setValue(undefined);
  //       setTimeout(() => {
  //         this.getSiteLocation(clientId);
  //       }, 20);
  //       this.bulkFormGroup.controls.siteNo.enable();
  //     }
  //   }
  // }
  resetForm() {
    this.bulkFormGroup.reset();
    this.bulkFormGroup.markAsPristine();
    this.bulkFormGroup.markAllAsTouched();
    this.removeDocument();
  }
  getSiteLocation() {
    const clientId=this.userData.clientId
    this.screening.getSiteNoByClientId(clientId).subscribe((resp) => {
      if (resp) {
        resp.map((e:any) => {
          e.siteNoWithsiteName = e.siteNo + '-' + e.siteName;
        });
        this.sites = resp;
      }
      if (resp.length === 0) {
        this.bulkFormGroup.get('siteNo').disable();
        this.sitefilterlist = [];
      }
    }, err => {

    }, () => {
      if (this.sites.length === 0) {
        this.bulkFormGroup.controls.siteNo.disable();
      } else {
        this.bulkFormGroup.controls.siteNo.enable();
        this.siteItems('');
      }
    });
  }
  siteItems(value) {
    if (!value) { this.assignCompCopy(); }
    if (value) {
      this.sitefilterlist = Object.assign([], this.sites).filter(
        item => ((item.siteNoWithsiteName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
      if (!value || value.trim() === '') {
    this.packAndCompList = null; // or = { package: [] }
    this.bulkInvitationList.forEach(row => {
      row.siteLocation = '';
      row.packageId = 0;
      row.package = '';
    });
    this.updateCandidateRows();
  }
  }
  assignCompCopy() {
    this.sitefilterlist = Object.assign([], this.sites);
  }
  siteKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const comp = this.sites.filter(e =>
          e.siteNoWithsiteName.toLowerCase() === value.toLowerCase());
      }
    }
  }
  get displaySiteFn() {
    const compNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.sitefilterlist && this.sitefilterlist.length > 0) {
          comp = this.sitefilterlist.find(x => x.siteId === comp);
          if (comp.siteNoWithsiteName) {
            return comp.siteNoWithsiteName;
          }
        } else {
          return null;
        }
      }
    };
    return compNew;
  }
  openUploadDoc(event) {
    if (this.validateInputs(true)) {
      this.clientBulkUploadDoc = '';
      const fileName = event.target.files[0].name;
      const fileExtn = fileName.split('.').pop();
      const target: DataTransfer = <DataTransfer>(event.target);

      if (!['xls', 'xlsx'].includes(fileExtn)) {
        this.showTopCenter('warn', 'Failure Message', 'Please upload a file with Extensions: xlsx, xls');
        return;
      } else if (target.files.length !== 1) {
        this.showTopCenter('warn', 'Failure Message', 'Only one file at a time can be uploaded.');
        return;
      }

      const file = target.files[0];
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const binaryStr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });

        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        //const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const jsonData = rawData.filter((row: any[]) => row.some(cell => cell !== null && cell !== undefined && cell !== ''));

        const recordCount = jsonData.length - 1;
        if (recordCount > 25) {
          this.showTopCenter('warn', 'Failure Message', 'Maximum 25 records allowed in one single upload.');
          return;
        }
        this.clientBulkUploadDoc = event.target.files[0];
        // Extract headers (first row)
        const headers: string[] = jsonData[0] as string[];

        // Map remaining rows into BulkInvitation objects
        // this.bulkInvitationList = jsonData.slice(1).map(row => {
        //   let obj: any = {};
        //   headers.forEach((key, index) => {
        //     obj[key] = row[index] || ''; // Assign value, handle empty cases
        //   });
        //   return new BulkCaseCandidate(obj);
        // });
        //this.validateBulkUploadData();
      };
      reader.readAsBinaryString(file);
    }
  }

  getCasePackageComponent(clientId: number, siteNo: number): void {
    this.screening.getCasePackageComponent(clientId, true, siteNo).subscribe(res => {
  
      if (res) {
        this.packAndCompList = res;
      }
    });
  }
  onRowSiteChange(siteId: number, rowData: any) {
  if (!siteId) {
    rowData.packageId = 0;
    return;
  }
  rowData.packageId = 0;
  this.getCasePackageComponent(Number(this.userData.clientId[0]), siteId);
}

  getCasePriorty() {
  this.screening.getCasePriortiyList().subscribe(res => {
    if (res) {
 
      this.priortyList = res
        .filter((item:any) =>
          item.lookUpName.toLowerCase() === 'normal case' ||
          item.lookUpName.toLowerCase() === 'rush case'
        )
        .map(item => {
          if (item.lookUpName.toLowerCase() === 'normal case') {
            item.lookUpName = 'Standard';
          } else if (item.lookUpName.toLowerCase() === 'rush case') {
            item.lookUpName = 'High';
          }
          return item;
        });
        
    }
  });
}
onOptionToggle(event: MatOptionSelectionChange) {

  if (event.isUserInput) {

    this.removeDocument();

    this.selectedSiteId = event.source.value;

    if (this.selectedSiteId) {

      this.getCasePackageComponent(
        Number(this.userData.clientId[0]),
        this.selectedSiteId
      );

      this.bulkInvitationList.forEach(row => {
        row.siteLocation = this.selectedSiteId;
        row.packageId = 0;
      });

    } else {

      this.bulkInvitationList.forEach(row => {
        row.siteLocation = '';
        row.packageId = 0;
      });
    }
  }

  this.updateCandidateRows();
}

  removeDocument() {
    this.clientBulkUploadDoc = '';
    this.clientBulkUploadDoc = [];
    this.docErrorList = [];
    this.bulkInvitationList = [];
    this.isExcelValid = false;
    this.isApplyAll = false;
    this.isInvitationSent = false;
    this.isAllowExistInvitation = false;
  }
  downloadDoc(data) {
    this.common.downloadDocument(0, data.document, data.fileName);
  }

  validateInputs(skipFileCheck: boolean = false): boolean {
    const { clientId, siteNo } = this.bulkFormGroup.controls;
    const isFileInvalid = !this.clientBulkUploadDoc || this.clientBulkUploadDoc.length === 0;

    const control = this.bulkFormGroup.get('siteNo');
    const isEnabled = control && control.enabled;

    // if (!clientId.value) {
    //   this.showTopCenter('warn', 'Failure Message', 'Please Select Client');
    //   return false;
    // }
    // if (!siteNo.value && isEnabled) {
    //   this.showTopCenter('warn', 'Failure Message', 'Please Select Site');
    //   return false;
    // }

    // if (isFileInvalid && !skipFileCheck) {
    //   this.showTopCenter('warn', 'Failure Message', 'Please upload a file to validate');
    //   return false;
    // }

    return true;
  }
openGetData(data?: any) {
  if (data) {
    // Map priorityId to priority name using priortyList
    const mappedData = data.map(item => {
      const priorityMatch = this.priortyList.find(p => p.lookUpId === item.priorityId); // ✅ lookUpId
      return Object.assign({}, item, {
        priorityName: priorityMatch ? priorityMatch.lookUpName : '-' // ✅ lookUpName
      });
    });
    this.dataList = mappedData;
  }

  this.tabledetailsColumnsheaders = [
    { field: 'sNo',           header: 'S.No'             },
    { field: 'candidateName', header: 'Candidate Name'   },
    { field: 'priorityName',      header: 'Priority'         },
    { field: 'package',       header: 'Package'          },
    { field: 'caseRefNo',     header: 'Reference Number' }
  ];

  this.dialog.open(this.getTemplate, {
    width: '800px',
    disableClose: true
  });
}

closeDialog() {
  this.clientBulkUploadDoc = '';
    this.clientBulkUploadDoc = [];
    this.docErrorList = [];
    this.bulkInvitationList = [];
    this.isExcelValid = false;
    this.isApplyAll = false;
    this.isInvitationSent = false;
    this.isAllowExistInvitation = false;
  this.dialog.closeAll();
  this.dataList = [];
  this.onReset();

}


  validateUploadFile(option: any): void {
    if (!this.validateInputs()) return;

    this.bulkFormGroup.markAllAsTouched();
    this.isSaved = option;
     this.saveInvitationBulkUpload(option);

    // const isValid = this.validateBulkUploadData();

    // if (isValid && option) {
     
    // } else if (isValid && this.isExcelValid) {
    //   this.showTopCenter('success', 'Success Message', 'Validation Completed.');
    // }
    this.isSaved = false;
  }

  bulkUpload() {
    if (this.validateInputs()) {
      this.btnReset = true;
      this.btnSave = true;
      this.btnAddUpload = true;
      this.btnValidate = true;
      this.btnExport = true;
      this.isSaved = true;
      
        this.uploadDialog();
      this.isSaved = false;
    }
  }
  uploadDialog() {
    if (this.clientBulkUploadDoc !== undefined) {
      if (this.bulkFormGroup.valid) {
        this.dialog.open(this.uploadConfirm, {
          width: '320px',
          disableClose: true
        });
      } else {
        this.bulkFormGroup.markAllAsTouched();
      }
    } else {
      this.showTopCenter('error', 'Failure Message', 'Please upload a file');
    }
  }
  saveInvitationBulkUpload(option) {
    const formData = new FormData();
    this.model.clientId = Number(this.userData.clientId[0]);
    const value = this.bulkFormGroup.controls.siteNo.value;
    
    this.model.siteId = (value === ""  || value === null || value === undefined) ? 0 : value;
   let errorMsg = '';
  const emailSet = new Set<string>();

  const receivedDateTime = this.bulkFormGroup.controls.receivedDateTime.value;

this.model.caseReceivedDate = receivedDateTime
  ? new Date(receivedDateTime).toISOString()
  : new Date().toISOString();

this.model.caseReceivedDate = receivedDateTime
  ? new Date(receivedDateTime).toISOString()
  : new Date().toISOString();
   

  for (let i = 0; i < this.bulkInvitationList.length; i++) {
    const row = this.bulkInvitationList[i];
    const rowNum = i + 1;

    if (!row.firstName) { errorMsg = `Row ${rowNum}: First Name is required`; break; }
    if (!row.lastName)  { errorMsg = `Row ${rowNum}: Last Name is required`;  break; }
         if (!row.gender)        { errorMsg = `Row ${rowNum}: Gender is required`;     break; }
  if (!row.dateOfBirth)                         { errorMsg = `Row ${rowNum}: Date of Birth is required`;  break; } // ← added
  if (!row.emailId   || !row.emailId.trim())    { errorMsg = `Row ${rowNum}: Email is required`;          break; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.emailId)) { errorMsg = `Row ${rowNum}: Enter valid Email`; break; }
  if (emailSet.has(row.emailId.toLowerCase()))  { errorMsg = `Row ${rowNum}: Duplicate Email - ${row.emailId}`; break; } // ← duplicate check
  emailSet.add(row.emailId.toLowerCase());
    // if (!row.contactNumber) { errorMsg = `Row ${rowNum}: Contact is required`; break; }
    // if (row.contactNumber && row.contactNumber.length !== 10) { errorMsg = `Row ${rowNum}: Contact must be 10 digits`; break; }

    // if (row.uan && row.uan.length !== 12) { errorMsg = `Row ${rowNum}: UAN must be 12 digits`; break; }
    if (!row.contactNumber || !row.contactNumber.trim())       { errorMsg = `Row ${rowNum}: Contact is required`;         break; }
if (!/^\d{10}$/.test(row.contactNumber))                   { errorMsg = `Row ${rowNum}: Contact must be 10 digits`;   break; }
if (row.uan && !/^\d{12}$/.test(row.uan))                  { errorMsg = `Row ${rowNum}: UAN must be 12 digits`;       break; }

    if (!row.siteLocation)   { errorMsg = `Row ${rowNum}: Site Location is required`;   break; } // ← added
if (!row.packageId)      { errorMsg = `Row ${rowNum}: Package is required`;         break; } // ← added
if (!row.lookUpId)       { errorMsg = `Row ${rowNum}: Priority is required`;}
    
  }

  if (errorMsg) {
    this.showTopCenter('error', 'Validation Error', errorMsg);
    return;
  }
    
    // if (this.clients.length > 0) {
    //   const clientName = this.clients.filter(x => x.clientId === this.model.clientId);
    //   this.model.clientName = clientName[0].clientName;
    // }
 if (this.sitefilterlist.length > 0 && this.model.siteId) {
  const siteName = this.sitefilterlist.find(x => x.siteId === this.model.siteId);
  this.model.siteName = siteName ? siteName.siteName : '';
}
    this.model.loggedId = this.userData.userId;
    this.model.uploadStatus = option;
    formData.append('CaseCreationImport', this.clientBulkUploadDoc);
    formData.append('CaseCreation', JSON.stringify(this.model));


    // Process bulkInvitationList
    for (let i = 0; i < this.bulkInvitationList.length; i++) {
      let element = this.bulkInvitationList[i];
      let icomplist = '';
      let selPackage = '';

  element.candidateName =
    `${element.firstName || ''} ${element.lastName || ''}`.trim();
      // Extract package
      let packageItem = this.packAndCompList.package.find(e => e.packageId === element.packageId);
      selPackage = packageItem ? packageItem.packageName : '';


      // Apply 'isApplyAll' logic
     if (this.isApplyAll && i === 0) {

  for (let j = 0; j < this.bulkInvitationList.length; j++) {

    // use packageName instead of package
    this.bulkInvitationList[j].package = selPackage;

    this.bulkInvitationList[j].candidateName =
      `${this.bulkInvitationList[j].firstName || ''} ${this.bulkInvitationList[j].lastName || ''}`.trim();

    // keep as string
    this.bulkInvitationList[j].dateOfBirth =
      this.bulkInvitationList[j].dateOfBirth
        ? new Date(this.bulkInvitationList[j].dateOfBirth)
            .toISOString()
            .split('T')[0]
        : '';
  }

  break;

} else {

  // use packageName instead of package
  element.package = selPackage;

  element.candidateName =
    `${element.firstName || ''} ${element.lastName || ''}`.trim();

  // keep as string
if (element.dateOfBirth != null) {
  element.dateOfBirth = new DatePipe('en-US').transform(
    this.common.getTimezoneOffset(element.dateOfBirth, false), 
    'dd/MMM/yyyy'
  ) || '';
}
  
}
    }
 
    formData.append('CaseCreationList', JSON.stringify(this.bulkInvitationList));
    for (let i = 0; i < this.bulkInvitationList.length; i++) {
   
      const files = this.bulkInvitationList[i].componentDocuments || [];

 for (let doc of files) {
  formData.append(`files_${i}`, doc.file as File, doc.fileName);
}
    }

    this.screening.bulkClientCaseSave(formData).subscribe(resp => {
      if (resp.rowResults.length > 0) {
        this.docErrorList = resp.rowResults;
        // this.bulkUpload();
        this.dupErrorList = this.docErrorList.filter(x => x.status === 'Success');
        if (this.dupErrorList.length === this.docErrorList.length) {
          this.showTopCenter('success', 'Success Message', 'Uploaded Successfully');
        
          this.showGrid = false;
          this.openGetData(resp.rowResults);
          this.clientBulkUploadDoc = '';
            this.onReset()
          return;
        }
      } else {
        if (resp.response.success === true) {
          this.showTopCenter('success', 'Success Message', 'Uploaded Successfully');
          this.dialog.closeAll();
        } else {
          this.showTopCenter('error', 'Failure Message', resp.response.message ? resp.response.message :
            'Please upload valid excel file.Invalid columns & update proper data');
        }
      }
      this.dialog.closeAll();
    });
  }

validateTable(): boolean {
  this.isSubmitted = true;
  
  return this.bulkInvitationList.every(row => 
    row.firstName && row.lastName && 
    row.emailId.includes('@') && 
    row.contactNumber.length === 10 && 
    (!row.uan || row.uan.length === 12)
  )
}

  openEdetails(error) {
    this.viewError = error
    this.dialog.open(this.history, {
      width: '800px',
      disableClose: true
    });
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }


  // validateBulkUploadData(): boolean {
  //   const formData = new FormData();
  //   this.model.clientId = this.bulkFormGroup.controls.clientId.value;
  //   this.model.siteId = this.bulkFormGroup.controls.siteNo.value;
    
  //   if (this.sitefilterlist.length > 0) {
  //     const siteName = this.sitefilterlist.filter(x => x.siteId === this.model.siteId);
  //     this.model.siteName = siteName[0].siteName;
  //   }
  //   this.model.loggedId = this.userData.userId;
  //   this.model.uploadStatus = false;
  //   formData.append('CaseCreationImport', this.clientBulkUploadDoc);
  //   formData.append('CaseCreation', JSON.stringify(this.model));

  //   if (this.isExcelValid) {
  //     if (!this.isApplyAll && (this.bulkInvitationList.some(e => ((!e.packageId || e.packageId < 1))))) {
  //       this.showTopCenter('warn', 'Failure Message', 'Please Select Package');
  //     }
  //     if (!this.isApplyAll && (this.bulkInvitationList.some(e => ((!e.lookUpId || e.lookUpId < 1))))) {
  //       this.showTopCenter('warn', 'Failure Message', 'Please Select Priority');
  //       return false;
  //     }

  //     let mainFlag = true;
  //     let validationMessage: string = ""

  //     // Validate components in bulkInvitationList
  //     for (let i = 0; i < this.bulkInvitationList.length; i++) {
  //       let element = this.bulkInvitationList[i];

  //       if (!this.isApplyAll || (this.isApplyAll && i === 0)) {

  //         if ((!element.packageId || element.packageId < 1)) {
  //           mainFlag = false;
  //           validationMessage = "Please Select Package...";
  //           break;
  //         }
  //       }
  //       if (!mainFlag) {
  //         break;
  //       }
  //     }

  //     // Show warning and exit if validation fails
  //     if (!mainFlag) {
  //       this.showTopCenter('warn', 'Failure Message', validationMessage);
  //       return mainFlag;
  //     }

  //     if (this.isSaved) return true;

  //     formData.append('CaseCreationList', JSON.stringify(this.bulkInvitationList));
  //   }
  //   else {
  //     formData.append('CaseCreationList', JSON.stringify(this.bulkInvitationList));
  //   }


  //   this.screening.bulkClientCaseCreationImport(formData).subscribe(resp => {
  //     if (resp.rowResults.length > 0) {
  //       this.docErrorList = resp.rowResults;
  //       this.bulkInvitationList = resp.rowResults;
  //       this.isInvitationSent = resp.rowResults.some(x => x.isInvitationSent === true);;
  //       this.dupErrorList = this.docErrorList.filter(x => x.status === "Ready To Upload");
  //       if (this.dupErrorList.length === this.docErrorList.length) {
  //         this.docErrorList = [];
  //         this.isExcelValid = true;
  //         this.showGrid = true;
  //       }
  //       else {
  //         this.isExcelValid = false;
  //         this.showGrid = false;
  //       }
  //     }
  //   });
  //   return this.isExcelValid;
  // }


 isInput(field: string): boolean {
    return [
      'applicantId',
      'firstName',
      'lastName',
      'uan',
      'contactNumber',
      'emailId'
    ].includes(field);
  }
  onApplyAllChange(event: MatCheckboxChange): void {

    const firstRow = this.bulkInvitationList[0];
    if (this.isApplyAll) {
      // Validate the first row has at least one component or package


      // Apply to all other rows
      for (let i = 1; i < this.bulkInvitationList.length; i++) {
        this.bulkInvitationList[i].packCompList = [...firstRow.packCompList];
        this.bulkInvitationList[i].packageId = firstRow.packageId;
      }

    } else {
      // Clear selections for all except the first row
      for (let i = 1; i < this.bulkInvitationList.length; i++) {
        this.bulkInvitationList[i].packCompList = [];
        this.bulkInvitationList[i].packageId = 0;
      }
    }
  }
updateCandidateRows() {
  this.showGrid=true
  const count = Number(this.bulkFormGroup.get('noOfCandidate').value || 0);
 
  if (!count || count <= 0) {
    this.bulkInvitationList = [];
    return;
  }
 
  // ✅ FIX: use new BulkCaseCandidate() — all fields auto-initialised
  this.bulkInvitationList = Array.from({ length: count }, (_, i) => {
    const row = new BulkCaseCandidate();
    row.sno = i + 1;
    row.citizenship  = this.defaultCountryId;
   row.siteLocation = this.selectedSiteId;
    return row;
  });
}

 getGenderDetails() {
    this.screening.getGenderDetails().subscribe(resp => {
      if (resp) {
        this.genderDetails = resp;
      }
    });
  }

  getCountryName() {
    this.screening.getPhoneCodeList().subscribe(resp => {
      if (resp) {
        this.countryNameList = resp;
        const india = resp.find((c: any) =>
      c.country.toLowerCase() === 'india'
    );
    if (india) {
      this.defaultCountryId = india.countryId;
      // Apply to already-built rows
      this.bulkInvitationList.forEach(row => {
        row.citizenship = india.countryId;
        
      });
    }
      }
    });
  }
//   onDobChange(rowData: BulkCaseCandidate): void {
   
//   if (!rowData.dateOfBirth) { rowData.age = 0; return; }
//   const birth = new Date(rowData.dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//   rowData.age = age >= 0 ? age : 0;
// }
maxDobDate: Date = new Date(
  new Date().getFullYear() - 18,
  new Date().getMonth(),
  new Date().getDate()
);

// On date picker selection
onDobChange(event: any, rowData: any): void {
  if (event.value) {
    rowData.dateOfBirth = event.value;
    rowData.age = this.calculateAge(event.value);
  }
}


onFieldBlur(rowData: any, field: string) {

  if (field !== 'emailId' && field !== 'contactNumber') return;
  if (!rowData[field]) return;

  const value = rowData[field];

  const payload = {
    ClientId:      Number(this.userData.clientId[0]),
    emailId:       field === 'emailId'       ? value : null,
    contactNumber: field === 'contactNumber' ? value : null
  };

  this.screening.checkDuplicate(payload).subscribe(resp => {
     if (resp && resp.exists) {
      const type = field === 'emailId' ? 'Email ID' : 'Contact Number';

      const popupData = {
        action: this.common.ALERTBULK,
        bodyText: `This ${type} already exists in the system. Do you want to proceed?`
      };

      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: '420px',
        data: popupData,
        disableClose: true
      });

     dialogRef.afterClosed().subscribe(result => {
  if (result === true) {
 const rec = resp.existingRecord;
    rowData.firstName     = rec.firstName     || rowData.firstName;
    rowData.lastName      = rec.lastName      || rowData.lastName;
    rowData.emailId       = rec.emailId       || rowData.emailId;
    rowData.contactNumber = rec.contactNumber || rowData.contactNumber;
    rowData.gender        = rec.gender        || rowData.gender;
    rowData.dateOfBirth   = rec.dateOfBirth   ? new Date(rec.dateOfBirth) : rowData.dateOfBirth;
    rowData.uan           = rec.uan           || rowData.uan;
    rowData.citizenship   = rec.citizenship   || rowData.citizenship;
    rowData.age           = rec.age           || rowData.age;           // ← age
    rowData.packageId     = rec.packageId     || rowData.packageId;     // ← package
    rowData.lookUpId      = rec.lookUpId      || rowData.lookUpId;      // ← priority
    rowData.applicantId   = rec.applicantId   || rowData.applicantId;
     rowData.siteLocation  = rec.siteLocation  || rowData.siteLocation;   // ← site
  rowData.componentDocuments = rec.documents ? rec.documents.map(d => ({ // ← documents
    fileName: d.fileName,
    filePath: d.filePath,
    fileType: d.fileType,
    fileRaw:  null  // existing file — no raw blob
  })) : rowData.componentDocuments;
     // ← applicantId
  } else {
    rowData[field] = '';
  }
});
    }
  });
}

calculateAge(dob: Date): number {
  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
  isDuplicateEmail(rowData: any): boolean {
  const emails = this.bulkInvitationList.map(r => r.emailId && r.emailId.toLowerCase());
  return rowData.emailId && emails.filter(e => e === rowData.emailId.toLowerCase()).length > 1;
}

// Validate minimum 18 years
isAgeValid(dob: Date): boolean {
  return this.calculateAge(dob) >= 18;
}

}
 
 
// ══════════════════════════════════════════════════════════════
// FIXED: BulkCaseCandidate class
// ══════════════════════════════════════════════════════════════
 
export class BulkCaseCandidate {
 
  candidateName:      string = '';
  sno:                number = 0;
  applicantId:        string = 'N/A';
  firstName:          string = '';
  lastName:           string = '';
  gender:             string = '';
 
  //  Issue 1 — siteLocation: Number = 0
  //    'Number' (capital N) is the Object wrapper type, NOT the primitive.
  //    Also siteLocation holds a name/id string, not a number.
  //  FIX:
  siteLocation:       string = '';
 
  contactNumber:      string = '';
  emailId:            string = '';
  citizenship:        string = '';
  dateOfBirth:        string = '';
  uan:                string = '';
  lookUpId?:          number;
  priority: string = '';
  age:                number = 0;
  currentlyWorking:   string = '';
  packageName?:       string;
  packCompList:       any[]  = [];
  packageId:          number = 0;
 package!:       string;
  //  Issue 2 — package: number = 0
  //    'package' is a RESERVED KEYWORD in TypeScript/JavaScript.
  //    This is the root cause of TS2551 errors at lines 722 & 726.
  //  FIX: removed completely
  // package: number = 0;   ← DELETE THIS LINE
 
  componentDocuments: any[]  = [];
 
  constructor(data: any = {}) {

    this.candidateName    = data['CANDIDATE NAME']    || '';
    this.dateOfBirth      = data['DOB']
                              ? new Date(data['DOB']).toISOString().split('T')[0]
                              : '';
    this.citizenship      = data['CITIZENSHIP']       || '';
    this.uan              = data['UAN']               || '';
    this.contactNumber    = data['CONTACT NUMBER']    || '';
    this.emailId          = data['EMAIL ID']          || '';
    this.currentlyWorking = data['CURRENTLY WORKING'] || 'No';
    this.packageId        = data['PACKAGE ID']        || 0;
 
    // Split candidateName → firstName / lastName for grid columns
    if (this.candidateName) {
      const parts    = this.candidateName.trim().split(' ');
      this.firstName = parts[0]                 || '';
      this.lastName  = parts.slice(1).join(' ') || '';
    }
 
    // Issue 3 — age calculation was a TODO comment, never implemented
    //  FIX: calculate age from dateOfBirth
    if (this.dateOfBirth) {
      this.age = this.calculateAge(this.dateOfBirth);
    }
  }
 
  calculateAge(dob: string): number {
    const birth = new Date(dob);
    const today = new Date();
    let age     = today.getFullYear() - birth.getFullYear();
    const m     = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : 0;
  }
 
  // Call this before API save
  syncCandidateName(): void {
    this.candidateName = `${this.firstName} ${this.lastName}`.trim();
  }

 allowDigitsOnly(event: KeyboardEvent, fieldName: string): boolean {
    // Only apply restriction to contactNumber and uan fields
    if (fieldName === 'contactNumber' || fieldName === 'uan') {
      const charCode = event.which ? event.which : event.keyCode;
      // If the character is not a number (0-9), block it
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
        return false;
      }
    }
    return true;
  }



isValidContact(value: string): boolean {
  if (!value) return false;
  return /^\d{10}$/.test(value);
}

isValidUan(value: string): boolean {
  if (!value) return false;
  return /^\d{12}$/.test(value);
}

  
}
 
 
export class ClientBulkUploadDoc {
  clientId:     number  = 0;
  clientName:   string  = '';
  siteId:       number  = 0;
  siteName:     string  = '';
  loggedId:     number  = 0;
  uploadStatus: boolean = false;
caseInitiationDate!: string;
caseReceivedDate!:   string;
}