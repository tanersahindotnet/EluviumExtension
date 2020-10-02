import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private route: Router, translate: TranslateService) {
    let language = localStorage.getItem('language')
    if (language === null) {
      language = 'en';
    }
     // this language will be used as a fallback when a translation isn't found in the current language
     translate.setDefaultLang(language);
     // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(language);
    this.checkFirstLogin();
  }

  private checkFirstLogin() {
    const mail = localStorage.getItem('mail');
    const accountPasswordHashed = localStorage.getItem('accountPasswordHashed');
    const password = localStorage.getItem('password');
    const tempPass = localStorage.getItem('tempPass');
    const warning = localStorage.getItem('warning');
    if(warning !=null)
    {
      this.route.navigate(['warning']);
      return;
    }
    if (tempPass != null) {
      this.route.navigate(['verify']);
      return;
    }
    if (mail === null || accountPasswordHashed === null) {
       this.route.navigate(['firstLogin']);
       return;
     }
     if (password != null) {
      this.route.navigate(['dashboard']);
      return;
     }
     if (password === null) {
      this.route.navigate(['login']);
     }
  }
}
