import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveCardPinUnitComponent } from './give-card-pin-unit.component';

describe('GiveCardPinUnitComponent', () => {
  let component: GiveCardPinUnitComponent;
  let fixture: ComponentFixture<GiveCardPinUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveCardPinUnitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GiveCardPinUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
