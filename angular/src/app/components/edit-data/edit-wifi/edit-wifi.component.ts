import { Component, Output, EventEmitter, OnChanges, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { WifiPassword } from '../../../models/wifi-password.model';
import { OnePassService } from '../../../services/onepass.service'
import { ApiRequestModel } from '../../../models/api-request.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { OnePassEncryptionService } from '../../../services/onepass-encryption.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-edit-wifi',
  templateUrl: './edit-wifi.component.html',
  styleUrls: ['./edit-wifi.component.scss']
})
export class EditWifiComponent implements OnChanges {
  @Input() data: WifiPassword;
  @Input() password: string;
  @Output() stateEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<boolean> = new EventEmitter();
  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    ssid: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });
  constructor(private onePassService: OnePassService, private snackBar: MatSnackBar,
  private encryptionService: OnePassEncryptionService, private route: Router,  private translate: TranslateService) {
    this.checkSession();
   }
  returnResult() {
    this.stateEmitter.emit(true);
  }
  ngOnChanges() {
    if (this.data !== null) {
      this.form.controls['title'].setValue(this.data.title);
      this.form.controls['ssid'].setValue(this.data.ssid);
      this.form.controls['password'].setValue(this.data.password);
      this.form.controls['notes'].setValue(this.data.notes);
    } else {
      this.clearFormControls();
    }
  }
  onSubmit() {
    if (this.form.valid) {
      let wifiPassword = new WifiPassword();
      const token = localStorage.getItem('token');
      const mail = localStorage.getItem('mail');
      const deviceId = localStorage.getItem('deviceId');
      const accountPasswordHashed = localStorage.getItem('accountPasswordHashed');
      const request = new ApiRequestModel();
      request.mail = mail;
      if (this.data !== null) {
        request.password = this.password
        wifiPassword = this.data;
      } else {
        request.password = accountPasswordHashed;
        wifiPassword.id = 0;
      }
      request.token = token;
      request.deviceId = deviceId;
      wifiPassword.title = this.form.controls['title'].value;
      wifiPassword.ssid = this.form.controls['ssid'].value.toString();
      wifiPassword.password = this.form.controls['password'].value;
      wifiPassword.notes = this.form.controls['notes'].value;
      const encryptedWifiPassword = this.encryptionService.encryptWifi(wifiPassword, this.password);

      this.onePassService.AddOrUpdateWifiPassword(request, encryptedWifiPassword).subscribe(p => {
        let success, fail, added, updated, somethingWrong;
        this.translate.get('Common.Fail').subscribe(p => fail = p);
        this.translate.get('Common.Success').subscribe(p => success = p);
        this.translate.get('Common.RecordAdded').subscribe(p => added = p);
        this.translate.get('Common.RecordUpdated').subscribe(p => updated = p);
        this.translate.get('Common.SomethingWrong').subscribe(p => somethingWrong = p);

        if (p) {
          if (this.data === null) {
            this.snackBar.open(added, success, {
              duration: 2000
            });
            this.form.reset();
            this.saveEmitter.emit(true);
          } else {
            this.snackBar.open(updated, success, {
              duration: 2000
            });
            this.saveEmitter.emit(true);
          }
        } else {
          this.snackBar.open(somethingWrong, fail, {
            duration: 2000
          });
        }
      })
    }
  }
  copyText(data) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (data));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.snackBar.open('Data Copied', 'Success', {
      duration: 2000
    });
  }
  private checkSession() {
    const password = localStorage.getItem('password');
    if (password === null) {
      this.route.navigate(['login']);
    }
  }
  private clearFormControls() {
    this.form.controls['title'].setValue('');
      this.form.controls['ssid'].setValue('');
      this.form.controls['password'].setValue('');
      this.form.controls['notes'].setValue('');
  }
}
