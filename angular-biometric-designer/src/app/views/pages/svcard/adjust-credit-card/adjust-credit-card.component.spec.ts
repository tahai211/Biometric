import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustCreditCardComponent } from './adjust-credit-card.component';

describe('AdjustCreditCardComponent', () => {
  let component: AdjustCreditCardComponent;
  let fixture: ComponentFixture<AdjustCreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustCreditCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdjustCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
