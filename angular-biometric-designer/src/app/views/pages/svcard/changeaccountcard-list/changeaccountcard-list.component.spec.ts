import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeaccountcardListComponent } from './changeaccountcard-list.component';

describe('ChangeaccountcardListComponent', () => {
  let component: ChangeaccountcardListComponent;
  let fixture: ComponentFixture<ChangeaccountcardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeaccountcardListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeaccountcardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
