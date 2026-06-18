import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';

@Component({
  standalone: false,
  selector: 'app-address-pvform',
  templateUrl: './address-pvform.component.html',
  styleUrls: ['./address-pvform.component.css']
})
export class AddressPvformComponent implements OnInit {

  // tslint:disable-next-line: no-use-before-declare
  pvFormVm = new pvFormVm();

  btnSend     = true;
  btnDownLoad = true;
  btnBack     = true;

  pvForm: UntypedFormGroup;
  userData: any;
  compRefComponent: any;
  compRefCandidate: any;
  vendorList = [];
  vendorNameControls: AutoCompleteDropDown;

  editorReady = false;

  // Separate variable — bypasses formControlName writeValue/nativeElement crash
  htmlTemplateBody = '';

  editorConfig: AngularEditorConfig = {
    editable        : true,
    spellcheck      : true,
    height          : '400px',
    minHeight       : '200px',
    sanitize        : false,   // false = HTML content (tables, inline styles) preserve ஆகும்
    toolbarPosition : 'top',
    showToolbar     : true,
  };

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    public verificationService: VerificationService,
    public common: CommonService
  ) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data'));
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data'));
    this.initFormGroup();
    this.getpv();
  }

  initFormGroup() {
    this.pvForm = this.fb.group({
      vendorId         : ['', null],
      toMail           : [''],
      ccMail           : [''],
      htmlTemplateBody : ['']
    });

    this.vendorNameControls = new AutoCompleteDropDown(
      'Vendor Name', 'vendorId', 'vendorId', 'vendorName',
      this.vendorList, '', this.pvForm, false, false, false
    );
  }

  getpv() {
    this.verificationService.GetemailTemplate().subscribe(resp => {

      if (resp) {
        this.common.tempResetData = resp;
      }

      const data = this.common.tempResetData;

      // Patch toMail, ccMail into reactive form
      this.pvForm.patchValue({
        toMail : data.toMail || '',
        ccMail : data.ccMail || ''
      });

      // Set HTML content into separate variable (not via formControlName)
      this.htmlTemplateBody = data.htmlTemplateBody || '';

      // Mount editor after data is ready
      setTimeout(() => {
        this.editorReady = true;
      }, 0);

    });
  }

  // Keeps pvForm.htmlTemplateBody in sync when user edits the content
  onEditorChange(value: string) {
    this.htmlTemplateBody = value;
    this.pvForm.get('htmlTemplateBody').setValue(value);
  }

  getComponentValues() {
    this.vendorList = this.verificationService.tempData.verificationTransBindDet.vendors;
    this.vendorNameControls = new AutoCompleteDropDown(
      'Vendor Name', 'vendorId', 'vendorId', 'vendorName',
      this.vendorList, '', this.pvForm, false, false, false
    );
  }

  closeForm() {
    this.router.navigate(['dashboard/verification/verificationDetail']);
  }
}

// tslint:disable-next-line:class-name
export class pvFormVm {
  candidateName : string;
  addLine1      : string;
  addLine2      : string;
  addLine3      : string;
  city          : string;
  district      : string;
  state         : string;
  country       : string;
  place         : string;
  postalCode    : string;
  periodOfStay  : string;
}