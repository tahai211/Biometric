import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateQrBatchComponent } from './generate-qr-batch.component';

describe('GenerateQrBatchComponent', () => {
  let component: GenerateQrBatchComponent;
  let fixture: ComponentFixture<GenerateQrBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateQrBatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateQrBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
