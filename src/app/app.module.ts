import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DbAnalyticsService } from './db-analytics.service';
import { DialogModule } from './dialog/dialog.module';
import { DialogService } from './dialog/dialog.service';
import { DirectivesModule } from './directives/directives.module';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ListPageComponent } from './list-page/list-page.component';
import { MainContentComponent } from './main-content/main-content.component';
import { CustomMaterialModule } from './material/material.module';
import { PagingService } from './paging.service';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { VirtualListComponent } from './virtual-list/virtual-list.container';
import { VirtualListUi } from './virtual-list/virtual-list.ui';

const appRoutes: Routes = [
  { path: 'list', component: ListPageComponent },
  { path: 'virtual-list', component: VirtualListComponent },
  { path: 'edit/:id', component: EditPageComponent },
  { path: 'add', component: EditPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainContentComponent,
    FooterComponent,
    SideMenuComponent,
    ListPageComponent,
    VirtualListComponent,
    VirtualListUi,
    EditPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
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
    DialogService, { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
