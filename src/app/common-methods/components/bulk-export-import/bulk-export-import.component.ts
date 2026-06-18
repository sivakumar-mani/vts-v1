import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { ScreenAuth } from '../../models/screen-auth';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteDropDown } from '../../models/autoComplete';
import { DatePipe } from '@angular/common';
import { ReportSearchVm } from 'src/app/reports/reportTracker/dynamic-report-component/dynamic-report-component.component';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

export class BulkUploadDoc {
  fileName: string;
  teamSystemName: string;
  clientId: number;
  loggedId: number;
  bulkUploadDoc: any;
  uploadStatus: boolean;
  empflag: boolean;
  genflag: boolean;
  verflag: boolean;
  depId: number;
}
export class MultiDoc {
  ClientID: number;
  LogId: number;
  CandidateDocuments: File;
}
@Component({
  standalone: false,
  selector: 'app-bulk-export-import',
  templateUrl: './bulk-export-import.component.html',
  styleUrls: ['./bulk-export-import.component.css']
})
export class BulkExportImportComponent implements OnInit {
  filesData: any;
  @Input() isFake: boolean;
  @Input() empIns: boolean;
  @Input() verSt: boolean;
  @Input() empHrContact: boolean;
  @Input() instituteFlag: boolean;
  @Input() screenType: string;
  @Output() backEvent = new EventEmitter<any>();
  @ViewChild('uploadConfirm', { static: true }) uploadConfirm!: TemplateRef<any>;
  @ViewChild('fileSizePopUp', { static: true }) fileSizePopUp!: TemplateRef<any>;
  @ViewChild('confirmUploadDoc', { static: true }) confirmUploadDoc!: TemplateRef<any>;
  @ViewChild('successAlert', { static: true }) successAlert!: TemplateRef<any>;
  fileDetail: { fileName: string, fileSize: string, status: string }[] = [];
  routePath = '';
  setOption = 1;
  label = 'Employer';
  header = 'Fake';
  showInst = true;
  fakeInsForm: UntypedFormGroup;
  model = new BulkUploadDoc();
  dupbulkUploadDoc: any[] = [];
  bulkUploadDoc: any;
  userData: any;
  clientList: any[] = [];
  // screenAuth = new ScreenAuth();
  displayedColumns = [
  ];
  docErrorList: any[] = [];
  totalpages: number;
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  showGrid = false;
  empFlag = true;
  clientControls!: AutoCompleteDropDown;
  docList: any[] = [];
  btnType: boolean;
  dupErrorList: any[] = [];
  btnValidate = false;
  btnUpload = true;
  btnDownLoad = false;
  btnExport = false;
  genFlag = false;
  verflag = false;
  headerText: string;
  messageText1: string;
  menuData: any;
  // docErrorList1: any[] = [];
  model1 = new MultiDoc();
  pSize2: any[] = [];
  pSize: any[] = [];

  candidateViewForm: UntypedFormGroup;
  loading: boolean;
  event: LazyLoadEvent;
  reportSearchVm = new ReportSearchVm();
  searchValue: any = '';
  outputDataReportList: any[] = [];
  @ViewChild('dtHistory', { static: true }) dtHistory!: Table;
  isAllSelected: boolean = false;
  isSelected: boolean = false;
  isShowAll: boolean = false;
  itemperpage: number = 10;
  docName: string;
  screenAuth: any = {};
  displayColumns = [
    { field: 'isSelected', header: 'Select All' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'fileName', header: 'File Name' },
    { field: 'fileType', header: 'File Type' },
    { field: 'createdDate', header: 'Created Date' },
  ];


  constructor(private master: MasterService, private common: CommonService, public dialog: MatDialog,
    // tslint:disable-next-line:align
    private messageService: MessageService, private authService: AuthService, private fb: UntypedFormBuilder, public datepipe: DatePipe) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));
    this.EnableFeature(this.screenType);
    this.fakeInsForm = this.fb.group({
      clientId: ['', Validators.required],
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
        '', this.fakeInsForm, false, false, true);
    this.routePath = this.isFake ? this.empIns ? 'Configure / Fake Employer' : 'Configure / Fake Institution'
      : this.empIns ? 'Configure / Employer / Employer Creation' : 'Configure / Institution / Institution Creation';
    // this.header = this.isFake ? 'Fake' : 'Genuine';
    // this.screenAuth = this.isFake ? this.authService.getScreenAuth(this.common.SCRN_FAKE_EMPLOYER_INSTITUTION, this.common.MOD_CONFIGURE) :
    //   this.authService.getScreenAuth(this.common.SCRN_GENUINE_EMP_INS_IMPORT, this.common.MOD_CONFIGURE);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getClient();
    if (this.screenType === 'doj') {
      this.master.GetImportCandidatePendingList().subscribe(res => {
        if (res) {
          this.docList = res;
        }
      });
    } else {
      if (this.verSt === false && !this.empHrContact) {
        this.getImportTemplates(this.empIns, this.isFake);
      } else if (this.empHrContact) {
        this.getImportEmployerHrContact(this.empHrContact);
      }
      else {
        this.getImportAddressTagging(this.verSt);
      }
    }
    if (this.verSt === false) {
      this.displayedColumns = [
        { field: 'excelRow', header: 'Row Number' },
        { field: 'name', header: this.empHrContact ? 'Employer Name' : this.instituteFlag ? 'Institute Name' : (this.empIns ? 'Employer Name' : 'Institution Name') },
        { field: 'detail', header: 'Error Details' },
        { field: 'status', header: 'Status' },
      ];
    }
    else {
      if (this.menuData != null && this.menuData.screenName === 'Candidate document upload') {
        this.displayedColumns = [
          { field: 'fileName', header: 'File Name' }, { field: 'fileSize', header: 'File Size' },
          { field: 'comments', header: 'Comments' }, { field: 'remove', header: 'remove' },
        ];
      } else {
        this.displayedColumns = [
          { field: 'excelRow', header: 'Row Number' },
          { field: 'name', header: this.screenType === 'doj' ? 'Current Employment' : 'Verification Id' },
          { field: 'detail', header: 'Error Details' },
          { field: 'status', header: 'Status' },
        ];
      }
    }
    //Bulk upload option is missing | Live environment | Show stopper
    this.initFormGroup()
    if (this.menuData != null) {
      if (this.userData.applicationId == 1 && this.menuData.screenName === 'Candidate document upload') {
        this.btnDownLoad = true;
      }
      if (this.menuData.screenName === 'Candidate document upload') {
        this.btnUpload = false;
      }
    }
  }
  //  VTS2-2023-Sales-0100 - Document Upload and view document - By Naveen - view Doc start
  initFormGroup() {
    this.candidateViewForm = new UntypedFormGroup({
      fromDate: new UntypedFormControl(null),
      toDate: new UntypedFormControl(null),
      fileName: new UntypedFormControl(''),
    });
  }

  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;
    this.reportSearchVm.filters = '';
    this.reportSearchVm.page = (event.first + event.rows) / 10;
    this.reportSearchVm.pageSize = 10;
    this.reportSearchVm.applyPaging = true;
    this.reportSearchVm.needTotal = true;
    const sort = event.sortField;
    this.reportSearchVm.sorts = sort ? (event.sortOrder == -1 ? '-' : '') + sort : '';
    if (event.sortField) {
      this.searchValue = '';
      this.currentPage = 1;
      this.submitSearchValue();
    }
  }

  getTotalPages1(totalRecords, rows) {
    //this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage1(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
    this.submitSearchValue();
  }
  navigatePage1(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dtHistory.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
      this.submitSearchValue();

    }
  }
  public changeWorkFlow(index, event): void {
    if (this.outputDataReportList.length > 0) {
      for (let i = 0; i < this.outputDataReportList.length; i++) {
        if (i == index) {
          this.outputDataReportList[index].isSelected = event;
        }
      }
      if (this.outputDataReportList.filter(s => s.isSelected === true).length === this.outputDataReportList.length) {
        this.isAllSelected = true;
      } else {
        this.isAllSelected = false
      }

    }
  }

  public SelectAll(e): void {
    if (e === true) {
      this.outputDataReportList.forEach(x => {
        x.isSelected = true;
      });
    } else if (e === false) {
      this.outputDataReportList.forEach(x => {
        x.isSelected = false;
      });
    }
  }
  showall() {
    this.isShowAll = true;
    this.submitSearchValue();
  }

  shievePageSize = 10;
  applyPagination(pageFlag?: any) {
    let filter = this.userData.filters;
    if (this.candidateViewForm.value.filename && this.candidateViewForm.get('filename')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'filename@=' + this.candidateViewForm.value.fileName;
    }
    this.reportSearchVm.pageSize = this.shievePageSize;
    this.reportSearchVm.page = this.currentPage;
    // this.reportSearchVm.filters = filter
    this.reportSearchVm.filters = (this.reportSearchVm.filters == '' || this.reportSearchVm.filters == undefined) ? filter : this.reportSearchVm.filters;
    // this.reportSearchVm.sorts = '';
    this.reportSearchVm.sorts = this.reportSearchVm.sorts != '' ? this.reportSearchVm.sorts : '';
    this.reportSearchVm.applyPaging = pageFlag ? false : true;
    this.reportSearchVm.needTotal = pageFlag ? false : true;
  }

  public submitSearchValue() {
    this.applyPagination(this.isShowAll)
    const fromDate = this.datepipe.transform(this.candidateViewForm.controls.fromDate.value, 'yyyy-MM-dd');
    const toDate = this.datepipe.transform(this.candidateViewForm.controls.toDate.value, 'yyyy-MM-dd');
    // this.candidateViewForm.controls.fileName.setValue('Doc');
    const docViewVm: CandidateDocumentInput = {
      FromDate: fromDate,
      ToDate: toDate,
      FileName: this.candidateViewForm.controls.fileName.value,
      Filters: this.reportSearchVm.filters,
      Sorts: this.reportSearchVm.sorts,
      page: this.reportSearchVm.page,
      pageSize: this.reportSearchVm.pageSize,
      // applyPaging: this.reportSearchVm.applyPaging ,
      // needTotal: this.reportSearchVm.needTotal
      applyPaging: false,
      needTotal: false
    };
    this.master.viewcandidateDoc(docViewVm).subscribe(res => {
      if (res) {
        this.outputDataReportList = res.item1;
        this.outputDataReportList.forEach(ele => {
          ele.createdDate = this.datepipe.transform(ele.createdDate, 'dd/MM/yyyy');
        })
        this.totalpages = res.item2;
      }
    })
  }

  resetForm() {
    this.candidateViewForm.reset();
    this.candidateViewForm.markAsPristine();
    this.initFormGroup();
    this.isShowAll = false;
    this.outputDataReportList = [];
    this.isAllSelected = false;
  }

  downloadDocument() {
    this.outputDataReportList.forEach(ele => {
      if (ele.isSelected == true) {
        // const blob = new Blob([ele.document], { type: 'application/pdf' }); 
        // const url = window.URL.createObjectURL(blob);

        // const a = document.createElement('a');
        // a.href = url;
        // a.download = ele.fileName;
        // document.body.appendChild(a);
        // a.click();

        // window.URL.revokeObjectURL(url);
        // document.body.removeChild(a);

        this.common.downloadDocument(ele.docId, ele.document, ele.fileName + '.' + ele.fileType);
      }
    })
  }
  //  VTS2-2023-Sales-0100 - Document Upload and view document - By Naveen - view Doc End 

  allowSameFileUpload(event: any): void {

    event.srcElement.value = '';


  }
  getImportTemplates(empFlag, isFake) {
    if (isFake) {
      this.genFlag = false;
    } else {
      this.genFlag = true;
    }
    this.master.GetImportTemplete(empFlag ? empFlag : false, this.genFlag, this.instituteFlag ? this.instituteFlag : false, this.empHrContact ? this.empHrContact : false).subscribe(res => {
      if (res) {
        this.docList = res;
      }
    });
  }
  getClient() {
    this.master.GetClient().subscribe(res => {
      if (res) {
        this.clientList = res;
        this.clientList.sort((a, b) => a.clientName.localeCompare(b.clientName));
        this.clientList.splice(0, 0, {
          clientId: 0, clientName: 'Default',
          active: true,
        });
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
            '', this.fakeInsForm, false, false, true);
      }
    });
  }
  openUploadDoc(event: any) {
    this.bulkUploadDoc = '';
    if (this.screenType === "addressTagging") {

      const fileName = event.target.files[0].name;
      const fileExtn = fileName.split('.').pop();
      if (fileExtn === 'xls' || fileExtn === 'xlsx') {
        this.bulkUploadDoc = event.target.files[0];
      } else {
        this.showNotification('warn', 'Failure Message', 'Please upload a file with Extensions: xlsx,xls');
        this.docErrorList = [];
      }
    } else {

      // for (let file of event.target.files) {
      //   // Append to a list
      //   this.filesData.push({
      //     name: file.name,
      //     type: file.type
      //     // Other specs
      //   });
      // }
      this.bulkUploadDoc = event.target.files[0];
      this.filesData = event.target.files[0];
      this.docName = this.bulkUploadDoc.name;

    }
  }

  //  VTS2-2023-Sales-0100 - Document Upload and view document - By Naveen - upload doc Start
  getfileSizeValidation(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.getFileSize(selectedFile);
    }
  }
  getFileSize(file: File): void {
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB
    const formattedSize = fileSizeInMB.toFixed(2);
    const fileDetails = {
      fileName: file.name,
      fileSize: formattedSize,
      comments: parseFloat(formattedSize) > 5 ? 'Not valid, file size more than 5 MB' : 'Valid',
      bulkUploadDoc: file,
    };
    // const fileDetails1 = {
    //   bulkUploadDoc: file,
    //   fileSize: formattedSize,
    //   fileName: file.name
    // };
    this.docErrorList.push(fileDetails);
    // this.docErrorList1.push(fileDetails1);
    let totalfileSize = 0; totalfileSize = this.sum(this.docErrorList);
    if (totalfileSize > 150) {
      this.headerText = 'Confirmation !',
        this.messageText1 = 'The overall file size exceeds 150 MB, please do reupload files within 150 MB';
      this.openDialogAlert1();
      this.docErrorList = [];
      this.docName = '';
    }
  }
  public sum(fileDetail: any[]) {
    let sumdata = fileDetail.reduce((acc, current) => acc + parseFloat(current.fileSize), 0);
    return sumdata;
  }
  public getValidDoc() {
    this.pSize = [];
    // this.pSize2 = [];
    // this.docErrorList1.forEach(ele => {
    //   if (parseFloat(ele.fileSize) < 10) {
    //     this.pSize2.push(ele);
    //   }
    // })
    this.docErrorList.forEach(ele => {
      if (parseFloat(ele.fileSize) < 10) {
        this.pSize.push(ele);
      }
    })
    if (this.pSize.length > 0) {
      this.headerText = 'Confirmation !',
        this.messageText1 = 'We have identified ' + (this.pSize.length) + (this.pSize.length > 1 ? ' files' : ' file') + ' as valid would you like to upload them?';
      this.openDialogAlert2();
    } else {
      this.showNotification('warn', 'Failure Message', 'Please upload valid file to continue');
    }
  }

  uploadDoc(data: any) {
    const formData = new FormData();
    for (let i = 0; i < data.length; i++) {
      if (data[i].fileName) {
        formData.append(
          "CandidateDocuments" + i,
          data[i].bulkUploadDoc
        );
      }
    }
    formData.append('ClientID', this.userData.clientId);
    formData.append('LoggedID', this.userData.userId);
    this.master.getcandidateDoc(formData).subscribe(res => {
      if (res == true) {
        this.dialog.closeAll();
        this.headerText = 'Confirmation !',
          this.messageText1 = 'Files uploaded successfully';
        this.openDialogAlert3()
      } else {
        (error) => {
          this.showNotification('warn', 'Failure Message', error);
        }
      }
    })
  }
  public openDialogAlert1() {
    const dialogRef = this.dialog.open(this.fileSizePopUp, {
      width: '330px',
      disableClose: true
    });
  }
  public openDialogAlert2() {
    const dialogRef = this.dialog.open(this.confirmUploadDoc, {
      width: '330px',
      disableClose: true
    });
  }
  public openDialogAlert3() {
    const dialogRef = this.dialog.open(this.successAlert, {
      width: '330px',
      disableClose: true
    });
  }

  cancel() {
    this.docErrorList = [];
    this.docName = '';
    this.pSize2 = [];
    // this.docErrorList1 = [];
  }
  reject(index, List) {
    this.docName = '';
    for (let i = 0; i < List.length; i++) {
      if (i == index) {
        List.splice(index, 1);
      }
    }
    this.docErrorList = List;
    // this.docErrorList1 = List;
  }
  //  VTS2-2023-Sales-0100 - Document Upload and view document - By Naveen - upload doc End

  validateFile() {

  }
  uploadDialog(value: any) {
    this.btnType = value;
    if (this.bulkUploadDoc !== undefined) {
      if (this.isFake) {
        if (this.fakeInsForm.valid) {
          this.dialog.open(this.uploadConfirm, {
            width: '320px',
            disableClose: true
          });
        } else {
          this.fakeInsForm.markAllAsTouched();
        }
      } else {
        this.dialog.open(this.uploadConfirm, {
          width: '320px',
          disableClose: true
        });
      }
    } else {
      this.showNotification('warn', 'Failure Message', 'Please upload a file');
    }
  }
  dialogClose() {
    this.dialog.closeAll();
  }
  removeDocument() {
    this.bulkUploadDoc = '';
    this.bulkUploadDoc = [];
    // this.docErrorList1 = [];
    this.pSize2 = [];
    this.docName = '';
  }
  validateUploadFile(option: any) {

    if (this.bulkUploadDoc === '' || this.bulkUploadDoc === undefined || this.bulkUploadDoc.length === 0) {
      this.showNotification('warn', 'Failure Message', 'Please upload a file to validate');
    } else {
      if (this.verSt === true || this.screenType === 'doj') {
        this.saveAddressTaggingBulkUpload(option);
      } else if (this.empHrContact) {
        this.saveEmployerHrContactDetailsUpload(option);
      }
      else {
        if (this.isFake) {
          if (this.fakeInsForm.valid) {
            this.saveEmpInsBulkUpload(option);
          } else {
            this.fakeInsForm.markAllAsTouched();
          }
        } else {
          this.saveEmpInsBulkUpload(option);
        }
      }
    }

  }
  getImportEmployerHrContact(empHrContact: any) {
    this.master.getImportEmployerHrContact(empHrContact).subscribe(res => {
      if (res) {
        this.docList = res;
      }
    });
  }

  saveEmployerHrContactDetailsUpload(option: any) {
    const formData = new FormData();
    this.model.clientId = 0;
    this.model.loggedId = this.userData.userId;
    this.model.fileName = this.bulkUploadDoc.name;
    this.model.bulkUploadDoc = this.bulkUploadDoc;
    this.model.uploadStatus = option;
    this.model.empflag = false;
    this.model.depId = this.userData.deptId;
    formData.append('EmployerHrContactImport', this.bulkUploadDoc);
    formData.append('EmployerHrContact', JSON.stringify(this.model));
    this.master.employerHrContactImport(formData).subscribe(resp => {
      this.afterSave(resp);
    });
  }
  saveEmpInsBulkUpload(option: any) {
    const formData = new FormData();
    this.model.clientId = this.isFake ? this.fakeInsForm.controls.clientId.value : 0;
    this.model.loggedId = this.userData.userId;
    this.model.fileName = this.bulkUploadDoc.name;
    this.model.bulkUploadDoc = this.bulkUploadDoc;
    this.model.uploadStatus = option;
    this.model.empflag = this.empIns;
    this.model.depId = this.userData.deptId;
    if (this.isFake) {
      this.model.genflag = false;
    } else {
      this.model.genflag = true;
    }
    formData.append('FakeEmployer', this.bulkUploadDoc);
    formData.append('FakeEmpInsMaster', JSON.stringify(this.model));
    if (this.instituteFlag === true) {
      this.master.InstituteImport(formData).subscribe(resp => {
        this.afterSave(resp);
      });
    } else {
      this.master.saveFakeEmpInsImport(formData).subscribe(resp => {
        this.afterSave(resp);
      });
    }
  }
  afterSave(resp: any) {
    if (resp) {
      if (resp.fakeMasValidResponse.length > 0) {
        this.showGrid = true;
        this.currentPage = 1;
        this.docErrorList = resp.fakeMasValidResponse;
        this.dupErrorList = this.docErrorList.filter(x => x.status === 'Success');
        if (this.dupErrorList.length === this.docErrorList.length) {
          this.showNotification('success', 'Success Message', 'Uploaded Successfully');
          this.bulkUploadDoc = '';
          this.fakeInsForm.reset();
          this.showGrid = false;
        } else {
          if (resp.response.success === true) {
            this.showNotification('success', 'Success Message', 'Uploaded Successfully');
            this.bulkUploadDoc = '';
            this.fakeInsForm.reset();
            this.showGrid = false;
          }
        }
      } else {
        if (resp.response.success === true) {
          this.showNotification('success', 'Success Message', 'Uploaded Successfully');
        } else {
          this.showNotification('warn', 'Failure Message', resp.response.message);
        }
      }
    }
    this.dialogClose();
  }
  back() {
    this.backEvent.emit();
  }
  downloadDoc(data: any) {
    this.common.downloadDocument(0, data.document, data.fileName);
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
  showNotification(level, info, message) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  getImportAddressTagging(verflag: any) {
    this.master.getImportAddressTagging(verflag).subscribe(res => {
      if (res) {
        this.docList = res;
      }
    });
  }
  saveAddressTaggingBulkUpload(option: any) {
    const formData = new FormData();
    this.model.loggedId = this.userData.userId;
    this.model.fileName = this.bulkUploadDoc.name;
    this.model.bulkUploadDoc = this.bulkUploadDoc;
    this.model.uploadStatus = option;
    this.model.teamSystemName = this.userData.teamName;
    formData.append(this.screenType === 'doj' ? 'TechmEmailDespathImport' : 'AddressTagging', this.bulkUploadDoc);
    formData.append(this.screenType === 'doj' ? 'TechmEmailDespathImport' : 'AddressTaggingReport', JSON.stringify(this.model));
    if (this.screenType === 'doj') {
      this.master.CandidatePendingListImport(formData).subscribe(resp => {
        this.saveTagging(resp);
        if (this.showGrid === false) {
          this.back();
        }
      });
    } else {
      this.master.saveAddressTagging(formData).subscribe(resp => {
        this.saveTagging(resp);
      });
    }
  }
  saveTagging(resp: any) {
    if (resp.addressValidResponse.length > 0 && resp.addressValidResponse.length < 200) {
      this.showGrid = true;
      this.docErrorList = resp.addressValidResponse;
      this.dupErrorList = this.docErrorList.filter(x => x.status === 'Success');
      if (this.dupErrorList.length === this.docErrorList.length) {
        this.showNotification('success', 'Success Message', 'Uploaded Successfully');
        this.bulkUploadDoc = '';
        this.showGrid = false;
      }
    } else {
      if (resp.response.success === true) {
        this.showNotification('success', 'Success Message', 'Uploaded Successfully');
      } else {
        this.showNotification('warn', 'Failure Message', resp.response.message);
      }
    }
    this.dialogClose();
  }
  // changed by vignesh M - VTS2-2023-Sales-0100 - Document Upload and view document
  EnableFeature(screenType: any) {
    if (screenType !== "candidateDocumentUpload") {
      this.btnValidate = true;

      this.btnExport = true;

    }


  }

}

export class CandidateDocumentInput {
  FromDate: any;
  ToDate: any;
  FileName: string;
  Filters: string;
  Sorts: string;
  page: number;
  pageSize: number;
  applyPaging: boolean;
  needTotal: boolean;
}
