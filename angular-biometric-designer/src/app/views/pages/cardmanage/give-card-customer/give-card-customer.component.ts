import { Component, Renderer2, ViewChild } from '@angular/core';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CardUserInfoReqDto } from 'src/app/shared/models/cardmanage/card.user.info.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-give-card-customer',
  templateUrl: './give-card-customer.component.html',
  styleUrl: './give-card-customer.component.scss'
})
export class GiveCardCustomerComponent {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: CardUserInfoReqDto = new CardUserInfoReqDto();
  length = 0;
  dataSource: any = [];
  name_user_confirm = '';
  cardsSelected: any[] = [];
  isPageLoaded: boolean = false;
  isPopupVisible: boolean = false;
  data_card_customer: any = {};
  lstUserForAuth: any = [];
  hasCreateButton: boolean = false;

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
    }
    // ,
    // {
    //   caption: '',
    //   fixed: true,
    //   width: auto,
    //   alignment: 'center',
    //   cellTemplate: (container, cellInfo) => {
    //     const button = this.renderer.createElement('button');
    //     const icon = this.renderer.createElement('i');
  
    //     this.renderer.addClass(button, 'btn');
    //     this.renderer.addClass(button, 'btn-sm');
    //     this.renderer.addClass(button, 'btn-icon');
    //     this.renderer.addClass(icon, 'fa-solid');
    //     this.renderer.addClass(icon, 'fa-list');
  
    //     this.renderer.appendChild(button, icon);
    //     this.renderer.listen(button, 'click', () => {
    //       this.detail(cellInfo);
    //     });
    //     container.append(button);
    //   },
    // }
  ]

  ngOnInit() {
    this.req.card_status = "3";

    this.checkLoadPage();

    this.getUserForAuth();
    this.initializeButtons();
  }
  initializeButtons(): void {
    this.buttonService.hasCreateButton$('GIVE').subscribe(result => {
      this.hasCreateButton = result;
    });    
  }

  constructor(
     private renderer: Renderer2,
     private cardService: CardService,
     private buttonService: ButtonService,
     private notificationService: NotificationService
  ) {
    this.req.card_status = "3";
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
    this.req.card_status = "3";
    this.dataGridControlComponent.reloadGrid(this.req);
  }

  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }

  // hidePopup() {
  //   this.isPopupVisible = false;
  // }

  // detail(rowData: any) {
  //   console.log('rowData: ', rowData);
  //   this.data_card_customer = rowData.data;
  //   this.isPopupVisible = true;
  // }

  getUserForAuth() {
    this.cardService.getUserForAuth({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.lstUserForAuth = response.lstData;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);

        this.lstUserForAuth = [];
      }
    );
  }
  // {
  //   var req: any = {
  //     card_number: this.data_card_customer.card_number,
  //     user_confirm: this.name_user_confirm
  //   }
  //   console.log('req_handover: ', req)

  //   this.cardService.handOverCard(req).subscribe(
  //     (response: any) => {
  //       console.log(new Date() + ": ", response);

  //       this.notificationService.alertSussess(response.resDesc);

  //       this.isButtonVisible = false;
  //     },
  //     err => {
  //       console.log(new Date(), err);
  //       this.notificationService.alertError(err.error);
  //     }
  //   );
  // }
  updateStatusCard(){
    var req_update: any = {
      lst_card_number: this.cardsSelected,
      user_confirm: this.name_user_confirm
    }

    console.log('req_update: ', req_update)

    this.cardService.handOverCard(req_update).subscribe(
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
}
