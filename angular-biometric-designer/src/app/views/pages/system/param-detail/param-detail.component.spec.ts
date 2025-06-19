import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamDetailComponent } from './param-detail.component';

describe('ParamDetailComponent', () => {
  let component: ParamDetailComponent;
  let fixture: ComponentFixture<ParamDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
