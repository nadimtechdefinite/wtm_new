// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserContext } from './user-context.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) {}

    private get context(): UserContext | null {
    const ctx = sessionStorage.getItem('userContext');
    return ctx ? JSON.parse(ctx) : null;
  }
    getUserContext(): UserContext | null {
    return this.context;
  }

  getUserCode(): number {
    return this.context?.userCode ?? 0;
  }

  getLoginName(): string {
    return this.context?.loginName ?? '';
  }

  getUserName(): string {
    return this.context?.userName ?? '';
  }

  getUserType(): number {
    return this.context?.userType ?? 0;
  }

  getStateCode(): number {
    return this.context?.stateCode ?? 0;
  }

  getDistrictCode(): number {
    return this.context?.districtCode ?? 0;
  }

  getBlockCode(): number {
    return this.context?.blockCode ?? 0;
  }

  getVillageCode(): number {
    return this.context?.villageCode ?? 0;
  }

//   isTokenExpired(): boolean {
//     if (!this.context) return true;
//     return Date.now() > this.context.exp * 1000;
//   }

//   logout() {
//     sessionStorage.clear();
//   }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getUser(): any {
    const user = sessionStorage.getItem('userInfo');
    return user ? JSON.parse(user) : null;
  }

  getRoles(): string[] {
    return this.getUser()?.roles || [];
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry;
  }


  logout() {
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }
}
