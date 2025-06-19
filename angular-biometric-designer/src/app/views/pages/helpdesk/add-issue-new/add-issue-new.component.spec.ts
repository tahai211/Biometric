import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueNewComponent } from './add-issue-new.component';

describe('AddIssueNewComponent', () => {
  let component: AddIssueNewComponent;
  let fixture: ComponentFixture<AddIssueNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIssueNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddIssueNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
