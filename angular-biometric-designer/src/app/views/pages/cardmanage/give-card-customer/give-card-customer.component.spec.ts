import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveCardCustomerComponent } from './give-card-customer.component';

describe('GiveCardCustomerComponent', () => {
  let component: GiveCardCustomerComponent;
  let fixture: ComponentFixture<GiveCardCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveCardCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GiveCardCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
