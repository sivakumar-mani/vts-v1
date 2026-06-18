import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { MessageService } from 'primeng/api';
@Component({
  standalone: false,
  selector: 'app-digitaladdressverfication',
  templateUrl: './digitaladdressverfication.component.html',
  styleUrls: ['./digitaladdressverfication.component.css']
})
export class DigitaladdressverficationComponent implements OnInit {
  signPhotoName: any;
  candidatePhotoName: any;
  idProffName: any;
  Housename: any;
  uploadHouse: any;
  idProff: any;
  canidatePhoto: any;
  signPhoto: any;
  Clinetdata: any
  clientName: any;
  candidateName: any;
  verifiationId: any;
  addressForm: UntypedFormGroup;
  document = []
  addressType
  applicainDetails
  ScrenningComid: any
  headerText = '';
  bodyText = '';
  imageChangedEvent
  srcElementVal
  action
  maxDate = new Date()
  minDate = new Date()
  @ViewChild('sucessAlert', { static: true }) sucessAlert!: TemplateRef<any>;
  @ViewChild(ImageCropperComponent, { static: true }) imageCropper: ImageCropperComponent;

  @ViewChild('video') video: ElementRef;
  isCameraOpen = false;
  capturedImage: string | null = null;
  private stream: MediaStream;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private agentEntryMasterService: AgentEntryMasterService,
    private dialog: MatDialog,
    private common: CommonService,
    private message: MessageService
  ) { }
  address1 = new BehaviorSubject(null);

  ngOnInit() {
    this.getUrl()
    this.authService.getUrlExpiryDate(this.ScrenningComid).subscribe(data => {
      const currentDate = new Date();
      const expiry = this.common.getTimezoneOffset(data.expiryDate, false);
      const diffInHours = (expiry !=null)?(currentDate.getTime() - expiry.getTime()) / (1000 * 60 * 60):null;
      if(data.clientName === 'iCOVER Services' && diffInHours > 72 ) {
        this.router.navigate(['/urlexpired'])
      }
      else {
        this.getDetails(this.ScrenningComid)
        this.GetAddressDetails();
        this.getLocation()
        this.addressForm = this.formBuilder.group({
          verificationId: new UntypedFormControl(null),
          clientName: new UntypedFormControl(null),
          candidateName: new UntypedFormControl(null),
          addressType: new UntypedFormControl(null, Validators.required),
          latitude: new UntypedFormControl(null),
          longitude: new UntypedFormControl(null),
          distanceKm: new UntypedFormControl(null),
          respondentName: new UntypedFormControl('', Validators.required),
          RelationshipWithTheCandidate: new UntypedFormControl('', Validators.required),
          landmark: new UntypedFormControl(null),
          alternativeContactNumber: new UntypedFormControl(null, [Validators.required, Validators.minLength(10)]),
          ownershipDetails: new UntypedFormControl(null),
          fromDate: new UntypedFormControl(null, Validators.required),
          toDate: new UntypedFormControl(null, Validators.required),
          addressuser: new UntypedFormControl(),
          clientId: new UntypedFormControl(),
          candidateId: new UntypedFormControl(),
          FieldExecutiveAddressFlag: new UntypedFormControl(false),

          address: new UntypedFormGroup({
            addressId: new UntypedFormControl(0),
            addLine1: new UntypedFormControl('', Validators.required),
            addLine2: new UntypedFormControl(''),
            addLine3: new UntypedFormControl(''),
            cityId: new UntypedFormControl(''),
            districtId: new UntypedFormControl(''),
            stateId: new UntypedFormControl('', Validators.required),
            countryId: new UntypedFormControl('', Validators.required),
            postalCode: new UntypedFormControl('', Validators.required),
            active: new UntypedFormControl(true),
            locationId: new UntypedFormControl(),
            country: new UntypedFormControl(),
            city: new UntypedFormControl(),
            district: new UntypedFormControl(),
            state: new UntypedFormControl(),
            place: new UntypedFormControl(),
          }),
        })
      }
    })
  }

  uploaCandidate(fileInput: FileList) {

    const img = fileInput[0].name.split('.').pop();
    if (img === 'png' || img === 'PNG' || img === 'jpg' || img === 'JPG' || img === 'jpeg' || img === 'gif' || img === 'psd' || img === 'bmp') {
      this.candidatePhotoName = fileInput[0].name
      for (let _files in fileInput) {
        if (_files != "length" && _files != "item") {
          this.canidatePhoto = fileInput.item(Number(_files));
        }
      }

    }
    else {
      this.commonAlert()
    }
  }

  uploadSign(fileInput: FileList) {

    const img = fileInput[0].name.split('.').pop();
    if (img === 'png' || img === 'PNG' || img === 'jpg' || img === 'JPG' || img === 'jpeg' || img === 'gif' || img === 'psd' || img === 'bmp') {
      this.signPhotoName = fileInput[0].name
      for (let _files in fileInput) {
        if (_files != "length" && _files != "item") {
          this.signPhoto = fileInput.item(Number(_files));
        }
      }
    }
    else {
      this.commonAlert()
    }
  }
  uploadIdProff(fileInput: FileList) {

    const img = fileInput[0].name.split('.').pop();
    if (img === 'png' || img === 'PNG' || img === 'jpg' || img === 'JPG' || img === 'jpeg' || img === 'gif' || img === 'psd' || img === 'bmp') {
      this.idProffName = fileInput[0].name
      for (let _files in fileInput) {
        if (_files != "length" && _files != "item") {
          this.idProff = fileInput.item(Number(_files));
        }
      }
    }
    else {
      this.commonAlert()
    }
  }

  housePhoto(fileInput: FileList) {

    const img = fileInput[0].name.split('.').pop();
    if (img === 'png' || img === 'PNG' || img === 'jpg' || img === 'JPG' || img === 'jpeg' || img === 'gif' || img === 'psd' || img === 'bmp') {
      this.Housename = fileInput[0].name
      for (let _files in fileInput) {
        if (_files != "length" && _files != "item") {
          this.uploadHouse = fileInput.item(Number(_files));
        }
      }
    }
    else {
      this.commonAlert()
    }
  }
  removeImage(name: any) {
    if (name === 'candidatePhotoName') {
      this.canidatePhoto = ''
      this.candidatePhotoName = ''
      this.capturedImage = null;
    }
    // else if (name === 'signPhotoName') {
    //   this.signPhoto = ''
    //   this.signPhotoName = ''
    // }
    else if (name === 'Housename') {
      this.uploadHouse = ''
      this.Housename = ''
    }
    else {
      this.idProff = ''
      this.idProffName = ''
    }

  }

  addressSumbit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched()
      return;
    }
    else if (this.canidatePhoto === null || this.canidatePhoto === undefined || this.canidatePhoto === 0 &&
      //this.signPhoto === null || this.signPhoto === undefined || this.signPhoto === 0 &&
      this.idProff === null || this.idProff === undefined || this.idProff === 0 &&
      this.uploadHouse === null || this.uploadHouse === undefined || this.uploadHouse === 0) {
      this.showTopCenter('warn', 'Failure Message', 'Please Upload All Images');
      return;

    }
    else if (this.addressForm.get('latitude')?.value == null || this.addressForm.get('longitude')?.value == null ||
      this.addressForm.get('latitude')?.value == undefined || this.addressForm.get('longitude')?.value == undefined) {
      this.showTopCenter('warn', 'Failure Message', 'Please allow to access your current location');
      return;

    }
    else {
      this.document.push(this.canidatePhoto, this.idProff, this.uploadHouse)
    }


    this.applicainDetails = {
      ...this.addressForm.value,
      ...this.Clinetdata
    };
    const formData = new FormData();
    formData.append('AddressForm', JSON.stringify(this.applicainDetails));

    if (this.document.length > 0) {
      for (let i = 0; i < this.document.length; i++) {
        formData.append('Document_' + i, this.document[i]);
      }
    }
    this.authService.addDigitialAddressVerificaton(formData).subscribe(redata => {
      if (redata != null || redata != 0) {
        const Bodytext = 'Thank you for submitting the address details for background verification!You will not be able to edit any detail or upload any document after Clicking' + '"Submit"';
        this.alert(Bodytext)
      }
    })
  }
  GetAddressDetails() {
    this.authService.getDigitialAddressType().subscribe(res => {
      this.addressType = res.typeOfAddress;

    });
  }
  getDetails(dat: any) {
    this.authService.getDigitialAddressverification(this.ScrenningComid).subscribe(data => {
      if (data === null || data === 0 || data === undefined) {
        this.showTopCenter('warn', 'Failure Message', 'User Not Found');
        this.router.navigate(['/privacy'])
      }
      else if (data.alredaySubmit === "Already submitted the address") {
        const Bodytext = 'The candidate already submitted the digital address verification Process';
        this.alert(Bodytext)
      }
      else {
        this.verifiationId = data.verifiactionId
        this.candidateName = data.candidateName
        this.clientName = data.clientName
        // this.addressForm.get('addressuser')?.setValue(data.address.addLine1 ? '/' : '' + data.address.district ? ',' : ''
        //   + data.address.city ? '-' : '' + data.address.postalCode + ' ' + data.address.state ? ',' : '' + data.address.country)
        this.Clinetdata = {
          ClientId: data.clientId, CandidateId: data.candidateId, VerificationId: data.screeningComId,
          DavaddressId: data.address.addressId
        }
      }
    })
  }
  getUrl() {
    this.route.queryParams.subscribe(par => {
      this.ScrenningComid = par.ScreeningID
    })
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // if(position.coords.latitude!=undefined &&position.coords.longitude!=undefined)
        // {
        this.addressForm.get('latitude')?.setValue(position.coords.latitude)
        this.addressForm.get('longitude')?.setValue(position.coords.longitude)
      });
    }

  }
  alert(bodytext: any) {
    this.headerText = 'Alert';
    this.bodyText = bodytext;
    this.dialog.open(this.sucessAlert, {
      width: '320px',
      disableClose: true
    });
  }
  dialogClose() {
    this.dialog.closeAll();
    this.document = []
    this.addressForm.reset()
    this.addressForm.clearValidators()
    this.addressForm.updateValueAndValidity()
    this.Housename = ''
    this.signPhotoName = ''
    this.candidatePhotoName = ''
    this.idProffName = ''
    this.canidatePhoto = null;
    this.signPhoto = null;
    this.idProff = null;
    this.uploadHouse = null
    this.router.navigate(['/'])
  }

  clearValue() {
    this.document = []
    this.addressForm.reset()
    this.addressForm.clearValidators()
    this.addressForm.updateValueAndValidity()
    this.Housename = ''
    this.signPhotoName = ''
    this.candidatePhotoName = ''
    this.idProffName = ''
    this.canidatePhoto = null;
    this.signPhoto = null;
    this.idProff = null;
    this.uploadHouse = null
    // this.router.navigate[('')]
  }
  // dateCompare(startdate,endate ){
  //  this.common.dateCompare(startdate,endate,this.addressForm)
  // }

  tillDate(data: any) {
    if (data.checked == true) {

      this.addressForm.get('toDate')?.setValue(new Date())
    }
    else {
      this.addressForm.get('toDate')?.reset()
    }
  }

  //image Crapping
  // rotate(type: any) {
  //   switch (type) {
  //     case 'right':
  //       this.imageCropper.rotateRight();
  //       break;
  //     case 'left':
  //       this.imageCropper.rotateLeft();
  //       break;
  //     case 'flipHorizontal':
  //       this.imageCropper.flipHorizontal();
  //       break;
  //     case 'flipVertical':
  //       this.imageCropper.flipVertical();
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  //   this.fileData = this.common.convertBase64ToFileObj(this.croppedImage);
  // }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  //Common Alert
  commonAlert() {
    this.showTopCenter('warn', 'Failure Message',
      'Please upload a valid file,' + ' Acceptable file Formats : .png, .jpg, .JPG, .jpeg, .gif, .psd, .bmp');
  }
  //TodateValidate
  setToDate(fromDate: any) {

    this.maxDate = fromDate.value
  }
  // closeTab(){
  //   window.close();
  // }

  async openCamera() {
    this.isCameraOpen = true;
    this.candidatePhotoName = '';
    this.capturedImage = null;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Camera access denied or not available:', err);
      alert('Unable to access camera. Please check permissions.');
      this.isCameraOpen = false;
    }
  }

  // captureImage() {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = this.video.nativeElement.videoWidth;
  //   canvas.height = this.video.nativeElement.videoHeight;
  //   const ctx = canvas.getContext('2d');
  //   ctx.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
  //   this.capturedImage = canvas.toDataURL('image/png');
  //   this.candidatePhotoName = 'Captured_Selfie.png';

  //   // Automatically close camera after capture
  //   this.closeCamera();
  // }

  captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.nativeElement.videoWidth;
    canvas.height = this.video.nativeElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/png');
    this.candidatePhotoName = 'Captured_Selfie.png';
    // Convert canvas to blob (image file)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'Captured_Selfie.png', { type: 'image/png' });
        this.canidatePhoto = file;
      }
    }, 'image/png');
    // Automatically close camera after capture
    this.closeCamera();
  }

  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOpen = false;
  }

  // Optional: method to upload image to server
  uploadCapturedImage() {
    if (this.capturedImage) {
      const base64 = this.capturedImage.split(',')[1]; // remove data:image/png;base64,
      // call API here to upload
    }
  }

  removeImageCaptured() {
    this.capturedImage = null;
    this.candidatePhotoName = '';
  }
}
