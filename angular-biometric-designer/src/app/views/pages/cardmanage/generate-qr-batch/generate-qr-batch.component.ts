import { Component, ElementRef, ViewChild } from '@angular/core';
// import DevExpress from 'devextreme';
import { NotificationService } from 'src/app/services/notification.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import * as ExcelJS from 'exceljs';
import { GenerateQRDto } from 'src/app/shared/models/cardmanage/generateQR.dto';
import { CardService } from 'src/app/services/card.service';
import * as saveAs from 'file-saver';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-generate-qr-batch',
  templateUrl: './generate-qr-batch.component.html',
  styleUrl: './generate-qr-batch.component.scss'
})
export class GenerateQrBatchComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  dataSource: any = [];
  req: any = {lst_create_qr: []};
  length = 0;
  fileUpload: File | null = null;
  filenameUpload: string = '';
  dataQrResponse: any = [];
  reqDisplay: any = {
    pageindex: 1,
    pagesize: 10
  };

  columns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'stt',
      caption: 'STT',
    },
    {
      dataField: 'branch_code',
      caption: 'Đơn vị',
    },
    {
      dataField: 'agent',
      caption: 'Agent',
    },
    {
      dataField: 'full_name',
      caption: 'Tên khách hàng',
    },
    {
      dataField: 'card_number',
      caption: 'Số thẻ',
    },
    {
      dataField: 'payment_number',
      caption: 'Số tài khoản',
    },
    {
      dataField: 'qr_string',
      caption: 'Mã QR',
    }
  ]

  constructor(
    private notificationService: NotificationService,
    private cardService: CardService,
  ) {

  }

  ngOnInit() {

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      this.notificationService.alertError('Vui lòng chọn tệp Excel hợp lệ (.xlsx hoặc .xls)');
      
      this.req = {
        lst_create_qr: []
      };

      return;
    }

    if (file) {
      this.filenameUpload = file.name; 
      this.fileUpload = file;

      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        
        this.req = {
          lst_create_qr: await this.createReqQR(arrayBuffer)
        };
      };
      reader.readAsArrayBuffer(file);
    }

    this.dataQrResponse = [];
    this.dataSource = [];
    this.length = 0;
  }

  async createReqQR(arrayBuffer: ArrayBuffer): Promise<GenerateQRDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const sheetCount = workbook.worksheets.length;
    if (sheetCount > 1) {
      this.notificationService.alertError('File Excel có nhiều hơn 1 sheet')
      
      this.filenameUpload = '';  
      this.fileUpload = null;

      return [];
    }

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      this.notificationService.alertError('Không tìm thấy sheet nào trong file Excel!')
      
      this.filenameUpload = '';  
      this.fileUpload = null;

      return [];
    }

    const expectedHeaders = ['STT', 'Đơn vị', 'Agent', 'Tên khách hàng', 'Số thẻ', 'Số TKTT']; 
    const fileHeaders: string[] = [];

    // Lấy tiêu đề từ dòng đầu tiên
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      fileHeaders.push(cell.value ? cell.value.toString().trim() : '');
    });

    // Kiểm tra tiêu đề có đúng định dạng không
    if (
      expectedHeaders.length !== fileHeaders.length ||
      !expectedHeaders.every((col, index) => col === fileHeaders[index])
    ) {
      this.notificationService.alertError('Cấu trúc cột không hợp lệ! Vui lòng sử dụng đúng định dạng.');
      
      this.filenameUpload = '';  
      this.fileUpload = null;
      
      return [];
    }

    let headerMap: { [key: string]: number } = {};
    expectedHeaders.forEach((header, index) => {
        headerMap[header] = index + 1; 
    });

    let dataList: GenerateQRDto[] = [];

    let hasError = false;
 
    // Kiểm tra dữ liệu từng hàng
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
     
      const rowData = row.values as any[];
      const cleanRowData = rowData.slice(1);
      if (cleanRowData.length !== expectedHeaders.length || cleanRowData.some(cell => cell === null || cell === undefined || cell === '')) {
        this.notificationService.alertError(`Dữ liệu không hợp lệ tại dòng ${rowNumber}. Vui lòng kiểm tra lại.`);
        hasError = true;
        this.filenameUpload = '';  
        this.fileUpload = null;
        return;
      }

      const data = new GenerateQRDto();
        data.stt = row.getCell(headerMap['STT']).value?.toString() || '';
        data.branch_code = row.getCell(headerMap['Đơn vị']).value?.toString() || '';
        data.agent = row.getCell(headerMap['Agent']).value?.toString() || '';
        data.full_name = row.getCell(headerMap['Tên khách hàng']).value?.toString() || '';
        data.card_number = row.getCell(headerMap['Số thẻ']).value?.toString() || '';
        data.payment_number = row.getCell(headerMap['Số TKTT']).value?.toString() || '';

      dataList.push(data);
    });

    console.log(dataList);
    return hasError ? [] : dataList;
  }

  removeFile() {
    this.filenameUpload = '';  
    this.fileUpload = null;

    this.req.lst_create_qr = [];
  }

  downloadTemplate() {
    const filePath = 'assets/templates/QrUploadTemplate.xlsx'; // Đường dẫn đến file Excel
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'QrUploadTemplate.xlsx'; // Tên file khi tải về
    link.click();
  }

  uploadFile() {
    this.filenameUpload = '';  
    this.fileUpload = null;

    this.req = {
      lst_create_qr: []
    };

    // Đặt lại giá trị input để cho phép chọn lại cùng một file
    this.fileInput.nativeElement.value = '';

    // Kích hoạt chọn file
    this.fileInput.nativeElement.click();
  }

  generateQR() {
    console.log('req qr: ', this.req);

    this.cardService.generateQRBatch(this.req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.dataQrResponse = response.lstData;
        
        console.log('response: ', this.dataQrResponse);
        console.log('length: ', this.length);

        this.loadData(this.reqDisplay);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    )
  }

  downloadFile() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ma QR');
    
    const columns_excel = [
      { header: 'STT', key: 'stt', width: 10 },
      { header: 'Đơn vị', key: 'branch_code', width: 10 },
      { header: 'Agent', key: 'agent', width: 20 },
      { header: 'Tên khách hàng', key: 'full_name', width: 25 },
      { header: 'Số thẻ', key: 'card_number', width: 30 },
      { header: 'Số TKTT', key: 'payment_number', width: 30 },
      { header: 'QR', key: 'qr_string', width: 40 }
    ];

    worksheet.columns = columns_excel;

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    // Ghi dữ liệu vào worksheet
    const dataArray = Object.values(this.dataQrResponse);
    (dataArray as any[]).forEach((data, index) => {
      const row = worksheet.addRow({
          stt: data.stt,
          branch_code: data?.branch_code ?? '',
          agent: data?.agent ?? '',
          full_name: data?.full_name ?? '',
          card_number: data?.card_number ?? '',
          payment_number: data?.payment_number ?? '',
          qr_string: data?.qr_string ?? ''
      });
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Xuất file Excel
    workbook.xlsx.writeBuffer().then(buffer => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'QR.xlsx');
    });
  }

  loadData(params: any) {
    this.length = this.dataQrResponse.length;
    const startIndex = (params.pageindex - 1) * params.pagesize;
    this.dataSource = this.dataQrResponse.slice(startIndex, startIndex + params.pagesize);
  }

  reload() {
    this.req = {
      lst_create_qr: []
    };

    this.dataQrResponse = [];
    this.dataSource = [];
    this.length = 0;

    this.reqDisplay = {
      pageindex: 1,
      pagesize: 10
    };

    this.fileUpload = null;
    this.filenameUpload = '';
  }
}
