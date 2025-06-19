import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent {
  @Input() icon: string = ''; // đường dẫn SVG (assets/icons/xxx.svg)
  @Input() text: string = 'Button';
  @Input() type: 'outline-red' | 'primary' | 'outline' | 'soft' = 'primary' ;
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' | null = 'medium'; // size của button
  @Input() width: string | null = null;  // ví dụ '150px', '100%'
  @Input() height: string | null = null; // ví dụ '40px'
  @Input() iconSize: string = '18px'; // ví dụ: '24px'
  @Input() fontSize: string = '14px'; // ví dụ: '16px'
  sanitizedSvg: any;

  @Output() btnClick = new EventEmitter<void>();
  @Output() onEventClick = new EventEmitter<any>();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.icon) {
      fetch(this.icon)
  .then(res => res.text())
  .then(svg => {
    const cleanedSvg = svg
      .replace(/fill="(?!currentColor).*?"/g, '') // Xoá fill trừ 'currentColor'
      .replace('<svg', `<svg class="icon-svg ${this.type}"`);
    this.sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(cleanedSvg);
  });
    }
  }

  onClick() {
    if (!this.disabled) {
      this.btnClick.emit();
    }
  }

  onClickEvent(e: any) {
    if (!this.disabled) {
      this.onEventClick.emit(e);
    }
  }
}

@NgModule({
  declarations: [CustomButtonComponent],
  imports: [CommonModule],
  exports: [CustomButtonComponent]
})
export class CustomButtonModule {}
