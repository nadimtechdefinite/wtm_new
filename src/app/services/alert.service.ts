// import { Injectable } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { AlertDialogComponentComponent } from '../shared/alert-dialog.component/alert-dialog.component.component';


// @Injectable({
//   providedIn: 'root'
// })
// export class AlertService {

//   constructor(private dialog: MatDialog) {}

//   success(message: string, title: string = 'Success') {
//     this.openDialog(message, title, 'check_circle', 'primary');
//   }

//   error(message: string, title: string = 'Error') {
//     this.openDialog(message, title, 'error', 'warn');
//   }

//   info(message: string, title: string = 'Info') {
//     this.openDialog(message, title, 'info', 'accent');
//   }

//   warning(message: string, title: string = 'Warning') {
//     this.openDialog(message, title, 'warning', 'warn');
//   }

//   private openDialog(
//     message: string,
//     title: string,
//     icon: string,
//     type: string
//   ) {
//     this.dialog.open(AlertDialogComponentComponent, {
//       width: '400px',
//       disableClose: true,
//       data: { message, title, icon, type }
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponentComponent } from '../shared/alert-dialog.component/alert-dialog.component.component';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private dialog: MatDialog) {}

  success(message: string, title: string = 'Success'): MatDialogRef<AlertDialogComponentComponent> {
    return this.openDialog(message, title, 'check_circle', 'primary');
  }

  error(message: string, title: string = 'Error'): MatDialogRef<AlertDialogComponentComponent> {
    return this.openDialog(message, title, 'error', 'warn');
  }

  info(message: string, title: string = 'Info'): MatDialogRef<AlertDialogComponentComponent> {
    return this.openDialog(message, title, 'info', 'accent');
  }

  warning(message: string, title: string = 'Warning'): MatDialogRef<AlertDialogComponentComponent> {
    return this.openDialog(message, title, 'warning', 'warn');
  }

  private openDialog(
    message: string,
    title: string,
    icon: string,
    type: string
  ): MatDialogRef<AlertDialogComponentComponent> {
    return this.dialog.open(AlertDialogComponentComponent, {
      width: '400px',
      disableClose: true,
      data: { message, title, icon, type }
    });
  }
}
