import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveCardPinComponent } from './receive-card-pin.component';

describe('ReceiveCardPinComponent', () => {
  let component: ReceiveCardPinComponent;
  let fixture: ComponentFixture<ReceiveCardPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveCardPinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiveCardPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
