import { Component, Renderer2, ViewChild } from '@angular/core';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CardUserInfoReqDto } from 'src/app/shared/models/cardmanage/card.user.info.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';

@Component({
  selector: 'app-active-card',
  templateUrl: './active-card.component.html',
  styleUrl: './active-card.component.scss'
})
export class ActiveCardComponent {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: CardUserInfoReqDto = new CardUserInfoReqDto();
  isPageLoaded: boolean = false;
  length = 0;
  dataSource: any = [];
  isPopupVisible: boolean = false;
  data_card_customer: any = {};
  
  columns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'card_number',
      caption: 'Số thẻ',
    },
    {
      dataField: 'user_name',
      caption: 'Họ tên',
    },
    {
      dataField: 'legad_id',
      caption: 'Số CCCD',
    },
    {
      dataField: 'birth_date',
      caption: 'Ngày sinh',
    },
    {
      dataField: 'client_code',
      caption: 'Mã khách hàng',
    },
    {
      dataField: 'type_card',
      caption: 'Thẻ chính/phụ',
    },
    {
      dataField: 'status_active',
      caption: 'Kích hoạt thẻ',
    },
    {
      dataField: 'date_active',
      caption: 'Ngày kích hoạt',
    },
    {
      caption: '',
      fixed: true,
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
    }
  ]

  constructor(
      private renderer: Renderer2,
      private cardService: CardService,
      private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.req.card_status = "4";

    this.checkLoadPage();
  }

  loadData(params: any) {
    if (this.isPageLoaded == false) {
      this.length = 0;
      this.dataSource = [];

      return;
    }

    console.log('request filter: ', params);

    this.cardService.getInfoCardUser(params).subscribe(
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

  reload() {
    this.checkLoadPage();

    this.req = new CardUserInfoReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }

  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

  detail(rowData: any) {
    console.log('rowData: ', rowData);
    this.data_card_customer = rowData.data;
    this.isPopupVisible = true;
  }
}
