import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardrenewListComponent } from './cardrenew-list.component';

describe('CardrenewListComponent', () => {
  let component: CardrenewListComponent;
  let fixture: ComponentFixture<CardrenewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardrenewListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardrenewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
