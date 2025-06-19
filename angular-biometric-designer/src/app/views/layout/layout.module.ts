import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent, FooterModule } from './footer/footer.component';

import { ContentAnimateDirective } from '../../core/content-animate/content-animate.directive';

import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';


@NgModule({
  declarations: [BaseComponent, NavbarComponent, SidebarComponent, ContentAnimateDirective, BreadcrumbsComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    FeahterIconModule,
    CustomButtonModule,
    NgScrollbarModule,
	  CustomHeaderTitleModule,
    FooterModule
  ],
  providers: [
  ]
})
export class LayoutModule { }
