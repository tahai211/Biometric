import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import MetisMenu from 'metismenujs';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonService } from 'src/app/services/button.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IdentityService } from 'src/app/services/identity.service';
import { TokenService } from 'src/app/services/token.services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;
  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;
  currentpath: string;
  fullName: string;
  branchName: string;
  userRole: string;
  isSidebarFolded = false;
  menuItems: MenuItem[] = [];
  private subscription: Subscription;
  loadingVisible = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    router: Router,
    private identityService: IdentityService,
    private buttonService: ButtonService,
    private tokenService: TokenService,
    private notificationService: NotificationService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.currentpath = event.url;
        /**
         * Activating the current active item dropdown
         */
        this._activateMenuDropdown();

        /**
         * closing the sidebar
         */
        if (window.matchMedia('(max-width: 991px)').matches) {
          this.document.body.classList.remove('sidebar-open');
        }

      }
    });
  }

  ngOnInit(): void {
    // this.menuItems = MENU;
    // this.identityService.setDataMenu(this.menuItems);
    /**
     * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
     */
    let data = this.tokenService.getInfomationFromLocalStorage();
    this.fullName = data.fullname;
    this.branchName = data.branhname;
    this.userRole = data.userroles;
    const desktopMedium = window.matchMedia('(min-width:992px) and (max-width: 1199px)');
    desktopMedium.addEventListener('change', () => {
      this.iconSidebar;
    });
    this.iconSidebar(desktopMedium);
    this.loadMenu();
  }
  toggleSubmenu(item: any): void {
    item.expanded = !item.expanded;
  }

  loadMenu() {
    this.loadingVisible = true;
    var req = {};
    this.identityService.getMenu(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.menuItems = response.lstMenu;
        console.log('setDataMenu: ', this.menuItems);
        this.identityService.setDataMenu(this.menuItems);
        this.buttonService.setDataButton(response.lstButton);
        // console.log("Menu list: ", this.menuItems);

        //reload view when finished call api
        // setTimeout(() => {
        //   this.pageInfoService.calculateTitle();
        //   this.pageInfoService.calculateBreadcrumbs();
        // }, 10);
        // this.changeDetectorRef.detectChanges();
        this._activateMenuDropdown();
        this.loadingVisible = false;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
        this.loadingVisible = false;
      }
    );
  }

  ngAfterViewInit() {
    // activate menu item
    // new MetisMenu(this.sidebarMenu.nativeElement);

    // this._activateMenuDropdown();
    setTimeout(() => {
      setTimeout(() => {
        if (this.menuItems.length > 0) {

          // console.log('loaded menu');
          new MetisMenu(this.sidebarMenu.nativeElement);
          this._activateMenuDropdown();
        }
        else {
          //console.log('afterviewInit');
          this.ngAfterViewInit();
        }
      }, 100);
    });
  }

  /**
   * Toggle sidebar on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();

    if (this.sidebarToggler?.nativeElement) {
      this.sidebarToggler.nativeElement.classList.toggle('active');
      this.sidebarToggler.nativeElement.classList.toggle('not-active');
    }


    const body = this.document.body;

    if (window.matchMedia('(min-width: 992px)').matches) {
      body.classList.toggle('sidebar-folded');
    } else {
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-folded');
    }

    this.isSidebarFolded = body.classList.contains('sidebar-folded');
  }

  handleAvatarClick() {
    if (this.isSidebarFolded) {
      // Gọi lại hàm toggleSidebar nhưng không cần event
      this.toggleSidebar(new Event('click'));
    }
  }



  /**
   * Toggle settings-sidebar 
   */
  toggleSettingsSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }


  /**
   * Open sidebar when hover (in folded folded state)
   */
  operSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.add("open-sidebar-folded");
    }
  }


  /**
   * Fold sidebar after mouse leave (in folded state)
   */
  closeSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.remove("open-sidebar-folded");
    }
  }

  /**
   * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
   */
  iconSidebar(mq: MediaQueryList) {
    if (mq.matches) {
      this.document.body.classList.add('sidebar-folded');
    } else {
      this.document.body.classList.remove('sidebar-folded');
    }
  }


  /**
   * Switching sidebar light/dark
   */
  onSidebarThemeChange(event: Event) {
    this.document.body.classList.remove('sidebar-light', 'sidebar-dark');
    this.document.body.classList.add((<HTMLInputElement>event.target).value);
    this.document.body.classList.remove('settings-open');
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }


  /**
   * Reset the menus then hilight current active menu item
   */
  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }

  onSidebarLogout(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    // if (!localStorage.getItem('isLoggedin')) {
    //   this.router.navigate(['/auth/login']);
    // }
    this.tokenService.logout();
  }
  /**
   * Resets the menus
   */
  resetMenuItems() {
    // this.subscription = new Subscription();
    const links = document.getElementsByClassName('nav-link-ref');

    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.remove('mm-active');
        const parent2El = parentEl.parentElement;

        if (parent2El) {
          parent2El.classList.remove('mm-show');
        }

        const parent3El = parent2El?.parentElement;
        if (parent3El) {
          parent3El.classList.remove('mm-active');

          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

            if (firstAnchor) {
              firstAnchor.classList.remove('mm-active');
            }
          }

          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.remove('mm-show');

            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.remove('mm-active');
            }
          }
        }
      }
    }
  };


  /**
   * Toggles the menu items
   */
  activateMenuItems() {
    const links: any = document.getElementsByClassName('nav-link-ref');
    var windowlocate = this.currentpath.split("-", 1);
    let menuItemEl = null;

    for (let i = 0; i < links.length; i++) {
      var tmpLink = links[i]['href'].split("#", 2);
      tmpLink = tmpLink[1].split("-", 1);
      if (windowlocate[0] === tmpLink[0]) {
        // console.log('found ', links[i])
        menuItemEl = links[i];
        break;
      }
      // tslint:disable-next-line: no-string-literal
      // if (window.location.pathname === links[i]['pathname']) {
      //   menuItemEl = links[i];
      //   break;
      // }
    }

    if (menuItemEl) {
      menuItemEl.classList.add('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.add('mm-active');

        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.add('mm-show');
        }

        const parent3El = parent2El.parentElement;
        if (parent3El) {
          parent3El.classList.add('mm-active');

          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

            if (firstAnchor) {
              firstAnchor.classList.add('mm-active');
            }
          }

          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.add('mm-show');

            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.add('mm-active');
            }
          }
        }
      }
    }
  };
}