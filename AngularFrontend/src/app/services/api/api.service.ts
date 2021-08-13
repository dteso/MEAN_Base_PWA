import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  options: {
    headers: { 'Content-Type': 'application/json' },
    params
  }

  constructor(private http: HttpClient) { }

  get(path:string, params: HttpParams = new HttpParams()): Observable<any>{
    // if(params){
    //   this.options.params = params;
    // }
    return this.http.get(`${environment.api_url}/${path}`, this.options);
  }

  post(path:string, body: object = {}): Observable<any>{
    return this.http.post(`${environment.api_url}/${path}`, body, this.options);
  }

  put(path:string, body: object = {}): Observable<any>{
    return this.http.put(`${environment.api_url}/${path}`, body, this.options);
  }

  delete(path:string): Observable<any>{
    return this.http.delete(`${environment.api_url}/${path}`);
  }

  deleteForm(path:string): Observable<any>{
    return this.http.delete(`${environment.api_url}/${path}`);
  }

  download(path: string){
    return this.http.get(path, {
      responseType: 'blob'
    });
  }

}
