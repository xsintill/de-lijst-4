import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { AlertConfig } from './alert-config.type';
import { ConfirmConfig } from './confirm-config.type';
import { DialogFormComponent } from './dialog-form.component';
import { DialogComponent } from './dialog.component';
import { PromptConfig } from './prompt-config.type';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) { }

  alert(alert: AlertConfig) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '287px',
      data: alert
    });
    return dialogRef.afterClosed();
  }

  confirm(confirm: ConfirmConfig) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '287px',
      data: confirm
    });
    return dialogRef.afterClosed().pipe(map(Boolean));
  }

  prompt(prompt: PromptConfig) {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '287px',
      data: prompt
    });
    return (dialogRef.afterClosed() as any).filter(Boolean);
  }
}
