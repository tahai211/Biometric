import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardprocessingListComponent } from './cardprocessing-list.component';

describe('CardprocessingListComponent', () => {
  let component: CardprocessingListComponent;
  let fixture: ComponentFixture<CardprocessingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardprocessingListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardprocessingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
