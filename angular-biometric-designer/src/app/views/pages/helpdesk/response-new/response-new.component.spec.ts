import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseNewComponent } from './response-new.component';

describe('ResponseNewComponent', () => {
  let component: ResponseNewComponent;
  let fixture: ComponentFixture<ResponseNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
