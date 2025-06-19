import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportparamDetailComponent } from './reportparam-detail.component';

describe('ReportparamDetailComponent', () => {
  let component: ReportparamDetailComponent;
  let fixture: ComponentFixture<ReportparamDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportparamDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportparamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
