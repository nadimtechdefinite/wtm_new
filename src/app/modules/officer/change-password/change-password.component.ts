import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { masterService } from '../../../services/master.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../../shared/error-handler.service';
import { AlertService } from '../../../services/alert.service';
import { NoPasteDirective } from '../../../shared/directives/no-paste.directive';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [MatFormField, MatLabel, CommonModule, ReactiveFormsModule, FormsModule, ...MATERIAL_MODULES, NoPasteDirective],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePassword!: FormGroup;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
isSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private masterService: masterService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
    private alertService:AlertService) { }

  ngOnInit() {
    this.changePassword = this.fb.group(
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
    
    if (this.changePassword.invalid) {
      this.changePassword.markAllAsTouched();
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
    if (this.changePassword.invalid) {
      this.changePassword.markAllAsTouched();
      return;
    }

    const payload = {
      loginName: JSON.parse(sessionStorage.getItem('userInfo') || '{}')?.loginName,
      currentPassword: this.changePassword.value.currentpassword,
      newPassword: this.changePassword.value.newpassword,
      confirmPassword: this.changePassword.value.confirmpassword
    };

    this.masterService.changePassword(payload).subscribe({
      next: (res: any) => {
        if (res.messageCode === 1) {
          this.alertService.success(res.message);
          this.isSubmitted = false;
          this.changePassword.reset();
          this.changePassword.markAsPristine();
          this.changePassword.markAsUntouched();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err)
    });
  }

}
