// Angular import
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { distinctUntilChanged, firstValueFrom, Subscription } from 'rxjs';
import { IdentityService } from 'src/app/services/identity.service';
import { BreadcrumbService, BreadcrumbItem } from 'src/app/services/breadcrumb.service';
import { ButtonService } from 'src/app/services/button.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, AfterViewInit, OnDestroy {
  // public props
  @Input() type: string;
  navigation: any;
  breadcrumbList: Array<any> = [];
  currentPage: Array<any> = [];
  navigationList: any;
  title: string = '';
  
  private subscriptionName: Subscription;

  constructor(
    private router: Router,
    private identityService: IdentityService,
    private titleService: Title,
    private buttonService: ButtonService,
    private breadcrumbService: BreadcrumbService // Inject BreadcrumbService
  ) {
    this.title = '';
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url && typeof event.url === 'string') {
          this.identityService.dataMenu.asObservable().subscribe(
            (data: any) => {
              this.navigation = data;
              this.breadcrumbList = [];
              this.filterNavigation(event.url);
            }
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionName) {
      this.subscriptionName.unsubscribe();
    }
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  filterNavigation(activeLink: any) {
    console.log('activeLink: ', activeLink);

    let activeLinkOld = activeLink;
    // Xử lý cắt URL để lấy phần chính xác
    if (activeLink.includes("-")) {
      activeLink = activeLink.split("-")[0];
    } else if (activeLink.includes("?")) {
      activeLink = activeLink.split("?")[0];
    }

    if (this.navigation && this.navigation.length > 0) {
      this.navigation.forEach((item: any) => {
        if (!item.subItems || item.subItems.length === 0) {
          console.log("link", item.link);
          if (
            item.link.split("-", 1)[0] === activeLink &&
            item.breadcrumbs === true &&
            !this.breadcrumbList.find(b => b.link === item.link) // Tránh trùng
          ) {
            this.breadcrumbList.push(item);
          }
        } else {
          item.subItems.forEach((subItem: any) => {
            if (subItem.link.split("-", 1)[0] === activeLink && subItem.breadcrumbs === true) {
              this.breadcrumbList.push(item);
              this.breadcrumbList.push(subItem);
            }
          });
        }
      });

      // Gán title nếu tìm thấy breadcrumb hợp lệ
      if (this.breadcrumbList.length > 0) {
        this.breadcrumbList.forEach((item: any) => {
          if (!item.pageList || item.pageList.length === 0) {
            let currentPage = this.breadcrumbList.find(a => 
              a.breadcrumbs === true && a.link && a.link.split("-", 1)[0] === activeLink
            );
            this.title = currentPage ? currentPage.label : '';
          } else {
            item.pageList.forEach((subItem: any) => {
              if (subItem.pageLink === activeLinkOld.split("?")[0]) {
                this.title = subItem.pageName;
              }
            });
          }
        });
      } else {
        this.title = '';
      }
      // ===== PHẦN MỚI: Truyền dữ liệu sang NavbarComponent =====
      this.sendDataToNavbar();
    }
  }

  /**
   * Chuyển đổi dữ liệu và gửi sang NavbarComponent thông qua service
   */
  private async sendDataToNavbar() {
    // Convert breadcrumbList thành format phù hợp cho navbar
     const breadcrumbs: BreadcrumbItem[] = this.breadcrumbList.map(item => ({
    label: item.label,
    link: item.link,
    active: false // Tạm thời đặt tất cả là false
  }));

  // Nếu title tồn tại, thêm nó vào cuối danh sách và đặt active
  if (this.title) {
    breadcrumbs.push({
      label: this.title,
      active: true
    });
  } else if (breadcrumbs.length > 0) {
    // Nếu không có title, đặt phần tử cuối cùng là active
    breadcrumbs[breadcrumbs.length - 1].active = true;
  }

    // Xác định có hiển thị button tạo mới không dựa trên route hiện tại
    // const showCreateButton = await firstValueFrom(this.buttonService.hasCreateButton$('CREATE'));
    // const createButtonText = this.getCreateButtonText();

    // Gửi dữ liệu qua service
    this.breadcrumbService.setBreadcrumbData({
      breadcrumbs: breadcrumbs,
      title: this.title
      // showCreateButton: showCreateButton,
      // createButtonText: createButtonText
    });
    this.breadcrumbService.clearButtonConfig();

    // console.log('Data sent to navbar:', { breadcrumbs, title: this.title });
  }

}