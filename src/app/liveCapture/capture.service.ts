import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {

  constructor(private http: HttpClient) { }

  saveImage(imageData: any) {
    const apiEndPointUrl = 'User/Upload';
    return this.http.post<any>(apiEndPointUrl, imageData);
  }
  getImages(id, moduleType) {
    const apiEndPointUrl = 'User/GetUploadFile';
    return this.http.get<any>(apiEndPointUrl + '?userId=' + id + '&captureType=' + moduleType);
  }
}
