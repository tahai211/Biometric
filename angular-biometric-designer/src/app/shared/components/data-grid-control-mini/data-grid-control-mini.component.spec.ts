import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGridControlMiniComponent } from './data-grid-control-mini.component';

describe('DataGridControlMiniComponent', () => {
  let component: DataGridControlMiniComponent;
  let fixture: ComponentFixture<DataGridControlMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridControlMiniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataGridControlMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
