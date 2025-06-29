import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CBSService } from 'src/app/services/cbs.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { TokenService } from 'src/app/services/token.services';
import { DataGridControlMiniComponent } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import { CONST } from 'src/app/shared/const/const';
import { CardNewDto } from 'src/app/shared/models/svcard/cardnew.dto';
import { CustomerListReq } from 'src/app/shared/models/svcard/customerlist.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { CardReNewDto } from 'src/app/shared/models/svcard/cardrenew.dto';
@Component({
  selector: 'app-cardrenew-detail',
  templateUrl: './cardrenew-detail.component.html',
  styleUrl: './cardrenew-detail.component.scss'
})
export class CardrenewDetailComponent implements OnInit {
  @ViewChild('dataGridCust') dataGridCust: DataGridControlMiniComponent;
  @ViewChild('dataGridAcc') dataGridAcc: DataGridControlMiniComponent;
  @ViewChild('dataGridCollateral') dataGridCollateral: DataGridControlMiniComponent;
  @ViewChild('dataGridSubAccount') dataGridSubAccount: DataGridControlMiniComponent;
  id: string = '';
  type: string = '';
  rlosId: string = '';
  reqListCust: CustomerListReq = new CustomerListReq();
  lengthCust = 0;
  dataSourceCust: any = {};
  dataSourceAcc: any = {};
  dataSourceCollateral: any = {};
  dataSourceSubAccount: any = {};
  isSelectedCard: boolean = false;
  selectedCardType: string = 'debit'; // Mặc định chọn "Thẻ ghi nợ"

  isOnlineRegistration: boolean = false;
  isOnlineDebit: boolean = false;

  selectedSubAccounts: string[] = [];

  columnsCust: Array<dxDataGridColumn | string> = [{
    dataField: 'local_branch',
    caption: 'Mã chi nhánh',
    width: 100
  }, {
    dataField: 'customer_no',
    caption: 'Mã khách hàng',
    width: 150
  }, {
    dataField: 'full_name',
    caption: 'Tên khách hàng',
    width: 230
  }, {
    dataField: 'telephone',
    caption: 'Số điện thoại',
    width: 150
  }, {
    dataField: 'unique_id_value',
    caption: 'Số GTTT',
    width: 150,
  }, {
    dataField: 'birthday',
    caption: 'Ngày sinh',
    width: 150
  }, {
    dataField: 'address_line1',
    caption: 'Địa chỉ',
    minWidth: 250,
    cellTemplate: (container, cellInfo) => {
      container.textContent = (cellInfo.data.address_line1 == null ? "" : cellInfo.data.address_line1 + ", ") +
        (cellInfo.data.address_line2 == null ? "" : cellInfo.data.address_line2 + ", ") +
        (cellInfo.data.address_line3 == null ? "" : cellInfo.data.address_line3 + ", ") +
        (cellInfo.data.address_line4 == null ? "" : cellInfo.data.address_line4 + ", ");
    },
  }
  ];
  columnsAcc: Array<dxDataGridColumn | string> = [{
    dataField: 'accountNo',
    caption: 'Số tài khoản',
    width: '*'
  }, {
    dataField: 'branch_code',
    caption: 'Chi nhánh',
    width: '*',
  }, {
    dataField: '',
    caption: 'Trạng thái',
    width: '*',
    cellTemplate: (container, cellInfo) => {
      container.textContent = "Mở";
    }
  }, {
    fixed: true,
    width: auto,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      // Kiểm tra checkbox có được chọn không
      const checked = this.accountSelected === cellInfo.data.accountNo;

      // Tạo checkbox
      const checkbox = this.renderer.createElement('input');
      this.renderer.setAttribute(checkbox, 'type', 'checkbox');
      this.renderer.setProperty(checkbox, 'checked', checked);

      // Thêm sự kiện click để toggle checkbox khi click vào checkbox hoặc row
      const toggleCheckbox = () => {
        this.accountSelected = cellInfo.data.accountNo;
        checkbox.checked = true; // Chỉ chọn 1 checkbox
        //this.refreshGrid(); // Cập nhật lại grid nếu cần
      };

      this.renderer.listen(checkbox, 'click', toggleCheckbox);
      this.renderer.listen(container, 'click', toggleCheckbox);

      container.appendChild(checkbox);
    },
  }];


  isChecked(card_number: string): boolean {
    return this.selectedSubAccounts.includes(card_number);
  }


  columnsSubAccount: Array<dxDataGridColumn | string> = [{
    dataField: 'stt',
    caption: 'STT',
    width: '*'
  }, {
    dataField: 'embossed_name',
    caption: 'Họ và tên thẻ phụ',
    width: '*',
  }, {
    dataField: 'relationship',
    caption: 'Mối quan hệ với chủ thẻ chính',
    width: '*'
  }, {
    dataField: 'unique_id_value',
    caption: 'Số GTTT chủ thẻ phụ',
    width: '*'
  }, {
    dataField: 'date_gttt',
    caption: 'Ngày cấp GTTT chủ thẻ phụ',
    width: '*'
  }, {
    dataField: 'birth_day',
    caption: 'Ngày sinh chủ thẻ phụ',
    width: '*'
  }, {
    caption: '',
    fixed: true,
    width: 50,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      const card_number = cellInfo.data.card_number;

      const checkbox = this.renderer.createElement('input');
      this.renderer.setAttribute(checkbox, 'type', 'checkbox');

      // checked theo selectedSubAccounts hiện tại
      this.renderer.setProperty(checkbox, 'checked', this.isChecked(card_number));

      // click để cập nhật selectedSubAccounts
      this.renderer.listen(checkbox, 'click', (event) => {
        event.stopPropagation();

        const index = this.selectedSubAccounts.indexOf(card_number);
        if (checkbox.checked && index === -1) {
          this.selectedSubAccounts.push(card_number);
        } else if (!checkbox.checked && index > -1) {
          this.selectedSubAccounts.splice(index, 1);
        }

        console.log('Updated selectedSubAccounts:', this.selectedSubAccounts);
      });

      container.appendChild(checkbox);
    },
  }];
  columnsCollateral: Array<dxDataGridColumn | string> = [{
    dataField: '',
    caption: 'STT',
    width: '*'
  }, {
    dataField: '',
    caption: 'Mã liên kết',
    width: '*',
  }, {
    dataField: '',
    caption: 'Trị giá TSĐB',
    width: '*'
  }, {
    dataField: '',
    caption: 'Nội dung',
    width: '*'
  }, {
    fixed: true,
    width: auto,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      // Kiểm tra checkbox có được chọn không
      const checked = this.accountSelected === cellInfo.data.accountNo;

      // Tạo checkbox
      const checkbox = this.renderer.createElement('input');
      this.renderer.setAttribute(checkbox, 'type', 'checkbox');
      this.renderer.setProperty(checkbox, 'checked', checked);

      // Thêm sự kiện click để toggle checkbox khi click vào checkbox hoặc row
      const toggleCheckbox = () => {
        this.accountSelected = cellInfo.data.accountNo;
        checkbox.checked = true; // Chỉ chọn 1 checkbox
        //this.refreshGrid(); // Cập nhật lại grid nếu cần
      };

      this.renderer.listen(checkbox, 'click', toggleCheckbox);
      this.renderer.listen(container, 'click', toggleCheckbox);

      container.appendChild(checkbox);
    },
  }];
  accountSelected: any = '';
  data: CardReNewDto = new CardReNewDto();
  dataCardType: any[] = CONST.dataCardType;
  dataReleaseFrom: any[] = CONST.dataReleaseFrom;
  dataBranchs: any[] = [];
  dataUserAuths: any[] = [];
  dataProducts: any[] = [];
  dataCountrys: any[] = [];
  dataCitys: any[] = [];
  dataCardOld: any[] = [];
  dataCardClass: any[] = CONST.dataCardClass;
  dataFormofguarantee: any[] = CONST.dataFormOfGuarantee;

  constructor(
    public svcardService: svCardService,
    public cbsService: CBSService,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private buttonService: ButtonService,
    private router: ActivatedRoute,
    private tokenService: TokenService
  ) {
  }
  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.type = params['type'];
      }
      if (params['rlosId'] != null) {
        this.rlosId = params['rlosId'];
      }
    });
    if (this.id != null && this.id != '') {
      this.isSelectedCard = true;
    }
    else {
      this.isSelectedCard = false;
    }
    if (this.type == 'credit') {
      this.selectedCardType = this.type;
    } else {
      this.selectedCardType = "debit";
    }
    this.reqListCust.pagesize = 5;
    let data = this.tokenService.getInfomationFromLocalStorage();
    this.data.branch_code = data.branhcode;
    this.data.country_code = "704";
    this.data.city_code = "HNI";
    // this.data.card_type = "TC";
    if (this.rlosId != null && this.rlosId != '')
      this.loadDataRlosDetail();
    else
      this.loadDataDetail();
    this.setButtons(true, false, false, false, true, true);
    // this.data.card_type = 'TC';
  }
  loadDataDetail() {
    var req = {
      id: this.id,
      rlosId: this.rlosId
    };
    const apiCall = this.type == 'debit'
      ? this.svcardService.getCardReNewDetail(req)
      : this.svcardService.getCardCreditReNewDetail(req);

    apiCall.subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data.batch_num = res.batch_num;
        this.dataBranchs = res.branchs;
        this.dataUserAuths = res.userauths;
        this.dataCountrys = res.countrys;
        this.dataProducts = res.products
        this.dataCitys = res.citys;

        if (res.data.cust_no == null || res.data.cust_no == '')
          this.data.agent_code = this.data.branch_code;
        else {
          this.data = res.data;
          this.dataSourceAcc = res.custAcc;
          this.accountSelected = res.data.cust_ac_no;
          this.selectedSubAccounts = res.data.sub_card_list;
          this.dataGridAcc.dataGrid.instance.refresh();
          this.data.cust_type = this.commonService.getNameById('CUST_TYPE', res.data.cust_type);
        }

        this.loadButton(res.data.auth_stat);
        this.data.auth_stat_text = this.commonService.getNameById('AUTH_STATUS', res.data.auth_stat);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  loadDataRlosDetail() {
    var req = {
      id: this.rlosId
    };
    this.svcardService.getCardReNewRlosDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data.batch_num = res.batch_num;
        this.dataBranchs = res.branchs;
        this.dataUserAuths = res.userauths;
        this.dataCountrys = res.countrys;
        this.dataCitys = res.citys;

        if (res.data.cust_no == null || res.data.cust_no == '')
          this.data.agent_code = this.data.branch_code;
        else {
          this.data = res.data;
          this.dataSourceAcc = res.custAcc;
          this.accountSelected = res.data.cust_ac_no;
          this.dataGridAcc.dataGrid.instance.refresh();
          this.data.cust_type = this.commonService.getNameById('CUST_TYPE', res.data.cust_type);
        }

        this.loadButton('');
        this.data.auth_stat_text = '';
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
    else if (auth_stat === 'U') this.setButtons(false, true, true, false, true, true);
    else if (auth_stat === 'R') this.setButtons(false, false, false, true, true, false);
    else if (auth_stat === 'A') this.setButtons(false, false, false, false, true, false);
    else this.setButtons(true, false, false, false, true, true);
    if (auth_stat != null && auth_stat != '')
      this.data.auth_stat_text = this.commonService.getNameById('AUTH_STATUS', auth_stat);
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
      if (this.id != null && this.id != '') {
        //this.router.navigate(['/svcard/cardnew-list'], { });
      } else {
        this.isSelectedCard = false;
      }
    } else if (event === 'REFRESH') {
      window.location.reload();
    }
  }
  searchCust() {
    if (this.reqListCust.isFistLoad == '1') {
      this.cbsService.getCustomerList(this.reqListCust).subscribe(
        (response: any) => {
          console.log(new Date() + ": ", response);
          this.lengthCust = response.totalrecord;
          this.dataSourceCust = response.lstData;
        },
        err => {
          console.log(new Date(), err);
          this.notificationService.alertError(err.error);
        }
      );
    }
    else this.reqListCust.isFistLoad = "1";
  }
  custSelected(rowData: any) {
    this.isSelectedCard = true;
    var req = {
      custNo: rowData.data.customer_no
    };
    this.svcardService.getCustomerDetail(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.data.cust_no = rowData.data.customer_no;
        this.data.cust_name = response.fullname;
        this.data.unique_id_value = response.unique_id;
        this.data.birth_day = response.birthday;
        this.data.card_name = response.fullname;
        this.data.card_name_sub = response.fullname;
        this.data.cust_type = this.commonService.getNameById('CUST_TYPE', response.cust_type);
        this.data.user_branch = response.account_branch;
        this.data.address_1 = response.address_1;
        this.data.address_2 = response.address_2;
        this.data.address_3 = response.address_3;
        this.data.address_4 = response.address_4;
        this.data.city_code = response.city_code;
        this.data.cust_mobile = response.phone_mobile;
        this.data.cust_phone = response.phone_home;
        this.dataSourceAcc = response.lstAcc;
        this.data.unique_id_date = response.unique_id_date;
        this.data.expired_unique_id_date = response.expired_unique_id_date;


        if (response.lstAcc && response.lstAcc.length > 0) {
          this.accountSelected = response.lstAcc[0].accountNo;
          this.data.cust_ac_no = response.lstAcc[0].accountNo;
        }

        this.data.card_type = '';
        this.data.card_name = '';
        this.data.release_form = '';
        this.data.card_old_no = '';
        this.data.card_new_no = '';
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  accSelection(event: any) {
    this.data.cust_ac_no = event.selectedRowKeys[0].accountNo;
    this.accountSelected = event.selectedRowKeys[0].accountNo;
    this.dataGridAcc.dataGrid.instance.refresh();
  }
  accDropdownSelection(event: any) {
    this.data.cust_ac_no = event.value;
    this.accountSelected = event.value;
    this.data.card_type = 'TC';
    this.cardTypeChange({ value: this.data.card_type });
    this.subCardList();

  }

  CollateralSelection(event: any) {
    // this.data.cust_ac_no = event.selectedRowKeys[0].accountNo;
    // this.accountSelected = event.selectedRowKeys[0].accountNo;
    // this.dataGridAcc.dataGrid.instance.refresh();
  }
  onChangeCardType(event: any) {
    if (event == 'credit') {
      this.data.card_type = 'TC';
      this.cardTypeChange({ value: this.data.card_type });
      this.subCardList();
    }
  }
  subCardList() {
    const req = {
      cust_no: this.data.cust_no,
      cust_ac_no: this.data.cust_ac_no,
      card_type: 'TP'
    };

    this.svcardService.getCardCreditByCustomer(req).subscribe(
      (response: any) => {
        this.dataSourceSubAccount = response.lstData;
        if (this.id != null && this.id != '') {
          //this.selectedSubAccounts = this.dataSourceSubAccount.map((x: { card_number: any; }) => x.card_number);
          this.selectedSubAccounts = this.selectedSubAccounts;
        }
        else {
          this.selectedSubAccounts = this.dataSourceSubAccount.map((x: { card_number: any; }) => x.card_number);
        }
      },
      err => {
        console.log(new Date(), err);
      }
    );
  }
  cardTypeChange(event: any) {
    // this.data.card_name = '';
    // this.data.card_old_no = '';
    // this.data.card_new_no = '';
    if (this.selectedCardType == 'credit') {
      this.subCardList();
    }
    if (event != null && event.value != null && event.value != '') {
      var req = {
        cust_no: this.data.cust_no,
        cust_ac_no: this.data.cust_ac_no,
        card_type: event.value,
        service_code: '302'
      };
      const apiCall = this.selectedCardType == 'debit'
        ? this.svcardService.getCardByCustomer(req)
        : this.svcardService.getCardCreditByCustomer(req);

      apiCall.subscribe(
        (response: any) => {
          console.log(new Date() + ": ", response);
          if (response.lstData == null || response.lstData.length == 0) {
            this.data.card_name = '';
            this.data.release_form = '';
            this.data.card_old_no = '';
            this.data.card_new_no = '';
            this.notificationService.alertError("Không tìm thấy thẻ của khách hàng!");
          }
          else {
            this.dataCardOld = response.lstData;
            this.data.card_old_no = this.dataCardOld[0].card_number;
            this.cardOldChange({ value: this.data.card_old_no });
          }
        },
        err => {
          console.log(new Date(), err);
          this.data.card_type = '';
          this.data.card_name = '';
          this.data.release_form = '';
          this.data.card_old_no = '';
          this.data.card_new_no = '';
          this.notificationService.alertError(err.error);
        }
      );
    }
  }
  cardOldChange(event: any) {
    if (event != null && event.value != null && event.value != '') {
      var item = this.dataCardOld.find(x => x.card_number === event.value);
      if (item != null) {
        this.data.card_id = item.card_id;
        this.data.card_name = item.embossed_name;
        this.data.product_code = item.product_code;
        this.data.product_name = item.product_name;
        this.data.release_form = item.release_form;
        this.data.payment_account = item.accountNo;
        this.data.card_class = item.card_class;
        this.isOnlineDebit = item.register_online_payment
        this.isOnlineRegistration = item.register_auto_debit

        this.data.credit_card_limit = item.credit_card_limit;
        this.data.registration_limit = item.registration_limit;
        this.data.debt_ratio = item.debt_ratio;
        this.data.form_of_guarantee = item.form_of_guarantee;
        if (this.data.card_type == 'TP') this.data.sub_cust_name = item.owner_name;
      }
    }
  }
  releaseFormChange(event: any) {
    if (event != null && event.value != null && event.value != '') {
      if (event.value == 'EVNT0122')
        this.data.card_new_no = this.data.card_old_no;
      else this.data.card_new_no = '';
    }
  }
  create() {

    var req: any = {
      rlos_id: this.rlosId,
      cust_no: this.data.cust_no,
      card_no: this.data.card_old_no,
      card_new_no: this.data.card_new_no,
      card_type: this.data.card_type,
      card_name: this.data.card_name,
      release_form: this.data.release_form,
      product_code: this.data.product_code,
      cust_ac_no: this.accountSelected,
      auth_id: this.data.auth_id,
      agent_code: this.data.agent_code,
      sub_cust_name: this.data.sub_cust_name
    }
    var reqCredit: any = {
      rlos_id: this.rlosId,
      cust_no: this.data.cust_no,
      card_no: this.data.card_old_no,
      card_new_no: this.data.card_new_no,
      card_type: this.data.card_type,
      card_name: this.data.card_name,
      release_form: this.data.release_form,
      product_code: this.data.product_code,
      cust_ac_no: this.accountSelected,
      auth_id: this.data.auth_id,
      agent_code: this.data.agent_code,
      sub_cust_name: this.data.sub_cust_name,
      credit_card_limit: this.data.credit_card_limit,
      registration_limit: this.data.registration_limit,
      debt_ratio: this.data.debt_ratio,
      payment_account: this.data.payment_account,
      register_online_payment: this.isOnlineRegistration,
      register_auto_debit: this.isOnlineDebit,
      sub_card_list: this.selectedSubAccounts,
      reason: this.data.reason,

    }
    console.log('req: ', req);
    const apiCall = this.selectedCardType == 'debit'
      ? this.svcardService.createCardReNew(req)
      : this.svcardService.createCardCreditReNew(reqCredit);

    apiCall.subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.data.reference_no = data.reference_no;
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
      id: this.id
    }
    console.log('req: ', req);
    const apiCall = this.selectedCardType == 'debit'
      ? this.svcardService.authCardReNew(req)
      : this.svcardService.authCardCreditReNew(req);

    apiCall.subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
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
      id: this.id
    }
    console.log('req: ', req);
    const apiCall = this.selectedCardType == 'debit'
      ? this.svcardService.rejectCardReNew(req)
      : this.svcardService.rejectCardCreditReNew(req);

    apiCall.subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
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
      id: this.id
    }
    console.log('req: ', req);
    const apiCall = this.selectedCardType == 'debit'
      ? this.svcardService.cancelCardReNew(req)
      : this.svcardService.cancelCardCreditReNew(req);

    apiCall.subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.loadButton("C");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  getStepCount(): number {
    let count = 2; // Always have first 2 steps
    // if (this.isSelectedCredit || this.selectedCardType === 'credit') {
    //   count = 3;
    // }
    return count;
  }
}
