import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DataGridControlModule } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonModule } from 'src/app/shared/components/screen-button/screen-button.component';
import { ParamListComponent } from './param-list/param-list.component';
import { ParamDetailComponent } from './param-detail/param-detail.component';
import { DxButtonModule, DxDateBoxModule, DxPopupModule, DxSelectBoxModule, DxTextAreaModule, DxTextBoxModule } from 'devextreme-angular';
import { DxReportViewerModule, DxReportDesignerModule } from 'devexpress-reporting-angular';
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportparamListComponent } from './reportparam-list/reportparam-list.component';
import { ReportparamDetailComponent } from './reportparam-detail/reportparam-detail.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { CustomDateBoxModule } from 'src/app/shared/components/custom-date-box/custom-date-box.component';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { CustomLabelModule } from 'src/app/shared/components/custom-label/custom-label.component';
import { CustomTextBoxModule } from 'src/app/shared/components/custom-text-box/custom-text-box.component';
import { CustomSelectBoxModule } from 'src/app/shared/components/custom-select-box/custom-select-box.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';
import { CustomTextAreaModule } from 'src/app/shared/components/custom-text-area/custom-text-area.component';
import { CustomConfirmNotifyModule } from 'src/app/shared/components/custom-confirm-notify/custom-confirm-notify.component';
import { CustomDropdownBoxModule } from 'src/app/shared/components/custom-dropdown-box/custom-dropdown-box.component';
import { ProductCreditListComponent } from './product-credit-list/product-credit-list.component';
import { ProductCreditDetailComponent } from './product-credit-detail/product-credit-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      {
        path: 'agent-list',
        component: AgentListComponent
      },
      {
        path: 'agent-detail',
        component: AgentDetailComponent
      },
      {
        path: 'param-list',
        component: ParamListComponent
      },
      {
        path: 'param-detail',
        component: ParamDetailComponent
      },
      {
        path: 'history-list',
        component: HistoryListComponent
      },
      {
        path: 'history-detail',
        component: HistoryDetailComponent
      },
      {
        path: 'report-list',
        component: ReportListComponent
      },
      {
        path: 'paramreport-list',
        component: ReportparamListComponent
      },
      {
        path: 'paramreport-detail',
        component: ReportparamDetailComponent
      },
      {
        path: 'report-detail',
        component: ReportDetailComponent
      },
      {
        path: 'productcredit-list',
        component: ProductCreditListComponent
      },
      {
        path: 'productcredit-detail',
        component: ProductCreditDetailComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    SystemComponent,
    AgentListComponent,
    AgentDetailComponent,
    ParamListComponent,
    ParamDetailComponent,
    HistoryListComponent,
    HistoryDetailComponent,
    ReportListComponent,
    ReportparamListComponent,
    ReportparamDetailComponent,
    ReportDetailComponent,
    ProductCreditListComponent,
    ProductCreditDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataGridControlModule,
    FormsModule,
    NgbTimepickerModule,
    ScreenButtonModule,
    DxPopupModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxTextAreaModule,
    DxReportViewerModule,
    DxReportDesignerModule,
    CustomDateBoxModule,
    CustomButtonModule,
    CustomLabelModule,
    CustomTextBoxModule,
    CustomSelectBoxModule,
    CustomHeaderTitleModule,
    CustomTextAreaModule,
    CustomConfirmNotifyModule,
    CustomDropdownBoxModule
  ]
})
export class SystemModule { }
