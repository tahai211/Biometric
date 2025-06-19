import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { IdentityService } from 'src/app/services/identity.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CONST } from 'src/app/shared/const/const';
import { UserDto } from 'src/app/shared/models/identity/user.dto';
import { SelectDto } from 'src/app/shared/models/select.dto';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  @Input() id: string = '';
  @ViewChild('grid', { static: false }) grid: any;
  data: UserDto = new UserDto();
  roles: SelectDto[] = [];
  branchs: SelectDto[] = [];
  dataStatus: any[] = CONST.dataStatus;
  userRoles: any[] = [];
  isSendMail: boolean = true;
  isDisable: boolean = false;
  isVisibleCheckboxMail: boolean = false;
  visibleNotify: boolean = false;
  titleNotify: string = 'Xác nhận';
  confirmHandler!: () => void;
  cancelHandler() { this.visibleNotify = false; };

  columnsRole: Array<dxDataGridColumn | string> = [
    {
      dataField: 'value',
      caption: 'Mã',
      width: 100
    },
    {
      dataField: 'text',
      caption: 'Tên'
    }
  ];
  columnsBranch: Array<dxDataGridColumn | string> = [
    {
      dataField: 'value',
      caption: 'Mã',
      width: 150
    },
    {
      dataField: 'text',
      caption: 'Tên'
    }
  ];

  constructor(
    private identityService: IdentityService,
    private notificationService: NotificationService,
    private buttonService: ButtonService
  ) {

  }
  ngOnInit(): void {
    this.loadData();
  }
  setButtons(isSave: boolean, isUpdate: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean,
    positionSave: string = 'right', positionUpdate: string = 'right', positionAuth: string = 'right',
    positionReject: string = 'right', positionCancel: string = 'right'
  ) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave, position: positionSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false, visibility: isUpdate, position: positionUpdate },
      { buttonCode: 'AUTH', buttonName: '', disable: false, visibility: isAuth, position: positionAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false, visibility: isReject, position: positionReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false, visibility: isCancel, position: positionCancel },
    ]);
  }
  // setButtons(isSave: boolean, isUpdate: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean) {
  //   this.buttonService.setDataButtonPage([
  //     { buttonCode: 'CREATE', buttonName: '', disable: false,visibility: isSave },
  //     { buttonCode: 'UPDATE', buttonName: '', disable: false,visibility: isUpdate },
  //     { buttonCode: 'AUTH', buttonName: '', disable: false,visibility: isAuth },
  //     { buttonCode: 'REJECT', buttonName: '', disable: false,visibility: isReject },
  //     { buttonCode: 'CANCEL', buttonName: '', disable: false,visibility: isCancel},
  //   ]);
  // }
  loadData() {
    var req = {
      id_trans: this.id
    }
    this.identityService.getUserDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data = res.data;
        this.userRoles = res.userRoles;
        this.roles = res.roles;
        this.branchs = res.branchs;

        this.loadButton(res.data.auth_stat);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  loadButton(auth_stat: string) {
    this.visibleNotify = false;
    if (auth_stat === 'C') {
      this.isDisable = false;
      this.setButtons(false, false, false, false, false);
      this.isVisibleCheckboxMail = false;
    }
    else if (auth_stat === 'U') {
      this.setButtons(false, false, true, true, true, 'right', 'right', 'right', 'left', 'left');
      this.isVisibleCheckboxMail = true;
      this.isDisable = true;
    }
    else if (auth_stat === 'R') {
      this.isDisable = false;
      this.setButtons(false, true, false, false, true);
      this.isVisibleCheckboxMail = false;
    }
    else if (auth_stat === 'A') {
      this.isDisable = false;
      this.setButtons(false, true, false, false, false);
      this.isVisibleCheckboxMail = false;
    }
    else {
      this.isDisable = false;
      this.setButtons(true, false, false, false, false);
      this.isVisibleCheckboxMail = false;
    }
  }
  dropBranchSelected(event: any) {
    console.log('dropBranchSelected: ', event);
    this.data.branch_code = event.selectedRowKeys[0];
  }
  onClick(event: any) {
    if (event === 'CREATE') {
      this.create();
    } else if (event === 'UPDATE') {
      // this.update();
      this.titleNotify = 'Xác nhận cập nhật thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.update();
      };
    } else if (event === 'AUTH') {
      // this.auth();
      this.titleNotify = 'Xác nhận duyệt thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.auth();
      };
    } else if (event === 'REJECT') {
      // this.reject();
      this.titleNotify = 'Xác nhận từ chối thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.reject();
      };
    } else if (event === 'CANCEL') {
      // this.cancel();
      this.titleNotify = 'Xác nhận hủy thông tin';
      this.visibleNotify = true;
      this.confirmHandler = () => {
        this.cancel();
      };
    }
  }
  create() {
    var req: any = {
      user_name: this.data.user_name,
      password: this.data.password,
      re_password: this.data.re_password,
      full_name: this.data.full_name,
      phone: this.data.phone,
      email: this.data.email,
      branch_code: this.data.branch_code,
      status: this.data.status,
      roles: this.userRoles,
    }
    console.log('req: ', req);
    this.identityService.createUser(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        // this.loadData();
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
      user_name: this.data.user_name,
      password: this.data.password,
      re_password: this.data.re_password,
      full_name: this.data.full_name,
      phone: this.data.phone,
      email: this.data.email,
      branch_code: this.data.branch_code,
      status: this.data.status,
      roles: this.userRoles,
    }
    console.log('req: ', req);

    this.identityService.updateUser(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        // this.loadData();
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
      id_trans: this.id,
      isSendMail: this.isSendMail
    }
    console.log('req: ', req);

    this.identityService.authUser(req).subscribe(
      data => {
        console.log(new Date(), data);
        // this.loadData();
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

    this.identityService.rejectUser(req).subscribe(
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

    this.identityService.cancelUser(req).subscribe(
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

  onBranchValueChanged(event: any) {
    if (!event.value) {
      this.grid.instance.clearSelection();
    }
  }
}
