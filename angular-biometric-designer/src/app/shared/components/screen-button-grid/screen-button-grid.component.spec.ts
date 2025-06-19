import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenButtonGridComponent } from './screen-button-grid.component';

describe('ScreenButtonGridComponent', () => {
  let component: ScreenButtonGridComponent;
  let fixture: ComponentFixture<ScreenButtonGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenButtonGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScreenButtonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
