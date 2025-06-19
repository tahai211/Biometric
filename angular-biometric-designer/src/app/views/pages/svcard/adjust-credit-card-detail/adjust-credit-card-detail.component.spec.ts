import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustCreditCardDetailComponent } from './adjust-credit-card-detail.component';

describe('AdjustCreditCardDetailComponent', () => {
  let component: AdjustCreditCardDetailComponent;
  let fixture: ComponentFixture<AdjustCreditCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustCreditCardDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdjustCreditCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
