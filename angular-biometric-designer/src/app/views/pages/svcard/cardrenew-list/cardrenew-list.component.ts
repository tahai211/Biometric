import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import { SelectDto } from 'src/app/shared/models/select.dto';
import { CardReNewReqDto } from 'src/app/shared/models/svcard/cardrenew.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-cardrenew-list',
  templateUrl: './cardrenew-list.component.html',
  styleUrl: './cardrenew-list.component.scss'
})
export class CardrenewListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: CardReNewReqDto = new CardReNewReqDto();
  id = '';
  isPopupVisible: boolean = false;
  hasCreateButton: boolean = false;
  length = 0;
  dataSource: any = {};
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
    width: auto,
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('AUTH_STATUS', cellInfo.data.auth_stat);
    },
  }, {
    dataField: 'created_by',
    caption: 'Người tạo',
    width: auto
  }, {
    dataField: 'created_date',
    caption: 'Ngày tạo',
    width: 150
  }, {
    dataField: 'approved_by',
    caption: 'Người duyệt',
    width: auto
  }, {
    dataField: 'approved_date',
    caption: 'Ngày duyệt',
    width: 150
  }, {
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

  constructor(
    public svcardService: svCardService,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private buttonService: ButtonService,
    private breadcrumbService: BreadcrumbService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.initializeButtons();
    const savedDate = localStorage.getItem('core_date');
    //if (savedDate) {
    let currentDate = new Date(savedDate ? JSON.parse(savedDate) : new Date());
    //}

    // Trừ 90 ngày
    let pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 90);

    // Gán vào from_date
    this.req.from_date = pastDate.toLocaleDateString('en-CA');
    this.req.to_date = currentDate.toLocaleDateString('en-CA');

    // window.onbeforeunload = () => {
    //   localStorage.removeItem('searchData');
    // };

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
  loadData(params: any) {
    console.log('request filter: ', params);
    const apiCall = this.selectedCardType == 'debit'
      ? this.svcardService.getCardReNewList(params)
      : this.svcardService.getCardCreditReNewList(params);

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
    // console.log('rowData: ', rowData);
    // this.id = rowData.data.id_trans;
    // this.isPopupVisible = true;
    this.router.navigate(['/svcard/cardrenew-detail'], { queryParams: { id: rowData.data.id, type: this.selectedCardType } });
    //this.router.navigate([`${'/svcard/cardrenew-detail'.split('?')[0]}`], { queryParams: { id: rowData.data.id + '@credit' } });
  }
  reload() {
    this.req = new CardReNewReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  create() {
    // this.id = '';
    // this.isPopupVisible = true;
    this.router.navigate([`${'/svcard/cardrenew-detail'}`]);
  }
  hidePopup() {
    this.isPopupVisible = false;
    this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
}
