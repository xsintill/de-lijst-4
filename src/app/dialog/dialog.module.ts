import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
