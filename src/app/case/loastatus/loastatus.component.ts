import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { Table, TableModule } from 'primeng/table';
import { Documents, CaseLoa } from 'src/app/common-methods/models/loastatus';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
@Component({
  standalone: false,
  selector: 'app-loastatus',
  templateUrl: './loastatus.component.html',
  styleUrls: ['./loastatus.component.css'],
  animations: [
    trigger('rotatedState', [
      state('reset', style({ transform: 'rotate(0deg)' })),
      state('right', style({ transform: 'rotate(90deg)' })),
      state('down', style({ transform: 'rotate(180deg)' })),
      state('left', style({ transform: 'rotate(270deg)' })),
      state('up', style({ transform: 'rotate(360deg)' })),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})
export class LOAStatusComponent implements OnInit {
  state: string = 'default';
  url: any;
  dir: string;
  imageSource: any;
  downldata: any;
  fname: any
  sid: any;
  downid: any;
  imageChangedEvent: any = '';
  downname: any;
  downmethod: any;
  zoomval: number;
  rvalue: number;
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
  itemperpage;
  btnSend = false;
  btnReject = false;
  breadcrumbFlags = new BreadcrumbFlags();
  showFlag = false;
  routePath = 'Client / LOA Approval / BGV Approval';
  loaStatusFormGroup: UntypedFormGroup;
  displayedColumns = [
    { field: 'clientReferenceNo', header: 'Case Ref no', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'screeningOwnerName', header: 'Assigned Owner', value: true, disabled: true },
    { field: 'applicantId', header: 'Applicant Id', value: true, disabled: true },
    { field: 'candidateName', header: 'Candidate Name', value: true, disabled: true },
    { field: 'caseReceivedDate', header: 'Case Received Date And Time', value: true },
    { field: 'caseInititationDate', header: 'Case Initiation Date', value: true },
    { field: 'remarks', header: 'Remarks & Instruction', value: true },
    { field: 'accManagerName', header: 'Client Account Manager', value: true },
    { field: 'type', header: 'Type', value: true, disabled: true },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  documentList = new Documents();
  caseDocument: Documents[] = [];
  screenAuth: any = {};
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  getLoaList: any[] = [];
  data: any;
  saveList = new CaseLoa();
  userData: any;
  @ViewChild('global', { static: true }) global!: ElementRef;
  clientReferenceNoFormCtrl = new UntypedFormControl();
  clientReferenceNoFilteredOptions: Observable<string[]>;
  @ViewChild('clientReferenceNoTrigger', { static: true }) clientReferenceNoTrigger: MatMenuTrigger;
  clientNameFormCtrl = new UntypedFormControl();
  clientNameFilteredOptions: Observable<string[]>;
 @ViewChild('clientNameTrigger', { static: true }) 
clientNameTrigger!: MatMenuTrigger;
  applicantIdFormCtrl = new UntypedFormControl();
  applicantIdFilteredOptions: Observable<string[]>;
  @ViewChild('applicantIdTrigger', { static: true }) applicantIdTrigger: MatMenuTrigger;
  candidateNameFormCtrl = new UntypedFormControl();
  candidateNameFilteredOptions: Observable<string[]>;
  @ViewChild('candidateNameTrigger', { static: true }) candidateNameTrigger: MatMenuTrigger;
  remarksFormCtrl = new UntypedFormControl();
  remarksFilteredOptions: Observable<string[]>;
  @ViewChild('remarksTrigger', { static: true }) remarksTrigger: MatMenuTrigger;
  @ViewChild('assignedTrigger', { static: true }) assignedTrigger: MatMenuTrigger;
  assignedFormCtrl = new UntypedFormControl();
  assignedFilteredOptions: Observable<string[]>;
  @ViewChild('accmgrTrigger', { static: true }) accmgrTrigger: MatMenuTrigger;
  accmgrFormCtrl = new UntypedFormControl();
  accmgrFilteredOptions: Observable<string[]>;
  loastatus: any;
  loaflag = false;
  caseDetails: any;
  @ViewChild('actionTrigger', { static: true }) actionTrigger: MatMenuTrigger;
  filednames: any[];
  tableContent = [{ header: 'Pending', data: [] }, { header: 'Approved', data: [] }];
  constructor(private sanitizer: DomSanitizer, public dialog: MatDialog,private fb: UntypedFormBuilder, public commonService: CommonService, private messageService: MessageService,
    // tslint:disable-next-line:align
    private authService: AuthService, private screeningService: ScreeningService,
    private router: Router, ) { }

  ngOnInit() {
    this.breadcrumbFlags = this.commonService.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.bindLOAStatus();
    this.filednames = this.displayedColumns.filter(e => e.disabled);
    if (this.userData.teamName === 'ApprovalManager') {
      this.tableContent.push({ header: 'Rejected', data: [] });
    }
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.loaStatusFormGroup = this.fb.group({
      caseNo: [''],
      lOARemarks: [''],
      loggedIn: [this.userData.userId],
      document: [],
    });
  }
  ngOnDestroy() {
    this.commonService.loaActiveTabindex = 0;
  }
  bindLOAStatus() {
    this.screeningService.GetLOAStatus(this.userData.userId).subscribe(resp => {
      this.getLoaList = resp;
      this.tableContent[0].data = this.getLoaList.filter(e => (e.loaStatus).toLowerCase() === (this.tableContent[0].header).toLowerCase());
      this.tableContent[1].data = this.getLoaList.filter(e => (e.loaStatus).toLowerCase() === (this.tableContent[1].header).toLowerCase());
      const list = this.getLoaList.filter(e => (e.loaStatus).toLowerCase() === 'rejected');
      if (this.userData.teamName === 'ApprovalManager') {
        this.tableContent[2].data = list;
      } else {
        this.tableContent[0].data.push(...list);
      }
      this.getLoaList.forEach(ele => {
        ele.candidateName = ele.candidateFirstName + ' ' + ele.candidateMiddleName + ' ' + ele.candidateLastName;
      });
    }, err => { }, () => {
      this.TblAutoFilters();
    });
  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.TblAutoFilters();
  }
  resetForm() {
    this.loaStatusFormGroup.reset();
    this.documentList = new Documents();
    this.saveList.caseDocument = [];
    this.initFormGroup();
  }
  closeForm() {
    this.loaStatusFormGroup.reset();
    this.saveList.caseDocument = [];
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.commonService.breadcrumbFlags();
    this.btnSend = false;
    this.btnReject = false;
    this.breadcrumbFlags.btnReset = false;
  }
  saveCaseLOA(type: any) {
    if (this.data.preApproval === false) {
      if (this.saveList.caseDocument.length === 0) {
        this.loaStatusFormGroup.get('document')?.setValidators(Validators.required);
        this.loaStatusFormGroup.get('document')?.updateValueAndValidity();
      } else {
        this.loaStatusFormGroup.get('document')?.clearValidators();
        this.loaStatusFormGroup.get('document')?.updateValueAndValidity();
      }
      this.saveList.caseDocument = this.saveList.caseDocument;
    } else {
      this.saveList.caseDocument = [];
      this.loaStatusFormGroup.get('document')?.clearValidators();
      this.loaStatusFormGroup.get('document')?.updateValueAndValidity();
    }
    this.saveList.caseNo = this.data.caseNo;
    this.saveList.loggedIn = this.loaStatusFormGroup.get('loggedIn')?.value;
    this.saveList.lOARemarks = this.loaStatusFormGroup.get('lOARemarks')?.value;
    if (this.loaStatusFormGroup.valid) {
      if (type === 'Approved') {
        const formData = new FormData();
        formData.append('ScopeCreation', JSON.stringify(this.saveList));
        if (this.data.preApproval === false) {
          if (this.saveList.caseDocument) {
            for (let i = 0; i < this.saveList.caseDocument.length; i++) {
              formData.append('ScopeCreation_' + i, this.saveList.caseDocument[i].document);
            }
          }
        }
        this.screeningService.AddLOACreation(formData).subscribe(resp => {
          if (resp) {
            this.showTopCenter('success', 'success Message', 'Approved Successfully');
            this.bindLOAStatus();
            this.closeForm();
          }
        });
      } else if (type === 'Rejected') {
        this.screeningService.RejectLOACreation(this.saveList).subscribe(resp => {
          if (resp) {
            this.showTopCenter('success', 'success Message', 'Rejected Successfully');
            this.bindLOAStatus();
            this.closeForm();
          }
        });
      }
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  add() { }
  addLOA(data: any) {
    this.initFormGroup();
    this.btnSend = true;
    this.documentList.fileName = '';
    this.breadcrumbFlags.toolTip = 'Approve';
    this.breadcrumbFlags = this.commonService.breadcrumbFlags();
    this.breadcrumbFlags.btnSave = false;
    this.showFlag = !this.showFlag;
    this.data = data;
    this.loastatus = data.loaStatus;
    if (this.data.preApproval === true && this.loastatus === 'Pending') {
      this.btnReject = true;
    }
    if (this.loastatus === 'Pending') {
      this.loaflag = true;
      this.btnSend = true;
      this.breadcrumbFlags.btnReset = true;
    } else if (this.loastatus === 'Approved') {
      this.loaflag = false;
      this.btnSend = false;
      this.breadcrumbFlags.btnReset = false;
    } else if (this.loastatus === 'Rejected') {
      this.loaflag = true;
      this.btnSend = true;
      this.breadcrumbFlags.btnReset = true;
    }
  }
  getCaseDetailsByClientId(data: any) {
    // const Id = data.clientId;
    this.screeningService.getDetailsByClientId(data).subscribe(resp => {
      if (resp) {
        this.caseDetails = resp;
      }
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
  openUploadDoc(event: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      this.documentList = new Documents();
      this.documentList.caseDocumentId = 0;
      this.documentList.fileName = event.target.files[i].name;
      this.documentList.document = event.target.files[i];
      this.documentList.docType = 'ApprovedDocument';
      if (this.saveList.caseDocument.filter(x => x.fileName === this.documentList.fileName).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Document has been already exist');
      } else {
        this.saveList.caseDocument.push(this.documentList);
        this.loaStatusFormGroup.get('document')?.clearValidators();
        this.loaStatusFormGroup.get('document')?.updateValueAndValidity();
      }
    }
  }
  removeDocument(index: any) {
    this.saveList.caseDocument.splice(index, 1);
    if (this.saveList.caseDocument.length === 0) {
      this.loaStatusFormGroup.get('document')?.setValue(null);
    }
  }
  private TblAutoFilters(): void {
    this.clientReferenceNoFilteredOptions = this.clientReferenceNoFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getLoaList.map(x => x.clientReferenceNo).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.clientNameFilteredOptions = this.clientNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getLoaList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.applicantIdFilteredOptions = this.applicantIdFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getLoaList.map(x => x.applicantId).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.candidateNameFilteredOptions = this.candidateNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getLoaList.map(x => x.candidateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.remarksFilteredOptions = this.remarksFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getLoaList.map(x => x.remarks).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.assignedFilteredOptions = this.assignedFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getLoaList.map(x => x.screeningOwnerName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.accmgrFilteredOptions = this.accmgrFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getLoaList.map(x => x.accManagerName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
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
    const blob = new Blob([byte], { type: 'application/octet-stream' });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else { // for Non-IE (chrome, firefox etc.)
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none;');
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
    }
  }
  showall(num: any) {
     if (this.tableContent.length > 0) {
        this.itemperpage = num;
    }
  }
  resetpage(){
      this.itemperpage = 10;
  }
  //preview
  downloadApprovedDoc(data: any) {
    if (data.documentId) {
      this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
        if (resp.document) {
          this.commonService.downloadDocument(data.documentId, resp.document, data.fileName);
        } else {
          alert('file does not exists');
        }
      });
    } else {
      this.commonService.saveByteArray(data.fileName, data.document);
    }
    
  }
  preview(data: any) {
     this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    // this.fname = fileName;
    // this.sid = screeningDocId;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.documentId == 0 || data.caseDocumentId == 0) {
        const blob = new Blob([data.document], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (data.documentId > 0) {
        this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.documentId == 0 || data.caseDocumentId == 0) {
        const blob = new Blob([data.document], { type: 'application/octet-stream' });
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
          (window.navigator as any).msSaveOrOpenBlob(blob, data.fileName);
        } else {
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display:none;');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        };
      }
      else if (data.documentId > 0) {
        this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        });
      }
      this.dialog.open(this.pdfDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else {
      this.downloadApprovedDoc(data);
    }
  }
  pdftool(type: any) {
    switch (type) {
      case 'right':
        this.rvalue += 90;
        break;
      case 'left':
        this.rvalue -= 90;
        break;
      case 'zoomin':
        this.zoomval += 0.1;
        break;
      case 'zoomout':
        this.zoomval -= 0.1;
        break;
      case 'reset':
        this.zoomval = 1;
        this.rvalue = 0;
        break;
      case 'download':
        this.downloadApprovedDoc(this.downldata);
        break;
      default:
        break;

    }
  }
  zoomin() {

    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;
    if (currWidth == 1500) return false;
    else {
      myImg.style.width = (currWidth + 100) + "px";
    }
  }

  zoomout() {
    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;

    if (currWidth == 100) return false;
    else {
      myImg.style.width = (currWidth - 100) + "px";
    }
  }
  rotateimg(route: any) {
    this.dir = route
    this.state = (this.state === 'default' ? 'rotated' : this.dir);
  }
}

