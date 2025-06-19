import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
// import DevExpress from 'devextreme';
import { CardService } from 'src/app/services/card.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { StatusCardReqDto } from 'src/app/shared/models/cardmanage/status.card.req';
import { SelectDto } from 'src/app/shared/models/select.dto';
import { NotificationService } from 'src/app/services/notification.service';
import { auto } from '@popperjs/core';
import { LocalstorageService } from 'src/app/services/localstorage.services ';
import { CONST_LOCAL_STORAGE } from 'src/app/shared/const/const.localstorage';
import { TokenService } from 'src/app/services/token.services';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-give-card-pin-unit',
  templateUrl: './give-card-pin-unit.component.html',
  styleUrl: './give-card-pin-unit.component.scss'
})
export class GiveCardPinUnitComponent {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
    req: StatusCardReqDto = new StatusCardReqDto();
    length = 0;
    dataSource: any = [];
    cardsSelected: any[] = [];
    dataBranchs: SelectDto[] = [];
    dataStatusCard: SelectDto[] = [];
    isPopupVisible: boolean = false;
    card_number = '';
    isDisabled: boolean = true;
    isDisableBranch = true;
    userInfoFromToken: any = {};

  
    columns: Array<dxDataGridColumn | string> = [
    {
      caption: '',
      width: 50,
      fixed: true,
      alignment: 'center',
      headerCellTemplate: (container) => {
        const checkbox = this.renderer.createElement('input');
        this.renderer.setAttribute(checkbox, 'type', 'checkbox');
        this.renderer.setAttribute(checkbox, 'class', 'custom-checkbox');

        checkbox.checked = false;

        // Lắng nghe sự kiện click trên checkbox tổng
        this.renderer.listen(checkbox, 'change', (event) => {
          const checkboxes = document.querySelectorAll('.custom-checkbox');

          checkboxes.forEach((checkbox) => {
            const inputElement = checkbox as HTMLInputElement; 
            const cardId = inputElement.getAttribute('data-card-id'); 

            if (event.target.checked) {
              if (!this.cardsSelected.includes(cardId) && cardId != null) {
                this.cardsSelected.push(cardId);
              }

              inputElement.checked = true;
            } else {
              this.cardsSelected = this.cardsSelected.filter(card_number => card_number !== cardId);
            
              inputElement.checked = false;
            }
          });
        });

        container.append(checkbox);
      },
      cellTemplate: (container, cellInfo) => {
        const checkbox = this.renderer.createElement('input');
        this.renderer.setAttribute(checkbox, 'type', 'checkbox');
        this.renderer.setAttribute(checkbox, 'class', 'custom-checkbox');

        this.renderer.setAttribute(checkbox, 'data-card-id', cellInfo.data.card_number);

        checkbox.checked = this.cardsSelected.includes(cellInfo.data.card_number);

        // Lắng nghe sự kiện click để cập nhật dữ liệu
        this.renderer.listen(checkbox, 'change', (event) => {
            if (event.target.checked) {
              if (!this.cardsSelected.includes(cellInfo.data.card_number) && cellInfo.data.card_number != null) {
                this.cardsSelected.push(cellInfo.data.card_number);
              }
            } else {
                this.cardsSelected = this.cardsSelected.filter(card_number => card_number !== cellInfo.data.card_number);
            }

            console.log('card id đã chọn: ', this.cardsSelected)
        });

        container.append(checkbox);
      }
    }, 
    {
      caption: '',
      fixed: false,
      width: auto,
      alignment: 'center',
      cellTemplate: (container, cellInfo) => {
        const button = this.renderer.createElement('button');
        const img = this.renderer.createElement('img');

        this.renderer.addClass(button, 'btn');
        this.renderer.addClass(button, 'btn-sm');
        this.renderer.addClass(button, 'btn-icon');

        this.renderer.setAttribute(img, 'src', 'assets/images/icon/detail.svg');
        this.renderer.setStyle(img, 'width', '18px');
        this.renderer.setStyle(img, 'height', '18px');

        this.renderer.appendChild(button, img);
        this.renderer.listen(button, 'click', () => {
          this.detail(cellInfo);
        });
        container.append(button);
      },
    },
    {
      dataField: 'batch_create_num',
      caption: 'Số lô',
    }, 
    {
      dataField: 'card_number',
      caption: 'Số thẻ',
    },
    {
      dataField: 'owner_name',
      caption: 'Tên chủ thẻ',
    }, 
    {
      dataField: 'last_date_update',
      caption: 'Ngày cập nhật cuối',
    },
    {
      dataField: 'current_status',
      caption: 'Trạng thái hiện tại',
    }, 
    {
      dataField: 'next_status',
      caption: 'Trạng thái tiếp theo',
    }
  ];

  displayItemSelect = (item: any) => {
    return item ? `${item.value} - ${item.text}` : '';
  };

  constructor(
    private renderer: Renderer2,
    private cardService: CardService,
    private notificationService: NotificationService,
    private localstorageservice: LocalstorageService,
    private tokenService: TokenService,
  ) { 
    this.req.card_status = '1';
  }

  ngOnInit(): void {
    this.userInfoFromToken = this.tokenService.getInfomationFromLocalStorage();

    this.loadFilter();

    this.isDisabled = true;

    const savedDate = this.localstorageservice.getLocalStorage(CONST_LOCAL_STORAGE.CIM_CORE_DATE);
    let currentDate = new Date(savedDate ? savedDate : new Date());
    // Trừ 90 ngày
    let pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 90);
    // Gán vào from_date
    this.req.from_date = pastDate.toISOString().split('T')[0];
    this.req.to_date = currentDate.toISOString().split('T')[0];
  }

  loadFilter() {
    this.cardService.getCardInfoFilter({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataBranchs = [{ value: '', text: 'Tất cả -' }, ...response.dataBranchs];
        this.dataStatusCard = [{ value: '', text: 'Tất cả -' }, ...response.dataStatusCard];

        this.req.branch_code = this.userInfoFromToken.branhcode;
        if (this.req.branch_code == '00000') {
          this.isDisableBranch = false;
        }
      },
      err => {
        console.log(new Date(), err);
      }
    );
  }

  updateCheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('.custom-checkbox');

    checkboxes.forEach((checkbox) => {
        const inputElement = checkbox as HTMLInputElement; 
        const cardId = inputElement.getAttribute('data-card-id'); 

        if (cardId && this.cardsSelected.includes(cardId)) {
            inputElement.checked = true; // Đánh dấu checkbox nếu card_id có trong danh sách đã chọn
        }
        else {
          inputElement.checked = false; 
        }
    });
  }

  loadData(params: any) {
    console.log('request filter: ', params);

    this.cardService.searchStatusCardInfo(params).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.length = response.lstData.totalItems;
        this.dataSource = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  reload() {
    this.req = new StatusCardReqDto();
    this.req.card_status = '1';
    this.dataGridControlComponent.reloadGrid(this.req);
  }

  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }

  updateStatusCard() {
    var req_update: any = {
      lst_card_number: this.cardsSelected
    }

    console.log('req_update: ', req_update)

    this.cardService.updateStatusCard(req_update).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.notificationService.alertSussess(response.resDesc);

        this.loadData(this.req);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

  detail(rowData: any) {
    console.log('rowData: ', rowData);
    this.card_number = rowData.data.card_number;
    this.isPopupVisible = true;
  }
}
