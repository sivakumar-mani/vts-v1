import { Injectable, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder } from '@angular/forms';
import { MasterService } from './master.service';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { AddressComponent } from '../components/address/address.component';
@Injectable({
  providedIn: 'root'
})
export class CommonAddressService {
  // @ViewChild(AddressComponent, { static: false })
  // addressComponent!: AddressComponent;
  constructor(public dialog: MatDialog, public datepipe: DatePipe, private fb: UntypedFormBuilder,
    private http: HttpClient, public master: MasterService,public addressComponent : AddressComponent) {

  }
  public MapAddressByZipCode1(postalCode, addressGroup,districtName,village,place) {
    this.master.getAddressDetailByZipCode(postalCode).subscribe(res => {
      if (res) {
    const ocrDistrict = (districtName || '').trim();
    const ocrVillage = (village || '').trim();
    const ocrPlace = (place || '').trim();
        if (res.countryId) {
          addressGroup.get('countryId').setValue(res.countryId);
          addressGroup.get('countryId').enable();
        }
        if (res.stateId) {
          addressGroup.get('stateId').setValue(res.stateId);
          addressGroup.get('stateId').enable();
          // //  OCR-ONLY → notify child
          setTimeout(() => {
            //this.addressComponent.handleOcrDistrictPatch(ocrDistrict);  
            this.addressComponent.handleOcrDistrictPatch(ocrDistrict,ocrPlace,ocrVillage);
          }, 0);
        }
        // if (res.cityId) {
        //   addressGroup.get('cityId').setValue(res.cityId);
        //   addressGroup.get('cityId').enable();
        // }
        // if (res.districtId && addressGroup.get('districtId')) {
        //   addressGroup.get('districtId').setValue(res.districtId);
        //   addressGroup.get('districtId').enable();
        // }
      }
    });
  }

}
interface Site {
  siteId: number;
  siteName: string;
  siteNo: string;
}