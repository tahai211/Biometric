import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGridControlComponent } from './data-grid-control.component';

describe('DataGridControlComponent', () => {
  let component: DataGridControlComponent;
  let fixture: ComponentFixture<DataGridControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataGridControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGridControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
