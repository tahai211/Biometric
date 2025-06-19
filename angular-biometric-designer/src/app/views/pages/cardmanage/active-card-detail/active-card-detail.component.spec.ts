import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCardDetailComponent } from './active-card-detail.component';

describe('ActiveCardDetailComponent', () => {
  let component: ActiveCardDetailComponent;
  let fixture: ComponentFixture<ActiveCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveCardDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
