import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardrenewExtendDetailComponent } from './cardrenewextend-detail.component';

describe('CardrenewExtendDetailComponent', () => {
  let component: CardrenewExtendDetailComponent;
  let fixture: ComponentFixture<CardrenewExtendDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardrenewExtendDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardrenewExtendDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
