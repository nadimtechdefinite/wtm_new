import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpApiService } from '../services/http-api.service';
import swal from 'sweetalert2';

// const verifyOtpApi = environment.base_uri+"auth/login" ;
// const changePasswordFirstTime = environment.base_uri+"auth/changePasswordFirstTime" ;
// const forgetPassword = environment.base_uri+"auth/forgetPassword" ;
// const verifyOtpApiLogin = environment.base_uri+"auth/loginVerifyOtp" ;
// const loginVerifyOtpForget = environment.base_uri+"auth/loginVerifyOtpForget" ;
// const generateOtp = environment.base_uri+"auth/loginGenerateOtp" ;
// const logoutForce = environment.base_uri+"auth/logoutForce" ;

// const logoutApi = environment.base_uri+"auth/logout" ;
// const getModulesApi = environment.base_uri+"userManagement/getModule" ;

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpApiService {
//   changePasswordFirstTime(json: any) {
//       return this.headerWithReqPost(`${changePasswordFirstTime}`,json);

//   }

//  forgetPassword(json: any) {
//       return this.headerWithReqPost(`${forgetPassword}`,json);

//   }

//  logoutForce(userId: string) {
//   return this.getApiWithoutToken(`${logoutForce}?userId=${userId}`);
// }


//   generateOtp(userId: any) {
//     return this.getApiWithoutToken(`${generateOtp}?userId=${userId}`);
//   }


 isAuthenticated(): boolean {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
        // Parse the token (assuming it's a JWT and can be parsed)
        const decodedToken = this.decodeToken(token);
        
        if (decodedToken && decodedToken.exp) {
            const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
            
            // If token is expired
            if (decodedToken.exp < currentTime) {
                // Token has expired, remove from sessionStorage
                sessionStorage.removeItem("accessToken");
                 swal.fire("ALERT", "Session Expired.Please login again.", "error");
                return false;  // Token is expired, not authenticated
            }
            
            return true;  // Token is still valid
        }
    }
    
    // No token found, not authenticated
    return false;
}


isAuthenticatedCitizen(): boolean {
    const token = sessionStorage.getItem("citizentoken");

    if (token) {
        // Parse the token (assuming it's a JWT and can be parsed)
        const decodedToken = this.decodeToken(token);
        
        if (decodedToken && decodedToken.exp) {
            const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
            
            // If token is expired
            if (decodedToken.exp < currentTime) {
                // Token has expired, remove from sessionStorage
                sessionStorage.removeItem("citizentoken");
                 swal.fire("ALERT", "Session Expired.Please login again.", "error");
                return false;  // Token is expired, not authenticated
            }
            
            return true;  // Token is still valid
        }
    }
    
    // No token found, not authenticated
    return false;
}

// A method to decode the JWT token and extract the expiration date
decodeToken(token: string): any {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
        return null;
    }
    
    const decoded = atob(parts[1]);  // Decode the second part of JWT (payload)
    return JSON.parse(decoded);
}


  // Add other methods like login, logout, etc.


//    validateOtp(json: any) {

//     return this.headerWithReqPost(`${verifyOtpApiLogin}`,json);
//   }

//  validateOtpForget(json: any) {

//     return this.postApiWithoutToken(`${loginVerifyOtpForget}`,json);
//   }

//   logout() {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('accessToken');
//      return this.getApi(`${logoutApi}`) ;
//   }

isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  checkLogin(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
}



  // constructor(public http: HttpClient) { }

//   loginFormCreate(req: any) {
//     return this.http.post(`${verifyOtpApi}`,req);
//   }


//   getModules() {
//     return this.getApi(`${getModulesApi}`) ;
//   }

 

  

 

}
