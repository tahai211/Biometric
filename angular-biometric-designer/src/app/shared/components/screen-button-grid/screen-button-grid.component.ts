import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnDestroy, OnInit, Output } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { ButtonService } from 'src/app/services/button.service';
import { ButtonCustom, ButtonByScreenDto } from '../../models/button/button.dto';
import { CustomButtonModule } from '../custom-button/custom-button.component';

@Component({
  selector: 'app-screen-button-grid',
  templateUrl: './screen-button-grid.component.html',
  styleUrl: './screen-button-grid.component.scss'
})
export class ScreenButtonGridComponent implements OnInit, OnDestroy {
  @Input() buttonCustom: ButtonByScreenDto[] = [];
  @Input() buttonPage: ButtonByScreenDto[] = [];
  @Output() onItemClick = new EventEmitter<any>();
  _buttons: ButtonByScreenDto[] = [];
  private subscriptionName: Subscription;
  constructor(
    private buttonService: ButtonService
  ) {

  }
  ngOnDestroy(): void {
    if (this.subscriptionName) {
      this.subscriptionName.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.buttonService.dataButton.asObservable().subscribe(
      (data: any) => {
        if (data != null) {
          var dataByPath = data.filter((o: any) => o.screenUrl.split("-", 1)[0] === (this.buttonService.currentpath));
          if (dataByPath != null && dataByPath.length > 0) {
            var dataBtn = dataByPath[0].buttons;
            if (dataBtn != null && dataBtn.length > 0) {
              this._buttons = [];
              dataBtn.forEach((o: any) => {
                if (this.buttonPage != null && this.buttonPage.length > 0) {
                  var item: ButtonByScreenDto = new ButtonByScreenDto();
                  item.buttonName = o.buttonName;
                  var _arrBtn = o.buttonCode.split('.');
                  var _filterButton = this.buttonPage.filter((i: ButtonByScreenDto) =>
                    _arrBtn[_arrBtn.length - 1].toUpperCase() === i.buttonCode.toUpperCase()
                    && i.visibility === true);
                  if (_filterButton.length > 0) {
                    item.buttonCode = _filterButton[0].buttonCode;
                    if (_filterButton[0].buttonName !== null && _filterButton[0].buttonName !== '')
                      item.buttonName = _filterButton[0].buttonName;
                    item.disable = _filterButton[0].disable;
                    this._buttons.push(item);
                  }
                }
              })
            }
          }
        }
      });
  }
  onClick(event: any) {
    console.log(event);
    this.onItemClick.emit(event);
  }
}

@NgModule({
  declarations: [ScreenButtonGridComponent],
  exports: [ScreenButtonGridComponent],
  imports: [CommonModule, DxButtonModule,CustomButtonModule]
})

export class ScreenButtonGridModule { }