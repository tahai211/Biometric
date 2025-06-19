import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHeaderTitleComponent } from './custom-header-title.component';

describe('CustomHeaderTitleComponent', () => {
  let component: CustomHeaderTitleComponent;
  let fixture: ComponentFixture<CustomHeaderTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomHeaderTitleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomHeaderTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
