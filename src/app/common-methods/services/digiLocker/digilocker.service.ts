import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DigiLockerService {

  private apiUrl = 'https://localhost:5001/api/DigiLocker'; // Adjust API URL as needed

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetDocuments`);
  }

  downloadDocument(fileId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/DownloadDocument/${fileId}`, { responseType: 'blob' });
  }
}
