import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.services';
import { SystemService } from 'src/app/services/system.service';
import { CONST_LOCAL_STORAGE } from 'src/app/shared/const/const.localstorage';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  fullName: string;
  branch: string;
  today: any;
  isDashboardView: boolean = false;
  title = '';
  //sử dụng khi cần ản nút 
  breadcrumbTitle: string = '';
  showCreateButton: boolean = false;
  createButtonText: string = '';
  onClick?: () => void;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private tokenService: TokenService,
    private systemService: SystemService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) { }
  breadcrumbs: Array<{ label: string, link?: string, active?: boolean }> = [];

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  // Method to update breadcrumbs dynamically
  updateBreadcrumbs(newBreadcrumbs: Array<{ label: string, link?: string, active?: boolean }>) {
    this.breadcrumbs = newBreadcrumbs;
  }
  ngOnInit(): void {
    let data = this.tokenService.getInfomationFromLocalStorage();
    this.fullName = data.fullname;
    this.branch = data.branhcode;

    // setInterval(() => {
    //   this.systemService.getCoreDate({}).subscribe(
    //     (response: any) => {
    //       this.today = response.core_date;
    //     },
    //     err => {
    //       let currentDate = new Date();
    //       if (currentDate.getDate() !== this.today.getDate()) {
    //         this.today = currentDate; 
    //       }
    //     }
    //   )
    // }, 90000);

    this.systemService.getCoreDate({}).subscribe(
      (response: any) => {
        console.log("Ngay he thong: ", response)
        this.today = response.core_date;
        localStorage.setItem('core_date', JSON.stringify(this.today));
        localStorage.setItem(CONST_LOCAL_STORAGE.CIM_CORE_DATE, JSON.stringify(this.today));
      },
      err => {
        let currentDate = new Date();
        if (currentDate.getDate() !== this.today.getDate()) {
          this.today = currentDate;
        }
      }
    );
    this.breadcrumbService.breadcrumbData$.subscribe(data => {
      this.breadcrumbs = data.breadcrumbs;
      this.breadcrumbTitle = data.title;
      // this.showCreateButton = data.showCreateButton ?? false;
      //this.createButtonText = data.createButtonText ?? 'TẠO MỚI';
      // this.title = data.breadcrumbs.find(b => b.active)?.label || '';
      this.title = data.title || data.breadcrumbs.find(b => b.active)?.label || '';
      this.isDashboardView = data.breadcrumbs.length === 0;
    });
    this.breadcrumbService.buttonConfig$.subscribe(config => {
      this.showCreateButton = config.show ?? false;
      this.createButtonText = config.text;
      this.onClick = config.onClick;
  });
  }
  create(): void {
    this.onClick?.();
  }
  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

}
