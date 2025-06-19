import { Component, OnInit, ViewChild } from '@angular/core';
// import DevExpress from 'devextreme';
import { DxFileUploaderComponent } from 'devextreme-angular';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { DataGridControlMiniComponent } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import * as XLSX from 'xlsx';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-cardreleasebatch',
  templateUrl: './cardreleasebatch.component.html',
  styleUrl: './cardreleasebatch.component.scss'
})
export class CardreleasebatchComponent implements OnInit {
  @ViewChild('dataGrid') dataGrid: DataGridControlMiniComponent;
  @ViewChild('fileUploader') fileUploader: DxFileUploaderComponent;
  batch_num: any = '';
  auth_status: any = '';
  userauth: any = '';
  dataUserAuths: any[] = [];
  dataSource: any = {};
  columns: Array<dxDataGridColumn | string> = [{
    dataField: 'cust_no',
    caption: 'Mã khách hàng',
    width: 200
  }, {
    dataField: 'cust_ac_no',
    caption: 'Số tài khoản',
    minWidth: 200,
  }, {
    dataField: 'card_type',
    caption: 'Thẻ chính/Phụ',
    minWidth: 200,
  }, {
    dataField: 'card_name',
    caption: 'Tên in trên thẻ',
    minWidth: 400,
  }, {
    dataField: 'product_code',
    caption: 'Mã sản phẩm',
    minWidth: 200,
  }];
  constructor(
    public svcardService: svCardService,
    public notificationService: NotificationService,
    private commonService: CommonService,
    private buttonService: ButtonService
  ) {
  }
  ngOnInit(): void {
    this.loadDataDetail();
    this.setButtons(true);
  }
  setButtons(isSave: boolean) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave }
    ]);
  }
  loadDataDetail() {
    this.svcardService.getReleaseBatchDetail({}).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.batch_num = res.batch_num;
        this.dataUserAuths = res.userauths;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  downloadTemplate() {
    const link = document.createElement('a');
    link.href = '../assets/templates/IssueCardTemplate.xlsx';
    link.download = 'IssueCardTemplate.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  selectedFile: File | null = null;
  onValueChanged(event: any) {
    console.log('onValueChanged: ', event);
    this.selectedFile = null;
    this.dataSource = [];
    const files = event.value;
    if (files && files.length > 0) {
      const file = files[0];
      // Kiểm tra MIME type (chính xác hơn)
      const allowedMimeTypes = [
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
      ];

      if (!allowedMimeTypes.includes(file.type)) {
        // File không đúng định dạng MIME, hiển thị thông báo lỗi
        this.notificationService.alertError('Vui lòng chỉ upload file Excel (.xlsx hoặc .xls)');
        // Reset file uploader nếu muốn
        this.fileUploader.instance.reset();
        return;
      }
      console.log('File hợp lệ:', file);
      this.selectedFile = file; // Lưu file khi chọn
      this.processFile();
    }
  }
  reload() {
    this.fileUploader.instance.reset();
    this.selectedFile = null;
    this.dataSource = [];
  }
  processFile() {
    if (!this.selectedFile) {
      console.error("Chưa chọn file!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(2);
      console.log("Dữ liệu từ Excel:", jsonData);
      // Xác định số cột tối đa
      const maxColumns = 5; // Số cột cố định

      // Chuyển đổi dữ liệu sang List với các cột cố định
      var dataList = jsonData.map((row: any) => {
        while (row.length < maxColumns) {
          row.push(""); // Đảm bảo đủ số cột
        }
        return {
          cust_no: row[0] || "",
          cust_ac_no: row[1] || "",
          card_type: row[2] || "",
          card_name: row[3] || "",
          product_code: row[4] || ""
        };
      });
      this.dataSource = dataList;
    };
    reader.readAsBinaryString(this.selectedFile);
  }
  onClick(event: any) {
    if (event === 'CREATE') {
      this.create();
    }
  }
  create() {
    if (!this.selectedFile) {
      this.notificationService.alertError("Vui lòng chọn file dữ liệu!");
      return;
    }
    if (this.dataSource == null || this.dataSource.length == 0) {
      this.notificationService.alertError("Vui lòng nhập tối thiểu 1 dòng dữ liệu!");
      return;
    }
    const formData = new FormData();
    formData.append('fileUpload', this.selectedFile);
    formData.append('auth_id', this.userauth);
    this.svcardService.createCardReleaseBatch(formData).subscribe(
      data => {
        console.log(new Date(), data);
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
}
