import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpdeskService } from 'src/app/services/helpdesk.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenService } from 'src/app/services/token.services';
import { CusInfoDto } from 'src/app/shared/models/helpdesk/cus.info.dto';
import { InsertResponseReq } from 'src/app/shared/models/helpdesk/insert.response.req';
import { IssueDetail } from 'src/app/shared/models/helpdesk/issue.detail';

@Component({
  selector: 'app-response-new',
  templateUrl: './response-new.component.html',
  styleUrl: './response-new.component.scss'
})
export class ResponseNewComponent {
  issueid: string = "";
  reqSave: InsertResponseReq = new InsertResponseReq();
  issueDetail: IssueDetail = new IssueDetail();
  dataPriorities: any = [];
  dataStatus: any = [];
  dataReceiver: any = [];
  dataGroupReceive: any = [];
  dataBranch: any = [];
  userInfoFromToken: any = {};
  infoResponseHist: IssueDetail = new IssueDetail();
  response_desc_hist = '';
  response_date_create_hist = '';
  response_filename_hist = '';
  response_fileData_hist: string[] = [];
  response_priority_hist = '';
  response_status_hist = '';
  response_txn_amount_hist = '';
  response_txn_qualtity_hist = '';
  response_user_create_hist = '';
  response_user_receive_hist = '';
  isApproveBtnDisble: boolean = false;
  isApproveBtnHidden: boolean = true;
  isSaveBtnDisble: boolean = false;
  isSaveBtnHidden: boolean = true;
  isPopupVisible: boolean = false;
  clientInfo: CusInfoDto = new CusInfoDto();
  htmlContent: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = "";
  fileUrls: { file: File, url: string }[] = [];
  fileIssueDetail: File[] = []; 
  fileResponseHist: File[] = []; 

  constructor(
    private route: ActivatedRoute,
    private helpdeskService: HelpdeskService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private router: Router
  ){}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.issueid = params['issueid'] || '';

      this.reqSave.issue_id = this.issueid;
    });

    this.loadFiler();

    if (this.issueid != '') {
      var req: any = {
        issueid: this.issueid
      }

      this.helpdeskService.loadIssueDetailFilter(req).subscribe(
        (response: any) => {
          console.log(new Date() + ": ", response);

          this.issueDetail.issue_desc = response.issue_desc;
          this.issueDetail.issue_name = response.issue_name;
          this.issueDetail.user_submit = response.user_submit;
          this.issueDetail.date_submit = response.date_submit;
          this.issueDetail.user_receive = response.user_receive;
          this.issueDetail.group_receive = response.group_receive;
          this.issueDetail.prioity = response.prioity;
          this.issueDetail.status = response.status;
          this.issueDetail.branch = response.branch;
          this.issueDetail.scr_reference = response.scr_reference;
          this.issueDetail.filename = response.filename;
          this.issueDetail.fileData = response.fileData;

          this.isApproveBtnDisble = response.approved === "1";
          this.isSaveBtnDisble = response.status_id === "3";

          this.reqSave.issue_name = response.issue_name;
          this.reqSave.assign_group = response.group_receive;

          this.fileIssueDetail = this.convertArrayFileDataBase64ToArrayFile(this.issueDetail.fileData, this.issueDetail.filename)

          if (this.issueDetail.scr_reference != null && this.issueDetail.scr_reference != "") {
            var reqClientInfo: any = {
              scr_reference: this.issueDetail.scr_reference
            }
            this.helpdeskService.getClientInfoQuery(reqClientInfo).subscribe(
              (resInfo: any) => {
                console.log(new Date() + ": ", resInfo);
                
                this.reqSave.client_id = resInfo.client_code
                this.clientInfo.client_code = resInfo.client_code
                this.reqSave.card_number = resInfo.card_number
                this.clientInfo.card_number = resInfo.card_number
                this.clientInfo.address_1 = resInfo.address1
                this.clientInfo.address_2 = resInfo.address2
                this.clientInfo.address_3 = resInfo.address3
                this.clientInfo.address_4 = resInfo.address4
                this.clientInfo.full_name = resInfo.client_name
                this.clientInfo.product = resInfo.description
                this.clientInfo.legal_id = resInfo.legal_id
                this.clientInfo.type_card = resInfo.card_type
                this.clientInfo.birth_date = resInfo.birth_date
                this.clientInfo.date_expiry = resInfo.expiry_date
                this.clientInfo.account_num = resInfo.account_num
                this.clientInfo.city = resInfo.city_name
                this.clientInfo.name_print_card = resInfo.embossed_name
                this.clientInfo.date_active = resInfo.delivery_date
                this.clientInfo.country = resInfo.country_name
                this.clientInfo.branch = resInfo.branch_code
                this.clientInfo.status_card = resInfo.card_status
                this.clientInfo.embossed_card_status = resInfo.delivery_flag

              },
              err => {

              }
            );
          }
        },
        err => {
          console.log(new Date(), err);
          this.notificationService.alertError(err.error); 
        }
      )
    }

    this.userInfoFromToken = this.tokenService.getInfomationFromLocalStorage();
    this.reqSave.branch_code = this.userInfoFromToken.branhcode;
  }

  loadFiler() {
    var req: any = {
      issueid: this.issueid
    }

    this.helpdeskService.getResponseNewFilter(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.dataPriorities = response.dataPriorities;
        this.dataStatus = response.dataStatus;
        this.dataReceiver = [{ value: '', text: 'Chọn User -' }, ...response.dataReceiver];
        this.dataGroupReceive = [{ value: '', text: 'Chọn nhóm người dùng -' }, ...response.dataGroupReceive];
        this.dataBranch = [{ value: '', text: 'Chọn nhóm đơn vị -' }, ...response.dataBranch];

        this.response_desc_hist = response.response_desc_hist;
        this.response_date_create_hist = response.date_create_hist;
        this.response_filename_hist = response.filename_hist;
        this.response_fileData_hist = response.fileData_hist;
        this.response_priority_hist = response.priority_hist;
        this.response_status_hist = response.status_hist;
        this.response_txn_amount_hist = response.txn_amount_hist;
        this.response_txn_qualtity_hist = response.txn_qualtity_hist;
        this.response_user_create_hist = response.user_create_hist;
        this.response_user_receive_hist = response.user_receive_hist;

        this.isApproveBtnHidden = response.isApproveBtnHidden;
        this.isSaveBtnHidden = response.isSaveBtnHidden;

        this.fileResponseHist = this.convertArrayFileDataBase64ToArrayFile(this.response_fileData_hist, this.response_filename_hist)

        if (response.response_hist_get != null && response.response_hist_get != '') {
          this.htmlContent = response.response_hist_get;
        }
      },
      err => {
        console.log(new Date(), err);
      }
    )
  }

  convertArrayFileDataBase64ToArrayFile(base64Array: string[], filenameString: string): File[] {
    const filenames: string[] = filenameString.split(';').filter(name => name);
    const files: File[] = [];

    for (let i = 0; i < base64Array.length; i++) {
      const base64Data = base64Array[i].trim();
      const filename = filenames[i] || `file_${i}`; // fallback name
    
      const bstr = atob(base64Data);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
    
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
    
      const file = new File([u8arr], filename);
      files.push(file);
    }

    return files;
  }

  downloadFile(file: File) {
    const url = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  displayItemSelect = (item: any) => {
    return item ? `${item.value} - ${item.text}` : '';
  };

  displayBasicItemSelect = (item: any) => {
    return item ? `${item.text}` : '';
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // this.reqSave.filename = file.name; // Hiển thị tên file bên cạnh nút
      // this.reqSave.fileUpload = file;

      this.selectedFileName = file.name;
      this.selectedFile = file;

      this.addFile();
    }
  }

  addFile(): void {
    if (this.selectedFile) {
      // Kiểm tra nếu file đã tồn tại thì không thêm lại
      const isDuplicate = this.reqSave.fileUploads.some(file => file.name === this.selectedFile?.name);
      if (!isDuplicate) {
        this.reqSave.fileUploads.push(this.selectedFile);

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
    this.reqSave.fileUploads.splice(index, 1);
    this.fileUrls.splice(index, 1);
  }

  onCheckboxMailGroupReceiveChange() {
    this.reqSave.is_send_mail_group_receive = this.reqSave.is_send_mail_receiver === 1 ? 0 : 1;
  }

  onCheckboxMailReceiverChange() {
    this.reqSave.is_send_mail_receiver = this.reqSave.is_send_mail_receiver === 1 ? 0 : 1;
  }

  hasResponseData(): boolean {
    return [
      this.response_desc_hist,
      this.response_user_create_hist,
      this.response_date_create_hist,
      this.response_user_receive_hist,
      this.response_priority_hist,
      this.response_status_hist,
      this.response_txn_qualtity_hist,
      this.response_txn_amount_hist,
      this.response_filename_hist
    ].some(value => value !== null && value !== '');
  }

  Save() {
    console.log('Req save: ', this.reqSave);

    this.reqSave.filename = this.reqSave.fileUploads.map(item => item.name).join(';');

    const formData = new FormData();
    formData.append('issue_id', this.reqSave.issue_id);
    formData.append('response_detail', this.reqSave.response_detail);
    formData.append('assigned_to', this.reqSave.assigned_to);
    formData.append('priority', this.reqSave.priority);
    formData.append('status', this.reqSave.status);
    formData.append('branch_code', this.reqSave.branch_code);
    formData.append('assign_group', this.reqSave.assign_group);
    formData.append('txn_qualtity', this.reqSave.txn_qualtity);
    formData.append('txn_amount', this.reqSave.txn_amount);
    formData.append('filename', this.reqSave.filename);
    formData.append('issue_name', this.reqSave.issue_name);
    formData.append('is_send_mail_receiver', this.reqSave.is_send_mail_receiver.toString());
    formData.append('is_send_mail_group_receive', this.reqSave.is_send_mail_group_receive.toString());
    formData.append('card_number', this.reqSave.card_number);
    formData.append('client_id', this.reqSave.client_id);
    formData.append('client_type', this.reqSave.client_type);
    
    this.reqSave.fileUploads.forEach((file: File) => {
      formData.append('fileUploads', file);
    });

    this.helpdeskService.insertResponse(formData).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.notificationService.alertSussess(response.resDesc)

        setTimeout(() => {
          window.location.reload();
        }, 1000); 
        
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    )
  }

  Approve() {
    this.reqSave.filename = this.reqSave.fileUploads.map(item => item.name).join(';');

    const formData = new FormData();
    formData.append('issue_id', this.reqSave.issue_id);
    formData.append('response_detail', this.reqSave.response_detail);
    formData.append('assigned_to', this.reqSave.assigned_to);
    formData.append('priority', this.reqSave.priority);
    formData.append('status', this.reqSave.status);
    formData.append('branch_code', this.reqSave.branch_code);
    formData.append('assign_group', this.reqSave.assign_group);
    formData.append('txn_qualtity', this.reqSave.txn_qualtity);
    formData.append('txn_amount', this.reqSave.txn_amount);
    formData.append('filename', this.reqSave.filename);
    formData.append('issue_name', this.issueDetail.issue_name);
    formData.append('is_send_mail_receiver', this.reqSave.is_send_mail_receiver.toString());
    formData.append('is_send_mail_group_receive', this.reqSave.is_send_mail_group_receive.toString());
    formData.append('call_ref_no', this.issueDetail.scr_reference);
    
    this.reqSave.fileUploads.forEach((file: File) => {
      formData.append('fileUploads', file);
    });

    this.helpdeskService.authResponse(formData).subscribe(
      (response) => {
        console.log(new Date() + ": ", response);

        this.notificationService.alertSussess(response.resDesc);

        setTimeout(() => {
          window.location.reload();
        }, 1000); 
      },
      err => {
        console.log(new Date(), err);

        this.notificationService.alertError(err.error);
      }
    )
  }

  TransactionDetail() {
    this.isPopupVisible = true
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

  BackPage() {
    window.history.back();
  }

  Print() {
    
  }
}
