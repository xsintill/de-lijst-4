
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
  //  MatErrorDirective
  MatDatepickerModule,
  MatNativeDateModule
  ],
  exports: [
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    // MatErrorDirective,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: []
})
export class CustomMaterialModule { }
