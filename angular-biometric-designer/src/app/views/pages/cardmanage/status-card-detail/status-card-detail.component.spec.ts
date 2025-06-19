import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCardDetailComponent } from './status-card-detail.component';

describe('StatusCardDetailComponent', () => {
  let component: StatusCardDetailComponent;
  let fixture: ComponentFixture<StatusCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCardDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
