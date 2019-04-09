import { DialogModule } from "./dialog/dialog.module";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
// import { MatToolbarModule, MatButtonModule, MatInputModule,
//   MatListModule, MatDatepickerModule, MatNativeDateModule,
//   MatIconModule, MatIconRegistry, MatTooltipModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { PagingService } from "./paging.service";
import { DbAnalyticsService } from "./db-analytics.service";
import { AppComponent } from "./app.component";
import { CustomMaterialModule } from "./material/material.module";
import { HeaderComponent } from "./header/header.component";
import { MainContentComponent } from "./main-content/main-content.component";
import { FooterComponent } from "./footer/footer.component";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { ListPageComponent } from "./list-page/list-page.component";
import { EditPageComponent } from "./edit-page/edit-page.component";
import { DialogService } from "./dialog/dialog.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DirectivesModule } from "./directives/directives.module";

const appRoutes: Routes = [
  { path: "list", component: ListPageComponent },
  { path: "edit/{:id}", component: EditPageComponent },
  { path: "add", component: EditPageComponent, },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainContentComponent,
    FooterComponent,
    SideMenuComponent,
    ListPageComponent,
    EditPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    FlexLayoutModule,
    CustomMaterialModule,
    RouterModule.forRoot(appRoutes),
    CommonModule,
    DirectivesModule

  ],
  providers: [
    DbAnalyticsService,
    PagingService,
    HttpClientModule,
    DialogService, {provide: MatDialogRef, useValue: {}},
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
