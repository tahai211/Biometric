import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CustomButtonModule } from '../custom-button/custom-button.component';
import { CustomHeaderTitleModule } from '../custom-header-title/custom-header-title.component';

@Component({
  selector: 'app-custom-confirm-notify',
  templateUrl: './custom-confirm-notify.component.html',
  styleUrl: './custom-confirm-notify.component.scss'
})
export class CustomConfirmNotifyComponent {
  @Input() title: string = '';
  @Input() visible: boolean = true;
  @Output() onConfirm = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}

@NgModule({
  declarations: [CustomConfirmNotifyComponent],
  imports: [CommonModule, CustomButtonModule, CustomHeaderTitleModule],
  exports: [CustomConfirmNotifyComponent]
})
export class CustomConfirmNotifyModule {}