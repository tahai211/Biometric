import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { DxDateBoxComponent, DxDateBoxModule } from 'devextreme-angular';
import { DateType } from 'devextreme/ui/date_box';
import {

  forwardRef

} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-date-box-form',
  templateUrl: './custom-date-box-form.component.html',
  styleUrls: ['./custom-date-box-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateBoxFormComponent),
      multi: true
    }
  ]
})
export class CustomDateBoxFormComponent implements ControlValueAccessor {
  @ViewChild('dateBoxRef') dateBoxRef!: DxDateBoxComponent;

  @Input() type: DateType = 'date';
  @Input() displayFormat: string = 'dd/MM/yyyy';
  @Input() dateSerializationFormat: string = 'yyyy-MM-dd';
  @Input() showClearButton: boolean = true;
  @Input() inputAttr: any;
  @Input() disabled: boolean = false;

  @Output() onEnterKey = new EventEmitter<any>();

  value: any;

  onChange = (value: any) => {};
  onTouched = () => {};

  onValueChanged(e: any) {
    this.value = e.value;
    this.onChange(e.value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  openCalendar() {
    this.dateBoxRef?.instance?.open();
  }

  handleEnterKey(e: any) {
    this.onEnterKey.emit(e);
  }
}


@NgModule({
  declarations: [CustomDateBoxFormComponent],
  imports: [CommonModule, DxDateBoxModule],
  exports: [CustomDateBoxFormComponent]
})
export class CustomDateBoxFormModule {}