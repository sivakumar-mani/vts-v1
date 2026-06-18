import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { disableDebugTools } from '@angular/platform-browser';
import { User } from '../../models/user';
import { ScreeningService } from '../../services/screening.service';

@Component({
  standalone: false,
  selector: 'app-add-address-detail',
  templateUrl: './add-address-detail.component.html',
  styleUrls: ['./add-address-detail.component.css']
})
export class AddAddressDetailComponent implements OnInit {
  headerText: string;
  labelText: string;
  action: string;
  addressData: any;
  addressForm: UntypedFormGroup;
  type: string;
  userData = new User();
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddAddressDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: UntypedFormBuilder,
              private screeningService: ScreeningService) {
    this.headerText = data.headerText;
    this.labelText = data.labelText;
    this.action = data.action;
    this.addressData = data.addressData;
    this.type = data.type;
     }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initAddressForm();
  }
  initAddressForm() {
    this.addressForm = this.formBuilder.group({
      cityName: new UntypedFormControl({
        value: this.type === 'cityName' ? this.addressData.cityId : this.addressData.city,
        disabled: this.type === 'locationName' ? true : false
      }),
      districtName: new UntypedFormControl({
        value: this.type === 'districtName' ? this.addressData.districtId : this.addressData.district,
        disabled: this.type !== 'districtName' ? true : false
      }),
      cityId: new UntypedFormControl(this.type === 'cityName' ? 0 : this.addressData.cityId),
      districtId: new UntypedFormControl(this.type === 'districtName' ? 0 : this.addressData.districtId),
      stateName: new UntypedFormControl({ value: this.type === 'stateName' ? this.addressData.stateId : this.addressData.state, disabled: true}),
      stateId: new UntypedFormControl(this.type === 'stateName' ? 0 : this.addressData.stateId),
      countryName: new UntypedFormControl({ value: this.type === 'countryName' ? this.addressData.countryId : this.addressData.country, disabled: true }),
      countryId: new UntypedFormControl(this.type === 'countryName' ? 0 : this.addressData.countryId),
      locationId: new UntypedFormControl(this.type === 'locationName' ? 0 : this.addressData.locationId ? this.addressData.locationId : 0),
      locationName: new UntypedFormControl(this.type === 'locationName' ? this.addressData.locationId : this.addressData.place),
      postalCode: new UntypedFormControl(this.addressData.postalCode),
      // createdUserId: new UntypedFormControl((this.userData && this.userData.userId > 0) ? this.userData.userId : null),
      //Added by megala by - DAV location Add issue
      createdUserId: new UntypedFormControl((this.userData && this.userData.userId > 0) ? this.userData.userId : 1),
    });
  }
  saveAddress() {
    if (this.addressForm.valid) {
      this.dialogRef.close({
        action: 'save',
        data: this.addressForm.getRawValue()
      });
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

}
