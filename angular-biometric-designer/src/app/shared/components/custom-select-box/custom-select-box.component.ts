import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { DxSelectBoxComponent, DxSelectBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-custom-select-box',
  templateUrl: './custom-select-box.component.html',
  styleUrl: './custom-select-box.component.scss'
})
export class CustomSelectBoxComponent {
  @ViewChild('selectBoxRef') selectBoxRef!: DxSelectBoxComponent;

  @Input() items: any[] = [];
  @Input() value: any;
  @Input() showClearButton: boolean = true;
  @Input() inputAttr: any;
  @Output() valueChange = new EventEmitter<any>();

  @Input() valueExpr: string = '';
  @Input() displayExpr: any;
  @Input() placeholder: string = 'Chọn';
  @Input() disabled: boolean = false;
  @Input() showDropDownButton: boolean = true;
  @Input() id: string = '';
  @Input() searchEnabled: boolean = false;
  @Input() class = '';

  @Output() onEnterKey = new EventEmitter<any>();
  @Output() onValueChanged = new EventEmitter<any>(); // thêm output này

  // Đổi tên method để tránh trùng tên với Output
  handleInnerValueChanged(e: any) {
    this.value = e.value;
    this.valueChange.emit(e.value);
    this.onValueChanged.emit(e); // emit event object ra ngoài
  }

  enterKey(e: any) {
    this.onEnterKey.emit(e);
  }
}

@NgModule({
  declarations: [CustomSelectBoxComponent],
  imports: [CommonModule, DxSelectBoxModule],
  exports: [CustomSelectBoxComponent]
})
export class CustomSelectBoxModule {}
