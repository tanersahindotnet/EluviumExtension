import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './app.material.module';
import { AppComponent } from './app.component';
import { FirstLoginComponent} from './login/first-login/first-login.component'
import { LoginComponent } from './login/quick-login/login.component';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { StringEncryptionService } from './Services/stringEncryption.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module'
import { RouterModule } from '@angular/router';
import {BottomNavModule} from 'ngx-bottom-nav';
import { GeneratorComponent } from './password/generator.component'
import { SettingComponent } from './setting/setting.component';
import { OnePassService} from './Services/onePass.service';
import { EditPasswordComponent } from './edit-data/edit-password/edit-password.component';
import { EditWifiComponent } from './edit-data/edit-wifi/edit-wifi.component';
import { EditServerComponent } from './edit-data/edit-server/edit-server.component';
import { EditCreditCardComponent } from './edit-data/edit-credit-card/edit-credit-card.component'
import { OnePassEncryptionService } from './Services/onePassEncryption.service'
import { EmptyListComponent } from './dialog/empty-list/empty-list.component';
import { AccountComponent } from './account/account.component';
import { DialogContentComponent } from './dialog/about-dialog/about-dialog.component';
import { QuestionDialogComponent } from './dialog/question-dialog/question-dialog.component';
import { AccountPromptDialogComponent } from './dialog/account-prompt-dialog/account-prompt-dialog.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { VerificationComponent } from './verification/verification.component';
import { RegisterComponent } from '../app/register/register.component';
import { PasswordAdvisorService } from '../app/Services/passwordAdvisor.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PrivacyComponent } from './privacy/privacy.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    ScrollingModule,
    BottomNavModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
      defaultLanguage: 'en-US'
  })
  ],
  declarations: [AppComponent, FirstLoginComponent, LoginComponent, DashboardComponent, GeneratorComponent, SettingComponent,
  EditPasswordComponent, EditWifiComponent, EditServerComponent, EditCreditCardComponent, EmptyListComponent, AccountComponent,
  DialogContentComponent, QuestionDialogComponent, AccountPromptDialogComponent, VerificationComponent, RegisterComponent,PrivacyComponent],
  bootstrap: [AppComponent],
  providers: [StringEncryptionService, OnePassService, OnePassEncryptionService, PasswordAdvisorService]
})
export class AppModule { }
