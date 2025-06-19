import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportparamListComponent } from './reportparam-list.component';

describe('ReportparamListComponent', () => {
  let component: ReportparamListComponent;
  let fixture: ComponentFixture<ReportparamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportparamListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportparamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
