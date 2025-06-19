import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { DxTextAreaComponent, DxTextAreaModule } from 'devextreme-angular';

@Component({
  selector: 'app-custom-text-area',
  templateUrl: './custom-text-area.component.html',
  styleUrl: './custom-text-area.component.scss'
})
export class CustomTextAreaComponent {
  @ViewChild('textAreaRef') textAreaRef!: DxTextAreaComponent;

  @Input() value: any;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<any>();

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
  declarations: [CustomTextAreaComponent],
  imports: [CommonModule, DxTextAreaModule],
  exports: [CustomTextAreaComponent]
})
export class CustomTextAreaModule {}
