import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { DataTable, LazyLoadEvent, MessageService } from 'primeng/primeng';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.css']
})
export class AdvanceSearchComponent implements OnInit {

  screenAuth: any = {};
  userData: any;
  menuData: any;
  routePath: any;
  searchPage: boolean = false;
  btnAddUpload: boolean = true;
  btnExport: boolean = true;
  btnValidate: boolean = true;
  isSearch: boolean = true;
  showBulkUpload: boolean = false;
  clientList: any[] = [];
  docClientList: any[] = [];
  advanceSearchForm: UntypedFormGroup;
  advanceFileFormGroup: UntypedFormGroup;
  advanceSearchList: any[] = [];
  advanceSearchExcelList: any[] = [];
  uploadFile: File[] = [];
  advanceColumns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'applicantId', header: 'Applicant ID' },
    { field: 'candidateName', header: 'Candidate Name' },
    { field: 'clientRefNo', header: 'Client Reference Number' },
    { field: 'verificationId', header: 'Verification ID' },
    { field: 'requestDate', header: 'Case Initiation Date' },
    { field: 'dateOfJoining', header: 'Date of Joining' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'functionalEntity', header: 'Functional Entity' },
    { field: 'componentStatus', header: 'Component Status' },
    { field: 'colorCode', header: 'Color Code' },
    { field: 'insuffRaisedDate', header: 'Insufficiency Raised Date' },
    { field: 'insuffClearedDate', header: 'Insufficiency Cleared Date' },
    { field: 'insRasiedComment', header: 'Insufficiency Raised Remarks' }
  ];
  data = [
    { clientReferenceNumber: '', applicantID: '' },
    // Add more data as needed
  ];
  advanceTemplateVM = new advanceSearchTemplateVM();
   @ViewChild('dt', { static: false }) dt!: Table;
  showValidator: boolean = false;
 @ViewChild('uploadConfirm', { static: true }) uploadConfirm!: TemplateRef<any>;
  model = new BulkUploadDoc();
  screenName: string;
  clientCategoryId: number;
  currentPage: number = 1;
  totalpages: number;
  tempCurrentPage: number = 1;
  minToDateCC: Date | null = null;
  minToDateFRG: Date | null = null;
  clientControl!: AutoCompleteDropDown;
  docClientControl!: AutoCompleteDropDown;
  
  loading: boolean;
  event: LazyLoadEvent;
  shievePageNo = 1;
  shievePageSize = 10;
  ExcelFlag: boolean = false;
  // isShowAll: boolean = false;
  lazyFlag: boolean;
  itemperpage: number;
  bulkuploadFlag: boolean = false;
  bulkLazyFlag: boolean;
  exportFlag: boolean = false;
  searchCriFilter: any;

  constructor(private auth: AuthService, private router: Router, private reportService: ReportService, private messageService: MessageService,
    public screeningService: ScreeningService, public common: CommonService, private dialog: MatDialog, public datePipe: DatePipe,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));
    this.routePath = 'Advance Search';
    this.getAllClient();
    this.initControl();
    this.initFileControl();
    this.screenName = 'Advanced Search';
    this.lazyFlag = true;
    this.itemperpage = 10;
  }
  getAllClient() {
    this.reportService.getMISClient(this.userData.clientId).subscribe(res => {
      if (res) {
        this.clientList = res;
        this.docClientList = res;
        this.clientCategoryId = res[0].clientCategoryId;        
        this.initautoCompleteCtrl();
        this.initautoCompleteFileCtrl()
      }
    });
  }

  initautoCompleteCtrl() {
    this.clientControl = new AutoCompleteDropDown('Client Name', 'clientids', 'clientId', 'clientName', this.clientList,
      '', this.advanceSearchForm, false, false, false, 'standard');
  }
  initautoCompleteFileCtrl() {
    this.docClientControl = new AutoCompleteDropDown('Client Name', 'docClientid', 'clientId', 'clientName', this.docClientList,
      '', this.advanceFileFormGroup, false, false, false, 'standard');  
  }

  initControl() {
    this.advanceSearchForm = new UntypedFormGroup({
      refNumber: new UntypedFormControl(null),
      applicantId: new UntypedFormControl(null),
      clientids: new UntypedFormControl(null),
      caseFromDate: new UntypedFormControl(null),
      caseToDate: new UntypedFormControl(null),
      reportFromDate: new UntypedFormControl(null),
      reportToDate: new UntypedFormControl(null)
    });    
    this.initautoCompleteCtrl();
  }
  initFileControl() {
    this.advanceFileFormGroup = new UntypedFormGroup({
      docClientid: new UntypedFormControl(null),
    });
    this.initautoCompleteFileCtrl();
  }

  setmandatoryClient() {
    if (this.advanceSearchForm.get('applicantId')?.value !== null && this.advanceSearchForm.get('applicantId')?.value !== '') {
      this.advanceSearchForm.get('clientids')?.setValidators(Validators.required);
      this.advanceSearchForm.get('clientids')?.updateValueAndValidity();
    } else {
      this.advanceSearchForm.get('clientids')?.clearValidators();
      this.advanceSearchForm.get('clientids')?.updateValueAndValidity();
    }
  }

  resetForm() {
    this.advanceSearchForm.reset();    
    this.advanceFileFormGroup.reset(); 
    this.advanceSearchForm.markAsPristine();
    this.advanceFileFormGroup.markAsPristine();
    this.initControl();
    this.initFileControl();
    this.currentPage = 1;
    this.showBulkUpload = false;
    this.showValidator = false;    
    this.lazyFlag = true;
    this.bulkLazyFlag = false;  
    this.exportFlag = false;  
    // this.bulkuploadFlag = false;
    this.itemperpage = 10;
    // this.isShowAll = false;
    this.userData.page = 1;
    this.userData.pageSize = 10;
    this.userData.needTotal = true;
    this.advanceSearchList = [];
    this.uploadFile = [];
    this.dt.reset();
  }
  resetFormBulk() {
    this.initFileControl();   
    this.lazyFlag = true; 
    this.exportFlag = false;
    this.advanceSearchForm.reset();
    this.advanceSearchForm.markAsPristine();
    this.advanceFileFormGroup.reset();   
    this.advanceFileFormGroup.markAsPristine();
    this.currentPage = 1;
    this.uploadFile = [];
    this.dt.reset();
  }

  back() {
    this.router.navigate(['dashboard/home']);
    this.routePath = 'Dashboard / Home';
  }

  downloadExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data, { header: ['clientReferenceNumber', 'applicantID'] });
    ws['A1'] = {
      v: 'Client Reference Number',
      s: {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center" }
      }
    };
    ws['B1'] = {
      v: 'Applicant ID',
      s: {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center" }
      }
    };
    // Apply width to columns (optional)
    ws['!cols'] = [{ wpx: 200 }, { wpx: 150 }];
    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // Save to file
    XLSX.writeFile(wb, 'Advance Search Template.xlsx');
  }

  // search code
  submitAdvanceSearch() {
    this.lazyFlag = false;
    if (!this.exportFlag) {
      this.advanceSearchList = [];
    }
    this.advanceSearchExcelList = [];
    if (this.advanceSearchForm.valid) {
      this.advanceSearchForm.value.caseFromDate = this.advanceSearchForm.value.caseFromDate ? this.datePipe.transform(this.advanceSearchForm.value.caseFromDate, 'dd/MMM/yyyy') : null;
      this.advanceSearchForm.value.caseToDate = this.advanceSearchForm.value.caseToDate ? this.datePipe.transform(this.advanceSearchForm.value.caseToDate, 'dd/MMM/yyyy') : null;
      this.advanceSearchForm.value.reportFromDate = this.advanceSearchForm.value.reportFromDate ? this.datePipe.transform(this.advanceSearchForm.value.reportFromDate, 'dd/MMM/yyyy') : null;
      this.advanceSearchForm.value.reportToDate = this.advanceSearchForm.value.reportToDate ? this.datePipe.transform(this.advanceSearchForm.value.reportToDate, 'dd/MMM/yyyy') : null;
    
      if (this.advanceSearchForm.get('refNumber')?.value || this.advanceSearchForm.get('applicantId')?.value
        || this.advanceSearchForm.get('clientids')?.value || this.advanceSearchForm.get('caseFromDate')?.value ||
        this.advanceSearchForm.get('caseToDate')?.value || this.advanceSearchForm.get('reportFromDate')?.value ||
        this.advanceSearchForm.get('reportToDate')?.value) {
          this.advanceTemplateVM = new advanceSearchTemplateVM();
          this.advanceTemplateVM.refNo = this.advanceSearchForm.value.refNumber ? this.advanceSearchForm.value.refNumber.toString().trim() : null;
          this.advanceTemplateVM.clientId = this.advanceSearchForm.value.clientids || null;
          this.advanceTemplateVM.typeLookupId = 0;
          this.advanceTemplateVM.name = '';
          this.advanceTemplateVM.address = '';
          this.advanceTemplateVM.applicantId = this.advanceSearchForm.value.applicantId ? this.advanceSearchForm.value.applicantId.toString().trim() : null;
          this.advanceTemplateVM.teamId = this.userData.teamId;
          this.advanceTemplateVM.deptId = this.userData.deptId === null ? 0 : this.userData.deptId;
          this.advanceTemplateVM.applicationId = this.userData.applicationId;
          this.advanceTemplateVM.appClientId = this.userData.applicationId === 2 ? this.userData.clientId[0] : 0;
          this.advanceTemplateVM.clientCategoryId = this.clientCategoryId;

          // Populate date fields
          const dates = {
            caseIntiationFromDate: this.getDateValue(this.advanceSearchForm.value.caseFromDate ? this.advanceSearchForm.value.caseFromDate.toString().trim() : null),
            caseIntiationToDate: this.getDateValue(this.advanceSearchForm.value.caseToDate ? this.advanceSearchForm.value.caseToDate.toString().trim() : null),
            finalReportGeneratedFromDate: this.getDateValue(this.advanceSearchForm.value.reportFromDate ? this.advanceSearchForm.value.reportFromDate.toString().trim() : null),
            finalReportGeneratedToDate: this.getDateValue(this.advanceSearchForm.value.reportToDate ? this.advanceSearchForm.value.reportToDate.toString().trim() : null)
          };

          // Remove null date fields
          Object.keys(dates).forEach(key => {
            if (dates[key] !== null) {
              this.advanceTemplateVM[key] = dates[key];
            }
          });
          if (!this.exportFlag) {
            this.applyPagination();
            this.advanceTemplateVM.pageSize = this.userData.pageSize;
            this.advanceTemplateVM.page = this.userData.page;
            this.advanceTemplateVM.needTotal = this.userData.needTotal;
            this.advanceTemplateVM.filters = this.userData.filters;
            this.advanceTemplateVM.applyPaging = this.userData.applyPaging;
          } else {
            this.advanceTemplateVM.applyPaging = false;
          }
          
          this.screeningService.getAdvanceSearchDetails(this.advanceTemplateVM).subscribe(res => {
            if (res.body.length > 0) {
              if (this.exportFlag) {     
                this.advanceSearchExcelList = res.body;
                this.advanceSearchExcelList.forEach(ele => {
                  ele.candidateName = `${ele.candidateFirstName} ${ele.candidateMiddleName} ${ele.candidateLastName}`;
                });
                this.getExcelResp(this.advanceSearchExcelList);
                this.loading = false;
              } else {
                const modifiedRes = res.body.map(ele => ({
                  ...ele,
                  candidateName: `${ele.candidateFirstName} ${ele.candidateMiddleName} ${ele.candidateLastName}`,
                  applicantId: ele.applicantId ? ele.applicantId : 'N/A',
                  verificationId: ele.verificationId ? ele.verificationId : 'N/A',
                  componentName: ele.subCompName ? ele.componentName + '-' + ele.subCompName : (ele.componentName ? ele.componentName : 'N/A'),
                  functionalEntity: ele.functionalEntity ? ele.functionalEntity : 'N/A',
                  componentStatus: ele.componentStatus ? ele.componentStatus : 'N/A',
                  colorCode: ele.colorCode ? ele.colorCode : 'N/A',
                  dateOfJoining: ele.dateOfJoining ? this.datePipe.transform(ele.dateOfJoining, 'dd/MM/yyy') : 'N/A',
                  insuffRaisedDate: ele.insuffRaisedDate ? this.datePipe.transform(ele.insuffRaisedDate, 'dd/MM/yyy') : 'N/A',
                  insuffClearedDate: ele.insuffClearedDate ? this.datePipe.transform(ele.insuffClearedDate, 'dd/MM/yyy') : 'N/A',
                  requestDate: ele.requestDate ? this.datePipe.transform(ele.requestDate, 'dd/MM/yyy') : 'N/A',
                  insRasiedComment: ele.insRasiedComment ? ele.insRasiedComment : 'N/A',
                }));
                this.advanceSearchList = modifiedRes;  // Assigning the modified `res` to `advanceSearchList`  
                // this.currentPage = 1;
                this.totalpages = res.headers.get('X-Total-Count');
                this.loading = false;
              }
            } else {
              this.showTopCenter('warn', 'Failure Message', 'The case is not available');
            }
          });
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Select atleast one filter and search');
      }
    } else {
      this.advanceSearchForm.markAllAsTouched();
      this.showTopCenter('warn', 'Failure Message', 'Please enter required field');      
    }
  }

  // pagination
  applyPagination() {
    // this.userData.pageSize = this.ExcelFlag === true ? Number(this.shieveTotalCount) : this.shievePageSize;
    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.userData.page > 0 ? this.userData.page : this.shievePageNo;
    this.userData.needTotal = true;
    // if (this.isShowAll === true) {
    //   this.userData.filters = '';
    //   this.userData.applyPaging = false;
    // } else {
      this.userData.applyPaging = true;
    // }
  }
  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;
    // Correct the page number calculation based on the event first and rows values
    this.userData.page = Math.floor(event.first / event.rows) + 1; // This calculates the correct page number
    this.userData.pageSize = event.rows || 10; // Use rows per page or default to 10
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    this.exportFlag = false;
    // Check lazy flags and load the appropriate data
    if (!this.lazyFlag && !this.bulkLazyFlag) {
      this.submitAdvanceSearch(); // Regular search data
    } else if (this.bulkLazyFlag) {
      this.saveCaseBulkUpload(); // Bulk upload data
    }
    this.loading = false; // Stop loading when done
  }
  getTotalChPages(totalRecords, rows) {
    return Math.ceil((totalRecords) / rows);
  }
  // getTotalPages(totalRecords, rows) {
  //   this.totalpages = Math.ceil((totalRecords) / rows);
  //   return Math.ceil((totalRecords) / rows);
  // }
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
  // showall() {   
  //   this.isShowAll = true;
  //   this.submitAdvanceSearch();    
  // }

  // getTotalPages1(totalRecords, rows) {
  //   this.totalpages = Math.ceil((totalRecords) / rows);
  //   return Math.ceil((totalRecords) / rows);
  // }
  // navigateNxtPrevPage1(pageNo, rows) {
  //   this.currentPage = pageNo / rows;
  //   this.tempCurrentPage = this.currentPage;
  // }
  // navigatePage1(pageNo, rowscount) {
  //   if (+pageNo > this.totalpages || +pageNo <= 0) {
  //     this.currentPage = this.tempCurrentPage;
  //   } else {
  //     this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
  //     this.tempCurrentPage = this.currentPage;
  //   }
  // }
  setSortFlag() {
    this.currentPage = 1;
  }

  getDateValue(date: string): string | null {
    if (!date) { return null; }
    const [day, month, year] = date.split('/');
    const monthNumber = this.getMonthNumber(month);
    if (!monthNumber) { return null; }
    const dateObject = new Date(`${year}-${monthNumber}-${day}T00:00:00.000Z`);
    return dateObject.toISOString();
  }

  getMonthNumber(month: string): string | null {
    const monthMap: { [key: string]: string } = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
      'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };
    return monthMap[month.toUpperCase()] || null;
  }
  //

  // file choose code
  // handleFileSelection(event: any) {
  //   const fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     this.uploadFile = Array.from(fileList);
  //   }
  // }
  handleFileSelection(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.uploadFile = Array.from(fileList);
      this.cdr.detectChanges();  // Force change detection
    }
  }

  removeDocument(fileInput: HTMLInputElement) {
    this.uploadFile = [];
    fileInput.value = ''; // Reset the file input so the same file can be selected again
  }
  //


  // Bulk Upload code

  showBulk() {
    this.showBulkUpload = true;    
    // this.bulkuploadFlag = true;
    this.advanceSearchList = [];
    this.showValidator = true;   
    this.resetFormBulk();
    // this.docClientControl = new AutoCompleteDropDown('Client Name', 'docClientid', 'clientId', 'clientName', this.docClientList,
    //   '', this.advanceFileFormGroup, false, false, false, 'standard');
  }

  validateUploadFile() {
    // this.bulkuploadFlag = true;
    if (this.advanceFileFormGroup.get('docClientid')?.value === null || this.advanceFileFormGroup.get('docClientid')?.value === '') {
      this.showTopCenter('error', 'Failure Message', 'Please select client name');
    } else if (this.uploadFile === undefined || this.uploadFile.length === 0) {
      this.showTopCenter('error', 'Failure Message', 'Please upload a file to validate');
    } else {
      this.advanceFileFormGroup.markAllAsTouched();
      this.saveCaseBulkUpload();
    }
    if (this.advanceSearchList.length > 0) {      
      this.showBulkUpload = false; 
    }
  }

  saveCaseBulkUpload() {
    this.lazyFlag = false;
    if (!this.exportFlag) {
      this.advanceSearchList = [];
    }
    this.advanceSearchExcelList = [];
    const formData = new FormData();    
    this.model.clientId = this.advanceFileFormGroup.value.docClientid || null;
    if(this.advanceFileFormGroup.value.docClientid > 0){
      const clientDet = this.docClientList.filter(f=>f.clientId ==this.advanceFileFormGroup.value.docClientid)
      this.model.clientName = clientDet[0].clientName || null;
    }    
    this.model.autoAssignFlag = false;
    this.model.loggedId = this.userData.userId;
    this.model.fileName = this.uploadFile[0].name;
    this.model.bulkUploadDoc = this.uploadFile;
    this.model.uploadStatus = true;
    this.model.deptId = this.userData.deptId;
    this.model.teamId = this.userData.teamId;
    this.model.applicationId = this.userData.applicationId;
    if (!this.exportFlag) { 
      this.applyPagination();
      this.model.pageSize = this.userData.pageSize;
      this.model.page = this.userData.page;
      this.model.needTotal = this.userData.needTotal;
      this.model.filters = this.userData.filters;
      this.model.applyPaging = this.userData.applyPaging;
    } else { 
      this.model.applyPaging = false;
    }
    
    formData.append('AdvanceSearchImport', this.uploadFile[0]);
    formData.append('GlobalSearchExcel', JSON.stringify(this.model));
    this.screeningService.advanceSearchImport(formData).subscribe(res => {
      if (res) {
        if (res.body.message == null && res.body.globalSearchDetails == null) {
          this.showTopCenter('warn', 'Failure Message', 'The case is not available');
        } else if (res.body.message != null && res.body.globalSearchDetails == null) {
          this.showTopCenter('warn', 'Failure Message', res.body.message);
        } else if (res.body.message != null && res.body.globalSearchDetails.length == 0) {
          this.showTopCenter('warn', 'Failure Message', 'The case is not available');
        } else {
          if (this.exportFlag) {            
            this.advanceSearchExcelList = res.body.globalSearchDetails;
            this.advanceSearchExcelList.forEach(ele => {
              ele.candidateName = `${ele.candidateFirstName} ${ele.candidateMiddleName} ${ele.candidateLastName}`;
            });
            this.getExcelResp(this.advanceSearchExcelList);
            this.loading = false;
          } else {
            const modifiedRes = res.body.globalSearchDetails.map(ele => ({
              ...ele,
              candidateName: `${ele.candidateFirstName} ${ele.candidateMiddleName} ${ele.candidateLastName}`,
              applicantId: ele.applicantId ? ele.applicantId : 'N/A',
              verificationId: ele.verificationId ? ele.verificationId : 'N/A',
              componentName: ele.subCompName ? ele.subCompName : (ele.componentName ? ele.componentName : 'N/A'),
              functionalEntity: ele.functionalEntity ? ele.functionalEntity : 'N/A',
              componentStatus: ele.componentStatus ? ele.componentStatus : 'N/A',
              colorCode: ele.colorCode ? ele.colorCode : 'N/A',
              dateOfJoining: ele.dateOfJoining ? this.datePipe.transform(ele.dateOfJoining, 'dd/MM/yyy') : 'N/A',
              insuffRaisedDate: ele.insuffRaisedDate ? this.datePipe.transform(ele.insuffRaisedDate, 'dd/MM/yyy') : 'N/A',
              insuffClearedDate: ele.insuffClearedDate ? this.datePipe.transform(ele.insuffClearedDate, 'dd/MM/yyy') : 'N/A',
              requestDate: ele.requestDate ? this.datePipe.transform(ele.requestDate, 'dd/MM/yyy') : 'N/A',
              insRasiedComment: ele.insRasiedComment ? ele.insRasiedComment : 'N/A',
            }));
            this.advanceSearchList = modifiedRes;
            this.totalpages = res.headers.get('X-Total-Count');           
            this.showBulkUpload = false;
            this.showValidator = false;
            this.bulkLazyFlag = true;   
            this.loading = false;      
            // this.bulkuploadFlag = true;
            // this.currentPage = 1;
          }
        }
      } else {
        this.showTopCenter('warn', 'Failure Message', 'The case is not available');
      }
    });
  }
  //

  // export to excel
  exportExcel() {
    this.exportFlag = true;
    if (!this.bulkLazyFlag) {
      this.submitAdvanceSearch(); // Regular search data
    } else if (this.bulkLazyFlag) {
      this.saveCaseBulkUpload(); // Bulk upload data
    }
    // this.getExcelResp(this.advanceSearchExcelList)
  }

  getExcelResp(outputDataExcel: any[]) {
    if (outputDataExcel) {
      outputDataExcel.forEach(ele=>{
        ele.componentName = ele.subCompName ? ele.componentName + '-' +ele.subCompName : (ele.componentName ? ele.componentName : 'N/A')
      });
      const upper = this.common.CloneObject(this.advanceColumns);
      upper.forEach(e => {
        e.header = e.header.toUpperCase();
      });
      this.exportAsExcel(outputDataExcel, upper);
    }
  }

  exportAsExcel(outputDataExcel: any[], headers: any[]) {
    // Extract only the fields mentioned in headers
    const filteredData = outputDataExcel.map(row => {
      const filteredRow: any = {};
      headers.forEach(header => {
        filteredRow[header.header] = row[header.field];
      });
      return filteredRow;
    });
    this.exportMergedData(filteredData)
  }

  exportMergedData(filteredData): void {
    const mergedData = this.mergeData(filteredData);
    console.log(mergedData, 'test');
    this.exportToExcelFinal(mergedData)
  }
  exportToExcelFinal(mergedDataList: any[]) {
    const candidateData = mergedDataList.map(mergedData => {
      const length = mergedData['COMPONENT NAME'].length;
      return Array.from({ length }, (_, index) => ({
        clientName: mergedData['CLIENT NAME'] || 'N/A',
        applicantId: mergedData['APPLICANT ID'] || 'N/A',
        candidateName: mergedData['CANDIDATE NAME'] || 'N/A',
        clientReferenceNumber: mergedData['CLIENT REFERENCE NUMBER'] || 'N/A',
        caseInitiationDate: mergedData['CASE INITIATION DATE'] || 'N/A',
        dateOfJoining: mergedData['DATE OF JOINING'] || 'N/A',
        verificationId: (mergedData['VERIFICATION ID'] && mergedData['VERIFICATION ID'][index] && mergedData['VERIFICATION ID'][index]['VERIFICATION ID']) || 'N/A',
        componentName: (mergedData['COMPONENT NAME'] && mergedData['COMPONENT NAME'][index] && mergedData['COMPONENT NAME'][index]['COMPONENT NAME']) || 'N/A',
        functionalEntity: (mergedData['FUNCTIONAL ENTITY'] && mergedData['FUNCTIONAL ENTITY'][index] && mergedData['FUNCTIONAL ENTITY'][index]['FUNCTIONAL ENTITY']) || 'N/A',
        componentStatus: (mergedData['COMPONENT STATUS'] && mergedData['COMPONENT STATUS'][index] && mergedData['COMPONENT STATUS'][index]['COMPONENT STATUS']) || 'N/A',
        colorCode: (mergedData['COLOR CODE'] && mergedData['COLOR CODE'][index] && mergedData['COLOR CODE'][index]['COLOR CODE']) || 'N/A',
        insufficiencyRaisedDate: (mergedData['INSUFFICIENCY RAISED DATE'] && mergedData['INSUFFICIENCY RAISED DATE'][index] && mergedData['INSUFFICIENCY RAISED DATE'][index]['INSUFFICIENCY RAISED DATE']) || 'N/A',
        insufficiencyClearedDate: (mergedData['INSUFFICIENCY CLEARED DATE'] && mergedData['INSUFFICIENCY CLEARED DATE'][index] && mergedData['INSUFFICIENCY CLEARED DATE'][index]['INSUFFICIENCY CLEARED DATE']) || 'N/A',
        insufficiencyRaisedRemarks: (mergedData['INSUFFICIENCY RAISED REMARKS'] && mergedData['INSUFFICIENCY RAISED REMARKS'][index] && mergedData['INSUFFICIENCY RAISED REMARKS'][index]['INSUFFICIENCY RAISED REMARKS']) || 'N/A'
      }));
    }).reduce((acc, val) => acc.concat(val), []);
    // Create a worksheet from the rows of data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(candidateData);
    // Set headers
    const headers = [
      ["CLIENT NAME", "APPLICANT ID", "CANDIDATE NAME", "CLIENT REFERENCE NUMBER", "CASE INITIATION DATE", "DATE OF JOINING",
        "VERIFICATION ID", "COMPONENT NAME", "FUNCTIONAL ENTITY", "COMPONENT STATUS", "COLOR CODE", "INSUFFICIENCY RAISED DATE",
        "INSUFFICIENCY CLEARED DATE", "INSUFFICIENCY RAISED REMARKS"]
    ];
  
  XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A1" });

  // Apply styling to all header columns (A, B, C, D, E, F, etc.)
  const range = XLSX.utils.decode_range(ws['!ref']!);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[cellRef]) continue;

    ws[cellRef].s = {
      font: {
        name: 'Calibri',
        sz: 9,
        color: { rgb: '00FFFFFF' },
        bold: true
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
        wrapText: '1',
      },
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'ff0e4872' },
        bgColor: { rgb: 'ff0e4872' },
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };
  }
  
  // Apply border to all cells, but keep header styling intact
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      // Only apply the border if it's not already applied by the header styling
      if (!ws[cellRef].s) {
        ws[cellRef].s = {};
      }

      ws[cellRef].s.border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      };
    }
  }

    // Define column sizes
    ws['!cols'] = [
      { wch: 25 }, // CLIENT NAME
      { wch: 15 }, // APPLICANT ID
      { wch: 30 }, // CANDIDATE NAME 
      { wch: 25 }, // CLIENT REFERENCE NUMBER
      { wch: 15 }, // CASE INITIATION DATE
      { wch: 15 }, // DATE OF JOINING
      { wch: 15 }, // VERIFICATION ID 
      { wch: 30 }, // COMPONENT NAME
      { wch: 50 }, // FUNCTIONAL ENTITY
      { wch: 30 }, // COMPONENT STATUS
      { wch: 15 }, // COLOR CODE
      { wch: 15 }, // INSUFFICIENCY RAISED DATE
      { wch: 15 }, // INSUFFICIENCY CLEARED DATE
      { wch: 50 }  // INSUFFICIENCY RAISED REMARKS
    ];
    // Initialize the merge array
    ws['!merges'] = [];
    // Merging cells for each unique candidate data
    let startRow = 1;  // Considering 1-based index and header row
    mergedDataList.forEach(mergedData => {
      const length = mergedData['COMPONENT NAME'].length;
      ws['!merges'].push(
        { s: { r: startRow, c: 0 }, e: { r: startRow + length - 1, c: 0 } }, // Merge A2:A{startRow + length}
        { s: { r: startRow, c: 1 }, e: { r: startRow + length - 1, c: 1 } }, // Merge B2:B{startRow + length}
        { s: { r: startRow, c: 2 }, e: { r: startRow + length - 1, c: 2 } }, // Merge C2:C{startRow + length}
        { s: { r: startRow, c: 3 }, e: { r: startRow + length - 1, c: 3 } }, // Merge D2:D{startRow + length}
        { s: { r: startRow, c: 4 }, e: { r: startRow + length - 1, c: 4 } }, // Merge E2:E{startRow + length}
        { s: { r: startRow, c: 5 }, e: { r: startRow + length - 1, c: 5 } }  // Merge F2:F{startRow + length}
      );
      startRow += length;
    });
    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Advance Search');
    // Write the workbook to a binary string
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // Save the file
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Advanced Search.xlsx');
    this.exportFlag = false;
  }


  mergeData(data: any[]): any[] {
    // Group and merge data by CLIENT REFERENCE NUMBER
    const groupedData = data.reduce((acc, item) => {
      const refNumber = item['CLIENT REFERENCE NUMBER'];

      if (!acc[refNumber]) {
        acc[refNumber] = {
          'CLIENT NAME': item['CLIENT NAME'].trim(),
          'APPLICANT ID': item['APPLICANT ID'].trim(),
          'CANDIDATE NAME': item['CANDIDATE NAME'].trim(),
          'CLIENT REFERENCE NUMBER': refNumber.trim(),
          'CASE INITIATION DATE': item['CASE INITIATION DATE'] ? this.datePipe.transform(item['CASE INITIATION DATE'], 'dd/MMM/yyyy') : null,
          'DATE OF JOINING': item['DATE OF JOINING'] ? this.datePipe.transform(item['DATE OF JOINING'], 'dd/MMM/yyyy') : null,
          'VERIFICATION ID': [],
          'COMPONENT NAME': [],
          'FUNCTIONAL ENTITY': [],
          'COMPONENT STATUS': [],
          'COLOR CODE': [],
          'INSUFFICIENCY RAISED DATE': [],
          'INSUFFICIENCY CLEARED DATE': [],
          'INSUFFICIENCY RAISED REMARKS': [],
        };
      }
      acc[refNumber]['VERIFICATION ID'].push({ 'VERIFICATION ID': item['VERIFICATION ID'] })
      acc[refNumber]['COMPONENT NAME'].push({ 'COMPONENT NAME': item['COMPONENT NAME'] })
      acc[refNumber]['FUNCTIONAL ENTITY'].push({ 'FUNCTIONAL ENTITY': item['FUNCTIONAL ENTITY'] })
      acc[refNumber]['COMPONENT STATUS'].push({ 'COMPONENT STATUS': item['COMPONENT STATUS'] })
      acc[refNumber]['COLOR CODE'].push({ 'COLOR CODE': item['COLOR CODE'] })
      acc[refNumber]['INSUFFICIENCY RAISED DATE'].push({ 'INSUFFICIENCY RAISED DATE': (item['INSUFFICIENCY RAISED DATE'] ? this.datePipe.transform(item['INSUFFICIENCY RAISED DATE'], 'dd/MMM/yyyy') : null) })
      acc[refNumber]['INSUFFICIENCY CLEARED DATE'].push({ 'INSUFFICIENCY CLEARED DATE': (item['INSUFFICIENCY CLEARED DATE'] ? this.datePipe.transform(item['INSUFFICIENCY CLEARED DATE'], 'dd/MMM/yyyy') : null) })
      acc[refNumber]['INSUFFICIENCY RAISED REMARKS'].push({ 'INSUFFICIENCY RAISED REMARKS': item['INSUFFICIENCY RAISED REMARKS'] })
      return acc;
    }, {});

    const finalDate: any = Object.values(groupedData);
    return finalDate;
  }

  //

  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }

  dialogClose() {
    this.dialog.closeAll();
  }

  // date handling code
  resetDatePicker(controlName: string, index: number) {
    // Reset the form control value after the datepicker is closed
    this.advanceSearchForm.get(controlName).reset(null);
  }

  setMinDateCC(val: any) {
    this.minToDateCC = new Date(val);
  }
  setMinDateFRG(val: any) {
    this.minToDateFRG = new Date(val);
  }

  handleDateChangeForCC(date, controlName, index) {
    let addPos = (this.advanceSearchForm).get(controlName);
    addPos.setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'));
    this.upperCaseForCC(addPos.value, controlName, index);

    this.touchValidationForCC(date.value, controlName, index);
  }
  upperCaseForCC(val, controlName, index) {
    val = val.toUpperCase();
    this.touchValidationForCC(val, controlName, index);
  }


  touchValidationForCC(val, controlName, index) {
    let pos = this.advanceSearchForm.get('caseFromDate');
    let posTo = this.advanceSearchForm.get('caseToDate');
    if (posTo.value && pos.value) {
      let startDate = new Date(pos.value);
      startDate.setHours(0, 0, 0, 0);
      let enddate = new Date(posTo.value);
      enddate.setHours(0, 0, 0, 0);
      if (controlName == 'caseFromDate' && startDate > enddate) {
        pos.setErrors({ comparison: true })
        pos.markAsTouched();
      } else if (controlName == 'caseToDate' && enddate < startDate) {
        posTo.setErrors({ comparison: true })
        posTo.markAsTouched();
      } else {
        posTo.markAsUntouched();
        posTo.setErrors({ comparison: false })
        pos.markAsUntouched();
        pos.setErrors({ comparison: false });
        pos.clearValidators();
        posTo.clearValidators();
        pos.setErrors(null);
        posTo.setErrors(null);
      }
    }
  }

  handleDateChangeForFRG(date, controlName, index) {
    let addPos = (this.advanceSearchForm).get(controlName);
    addPos.setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'));
    this.upperCaseForFRG(addPos.value, controlName, index);

    this.touchValidationForFRG(date.value, controlName, index);
  }
  upperCaseForFRG(val, controlName, index) {
    val = val.toUpperCase();
    this.touchValidationForFRG(val, controlName, index);
  }


  touchValidationForFRG(val, controlName, index) {
    let pos = this.advanceSearchForm.get('reportFromDate');
    let posTo = this.advanceSearchForm.get('reportToDate');
    if (posTo.value && pos.value) {
      let startDate = new Date(pos.value);
      startDate.setHours(0, 0, 0, 0);
      let enddate = new Date(posTo.value);
      enddate.setHours(0, 0, 0, 0);
      if (controlName == 'reportFromDate' && startDate > enddate) {
        pos.setErrors({ comparison: true })
        pos.markAsTouched();
      } else if (controlName == 'reportToDate' && enddate < startDate) {
        posTo.setErrors({ comparison: true })
        posTo.markAsTouched();
      } else {
        posTo.markAsUntouched();
        posTo.setErrors({ comparison: false })
        pos.markAsUntouched();
        pos.setErrors({ comparison: false });
        pos.clearValidators();
        posTo.clearValidators();
        pos.setErrors(null);
        posTo.setErrors(null);
      }
    }
  }
}


export class advanceSearchTemplateVM {
  clientId: number;
  refNo: any;
  typeLookupId: number;
  name: string;
  address: string;
  applicantId: string;
  teamId: number;
  applicationId: number;
  appClientId: number;
  deptId: number;
  caseIntiationFromDate: any;
  caseIntiationToDate: any;
  finalReportGeneratedFromDate: any;
  finalReportGeneratedToDate: any;
  clientCategoryId: number;
  page: number;
  pageSize: number;
  needTotal: boolean;
  filters: any;
  applyPaging: any;
}
export class BulkUploadDoc {
  fileName: string;
  clientId: number;
  clientName: string;
  siteId: number;
  siteName: string;
  autoAssignFlag: boolean;
  loggedId: number;
  bulkUploadDoc: any;
  uploadStatus: boolean;
  verflag: boolean;
  deptId: number;
  teamId: number;
  applicationId: number;
  page: number;
  pageSize: number;
  needTotal: boolean;
  filters: any;
  applyPaging: any;
}
