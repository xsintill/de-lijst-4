import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfig } from './dialog-config.type';

@Component({
  template: `
  <h2 mat-dialog-title>
    {{ dialog.title }}
  </h2>
  <mat-dialog-content>
    {{ dialog.content }}
  </mat-dialog-content>
  <mat-dialog-actions>
    <button
        mat-button
        (click)="dialogRef.close(false)"
        color="primary">
        {{ dialog.close }}
    </button>
    <button
        *ngIf="dialog.ok"
        mat-button
        color="primary"
        (click)="dialogRef.close(true)">
        {{ dialog.ok }}
    </button>
  </mat-dialog-actions>
  `
})
export class DialogComponent {
  get dialog(): DialogConfig {
    return this.data;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogConfig,
    public dialogRef: MatDialogRef<DialogComponent>
  ) { }
}
