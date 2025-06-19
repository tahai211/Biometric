import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SystemService } from 'src/app/services/system.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import { SelectDto } from 'src/app/shared/models/select.dto';
import { HistoryReqDto } from 'src/app/shared/models/system/history.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: HistoryReqDto = new HistoryReqDto();
  id = '';
  isPopupVisible: boolean = false;
  length = 0;
  dataSource: any = {};
  dataScreens: SelectDto[] = [];
  dataFunction: SelectDto[] = [];
  dataHttpMethod: any[] = CONST.dataHttpMethod;
  dataHttpStatusCode: any[] = CONST.dataHttpStatusCode;
  dataSystemId: any[] = CONST.dataSystemId;
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'system_id',
    caption: 'Hệ thống',
    width: 150,
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('SYSTEM_ID', cellInfo.data.system_id);
    },
  }, {
    dataField: 'username',
    caption: 'Tên tài khoản',
    width: 100
  }, {
    dataField: 'ip',
    caption: 'IP',
    width: 120,
  }, {
    dataField: 'screen_name',
    caption: 'Tên màn hình',
    minWidth: 180
  }, {
    dataField: 'action_name',
    caption: 'Chức năng',
    minWidth: 180
  }, {
    dataField: 'execution_time',
    caption: 'Thời gian tạo',
    width: auto
  }, {
    dataField: 'execution_duration',
    caption: 'Phản hồi (ms)',
    width: auto
  }, {
    dataField: 'http_method',
    caption: 'Phương thức',
    width: auto,
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('HTTP_METHOD', cellInfo.data.http_method);
    },
  }, {
    dataField: 'http_status_code',
    caption: 'Mã phản hồi',
    width: auto,
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('HTTP_STATUS_CODE', cellInfo.data.http_status_code);
    },
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

  constructor(public systemService: SystemService,
    public notificationService: NotificationService,
    private router: Router,
    private buttonService: ButtonService,
    private renderer: Renderer2,
    private commonService: CommonService) { }

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
    //this.req.to_date = currentDate.toISOString().split('T')[0];
    this.req.to_date = currentDate.toLocaleDateString('en-CA');
    this.loadFilter();
  }
  loadFilter() {
    this.systemService.getHistoryFilter({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataScreens = response.dataScreens;
        this.dataFunction = response.dataFunction;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.systemService.getHistoryList(params).subscribe(
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
    console.log('rowData: ', rowData);
    this.id = rowData.data.id;
    this.isPopupVisible = true;
  }
  reload() {
    this.req = new HistoryReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  hidePopup() {
    this.isPopupVisible = false;
    // this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
}
