import { Component, OnInit } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { UserData } from 'src/app/common-methods/models/user';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { validateBasis } from '@ngbracket/ngx-layout';
import { ScreeningComponentInfo, ScreeningDocument, ScreeningAbroad } from 'src/app/common-methods/models/screening-details';
import { isNumber } from 'util';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-abroad-file-submission',
  templateUrl: './abroad-file-submission.component.html',
  styleUrls: ['./abroad-file-submission.component.css']
})
export class AbroadFileSubmissionComponent implements OnInit {

  breadcrumbFlags = new BreadcrumbFlags();
  userData = new UserData();
  screeningComponent = new ScreeningComponentInfo();
  screeningAbroadDetails = new ScreeningAbroad();
  routePath = 'Screening / Abroad file submission';
  abroadForm: UntypedFormGroup;
  clientControls!: AutoCompleteDropDown;
  siteControls!: AutoCompleteDropDown;
  candidateControls!: AutoCompleteDropDown;
  clientList: any[] = [];
  siteList: any[] = [];
  candidateList: any[] = [];
  componentList: any[] = [];
  screeningStatusList: any[] = [];
  colorCodeList: any[] = [];
  maxDate = new Date();
  docFormArray: UntypedFormArray;
  constructor(private fb: UntypedFormBuilder, private screeningService: ScreeningService, private messageService: MessageService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags.toolTip = 'Save';
    this.initFormGroup();
    this.getClientList();
    this.getScreeningStatusList();
    // this.getScreeningColorCodeList();
  }
  initFormGroup() {
    this.abroadForm = this.fb.group({
      clientId: ['', Validators.required],
      siteId: ['', Validators.required],
      country: [{ value: 'USA', disabled: true }],
      candidateId: ['', Validators.required],
      refNo: [],
      compId: ['', Validators.required],
      statusId: ['', Validators.required],
      fee: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      informationSource: ['', Validators.required],
      location: ['', Validators.required],
      completedDate: ['', Validators.required],
      colorCodeId: ['', Validators.required],
      clientReviewFlag: [false],
      document: this.fb.array([]),
      loggedIn: [this.userData.userId]
    });
    this.initAutocompleteControls();
  }
  initAutocompleteControls() {
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
        '', this.abroadForm, false, false, true);
    this.siteControls =
      new AutoCompleteDropDown('Site No', 'siteId', 'siteId', 'siteName', this.siteList,
        '', this.abroadForm, false, false, true);
    this.candidateControls =
      new AutoCompleteDropDown('Candidate Name', 'candidateId', 'candidateId', 'candidateFullName', this.candidateList,
        '', this.abroadForm, false, false, true);
  }
  getClientList() {
    this.screeningService.getAbroadClientList().subscribe(resp => {
      this.clientList = resp;
      this.clientControls =
        new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
          '', this.abroadForm, false, false, true);
    });
  }
  getScreeningStatusList() {
    this.screeningService.getScreeningStatusList().subscribe(resp => {
      this.screeningStatusList = resp;
    });
  }
  getScreeningColorCodeList(clientId: any) {
    this.screeningService.getScreeningColorCodeDetails(clientId).subscribe(resp => {
      this.colorCodeList = resp;
    });
  }
  getSiteLocation(event: any) {
    if (typeof event.value === 'number') {
      this.screeningService.getSiteNoByClientId(event.value).subscribe((resp) => {
        if (resp) {
          resp.map(e => {
            e.siteNoWithsiteName = e.siteNo + '-' + e.siteName;
          });
          this.siteList = resp;
          this.siteControls =
            new AutoCompleteDropDown('Site No', 'siteId', 'siteId', 'siteNoWithsiteName', this.siteList,
              '', this.abroadForm, false, false, true);
        }
      });
    } else {
      this.siteList = [];
      this.abroadForm.get('siteNo')?.setValue(null);
      this.siteControls =
        new AutoCompleteDropDown('Site No', 'siteNo', 'siteNo', 'siteNoWithsiteName', this.siteList,
          '', this.abroadForm, false, false, true);
    }

  }
  getCandidateList(event: any) {
    this.screeningService.getCandidateList(event.value).subscribe((resp) => {
      if (resp) {
        resp.map(e => {
          e.candidateFullName = e.firstName + ' ' + e.middleName + ' ' + e.lastName + '-' + e.refNo;
        });
        this.candidateList = resp;
        this.candidateControls =
          new AutoCompleteDropDown('Candidate Name', 'candidateId', 'candidateId', 'candidateFullName', this.candidateList,
            '', this.abroadForm, false, false, true);
      }
    });
  }
  getRefNo(event: any) {
    if (typeof event.value === 'number') {
      this.abroadForm.get('refNo')?.setValue(this.candidateList.find(x => x.candidateId === event.value).refNo);
    } else {
      this.abroadForm.get('refNo')?.setValue(null);
    }
  }
  getComponentList(event: any) {
    if (typeof event.value === 'number') {
      this.screeningService.getComponentList(event.value).subscribe((resp) => {
        if (resp) {
          if (!resp.screeningExistflag) {
            this.resetForm();
            this.showNotification('warn', 'Failure Message', 'Please add atleast one indian component');
          } else {
            if (resp.component.length > 0) {
              this.componentList = resp.component;
            } else {
              this.resetForm();
              this.showNotification('info', 'Info Message', 'All the abroad components were submitted');
            }
          }
        }
      });
    } else {
      this.abroadForm.get('compId')?.setValue(null);
      this.componentList = [];
    }
  }
  saveFileSubmission() {
    if (this.abroadForm.valid) {
      if (this.screeningComponent.componentDocument.length > 0) {
        this.screeningAbroadDetails = this.abroadForm.value;
        const formData = new FormData();
        for (let i = 0; i < this.screeningComponent.componentDocument.length; i++) {
          if (this.screeningComponent.componentDocument[i].fileName) {
            formData.append('ScreeningAbroadDocument_' + i, this.screeningComponent.componentDocument[i].document);
          }
        }
        formData.append('ScreeningAbroadDetails', JSON.stringify(this.screeningAbroadDetails));
        this.screeningService.saveAbroadCompDetails(formData).subscribe(resp => {
          if (resp) {
            this.resetForm();
            this.showNotification('success', 'Success', 'Saved successfully');
          }
        });
      } else {
        this.showNotification('warn', 'Failed to save', 'Upload atleast one Annexure document.');
      }
    } else {
      this.abroadForm.markAllAsTouched();
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
  resetForm() {
    this.screeningComponent.componentDocument = [];
    this.componentList = [];
    this.siteList = [];
    this.candidateList = [];
    this.siteControls =
      new AutoCompleteDropDown('Site No', 'siteId', 'siteId', 'siteName', this.siteList,
        '', this.abroadForm, false, false, true);
    this.candidateControls =
      new AutoCompleteDropDown('Candidate Name', 'candidateId', 'candidateId', 'candidateFullName', this.candidateList,
        '', this.abroadForm, false, false, true);
    this.abroadForm.reset();
    const documentArr = this.abroadForm.get('document') as UntypedFormArray;
    for (let i = 0; i < documentArr.length; i++) {
      while (documentArr.length !== 0) {
        documentArr.removeAt(i);
      }
    }
    this.initFormGroup();
    this.docFormArray = this.abroadForm.get('document') as UntypedFormArray;
  }
}
