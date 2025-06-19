import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardnewDetailComponent } from './cardnew-detail.component';

describe('CardnewDetailComponent', () => {
  let component: CardnewDetailComponent;
  let fixture: ComponentFixture<CardnewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardnewDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardnewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
