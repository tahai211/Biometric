import { Component, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { HelpdeskService } from 'src/app/services/helpdesk.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenService } from 'src/app/services/token.services';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ReviewListReqDto } from 'src/app/shared/models/helpdesk/review.list.req.dto';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { ButtonService } from 'src/app/services/button.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent {
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: ReviewListReqDto = new ReviewListReqDto();
  selectedOptionSupportService: string = '';
  length = 0;
  dataSource: any = [];
  dataPriorities: any = [];
  dataStatus: any = [];
  dataNotinStatus: any = [];
  dataAssign: any = [];
  dataGroupAssign: any = [];
  dataSupportService: any = [];
  dataIssueServiceTypeF: any = [];
  dataIssueServiceTypeN: any = [];
  dataIssueServiceTypeO: any = [];
  isPageLoaded: boolean = false;
  countTotalOpen: any = 0;
  countTotalReject: any = 0;
  countTotalProcessing: any = 0;
  countTotalDone: any = 0;
  userInfoFromToken: any = {};
  buttonSelected: string = '';
  isDisabled: boolean = false;
  hasCreateButton: boolean = false;
  radioOptions = [
  { value: 'N', text: 'GD phi tài chính' },
  { value: 'F', text: 'GD tài chính' },
  { value: 'O', text: 'GD khác' }
];
  columns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'id',
      caption: 'ID',
    },
    {
      dataField: 'title',
      caption: 'Tiêu đề',
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
    },
    {
      dataField: 'priority',
      caption: 'Mức ưu tiên',
    },
    {
      dataField: 'sender',
      caption: 'Người gửi',
    },
    {
      dataField: 'send_to',
      caption: 'Gửi tới',
    },
    {
      dataField: 'created_date',
      caption: 'Ngày tạo',
    },
    {
      dataField: 'modified_date',
      caption: 'Ngày sửa',
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
          this.router.navigate([`/helpdesk/review-response-new`], { queryParams: { issueid: cellInfo.data.id } });
        });
        container.append(button);
      },
    }
  ];

  displayItemSelect = (item: any) => {
    return item ? `${item.value} - ${item.text}` : '';
  };

  displayBasicItemSelect = (item: any) => {
    return item ? `${item.text}` : '';
  };

  ngOnInit(): void {
    this.initializeButtons();
    this.loadFilter();

    this.checkLoadPage();

    this.userInfoFromToken = this.tokenService.getInfomationFromLocalStorage()
    console.log('userInfo: ', this.userInfoFromToken)
  }

  constructor(
    private helpdeskService: HelpdeskService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private router: Router,
    private renderer: Renderer2,
    private buttonService: ButtonService,
    private breadcrumbService: BreadcrumbService
  ) { }
  initializeButtons(): void {
    this.buttonService.hasCreateButton$('CREATE').subscribe(result => {
      this.hasCreateButton = result;
      this.breadcrumbService.setButtonPath(
      this.hasCreateButton,
      'TẠO MỚI',
      () => this.create()
    );
    });
  }

  create() {
    this.router.navigate(['/helpdesk/review-add-issue-new']);
  }

  loadFilter() {
    this.helpdeskService.getReviewListFilter({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.dataPriorities = response.dataPriorities;
        this.dataStatus = response.dataStatus;
        this.dataNotinStatus = response.dataNotinStatus;
        this.dataAssign = response.dataAssign;
        this.dataGroupAssign = response.dataGroupAssign;
        console.log("dataGroupAssign: ", this.dataGroupAssign);
        this.dataIssueServiceTypeF = response.dataIssueServiceTypeF;
        this.dataIssueServiceTypeN = response.dataIssueServiceTypeN;
        this.dataIssueServiceTypeO = response.dataIssueServiceTypeO;
        this.countTotalOpen = response.countOpen;
        this.countTotalReject = response.countReject;
        this.countTotalProcessing = response.countProcessing;
        this.countTotalDone = response.countDone;
        this.isDisabled = !response.isGroupTTT_CNTT;

        this.req.assigned = this.userInfoFromToken.username.toUpperCase();
        //this.req.group_assign = this.dataGroupAssign.find((x: any) => x.value === this.userInfoFromToken.branhcode)?.value ?? "";
        this.req.group_assign = response.group_id_send;

        this.onRadioChange(this.selectedOptionSupportService);
      },
      err => {
        console.log(new Date(), err);
      }
    );
  }

  selectedTick(selectedTickText: string) {
    console.log("Text tick: ", selectedTickText);

    this.req.keyword = ''
    this.req.client_code = ''
    this.req.account_no = ''
    this.req.card_number = ''
    this.req.issue_id = ''
    this.req.service_code = ''
    this.req.priority_id = ''
    this.req.status_id = ''
    this.req.notin_status = ''
    this.req.to_date = ''
    this.req.from_date = ''
    this.req.user_id = ''

    if (selectedTickText == 'All') {
      this.buttonSelected = 'All';
    }
    else if (selectedTickText == 'Pending') {
      this.buttonSelected = 'Pending';

      this.req.status_id = '1-4' // 1-4 là ghép 2 id của trạng thái đang mở và đang xử lý -> phục vụ tìm kiếm 'chờ xử lý'
    }
    else {
      var user = this.userInfoFromToken.username.toUpperCase();

      if (selectedTickText == 'MySend') {
        this.buttonSelected = 'MySend';

        this.req.user_id = user;
      }
      else if (selectedTickText == 'SendForMe') {
        this.buttonSelected = 'SendForMe';

        this.req.assigned = user
      }
    }

    this.dataGridControlComponent.reloadGrid(this.req);
  }

  selectedTotal(selectedTotalText: string) {
    console.log("Text total: ", selectedTotalText);

    var user = this.userInfoFromToken.username.toUpperCase();

    this.req.keyword = ''
    this.req.client_code = ''
    this.req.account_no = ''
    this.req.card_number = ''
    this.req.issue_id = ''
    this.req.service_code = ''
    this.req.priority_id = ''
    this.req.status_id = ''
    this.req.notin_status = ''
    this.req.to_date = ''
    this.req.from_date = ''
    this.req.user_id = ''
    this.req.assigned = user
    this.req.group_assign = this.req.group_assign = this.dataGroupAssign.find((x: any) => x.text === this.userInfoFromToken.branhname)?.value ?? "";

    if (selectedTotalText == "Open") {
      this.buttonSelected = 'Open';

      this.req.status_id = '1'
    }
    else if (selectedTotalText == "Reject") {
      this.buttonSelected = 'Reject';

      this.req.status_id = '9'
    }
    else if (selectedTotalText == "Processing") {
      this.buttonSelected = 'Processing';

      this.req.status_id = '4'
    }
    else {
      this.buttonSelected = 'Done';

      this.req.status_id = '8'
    }

    this.dataGridControlComponent.reloadGrid(this.req);
  }

  onServiceChange(selectedValue: any) {
    const selectedItem = this.dataSupportService.find((item: any) => item.value === selectedValue);
    //this.reqInsertIssue.issue_name = selectedItem ? selectedItem.text : '';
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


  loadData(params: any) {
    if (this.isPageLoaded == false) {
      this.length = 0;
      this.dataSource = [];

      return;
    }

    console.log('request filter: ', params);

    this.helpdeskService.searchReviewList(params).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.length = response.lstData.totalItems;
        this.dataSource = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  checkLoadPage() {
    this.isPageLoaded = false;
    setTimeout(() => {
      this.isPageLoaded = true;
    }, 500);
  }

  search() {
    this.buttonSelected = '';

    this.dataGridControlComponent.searchGrid(this.req);
  }

  reload() {
    this.checkLoadPage();

    this.buttonSelected = '';

    this.req = new ReviewListReqDto();
    //this.dataGridControlComponent.reloadGrid(this.req);
    this.dataSource = []
  }

  exportExcel() {
    console.log("req excel: ", this.req);

    this.helpdeskService.excelReviewList(this.req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        console.log('**Tạo một đường dẫn (URL) để tải xuống**');
        const url = window.URL.createObjectURL(blob);

        console.log('**Tạo một thẻ <a> ẩn để tự động tải xuống**');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'list_data.xlsx';
        document.body.appendChild(a);
        a.click();

        // **Dọn dẹp bộ nhớ**
        window.URL.revokeObjectURL(url);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    )
  }
}
