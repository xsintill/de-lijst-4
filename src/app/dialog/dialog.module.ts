import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { DialogContentDirective } from './dialog-content.directive';
import { DialogFormComponent } from './dialog-form.component';
import { DialogComponent } from './dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule
  ],
  declarations: [
    DialogContentDirective,
    DialogFormComponent,
    DialogComponent
  ],
  entryComponents: [
    DialogFormComponent,
    DialogComponent
  ]
})
export class DialogModule { }
