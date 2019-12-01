import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IThreeLetterPattern } from './three-letter-pattern.model';

@Injectable({
  providedIn: 'root'
})
export class ThreeLetterPatternService {
  private baseURL = '/api/ThreeLetterPatterns';

  constructor(private http: HttpClient) { }

  public add(threeLetterPattern: IThreeLetterPattern): Promise<IThreeLetterPattern> {
    return this.http.post<IThreeLetterPattern>(`${this.baseURL}/Post`, threeLetterPattern).toPromise();
  }

  public addOccurenceFrom(title: string): Observable<IThreeLetterPattern[]> {
    return this.http.post<IThreeLetterPattern[]>(`${this.baseURL}/AddThreeLetterPatternOccurrencesFromTitle`, title);
  }
}
