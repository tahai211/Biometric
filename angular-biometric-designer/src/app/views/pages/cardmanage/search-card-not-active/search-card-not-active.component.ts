import { Component, Renderer2, ViewChild } from '@angular/core';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenService } from 'src/app/services/token.services';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { StatusCardReqDto } from 'src/app/shared/models/cardmanage/status.card.req';
import { SelectDto } from 'src/app/shared/models/select.dto';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-search-card-not-active',
  templateUrl: './search-card-not-active.component.html',
  styleUrl: './search-card-not-active.component.scss'
})
export class SearchCardNotActiveComponent {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: StatusCardReqDto = new StatusCardReqDto();
  length = 0;
  dataSource: any = {};
  cardsSelected: any[] = [];
  dataBranchs: SelectDto[] = [];
  isPageLoaded: boolean = false;
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
              console.log('card id đã chọn: ', this.cardsSelected)
              inputElement.checked = true;
            } else {
              this.cardsSelected = this.cardsSelected.filter(card_number => card_number !== cardId);
              console.log('card id đã xóa: ', this.cardsSelected)
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
              console.log('card id đã chọn: ', this.cardsSelected)
            } else {
                this.cardsSelected = this.cardsSelected.filter(card_number => card_number !== cellInfo.data.card_number);
                console.log('card id đã xóa: ', this.cardsSelected)
              }
        });

        container.append(checkbox);
      }
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
      dataField: 'legal_id',
      caption: 'CCCD',
    },
    {
      dataField: 'client_code',
      caption: 'Mã KH',
    }, 
    {
      dataField: 'date_create',
      caption: 'Ngày tạo',
    },
    {
      dataField: 'status_active',
      caption: 'Trạng thái thẻ',
    }
  ];

  ngOnInit(): void {
    this.userInfoFromToken = this.tokenService.getInfomationFromLocalStorage()

    this.loadFilter();

    this.checkLoadPage();
  }

  constructor(
      private renderer: Renderer2,
      private cardService: CardService,
      private notificationService: NotificationService,
      private tokenService: TokenService,
    ) {
      this.req.card_status = "4";
      this.req.from_date = "";
      this.req.to_date = "";
     }

  displayItemSelect = (item: any) => {
    return item ? `${item.value} - ${item.text}` : '';
  };

  loadData(params: any) {
    if (this.isPageLoaded == false) {
      this.length = 0;
      this.dataSource = [];

      return;
    }

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

  checkLoadPage() {
    this.isPageLoaded = false;
    setTimeout(() => {
      this.isPageLoaded = true; 
    }, 500);
  }

  loadFilter() {
    this.cardService.getCardInfoFilter({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataBranchs = [{ value: '', text: 'Tất cả -' }, ...response.dataBranchs];

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

  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }

  reload() {
    this.checkLoadPage();

    this.req = new StatusCardReqDto();
    this.req.card_status = "4";
    this.req.from_date = "";
    this.req.to_date = "";
    this.dataGridControlComponent.reloadGrid(this.req);
  }

  activeCard() {
    var req: any = {
      lst_card_number: this.cardsSelected
    }
    console.log('req_active_card: ', req)

    this.cardService.activeCard(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.notificationService.alertSussess(response.resDesc);

        this.cardsSelected = [];
        this.dataGridControlComponent.searchGrid(this.req);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
}

