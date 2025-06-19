import { AfterViewInit, Component, ComponentFactoryResolver, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { TokenService } from 'src/app/services/token.services';
import { ScreenButtonComponent } from 'src/app/shared/components/screen-button/screen-button.component';
import { ScreenButtonGridComponent } from 'src/app/shared/components/screen-button-grid/screen-button-grid.component';
import { ButtonByScreenDto } from 'src/app/shared/models/button/button.dto';
import { cardBatchReqDto } from 'src/app/shared/models/svcard/cardbatch.req';
import { LocalstorageService } from 'src/app/services/localstorage.services ';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { dxDataGridColumn,ColumnCellTemplateData  } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-cardbatchauth',
  templateUrl: './cardbatchauth.component.html',
  styleUrl: './cardbatchauth.component.scss'
})
export class CardbatchauthComponent implements OnInit, AfterViewInit {
  constructor(
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private svcardservice: svCardService,
    private tokenService: TokenService,
    private router: Router,
    private buttonService: ButtonService,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private localstorageservice: LocalstorageService,
  ) {
  }
  //#region Khai báo biến
  // @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  @ViewChild('dataGridBatchAuth') dataGridControlComponent: DataGridControlComponent;
  req: cardBatchReqDto = new cardBatchReqDto();
  length = 0;
  dataSource: any = {};

  columns: Array<dxDataGridColumn | string> = [{
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
    },{
    dataField: 'batch_num',
    caption: 'Số lô',
    width: 140,
  }, {
    dataField: 'created_date',
    caption: 'Ngày tạo',
    width: 240,
  }, {
    dataField: 'created_by',
    caption: 'Nhân viên cập nhật',
    width: 280
  },
  // {
  //   dataField: 'batch_status',
  //   caption: 'Trạng thái lô',
  //   width: auto,
  //   cellTemplate: (container, cellInfo) => {
  //     container.textContent = cellInfo.data.batch_status == "O" ? "Mở" : "Đóng";
  //   }
  // },
  {
    dataField: 'number_create',
    caption: 'Số lượng thẻ',
    width: 180,
  },
  {
    dataField: 'date_apply',
    caption: 'Ngày áp dụng',
    width: 260,
  },
  // {
  //   dataField: 'branch_code',
  //   caption: 'Mã đơn vị',
  //   width: auto,
  // },
  {
    dataField: 'api_stat',
    caption: 'Trạng thái gửi API',
    width: auto,
    cellTemplate: (container, cellInfo) => {
      const statusMap: { [key: string]: string } = {
        "A": "Đã gửi",
        "U": "Chưa gửi",
        "E": "Gửi lỗi"
      };
      container.textContent = statusMap[cellInfo.data.api_stat] || "";

    }
  },
  {
    fixed: true,
    width: 125,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      var buttonCell: ButtonByScreenDto[] = [];
      if (cellInfo.data.batch_status === 'C') {
        if (Number(cellInfo.data.number_create) > 0) {
          buttonCell = this.setButtons(true, true, true);
        } else {
          buttonCell = this.setButtons(true, true, true, true);
        }

      } else {

        if (Number(cellInfo.data.number_create) > 0) {
          buttonCell = this.setButtons(true, true, false);
        } else {
          buttonCell = this.setButtons(true, true, false, true);
        }
      }

      const factory = this.resolver.resolveComponentFactory(ScreenButtonGridComponent);
      const componentRef = this.viewContainerRef.createComponent(factory);

      componentRef.instance.buttonPage = buttonCell;

      componentRef.instance.onItemClick.subscribe((clickedValue: string) => {
        console.log('Item clicked:', clickedValue);
        this.onClick(clickedValue, cellInfo);
      });
      container.appendChild(componentRef.location.nativeElement);
    },
  },
    // {
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
    //       this.AuthBatchDetail(cellInfo);
    //     });
    //     container.append(button);
    //   },
    // },
    // {
    //   fixed: true,
    //   width: auto,
    //   alignment: 'center',
    //   cellTemplate: (container, cellInfo) => {
    //     const button = this.renderer.createElement('button');
    //     const icon = this.renderer.createElement('i');
    //     const text = this.renderer.createText('Đóng lô');


    //     this.renderer.addClass(button, 'btn');
    //     this.renderer.addClass(button, 'btn-primary');
    //     if(cellInfo.data.batch_status ==='C')
    //       this.renderer.addClass(button, 'disabled');
    //     this.renderer.appendChild(button, text);
    //     this.renderer.listen(button, 'click', () => {
    //       this.AuthBatchCancel(cellInfo);
    //     });
    //     container.append(button);
    //   },
    // }
  ];
  //#endregion


  ngOnInit(): void {
    //let data = this.tokenService.getInfomationFromLocalStorage();



  }
  ngAfterViewInit() {

    const savedSearch = this.localstorageservice.getLocalStorageWithURL('searchData');
    if (savedSearch !== null && savedSearch !== undefined) {
      if (Object.keys(savedSearch).length > 0) {
        this.req = savedSearch;
        this.dataGridControlComponent.goToPage(this.req)
      }
    }

  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.svcardservice.getBatchListAuth(params).subscribe(
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
  AuthBatchCancel(cellInfo: ColumnCellTemplateData<any, any>) {
    console.log("AuthBatchCancel cellInfo", cellInfo);
    let req: any = {
      branchCode: cellInfo.data.branch_code,
      batchNum: cellInfo.data.batch_num
    }
    this.svcardservice.AuthBatchListCancel(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.loadData(this.req);
        if (data.resCode === '000')
          this.notificationService.alertSussess(data.resDesc);
        else
          this.notificationService.alertError(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  AuthBatchDetail(cellInfo: ColumnCellTemplateData<any, any>) {
    // this.id = '';
    // this.isPopupVisible = true;
    //this.router.navigate([`${'/svcard/cardbatchauth-detail'}`]);
    //console.log(new Date(), cellInfo);
    this.localstorageservice.setLocalStorageWithURL('searchData', this.req)
    this.router.navigate([`${'/svcard/cardbatchauth-detail'.split('?')[0]}`], { queryParams: { id: cellInfo.data.batch_num, auth: cellInfo.data.api_stat,branchCode:cellInfo.data.branch_code } });
  }
  setButtons(VIEW: boolean, CANCEL: boolean, disable: boolean, disableShowDetail: boolean = false) {
    var dataButton: ButtonByScreenDto[] = [
      //{ buttonCode: 'VIEW', buttonName: 'Chi tiết lô', disable: disableShowDetail, visibility: VIEW },
      { buttonCode: 'CANCEL', buttonName: 'ĐÓNG LÔ', disable: disable, visibility: CANCEL },
    ];
    return dataButton;
  }
  onClick(event: any, cellInfo: any) {
    // if (event === 'VIEW') {
    //   this.AuthBatchDetail(cellInfo);
    // } else if (event === 'CANCEL') {
      this.AuthBatchCancel(cellInfo);
    // }
  }

  detail(cellInfo: any) {
    this.AuthBatchDetail(cellInfo);
  }

}
