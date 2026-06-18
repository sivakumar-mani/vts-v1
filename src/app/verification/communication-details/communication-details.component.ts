import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { User } from 'src/app/common-methods/models/user';
import { MessageService } from 'primeng/api';
import { threadId } from 'worker_threads';
import { CommonService } from "src/app/common-methods/services/common.service";


@Component({
  standalone: false,
  selector: 'app-communication-details',
  templateUrl: './communication-details.component.html',
  styleUrls: ['./communication-details.component.css']
})
export class CommunicationDetailsComponent implements OnInit, OnChanges {

  maxDate = new Date();
  communicationModeList: any[] = [];
  communicationDetailForm: UntypedFormGroup;
  userData = new User();
  formName: string;
  @Input() screeningCompId: number;
  postalStatusList: any[] = [];
  emailStatusList: any[] = [];
  faxStatusList: any[] = [];
  @Input() commList: any;
  @Input() communicationDetails: any;
  constructor(private verification: VerificationService, private messageService: MessageService,private common:CommonService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.commList) {
      this.communicationModeList = this.commList.communicationMode;
      this.postalStatusList = this.commList.postalStatus;
      this.emailStatusList = this.commList.emailStatus;
      this.faxStatusList = this.commList.faxStatus;
    }
    if (this.communicationDetails) {
      this.getFormGroupName(this.communicationDetails.commnModeLookupId);
      this.bindCommunicationDetails();
    }
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // this.getCommunicationMode();
    if (!this.communicationDetailForm) {
      this.initCommunicationForm();
    }
  }
  initCommunicationForm() {
    this.communicationDetailForm = new UntypedFormGroup({
      screeningCommunicationId: new UntypedFormControl(0),
      commnModeLookupId: new UntypedFormControl(null, Validators.required),
      postalForm: new UntypedFormGroup({
        commnStatusLookupId: new UntypedFormControl('', Validators.required),
        commnRef: new UntypedFormControl(''),
        commnStatusDate: new UntypedFormControl(new Date(), Validators.required),
        commnCharges: new UntypedFormControl('', Validators.required),
      }),
      emailForm: new UntypedFormGroup({
        commnStatusLookupId: new UntypedFormControl('', Validators.required),
        commnStatusDate: new UntypedFormControl(new Date(), Validators.required),
        emailId: new UntypedFormControl('',
          Validators.pattern(this.common.EmailRegX))
      }),
      faxForm: new UntypedFormGroup({
        commnStatusLookupId: new UntypedFormControl('', Validators.required),
        commnRef: new UntypedFormControl(''),
        commnStatusDate: new UntypedFormControl(new Date(), Validators.required),
        commnDuration: new UntypedFormControl('', Validators.required),
        commnCharges: new UntypedFormControl(''),
      })
    });
  }
  // getCommunicationMode() {
  //   this.verification.getCommunicationModeList().subscribe(resp => {
  //     this.communicationModeList = resp.communicationMode;
  //     this.postalStatusList = resp.postalStatus;
  //     this.emailStatusList = resp.emailStatus;
  //     this.faxStatusList = resp.faxStatus;
  //   });
  // }
  savecommunicationDetails() {
    if (this.communicationDetailForm.get('commnModeLookupId')?.valid) {
      if (this.communicationDetailForm.get(this.formName).valid) {
        const fromGrp = this.communicationDetailForm.get(this.formName) as UntypedFormGroup;
        fromGrp.addControl('screeningCommunicationId',
          new UntypedFormControl(this.communicationDetailForm.get('screeningCommunicationId')?.value));
        fromGrp.addControl('commnModeLookupId',
          new UntypedFormControl(this.communicationDetailForm.get('commnModeLookupId')?.value));
        fromGrp.addControl('commnModeLookupId',
          new UntypedFormControl('loggedIn', new UntypedFormControl(this.userData.userId))),
          fromGrp.addControl('screeningCompId', new UntypedFormControl(this.screeningCompId));
        this.verification.saveCommunicationDetails(this.communicationDetailForm.get(this.formName).value).subscribe(resp => {
          if (resp) {
            this.showNotification('success', 'Success', 'Saved successfully');
          }
        });
      } else {
        this.communicationDetailForm.get(this.formName).markAsTouched();
      }
    } else {
      this.communicationDetailForm.get('commnModeLookupId')?.markAsTouched();
    }
  }
  bindCommunicationDetails() {
    this.initCommunicationForm();
    this.communicationDetailForm.get('commnModeLookupId')?.setValue(this.communicationDetails.commnModeLookupId);
    this.communicationDetailForm.get('screeningCommunicationId')?.setValue(this.communicationDetails.screeningCommunicationId);
    this.communicationDetailForm.get(this.formName).patchValue(this.communicationDetails);
  }
  getFormGroupName(value): string {
    const data = this.communicationModeList.find(x => x.lookUpId === value);
    if (data) {
      switch (data.lookUpName.toLowerCase()) {
        case 'postal':
          this.formName = 'postalForm';
          return 'postalForm';
        case 'email':
          this.formName = 'emailForm';
          return 'emailForm';
        case 'fax':
          this.formName = 'faxForm';
          return 'faxForm';
        default:
          this.formName = '';
      }
    } else {
      this.formName = '';
    }

  }
  calculateCallCost(event: any) {
    if (typeof +event.target.value === 'number') {
      this.communicationDetailForm.get('faxForm.commnCharges')?.setValue(event.target.value * 10);
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
}
