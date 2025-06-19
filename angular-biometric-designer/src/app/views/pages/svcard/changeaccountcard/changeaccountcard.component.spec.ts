import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeaccountcardComponent } from './changeaccountcard.component';

describe('ChangeaccountcardComponent', () => {
  let component: ChangeaccountcardComponent;
  let fixture: ComponentFixture<ChangeaccountcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeaccountcardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeaccountcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
