import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchCriteriaService {

  constructor(private http: HttpClient) {

  }

  // Get All Master data controls,
  public getSearchCriteriaList(): Observable<any> {
    const dataUrl = 'SearchCriteria/GetSearchCriteriaMasterList';
    return this.http.get(dataUrl);
  }
  // Get Screening Details By Filter Criteria,
  public getScreeningDetailsByFilterCriteria(): Observable<any> {
    const dataUrl = 'SearchCriteria/GetScreeningDetailsByFilterCriteria';
    return this.http.get(dataUrl);
  }
}
