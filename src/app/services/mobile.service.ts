import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  private mobile = new BehaviorSubject<any>(this.getStoredMobile());
  private logindata = new BehaviorSubject<any>(this.getlogindata());

  updateMobile$ = this.mobile.asObservable();
  updatelogindata$ = this.logindata.asObservable();

  constructor() {}

  updateMobile(mobile: any) {
    sessionStorage.setItem('mobile', mobile);   // save permanently
    this.mobile.next(mobile);                 // update BehaviorSubject
  }

  updatelogindata(loginData:any){
    debugger
     sessionStorage.setItem('loginData', JSON.stringify(loginData));  // save permanently
    this.logindata.next(loginData);   
  }

  private getStoredMobile() {
    return sessionStorage.getItem('mobile');     // load saved value
  }

private getlogindata() {
  const data = sessionStorage.getItem('loginData');

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Invalid loginData in sessionStorage:', data);
    sessionStorage.removeItem('loginData'); // cleanup bad value
    return null;
  }
}

  
}
