import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, TemplateRef, NgModule } from '@angular/core';
import { CustomHeaderTitleModule } from '../custom-header-title/custom-header-title.component';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrl: './custom-popup.component.scss'
})
export class CustomPopupComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() width = '80vw';
  @Input() height = '90vh';

  @Input() title = '';
  @Input() footerTemplate?: TemplateRef<any>;

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

}
@NgModule({
  declarations: [CustomPopupComponent],
  imports: [CommonModule,CustomHeaderTitleModule ],
  exports: [CustomPopupComponent]
})
export class CustomPopupModule {}
