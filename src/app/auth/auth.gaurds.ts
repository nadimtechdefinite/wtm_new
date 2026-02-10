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
    // Token invalid / expired (for ALL users)
    if (!this.auth.getToken()) {
      console.log(' ');
      return false;
    }
    // Token invalid / expired (for ALL users)
    if (this.auth.isTokenExpired()) {
      console.log('Token expired');
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
