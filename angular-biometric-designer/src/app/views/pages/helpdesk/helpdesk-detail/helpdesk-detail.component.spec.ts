import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskDetailComponent } from './helpdesk-detail.component';

describe('HelpdeskDetailComponent', () => {
  let component: HelpdeskDetailComponent;
  let fixture: ComponentFixture<HelpdeskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpdeskDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpdeskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
