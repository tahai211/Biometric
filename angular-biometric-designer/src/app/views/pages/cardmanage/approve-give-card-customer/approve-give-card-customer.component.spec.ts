import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveGiveCardCustomerComponent } from './approve-give-card-customer.component';

describe('ApproveGiveCardCustomerComponent', () => {
  let component: ApproveGiveCardCustomerComponent;
  let fixture: ComponentFixture<ApproveGiveCardCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveGiveCardCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApproveGiveCardCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
