import { NgModule } from '@angular/core';
import { BrowserModule, Title  } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './UI/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './editUser-profile/user-profile.component'
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './core/home/home.component';
import { AllUsersComponent } from './core/all-users/all-users.component';
import { ProfileComponent } from './loggedInUserProfile/profile.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { UsersComponent } from './UI/users/users.component';
import { ApiServiceService } from './services/api-service.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeavesComponent } from './core/leaves/leaves.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminHeaderComponent } from './core/admin-header/admin-header.component';
import { CheckLeavesComponent } from './core/all-users/check-leaves/check-leaves.component';
import { EmployeeLeaveComponent } from './core/all-users/check-leaves/employee-leave/employee-leave.component';
import { EditAdminProfileComponent } from './edit-admin-profile/edit-admin-profile.component';
import { IonicModule } from '@ionic/angular';
import { PayrollComponent } from './core/all-users/payroll/payroll.component';
import { ViewPayrollComponent } from './core/all-users/payroll/view-payroll/view-payroll.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    HeaderComponent,
    HomeComponent,
    AllUsersComponent,
    ProfileComponent,
    AdminLoginComponent,
    UsersComponent,
    LeavesComponent,
    AdminHeaderComponent,
    CheckLeavesComponent,
    EmployeeLeaveComponent,
    EditAdminProfileComponent,
    PayrollComponent,
    ViewPayrollComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    IonicModule.forRoot(),
  ],
  providers: [ApiServiceService, Title],
  bootstrap: [AppComponent],
})
export class AppModule { }
