import { Component, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { DataGridControlMiniComponent } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import { CONST } from 'src/app/shared/const/const';
import { AdjustCreditDetailDto } from 'src/app/shared/models/svcard/adjustcreditdetail.dto';

@Component({
  selector: 'app-adjust-credit-card-detail',
  templateUrl: './adjust-credit-card-detail.component.html',
  styleUrl: './adjust-credit-card-detail.component.scss'
})
export class AdjustCreditCardDetailComponent {
  @ViewChild('dataGridAcc') dataGrid: DataGridControlMiniComponent;
  data: AdjustCreditDetailDto = new AdjustCreditDetailDto();
  cardNo: string = '';
  auth_status: string = '';
  transaction_status_text: string = '';
  dataSource: any = {};
  dataUserAuths: any = {};
  dataFormofguarantee: any[] = CONST.dataFormOfGuarantee;

  selectedCollaterals: any[] = [];

  columns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'stt',
      caption: 'STT',
      width: 60
    },
    {
      dataField: 'affiliate_code',
      caption: 'Mã liên kết',
      width: '*'
    },
    {
      dataField: 'branch',
      caption: 'Đơn vị',
      width: '*'
    },
    {
      dataField: 'collateral_code',
      caption: 'Mã tài sản đảm bảo',
      width: '*'
    },
    {
      dataField: 'collateral_value',
      caption: 'Giá trị còn lại',
      width: '*'
    },
    {
      dataField: 'watch',
      caption: 'Xem',
      width: '*'
    },
    {
      caption: '',
      width: 50,
      fixed: true,
      alignment: 'center',
      cellTemplate: (container, cellInfo) => {
        const checkbox = this.renderer.createElement('input');
        this.renderer.setAttribute(checkbox, 'type', 'checkbox');
        this.renderer.setAttribute(checkbox, 'class', 'custom-checkbox');

        // Thêm data-group-id vào checkbox để dễ truy xuất
        this.renderer.setAttribute(checkbox, 'data-group-id', cellInfo.data.group_id);

        // Gán giá trị checkbox dựa trên dữ liệu
        checkbox.checked = cellInfo.data.isSelected;

        // Lắng nghe sự kiện click để cập nhật dữ liệu
        this.renderer.listen(checkbox, 'change', (event) => {
            
        });

        container.append(checkbox);
      }
    }
  ];

  constructor(
    private renderer: Renderer2,
    private notificationService: NotificationService,
    private buttonService: ButtonService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public svcardService: svCardService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cardNo = params['card_no'] || '';
      this.auth_status = params['auth_status'] || '';
    });

    if (this.cardNo) {
      this.loadDataDetail();
    } else {
      this.notificationService.alertError('Vui lòng chọn thẻ để xem chi tiết');
    }

    this.loadButton(this.auth_status);
  }

  loadDataDetail() {
    this.svcardService.getAdjustCreditDetailFilter({ card_no: this.cardNo }).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataSource = response.collateralInfoList;
        this.data = response.data;
        this.dataUserAuths = response.userauths;

        this.transaction_status_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', this.data.transaction_status);
        this.data.cust_type = this.commonService.getNameById('CUST_TYPE', this.data.cust_type);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  setButtons(isSave: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean, isBack: boolean, isRefresh: boolean) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave },
      { buttonCode: 'AUTH', buttonName: '', disable: false, visibility: isAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false, visibility: isReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false, visibility: isCancel },
      { buttonCode: 'BACK', buttonName: '', disable: false, visibility: isBack },
      { buttonCode: 'REFRESH', buttonName: '', disable: false, visibility: isRefresh },
    ]);
  }

  loadButton(auth_stat: string) {
    if (auth_stat === 'C') this.setButtons(false, false, false, false, true, false);
    else if (auth_stat === 'U' || auth_stat === 'W') this.setButtons(false, true, true, false, true, true);
    else if (auth_stat === 'R' || auth_stat === 'KR' || auth_stat === 'TR') this.setButtons(false, false, false, true, true, false);
    else if (auth_stat === 'A' || auth_stat === 'KA' || auth_stat === 'TA') this.setButtons(false, false, false, false, true, false);
    else this.setButtons(true, false, false, false, true, false);
    
  }

  onClick(event: any) {
    if (event === 'CREATE') {
      this.create();
    } else if (event === 'AUTH') {
      this.auth();
    } else if (event === 'REJECT') {
      this.reject();
    } else if (event === 'CANCEL') {
      this.cancel();
    } else if (event === 'BACK') {
      this.back();
    } else if (event === 'REFRESH') {
      window.location.reload();
    }
  }

  create() {
    var req:any = {
      card_no: this.cardNo,
      data: this.data,
      collateralInfos: this.dataSource,
    }
    this.svcardService.createAdjustCreditCard(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.notificationService.alertSussess(response.resDesc);

        this.data.transaction_status = response.transaction_status;
        this.transaction_status_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', this.data.transaction_status);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  auth() {}

  reject() {}

  cancel() {}

  back() {
    this.router.navigate(['/svcard/adjust-credit-card'], {});
  }
}
