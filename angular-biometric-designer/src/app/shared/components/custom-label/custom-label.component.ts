import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-custom-label',
  templateUrl: './custom-label.component.html',
  styleUrl: './custom-label.component.scss'
})
export class CustomLabelComponent {
  @Input() text: string = '';
  @Input() important: boolean = false;
}

@NgModule({
  declarations: [CustomLabelComponent],
  imports: [CommonModule],
  exports: [CustomLabelComponent]
})
export class CustomLabelModule {}