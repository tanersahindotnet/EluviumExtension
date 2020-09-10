import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CreditCard } from '../../Models/creditCard';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { OnePassService } from '../../Services/onePass.service'
import { ApiRequestModel } from '../../Models/apiRequestModel';
import {MatSnackBar} from '@angular/material/snack-bar';
import { OnePassEncryptionService } from '../../Services/onePassEncryption.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-edit-credit-card',
  templateUrl: './edit-credit-card.component.html',
  styleUrls: ['./edit-credit-card.component.scss']
})
export class EditCreditCardComponent implements OnChanges {
  @Input() data: CreditCard;
  @Input() password: string;
  @Output() stateEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() saveEmitter: EventEmitter<boolean> = new EventEmitter();
  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    cardHolder: new FormControl('', Validators.required),
    cardNumber: new FormControl('', Validators.required),
    month: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    notes: new FormControl('')
  });
  constructor(private onePassService: OnePassService, private snackBar: MatSnackBar,
  private encryptionService: OnePassEncryptionService, private route: Router, private translate: TranslateService) {
    this.checkSession();
  }
  returnResult() {
    this.stateEmitter.emit(true);
  }
  ngOnChanges() {
    if (this.data !== null) {
      this.form.controls['title'].setValue(this.data.title);
      this.form.controls['cardHolder'].setValue(this.data.cardholderName);
      this.form.controls['cardNumber'].setValue(this.data.number);
      this.form.controls['month'].setValue(this.data.expMonth);
      this.form.controls['year'].setValue(this.data.expYear);
      this.form.controls['code'].setValue(this.data.code);
      this.form.controls['notes'].setValue(this.data.notes);
    } else {
      this.clearFormControls();
    }
  }
  onSubmit() {
    if (this.form.valid) {
      let creditCard = new CreditCard();
      const token = localStorage.getItem('token');
      const mail = localStorage.getItem('mail')
      const deviceId = localStorage.getItem('deviceId');
      const accountPasswordHashed = localStorage.getItem('accountPasswordHashed');
      const request = new ApiRequestModel();
      request.mail = mail;
      if (this.data !== null) {
        request.password = this.password
        creditCard = this.data;
      } else {
        request.password = accountPasswordHashed;
        creditCard.id = 0;
      }
      request.token = token;
      request.deviceId = deviceId;
      creditCard.title = this.form.controls['title'].value;
      creditCard.cardholderName = this.form.controls['cardHolder'].value;
      creditCard.number = this.form.controls['cardNumber'].value.toString();
      creditCard.expMonth = this.form.controls['month'].value.toString();
      creditCard.expYear = this.form.controls['year'].value.toString();
      creditCard.code = this.form.controls['code'].value.toString();
      creditCard.notes = this.form.controls['notes'].value;
      const encryptedCreditCard = this.encryptionService.encryptCreditCards(creditCard, this.password);

      this.onePassService.AddOrUpdateCreditCard(request, encryptedCreditCard).subscribe(p => {
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
    this.form.controls['cardHolder'].setValue('');
    this.form.controls['cardNumber'].setValue('');
    this.form.controls['month'].setValue('');
    this.form.controls['year'].setValue('');
    this.form.controls['code'].setValue('');
    this.form.controls['notes'].setValue('');
  }
}
