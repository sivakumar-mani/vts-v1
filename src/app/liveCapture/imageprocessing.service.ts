import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageprocessingService {

  constructor(private santizier: DomSanitizer) { }

  public createImages(responseImagesModule, typ) {
    const moduleImages: any[] = responseImagesModule;
    const moduleImagesToFileHandle: any[] = [];
    for (let i = 0; i < moduleImages.length; i++) {
      const imageFileData = moduleImages[i];
      const imageBlob = this.dataURItoBlob(imageFileData.fileContent, typ != 'video' ? 'image/jpeg' : 'video/mp4');
      const imageFile = new File([imageBlob], imageFileData.fileName, { type: typ != 'video' ? 'image/jpeg' : 'video/mp4' });
      const finalFileHanlde = {
        file: imageFile,
        url: this.santizier.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      }
      moduleImagesToFileHandle.push(finalFileHanlde);
    }
    responseImagesModule = moduleImagesToFileHandle;
    return responseImagesModule;
  }
  dataURItoBlob(imageBytes, imageType) {
    const byteString = window.atob(imageBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }
}
