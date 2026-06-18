import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/common-methods/services/client.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import { AgreementDocument } from 'src/app/common-methods/models/clientEntryMaster';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  standalone: false,
  selector: 'app-client-agreement',
  templateUrl: './client-agreement.component.html',
  styleUrls: ['./client-agreement.component.css'],
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
export class ClientAgreementComponent implements OnInit {
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
  @Input() mainForm: UntypedFormGroup;
  @Input() agreementForm: UntypedFormGroup;
  @Input() bindData: any;
  constructor(public dialog: MatDialog, public screeningService: ScreeningService, private sanitizer: DomSanitizer, public clientService: ClientService, public commonService: CommonService, private messageService: MessageService) { }

  ngOnInit() {
    if (this.mainForm.value.clientEntry.clientId > 0) {
      this.agreementAvailabilityChange(this.mainForm.value.clientAgreement.agreementAvailabilityFlag);
      this.typeOfAgreementChange(this.mainForm.value.clientAgreement.typeOfAgreement);
      this.renewalChange(this.mainForm.value.clientAgreement.autoRenewal);
    }
  }
  agreementAvailabilityChange(value: any) {
    const ctrlsYes = ['typeOfAgreement', 'dateOfAgreement', 'validity', 'autoRenewal', 'reminder', 'dateOfExpiry', 'remarks',
      'autoRenewalPeriod'];
    const ctrlsNo = ['reasonofNonAvailability'];
    if (value === true) {
      this.setValidation(ctrlsYes);
      this.clearValidation(ctrlsNo);
    } else if (value === false) {
      this.setValidation(ctrlsNo);
      this.clearValidation(ctrlsYes);
    } else {
      this.clearValidation(ctrlsYes);
      this.clearValidation(ctrlsNo);
    }
  }
  typeOfAgreementChange(value: any) {
    if (value) {
      const ctrls = ['remarks'];
      if (this.commonService.getNameById(this.bindData.typeOfAgreement, 'lookUpId', 'lookUpName',
        value).toLowerCase() === this.commonService.OTHERS.toLowerCase()) {
        this.setValidation(ctrls);
      } else {
        this.clearValidation(ctrls);
      }
    }
  }
  renewalChange(value: any) {
    const ctrls = ['autoRenewalPeriod'];
    if (value === true) {
      this.setValidation(ctrls);
    } else {
      this.clearValidation(ctrls);
    }
  }
  setValidation(ctrls: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < ctrls.length; i++) {
      this.agreementForm.get(ctrls[i]).setValidators(Validators.required);
      this.agreementForm.get(ctrls[i]).updateValueAndValidity();
    }
  }
  clearValidation(ctrls: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < ctrls.length; i++) {
      this.agreementForm.get(ctrls[i]).clearValidators();
      this.agreementForm.get(ctrls[i]).updateValueAndValidity();
      this.agreementForm.get(ctrls[i]).setValue(null);
    }
  }
  openUploadDoc(event: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const agreementDocument = new AgreementDocument();
      agreementDocument.fileName = event.target.files[i].name;
      agreementDocument.document = event.target.files[i];
      agreementDocument.agreementDocId = 0;
      agreementDocument.type = 'clientAgreement';
      if (this.mainForm.controls.clientAgreementDocument.value.filter(x => x.fileName === agreementDocument.fileName).length > 0) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'File already exists');
        this.agreementForm.get('supportingDocument')?.setValue(null);
      } else {
        this.mainForm.controls.clientAgreementDocument.value.push(agreementDocument);
        this.mainForm.get('clientAgreementDocument')?.setValue(this.mainForm.controls.clientAgreementDocument.value);
      }
    }
  }
  removeDocument(index: any) {
    this.mainForm.controls.clientAgreementDocument.value.splice(index, 1);
    this.mainForm.get('clientAgreementDocument')?.setValue(this.mainForm.controls.clientAgreementDocument.value);
    this.agreementForm.get('supportingDocument')?.setValue(null);
  }
  downloadFile(data: any) {
    this.clientService.downloadFile(data, data.fileName, data.agreementDocId)
  }
  preview(data: any) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    // this.fname = fileName;
    // this.sid = screeningDocId;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.agreementDocId == 0) {
        const blob = new Blob([data.document], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (data.agreementDocId > 0) {
        this.clientService.getDocumentDetail(data.agreementDocId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.agreementDocId == 0) {
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
      else if (data.agreementDocId > 0) {
        this.clientService.getDocumentDetail(data.agreementDocId).subscribe(resp => {
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
      this.downloadFile(data);
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
        this.downloadFile(this.downldata);
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
