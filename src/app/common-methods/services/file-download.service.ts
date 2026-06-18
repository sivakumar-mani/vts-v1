import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http: HttpClient) { }

  downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
  downloadFileAsByte(url: string): Observable<Uint8Array> {
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      map((response: ArrayBuffer) => new Uint8Array(response))
    );
  }
  /*
  downloadFileAsByte(url: string): Observable<Uint8Array> {
    // "http://192.168.108.53/Vtsuploadfiles/ClientCustomLoaDocument/778/2024/July/2024-07-19/VTS2-2024-Sales-0205%20LOA.docx"
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      map((response: ArrayBuffer) => new Uint8Array(response))
    );
  }
  downloadFileAsByte(url: string): Observable<Uint8Array> {
    // Define the headers as a single object
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'origin, x-requested-with',
    });

    // Define the options object with headers and responseType
    const options = {
      headers: headers,
      responseType: 'arraybuffer' as 'json' // 'arraybuffer' is a valid responseType
    };

    // Perform the HTTP GET request and map the response to Uint8Array
    return this.http.get(url, options).pipe(
      map((response: ArrayBuffer) => new Uint8Array(response))
    );
  }
  */
}