import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from './alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private dialog: MatDialog,
  ) { }
  openDialog(alert: {
    title: string,
    message: string
  }) {
    const dialogRef = this.dialog.open(AlertComponent, {
      disableClose: true,
      data: {alert}
    });
    return dialogRef;

  }
}
