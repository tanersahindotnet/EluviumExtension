import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPromptDialogComponent } from './account-prompt-dialog.component';

describe('AccountPromptDialogComponent', () => {
  let component: AccountPromptDialogComponent;
  let fixture: ComponentFixture<AccountPromptDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPromptDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
