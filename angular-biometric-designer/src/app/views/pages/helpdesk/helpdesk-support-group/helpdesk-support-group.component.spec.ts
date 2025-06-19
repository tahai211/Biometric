import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskSupportGroupComponent } from './helpdesk-support-group.component';

describe('HelpdeskSupportGroupComponent', () => {
  let component: HelpdeskSupportGroupComponent;
  let fixture: ComponentFixture<HelpdeskSupportGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpdeskSupportGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpdeskSupportGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
