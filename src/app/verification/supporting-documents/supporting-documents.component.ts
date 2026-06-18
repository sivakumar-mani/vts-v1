import { Component, OnInit, Input, OnChanges, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningDetails, ScreeningDocument } from 'src/app/common-methods/models/screening-details';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { debug } from 'console';
@Component({
  standalone: false,
  selector: 'app-supporting-documents',
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.css'],
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
export class SupportingDocumentsComponent implements OnInit, OnChanges {
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
  docHeader = 'false';
  responseDoc = 'response';
  @Input() verificationForm: UntypedFormGroup;
  @Input() formgroupName: string;
  @Input() supportingDocument: ScreeningDocument[] = [];
  @Input() infoDocument: ScreeningDocument[] = [];
  @Input() responseDocument: ScreeningDocument[] = [];

  @Input() screeningCompId: number;
  @Input() paymentDetails: any;
  @Input() paymentList: any[] = [];
  @Input() commList: any;
  @Input() communicationDetails: any;
  @Input() overrideFeeDetails: any;
  @Input() digitalDocument: any[] = [];
  userData: any;
  docType: any;
  closedFlag = false;
  screenAuth: any = {};
  digiFileName: any;
  constructor(private sanitizer: DomSanitizer, public verificationService: VerificationService, public commonService: CommonService, private message: MessageService,
    private screeningService: ScreeningService, public dialog: MatDialog, public authService: AuthService) { }
  ngOnChanges() {
    // if (this.overrideFeeDetails) {
    //   this.bindOverideFee();
    // }
  }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.commonService.VERIFICATION_ROUTER);
    this.closedFlag = this.verificationService.closedCheck;
    const docType = this.verificationForm.get('verificationTransBindDet')?.value?.documentType;

    this.docType = docType
      ? docType.filter(x => x.lookUpName !== 'Component Document')
      : [];
  }
  RefreshDigiLockerDocuments() {
    this.screeningService.getDigiLockerDocuments(this.verificationService.tempData.screeningCandidateDet.candidateId).subscribe(resp => {
      if (resp) {
        this.digiFileName = resp;

        this.verificationService.tempData.digiLockerDocuments = resp
        // Remove duplicates based on digilockerDocumentId
        this.verificationService.tempData.digiLockerDocuments = this.verificationService.tempData.digiLockerDocuments.filter(
          (doc, index, self) =>
            index === self.findIndex((t) => t.digilockerDocumentId === doc.digilockerDocumentId)
        );
      }
    });
  }
  saveDocument(type: string) {
    if (type === 'document') {
      if (this.verificationForm.get('verificationResponseDocument.responseFileDocument.document')?.value.length > 0) {
        this.updateSupportingDocument();
      } else {
        this.showTopCenter('error', 'Alert Message', 'Supporting document required');
      }
    } else if (type === 'recivedDocument') {
      if (this.verificationForm.get('verificationResponseDocument.receivedInfoDocument.document')?.value.length > 0) {
        this.updateRecievedLetterDocument();
      } else {
        this.showTopCenter('error', 'Alert Message', 'Received document required');
      }

    } else if (type === 'responseDocument') {
      let confirmFlag = false;
      const confirmType = this.verificationService.tempData.verificationTransBindDet.receivedConfirmationType.find(x => x.lookUpId ===
        this.verificationForm.get('verificationResponseDocument.responseConfirmationId')?.value);
      if (confirmType && (confirmType.lookUpName === 'Telephone' || confirmType.lookUpName === 'Verbally')) {
        confirmFlag = true;
      } else {
        confirmFlag = false;
      }
      if ((this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.document')?.value.length > 0) ||
        (confirmFlag === true &&
          this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.document')?.value.length > 0)) {
        this.updateResponseDocument();
      } else {
        this.showTopCenter('error', 'Alert Message', 'Response document required');
      }
    }
  }

  updateSupportingDocument() {
    const formData = new FormData();
    for (let i = 0; i < this.verificationForm.get('verificationResponseDocument.responseFileDocument.document')?.value.length; i++) {
      if (this.verificationForm.get('verificationResponseDocument.responseFileDocument.document')?.value[i].fileName) {
        formData.append('ScreeningDocument_' + i, this.verificationForm
          .get('verificationResponseDocument.responseFileDocument.document')?.value[i].document);
      }
    }
    this.verificationForm.get('verificationResponseDocument.responseFileDocument.screeningCompId')?.setValue(null);
    formData.append('VerificationSupportingDoc', JSON.stringify(this.verificationForm.
      get('verificationResponseDocument.responseFileDocument').value));
    this.verificationService.addSupportingDocument(formData).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.commonService.changeLastUpdatedUser(this.verificationForm);
      }
    }, err => { }, () => {
    });
  }
  updateRecievedLetterDocument() {
    const formData = new FormData();
    for (let i = 0; i < this.verificationForm.get('verificationResponseDocument.receivedInfoDocument.document')?.value.length; i++) {
      if (this.verificationForm.get('verificationResponseDocument.receivedInfoDocument.document')?.value[i].fileName) {
        formData.append('ScreeningComponentDocument_' + 0 + '_' + i, this.verificationForm.
          get('verificationResponseDocument.receivedInfoDocument.document').value[i].document);
      }
    }
    this.verificationForm.get('verificationResponseDocument.receivedInfoDocument.recivedDocumentFlag')?.setValue(true);
    formData.append('VerificationDocument', JSON.stringify(this.verificationForm.
      get('verificationResponseDocument.receivedInfoDocument').value));
    this.verificationService.addVerificationDocument(formData).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
      }
    }, err => { }, () => {
    });
  }
  updateResponseDocument() {
    const formData = new FormData();
    for (let i = 0; i < this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.document')?.value.length; i++) {
      if (this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.document')?.value[i].fileName) {
        formData.append('ScreeningComponentDocument_' + 0 + '_' + i, this.verificationForm.
          get('verificationResponseDocument.receivedResponseDocument.document').value[i].document);
      } else {
        formData.append('ScreeningComponentDocument_' + 0 + '_' + i, null);
      }
    }
    this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.createdUserId')?.setValue(this.userData.userId);
    this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.responseDocumentFlag')?.setValue(true);
    formData.append('VerificationDocument', JSON.stringify(this.verificationForm.
      get('verificationResponseDocument.receivedResponseDocument').value));
    if (this.verificationService.tempData.ctsflag === true) {
      if (this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.modeofVerificationId')?.value > 0) {
        this.verificationService.addVerificationDocument(formData).subscribe(res => {
          if (res) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            let confirmFlag = false;
            const confirmType = this.verificationService.tempData.verificationTransBindDet.receivedConfirmationType.find(x => x.lookUpId ===
              this.verificationForm.get('verificationResponseDocument.responseConfirmationId')?.value);
            if (confirmType.lookUpName === 'Telephone' || confirmType.lookUpName === 'Verbally' || confirmType.lookUpName === 'Unable to Verify') {
              confirmFlag = true;
            } else {
              confirmFlag = false;
            }
            if ((this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.document')?.value.length > 0 ||
              confirmFlag === true)) {
              this.verificationService.recivedDocument = true;
            } else {
              this.verificationService.recivedDocument = false;
            }
          }
        }, err => { }, () => {
        });
      } else {
        this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.modeofVerificationId')?.setValidators(Validators.required);
        this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.modeofVerificationId')?.updateValueAndValidity();
        this.showTopCenter('warn', 'Alert Message', 'Kindly Select Mode of Verification');
      }
    }
    else {
      this.verificationService.addVerificationDocument(formData).subscribe(res => {
        if (res) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          let confirmFlag = false;
          const confirmType = this.verificationService.tempData.verificationTransBindDet.receivedConfirmationType.find(x => x.lookUpId ===
            this.verificationForm.get('verificationResponseDocument.responseConfirmationId')?.value);
          if (confirmType.lookUpName === 'Telephone' || confirmType.lookUpName === 'Verbally' || confirmType.lookUpName === 'Unable to Verify') {
            confirmFlag = true;
          } else {
            confirmFlag = false;
          }
          if ((this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.document')?.value.length > 0 ||
            confirmFlag === true)) {
            this.verificationService.recivedDocument = true;
          } else {
            this.verificationService.recivedDocument = false;
          }
        }
      }, err => { }, () => {
      });
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
  downloadFile(data, filename, docId) {
    this.verificationService.getDigitalDocument(docId).subscribe(resp => {
      if (resp.document) {
        const sampleArr = this.base64ToArrayBuffer(resp.document);
        this.saveByteArray(filename, sampleArr);
      } else {
        alert('file does not exists');
      }
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  // preview


  downloadDoc(data, type) {
    if (type == 'FrScreening' || data.isFRDocument === true || type == 'DigiLockerScreening') {
      if (data.researchDocTransId > 0) {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          this.commonService.downloadDocument(data.docId, resp.document, resp.fileName);
        });
      }
      else if (data.digilockerDocumentId > 0) {
        this.screeningService.downloaDigiLockerDocument(data.digilockerDocumentId).subscribe(resp => {
          if (resp) {
            this.commonService.downloadDocument(data.docId, resp.document, data.fileName);
          } else {
            alert('file does not exists');
          }
        });
      }
      else if (data.docId > 0) {
        this.screeningService.DownloadSupportingDocument(data.docId).subscribe(resp => {
          if (resp) {
            this.commonService.downloadDocument(data.docId, resp.document, data.fileName);
          } else {
            alert('file does not exists');
          }
        });
      }
      else {
        this.commonService.saveByteArray(data.fileName, data.document);
      }
    }
    else {
      if (data.screeningDocId > 0) {
        this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
          this.commonService.downloadDocument(data.screeningDocId, resp.document, resp.fileName);
        });
      }
      else if (data.digilockerDocumentId > 0) {
        this.screeningService.downloaDigiLockerDocument(data.digilockerDocumentId).subscribe(resp => {
          if (resp) {
            this.commonService.downloadDocument(data.docId, resp.document, data.fileName);
          } else {
            alert('file does not exists');
          }
        });
      }
      else if (data.docId > 0) {
        this.screeningService.DownloadSupportingDocument(data.docId).subscribe(resp => {
          if (resp) {
            this.commonService.downloadDocument(data.docId, resp.document, data.fileName);
          } else {
            alert('file does not exists');
          }
        });
      }
      else {
        this.commonService.saveByteArray(data.fileName, data.document);
      }
    }
  }
  // downloadDoc1(data: any) {
  //   if (data.docId > 0) {
  //     this.screeningService.DownloadSupportingDocument(data.docId).subscribe(resp => {
  //       if (resp) {
  //         this.commonService.downloadDocument(data.docId, resp.document, data.fileName);
  //       } else {
  //         alert('file does not exists');
  //       }
  //     });
  //   } else {
  //     this.commonService.saveByteArray(data.fileName, data.document);
  //   }
  // }





  preview(data, type) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    // this.fname = fileName;
    // this.sid = screeningDocId;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.screeningDocId == 0 || data.docId == 0) {
        const blob = new Blob([data.document1], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (data.screeningDocId > 0) {
        this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      else if (data.researchDocTransId > 0 && type == 'FrScreening') {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      else if (data.docId > 0) {
        this.screeningService.DownloadSupportingDocument(data.docId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.screeningDocId == 0 || data.docId == 0) {
        const blob = new Blob([data.document1], { type: 'application/octet-stream' });
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
      else if (data.screeningDocId > 0 && type == 'screening') {
        this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        });
      } else if (data.researchDocTransId > 0 && type == 'FrScreening') {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        });
      }
      else if (data.docId > 0 && type == 'screening') {
        this.screeningService.DownloadSupportingDocument(data.docId).subscribe(resp => {
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
      this.downloadDoc(data, type);
    }
  }
  DigiLockerpreview(data, type) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    // this.fname = fileName;
    // this.sid = screeningDocId;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {

      if (data.digilockerDocumentId > 0 && type == 'DigiLockerScreening') {
        this.screeningService.downloaDigiLockerDocument(data.digilockerDocumentId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }

      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {

      if (data.digilockerDocumentId > 0 && type == 'DigiLockerScreening') {
        this.screeningService.downloaDigiLockerDocument(data.digilockerDocumentId).subscribe(resp => {
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
      this.downloadDoc(data, type);
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
        this.downloadDoc(this.downldata, type);
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
