import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { IdentityService } from 'src/app/services/identity.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { CONST } from 'src/app/shared/const/const';
import { RoleReqDto } from 'src/app/shared/models/identity/role.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: RoleReqDto = new RoleReqDto();
  length = 0;
  dataSource: any = {};
  id: string = '';
  isPopupVisible: boolean = false;
  dataStatus: any[] = CONST.dataStatus;
  dataAuthStatus: any[] = CONST.dataAuthStatus;
  hasCreateButton: boolean = false;
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'role_code',
    caption: 'Mã quyền',
    minWidth: 150,
  }, {
    dataField: 'role_name',
    caption: 'Tên quyền',
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

  constructor(public identityService: IdentityService,
    public commonService: CommonService,
    public notificationService: NotificationService,
    private router: Router,
    private buttonService: ButtonService,
    private renderer: Renderer2,
    private breadcrumbService: BreadcrumbService) { }
  ngOnInit(): void {
    this.initializeButtons();
  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.identityService.getRoleList(params).subscribe(
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
  }
  reload() {
    this.req = new RoleReqDto();
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
}
