import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MATERIAL_MODULES } from '../material/material';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { masterService } from '../../services/master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { NoPasteDirective } from '../directives/no-paste.directive';
import { AuthService } from '../../auth/auth.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-force-change-password-dialog',
  standalone: true,
  imports: [MatFormField, MatLabel, CommonModule, ReactiveFormsModule, FormsModule, ...MATERIAL_MODULES, NoPasteDirective, MatButtonModule],
  templateUrl: './force-change-password-dialog.component.html',
  styleUrl: './force-change-password-dialog.component.scss'
})
export class ForceChangePasswordDialogComponent {
  forceChangePassword!: FormGroup
  // changePassword!: FormGroup;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  isSubmitted = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: string; title: string },
    private fb: FormBuilder,
    private masterService: masterService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private errorHandler: ErrorHandlerService,
    private auth: AuthService,
    private dialogRef: MatDialogRef<ForceChangePasswordDialogComponent>
  ) { }

  ngOnInit() {
    this.forceChangePassword = this.fb.group(
      {
        currentpassword: ['', Validators.required],
        newpassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*012)(?!.*123)(?!.*234)(?!.*345)(?!.*456)(?!.*567)(?!.*678)(?!.*789).{8,}$/
            )
          ]
        ],
        confirmpassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassCtrl = group.get('newpassword');
    const confirmPassCtrl = group.get('confirmpassword');
    if (!newPassCtrl || !confirmPassCtrl) return null;
    if (confirmPassCtrl.errors && !confirmPassCtrl.errors['passwordMismatch']) {
      return null;
    }
    if (newPassCtrl.value !== confirmPassCtrl.value) {
      confirmPassCtrl.setErrors({ passwordMismatch: true });
    } else {
      confirmPassCtrl.setErrors(null);
    }
    return null;
  }

  formSubmit() {
    if (this.forceChangePassword.invalid) {
      this.forceChangePassword.markAllAsTouched();
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to change your password?',
        flag: "changepassword"
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.changePasswordApiCall();
      }
    });
  }

  changePasswordApiCall() {
    this.isSubmitted = true;
    if (this.forceChangePassword.invalid) {
      this.forceChangePassword.markAllAsTouched();
      return;
    }
    const encryptedPassword = CryptoJS.SHA256(this.forceChangePassword.value.currentpassword.trim()).toString(CryptoJS.enc.Hex);
    const payload = {
      loginName: JSON.parse(sessionStorage.getItem('userInfo') || '{}')?.loginName,
      currentPassword: encryptedPassword,
      newPassword: this.forceChangePassword.value.newpassword,
      confirmPassword: this.forceChangePassword.value.confirmpassword
    };
    this.masterService.changePassword(payload).subscribe({
      next: (res: any) => {
        if (res.messageCode === 1) {
          this.alertService.success(res.message);
          this.isSubmitted = false;
          this.forceChangePassword.reset();
          this.forceChangePassword.markAsPristine();
          this.forceChangePassword.markAsUntouched();
          this.dialogRef.close(true);
          this.auth.logout();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err)
    });
  }

  close() {
    this.dialogRef.close(true);
    // this.auth.logout();
  }

}
