import { Component, OnInit, Renderer2 } from '@angular/core';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { HelpdeskService } from 'src/app/services/helpdesk.service';
import { IdentityService } from 'src/app/services/identity.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SupportGroupDto } from 'src/app/shared/models/helpdesk/support.group.dto';
import { UserReqDto } from 'src/app/shared/models/identity/user.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-helpdesk-assign-support-group',
  templateUrl: './helpdesk-assign-support-group.component.html',
  styleUrl: './helpdesk-assign-support-group.component.scss'
})
export class HelpdeskAssignSupportGroupComponent implements OnInit {
  req: SupportGroupDto = new SupportGroupDto();
  length = 0;
  dataSource: any = {};
  dataUser: any[];
  user_selected: string = '';
  selectedGroupIDs: any[] = [];

  columns: Array<dxDataGridColumn | string> = [{
      dataField: 'group_id',
      caption: 'ID nhóm',
    }, {
      dataField: 'group_name',
      caption: 'Tên nhóm',
    }, {
      dataField: 'created_by',
      caption: 'Người tạo',
    }, {
      dataField: 'created_date',
      caption: 'Ngày tạo',
    },  {
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
          checkbox.checked = this.selectedGroupIDs.includes(cellInfo.data.group_id);

          // Lắng nghe sự kiện click để cập nhật dữ liệu
          this.renderer.listen(checkbox, 'change', (event) => {
              if (event.target.checked) {
                // Thêm vào danh sách nếu chưa có
                if (!this.selectedGroupIDs.includes(cellInfo.data.group_id) && cellInfo.data.group_id != null) {
                    this.selectedGroupIDs.push(cellInfo.data.group_id);
                }
              } else {
                  this.selectedGroupIDs = this.selectedGroupIDs.filter(group_id => group_id !== cellInfo.data.group_id);
              }

              console.log('group id đã chọn: ', this.selectedGroupIDs)
          });

          container.append(checkbox);
      }
  }
  ];

  ngOnInit(): void {
    this.loadDataUser();
  }

  constructor(
    private renderer: Renderer2,
    private helpdeskService: HelpdeskService,
    private notificationService: NotificationService,
    private identityService: IdentityService
  ) { }

  loadDataUser() {
    let reqUser: UserReqDto = new UserReqDto();
    reqUser.pagesize = 10000000;

    console.log('req: ', reqUser);
    this.identityService.getUserList(reqUser).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.dataUser = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  displayUser = (item: any) => {
    return item ? `${item.user_name_up} - ${item.full_name}` : '';
  };

  loadDataSupportGroup(params: any) {
    //params.pagesize = 100000;
    console.log('request filter: ', params);
    this.helpdeskService.getSupportGroupList(params).subscribe(
      (response : any) => {
        console.log(new Date() + ": ", response);
        this.length = response.lstData.totalItems;
        this.dataSource = response.lstData.items;

        this.updateCheckedCheckboxes();
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  onUserSelected(event: any) {
    this.user_selected = event.value;
    console.log("Dữ liệu user đã chọn:", this.user_selected);

    //this.selectedGroupIDs = [];
    var userGroupID: any[] = [];
    var req: any = {
      user_id: this.user_selected
    }

    this.helpdeskService.getListSupportGroupUser(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        response.lstData.forEach((element: any) => {
          userGroupID.push(element.group_id);
        });

        this.selectedGroupIDs = userGroupID;
        console.log('Danh sách Nhóm hiện tại: ', this.selectedGroupIDs);
      
        this.updateCheckedCheckboxes();
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  updateCheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('.custom-checkbox');

    checkboxes.forEach((checkbox) => {
        const inputElement = checkbox as HTMLInputElement; // Ép kiểu về HTMLInputElement
        const groupId = inputElement.getAttribute('data-group-id'); // Lấy group_id từ checkbox

        if (groupId && this.selectedGroupIDs.includes(groupId)) {
            inputElement.checked = true; // Đánh dấu checkbox nếu group_id có trong danh sách đã chọn
        }
        else {
          inputElement.checked = false; 
        }
    });
  }

  assignGroup() {
    var req_assign: any = {
      user_id: this.user_selected,
      group_ids: this.selectedGroupIDs
    }
    console.log('req_assign: ', req_assign);

    this.helpdeskService.assignSupportGroup(req_assign).subscribe(
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
