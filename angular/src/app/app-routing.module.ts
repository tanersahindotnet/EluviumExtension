import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FirstLoginComponent } from './login/first-login/first-login.component';
import { LoginComponent } from './login/quick-login/login.component';
import { GeneratorComponent } from './password/generator.component';
import { SettingComponent } from './setting/setting.component'
import { AccountComponent } from './account/account.component';
import { VerificationComponent } from './verification/verification.component';
import { RegisterComponent } from './register/register.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { WarningComponent } from './warning/warning.component';
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
