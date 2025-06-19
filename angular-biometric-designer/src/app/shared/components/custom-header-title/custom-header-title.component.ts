import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-custom-header-title',
  templateUrl: './custom-header-title.component.html',
  styleUrl: './custom-header-title.component.scss'
})
export class CustomHeaderTitleComponent {
  @Input() text: string = '';
  @Input() class = '';
  @Input() important: boolean = false;
  @Input() size: string = '20px';
  @Input() textAlign: string = 'left';
}

@NgModule({
  declarations: [CustomHeaderTitleComponent],
  imports: [CommonModule],
  exports: [CustomHeaderTitleComponent]
})
export class CustomHeaderTitleModule {}
