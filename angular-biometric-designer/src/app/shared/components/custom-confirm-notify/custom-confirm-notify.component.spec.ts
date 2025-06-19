import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfirmNotifyComponent } from './custom-confirm-notify.component';

describe('CustomConfirmNotifyComponent', () => {
  let component: CustomConfirmNotifyComponent;
  let fixture: ComponentFixture<CustomConfirmNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomConfirmNotifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomConfirmNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
