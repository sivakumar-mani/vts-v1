import {
  Component,
  VERSION,
  ViewChild,
  OnInit,
  ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaptureService } from '../capture.service';
import { ImageprocessingService } from '../imageprocessing.service';
import { ShowImageDialogComponent } from '../show-image-dialog/show-image-dialog.component';
declare var MediaRecorder: any;

@Component({
  standalone: false,
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
  @ViewChild('video') videoElementRef: ElementRef;

  videoElement: HTMLVideoElement;
  recordVideoElement: HTMLVideoElement;
  mediaRecorder: any;
  recordedBlobs: Blob[];
  isRecording: boolean = false;
  downloadUrl: string;
  stream: MediaStream;
  base64String: any = '';
  userData: any;
  imageDetails: any;
  constructor(private captureService: CaptureService, private imageDialog: MatDialog, private imageProcessingService: ImageprocessingService) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data'))
  }

  async ngOnInit() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 360
        }
      })
      .then(stream => {
        this.videoElement = this.videoElementRef.nativeElement;
        this.recordVideoElement = this.recordVideoElementRef.nativeElement;

        this.stream = stream;
        this.videoElement.srcObject = this.stream;
      });
  }

  startRecording() {
    this.recordedBlobs = [];
    let options: any = { mimeType: 'video/webm' };

    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start(); // collect 100ms of data
    this.isRecording = !this.isRecording;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot play.');
      return;
    }
    this.recordVideoElement.play();
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
          let blob = new Blob([event.data], { type: 'video/mp4' });
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = (e) => {
            this.base64String = reader.result;
          };

        }
      };
    } catch (error) {
      console.log(error);
    }
  }
  saveVideo() {
    let uploadData = {
      fileContent: this.base64String,
      captureType: "Video",
      userId: this.userData.userId
    }
    this.captureService.saveImage(uploadData).subscribe((response) => {
    })
  }
  openDialog() {
    this.getAllImagesAsBytes()
  }
  getAllImagesAsBytes() {
    this.captureService.getImages(this.userData.userId, 'video').subscribe((res) => {
      this.imageDetails = res;
      if (this.imageDetails) {
        this.imageDialog.open(ShowImageDialogComponent, {
          height: '500px',
          width: '800px',
          data: {
            images: this.imageProcessingService.createImages(this.imageDetails, 'video'),
            type: 'video'
          }
        })
      }
    })
  }
  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.recordedBlobs, {
          type: 'video/webm'
        });
        this.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag
        this.recordVideoElement.src = this.downloadUrl;
      };
    } catch (error) {
      console.log(error);
    }
  }
}
