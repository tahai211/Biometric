import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SystemService } from 'src/app/services/system.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import { ParamReqDto } from 'src/app/shared/models/system/param.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-param-list',
  templateUrl: './param-list.component.html',
  styleUrls: ['./param-list.component.scss']
})
export class ParamListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: ParamReqDto = new ParamReqDto();
  id = '';
  isPopupVisible: boolean = false;
  length = 0;
  dataSource: any = {};
  dataStatus: any[] = CONST.dataStatus;
  dataAuthStatus: any[] = CONST.dataAuthStatus;
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'param_code',
    caption: 'Mã tham số',
    width: auto
  }, {
    dataField: 'param_name',
    caption: 'Tên tham số',
    width: auto,
  }, {
    dataField: 'param_value',
    caption: 'Giá trị',
    minWidth: 150
  }, {
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
    fixed: true,
    width: auto,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      const button = this.renderer.createElement('button');
      const img = this.renderer.createElement('img');

      this.renderer.addClass(button, 'btn');
      this.renderer.addClass(button, 'btn-sm');
      this.renderer.addClass(button, 'btn-icon');

      this.renderer.setAttribute(img, 'src', 'assets/images/icon/edit.svg');
      this.renderer.setStyle(img, 'width', '18px');
      this.renderer.setStyle(img, 'height', '18px');

      this.renderer.appendChild(button, img);
      this.renderer.listen(button, 'click', () => {
        this.detail(cellInfo);
      });
      container.append(button);
    },
  }];
  ngOnInit(): void {

  }
  constructor(
    public systemService: SystemService,
    public notificationService: NotificationService,
    private router: Router,
    private buttonService: ButtonService,
    private renderer: Renderer2,
    private commonService: CommonService) {
  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.systemService.getParamList(params).subscribe(
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
    this.req = new ParamReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  hidePopup() {
    this.isPopupVisible = false;
    this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
}
