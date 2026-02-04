import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-dialog.component',
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatIconModule, MatDialogModule ],
  templateUrl: './alert-dialog.component.component.html',
  styleUrl: './alert-dialog.component.component.scss'
})
export class AlertDialogComponentComponent {
 constructor(
    private dialogRef: MatDialogRef<AlertDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close(true);
  }
}
