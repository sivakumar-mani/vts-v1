import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';

@Component({
  standalone: false,
  selector: 'app-common-ocr-upload',
  templateUrl: './common-ocr-upload.component.html',
  styleUrls: ['./common-ocr-upload.component.css']
})
export class CommonOcrUploadComponent {
  @Input() mainForm: UntypedFormGroup;
  @Input() accept = '.pdf, .png, .jpg, .jpeg';
  @Input() getExtraFields: () => any;

  @Output() ocrCompleted = new EventEmitter<any>();
  @Output() fileSelected = new EventEmitter<File>();
  lastUploadedFileName: string = '';  
  lastUploadedFileSize: number = 0;
  constructor(public common: CommonService, public screeningService: ScreeningService, public messageService: MessageService) { }

  ngOnInit() {
  }
  onFileChange(event: any) {
    const file = event.target.files && event.target.files[0];
    const MAX_SIZE_MB = 1;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (!file) {
      return;
    }
    const allowedExtensions = this.accept.split(',').map(ext => ext.trim().toLowerCase());
    const fileExtension = "." + file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      this.showTopCenter('warn', 'Invalid Type', `Only ${this.accept} files are allowed.`);
      event.target.value = '';
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      this.showTopCenter('warn', 'Failure Message', 'File size exceeds 1 MB. Please upload a smaller file.');
      event.target.value = '';
      return;
    }
    if (this.lastUploadedFileName === file.name && this.lastUploadedFileSize === file.size) {
      this.showTopCenter('warn', 'Failure Message', 'This file is already uploaded. Please select a different file.'); //alert();
      event.target.value = '';
      return;
    }
  // Store current file name
  this.lastUploadedFileName = file.name;
    this.lastUploadedFileSize = file.size;

    // this.fileSelected.emit(file);
    let extraFields = this.getExtraOCRFields();
    this.processOCR(file, extraFields).then(result => {
      this.ocrCompleted.emit(result);
      this.fileSelected.emit(file);
       event.target.value = '';
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  getExtraOCRFields() {
    if (this.screeningService.compData.compName.toUpperCase() === this.common.NATIONAL_IDENTITY_CHECK) {
      return { "IdType": "Aadhaar" };
    }
    if (this.screeningService.compData.compName.toUpperCase() === this.common.VOTER_ID) {
      return { "IdType": "Voter's Id" };
    }
    if (this.screeningService.compData.compName.toUpperCase() === this.common.PAN_CARD) {
      return { "IdType": "Pan" };
    }
    if (this.screeningService.compData.compName.toUpperCase() === this.common.PASSPORT) {
      return { "IdType": "Passport" };
    }
    if (this.screeningService.compData.compName.toUpperCase() === this.common.LICENSE) {
      return { "IdType": "Driving License" };
    }
    if (this.screeningService.compData.compName.toUpperCase() === this.common.EDUCATION) {
      if (this.mainForm.get('compRef').get('educationType').value == 'SSC') {
        return { "CertificateType": "SSC" };
      }
      if (this.mainForm.get('compRef').get('educationType').value == 'HSC') {
        return { "CertificateType": "HSC" };
      }
      if (this.mainForm.get('compRef').get('educationType').value == 'UG') {
        return { "CertificateType": "Bachelor's Certificate" };
      }
      if (this.mainForm.get('compRef').get('educationType').value == 'PG') {
        return { "CertificateType": "Master's Certificate" };
      }
      if (this.mainForm.get('compRef').get('educationType').value == 'Professional Qualification') {
        return { "CertificateType": "Diploma Certificate" };//
      }
      if (this.mainForm.get('compRef').get('educationType').value == 'Other Certification Course') {
        return { "CertificateType": "Other Prof. Certificates" };
      }
      else {
        return { "CertificateType": "Other Prof. Certificates" };
      }
    }
    // default (no extra fields)
    return null;
  }
  async processOCR(file: File, extraFields?: any): Promise<any> {
    const compName = this.screeningService.compData.compName.toUpperCase();
    const formData = new FormData();
    formData.append('UploadFiles', file, file.name);

    // Add additional fields if supplied
    if (extraFields) {
      Object.keys(extraFields).forEach(key => {
        formData.append(key, extraFields[key]);
      });
    }
    return this.screeningService.GetDetailsFromOCR(formData, compName).toPromise();
  }
}
