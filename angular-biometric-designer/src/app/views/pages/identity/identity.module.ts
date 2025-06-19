import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityComponent } from './identity.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DataGridControlModule } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonModule } from 'src/app/shared/components/screen-button/screen-button.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { DxDataGridModule, DxTemplateModule, DxBulletModule, DxTreeListModule, DxCheckBoxModule, DxTextBoxModule, DxSelectBoxModule, DxDropDownBoxModule, DxTreeViewModule, DxListModule, DxTextAreaModule, DxValidatorModule, DxValidationSummaryModule, DxButtonModule, DxDateBoxModule, DxPopupModule } from 'devextreme-angular';
import { CustomDateBoxModule } from 'src/app/shared/components/custom-date-box/custom-date-box.component';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { CustomLabelModule } from 'src/app/shared/components/custom-label/custom-label.component';
import { CustomTextBoxModule } from 'src/app/shared/components/custom-text-box/custom-text-box.component';
import { CustomSelectBoxModule } from 'src/app/shared/components/custom-select-box/custom-select-box.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';
import { CustomTextAreaModule } from 'src/app/shared/components/custom-text-area/custom-text-area.component';
import { CustomDropdownBoxModule } from 'src/app/shared/components/custom-dropdown-box/custom-dropdown-box.component';
import { CustomConfirmNotifyModule } from 'src/app/shared/components/custom-confirm-notify/custom-confirm-notify.component';

const routes: Routes = [
  {
    path: '',
    component: IdentityComponent,
    children: [
      {
        path: 'user-list',
        component: UserListComponent
      },
      {
        path: 'user-detail',
        component: UserDetailComponent
      },
      {
        path: 'role-list',
        component: RoleListComponent
      },
      {
        path: 'role-detail',
        component: RoleDetailComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    IdentityComponent,
    UserListComponent,
    UserDetailComponent,
    RoleListComponent,
    RoleDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataGridControlModule,
    FormsModule,
    NgbTimepickerModule,
    ScreenButtonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
    NgbModule,
    DxTreeListModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    DxListModule,
    DxTextAreaModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxButtonModule,
    DxDateBoxModule,
    DxPopupModule,
    CustomDateBoxModule,
    CustomButtonModule,
    CustomLabelModule,
    CustomTextBoxModule,
    CustomSelectBoxModule,
    CustomHeaderTitleModule,
    CustomTextAreaModule,
    CustomDropdownBoxModule,
    CustomConfirmNotifyModule
  ]
})
export class IdentityModule { }
