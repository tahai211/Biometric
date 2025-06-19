import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskListComponent } from './helpdesk-list.component';

describe('HelpdeskListComponent', () => {
  let component: HelpdeskListComponent;
  let fixture: ComponentFixture<HelpdeskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpdeskListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpdeskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
