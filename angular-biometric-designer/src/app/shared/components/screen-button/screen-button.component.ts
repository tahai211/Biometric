import { Component, EventEmitter, Input, NgModule, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ButtonByScreenDto } from '../../models/button/button.dto';
import { CommonModule } from '@angular/common';
import { IdentityService } from 'src/app/services/identity.service';
import { DxButtonModule } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { ButtonService } from 'src/app/services/button.service';
import { CustomButtonModule } from '../custom-button/custom-button.component';

@Component({
  selector: 'app-screen-button',
  templateUrl: './screen-button.component.html',
  styleUrls: ['./screen-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScreenButtonComponent implements OnInit, OnDestroy {
  @Input() width = 'auto';
  @Output() onItemClick = new EventEmitter<any>();
  _buttons: ButtonByScreenDto[] = [];

  leftButtons: ButtonByScreenDto[] = [];
  centerButtons: ButtonByScreenDto[] = [];
  rightButtons: ButtonByScreenDto[] = [];

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
              this.buttonService.dataButtonPage.asObservable().subscribe(
                (dataPage: any) => {
                  this._buttons = [];
                  let dataButtonPageValue = this.buttonService.dataButtonPage.getValue();
                  let backButton = dataButtonPageValue.find((btn: any) => btn.buttonCode === "BACK" && btn.visibility === true);
                  let refreshButton = dataButtonPageValue.find((btn: any) => btn.buttonCode === "REFRESH" && btn.visibility === true);
                  dataBtn.forEach((o: any) => {
                    if (dataPage != null && dataPage.length > 0) {
                      var item: ButtonByScreenDto = new ButtonByScreenDto();
                      item.buttonName = o.buttonName;
                      var _arrBtn = o.buttonCode.split('.');
                      var _filterButton = dataPage.filter((i: ButtonByScreenDto) =>
                        _arrBtn[_arrBtn.length - 1].toUpperCase() === i.buttonCode.toUpperCase()
                        && i.visibility === true);
                      if (_filterButton.length > 0) {
                        item.buttonCode = _filterButton[0].buttonCode;
                        if (_filterButton[0].buttonName !== null && _filterButton[0].buttonName !== '')
                          item.buttonName = _filterButton[0].buttonName;
                        item.disable = _filterButton[0].disable;
                        item.position = _filterButton[0].position || 'right'; // Mặc định là 'right' nếu không có vị trí
                        this._buttons.push(item);
                      }
                    }
                  })
                  if (refreshButton) {
                    let refreshItem: ButtonByScreenDto = new ButtonByScreenDto();
                    refreshItem.buttonCode = "REFRESH";
                    refreshItem.buttonName = "Làm mới";
                    refreshItem.disable = refreshButton.disable;
                    refreshItem.position = refreshButton.position || 'right';
                    refreshItem.visibility = refreshButton.visibility;
                    this._buttons.push(refreshItem);
                  }

                  if (backButton) {
                    let backItem: ButtonByScreenDto = new ButtonByScreenDto();
                    backItem.buttonCode = "BACK";
                    backItem.buttonName = "Quay lại";
                    backItem.disable = backButton.disable;
                    backItem.position = backButton.position || 'right';
                    backItem.visibility = backButton.visibility;
                    this._buttons.push(backItem);
                  }
                  
                  const priority = ['BACK', 'REFRESH', 'CANCEL', 'REJECT', 'UPDATE', 'AUTH', 'CREATE'];

                  this._buttons.sort((a, b) => {
                    const aIndex = priority.indexOf(a.buttonCode);
                    const bIndex = priority.indexOf(b.buttonCode);

                    // Ưu tiên theo thứ tự trong mảng priority
                    if (aIndex !== -1 && bIndex !== -1) {
                      return aIndex - bIndex;
                    }

                    // Nếu chỉ a có trong priority
                    if (aIndex !== -1) {
                      return -1;
                    }

                    // Nếu chỉ b có trong priority
                    if (bIndex !== -1) {
                      return 1;
                    }

                    // Còn lại giữ nguyên vị trí (hoặc sort theo tên nếu muốn)
                    return 0;
                  });

                  console.log("Danh sách button", this._buttons);

                  this.leftButtons = this._buttons.filter(b => b.position === 'left');
                  this.centerButtons = this._buttons.filter(b => b.position === 'center');
                  this.rightButtons = this._buttons.filter(b => b.position === 'right');
                }
              );
            }
          }
        }
      });
  }
  onClick(event: any) {
    console.log(event);
    this.onItemClick.emit(event);
  }
  back() {
    window.history.back();
  }

  getPosition(item: any): 'left' | 'center' | 'right' {
    return item.position === 'left'
      ? 'left'
      : item.position === 'center'
        ? 'center'
        : 'right'; // mặc định là 'right'
  }

  getIcon(code: string): string {
    return {
      CREATE: 'assets/images/icon/save.svg',
      BACK: 'assets/images/icon/back.svg',
      REFRESH: 'assets/images/icon/refresh.svg',
      CANCEL: 'assets/images/icon/cancel.svg',
    }[code] || '';
  }

  // getType(code: string): string {
  //   return {
  //     CREATE: 'primary',
  //     BACK: 'outline',
  //     REFRESH: 'soft',
  //     CANCEL: 'outline-red',
  //     REJECT: 'soft',
  //     AUTH: 'primary'
  //   }[code] || 'primary';
  // }

  getType(code: string): 'primary' | 'outline' | 'soft' | 'outline-red' {
    switch (code) {
      case 'CREATE':
        return 'primary';
      case 'BACK':
        return 'outline';
      case 'REFRESH':
        return 'soft';
      case 'CANCEL':
        return 'outline-red';
      case 'REJECT':
        return 'soft';
      case 'AUTH':
        return 'primary';
      default:
        return 'primary'; // hoặc chọn giá trị mặc định phù hợp
    }
  }
}

@NgModule({
  declarations: [ScreenButtonComponent],
  exports: [ScreenButtonComponent],
  imports: [CommonModule, DxButtonModule, CustomButtonModule]
})

export class ScreenButtonModule { }
