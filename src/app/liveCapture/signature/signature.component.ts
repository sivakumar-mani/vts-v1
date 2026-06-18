import { Component, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { CaptureService } from '../capture.service';
import { map } from 'rxjs/operators';
import { ShowImageDialogComponent } from '../show-image-dialog/show-image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageprocessingService } from '../imageprocessing.service';

@Component({
  standalone: false,
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent {
  title = 'Signature Pad by Rajesh Gami';
  signPad: any;
  @ViewChild('signPadCanvas') signaturePadElement: any;
  signImage: any;
  userData: any;
  imageDetails: any;

  constructor(private captureService: CaptureService, private imageDialog: MatDialog, private imageProcessingService: ImageprocessingService) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  }

  ngAfterViewInit() {
    this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
  }
  /*It's work in devices*/
  startSignPadDrawing(event: TouchEvent) {
    console.log(event);
  }
  /*It's work in devices*/
  movedFinger(event: TouchEvent) {
    console.log(event)
  }
  /*Undo last step from the signature*/
  undoSign() {
    const data = this.signPad.toData();
    if (data) {
      data.pop(); // remove the last step
      this.signPad.fromData(data);
      if (data.length > 0) {
        this.signImage = this.signPad.toDataURL();
      } else {
        this.signImage = '';
      }
    }
    console.log(this.signImage)

  }
  /*Clean whole the signature*/
  clearSignPad() {
    this.signPad.clear();
    this.signImage = '';
    console.log(this.signImage)
  }
  proceed() {
    let uploadData = {
      fileContent: this.signImage,
      captureType: "Signature",
      userId: this.userData.userId
    }
    this.captureService.saveImage(uploadData).subscribe((res) => {

    })
  }
  openDialog() {
    this.getAllImagesAsBytes()
  }
  getAllImagesAsBytes() {
    this.captureService.getImages(this.userData.userId, 'signature').subscribe((res) => {
      this.imageDetails = res;
      if (this.imageDetails) {
        this.imageDialog.open(ShowImageDialogComponent, {
          height: '500px',
          width: '800px',
          data: {
            images: this.imageProcessingService.createImages(this.imageDetails, 'image'),
            type: 'image'
          }
        })
      }
    })
  }
  /*Here you can save the signature as a Image*/
  saveSignPad() {
    const base64ImageData = this.signPad.toDataURL();
    this.signImage = base64ImageData;
    // alert(this.signImage)
    // const link = document.createElement("a");
    // link.href = this.signImage;
    // Set the filename for the saved image (optional)
    // link.download = new Date().toString() + '.png';
    // Simulate a click event on the link to trigger the download
    // link.click();
    //Here you can save your signature image using your API call.
  }
}
