import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardnewListComponent } from './cardnew-list.component';

describe('CardnewListComponent', () => {
  let component: CardnewListComponent;
  let fixture: ComponentFixture<CardnewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardnewListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardnewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
