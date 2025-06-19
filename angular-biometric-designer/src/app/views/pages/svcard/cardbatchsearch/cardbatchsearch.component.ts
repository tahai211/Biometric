import { Component, OnInit, ViewChild } from '@angular/core';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { LocalstorageService } from 'src/app/services/localstorage.services ';
import { NotificationService } from 'src/app/services/notification.service';
import { paramCommonService } from 'src/app/services/param.common.service';
import { svCardService } from 'src/app/services/svcard.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import { CONST_LOCAL_STORAGE } from 'src/app/shared/const/const.localstorage';
import { cardBatchReqDto } from 'src/app/shared/models/svcard/cardbatch.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-cardbatchsearch',
  standalone: false,
  templateUrl: './cardbatchsearch.component.html',
  styleUrl: './cardbatchsearch.component.scss'
})
export class CardbatchsearchComponent implements OnInit {

  constructor
    (
      private buttonService: ButtonService,
      private svcardservice: svCardService,
      public notificationService: NotificationService,
      public paramcommonservice: paramCommonService,
      public localstorageservice: LocalstorageService,

    ) { }
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: cardBatchReqDto = new cardBatchReqDto();
  dataStatus: any[] = CONST.dataStatusCardBatch;
  dataBranchCode: any[] = CONST.dataStatus;
  length = 0;
  dataSource: any = {};
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'batch_num',
    caption: 'Số lô',
    width: 160,
  }, {
    dataField: 'created_date',
    caption: 'Ngày tạo',
    width: 180,
  }, {
    dataField: 'created_by',
    caption: 'Nhân viên cập nhật',
    width: 260
  },
  {
    dataField: 'approved_by',
    caption: 'Kiểm soát',
    width: 260
  },
  {
    dataField: 'batch_status',
    caption: 'Trạng thái lô',
    width: 220,
    cellTemplate: (container, cellInfo) => {
      container.textContent = cellInfo.data.batch_status == "O" ? "Mở" : "Đóng";
    }
  },
  {
    dataField: 'number_create',
    caption: 'Số lượng thẻ',
    width: 160,
  },
  {
    dataField: 'branch_code',
    caption: 'Mã đơn vị',
    width: auto,
  }
  ];

  ngOnInit(): void {

    const savedDate = this.localstorageservice.getLocalStorage(CONST_LOCAL_STORAGE.CIM_CORE_DATE);
    let currentDate = new Date(savedDate ? savedDate : new Date());
    // Trừ 90 ngày
    let pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 90);
    // Gán vào from_date
    this.req.fromDate = pastDate.toISOString().split('T')[0];
    this.req.endDate = currentDate.toISOString().split('T')[0];



    this.setButtons(true, false, false, false, false);
    this.loadDataParam();
  }
  loadDataParam() {

    var req: any = {
      branchCode: ''
    }

    this.paramcommonservice.getBranchList(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataBranchCode = response.lstData;
      },
      err => {
        console.log(new Date(), err);

      }
    );
  }
  setButtons(isSave: boolean, isUpdate: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false, visibility: isUpdate },
      { buttonCode: 'AUTH', buttonName: '', disable: false, visibility: isAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false, visibility: isReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false, visibility: isCancel },
    ]);
  }
  reload() {
    // this.req = new UserReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.svcardservice.getBatchListSearch(params).subscribe(
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

}
