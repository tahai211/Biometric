import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardmanageComponent } from './cardmanage.component';

describe('CardmanageComponent', () => {
  let component: CardmanageComponent;
  let fixture: ComponentFixture<CardmanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardmanageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
