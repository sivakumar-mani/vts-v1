import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { CaptureService } from '../capture.service';
import { MatDialog } from '@angular/material/dialog';
import { ShowImageDialogComponent } from '../show-image-dialog/show-image-dialog.component';
import { ImageprocessingService } from '../imageprocessing.service';
import { map } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  private trigger: Subject<any> = new Subject();
  //public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';
  stream: any = null;
  status: string = null;
  userData: any;
  imageDetails: any;
    webcamImage: any = null;
  ngOnInit() { }
  public captureImage(): void {
    this.trigger.next(void 0);
  }
  constructor(private captureService: CaptureService, private imageDialog: MatDialog, private imageProcessingService: ImageprocessingService) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);

  }
  checkPermission() {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 500,
        height: 500
      }
    }).then((res) => {
      this.stream = res;
    }).catch((err) => {
      console.log(err)
      if (err.message === 'Requested device not found') {
        this.status = 'Permission Denied! Please allow access to camera';
      } else {
        this.status = 'Camera is accessing';
      }
    })
  }
  proceed() {
    let uploadData = {
      fileContent: this.sysImage,
      captureType: "UserImage",
      userId: this.userData.userId
    }
    this.captureService.saveImage(uploadData).subscribe((response) => {
    })
  }
  openDialog() {
    this.getAllImagesAsBytes()
  }
  getAllImagesAsBytes() {
    this.captureService.getImages(this.userData.userId, 'image').subscribe((res) => {
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
  // public getSnapShot(webcamImage: WebcamImage): void {
  //   this.webcamImage = webcamImage;
  //   this.sysImage = webcamImage!.imageAsDataUrl;
  //   // let imageurl = webcamImage!.imageAsBase64;
  //   // console.info('got webcam image', this.sysImage, imageurl);
  //   // Create a download link for the captured image
  //   // const link = document.createElement("a");
  //   // link.href = this.sysImage;
  //   // Set the filename for the saved image (optional)
  //   // link.download = new Date().toString() + '.png';
  //   // Simulate a click event on the link to trigger the download
  //   // link.click();
  // }
  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }
}
