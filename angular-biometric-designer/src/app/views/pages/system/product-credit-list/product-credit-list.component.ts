import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { ButtonService } from 'src/app/services/button.service';
import { CONST } from 'src/app/shared/const/const';
import { productCreditReq } from 'src/app/shared/models/system/product.credit';
import { auto } from '@popperjs/core';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { CommonService } from 'src/app/services/common.service';
import { SystemService } from 'src/app/services/system.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';

@Component({
  selector: 'app-product-credit-list',
  templateUrl: './product-credit-list.component.html',
  styleUrl: './product-credit-list.component.scss'
})
export class ProductCreditListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  hasCreateButton: boolean = false;
  dataStatus: any[] = CONST.dataRecordStat;
  dataAuthStatus: any[] = CONST.dataAuthStatus;
  isPopupVisible = false;
  isPopupVisibleChangeValue = false;
  id = '';

  productCredit_request: productCreditReq = new productCreditReq();

  length = 0;
  dataSource: any = {};
  columns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'product_code',
      caption: 'Mã sản phẩm',
      width: auto
    },
    {
      dataField: 'description',
      caption: 'Tên sản phẩm',
      width: auto
    },
    {
      dataField: 'record_stat',
      caption: 'Trạng thái',
      width: auto,
      cellTemplate: (container, cellInfo) => {
        container.textContent = this.commonService.getNameById('RECORD_STAT', cellInfo.data.record_stat);
      },
    },
    {
      dataField: 'auth_stat',
      caption: 'Trạng thái duyệt',
      width: auto,
      cellTemplate: (container, cellInfo) => {
        container.textContent = this.commonService.getNameById('AUTH_STATUS', cellInfo.data.auth_stat);
      },
    },
    {
      dataField: 'created_by',
      caption: 'Người tạo',
      width: auto
    }, {
      dataField: 'created_date',
      caption: 'Ngày tạo',
      width: 150
    }, {
      dataField: 'last_modified_by',
      caption: 'Người sửa',
      width: auto
    }, {
      dataField: 'last_modified_date',
      caption: 'Ngày sửa',
      width: 150
    }, {
      dataField: 'approved_by',
      caption: 'Người duyệt',
      width: auto
    }, {
      dataField: 'approved_date',
      caption: 'Ngày duyệt',
      width: 150
    },
    {
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
    }];


  constructor(private buttonService: ButtonService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private renderer: Renderer2,
    public systemService: SystemService,
    public notificationService: NotificationService,
  ) { }
  ngOnInit(): void {
    this.initializeButtons();
  }
  initializeButtons(): void {
    this.buttonService.hasCreateButton$('CREATE').subscribe(result => {
      this.hasCreateButton = result;
      this.breadcrumbService.setButtonPath(
        this.hasCreateButton,
        'TẠO MỚI',
        () => this.create()
      );
    });
  }
  create() {
    this.isPopupVisible = true;
    this.isPopupVisibleChangeValue = false;
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.productCredit_request);
  }
  reload() {
    this.productCredit_request = new productCreditReq();
    this.dataGridControlComponent.reloadGrid(this.productCredit_request);
  }
  loadData(params: any) {
    console.log('request filter 11q: ', params);
    this.systemService.getProductCreditList(params).subscribe(
      (response: any) => {
        console.log(new Date() + "request filter 11q: ", response);
        this.length = response.lstData.totalItems;
        this.dataSource = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  detail(rowData: any) {
    console.log('rowData: ', rowData);
    this.id = rowData.data.id_trans;
    this.isPopupVisible = true;
    this.isPopupVisibleChangeValue = false;
  }
  hidePopup() {
    this.isPopupVisible = false;
    if (this.isPopupVisibleChangeValue)
      this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
  handleAfterLoadListPage() {

    console.log('handleAfterLoadListPage: ',);
    this.isPopupVisibleChangeValue = true;

  }

}
