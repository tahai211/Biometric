import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { DxDropDownBoxComponent, DxDropDownBoxModule, DxDataGridModule } from 'devextreme-angular';

@Component({
  selector: 'app-custom-dropdown-box',
  templateUrl: './custom-dropdown-box.component.html',
  styleUrls: ['./custom-dropdown-box.component.scss']
})
export class CustomDropdownBoxComponent {
  @ViewChild('dropdownBoxRef') dropdownBoxRef!: DxDropDownBoxComponent;

  @Input() items: any[] = [];
  @Input() value: any;
  @Input() valueExpr: string = 'value';
  @Input() displayExpr: string = 'text';
  @Input() placeholder: string = 'Chọn';
  @Input() disabled: boolean = false;
  @Input() showClearButton: boolean = true;
  @Input() showDropDownButton: boolean = true;
  @Input() inputAttr: any = { 'aria-label': 'Dropdown' };
  @Input() id: string = '';
  @Input() class: string = '';
  @Input() columns: any[] = [];
  @Input() selectionMode: 'single' | 'multiple' = 'single';
  @Input() displaySeparator: string = ', ';

  @Output() valueChange = new EventEmitter<any>();
  @Output() onEnterKey = new EventEmitter<any>();

  onValueChanged(e: any) {
    this.value = e.value;
    this.valueChange.emit(e.value);
  }

  enterKey(e: any) {
    this.onEnterKey.emit(e);
  }

  onSelectionChanged(e: any) {
    if (this.selectionMode === 'single') {
      // Single selection mode
      const selectedItem = e.selectedRowsData[0];
      if (selectedItem) {
        this.value = selectedItem[this.valueExpr];
        this.valueChange.emit(this.value);
        
        // Cập nhật giá trị hiển thị cho dropdown box
        this.dropdownBoxRef.instance.option('value', selectedItem[this.valueExpr]);
        this.dropdownBoxRef.instance.close(); // đóng popup khi chọn
      }
    } else {
      // Multiple selection mode
      const selectedItems = e.selectedRowsData;
      if (selectedItems && selectedItems.length > 0) {
        this.value = selectedItems.map((item: any) => item[this.valueExpr]);
        this.valueChange.emit(this.value);
        
        // Tạo display text cho multiple selection
        const displayTexts = selectedItems.map((item: any) => item[this.displayExpr]);
        const displayText = displayTexts.join(this.displaySeparator);
        
        // Cập nhật giá trị hiển thị cho dropdown box
        this.dropdownBoxRef.instance.option('value', this.value);
        this.dropdownBoxRef.instance.option('text', displayText);
        
        // Không đóng popup cho multiple selection để cho phép chọn nhiều
        // this.dropdownBoxRef.instance.close();
      } else {
        // Không có item nào được chọn
        this.value = [];
        this.valueChange.emit(this.value);
        this.dropdownBoxRef.instance.option('value', []);
        this.dropdownBoxRef.instance.option('text', '');
      }
    }
  }

  // Method để lấy display text cho giá trị hiện tại
  getDisplayText(): string {
    if (!this.value || !this.items || this.items.length === 0) {
      return '';
    }

    if (this.selectionMode === 'single') {
      const item = this.items.find(x => x[this.valueExpr] === this.value);
      return item ? item[this.displayExpr] : '';
    } else {
      if (Array.isArray(this.value)) {
        const selectedItems = this.items.filter(item => 
          this.value.includes(item[this.valueExpr])
        );
        return selectedItems.map(item => item[this.displayExpr]).join(this.displaySeparator);
      }
      return '';
    }
  }

  // Method để lấy selected row keys cho data grid
  getSelectedRowKeys(): any[] {
    if (this.selectionMode === 'multiple') {
      return Array.isArray(this.value) ? this.value : [];
    } else {
      return this.value ? [this.value] : [];
    }
  }
}
@NgModule({
  declarations: [CustomDropdownBoxComponent],
  imports: [
    CommonModule,
    DxDropDownBoxModule,
    DxDataGridModule
  ],
  exports: [CustomDropdownBoxComponent]
})
export class CustomDropdownBoxModule {}
