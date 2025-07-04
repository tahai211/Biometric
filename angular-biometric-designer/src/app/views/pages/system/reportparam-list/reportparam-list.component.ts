import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { reportService } from 'src/app/services/report.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import { SelectDto } from 'src/app/shared/models/select.dto';
import { CardNewReqDto } from 'src/app/shared/models/svcard/cardnew.req';
import { ParamReportReq } from 'src/app/shared/models/report/paramreport.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-reportparam-list',
  templateUrl: './reportparam-list.component.html',
  styleUrl: './reportparam-list.component.scss'
})
export class ReportparamListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: ParamReportReq = new ParamReportReq();
  id = '';
  isPopupVisible: boolean = false;
  hasCreateButton: boolean = false;
  length = 0;
  dataSource: any = {};
  authStatusList: any[] = CONST.dataAuthStatus;

  sendStatusList: any[] = CONST.dataCardStatus;
  columns: Array<dxDataGridColumn | string> = [
    { dataField: 'stt', caption: 'STT', width: 50 },
    { dataField: 'paramCode', caption: 'Mã tham số', width: 150 },
    { dataField: 'paramName', caption: 'Tên tham số', width: 150 },
    { dataField: 'paramType', caption: 'Loại tham số', width: 150 ,cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('PARAM_REPORT_TYPE', cellInfo.data.paramType);
    },},
    { dataField: 'makerDt', caption: 'Ngày tạo', width: 150, dataType: 'date', format: 'dd/MM/yyyy' },{
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
    public reportService: reportService,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private buttonService: ButtonService,
    private breadcrumbService: BreadcrumbService,
    private router: Router) {
  }

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
  loadData(params: any) {
    console.log('request filter: ', params);
    this.reportService.getListParam(params).subscribe(
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
    //this.router.navigate([`${'/system/paramreport-detail'.split('?')[0]}`], { queryParams: { id: rowData.data.id } });
  }
  reload() {
    this.req = new ParamReportReq();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  create() {
    this.id = '';
    this.isPopupVisible = true;
    //this.router.navigate([`${'/system/paramreport-detail'}`]);
  }
  hidePopup() {
    this.isPopupVisible = false;
    this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
}
