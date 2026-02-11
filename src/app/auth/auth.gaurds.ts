import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import {
  CanActivate,
  CanMatch,
  Route,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanMatch {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  private checkAccess(allowedRoles: string[] = []): boolean {
    const userInfoStr = sessionStorage.getItem('userInfo');

    // Not logged in
    if (!userInfoStr) {
      console.log('No userInfo → redirect login');
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    const userInfo = JSON.parse(userInfoStr);
    const userRole = String(userInfo.userType);

    // Role not allowed
    if (allowedRoles.length && !allowedRoles.includes(userRole)) {
      console.log('Role not allowed');
      this.router.navigate(['/unauthorized'], { replaceUrl: true });
      return false;
    }

      if (userRole === '0') {
        console.log('Citizen → Skip token expiry check');
        return true;
      }

    // Token invalid / expired (for ALL users)
    if (!this.auth.getToken()) {
      console.log('No token found');
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
    // Token invalid / expired (for ALL users)
    if (this.auth.isTokenExpired()) {
      console.log('Token expired');
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    console.log('✅ Guard Passed');
    return true;
  }

  // ================= CAN ACTIVATE =================
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roles = route.data?.['role'] || [];
    return this.checkAccess(roles);
  }

  // ================= CAN MATCH =================
  canMatch(route: Route): boolean {
    const roles = route.data?.['role'] || [];
    return this.checkAccess(roles);
  }
}

// import { Injectable } from '@angular/core';
// import { AuthService } from "./auth.service";
// import {
//   CanActivate,
//   CanMatch,
//   Route,
//   UrlSegment,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   Router
// } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate, CanMatch {

//   constructor(private router: Router, private auth: AuthService) {}


//   // ================= CAN LOAD =================
//   canMatch(route: Route, segments: UrlSegment[]): boolean {

//     const userInfoStr = sessionStorage.getItem('userInfo');

//     // 🔴 No session
//     if (!userInfoStr) {
//       this.router.navigateByUrl('/login', { replaceUrl: true });
//       return false;
//     }
//     const userInfo = JSON.parse(userInfoStr);
//      console.log(' User Info:1', userInfo);
//     const userRole = String(userInfo.userType);

//     const allowedRoles: string[] = route.data?.['role'] || [];

//     // 🔴 Role not allowed
//     if (allowedRoles.length && !allowedRoles.includes(userRole)) {
//       this.router.navigateByUrl('/unauthorized', { replaceUrl: true });
//       return false;
//     }

//     // 👤 CITIZEN (role = 0) → OTP based → no JWT check
//     if (userRole === '0') {
//       return true;
//     }

//     // 👮 ADMIN / PD → JWT required
//     if (!this.auth.getToken() || this.auth.isTokenExpired()) {
//       this.auth.logout();
//       return false;
//     }

//     return true;
//   }


// // ================= CAN ACTIVATE =================
//     canActivate(
//     route: ActivatedRouteSnapshot, state: RouterStateSnapshot
//   ): boolean {

//     const userInfoStr = sessionStorage.getItem('userInfo');

//     // 🔴 No session at all
//     if (!userInfoStr) {
//       this.router.navigate(['/login'], { replaceUrl: true });
//       return false;
//     }

//     const userInfo = JSON.parse(userInfoStr);
//     console.log(' User Info:2', userInfo);
//     const userRole = String(userInfo.userType);
//     console.log(route.data)
//     const allowedRoles: string[] = route.data?.['role'] || [];

//     // 🔴 Role not allowed
//     if (allowedRoles.length && !allowedRoles.includes(userRole)) {
//       this.router.navigate(['/unauthorized'], { replaceUrl: true });
//       return false;
//     }

//     // 👤 CITIZEN (role = 0) → OTP based → NO TOKEN CHECK
//     if (userRole === '0') {
//       return true;
//     }

//     // 👮 ADMIN / PD (role = 1,2) → JWT required
//     if (!this.auth.getToken() || this.auth.isTokenExpired()) {
//       this.auth.logout();
//       this.router.navigate(['/login'], { replaceUrl: true });
//       return false;
//     }

//     return true;
//   }
// }
