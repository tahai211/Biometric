import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCardComponent } from './active-card.component';

describe('ActiveCardComponent', () => {
  let component: ActiveCardComponent;
  let fixture: ComponentFixture<ActiveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
