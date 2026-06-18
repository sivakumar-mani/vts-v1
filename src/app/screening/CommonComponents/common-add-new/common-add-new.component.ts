import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-common-add-new',
  templateUrl: './common-add-new.component.html',
  styleUrls: ['./common-add-new.component.css']
})
export class CommonAddNewComponent implements OnInit {
  headerText: string;
  labelText: string;
  action: string;
  value = '';
  bodyText = '';
  addressNAFlag: boolean = false;
  userData = new User();
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<CommonAddNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: UntypedFormBuilder,
    public screeningService: ScreeningService, public common: CommonService) {
    this.headerText = data.headerText;
    this.labelText = data.labelText;
    this.action = data.action;
    this.value = data.value ? data.value : '';
    this.bodyText = data.bodyText;

  }
  address1 = new BehaviorSubject(null);
  insutionFormGroup: UntypedFormGroup;

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.insutionFormGroup = this.formBuilder.group({
      type: new UntypedFormControl(this.action),
      id: new UntypedFormControl(0),
      team: this.userData.team,
      name: new UntypedFormControl(this.value, Validators.required),
      addressTransId: new UntypedFormControl(0),
      loggedIn: new UntypedFormControl(this.userData.userId),
      caseType: new UntypedFormControl(this.screeningService.caseFlagType === this.common.NEWCASE ? 'addnewscreening' : null),
      clientId: new UntypedFormControl(this.screeningService.clientId),
      depId: new UntypedFormControl(this.userData.deptId ? this.userData.deptId : 0),
      addressNA: new UntypedFormControl(false),
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        cityId: new UntypedFormControl(''),
        city: new UntypedFormControl(),
        districtId: new UntypedFormControl(),
        district: new UntypedFormControl(),
        stateId: new UntypedFormControl('', Validators.required),
        state: new UntypedFormControl(''),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        locationId: new UntypedFormControl(),
        place: new UntypedFormControl(),
        country: new UntypedFormControl()
      }),
    });
  }
  setNotProvidedAddress(e: any) {
    if (e.checked === true) {
      this.addressNAFlag = true;

      this.insutionFormGroup.get('address')?.get('addLine1')?.setErrors(null);
      this.insutionFormGroup.get('address')?.get('stateId')?.setErrors(null);
      this.insutionFormGroup.get('address')?.get('countryId')?.setErrors(null);
      this.insutionFormGroup.get('address')?.get('postalCode')?.setErrors(null);

    } else {
      this.addressNAFlag = false;
      this.insutionFormGroup.get('address')?.get('addLine1')?.setErrors({ required: true });
      this.insutionFormGroup.get('address')?.get('stateId')?.setErrors({ required: true });
      this.insutionFormGroup.get('address')?.get('countryId')?.setErrors({ required: true });
      this.insutionFormGroup.get('address')?.get('postalCode')?.setErrors({ required: true });
    }
  }
  saveNewName() {
    if (this.insutionFormGroup.valid) {
      if (this.addressNAFlag) {
        this.screeningService.AddScreeningNAAddressMasterData(this.insutionFormGroup.value).subscribe(res => {
          let data = this.insutionFormGroup.value;
          let isEmployeEducation = (data != null && (data.type == 'Employer' || data.type == 'Institution'));
          if ((!isEmployeEducation && res != null && res > 0) || (isEmployeEducation && res != null && res.educationEmployerId > 0)) {
            this.common.addFlag = true;
            this.dialogRef.close({
              Responds: res,
            });
          }
        });
      } else {
        this.screeningService.AddScreeningMasterData(this.insutionFormGroup.value).subscribe(res => {
          let data = this.insutionFormGroup.value;
          let isEmployeEducation = (data != null && (data.type == 'Employer' || data.type == 'Institution'));
          if ((!isEmployeEducation && res != null && res > 0) || (isEmployeEducation && res != null && res.educationEmployerId > 0)) {
            this.common.addFlag = true;
            this.dialogRef.close({
              Responds: res,
            });
          }
        });
      }
    } else {
      this.insutionFormGroup.markAllAsTouched();
    }

  }

}
