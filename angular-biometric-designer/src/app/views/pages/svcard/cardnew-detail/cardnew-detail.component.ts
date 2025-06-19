import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
@Component({
  selector: 'app-cardnew-detail',
  templateUrl: './cardnew-detail.component.html',
  styleUrls: ['./cardnew-detail.component.scss']
})
export class CardnewDetailComponent implements OnInit {
  @ViewChild('dataGridCust') dataGridCust: DataGridControlComponent;
  @ViewChild('dataGridAcc') dataGridAcc: DataGridControlMiniComponent;
  @ViewChild('dataGridCollateral') dataGridCollateral: DataGridControlMiniComponent;
  id: string = '';
  rlosId: string = '';
  authDefault: string = '';
  reqListCust: CustomerListReq = new CustomerListReq();
  lengthCust = 0;
  dataSourceCust: any = {};
  dataSourceAcc: any = {};
  dataSourceCollateral: any = {};

  isSelectedCust: boolean = false;
  selectedCardType: string = 'debit'; // Mặc định chọn "Thẻ ghi nợ"

  isOnlineRegistration: boolean = false;
  isOnlineDebit: boolean = false;

  columnsCust: Array<dxDataGridColumn | string> = [{
    dataField: 'local_branch',
    caption: 'Mã chi nhánh',
    width: 100,
    allowSorting: false
  }, {
    dataField: 'customer_no',
    caption: 'Mã khách hàng',
    width: 150,
    allowSorting: false
  }, {
    dataField: 'full_name',
    caption: 'Tên khách hàng',
    width: 230,
    allowSorting: false
  }, {
    dataField: 'telephone',
    caption: 'Số điện thoại',
    width: 150,
    allowSorting: false
  }, {
    dataField: 'unique_id_value',
    caption: 'Số GTTT',
    width: 150,
    allowSorting: false
  }, {
    dataField: 'birthday',
    caption: 'Ngày sinh',
    width: 150,
    allowSorting: false
  }, {
    dataField: 'address_line1',
    caption: 'Địa chỉ',
    allowSorting: false,
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
    width: 300,
    allowSorting: false
  }, {
    dataField: 'branch_code',
    caption: 'Chi nhánh',
    allowSorting: false,
    minWidth: 250,
    // cellTemplate: (container, cellInfo) => {
    //   container.textContent = cellInfo.data.branch_code + ' - ' + cellInfo.data.branch_name;
    // }
  }, {
    dataField: '',
    caption: 'Trạng thái',
    allowSorting: false,
    width: 200,
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

      // Gán thuộc tính disabled nếu bảng đang bị disable
      const isDisabled = this.id != null && this.id !== '';
      if (isDisabled) {
        this.renderer.setAttribute(checkbox, 'disabled', 'true');
      }

      // Thêm sự kiện click để toggle checkbox khi click vào checkbox hoặc row
      const toggleCheckbox = () => {
        if (!isDisabled) {
          this.accountSelected = cellInfo.data.accountNo;
          checkbox.checked = true; // Chỉ chọn 1 checkbox
        }
      };

      this.renderer.listen(checkbox, 'click', toggleCheckbox);
      this.renderer.listen(container, 'click', toggleCheckbox);

      container.appendChild(checkbox);
    },
  }
  ];

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
  data: CardNewDto = new CardNewDto();
  dataCardType: any[] = CONST.dataCardType;
  dataCardClass: any[] = CONST.dataCardClass;
  dataFormOfGuarantee: any[] = CONST.dataFormOfGuarantee;
  dataBranchs: any[] = [];
  dataProducts: any[] = [];
  dataCreditProducts: any[] = [];
  dataUserAuths: any[] = [];
  dataCountrys: any[] = [];
  dataCitys: any[] = [];

  isSaveSuccess = false;

  constructor(
    public svcardService: svCardService,
    public cbsService: CBSService,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private buttonService: ButtonService,
    private router_p: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    this.router_p.queryParams.subscribe(params => {
      if (params['id'] != null) {
        this.id = params['id'];
      }

      if (params['rlosId'] != null) {
        this.rlosId = params['rlosId'];
      }
    });

    if (this.id != null && this.id != '') {
      this.isSelectedCust = true;
    }
    else {
      this.isSelectedCust = false;
    }
    //this.reqListCust.pagesize = 5;
    let data = this.tokenService.getInfomationFromLocalStorage();
    this.data.branch_code = data.branhcode;
    this.data.country_code = "704";
    this.data.city_code = "HNI";
    this.data.card_type = "TC";
    if (this.rlosId != null && this.rlosId != '')
      this.loadDataRlosDetail();
    else
      this.loadDataDetail();

    this.setButtons(true, false, false, false, true, false);
  }

  loadDataDetail() {
    var req = {
      id: this.id
    };

    this.svcardService.getCardNewDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data.batch_num = res.batch_num;
        this.dataBranchs = res.branchs;
        this.dataProducts = res.products;
        this.dataUserAuths = res.userauths;
        this.dataCountrys = res.countrys;
        this.dataCitys = res.citys;
        this.dataCreditProducts = res.creditProducts;

        if (res.data.cust_no == null || res.data.cust_no == '')
          this.data.agent_code = this.data.branch_code;
        else {
          this.data = res.data;
          this.dataSourceAcc = res.custAcc;
          this.accountSelected = res.data.cust_ac_no;
          this.dataGridAcc.dataGrid.instance.refresh();
          this.data.cust_type = this.commonService.getNameById('CUST_TYPE', res.data.cust_type);
        }
        this.loadButton(res.data.auth_stat);

        if (res.data.card_category == 'C') {
          this.selectedCardType = 'credit';

          this.data.credit_product_code = res.data.product_code;
          this.data.card_no = res.data.card_no;
          this.data.unique_id_date = this.commonService.convertToIsoDate(res.data.unique_id_start_date);
          this.data.unique_id_date = res.data.unique_id_start_date;
          this.data.expired_unique_id_date = res.data.unique_id_expiry_date;
          this.data.card_class = res.data.card_class;
          this.data.form_of_guarantee = res.data.form_of_guarantee;
          this.isOnlineRegistration = res.data.register_online_payment === '1';
          this.isOnlineDebit = res.data.register_auto_debit === '1';
          this.data.credit_card_limit = res.data.card_limit;
          this.data.registration_limit = res.data.card_limit_register;
          this.data.debt_ratio = res.data.auto_debit_rate;
          this.data.payment_account = res.data.payment_account;
          this.data.description = res.data.description;
          this.data.main_card_no = res.data.main_card_no;
          this.data.sub_card_holder_name = res.data.sub_card_holder_name;
          this.data.primary_cardholder_relationship = res.data.primary_cardholder_relationship;
          this.data.unique_id_sub = res.data.unique_id_sub;
          this.data.unique_id_start_date_sub = res.data.unique_id_start_date_sub;
          this.data.birth_date_sub = res.data.birth_date_sub;
          this.data.loan_account = res.data.loan_account;

          this.data.auth_stat_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', res.data.auth_stat);
        }
        else {
          this.selectedCardType = 'debit';

          this.data.auth_stat_text = this.commonService.getNameById('AUTH_STATUS', res.data.auth_stat);
        }
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
    this.svcardService.getCardNewRlosDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);

        this.data.batch_num = res.batch_num;
        this.dataBranchs = res.branchs;
        this.dataProducts = res.products;
        this.dataUserAuths = res.userauths;
        this.dataCountrys = res.countrys;
        this.dataCitys = res.citys;

        if (res.data.cust_no == null || res.data.cust_no == '')
          this.data.agent_code = this.data.branch_code;
        else {
          this.data = res.data;
          // this.dataSourceAcc = res.custAcc;
          this.reqListCust.cifNo = res.data.cust_no;
          this.reqListCust.cifName = res.data.cust_name;
          this.reqListCust.uniqueId = res.data.unique_id_value;


          this.searchCust();

          if (res.custAcc && res.custAcc.length > 0) {
            this.accountSelected = res.custAcc[0].accountNo;
          }
          this.dataGridAcc.dataGrid.instance.refresh();
          this.data.cust_type = this.commonService.getNameById('CUST_TYPE', res.data.cust_type);
        }
        this.loadButton('');
        this.data.auth_stat_text = '';
        this.data.country_code = "704";
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
        this.router.navigate(['/svcard/cardnew-list'], {});
      } else {
        this.isSelectedCust = false;
      }
    } else if (event === 'REFRESH') {
      window.location.reload();
    }
  }
  isSearchButtonClicked: boolean = false;
  handleSearchClick() {
    this.isSearchButtonClicked = true; // Bật cờ
    this.searchCust(); // Gọi hàm search chính
  }
  searchCust() {
    if (this.reqListCust.isFistLoad !== '1') {
      this.reqListCust.isFistLoad = '1';
      return;
    }

    if (this.isSearchButtonClicked) {
      if (this.dataGridCust.pageIndex == 0) {
        this.fetchCustomerList();
      }
      this.dataGridCust.dataGrid.instance.pageIndex(0); // Cập nhật UI
      this.isSearchButtonClicked = false;
    }
    else {
      this.fetchCustomerList();
    }

  }

  fetchCustomerList() {
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
  custSelected(rowData: any) {
    var req = {
      custNo: rowData.data.customer_no
    };
    this.svcardService.getCustomerDetail(req).subscribe(
      (response: any) => {
        if (response.lstAcc && response.lstAcc.length > 0) {
          this.accountSelected = response.lstAcc[0].accountNo;
          //this.data.cust_ac_no = response.lstAcc[0].accountNo;
        }
        console.log(new Date() + ": ", response);
        this.data.cust_no = rowData.data.customer_no;
        this.data.cust_name = response.fullname;
        this.data.unique_id_value = response.unique_id;
        this.data.unique_id_date = this.commonService.convertToIsoDate(response.unique_id_date);
        this.data.birth_day = this.commonService.convertToIsoDate(response.birthday);
        this.data.card_name = response.fullname;
        this.data.card_name_sub = response.fullname;
        this.data.cust_type = this.commonService.getNameById('CUST_TYPE', response.cust_type);
        this.data.user_branch = response.account_branch;
        this.data.address_1 = response.address_1;
        this.data.address_2 = response.address_2;
        this.data.address_3 = response.address_3;
        this.data.address_4 = response.address_4;
        //this.data.city_code = response.city_code;
        this.data.cust_mobile = response.phone_mobile;
        this.data.cust_phone = response.phone_home;
        this.dataSourceAcc = response.lstAcc;

        this.isSelectedCust = true;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  accSelection(event: any) {
    this.accountSelected = event.selectedRowKeys[0].accountNo;
    console.log('hien tuong select')
    this.dataGridAcc.dataGrid.instance.refresh();
  }
  
  create() {
    //Đăng ký thẻ ghi nợ
    if (this.selectedCardType == 'debit') {
      var req: any = {
        rlos_id: this.rlosId,
        cust_no: this.data.cust_no,
        card_num: this.data.card_no,
        card_type: this.data.card_type,
        card_name: this.data.card_name,
        product_code: this.data.product_code,
        country: this.data.country_code,
        province: this.data.city_code,
        cust_phone: this.data.cust_phone,
        cust_mobile: this.data.cust_mobile,
        cust_ac_no: this.accountSelected,
        cust_ac_branch: this.data.user_branch,
        auth_id: this.data.auth_id,
        agent_code: this.data.agent_code,
        card_name_sub: this.data.card_name_sub
      }
      console.log('req: ', req);
      this.svcardService.createCardNew(req).subscribe(
        data => {
          console.log(new Date(), data);
          this.id = data.id;
          this.data.reference_no = data.reference_no;
          // this.loadData();
          this.loadButton("U");
          this.notificationService.alertSussess(data.resDesc);

          this.isSaveSuccess = true;
        },
        err => {
          console.log(Date(), err);
          this.notificationService.alertError(err.error);
        }
      );
    }
    //Đăng ký thẻ tín dụng
    else {
      var req_credit: any = {
        rlos_id: this.rlosId,
        product_code: this.data.credit_product_code,
        card_no: this.data.card_no,
        cust_no: this.data.cust_no,
        unique_id: this.data.unique_id_value,
        unique_id_start_date: this.data.unique_id_date,
        unique_id_expiry_date: this.data.expired_unique_id_date,
        birth_date: this.data.birth_day,
        branch_code: this.data.branch_code,
        branch_agent: this.data.agent_code,
        branch_account: this.data.user_branch,
        card_type: this.data.card_type,
        card_class: this.data.card_class,
        form_guarantee: this.data.form_of_guarantee,
        card_holder_name: this.data.card_name_sub,
        name_print_card: this.data.card_name,
        main_card_no: this.data.main_card_no,
        sub_card_holder_name: this.data.sub_card_holder_name,
        primary_cardholder_relationship: this.data.primary_cardholder_relationship,
        unique_id_sub: this.data.unique_id_sub,
        unique_id_start_date_sub: this.data.unique_id_start_date_sub,
        birth_date_sub: this.data.birth_date_sub,
        description: this.data.description,
        country: this.data.country_code,
        province: this.data.city_code,
        phone_mobile_number: this.data.cust_mobile,
        phone_home_number: this.data.cust_phone,
        affiliate_code: '',
        collateral_value: '',
        content: '',
        cust_ac_no: this.data.cust_ac_no,
        borrow_account_dual: '',
        card_limit: this.data.credit_card_limit.toString(),
        register_online_payment: this.isOnlineRegistration ? '1' : '0',
        card_limit_register: this.data.registration_limit.toString(),
        register_auto_debit: this.isOnlineDebit ? '1' : '0',
        auto_debit_rate: this.data.debt_ratio,
        payment_account: this.data.payment_account,
        auth_id: this.data.auth_id,
      }

      console.log('req_credit: ', req_credit);
      this.svcardService.createCreditCard(req_credit).subscribe(
        data => {
          console.log(new Date(), data);
          this.loadButton("U");
          this.notificationService.alertSussess(data.resDesc);

          this.id = data.id;
          this.data.reference_no = data.reference_no;
          this.data.auth_stat = data.status_transaction;
          this.data.auth_stat_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', data.status_transaction);

          this.isSaveSuccess = true;
        },
        err => {
          console.log(Date(), err);
          this.notificationService.alertError(err.error);
        }
      );
    }
  }

  auth() {
    //Duyet thẻ ghi nợ
    if (this.selectedCardType == 'debit') {
      var req: any = {
        id: this.id
      }
      console.log('req: ', req);
      this.svcardService.authCardNew(req).subscribe(
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
    //Duyệt thẻ tín dụng 
    else {
      var req_credit: any = {
        id: this.id
      }
      console.log('req_credit: ', req_credit);

      //KSV duyet
      if (this.data.auth_stat == 'W') {
        this.svcardService.inspectorAuthCreditCard(req_credit).subscribe(
          data => {
            console.log(new Date(), data);
            this.id = data.id;
            this.loadButton("A");
            this.notificationService.alertSussess(data.resDesc);

            this.data.auth_stat = data.status_transaction;
            this.data.auth_stat_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', data.status_transaction);
          },
          err => {
            console.log(Date(), err);
            this.notificationService.alertError(err.error);
          }
        );
      }
      //TTT duyet
      else if (this.data.auth_stat == 'KA') {
        this.svcardService.cardCenterAuthCreditCard(req_credit).subscribe(
          data => {
            console.log(new Date(), data);
            this.id = data.id;
            this.loadButton("A");
            this.notificationService.alertSussess(data.resDesc);

            this.data.auth_stat = data.status_transaction;
            this.data.auth_stat_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', data.status_transaction);
          },
          err => {
            console.log(Date(), err);
            this.notificationService.alertError(err.error);
          }
        );
      }
      else {
        this.notificationService.alertError("Trạng thái thẻ không hợp lệ để duyệt");
      }
    }
  }

  reject() {
    //Từ chối thẻ ghi nợ
    if (this.selectedCardType == 'debit') {
      var req: any = {
        id: this.id
      }
      console.log('req: ', req);
      this.svcardService.rejectCardNew(req).subscribe(
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
    //Từ chối thẻ tín dụng
    else {
      var req_credit: any = {
        id: this.id
      }
      console.log('req_credit: ', req_credit);

      //KSV tu choi
      if (this.data.auth_stat == 'W') {
        this.svcardService.inspectorRejectCreditCard(req_credit).subscribe(
          data => {
            console.log(new Date(), data);
            this.id = data.id;
            this.loadButton("R");
            this.notificationService.alertSussess(data.resDesc);

            this.data.auth_stat = data.status_transaction;
            this.data.auth_stat_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', data.status_transaction);
          },
          err => {
            console.log(Date(), err);
            this.notificationService.alertError(err.error);
          }
        );
      }
      //TTT tu choi
      else if (this.data.auth_stat == 'KA') {
        this.svcardService.cardCenterRejectCreditCard(req_credit).subscribe(
          data => {
            console.log(new Date(), data);
            this.id = data.id;
            this.loadButton("R");
            this.notificationService.alertSussess(data.resDesc);

            this.data.auth_stat = data.status_transaction;
            this.data.auth_stat_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', data.status_transaction);
          },
          err => {
            console.log(Date(), err);
            this.notificationService.alertError(err.error);
          }
        );
      }
      else {
        this.notificationService.alertError("Trạng thái thẻ không hợp lệ để từ chối");
      }
    }
  }

  cancel() {
    //Hủy thẻ ghi nợ
    if (this.selectedCardType == 'debit') {
      var req: any = {
        id: this.id
      }
      console.log('req: ', req);
      this.svcardService.cancelCardNew(req).subscribe(
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
    //Hủy thẻ tín dụng
    else {
      var req_credit: any = {
        id: this.id
      }
      console.log('req_credit: ', req_credit);

      this.svcardService.cancelCreditCard(req_credit).subscribe(
        data => {
           console.log(new Date(), data);
          this.loadButton("C");
          this.notificationService.alertSussess(data.resDesc);

          this.id = data.id;
          this.data.auth_stat = data.status_transaction;
          this.data.auth_stat_text = this.commonService.getNameById('CREDIT_AUTH_STATUS', data.status_transaction);

          this.isSaveSuccess = true;
        },
        err => {
          console.log(Date(), err);
          this.notificationService.alertError(err.error);
        }
      );
    }
  }

  onCardNameSubChanged(e: any): void {
    if (this.data.card_type === 'TC') {
      this.data.card_name_sub = this.data.cust_name;
    }
  }
}
