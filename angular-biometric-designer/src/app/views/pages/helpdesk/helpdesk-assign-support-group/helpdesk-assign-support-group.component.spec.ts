import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskAssignSupportGroupComponent } from './helpdesk-assign-support-group.component';

describe('HelpdeskAssignSupportGroupComponent', () => {
  let component: HelpdeskAssignSupportGroupComponent;
  let fixture: ComponentFixture<HelpdeskAssignSupportGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpdeskAssignSupportGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpdeskAssignSupportGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
