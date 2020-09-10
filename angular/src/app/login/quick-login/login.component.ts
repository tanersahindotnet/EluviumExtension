import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StringEncryptionService } from '../../Services/stringEncryption.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    onePassPassword: new FormControl('', Validators.required)
  });
  constructor(private encryptionService: StringEncryptionService, private router: Router,
  private snackBar: MatSnackBar, private translate: TranslateService) { }

  onSubmit() {
    if (this.form.valid) {
      const password = this.form.controls['onePassPassword'].value;
      const accountPasswordHashed = localStorage.getItem('accountPasswordHashed');
      const hashedPassword = this.encryptionService.encryptSha(password);
      if (hashedPassword === accountPasswordHashed) {
        {
          localStorage.setItem('password', password);
          this.setTimer();
          this.router.navigate(['dashboard']);
        }
      } else {
        let wrongInfo, fail;
          this.translate.get('Common.WrongInfo').subscribe(p => wrongInfo = p);
          this.translate.get('Common.Fail').subscribe(p => fail = p);
          this.snackBar.open(wrongInfo, fail, {
            duration: 2000
          });
      }
    }
  }
  private setTimer() {
    const interval = localStorage.getItem('interval');
    if (interval !== null) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + Number(interval));
      localStorage.setItem('expire', date.toString())
    }
  }
}
