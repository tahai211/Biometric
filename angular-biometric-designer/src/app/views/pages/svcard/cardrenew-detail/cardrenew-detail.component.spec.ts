import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardrenewDetailComponent } from './cardrenew-detail.component';

describe('CardrenewDetailComponent', () => {
  let component: CardrenewDetailComponent;
  let fixture: ComponentFixture<CardrenewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardrenewDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardrenewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
