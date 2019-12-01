import { FormGroup } from '@angular/forms';
import { Type, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { DialogComponent } from './dialog.component';
import { DialogFormComponent } from './dialog-form.component';


export interface AlertConfig {
    title?: string;
    content?: string;
    close: string;
  }

  export interface ConfirmConfig {
    title?: string;
    content?: string;
    ok?: string;
    close: string;
  }

  export interface FormComponent {
      form: FormGroup;
  }

  export interface PromptConfig {
    formComponent: Type<FormComponent>;
    title?: string;
    content?: string;
    ok?: string;
    close: string;
  }

  @Injectable()
  export class DialogService {

      constructor(
          private dialog: MatDialog
      ) {}

      alert(alert: AlertConfig) {
        const dialogRef = this.dialog.open(DialogComponent,
          { width: '287px', data: alert }
        );
        return dialogRef.afterClosed();
      }

      confirm(confirm: ConfirmConfig) {
        const dialogRef = this.dialog.open(DialogComponent,
          { width: '287px', data: confirm }
        );
        return dialogRef.afterClosed().pipe(
          map(Boolean)
        );
      }

      prompt(prompt: PromptConfig) {
        const dialogRef = this.dialog.open(DialogFormComponent,
          { width: '287px', data: prompt }
        );
        return (<any>dialogRef.afterClosed()).filter(Boolean);
      }

  }
