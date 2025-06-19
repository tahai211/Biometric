import { Component, ComponentFactoryResolver, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { TokenService } from 'src/app/services/token.services';
import { ScreenButtonGridComponent } from 'src/app/shared/components/screen-button-grid/screen-button-grid.component';
import { ButtonByScreenDto } from 'src/app/shared/models/button/button.dto';
import { cardBatchReqDto } from 'src/app/shared/models/svcard/cardbatch.req';
import { dxDataGridColumn,ColumnCellTemplateData  } from 'devextreme/ui/data_grid';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-cardbatch',
  templateUrl: './cardbatch.component.html',
  styleUrl: './cardbatch.component.scss'
})
export class CardbatchComponent implements OnInit {

  constructor(
    private buttonService: ButtonService,
    public notificationService: NotificationService,
    private commonService: CommonService,
    private renderer: Renderer2,
    private svcardservice: svCardService,
    private tokenService: TokenService,
    private breadcrumbService: BreadcrumbService,
    private resolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
  ) {
  }
  Currentbranch: string ='';
  hasCreateButton: boolean = false;
  req: cardBatchReqDto = new cardBatchReqDto();
  length = 0;
  dataSource: any = {};
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'batch_num',
    caption: 'Số lô',
    width: 140,
  }, {
    dataField: 'created_date',
    caption: 'Ngày tạo',
    width: 200,
  }, {
    dataField: 'created_by',
    caption: 'Nhân viên cập nhật',
    width: 320
  },
  {
    dataField: 'batch_status',
    caption: 'Trạng thái lô',
    width: 180,
    cellTemplate: (container, cellInfo) => {
      container.textContent = cellInfo.data.batch_status == "O" ? "Mở" : "Đóng";
    }
  },
  {
    dataField: 'number_create',
    caption: 'Số lượng thẻ',
    width: 180,
  },
  {
    dataField: 'branch_code',
    caption: 'Mã đơn vị',
    width: 240,
  },
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
      width: 120,
      alignment: 'center',
      cellTemplate: (container, cellInfo) => {
        var buttonCell: ButtonByScreenDto[] = [];
          buttonCell = this.setButtonsGrid(true, true, true);
  
        const factory = this.resolver.resolveComponentFactory(ScreenButtonGridComponent);
        const componentRef = this.viewContainerRef.createComponent(factory);
  
        componentRef.instance.buttonPage = buttonCell;
  
        componentRef.instance.onItemClick.subscribe((clickedValue: string) => {
          console.log('Item clicked:', clickedValue);
          this.onClickGird(clickedValue, cellInfo);
        });
        container.appendChild(componentRef.location.nativeElement);
      },
    },
  ];


  detail(rowData: any) {
    console.log('rowData: batch',rowData);
    this.createItem(rowData.data.branch_code);
    // this.router.navigate([`${'/identity/user-detail'.split('?')[0]}`], { queryParams: { id: rowData.data.id_trans } });
  }
  ngOnInit(): void {
    this.initializeButtons();
    let data = this.tokenService.getInfomationFromLocalStorage();
    this.Currentbranch = data.branhcode;
    //this.setButtons(true, false, false, false, false);
  }
  initializeButtons(): void {
    this.buttonService.hasCreateButton$('CREATE').subscribe(result => {
      this.hasCreateButton = result;
      this.breadcrumbService.setButtonPath(
        this.hasCreateButton,
        'TẠO MỚI CHO TẤT CẢ ĐƠN VỊ',
        () => this.create('')
      );
    });
  }

  loadData(params: any) {
    console.log('request filter: ', params);
    this.svcardservice.getBatchList(params).subscribe(
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
  // setButtons(isSave: boolean, isUpdate: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean) {
  //   this.buttonService.setDataButtonPage([
  //     { buttonCode: 'CREATE', buttonName: 'Tạo mới lô cho tất cả đơn vị', disable: false,visibility: isSave },
  //     { buttonCode: 'UPDATE', buttonName: '', disable: false,visibility: isUpdate },
  //     { buttonCode: 'AUTH', buttonName: '', disable: false,visibility: isAuth },
  //     { buttonCode: 'REJECT', buttonName: '', disable: false,visibility: isReject },
  //     { buttonCode: 'CANCEL', buttonName: '', disable: false,visibility: isCancel},
  //   ]);
  // }
  onClick(event: any) {


    if (event === 'CREATE') {
      this.create('');
    }
    // else if (event === 'UPDATE') {

    // } else if (event === 'AUTH') {

    // } else if (event === 'REJECT') {

    // } else if (event === 'CANCEL') {

    // }
  }
  create(p_branchCode: string) {
    let data = this.tokenService.getInfomationFromLocalStorage();
    let req: any = {
      branchCode: data.branhcode
    }
    console.log('req: ', req);
    this.svcardservice.createBatchList(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.loadData(this.req);
        if(data.resCode=='000'){
          this.notificationService.alertSussess(data.resDesc);
        }else{
          this.notificationService.alertError(data.resDesc);
        }
        
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  createItem(p_branchCode: string) {
    
    let req: any = {
      branchCode: p_branchCode
    }
    
    console.log('req: ', req);
    this.svcardservice.createBatchListItem(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.loadData(this.req);
        if(data.resCode=='000'){
          this.notificationService.alertSussess(data.resDesc);
        }else{
          this.notificationService.alertError(data.resDesc);
        }
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  setButtonsGrid(VIEW: boolean, CANCEL: boolean, disable: boolean) {
      var dataButton: ButtonByScreenDto[] = [
        { buttonCode: 'CREATEITEM', buttonName: 'TẠO LÔ', disable: false, visibility: VIEW }
      ];
      return dataButton;
    }
    onClickGird(clickedValue: string, cellInfo: ColumnCellTemplateData<any, any>) {
      this.createItem(cellInfo.data.branch_code);
    }

}
