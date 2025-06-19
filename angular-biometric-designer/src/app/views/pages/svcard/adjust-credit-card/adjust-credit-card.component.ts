import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnCellTemplateData, dxDataGridColumn } from 'devextreme/ui/data_grid';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonGridComponent } from 'src/app/shared/components/screen-button-grid/screen-button-grid.component';
import { ButtonByScreenDto } from 'src/app/shared/models/button/button.dto';
import { AdjustCreditCardReqDto } from 'src/app/shared/models/svcard/adjustcredit.card.req';

@Component({
  selector: 'app-adjust-credit-card',
  templateUrl: './adjust-credit-card.component.html',
  styleUrl: './adjust-credit-card.component.scss'
})
export class AdjustCreditCardComponent {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: AdjustCreditCardReqDto = new AdjustCreditCardReqDto();
  length = 0;
  dataSource: any = {};
  dataProducts: any = {};

  buttonCustom: ButtonByScreenDto[] = [
    { buttonCode: 'VIEW', buttonName: 'CHỌN', disable: false, visibility: true },
  ];

  columns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'loan_account',
      caption: 'Tài khoản vay',
      width: '*'
    },
    {
      dataField: 'payment_account',
      caption: 'Tài khoản thanh toán',
      width: '*'
    },
    {
      dataField: 'cust_no',
      caption: 'Mã khách hàng',
      width: '*'
    },
    {
      dataField: 'cust_name',
      caption: 'Tên khách hàng',
      width: '*'
    },
    {
      dataField: 'unique_id_value',
      caption: 'Số GTTT',
      width: '*'
    },
    {
      dataField: 'birth_day',
      caption: 'Ngày sinh',
      width: '*'
    },
    {
      dataField: 'card_no',
      caption: 'Số thẻ',
      width: '*'
    },
    {
      dataField: 'name_print_on_card',
      caption: 'Tên in trên thẻ',
      width: '*'
    },
    {
      dataField: 'card_type',
      caption: 'Loại thẻ',
      width: '*',
      cellTemplate: (container, cellInfo) => {
        container.textContent = this.commonService.getNameById('CARD_TYPE', cellInfo.data.card_type);
      },
    },
    {
      dataField: 'product_code',
      caption: 'Sản phẩm',
      width: '*',
      cellTemplate: (container, cellInfo) => {
        const status = this.dataProducts.find((o: any) => o.value === cellInfo.data.product_code);
        container.textContent = status ? status.text : cellInfo.data.product_code;
      },
    },
    {
      fixed: true,
      width: 120,
      alignment: 'center',
      cellTemplate: (container, cellInfo) => {
        var buttonCell: ButtonByScreenDto[] = [];

        const factory = this.resolver.resolveComponentFactory(ScreenButtonGridComponent);
        const componentRef = this.viewContainerRef.createComponent(factory);

        componentRef.instance.buttonCustom = this.buttonCustom;

        componentRef.instance.onItemClick.subscribe((clickedValue: string) => {
          console.log('Item clicked:', clickedValue);
          this.onClick(clickedValue, cellInfo);
        });
        container.appendChild(componentRef.location.nativeElement);
      },
    },
  ]

  constructor(
    public notificationService: NotificationService,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    public svcardService: svCardService,
    public commonService: CommonService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.svcardService.getAdjustCreditCardFilter({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataProducts = response.dataProducts;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }

  loadData(params: any) {
    console.log('request filter: ', params);
    this.svcardService.getListCreditCardChangeInfo(params).subscribe(
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

  reload() {}

  onClick(event: any, cellInfo: any) {
    this.router.navigate(['/svcard/adjust-credit-card-detail'], { queryParams: { card_no: cellInfo.data.card_no, auth_status: '' } });
  }
}
