import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWifiComponent } from './edit-wifi.component';

describe('EditWifiComponent', () => {
  let component: EditWifiComponent;
  let fixture: ComponentFixture<EditWifiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWifiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
