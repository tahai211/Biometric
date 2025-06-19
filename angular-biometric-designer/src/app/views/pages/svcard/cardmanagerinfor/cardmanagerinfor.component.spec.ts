import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardmanagerinforComponent } from './cardmanagerinfor.component';

describe('CardmanagerinforComponent', () => {
  let component: CardmanagerinforComponent;
  let fixture: ComponentFixture<CardmanagerinforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardmanagerinforComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardmanagerinforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
