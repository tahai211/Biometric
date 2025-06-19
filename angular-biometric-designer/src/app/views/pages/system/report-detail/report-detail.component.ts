import { Component, Inject, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import * as ko from 'knockout';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DxReportDesignerComponent } from 'devexpress-reporting-angular';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenService } from 'src/app/services/token.services';
import { CONST } from '../../../../shared/const/const';
import { reportService } from 'src/app/services/report.service';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';

interface UpdateReportRequest {
  DisplayName: string;
  ReportId: number;
  Sql: string;
  Parameter: string[];
}
interface CreateReportRequest {
  DisplayName: string;
  Sql: string;
  Parameter: string[];
}
interface Param {
  id: string;
  code: string;
  name: string;
}

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './report-detail.component.scss',
    '../../../../../../node_modules/ace-builds/css/ace.css',
    '../../../../../../node_modules/ace-builds/css/theme/dreamweaver.css',
    '../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css',
    '../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.material.blue.light.css',
    '../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-querybuilder.css',
    '../../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css',
    '../../../../../../node_modules/devexpress-reporting/dist/css/dx-reportdesigner.css'
  ]
})
export class ReportDetailComponent implements OnInit {
  @ViewChild(DxReportDesignerComponent, { static: false })
  public designer!: DxReportDesignerComponent;

  reportName = '';
  sqlQuery = '';
  title = '';
  hostUrl = '';
  getDesignerModelAction = '';
  saveReportAction = '/DXXRD/SaveReport';
  koReportUrl = ko.observable('');

  /* multiParams: Danh sách Param load từ server */
  multiParams: Param[] = [];

  /**
   * selectedParamIds: mảng string[] của ID các tham số đã chọn.
   * Sẽ bind vào CustomDropdownBoxComponent [(value)]="selectedParamIds"
   */
  selectedParamIds: string[] = [];

  /**
   * Nếu cần lưu object Param đầy đủ (ví dụ để hiển thị ở table khác),
   * có thể đồng bộ từ selectedParamIds → selectedParamObjects
   */
  selectedParamObjects: Param[] = [];

  // Cấu hình cột cho DataGrid trong dropdown
  columnsParam: Array<dxDataGridColumn | string> = [
    { dataField: 'code', caption: 'Mã', width: 100 },
    { dataField: 'name', caption: 'Tên' }
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private http: HttpClient,
    public notificationService: NotificationService,
    private commonService: CommonService,
    private buttonService: ButtonService,
    private router: ActivatedRoute,
    private reportService: reportService,
    private tokenService: TokenService
  ) {}

  get reportUrl() {
    return this.koReportUrl();
  }
  set reportUrl(newUrl: any) {
    this.koReportUrl(newUrl);
  }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      if (params['id']) {
        this.reportUrl = params['id'];
        this.GetDetail();
        this.loadButton('U');
      } else {
        this.reportUrl = '0';
        this.loadButton('C');
      }
    });

    this.title = 'DXReportDesignerSample';
    this.getDesignerModelAction = '/DXXRD/GetReportDesignerModel';
    this.hostUrl = CONST.API_URL;
    this.onLoadData();
  }

  setButtons(isSave: boolean, isUpdate: boolean) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false, visibility: isUpdate }
    ]);
  }

  loadButton(auth_stat: string) {
    this.setButtons(auth_stat === 'C', auth_stat === 'U');
  }

  onClick(event: any) {
    if (event === 'CREATE') {
      this.create();
    } else if (event === 'UPDATE') {
      this.update();
    }
  }

  /**
   * Fetch multiParams (danh sách Param gốc) từ server.
   * Sau khi lấy xong, nếu selectedParamIds đã có sẵn, build selectedParamObjects.
   */
  onLoadData(): void {
    const reqparam: any = {
      pageindex: 1,
      pagesize: 100 // hoặc size mong muốn
    };
    this.reportService.getListParam(reqparam).subscribe(
      (res: any) => {
        this.multiParams = res.lstData.items.map((item: any) => ({
          id: item.id.toString(),
          code: item.paramCode,
          name: item.paramName
        }));
        // Nếu selectedParamIds đã có từ trước (lúc GetDetail chạy), cập nhật object
        this.updateSelectedParamObjects();
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  /**
   * Lấy chi tiết report (thường trả về object report có trường parameter là mảng ID hoặc chuỗi "1,2,3").
   * Sau khi có paramString, tách thành mảng ID rồi gán vào selectedParamIds.
   */
  GetDetail(): void {
    const reqDetail: any = {
      ReportId: parseInt(this.reportUrl)
    };
    this.reportService.getDetailReport(reqDetail).subscribe(
      (res: any) => {
        this.reportName = res.report.displayName;
        this.sqlQuery = res.report.sql;
        if (res.report.parameter && res.report.parameter.length > 0) {
          // Chuẩn hóa thành mảng string ID
          const paramString = res.report.parameter;
          const paramIds: string[] = Array.isArray(paramString)
            ? (paramString as string[]).map(x => x.toString())
            : (paramString as string).split(',').map(x => x.trim());
          this.selectedParamIds = paramIds;
          // Nếu multiParams đã load xong, cập nhật object
          this.updateSelectedParamObjects();
        }
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  /**
   * Mỗi khi multiParams hoặc selectedParamIds thay đổi, ta build lại mảng selectedParamObjects.
   */
  updateSelectedParamObjects() {
    if (this.multiParams.length > 0 && this.selectedParamIds.length > 0) {
      this.selectedParamObjects = this.multiParams.filter(param =>
        this.selectedParamIds.includes(param.id.toString())
      );
    } else {
      this.selectedParamObjects = [];
    }
  }

  /**
   * Hàm bắt event khi user chọn hoặc bỏ chọn trong dropdown.
   * newIds: mảng ID mới do CustomDropdownBoxComponent emit.
   */
  onParamsChanged(newIds: string[]) {
    this.selectedParamIds = newIds;
    this.updateSelectedParamObjects();
  }

  update() {
    const payload: UpdateReportRequest = {
      DisplayName: this.reportName,
      ReportId: parseInt(this.reportUrl),
      Sql: this.sqlQuery,
      Parameter: this.selectedParamIds
    };
    this.reportService.updateReport(payload).subscribe(
      (res: any) => {
        const d = this.designer.bindingSender;
        d.SaveReport()
          .done(() => this.notificationService.alertSussess(res.resDesc))
          .fail(() => {});
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  create() {
    const payload: CreateReportRequest = {
      DisplayName: this.reportName,
      Sql: this.sqlQuery,
      Parameter: this.selectedParamIds
    };

    this.reportService.createReport(payload).subscribe(
      (res: any) => {
        if (res?.reportId) {
          const newId = res.reportId.toString();
          this.reportUrl = newId;

          const d = this.designer.bindingSender;
          const tab = d.GetCurrentTab();
          tab.url(newId);

          d.SaveReport()
            .done(() => {
              this.reportName = '';
              this.sqlQuery = '';
              this.selectedParamIds = [];
              this.notificationService.alertSussess(res.resDesc);
              //this.loadButton("U");
            })
            .fail(() => {
              this.reportService.deleteReport({ ReportId: parseInt(res.reportId) }).subscribe();
            });
        }
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
}
