import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { paramCommonService } from 'src/app/services/param.common.service';
import { SystemService } from 'src/app/services/system.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AgentReqDto } from 'src/app/shared/models/system/agent.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrl: './agent-list.component.scss'
})
export class AgentListComponent implements OnInit {
  
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: AgentReqDto = new AgentReqDto();
  id = '';
  isPopupVisible: boolean = false;
  length = 0;
  dataSource: any = {};
  dataSource2: any = {};
  dataStatus: any[] = CONST.dataStatus;
  dataAuthStatus: any[] = CONST.dataAuthStatus;
  dataBranchCode: any[] ;
  hasCreateButton: boolean = false;

  columns: Array<dxDataGridColumn | string> = [
    { 
      dataField: 'agent_code', 
      caption: 'Mã đơn vị', 
      width: auto 
    },
    { 
      dataField: 'agent_name', 
      caption: 'Tên đơn vị', 
      width: auto 
    },
    { 
      dataField: 'branch_code', 
      caption: 'Mã chi nhánh', 
      width: auto 
    },
    { 
      dataField: 'branch_name', 
      caption: 'Tên chi nhánh', 
      width: auto 
    },
    {
      dataField: 'status', 
      caption: 'Trạng thái', 
      width: auto,
      cellTemplate: (container, cellInfo) => {
        container.textContent = this.commonService.getNameById('STATUS', cellInfo.data.status);
      },
    },
    {
      dataField: 'auth_stat', 
      caption: 'Trạng thái duyệt', 
      width: auto,
      cellTemplate: (container, cellInfo) => {
        container.textContent = this.commonService.getNameById('AUTH_STATUS', cellInfo.data.auth_stat);
      },
    },
    {
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
      dataField: 'approved_by',
      caption: 'Người duyệt',
      width: auto
    }, {
      dataField: 'approved_date',
      caption: 'Ngày duyệt',
      width: 150
    }, 
    {
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
    public systemService: SystemService,
    public notificationService: NotificationService,
    public paramCommonService : paramCommonService,
    private router: Router,
    private buttonService: ButtonService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.setButtons(true, false, false, false, false);
    this.loadDataParam();
    this.initializeButtons();
  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.systemService.getAgentList(params).subscribe(
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

  detail(rowData: any) {
    console.log('rowData: ', rowData);
    this.id = rowData.data.id_trans;
    this.isPopupVisible = true;
    //this.router.navigate([`${'/system/agent'.split('?')[0]}`], { queryParams: { id: rowData.data.id } });
  }
  loadDataParam() {

    var req: any = {
      branchCode: '',
      officeType : 'B',
    }

    this.paramCommonService.getBranchList(req).subscribe(
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
      { buttonCode: 'CREATE', buttonName: '', disable: false,visibility: isSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false,visibility: isUpdate },
      { buttonCode: 'AUTH', buttonName: '', disable: false,visibility: isAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false,visibility: isReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false,visibility: isCancel},
    ]);
  }
  reload() {
    this.req = new AgentReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  create() {
    this.id = '';
    this.isPopupVisible = true;
  }
  hidePopup() {
    this.isPopupVisible = false;
    this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
  exportToExcel() {
      this.req.isGetAll = true;
      this.systemService.getAgentList(this.req).subscribe(
          (response: any) => {
              console.log(new Date() + ": ", response);
  
              this.length = response.totalCount;
              this.dataSource2 = response.lstData.items;
  
              const workbook = new ExcelJS.Workbook();
              const worksheet = workbook.addWorksheet('Danh sách đơn vị Agent');
  
              // Merge tiêu đề
              worksheet.mergeCells('A1:O1');
              const titleRow = worksheet.getCell('A1');
  
              // Thiết lập tiêu đề cột (giống như trong ảnh)
              const columns = [
                  { header: 'STT', key: 'stt', width: 10 },
                  { header: 'Mã đơn vị', key: 'agent_code', width: 20 },
                  { header: 'Tên đơn vị', key: 'agent_name', width: 25 },
                  { header: 'Mã chi nhánh', key: 'branch_code', width: 15 },
                  { header: 'Tên chi nhánh', key: 'branch_name', width: 30 },
                  { header: 'Trạng thái', key: 'status', width: 15 },
                  { header: 'Trạng thái duyệt', key: 'auth_stat', width: 15 },
                  { header: 'Người tạo', key: 'created_by', width: 15 },
                  { header: 'Ngày tạo', key: 'created_date', width: 20 },
                  { header: 'Người sửa', key: 'last_modified_by', width: 15 },
                  { header: 'Ngày sửa', key: 'last_modified_date', width: 20 },
                  { header: 'Người duyệt', key: 'approved_by', width: 15 },
                  { header: 'Ngày duyệt', key: 'approved_date', width: 20 }
              ];
  
              worksheet.columns = columns;
  
              // Style cho hàng tiêu đề
              const headerRow = worksheet.addRow(columns.map(col => col.header));
              headerRow.eachCell(cell => {
                  cell.font = { bold: true };
                  cell.alignment = { vertical: 'middle', horizontal: 'center' };
                  cell.border = {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' }
                  };
              });
              titleRow.value = 'DANH SÁCH ĐƠN VỊ AGENT';
              titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
              titleRow.font = { size: 14, bold: true };
  
              // Ghi dữ liệu vào worksheet
              const dataArray = Object.values(this.dataSource2);
              (dataArray as any[]).forEach((data, index) => {
                  const row = worksheet.addRow({
                      stt: index + 1,
                      agent_code: data?.agent_code ?? '',
                      agent_name: data?.agent_name ?? '',
                      branch_code: data?.branch_code ?? '',
                      branch_name: data?.branch_name ?? '',
                      status: this.commonService.getNameById('STATUS', data?.status ?? ''),
                      auth_stat: this.commonService.getNameById('AUTH_STATUS', data?.auth_stat ?? ''),
                      created_by: data?.created_by ?? '',
                      created_date: data?.created_date ?? '',
                      last_modified_by: data?.last_modified_by ?? '',
                      last_modified_date: data?.last_modified_date ?? '',
                      approved_by: data?.approved_by ?? '',
                      approved_date: data?.approved_date ?? '',
                  });
  
                  // Căn giữa cho STT, ID, Trạng thái, Trạng thái duyệt
                  row.getCell('stt').alignment = { horizontal: 'center' };
                  row.getCell('status').alignment = { horizontal: 'center' };
                  row.getCell('auth_stat').alignment = { horizontal: 'center' };
              });
  
              // Xuất file Excel
              workbook.xlsx.writeBuffer().then(buffer => {
                  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DanhSachDonVi.xlsx');
              });
          },
          err => {
              console.log(new Date(), err);
              this.notificationService.alertErrorResponeAbp(err);
          }
      );
    }
}
