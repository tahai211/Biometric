import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CardReNewReqDto } from 'src/app/shared/models/svcard/cardrenew.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-cardrenewextend-list',
  templateUrl: './cardrenewextend-list.component.html',
  styleUrl: './cardrenewextend-list.component.scss'
})
export class CardrenewExtendListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  
  req: CardReNewReqDto = new CardReNewReqDto();
  id = '';
  isPopupVisible: boolean = false;
  length = 0;
  dataSource: any = {};
  hasCreateButton: boolean = false;
  selectedCardType: string = 'debit';
  dataCardType: any = [
    { text: 'Thẻ Debit', value: 'debit' },
    { text: 'Thẻ Credit', value: 'credit' }
  ];

  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'reference_no',
    caption: 'Mã giao dịch',
    width: 150
  }, {
    dataField: 'cust_no',
    caption: 'Mã khách hàng',
    width: 200
  }, {
    dataField: 'cust_name',
    caption: 'Tên khách hàng',
    width: 300
  }, {
    dataField: 'service_name',
    caption: 'Dịch vụ',
    width: 250,
  }, {
    dataField: 'auth_stat',
    caption: 'Trạng thái duyệt',
    width: 'auto',
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('AUTH_STATUS', cellInfo.data.auth_stat);
    },
  }, {
    dataField: 'created_by',
    caption: 'Người tạo',
    width: 'auto'
  }, {
    dataField: 'created_date',
    caption: 'Ngày tạo',
    width: 150
  }, {
    dataField: 'approved_by',
    caption: 'Người duyệt',
    width: 'auto'
  }, {
    dataField: 'approved_date',
    caption: 'Ngày duyệt',
    width: 150
  }, {
    fixed: true,
    width: 'auto',
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

  constructor(
    public svcardService: svCardService,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private buttonService: ButtonService,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.initializeButtons();

    const savedDate = localStorage.getItem('core_date');
    let currentDate = new Date(savedDate ? JSON.parse(savedDate) : new Date());

    let pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 90);

    this.req.from_date = pastDate.toISOString().split('T')[0];
    this.req.to_date = currentDate.toISOString().split('T')[0];
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
    this.router.navigate(['/svcard/cardrenewextend-detail']);
  }

  loadData(params: any) {
    console.log('request filter: ', params);
    const apiCall = this.selectedCardType == 'debit'
      ? this.svcardService.getCardReNewExtendList(params)
      : this.svcardService.getCardCreditReNewExtendList(params);

    apiCall.subscribe(
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

  detail(rowData: any) {
    this.router.navigate(['/svcard/cardrenewextend-detail'], { queryParams: { id: rowData.data.id, type: this.selectedCardType } });
    //this.router.navigate([`${'/svcard/cardrenewextend-detail'.split('?')[0]}`], { queryParams: { id: rowData.data.id } });
  }

  reload() {
    this.req = new CardReNewReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }

  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }

  // create() {
  //     this.router.navigate(['/svcard/cardrenewextend-detail']);
  // }

  hidePopup() {
    this.isPopupVisible = false;
    this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
}
