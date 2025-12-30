import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpApiService {
  constructor(public http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
    }),
  };

  getHttpRequestHeader() {
    return this.httpOptions;
  }

  getHttpClient() {
    return this.http;
  }

  getApiWithoutToken(uri: string) {
    return this.http.get(`${uri}`);
  }
    getApiWithSession(uri: string) {
   return this.http.get(uri, { withCredentials: true }); 
  }

  getApi(uri: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
      }),
    };
    return this.http.get(`${uri}`, this.httpOptions);
  }

  getApiblob(uri: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
      }),
    };
    return this.http.get(`${uri}`, { responseType: 'blob' });
  }

  headerWithReqPost(uri: string, req: any) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
      }),
    };
    return this.http.post(`${uri}`, req, this.httpOptions);
  }

  postApiWithoutToken(uri: string, req: any) {
    return this.http.post(`${uri}`, req);
  }

  postApi(uri: string, req: any) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
      }),
    };
    return this.http.post(`${uri}`, req, this.httpOptions);
  }

  postApiForCitizen(uri: string, req: any) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: '2Bearer ' + sessionStorage.getItem('citizentoken'),
      }),
    };
    return this.http.post(`${uri}`, req, this.httpOptions);
  }

  getApiForCitizen(uri: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: '2Bearer ' + sessionStorage.getItem('citizentoken'),
      }),
    };
    return this.http.get(`${uri}`, this.httpOptions);
  }

  formdatapostApi(uri: string, req: any) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
      }),
    };
    return this.http.post(`${uri}`, req, this.httpOptions);
  }

  getExcelApiWithoutToken(uri: string) {
    return this.http.get(`${uri}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/octet-stream',
      }),
      observe: 'response',
      responseType: 'blob',
    });
  }

  getExcelApi(uri: string) {
    return this.http.get(`${uri}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
        'Content-Type': 'application/octet-stream',
      }),
      observe: 'response',
      responseType: 'blob',
    });
  }

  getPdfApiWithoutToken(uri: string) {
    return this.http.get(`${uri}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
      }),
      observe: 'response',
      responseType: 'blob',
    });
  }

  getPdfApi(uri: string) {
    return this.http.get(`${uri}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken'),
        'Content-Type': 'application/pdf',
      }),
      observe: 'response',
      responseType: 'blob',
    });
  }
}
