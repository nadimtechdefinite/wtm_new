import { Component } from '@angular/core';
import { MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MATERIAL_MODULES } from '../../shared/material/material';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-session-expired-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, ...MATERIAL_MODULES, CommonModule,],
  templateUrl: './session-expired-dialog.component.html',
  styleUrl: './session-expired-dialog.component.scss'
})
export class SessionExpiredDialogComponent {
constructor(
    private dialogRef: MatDialogRef<SessionExpiredDialogComponent>,
    private router: Router
  ) {}

    ok() {
    this.dialogRef.close();
  }
}
