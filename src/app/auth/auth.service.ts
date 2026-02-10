// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserContext } from './user-context.model';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponent } from './session-expired-dialog/session-expired-dialog.component';
import { ForceChangePasswordDialogComponent } from '../shared/force-change-password-dialog/force-change-password-dialog.component';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private dialogOpen = false;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }
  // constructor(private router: Router) {}

  private get context(): UserContext | null {
    const ctx = sessionStorage.getItem('userInfo');
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

  // isTokenExpired(): boolean {
  //   const token = this.getToken();
  //   if (!token) return true;

  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   const expiry = payload.exp * 1000;
  //   return Date.now() > expiry;
  // }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      this.openSessionExpiredDialog();
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;

      if (Date.now() > expiry) {
        this.openSessionExpiredDialog();
        return true;
      }
      return false;
    } catch {
      this.openSessionExpiredDialog();
      return true;
    }
  }
  openSessionExpiredDialog() {
    if (this.dialogOpen) return;
    this.dialogOpen = true;
    this.dialog
      .open(SessionExpiredDialogComponent, {
        disableClose: true,
        width: '400px'
      })
      .afterClosed()
      .subscribe(() => {
        this.dialogOpen = false;
        this.router.navigate(['/login']);
      });
  }


  logout() {
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

  openForceChangePasswordDialog() {
    this.dialog.open(ForceChangePasswordDialogComponent, {
      disableClose: true,
      width: '450px'
    }).afterClosed().subscribe(success => {
      if (success) {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }



}
