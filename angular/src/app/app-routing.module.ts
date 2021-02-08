import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { FirstLoginComponent } from './components/login/first-login/first-login.component'
import { LoginComponent } from './components/login/quick-login/login.component'
import { GeneratorComponent } from './components/password/generator.component'
import { SettingComponent } from './components/setting/setting.component'
import { AccountComponent } from './components/account/account.component'
import { VerificationComponent } from './components/verification/verification.component'
import { RegisterComponent } from './components/register/register.component'
import { PrivacyComponent } from './components/privacy/privacy.component'
import { WarningComponent } from './components/warning/warning.component'
import { UrlEnum } from './enums/url.enum'
const routes: Routes = [
  { path: UrlEnum.DASHBOARD, component: DashboardComponent },
  { path: UrlEnum.FIRSTLOGIN, component: FirstLoginComponent },
  { path: UrlEnum.LOGIN, component: LoginComponent },
  { path: UrlEnum.GENERATOR, component: GeneratorComponent },
  { path: UrlEnum.SETTING, component: SettingComponent },
  { path: UrlEnum.ACCOUNT, component: AccountComponent },
  { path: UrlEnum.VERIFY, component: VerificationComponent },
  { path: UrlEnum.REGISTER, component: RegisterComponent },
  { path: UrlEnum.PRIVACY, component: PrivacyComponent },
  { path: UrlEnum.WARNING, component: WarningComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
