import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { DxNumberBoxComponent, DxNumberBoxModule, DxTextBoxComponent, DxTextBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-custom-text-box',
  templateUrl: './custom-text-box.component.html',
  styleUrl: './custom-text-box.component.scss'
})
export class CustomTextBoxComponent {
  @ViewChild('textBoxRef') textBoxRef!: DxTextBoxComponent;
  @ViewChild('numberBoxRef') numberBoxRef!: DxNumberBoxComponent;

  @Input() id: string = '';
  @Input() icon: string = '';
  @Input() placeholder: string = '';
  @Input() value: any;
  @Input() type: 'text' | 'email' | 'password' | 'search' | 'tel' = 'text';
  @Input() disabled: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() isNumberBox: boolean = false; // Mặc định là text box
  @Output() valueChange = new EventEmitter<any>();
  @Input() inputAttr: any;
  @Output() onEnterKey = new EventEmitter<any>();

  onValueChanged(e: any) {
    this.value = e.value;
    
    this.valueChange.emit(e.value);
  }

  onEnter(e: any) {
    this.onEnterKey.emit();
  }
}

@NgModule({
  declarations: [CustomTextBoxComponent],
  imports: [CommonModule, DxTextBoxModule, DxNumberBoxModule],
  exports: [CustomTextBoxComponent]
})
export class CustomTextBoxModule {}
