import { Component, OnInit, Input, ViewChild, TemplateRef, SimpleChange, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { ScreeningDocument, ScreeningDetails } from 'src/app/common-methods/models/screening-details';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { User } from 'src/app/common-methods/models/user';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
@Component({
  standalone: false,
  selector: 'app-client-app-document-upload',
  templateUrl: './client-app-document-upload.component.html',
  styleUrls: ['./client-app-document-upload.component.css'],
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
export class ClientAppDocumentUploadComponent implements OnInit {
  size = 0;
  state: string = 'default';
  docdata: any;
  fileUpload: any;
  dir: string;
  url: any;
  fileString;
  imageSource: any;
  downldata: any;
  zoomval: number;
  rvalue: number;
  enableUpload: boolean = false;
  @Input() mainForm: UntypedFormGroup;
  @Input() formgroupName: string;
  @Input() dupScreeningDoc: ScreeningDocument[] = [];
  @Input() validationFlag: boolean;
  @Input() doctType: any[] = [];
  @Input() confirmtype: any;
  @Input() showDocType = false;
  @Input() header = 'Supporting Documents';
  @Input() fileBtn: boolean;
  @Input() responseConfirmationType: any[] = [];
  @Input() verificationMode: any[] = [];
  @Input() verificationTransBindDet;
  @Input() docHint = '';
  @Input() showDocumentRemove = true;
  @Input() digitalDocument: [];
  @Input() invitationFlag: boolean;
  model = new ScreeningDetails();
  @Input() frmArray: UntypedFormArray;
  documentType = new UntypedFormControl();
  responseConfirmation = new UntypedFormControl();
  modeofConfirmation = new UntypedFormControl();
  userData = new User();
  // image
  showPreview: boolean;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @ViewChild('imgDialog', { static: true }) imgDialog: TemplateRef<any>;
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
  cropperTransform: ImageTransform = {};
  fileData: Blob;
  action: any;
  srcElementVal: any;
  confirmTypeName: any;
  digitalAddressPVReportList: any;
  addressdocument: any;
  fileDialogShouldOpen: boolean = false;
  constructor(public common: CommonService, private sanitizer: DomSanitizer, private sharedService: SharedService, public dialog: MatDialog,
    private messageService: MessageService, public screeningService: ScreeningService,
    private imageCompress: NgxImageCompressService, public verification: VerificationService) { }

  ngOnInit() {
    if(this.screeningService?.compData?.compName?.toUpperCase() ===
            this.common.CRIMINAL_DATABASE && this.common.clientId === 797) {
      this.validationFlag = true
    }
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.mainForm) {
      if (this.header === 'response' || this.header === 'recievedInfo' || this.header === 'Gap Reason Supporting Documents') {
        this.frmArray = this.mainForm.get(this.formgroupName) as UntypedFormArray;
      } else {
        this.frmArray = this.mainForm.get(this.formgroupName).get('componentDocument') as UntypedFormArray;
      }
      if (!this.frmArray) {
        this.frmArray = this.mainForm.get(this.formgroupName) as UntypedFormArray;
      }
    }
    if (!this.validationFlag && this.validationFlag !=undefined) {
      this.mainForm.get(this.formgroupName).get('componentDocument')?.clearValidators();
    } else if (this.validationFlag !=undefined){
      if (this.mainForm.get(this.formgroupName).get('componentDocument')?.value.length == 0) {
        this.mainForm.get(this.formgroupName).get('componentDocument')?.setErrors({ required: true });
      } else {
        this.mainForm.get(this.formgroupName).get('componentDocument')?.clearValidators();
      }
    }

    // if (this.mainForm.value.modeofVerificationId > 0) {
    //   this.modeofConfirmation.setValue(this.mainForm.value.modeofVerificationId);
    // }
    if (this.mainForm.value.screeningComponentInfo && this.mainForm.value.screeningComponentInfo.notApplicableFlag !== true) {
      this.fileBtn = false;
    }
    //this.digitalPVReport();
    // if (this.confirmtype && this.confirmtype.controls.responseConfirmationId.value > 0) {
    //   this.responseConfirmation.setValue(this.confirmtype.controls.responseConfirmationId.value);
    // }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.validationFlag) {
      if (!this.validationFlag) {
        this.mainForm.get(this.formgroupName).get('componentDocument')?.clearValidators();
      } else {
        if (this.mainForm.get(this.formgroupName).get('componentDocument')?.value.length == 0) {
          this.mainForm.get(this.formgroupName).get('componentDocument')?.setErrors({ required: true });
        } else {
          this.mainForm.get(this.formgroupName).get('componentDocument')?.clearValidators();
        }
      }
    }
  }
  fileInputClicked = (event) => {
    if (this.formgroupName === 'candidate.document') {
      this.fileDialogShouldOpen =
        ((this.showDocType && this.documentType.value > 0) || this.userData.applicationId == 3) ? true : false;
    } else if (this.formgroupName !== 'candidate.document') {
      this.fileDialogShouldOpen = true;
    }
    if (this.fileDialogShouldOpen) {
      return true;
    }
    else {
      this.showNotification('warn', '', 'Please select document type and then upload')
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }
  fileInputClicked1(event: any) {
    event.preventDefault();
    document.getElementById('file-upload').click();
  }
  drop(event: CdkDragDrop<[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  allowSameFileUpload(event: any): void {
    if (this.header !== 'response') {
      event.srcElement.value = '';
    } else {

    }


  }

  uploaddoc(event: any) {
    if (this.showDocType) {
      if (this.documentType.value > 0) {
        this.openUploadDoc(event);
      } else {
        event.srcElement.value = '';
        this.documentType.setErrors(Validators.required);
        this.documentType.markAsTouched();
      }

    } else if (this.header === 'response') {
      if (this.responseConfirmation.value > 0) {
        // this.imageChangedEvent = event;
        if (event.target.files.length > 0) {
          const ext = event.target.files[0].name.split('.').pop();
          if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'jpeg' || ext === 'gif' || ext === 'psd' || ext === 'bmp' || ext === 'msg') {
            if (event.target.files[0].size <= 10240000) {
              this.srcElementVal = event.srcElement.value;
              const file = event.target.files[0];
              const reader = new FileReader();
              reader.onloadend = (e) => {
                this.imageChangedEvent = reader.result;
              };
              reader.readAsDataURL(file);
              this.openUploadDoc(event);
              event.srcElement.value = '';
              this.imageChangedEvent = '';
            } else {
              this.showTopCenter('warn', 'Failure Message',
                'Please upload a valid image file with size less than 5 MB');
            }
          } else {
            this.showTopCenter('warn', 'Failure Message',
              'Please upload a valid file,' + ' Acceptable file Formats : .png, .jpg, .JPG, .jpeg, .gif, .psd, .bmp, .msg');
          }
        }
      } else {
        event.srcElement.value = '';
        this.responseConfirmation.setErrors(Validators.required);
        this.responseConfirmation.markAsTouched();
      }
    } else {
      this.documentType.setErrors(null);
      this.documentType.markAsUntouched();
      this.responseConfirmation.setErrors(null);
      this.responseConfirmation.markAsUntouched();
      this.openUploadDoc(event);
    }
  }
  confirmType(e: any) {
    if (e > 0) {
      this.confirmtype.controls.responseConfirmationId.setValue(e);
      this.confirmTypeName = this.verification.tempData.verificationTransBindDet.receivedConfirmationType.find(x => x.lookUpId === e);
      if (this.confirmTypeName.lookUpName === 'Telephone' || this.confirmTypeName.lookUpName === 'Verbally' || this.confirmTypeName.lookUpName === 'Unable to Verify') {
        const screenDoc = new ScreeningDocument();
        screenDoc.screeningDocId = 0;
        screenDoc.docTypeId = this.verificationTransBindDet.receivedConfirmLookupId;
        screenDoc.screeningDocId = 0;
        screenDoc.docSubTypeId = 0;
        screenDoc.fileName = '';
        screenDoc.document = null;
        screenDoc.responseConfirmationId = e;
        this.frmArray.push(this.initScreeningDocForm());
        this.model.document.push(screenDoc);
        this.dupScreeningDoc.push(screenDoc);
        this.frmArray.at(this.frmArray.length - 1).patchValue(this.dupScreeningDoc[this.dupScreeningDoc.length - 1]);
        this.responseConfirmation.setValue('');
      }
    }
  }
  confirmType1(e: any) {
    if (e > 0) {
      // this.confirmtype.controls.receivedResponseDocument.controls.modeofVerificationId.setValue(e);
      // this.confirmTypeName = this.verification.tempData.verificationTransBindDet.verificationMode.find(x => x.lookUpId === e);
    }
  }
  openUploadDoc(event: any) {
    this.size = 0;
    for (let i = 0; i < this.frmArray.length; i++) {
      if (this.frmArray.value[i].document.length != 0) {
        this.size += this.frmArray.value[i].document.size
      }
    }
    this.size = this.size + event.target.files[0].size;
    const fileSize = this.fileSizeValidation(this.size);
    if (!fileSize) {
      this.size = 0;
      this.showTopCenter('warn', 'Failure Message', 'the overall file size should be less than 5 MB');
      return;
    }
    else {
      let i = 0;
      for (i; i < event.target.files.length; i++) {
        const screenDoc = new ScreeningDocument();
        const ext = event.target.files[i].name.split('.').pop().toLowerCase();
        if (this.header === 'response') {
          screenDoc.fileName = event.target.files[i].name;
          screenDoc.document = event.target.files[i];
        } else {
          screenDoc.fileName = event.target.files[i].name;
          screenDoc.document = event.target.files[i];
        }
        screenDoc.filePath = '';
        screenDoc.screeningDocId = 0;
        if (this.header === 'response') {
          const receivedConfirmLookupId = this.verificationTransBindDet.receivedConfirmLookupId;
          screenDoc.docTypeId = receivedConfirmLookupId;
          this.documentType.setValue(screenDoc.docTypeId);
        } else if (this.header === 'recievedInfo') {
          const receivedInfoDocLookupId = this.verificationTransBindDet.receivedInfoDocLookupId;
          screenDoc.docTypeId = receivedInfoDocLookupId;
          this.documentType.setValue(screenDoc.docTypeId);
        } else if (this.header === 'component') {
          const typeId = this.doctType.find(x => x.lookUpName === 'Component Document');
          this.documentType.setValue(typeId.lookUpId);
          screenDoc.docTypeId = typeId.lookUpId;
          this.documentType.setValue(screenDoc.docTypeId);
        } else {
          screenDoc.docTypeId = this.documentType.value;
        }
        screenDoc.docSubTypeId = 0;
        screenDoc.responseConfirmationId = this.header === 'response' ? this.responseConfirmation.value : 0;

        if (this.mainForm) {
          if (!(this.header === 'response' || this.header === 'recievedInfo' || this.header === 'Gap Reason Supporting Documents')) {
            this.frmArray = this.mainForm.get(this.formgroupName).get('componentDocument') as UntypedFormArray;
            if (!this.frmArray) {
              this.frmArray = this.mainForm.get(this.formgroupName) as UntypedFormArray;
            }
          }
        }

        if (this.header === 'response' || this.header === 'Annexure Upload') {
          if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'jpeg' || ext === 'gif' || ext === 'psd' || ext === 'bmp' || ext === 'msg') {
            if (this.dupScreeningDoc !== undefined) {
              if (this.frmArray.value.some(x => x.fileName === screenDoc.fileName &&
                x.responseConfirmationId === this.responseConfirmation.value)) {
                this.showTopCenter('warn', 'Failure Message', 'File already exists with this name.');
              } else {
                this.frmArray.push(this.initScreeningDocForm());
                this.model.document.push(screenDoc);
                this.dupScreeningDoc.push(screenDoc);
                this.frmArray.at(this.frmArray.length - 1).patchValue(this.dupScreeningDoc[this.dupScreeningDoc.length - 1]);
              }
            } else {
              this.frmArray.push(this.initScreeningDocForm());
              this.model.document.push(screenDoc);
              this.dupScreeningDoc.push(screenDoc);
              this.frmArray.patchValue(this.dupScreeningDoc);
            }
          } else {
            this.showTopCenter('warn', 'Failure Message',
              'Please upload a valid file,' + ' Acceptable file Formats : .png, .jpg, .JPG, .jpeg, .gif, .psd, .bmp, .msg');
          }

        } else {
          if (ext === 'eml' || ext === 'pst' || ext === 'txt' || ext === 'pdf' || ext === 'docx' || ext === 'doc'
            || ext === 'xps' || ext === 'xlsx' || ext === 'xls' || ext === 'xlsb' || ext === 'xlsm'
            || ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'jpeg' || ext === 'gif' || ext === 'psd' || ext === 'tiff'
            || ext === 'eps' || ext === 'raw' || ext === 'msg') {
            if (this.dupScreeningDoc !== undefined) {
              if (this.frmArray.value.some(x => x.fileName === screenDoc.fileName && x.docTypeId === this.documentType.value)) {
                this.showTopCenter('warn', 'Failure Message', 'File already exists with this name.');
              } else {
                this.frmArray.push(this.initScreeningDocForm());
                this.model.document.push(screenDoc);
                this.dupScreeningDoc.push(screenDoc);
                this.frmArray.at(this.frmArray.length - 1).patchValue(this.dupScreeningDoc[this.dupScreeningDoc.length - 1]);
              }
            } else {
              this.frmArray.push(this.initScreeningDocForm());
              this.model.document.push(screenDoc);
              this.dupScreeningDoc.push(screenDoc);
              this.frmArray.patchValue(this.dupScreeningDoc);
            }
          } else {
            this.showTopCenter('warn', 'Failure Message',
              'Please upload a valid file,' + ' Acceptable file Formats : .eml, .pst, .txt, .pdf, .docx, .doc, .xps' +
              '' + ', .xlsx, .xls, .xlsb, .xlsm , .png, .jpg, .JPG, .jpeg, .gif, .psd, .tiff, .eps, .raw, .msg');
          }
        }
      }
    }
  }
compressImage(file1: any) {
  const file = file1.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    const result = reader.result;

    if (typeof result === 'string') {
      this.imageCompress.compressFile(result, -1, 75, 50).then(
        compressed => {
          this.imageChangedEvent = compressed;
        }
      );
    }
  };

  reader.readAsDataURL(file);
}

  convertDataUrlToBlob(dataUrl): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  removeDocument(data, index) {
    // if (data.screeningDocId === 0) {
    this.frmArray.removeAt(index);
    // }
    this.dupScreeningDoc.splice(index, 1);
    this.model.document.splice(index, 1);
    this.verification.recivedDocument = false;
  }
  downloadDoc(data: any) {
    if (data.screeningDocId > 0) {
      this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
        this.common.downloadDocument(data.docId, resp.document, resp.fileName);
      });
    } else {
      this.common.saveByteArray(data.fileName, data.document);
    }
  }
  downloadDoc1(event, data) {
    if (data) {
      this.screeningService.downloadDocument(data).subscribe(resp => {
        this.common.downloadDocument(data.docId, resp.document, resp.fileName);
        this.enableUpload = true;
      });
    }
    event.preventDefault();
    //  else {
    //   this.common.saveByteArray(data.fileName, data.document);
    // }

  }
  showNotification(level: string, info: string, message: string) {
    this.sharedService.emitChange({
      severity: level,
      summary: info,
      detail: message
    });
  }
  initScreeningDocForm() {
    return new UntypedFormGroup({
      screeningDocId: new UntypedFormControl(0),
      document: new UntypedFormControl([]),
      fileName: new UntypedFormControl(''),
      filePath: new UntypedFormControl(''),
      docTypeId: new UntypedFormControl(0),
      docSubTypeId: new UntypedFormControl(0),
      insuffDocTransId: new UntypedFormControl(0),
      responseConfirmationId: new UntypedFormControl(),
    });
  }

  getDocVlaue(): ScreeningDocument[] {
    if (this.frmArray != undefined) {
      return this.frmArray.value;
    }
  }
  isUpload(): boolean {
    let array = this.mainForm.get('screeningComponentInfo.componentDocument')?.value;
    return array.some(e => e.fileName.includes('Screening Application Form')) || array.some(e => e.fileName.includes('Consent Form'));
  }
  getDocTypeName(typeId): string {
    let type: any;
    if (typeId) {
      type = this.doctType.find(f => f.lookUpId === typeId);
    }
    return type ? type.lookUpName : '';
  }
  getResConfName(document): string {
    let resType: any;
    if (document.responseConfirmationId) {
      resType = this.responseConfirmationType.find(f => f.lookUpId === document.responseConfirmationId);
    }
    return resType ? resType.lookUpName : '';
  }
  downloadloa() {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/documents/AuthorizationForm.pdf';
    link.download = 'AuthorizationForm';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.dialog.open(this.imgDialog, {
      width: '400px'
    });
  }
  imageCropped(event: ImageCroppedEvent) {
    //this.croppedImage = event.base64;
    //this.fileData = this.common.convertBase64ToFileObj(this.croppedImage);
  }
  closeDialog(type: any) {
    if (type === 'close') {
      this.srcElementVal = '';
    }
    // this.showPreview = true;
    this.action = type;
    this.dialog.closeAll();
  }
  rotate(type: any) {
    switch (type) {
      case 'right':
        this.cropperTransform = { ...this.cropperTransform, rotate: (this.cropperTransform.rotate || 0) + 90 };
        break;
      case 'left':
        this.cropperTransform = { ...this.cropperTransform, rotate: (this.cropperTransform.rotate || 0) - 90 };
        break;
      case 'flipHorizontal':
        this.cropperTransform = { ...this.cropperTransform, flipH: !this.cropperTransform.flipH };
        break;
      case 'flipVertical':
        this.cropperTransform = { ...this.cropperTransform, flipV: !this.cropperTransform.flipV };
        break;
      default:
        break;
    }
  }
  downloadFile(data, filename, docId) {
    this.verification.getDigitalDocument(docId).subscribe(resp => {
      if (resp.document) {
        const sampleArr = this.base64ToArrayBuffer(resp.document);
        this.saveByteArray(filename, sampleArr);
      } else {
        alert('file does not exists');
      }
    });
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
  preview(data: any) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp' || ext === 'msg') {
      if (data.screeningDocId == 0) {
        const blob = new Blob([data.document], { type: 'image/jpeg;base64' });

        // if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
        //   (window.navigator as any).msSaveOrOpenBlob(blob, data.fileName);
        // } else { 
        //   const a = document.createElement('a');
        //   document.body.appendChild(a);
        //   a.setAttribute('style', 'display:none;');
        //   const csvUrl = window.URL.createObjectURL(blob);
        //   this.url = csvUrl;
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
        // };
      }
      else if (data.screeningDocId != 0) {
        this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
          if (resp) {
            this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
          }
        });
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.screeningDocId == 0) {
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
      else if (data.screeningDocId != 0) {
        this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
          if (resp) {
            const blob = base64StringToBlob(resp.document, 'application/octet-stream');
            const csvUrl = window.URL.createObjectURL(blob);
            this.url = csvUrl;
          }
        });
      }
      this.dialog.open(this.pdfDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else {
      this.downloadDoc(this.downldata);
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
        this.downloadDoc(this.downldata);
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
  fileSizeValidation(size: any) {
    return this.bytesToSize(size);
  }
  bytesToSize(bytes: any) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    const total = Math.round(bytes / Math.pow(1024, i));
    if (i === 2) {
      return total > 5 ? false : true;
    } else if (i > 2) {
      return false;
    } else {
      return true;
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
