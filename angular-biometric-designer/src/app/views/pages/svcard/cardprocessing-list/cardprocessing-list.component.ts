import { Component, ComponentFactoryResolver, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { SystemService } from 'src/app/services/system.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonGridComponent } from 'src/app/shared/components/screen-button-grid/screen-button-grid.component';
import { ScreenButtonComponent } from 'src/app/shared/components/screen-button/screen-button.component';
import { CONST } from 'src/app/shared/const/const';
import { ButtonByScreenDto, ButtonCustom } from 'src/app/shared/models/button/button.dto';
import { CardProcessingReqDto } from 'src/app/shared/models/svcard/cardprocessing.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-cardprocessing-list',
  templateUrl: './cardprocessing-list.component.html',
  styleUrl: './cardprocessing-list.component.scss'
})
export class CardprocessingListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: CardProcessingReqDto = new CardProcessingReqDto();
  id = '';
  length = 0;
  dataSource: any = {};
  dataAgentCode: any[] = [];
  dataAuthStat: any[] = CONST.dataAuthStatusRlos;
  dataReissuedType: any[] = CONST.dataReissuedType;
  visibleNotify: boolean = false;
  titleNotify: string = '';
  confirmHandler!: () => void;
  cancelHandler() { this.visibleNotify = false; };
  buttonCustom: ButtonByScreenDto[] = [
    { buttonCode: 'VIEW', buttonName: 'TẠO YÊU CẦU', disable: false, visibility: true },
  ];
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'card_id',
    caption: 'Mã hồ sơ RLOS',
    width: 160
  }, {
    dataField: 'ref_id',
    caption: 'Mã giao dịch',
    width: 160
  }, {
    dataField: 'reissued_type',
    caption: 'Diễn giải',
    width: auto,
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('REISSUED_TYPE', cellInfo.data.reissued_type);
    },
  }, {
    dataField: 'agent_code',
    caption: 'Đơn vị thẻ',
    width: 110
  }, {
    dataField: 'customer_no',
    caption: 'Mã CIF',
    width: 110
  }, {
    dataField: 'customer_name',
    caption: 'Tên khách hàng',
    width: 160
  }, {
    dataField: 'unique_id_value',
    caption: 'Số GTTT',
    width: 110
  }, {
    dataField: 'embossed_name',
    caption: 'Tên trên thẻ',
    width: 160
  }, {
    dataField: 'auth_stat',
    caption: 'Trạng thái duyệt',
    width: auto,
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('AUTH_STATUS_RLOS', cellInfo.data.auth_stat);
    },
  }, {
    dataField: 'created_by',
    caption: 'Người tạo',
    width: auto
  }, {
    dataField: 'created_date',
    caption: 'Ngày tạo',
    width: 160
  }, {
    fixed: true,
    width: 280,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      var buttonCell: ButtonByScreenDto[] = [];
      if (cellInfo.data.auth_stat === 'U') {
        buttonCell = this.setButtons(false);
      } else {
        buttonCell = this.setButtons(true);
      }

      const factory = this.resolver.resolveComponentFactory(ScreenButtonGridComponent);
      const componentRef = this.viewContainerRef.createComponent(factory);

      componentRef.instance.buttonPage = buttonCell;
      componentRef.instance.buttonCustom = this.buttonCustom;

      // Thêm class tùy chỉnh

      componentRef.instance.onItemClick.subscribe((clickedValue: string) => {
        console.log('Item clicked:', clickedValue);
        this.onClick(clickedValue, cellInfo);
      });
      container.appendChild(componentRef.location.nativeElement);
    },
  }];

  constructor(
    public svcardService: svCardService,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private router: Router,
    private systemService: SystemService,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private buttonService: ButtonService) {
  }

  ngOnInit(): void {
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
    this.loadArgents();
    this.setButtons(true);
  }
  setButtons(isCancel: boolean) {
    var dataButton: ButtonByScreenDto[] = [
      { buttonCode: 'CANCEL', buttonName: 'HỦY YÊU CẦU', disable: isCancel, visibility: true },
    ];
    return dataButton;
  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.svcardService.getCardProcessingList(params).subscribe(
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
  loadArgents() {
    this.systemService.getBranchList({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataAgentCode = response.branchs;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  onClick(event: any, rowData: any) {
    if (event === 'VIEW') {
      this.detail(rowData);
    } else if (event === 'CANCEL') {
      //this.titleNotify = 'Xác nhận hủy giao dịch';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.cancel(rowData);
      };
    }
  }
  detail(rowData: any) {
    console.log('rowData: ', rowData);
    if (rowData.data.reissued_type == "I")
      this.router.navigate([`${'/svcard/cardnew-detail'.split('?')[0]}`], { queryParams: { rlosId: rowData.data.id } });
    else if (rowData.data.reissued_type == "EVNT0122")
      this.router.navigate([`${'/svcard/cardrenewextend-detail'.split('?')[0]}`], { queryParams: { rlosId: rowData.data.id } });
    else if (rowData.data.reissued_type == "EVNT6001")
      this.router.navigate([`${'/svcard/cardrenew-detail'.split('?')[0]}`], { queryParams: { rlosId: rowData.data.id } });
  }
  cancel(rowData: any) {
    console.log('rowData: ', rowData);
    var req: any = {
      id: rowData.data.id,
    }
    console.log('req: ', req);

    this.svcardService.cancelCardProcessing(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.notificationService.alertSussess(data.resDesc);
        this.dataGridControlComponent.reloadGrid(this.req);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  reload() {
    this.req = new CardProcessingReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  hidePopup() {
    this.visibleNotify = false;
    this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
}