import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpinnerOverlayService } from 'src/app/services/spinneroverlay.service';

@Component({
  selector: 'app-spinner-overlay',
  templateUrl: './spinner-overlay.component.html',
  styleUrls: ['./spinner-overlay.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SpinnerOverlayComponent {
  constructor(public loader: SpinnerOverlayService) { }

}
