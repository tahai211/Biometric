import { Component, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
//import DevExpress from 'devextreme';
import { formatDate } from 'devextreme/localization';
import { HelpdeskService } from 'src/app/services/helpdesk.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenService } from 'src/app/services/token.services';
import { DataGridControlMiniComponent } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import { CusInfoDto } from 'src/app/shared/models/helpdesk/cus.info.dto';
import { CusInfoReq } from 'src/app/shared/models/helpdesk/cus.info.req';
import { InsertIssueReq } from 'src/app/shared/models/helpdesk/insert.issue.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';

@Component({
  selector: 'app-add-issue-new',
  templateUrl: './add-issue-new.component.html',
  styleUrl: './add-issue-new.component.scss'
})
export class AddIssueNewComponent {
  @ViewChild('dataGridCust') dataGridCust: DataGridControlMiniComponent;
  reqInsertIssue: InsertIssueReq = new InsertIssueReq();
  reqListCustomer: CusInfoReq = new CusInfoReq();
  userInfoFromToken: any = {};
  userCreate: string = '';
  currentDate: string = formatDate(new Date(), 'dd/MM/yyyy');
  dataSource: any = {};
  dataSupportService: any = [];
  dataPriorities: any = [];
  dataStatus: any = [];
  dataUserReceive: any = [];
  dataGroupReceive: any = [];
  dataBranch: any = [];
  dataIssueServiceTypeF: any = [];
  dataIssueServiceTypeN: any = [];
  dataIssueServiceTypeO: any = [];
  dataCus: CusInfoDto = new CusInfoDto();
  clientCode_Info: string = '';
  cardNumber_Info: string = '';
  isPopupVisible: boolean = false;
  checkRoleUserGroup:boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = "";
  fileUrls: { file: File, url: string }[] = [];
  dataTypeService: any = [{"value": "F", "text": "GD tài chính"}, {"value": "N", "text": "GD phi tài chính"}, {"value": "O", "text": "GD khác"}];

  columns: Array<string | dxDataGridColumn> = [
    {
      dataField: 'account_num',
      caption: 'Số tài khoản',
    },
    {
      dataField: 'client_code',
      caption: 'Mã khách hàng',
    },
    {
      dataField: 'full_name',
      caption: 'Họ tên khách hàng',
    },
    {
      dataField: 'legal_id',
      caption: 'CCCD',
    },
    {
      dataField: 'birth_date',
      caption: 'Ngày sinh',
    },
    {
      dataField: 'card_number',
      caption: 'Số thẻ',
    },
    {
      dataField: 'type_card',
      caption: 'Thẻ Chính/Phụ',
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
          this.custSelected(cellInfo);
        });
        container.append(button);
      },
    }
  ]

  constructor(
    private tokenService: TokenService,
    private renderer: Renderer2,
    private helpdeskService: HelpdeskService,
    private notificationService: NotificationService,
    private router: Router
  ){}

  ngOnInit() {
    this.userInfoFromToken = this.tokenService.getInfomationFromLocalStorage()
    this.userCreate = this.userInfoFromToken.username.toUpperCase();
  
    this.loadFilter();
  }

  ngOnDestroy(): void {
    this.fileUrls.forEach(f => URL.revokeObjectURL(f.url));
  }

  loadFilter() {
    this.helpdeskService.getAddIssueNewFilter({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.dataPriorities = [{ value: '', text: '- Chọn mức độ -' }, ...response.dataPriorities];
        this.dataStatus = [{ value: '', text: '- Chọn trạng thái -' }, ...response.dataStatus];
        this.dataUserReceive = [{ value: '', text: 'Chọn User -' }, ...response.dataUserReceive];
        this.dataGroupReceive = [{ value: '', text: 'Chọn nhóm người dùng -' }, ...response.dataGroupReceive];
        this.dataBranch = [{ value: '', text: 'Chọn nhóm đơn vị -' }, ...response.dataBranch];
        this.dataIssueServiceTypeF = [{ value: '', text: '- Chọn dịch vụ -' }, ...response.dataIssueServiceTypeF];
        this.dataIssueServiceTypeN = [{ value: '', text: '- Chọn dịch vụ -' }, ...response.dataIssueServiceTypeN];
        this.dataIssueServiceTypeO = [{ value: '', text: '- Chọn dịch vụ -' }, ...response.dataIssueServiceTypeO];
        this.checkRoleUserGroup = response.checkRoleUserGroup;

        this.onRadioChange(this.reqInsertIssue.issue_type);

        this.reqInsertIssue.branch_code = this.userInfoFromToken.branhcode;
        this.reqInsertIssue.assign_group = 'TTT';
      },
      err => {
        console.log(new Date(), err);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // this.reqInsertIssue.filename = file.name; // Hiển thị tên file bên cạnh nút
      // this.reqInsertIssue.fileUpload = file;
      this.selectedFileName = file.name;
      this.selectedFile = file;

      this.addFile();
    }
  }

  addFile(): void {
    if (this.selectedFile) {
      // Kiểm tra nếu file đã tồn tại thì không thêm lại
      const isDuplicate = this.reqInsertIssue.fileUploads.some(file => file.name === this.selectedFile?.name);
      if (!isDuplicate) {
        this.reqInsertIssue.fileUploads.push(this.selectedFile);

        const url = URL.createObjectURL(this.selectedFile);
        this.fileUrls.push({ file: this.selectedFile, url });
      }
      else
      {
        this.notificationService.alertError("File trùng lặp");
      }
  
      // Reset tạm thời
      this.selectedFile = null;
      this.selectedFileName = "";
    }
  }

  removeFile(index: number) {
    this.reqInsertIssue.fileUploads.splice(index, 1);
    this.fileUrls.splice(index, 1);
  }

  displayItemSelect = (item: any) => {
    return item ? `${item.value} - ${item.text}` : '';
  };

  displayBasicItemSelect = (item: any) => {
    return item ? `${item.text}` : '';
  };

  onServiceChange(selectedValue: any) {
    const selectedItem = this.dataSupportService.find((item: any) => item.value === selectedValue);
    this.reqInsertIssue.issue_name = selectedItem ? selectedItem.text : '';
  }

  onRadioChange(selectedValue: string) {
    console.log("Radio button selected:", selectedValue);

    if (selectedValue == "F") {
      this.dataSupportService = this.dataIssueServiceTypeF;
    } else if (selectedValue == "N") {
      this.dataSupportService = this.dataIssueServiceTypeN;
    } else {
      this.dataSupportService = this.dataIssueServiceTypeO;
    }
  }

  onCheckboxMailReceiverChange() {
    this.reqInsertIssue.is_send_mail_receiver = this.reqInsertIssue.is_send_mail_receiver === 1 ? 0 : 1;
  }

  onCheckboxMailGroupReceiveChange() {
    this.reqInsertIssue.is_send_mail_group_receive = this.reqInsertIssue.is_send_mail_group_receive === 1 ? 0 : 1;
  }

  Save() {
    this.reqInsertIssue.filename = this.reqInsertIssue.fileUploads.map(item => item.name).join(';');

    //console.log('req Lưu: ', this.reqInsertIssue)
    const formData = new FormData();
    formData.append('issue_name', this.reqInsertIssue.issue_name);
    formData.append('issue_detail', this.reqInsertIssue.issue_detail);
    formData.append('assigned_to', this.reqInsertIssue.assigned_to);
    formData.append('priority', this.reqInsertIssue.priority);
    formData.append('status', this.reqInsertIssue.status);
    formData.append('version', this.reqInsertIssue.version);
    formData.append('filename', this.reqInsertIssue.filename);
    formData.append('branch_code', this.reqInsertIssue.branch_code);
    formData.append('assign_group', this.reqInsertIssue.assign_group);
    formData.append('issue_type', this.reqInsertIssue.issue_type);
    formData.append('service', this.reqInsertIssue.service);
    formData.append('approved', this.reqInsertIssue.approved);
    formData.append('is_send_mail_receiver', this.reqInsertIssue.is_send_mail_receiver.toString());
    formData.append('is_send_mail_group_receive', this.reqInsertIssue.is_send_mail_group_receive.toString());
    formData.append('card_no', this.reqInsertIssue.card_no);
    formData.append('client_code', this.reqInsertIssue.client_code);
    formData.append('txn_qual', this.reqInsertIssue.txn_qual);
    formData.append('carddp_amt', this.reqInsertIssue.carddp_amt);
    formData.append('banknet_amt', this.reqInsertIssue.banknet_amt);
    formData.append('txn_amt', this.reqInsertIssue.txn_amt);
    formData.append('device_id', this.reqInsertIssue.device_id);
    formData.append('trace_no', this.reqInsertIssue.trace_no);
    
    this.reqInsertIssue.fileUploads.forEach((file: File) => {
      formData.append('fileUploads', file);
    });

    console.log('req Lưu: ', formData)

    this.helpdeskService.insertIssue(formData).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        var issue_id = response.issue_id

        this.notificationService.alertSussess(response.resDesc)

        this.router.navigate([`/helpdesk/review-response-new`], { queryParams: { issueid: issue_id } });
      },
      err => {
        console.log(new Date(), err);

        this.notificationService.alertError(err.error);
      }
    );
  }

  Search() {
    this.helpdeskService.getInfoCustomer(this.reqListCustomer).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataSource = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  custSelected(rowData: any) {
    this.dataCus.account_num = rowData.data.account_num;
    this.clientCode_Info = rowData.data.client_code;
    this.dataCus.full_name = rowData.data.full_name;
    this.dataCus.legal_id = rowData.data.legal_id;
    this.dataCus.birth_date = rowData.data.birth_date;
    this.cardNumber_Info = rowData.data.card_number;
    this.dataCus.type_card = rowData.data.type_card;
    this.dataCus.date_active = rowData.data.date_active;
    this.dataCus.status_card = rowData.data.status_card;
    this.dataCus.actual_account_balance = rowData.data.actual_account_balance;
    this.dataCus.address_1 = rowData.data.address_1;
    this.dataCus.address_2 = rowData.data.address_2;
    this.dataCus.address_3 = rowData.data.address_3;
    this.dataCus.address_4 = rowData.data.address_4;
    this.dataCus.city = rowData.data.city;
    this.dataCus.country = rowData.data.country;
    this.dataCus.embossed_card_status = rowData.data.embossed_card_status;
    this.dataCus.available_account_balance = rowData.data.available_account_balance;
    this.dataCus.product = rowData.data.product;
    this.dataCus.date_expiry = rowData.data.date_expiry;
    this.dataCus.name_print_card = rowData.data.name_print_card;
    this.dataCus.branch = rowData.data.branch;
    this.dataCus.term_type = rowData.data.term_type;
  }

  onClientCodeInfoChange(value: string) {
    //this.clientCode_Info = value;
    this.reqInsertIssue.client_code = value;
    this.dataCus.client_code = value;
  }

  onCardNumberInfoChange(value: string) {
    //this.cardNumber_Info = value;
    this.reqInsertIssue.card_no = value;
    this.dataCus.card_number = value;

    console.log(this.reqInsertIssue);
  }

  TransactionDetail() {
    this.isPopupVisible = true
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}
