import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { DxDateBoxComponent, DxDateBoxModule } from 'devextreme-angular';
import { DateType } from 'devextreme/ui/date_box';

@Component({
  selector: 'app-custom-date-box',
  templateUrl: './custom-date-box.component.html',
  styleUrls: ['./custom-date-box.component.scss']
})

export class CustomDateBoxComponent {
  @ViewChild('dateBoxRef') dateBoxRef!: DxDateBoxComponent;

  @Input() value: any;
  @Input() type: DateType = 'date';
  @Input() displayFormat: string = 'dd/MM/yyyy';
  @Input() dateSerializationFormat: string = 'yyyy-MM-dd';
  @Input() showClearButton: boolean = true;
  @Input() inputAttr: any;
  @Input() disabled: boolean = false;

  // OUTPUT
  @Output() valueChange = new EventEmitter<any>();
  @Output() onEnterKey = new EventEmitter<any>();

  // Bắt sự kiện value thay đổi và phát ra ngoài
  onValueChanged(e: any) {
    this.value = e.value;
    this.valueChange.emit(e.value);
  }

  openCalendar() {
    this.dateBoxRef?.instance?.open();
  }

  handleEnterKey(e: any) {
    this.onEnterKey.emit(e);
  }
}

@NgModule({
  declarations: [CustomDateBoxComponent],
  imports: [CommonModule, DxDateBoxModule],
  exports: [CustomDateBoxComponent]
})
export class CustomDateBoxModule {}