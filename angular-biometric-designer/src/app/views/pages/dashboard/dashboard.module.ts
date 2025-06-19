import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityComponent } from '../identity/identity.component';
import { NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridModule, DxTemplateModule, DxBulletModule, DxTreeListModule, DxCheckBoxModule, DxTextBoxModule, DxSelectBoxModule, DxDropDownBoxModule, DxTreeViewModule, DxListModule, DxTextAreaModule, DxValidatorModule, DxValidationSummaryModule, DxButtonModule, DxDateBoxModule, DxPopupModule, DxFileUploaderModule } from 'devextreme-angular';
import { DataGridControlModule } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonModule } from 'src/app/shared/components/screen-button/screen-button.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DxReportViewerModule, DxReportDesignerModule } from 'devexpress-reporting-angular';
import { ScreenButtonGridModule } from 'src/app/shared/components/screen-button-grid/screen-button-grid.component';
// Ng-ApexCharts
import { NgApexchartsModule } from "ng-apexcharts";

import { DashboardComponent } from './dashboard.component';
import { GrafanaComponent } from './grafana/grafana.component';
import { CustomDateBoxModule } from 'src/app/shared/components/custom-date-box/custom-date-box.component';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { CustomLabelModule } from 'src/app/shared/components/custom-label/custom-label.component';
import { CustomTextBoxModule } from 'src/app/shared/components/custom-text-box/custom-text-box.component';
import { CustomSelectBoxModule } from 'src/app/shared/components/custom-select-box/custom-select-box.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';
import { CustomTextAreaModule } from 'src/app/shared/components/custom-text-area/custom-text-area.component';
import { CustomConfirmNotifyModule } from 'src/app/shared/components/custom-confirm-notify/custom-confirm-notify.component';
import { CustomDropdownBoxModule } from 'src/app/shared/components/custom-dropdown-box/custom-dropdown-box.component';
import { CustomDateBoxFormModule } from 'src/app/shared/components/custom-date-box-form/custom-date-box-form.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'grafana/:id',
        component: GrafanaComponent
      }
    ]
  }
]

@NgModule({
  declarations: [DashboardComponent,
    GrafanaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeahterIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DxReportViewerModule,
    DxReportDesignerModule,
    DataGridControlModule,
    NgbTimepickerModule,
    ScreenButtonModule,
    ScreenButtonGridModule,
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
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    CustomDateBoxModule,
    CustomButtonModule,
    CustomLabelModule,
    CustomTextBoxModule,
    CustomSelectBoxModule,
    CustomHeaderTitleModule,
    CustomTextAreaModule,
    CustomDropdownBoxModule,
    CustomConfirmNotifyModule,
    CustomDateBoxFormModule
  ]
})
export class DashboardModule { }
