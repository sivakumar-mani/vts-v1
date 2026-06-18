import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ScreeningService } from '../../services/screening.service';
import { VerificationService } from '../../services/verification.service';
import { CommonService } from '../../services/common.service';
import { SubmissionService } from '../../services/submission.service';
@Component({
  standalone: false,
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  logoList: any;
  userData: any;
  // Added By Megala - For VTS2-2024-CRT-0195
  @Input() btnCAMApproval = false;
  @Input() btnCAMApprovalDisabled = false;
  @Input() btnAdd = false;
  @Input() btnBulk = false;
  @Input() btnSave = false;
  @Input() btnPreview = false;
  @Input() btnMoveTl = false;
  @Input() btnMoveTlDisabled = false;
  @Input() btnReAssign = false;
  @Input() btnReAssignDisabled = false;
  @Input() btnMoveQc = false;
  @Input() btnMoveClient = false;
  @Input() btnReset = false;
  @Input() btnBulkApproval = false;
  @Input() btnBack = false;
  @Input() btnResetTbl = false;
  @Input() btnAddDisabled = false;
  @Input() btnBulkDisabled = false;
  @Input() btnMoveQcDisabled = false;
  @Input() btnMoveCLientDisabled = false;
  @Input() btnSaveDisabled = false;
  @Input() btnBulkApprovalDisabled=false;
  @Input() btnValidate = false;
  @Input() btnUpload = false;
  @Input() btnAddUpload = false;
  @Input() btnExport = false;
  @Input() btnApprove = false;
  @Input() btnSend = false;
  @Input() btnReview = false;
  @Input() btnApproveDisabled = false;
  @Input() btnSendDisabled = false;
  @Input() btnRejectDisabled = false;
  @Input() btnHoldDisabled = false;
  @Input() btnExportDisabled = false;
  @Input() btnAddUploadDisabled =false;
  @Input() btnUploadDisabled = false;
  @Input() btnReject = false;
  @Input() btnSearch = false;
  @Input() btnHold = false;
  @Input() toolTip = '';
  @Input() routePath = '';
  @Input() btnDownLoad = false;
  @Input() btnPreviewInvoice = false;
  @Input() btnPreviewInvoiceDisabled =false;
  @Input() btnDelete = false;
  @Input() btnExcelExport = false;
  @Input() showRoutePath = true;
  @Input() price = 0;
  @Input() btntatInsuff = false;
   // Added By Megala - For VTS2-2024-CRT-0195
  @Output() eventCAMApproval = new EventEmitter<any>();
  @Output() eventAdd = new EventEmitter<any>();
  @Output() eventBulk = new EventEmitter<any>();
  @Output() eventSave = new EventEmitter<any>();
  @Output() eventPreview = new EventEmitter<any>();
  @Output() eventMoveQc = new EventEmitter<any>();
  @Output() eventMoveClient = new EventEmitter<any>();
  @Output() eventReAssign = new EventEmitter<any>();
  @Output() eventMoveTl = new EventEmitter<any>();
  @Output() eventBack = new EventEmitter<any>();
  @Output() eventBulkApproval=new EventEmitter<any>();
  @Output() eventReset = new EventEmitter<any>();
  @Output() eventResetTbl = new EventEmitter<any>();
  @Output() eventValidate = new EventEmitter<any>();
  @Output() eventUpload = new EventEmitter<any>();
  @Output() eventExport = new EventEmitter<any>();
  @Input() btnEstExcelExport = false;
  @Output() eventApprove = new EventEmitter<any>();
  @Output() eventReview = new EventEmitter<any>();
  @Output() eventAddUpload = new EventEmitter<any>();
  @Output() eventSend = new EventEmitter<any>();
  @Output() eventReject = new EventEmitter<any>();
  @Output() eventSearch = new EventEmitter<any>();
  @Output() eventHold = new EventEmitter<any>();
  @Output() eventDownload = new EventEmitter<any>();
  @Output() eventPreviewInvoice = new EventEmitter<any>();
  @Output() eventDelete = new EventEmitter<any>();
  @Output() eventExcelExport = new EventEmitter<any>();
  @Output() eventEstExcelExport = new EventEmitter<any>();
  @Output() eventTatInsuff = new EventEmitter<any>();
  routPath: any;
  closedFlag = false;
  constructor(public submissionService: SubmissionService,public screeningService:ScreeningService, public verification: VerificationService, public common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.routPath = this.routePath.split('/');
    this.closedFlag = this.verification.closedCheck;
    if (this.userData.applicationId === 3) {
      this.submissionService.getCandidateDetail(this.userData.userId).subscribe(resp => {
        if (resp) {
          this.logoList = resp;
        }
      });
    }
  }
  preview() {
    this.eventPreview.emit();
  }
  ReAssign(){
    this.eventReAssign.emit();
  }
  moveTl() {
    this.eventMoveTl.emit();
  }
  // Added By Megala - For VTS2-2024-CRT-0195
  CAMApproval() {
    this.eventCAMApproval.emit();
  }
  moveClient(){
    this.eventMoveClient.emit();
  }
  moveQc() {
    this.eventMoveQc.emit();
  }
  moveCLient() {
    this.eventMoveClient.emit();
  }
  save() {
    this.eventSave.emit();
  }
  add() {
    this.eventAdd.emit();
  }
  bulkClearance() {
    this.eventBulk.emit();
  }
  back() {
    this.eventBack.emit();
  }
  bulkApproval(){
    this.eventBulkApproval.emit();
  }
  hold() {
    this.eventHold.emit();
  }
  reset() {
    this.eventReset.emit();
  }
  resetTbl() {
    this.eventResetTbl.emit();
  }
  validateFile() {
    this.eventValidate.emit();
  }
  uploadFile() {
    this.eventUpload.emit();
  }
  addUploadFile() {
    this.eventAddUpload.emit();
  }
  exportFile() {
    this.eventExport.emit();
  }
  approve() {
    this.eventApprove.emit();
  }
  review() {
    this.eventReview.emit();
  }
  send() {
    this.eventSend.emit();
  }
  reject() {
    this.eventReject.emit();
  }
  search() {
    this.eventSearch.emit();
  }
  download() {
    this.eventDownload.emit();
  }
  previewInvoice() {
    this.eventPreviewInvoice.emit();
  }
  delete() {
    this.eventDelete.emit();
  }
  TatInsufficiency() {
    this.eventTatInsuff.emit();
  }
  excelExport() {
    this.eventExcelExport.emit();
  }
  EstexcelExport() {
    this.eventEstExcelExport.emit();
  }
}
