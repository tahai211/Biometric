import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardreleasebatchComponent } from './cardreleasebatch.component';

describe('CardreleasebatchComponent', () => {
  let component: CardreleasebatchComponent;
  let fixture: ComponentFixture<CardreleasebatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardreleasebatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardreleasebatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
