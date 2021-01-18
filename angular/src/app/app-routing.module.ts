import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FirstLoginComponent } from './components/login/first-login/first-login.component';
import { LoginComponent } from './components/login/quick-login/login.component';
import { GeneratorComponent } from './components/password/generator.component';
import { SettingComponent } from './components/setting/setting.component'
import { AccountComponent } from './components/account/account.component';
import { VerificationComponent } from './components/verification/verification.component';
import { RegisterComponent } from './components/register/register.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { WarningComponent } from './components/warning/warning.component';
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'firstLogin', component: FirstLoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'generator', component: GeneratorComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'account', component: AccountComponent },
  { path: 'verify', component: VerificationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'warning', component: WarningComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
