import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatRadioModule,
  MatTabsModule,
  MatCardModule,
  MatChipsModule,
  MatListModule,
  MatDividerModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { PatronService } from './patron.service';
import { HomePageComponent } from './home-page/home-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { ManagementPageComponent } from './management-page/management-page.component';
import { EditPatronDialogComponent } from './edit-patron-dialog/edit-patron-dialog.component';
import { DeletePatronDialogComponent } from './delete-patron-dialog/delete-patron-dialog.component';
import { BatchAddCoinsDialogComponent } from './batch-add-coins-dialog/batch-add-coins-dialog.component';
import { DisableControlDirective } from './disable-control-directive';
import { WalletViewComponent } from './wallet-view/wallet-view.component';
import { LoggingViewComponent } from './logging-view/logging-view.component';
import { DeleteAllLogsDialogComponent } from './delete-all-logs-dialog/delete-all-logs-dialog.component';
import { DeleteLogWarningDialogComponent } from './delete-log-warning-dialog/delete-log-warning-dialog.component';
import { AddLogDialogComponent } from './add-log-dialog/add-log-dialog.component';
import { CommissionFormComponentComponent } from './commission-form-component/commission-form-component.component';

const appRoutes: Routes = [
  {path: 'Welcome', component: HomePageComponent, data: {page: 'welcome'}},
  {path: '', redirectTo: '/Welcome', pathMatch: 'full'},
  {path: 'welcome', redirectTo: '/Welcome', pathMatch: 'full'},
  {path: 'home', redirectTo: '/Welcome', pathMatch: 'full'},
  {path: 'Admin', component: SignInPageComponent, data: {page: 'admin'}},
  {path: 'admin', redirectTo: '/Admin', pathMatch: 'full'},
  {path: 'Administration', redirectTo: '/Admin', pathMatch: 'full'},
  {path: 'administration', redirectTo: '/Admin', pathMatch: 'full'},
  {path: 'Manage', component: ManagementPageComponent, data: {page: 'manage'}},
  {path: 'manage', redirectTo: '/Manage', pathMatch: 'full'},
  {path: 'Wallet', component: WalletViewComponent, data: {page: 'wallet'}},
  {path: 'wallet', redirectTo: '/Wallet', pathMatch: 'full'},
  {path: 'Coins', redirectTo: '/Wallet', pathMatch: 'full'},
  {path: 'coins', redirectTo: '/Wallet', pathMatch: 'full'},
  {path: 'coin', redirectTo: '/Wallet', pathMatch: 'full'},
  {path: 'Coin', redirectTo: '/Wallet', pathMatch: 'full'},
  {path: 'Logs', component: LoggingViewComponent, data: {page: 'logs'}},
  {path: 'logs', redirectTo: '/Logs', pathMatch: 'full'},
  {path: 'Log', redirectTo: '/Logs', pathMatch: 'full'},
  {path: 'log', redirectTo: '/Logs', pathMatch: 'full'},
  {path: 'experimental', component: CommissionFormComponentComponent, data: {page: 'experimental'}}
];
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignInPageComponent,
    ManagementPageComponent,
    EditPatronDialogComponent,
    DeletePatronDialogComponent,
    BatchAddCoinsDialogComponent,
    DisableControlDirective,
    WalletViewComponent,
    LoggingViewComponent,
    DeleteAllLogsDialogComponent,
    DeleteLogWarningDialogComponent,
    AddLogDialogComponent,
    CommissionFormComponentComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // debugging purposes only
    ),
    BrowserModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    MatRadioModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [AuthService, PatronService, CookieService],
  bootstrap: [AppComponent],
  entryComponents: [
    EditPatronDialogComponent,
    DeletePatronDialogComponent,
    BatchAddCoinsDialogComponent,
    DeleteAllLogsDialogComponent,
    DeleteLogWarningDialogComponent,
    AddLogDialogComponent
  ]
})
export class AppModule { }
