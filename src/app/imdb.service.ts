import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImdbService {

  private rapidApiKey = '4ccbc10367msh3a0aae042eaac2ep10144bjsn5bf582dc9c1c';

  constructor(private http: HttpClient) {

  }

  browse(text: string, type: string, page: number): Observable<any> {
    const url = "https://movie-database-alternative.p.rapidapi.com";
    const headers = new HttpHeaders({'x-rapidapi-key': this.rapidApiKey});
    const params = {
      s: text,
      type: type,
      page: page,
      r: "json"
    };
    const options = { headers: headers, params: this.createHttpParams(params)};
    return this.http.get(url, options);
  }

  getDetails(imdbID: string): Observable<any> {
    const url = "https://movie-database-alternative.p.rapidapi.com";
    const headers = new HttpHeaders({'x-rapidapi-key': this.rapidApiKey});
    const params = {
      i: imdbID
    };
    const options = { headers: headers, params: this.createHttpParams(params)};
    return this.http.get(url, options);
  }

  private createHttpParams(params: any): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(param => {
      if(params[param]){
        httpParams = httpParams.set(param, params[param]);
      }
    });

    return httpParams;
  }
}
