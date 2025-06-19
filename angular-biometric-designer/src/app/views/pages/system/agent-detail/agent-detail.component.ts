import { Component, Input, OnInit } from '@angular/core';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { SystemService } from 'src/app/services/system.service';
import { NotificationService } from 'src/app/services/notification.service';
import { paramCommonService } from 'src/app/services/param.common.service';
import { CONST } from 'src/app/shared/const/const';
import { AgentDto } from 'src/app/shared/models/system/agent.dto';
import { SelectDto } from 'src/app/shared/models/select.dto';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrl: './agent-detail.component.scss'
})
export class AgentDetailComponent implements OnInit {
  @Input() id: string = '';
  data: AgentDto = new AgentDto();
  dataBranchCode: SelectDto[] = [];
  branchs: SelectDto[] = [];
  dataStatus: any[] = CONST.dataStatus;
  dataAuthStatus: any[] = CONST.dataAuthStatus;
  columnsBranch: Array<DevExpress.ui.dxDataGridColumn | string> = [
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

  visibleNotify: boolean = false;
  titleNotify: string = 'Xác nhận';
  confirmHandler!: () => void;
  cancelHandler() { this.visibleNotify = false; };

  constructor(
    public paramCommonService : paramCommonService,
    private systemService: SystemService,
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
      { buttonCode: 'CREATE', buttonName: '', disable: false,visibility: isSave, position: positionSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false,visibility: isUpdate, position: positionUpdate },
      { buttonCode: 'AUTH', buttonName: '', disable: false,visibility: isAuth, position: positionAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false,visibility: isReject, position: positionReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false,visibility: isCancel, position: positionCancel },
    ]);
  }
  loadData() {
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
    var req1 = {
      id_trans: this.id
    }
    this.systemService.getAgentDetail(req1).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data = res.data;
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
    if (auth_stat === 'C') this.setButtons(false, false, false, false, false);
    else if (auth_stat === 'U') this.setButtons(false, false, true, true, true, 'right', 'right', 'right', 'left', 'left');
    else if (auth_stat === 'R') this.setButtons(false, true, false, false, true);
    else if (auth_stat === 'A') this.setButtons(false, true, false, false, false);
    else this.setButtons(true, false, false, false, false);

    this.visibleNotify = false;
  }
  dropBranchSelected(event: any) {
    console.log('dropBranchSelected: ', event);
    this.data.branch_code = event.selectedRowKeys[0];
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
    }
  }



  create() {
    var req: any = {
      agent_code: this.data.agent_code,
      agent_name: this.data.agent_name,
      branch_code: this.data.branch_code,
      status: this.data.status,
      address: this.data.address,
    }
    console.log('req: ', req);
    this.systemService.createAgent(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
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
      agent_code: this.data.agent_code,
      agent_name: this.data.agent_name,
      branch_code: this.data.branch_code,
      status: this.data.status,
      address: this.data.address,
    }
    console.log('req: ', req);
    
    this.systemService.updateAgent(req).subscribe(
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
      id_trans: this.id
    }
    console.log('req: ', req);
    
    this.systemService.authAgent(req).subscribe(
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
    
    this.systemService.rejectAgent(req).subscribe(
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

    this.systemService.cancelAgent(req).subscribe(
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
