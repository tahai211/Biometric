import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardrenewExtendListComponent } from './cardrenewextend-list.component';

describe('CardrenewwExtendListComponent', () => {
  let component: CardrenewExtendListComponent;
  let fixture: ComponentFixture<CardrenewExtendListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardrenewExtendListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardrenewExtendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
