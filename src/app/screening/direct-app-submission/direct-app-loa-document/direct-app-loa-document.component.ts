import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { ScreeningDocument } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from "primeng/api";
@Component({
  standalone: false,
  selector: 'app-direct-app-loa-document',
  templateUrl: './direct-app-loa-document.component.html',
  styleUrls: ['./direct-app-loa-document.component.css']
})
export class DirectAppLoaDocumentComponent implements OnInit {

  userData = new User();
  @Input() mainForm: UntypedFormGroup;
  @Input() formgroupName: string;
  @Input() screeningDocument: ScreeningDocument[] = [];
  doctType: any[] = [];
  htmlContent: any;
  safeHtml: SafeHtml;
  isChecked: boolean;
  dialogRef: any;
  @ViewChild('empDialog', { static: true }) empDialog;
 //empIdForm: UntypedFormGroup;
  employeerId: string;
  htmlContentss: any;
  htmlContents: any;
  employeerName: any;
  empForm: UntypedFormGroup;
  candidateName: any;
  signatureUrl: any | ArrayBuffer | null = null;
  signature: any | ArrayBuffer | null = null;

  constructor(public screeningService: ScreeningService, public fb :UntypedFormBuilder,private messageService: MessageService, public dialog: MatDialog,public datepipe: DatePipe, public common: CommonService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initEmpForm();
    this.getScreeningDocumentType();
    if (this.mainForm.get(this.formgroupName + '.isStaticLoa').value === false) {
      this.GetCliectCustomLoa();
      //this.initempIdFormForm();
    }
    if (this.mainForm.get(this.formgroupName + '.isStaticLoa').value === true && (this.mainForm.get(this.formgroupName + '.consentLookupName').value === 'EConsent'|| this.mainForm.get(this.formgroupName + '.consentLookupName').value === 'ESignatureLOA')) {
      this.agreeChange();
    }
    this.mainForm.get(this.formgroupName + '.loadocumentHtml')?.valueChanges.subscribe(html => {
      if (html && this.mainForm.get(this.formgroupName + '.isStaticLoa')?.value === false) {
        this.GetCliectCustomLoa();
      }
    });
    this.mainForm.get(this.formgroupName + '.isStaticLoa')?.valueChanges.subscribe(isStatic => {
      if (isStatic === false && this.mainForm.get(this.formgroupName + '.loadocumentHtml')?.value) {
        this.GetCliectCustomLoa();
      }
      if (isStatic === true && (this.mainForm.get(this.formgroupName + '.consentLookupName')?.value === 'EConsent' || this.mainForm.get(this.formgroupName + '.consentLookupName')?.value === 'ESignatureLOA')) {
        this.agreeChange();
      }
    });
  }
  onSignatureSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0]; // ✅ Correct way to get the file

    const reader = new FileReader();
    reader.onload = () => {
      this.signatureUrl = reader.result as string; // ✅ Preview the image
      // assign Base64 string to form control
      this.mainForm.get(this.formgroupName + '.EconsentSignature')
                   .setValue(this.signatureUrl);
    };
    reader.readAsDataURL(file);
  }
}

  agreeChange() {
    this.mainForm.get(this.formgroupName) as UntypedFormArray;
    if (this.mainForm.get(this.formgroupName + '.iagreeFlag').value) {
      this.common.currentDateTime = this.datepipe.transform((new Date), 'dd/MM/yyyy h:mm a');
      this.mainForm.get(this.formgroupName + '.consentSignature').enable();
      const firstName = this.mainForm.get(this.formgroupName + '.aliasFirstName').value
      const middleName = this.mainForm.get(this.formgroupName + '.aliasMiddleName').value
      const lastName = this.mainForm.get(this.formgroupName + '.aliasLastName').value
      this.mainForm.get(this.formgroupName + '.consentSignature').setValue(firstName + middleName + lastName);
      this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(true);
      this.signature=this.htmlContent = this.mainForm.get(this.formgroupName + '.EconsentSignature').value;
    if(this.signature!=null){
      this.signatureUrl=this.signature;
    }
    } else {
      this.common.currentDateTime = '';
      this.mainForm.get(this.formgroupName + '.consentSignature').setValue('');
      this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(false);
    }
  }
  getScreeningDocumentType() {
    this.screeningService.getScreeningDocumentType().subscribe(resp => {
      if (resp) {
        this.doctType = resp;
      }
    });
  }
  GetCliectCustomLoa(): SafeHtml {
    this.mainForm.get(this.formgroupName) as UntypedFormArray;
    this.htmlContent = this.mainForm.get(this.formgroupName + '.loadocumentHtml').value;
    const currentDate = '____/____/____';
    const fullname = '___________________________';
    this.employeerId = '______________';
    this.employeerName = '___________________________';
    this.htmlContent = this.mainForm.get(`${this.formgroupName}.loadocumentHtml`).value
      .replace(/\[@@SIGNATURE\]/g, fullname)
      .replace(/\[@@EMPLOYEENAME\]/g,this.employeerName)
      .replace(/\[@@DATE\]/g, currentDate)
      .replace(/\[@@EMPLOYEEID\]/g, this.employeerId);
    this.screeningService.loaHtml = this.htmlContent;
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.screeningService.loaHtml);
    return this.safeHtml;
  }
  LoaChange(event: Event) {
    this.isChecked = (event.target as HTMLInputElement).checked;
    if (this.isChecked === true) {
      if(this.empForm.valid){

      this.common.currentDateTime = this.datepipe.transform((new Date), 'dd/MM/yyyy h:mm a');

      const firstName = this.mainForm.get(this.formgroupName + '.aliasFirstName').value
      const middleName = this.mainForm.get(this.formgroupName + '.aliasMiddleName').value
      const lastName = this.mainForm.get(this.formgroupName + '.aliasLastName').value
      this.candidateName = firstName + middleName + lastName;
      this.mainForm.get(this.formgroupName + '.consentSignature').setValue(firstName + middleName + lastName);
       this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(true);
      this.employeerId = this.empForm.controls.empId.value;
      this.employeerName = this.empForm.controls.empName.value;
      if (this.mainForm.get(this.formgroupName + '.iagreeFlag').value === true){
       this.saveafterchangeDoc(this.employeerName, this.isChecked,this.employeerId,this.candidateName)
      }else{
        this.GetAutoFecthClientCustomLoas(this.employeerName, this.isChecked,this.employeerId,this.candidateName);
      }
      
      }
      else{
        this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(false);
        this.mainForm.get(this.formgroupName + '.consentSignature').setValue('');
        this.showNotification('warn', 'Failure Message', 'Please Enter Your Employee Details');
        this.openDialog();
      }
    }
    else {
      this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(false);
      this.employeerId = '______________';
      //this.GetAutoFecthClientCustomLoas(fullname, this.isChecked,this.employeerId);
      this.GetaftersaveUncheckCusLoas()
    }
  }
  saveafterchangeDoc(employeerName, isChecked,employeerId,candidateName){
    // this.screeningService.GetCliectCustomLoa(this.screeningService.screeningId,this.screeningService.clientId).subscribe(res =>{
    //   if(res: any) {
        //this.htmlContentss = res.customLoaHtmlText
        this.htmlContentss = this.mainForm.get(`${this.formgroupName}.loaDocumentDefaultHtml`).value;
        const currentDate = isChecked ? new Date().toLocaleDateString('en-GB') : '____/____/____';
        this.htmlContents = this.htmlContentss
        .replace(/\[@@SIGNATURE\]/g, `<span style="font-family: 'Great Vibes', cursive; font-size: 15px; font-style: italic;">${candidateName}</span>`)
          .replace(/\[@@EMPLOYEENAME\]/g, employeerName)
          .replace(/\[@@DATE\]/g, currentDate)
          .replace(/\[@@EMPLOYEEID\]/g, employeerId);
        this.screeningService.loaHtml = this.htmlContents;
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.screeningService.loaHtml);
        return this.safeHtml;
     // }
   // })
  }
  GetaftersaveUncheckCusLoas(){
    // this.screeningService.GetCliectCustomLoa(this.screeningService.screeningId,this.screeningService.clientId).subscribe(res =>{
    //   if(res: any) {
        //this.htmlContentss = res.customLoaHtmlText
        this.htmlContentss = this.mainForm.get(`${this.formgroupName}.loaDocumentDefaultHtml`).value
        const currentDate = '____/____/____';
       // const fullname = '___________________________';
        this.employeerId = '______________';
        this.employeerName = '___________________________';
        this.htmlContents = this.htmlContentss
          .replace(/\[@@SIGNATURE\]/g, this.employeerName)
          .replace(/\[@@EMPLOYEENAME\]/g, this.employeerName)
          .replace(/\[@@DATE\]/g, currentDate)
          .replace(/\[@@EMPLOYEEID\]/g, this.employeerId);
        this.screeningService.loaHtml = this.htmlContents;
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.screeningService.loaHtml);
        return this.safeHtml;
      //}
    //})
  }
  
  GetAutoFecthClientCustomLoas(employeerName, isChecked,employeerId,candidateName): SafeHtml {
    this.htmlContent = this.mainForm.get(this.formgroupName + '.loadocumentHtml').value;

    const currentDate = isChecked ? new Date().toLocaleDateString('en-GB') : '____/____/____';
    this.htmlContent = this.mainForm.get(`${this.formgroupName}.loadocumentHtml`).value
      .replace(/\[@@SIGNATURE\]/g, `<span style="font-family: 'Great Vibes', cursive; font-size: 15px; font-style: italic;">${candidateName}</span>`)
      .replace(/\[@@EMPLOYEENAME\]/g, employeerName)
      .replace(/\[@@DATE\]/g, currentDate)
      .replace(/\[@@EMPLOYEEID\]/g, employeerId);

      

    this.screeningService.loaHtml = this.htmlContent;
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.screeningService.loaHtml);
    return this.safeHtml;
  }
  initEmpForm() {
    this.empForm = this.fb.group({
      empName: new UntypedFormControl('', Validators.required),
      empId: new UntypedFormControl('', Validators.required),
    });
  }
  saveEmp(){
    if (this.empForm.valid) {
        this.showNotification( "success", "Success Message","Save Successfully");
        this.dialogRef.close();
      
    }
    else {
      this.empForm.markAllAsTouched();
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({
      severity: severity1,
      summary: summary1,
      detail: message,
    });
  }
  openDialog(){
    this.dialogRef= this.dialog.open(this.empDialog,
      { disableClose: true, width: '360px' });
  }
  dialogClose() {
    this.dialogRef.close();
    this.empForm.reset()
  }


}
