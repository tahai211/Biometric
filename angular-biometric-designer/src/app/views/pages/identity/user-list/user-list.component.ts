import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { IdentityService } from 'src/app/services/identity.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import { UserReqDto } from 'src/app/shared/models/identity/user.req';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: UserReqDto = new UserReqDto();
  id = '';
  isPopupVisible: boolean = false;
  hasCreateButton: boolean = false;
  length = 0;
  dataSource: any = {};
  dataSource2: any = {};
  dataStatus: any[] = CONST.dataStatus;
  dataAuthStatus: any[] = CONST.dataAuthStatus;
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'user_name',
    caption: 'Tên đăng nhập',
    minWidth: 150
  }, {
    dataField: 'full_name',
    caption: 'Họ và tên người dùng',
    width: auto,
  }, {
    dataField: 'branch_code',
    caption: 'Chi nhánh',
    width: auto
  }, {
    dataField: 'roles',
    caption: 'Phân quyền',
    width: auto,
  }, {
    dataField: 'status',
    caption: 'Trạng thái',
    width: auto,
    cellTemplate: (container, cellInfo) => {
      container.textContent = this.commonService.getNameById('STATUS', cellInfo.data.status);
    },
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
    this.initializeButtons();
  }
  constructor(
    public identityService: IdentityService,
    public notificationService: NotificationService,
    private router: Router,
    private buttonService: ButtonService,
    private renderer: Renderer2,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService) {
  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.req.isGetAll = false;
    this.identityService.getUserList(params).subscribe(
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
    // this.router.navigate([`${'/identity/user-detail'.split('?')[0]}`], { queryParams: { id: rowData.data.id_trans } });
  }
  reload() {
    this.req = new UserReqDto();
    this.dataGridControlComponent.reloadGrid(this.req);
  }
  search() {
    this.dataGridControlComponent.searchGrid(this.req);
  }
  create() {
    this.id = '';
    this.isPopupVisible = true;

    // this.router.navigate([`${'/identity/user-detail'}`]);
  }
  hidePopup() {
    this.isPopupVisible = false;
    this.dataGridControlComponent.onPageIndexChanged(this.dataGridControlComponent.pageIndex);
  }
  // exportToExcel() {

  //   this.identityService.excelUserList(this.req).subscribe(
  //     (response: any) => {
  //       console.log(new Date() + ": ", response);

  //       const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  //       console.log('**Tạo một đường dẫn (URL) để tải xuống**'); 
  //       const url = window.URL.createObjectURL(blob);

  //       console.log('**Tạo một thẻ <a> ẩn để tự động tải xuống**');
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'list_user_data.xlsx';  
  //       document.body.appendChild(a);
  //       a.click();

  //       // **Dọn dẹp bộ nhớ**
  //       window.URL.revokeObjectURL(url);
  //     },
  //     err => {
  //       console.log(new Date(), err);
  //       this.notificationService.alertError(err.error);
  //     }
  //   )
  // }
  exportToExcel() {
    this.req.isGetAll = true;
    this.identityService.getUserList(this.req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.length = response.totalCount;
        this.dataSource2 = response.lstData.items;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách tra soát');

        // Merge tiêu đề
        worksheet.mergeCells('A1:O1');
        const titleRow = worksheet.getCell('A1');

        // Thiết lập tiêu đề cột (giống như trong ảnh)
        const columns = [
          { header: 'STT', key: 'stt', width: 10 },
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Tên tài khoản', key: 'user_name', width: 20 },
          { header: 'Tên người dùng', key: 'full_name', width: 25 },
          { header: 'Chi nhánh', key: 'branch_code', width: 15 },
          { header: 'Phân quyền', key: 'roles', width: 30 },
          { header: 'Trạng thái', key: 'status', width: 15 },
          { header: 'Trạng thái duyệt', key: 'auth_stat', width: 15 },
          { header: 'Người tạo', key: 'created_by', width: 15 },
          { header: 'Ngày tạo', key: 'created_date', width: 20 },
          { header: 'Người sửa', key: 'last_modified_by', width: 15 },
          { header: 'Ngày sửa', key: 'last_modified_date', width: 20 },
          { header: 'Người duyệt', key: 'approved_by', width: 15 },
          { header: 'Ngày duyệt', key: 'approved_date', width: 20 },
          { header: 'Thời gian đăng nhập gần nhất', key: 'last_login', width: 25 }
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
        titleRow.value = 'DANH SÁCH TRA SOÁT';
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
        titleRow.font = { size: 14, bold: true };

        // Ghi dữ liệu vào worksheet
        const dataArray = Object.values(this.dataSource2);
        (dataArray as any[]).forEach((data, index) => {
          const row = worksheet.addRow({
            stt: index + 1,
            id: data?.id ?? '',
            user_name: data?.user_name ?? '',
            full_name: data?.full_name ?? '',
            branch_code: data?.branch_code ?? '',
            roles: data?.roles ?? '',
            status: this.commonService.getNameById('STATUS', data?.status ?? ''),
            auth_stat: this.commonService.getNameById('AUTH_STATUS', data?.auth_stat ?? ''),
            created_by: data?.created_by ?? '',
            created_date: data?.created_date ?? '',
            last_modified_by: data?.last_modified_by ?? '',
            last_modified_date: data?.last_modified_date ?? '',
            approved_by: data?.approved_by ?? '',
            approved_date: data?.approved_date ?? '',
            last_login: data?.last_login ?? ''
          });

          // Căn giữa cho STT, ID, Trạng thái, Trạng thái duyệt
          row.getCell('stt').alignment = { horizontal: 'center' };
          row.getCell('id').alignment = { horizontal: 'center' };
          row.getCell('status').alignment = { horizontal: 'center' };
          row.getCell('auth_stat').alignment = { horizontal: 'center' };
        });

        // Xuất file Excel
        workbook.xlsx.writeBuffer().then(buffer => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DanhSachTraSoat.xlsx');
        });
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertErrorResponeAbp(err);
      }
    );
  }
}
