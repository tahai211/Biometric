import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonService } from 'src/app/services/button.service';
import { IdentityService } from 'src/app/services/identity.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TreeBase } from 'src/app/shared/base/tree-base';
import { CONST } from 'src/app/shared/const/const';
import { RoleDto } from 'src/app/shared/models/identity/role.dto';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent extends TreeBase {
  @Input() id: string = '';
  data: RoleDto = new RoleDto();
  dataPermissionSelected: any[] = [];
  dataStatus: any[] = CONST.dataStatus;
  modeType: string = 'multiple'

  visibleNotify: boolean = false;
  titleNotify: string = 'Xác nhận';
  confirmHandler!: () => void;
  cancelHandler() { this.visibleNotify = false; };

  constructor(
    private notificationService: NotificationService,
    private identityService: IdentityService,
    private buttonService: ButtonService) {
    super();
  }
  setButtons(isSave: boolean, isUpdate: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean,
              positionSave: string = 'right', positionUpdate: string = 'right', positionAuth: string = 'right',
              positionReject: string = 'right', positionCancel: string = 'right'
  ) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false,visibility: isSave, position: positionSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false,visibility: isUpdate, position: positionUpdate },
      { buttonCode: 'AUTH', buttonName: '', disable: false,visibility: isAuth, position: positionAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false,visibility: isReject, position: positionReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false,visibility: isCancel, position: positionCancel },
    ]);
  }
  override ngOnInit(): void {
  }
  override loadData(params: any): void {
    var req = {
      id_trans: this.id
    }
    this.identityService.getRoleDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data = res.data;

        this.dataSource = res.permissionList;
        this.selectRowkey = res.permissionSelected;
        this.dataPermissionSelected = res.permissionSelected;

        var expandedKeys: any[] = [];
        this.dataSource.forEach((item: any) => {
          expandedKeys.push(item.key);
        });
        this.treeList.expandedRowKeys = expandedKeys;

        this.loadButton(this.data.auth_stat);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
    if (this.collapsed) {
      this.treeList.instance.refresh();
    }
  }
  loadButton(auth_stat: string) {
    if (auth_stat === 'C') this.setButtons(false, false, false, false, false);
    else if (auth_stat === 'U') this.setButtons(false, false, true, true, true, 'right', 'right', 'right', 'left', 'left');
    else if (auth_stat === 'R') this.setButtons(false, true, false, false, true);
    else if (auth_stat === 'A') this.setButtons(false, true, false, false, false);
    else this.setButtons(true, false, false, false, false);

    this.visibleNotify = false;
  }
  selected(event: any) {
    console.log('selectedRowKeys: ', event.selectedRowKeys);
    this.dataPermissionSelected = event.selectedRowKeys;

    const deselectedKeys = event.currentDeselectedRowKeys; // Danh sách hàng bị bỏ chọn

    if (deselectedKeys.length > 0) {
      deselectedKeys.forEach((key: any) => {
        const row = this.dataSource.find((item: any) => item.key === key);
  
        if (row) {
          // Nếu hàng bị bỏ chọn có lstFunc, bỏ chọn toàn bộ checkbox của nó
          if (row.lstFunc) {
            row.lstFunc.forEach((func: any) => func.value = false);
          }
  
          // Tìm và bỏ chọn tất cả hàng con nếu có
          const childRows = this.dataSource.filter((item: any) => item.depKey === key);
          childRows.forEach((child: any) => {
            if (child.lstFunc) {
              child.lstFunc.forEach((func: any) => func.value = false);
            }
          });
        }
      });
    }
  }
  onClick(event: any) {
    if (event === 'CREATE') {
      this.create();
    } else if (event === 'UPDATE') {
      this.titleNotify = 'Xác nhận cập nhật thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.update();
      };
    } else if (event === 'AUTH') {
      this.titleNotify = 'Xác nhận duyệt thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.auth();
      };
    } else if (event === 'REJECT') {
      this.titleNotify = 'Xác nhận từ chối thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.reject();
      };
    } else if (event === 'CANCEL') {
      this.titleNotify = 'Xác nhận hủy thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.cancel();
      };
    } else if (event === 'BACK') {
      // window.history.back();
    }
  }
  create() {
    var req: any = {
      role_code: this.data.role_code,
      role_name: this.data.role_name,
      status: this.data.status,
      permissionList: this.dataSource,
      permissionSelected: this.dataPermissionSelected,
    }
    console.log('req: ', req);
    this.identityService.createRole(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        // this.loadData("");
        this.loadButton("U");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  update() {
    var req: any = {
      id_trans: this.id,
      role_code: this.data.role_code,
      role_name: this.data.role_name,
      status: this.data.status,
      permissionList: this.dataSource,
      permissionSelected: this.dataPermissionSelected,
    }
    console.log('req: ', req);
    
    this.identityService.updateRole(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        // this.loadData("");
        this.loadButton("U");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  auth() {
    var req: any = {
      id_trans: this.id
    }
    console.log('req: ', req);
    
    this.identityService.authRole(req).subscribe(
      data => {
        console.log(new Date(), data);
        // this.loadData("");
        this.loadButton("A");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  reject() {
    var req: any = {
      id_trans: this.id
    }
    console.log('req: ', req);
    
    this.identityService.rejectRole(req).subscribe(
      data => {
        console.log(new Date(), data);
        // this.loadData("");
        this.loadButton("R");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  cancel() {
    var req: any = {
      id_trans: this.id
    }
    console.log('req: ', req);
    
    this.identityService.cancelRole(req).subscribe(
      data => {
        console.log(new Date(), data);
        // this.loadData("");
        this.loadButton("C");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
}
