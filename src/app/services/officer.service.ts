import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
const verifyOtpApi = environment.apiUrl+"auth/login" ;

@Injectable({
    providedIn:'root'
})
export class OfficerService{
    constructor(private http:HttpClient){}
  loginFormCreate(req: any) {
    return this.http.post(`${verifyOtpApi}`,req);
  }
}