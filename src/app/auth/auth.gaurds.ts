import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router) {}

  // =======================
  // 🔒 CanLoad (Lazy Module)
  // =======================
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const userInfoStr = sessionStorage.getItem('userInfo');
    if (!userInfoStr) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false;
    }
    const userInfo = JSON.parse(userInfoStr);
    const userRole: string = String(userInfo.userType); // '1' | '2'
    const allowedRoles: string[] = route.data?.['role'] || [];
    if (allowedRoles.length && !allowedRoles.includes(userRole)) {
      this.router.navigateByUrl('/unauthorized', { replaceUrl: true });
      return false;
    }

    return true;
  }


  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {

    const userInfoStr = sessionStorage.getItem('userInfo');

    if (!userInfoStr) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false;
    }
    const userInfo = JSON.parse(userInfoStr);
    const userRole: string = String(userInfo.userType);
    const allowedRoles: string[] = route.data?.['role'] || [];

    if (allowedRoles.length && !allowedRoles.includes(userRole)) {
      this.router.navigateByUrl('/unauthorized', { replaceUrl: true });
      return false;
    }
    return true;
  }
}
