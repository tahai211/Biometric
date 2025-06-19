import { Component, Inject,Renderer2, OnInit, ViewEncapsulation,ViewChild, ElementRef } from '@angular/core';
import * as ko from 'knockout';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DxReportViewerComponent } from 'devexpress-reporting-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ButtonService } from 'src/app/services/button.service';
import { CONST } from "../../../../shared/const/const";
import { reportService } from 'src/app/services/report.service';
interface Param {
  Param_Name: string;
  Param_Code: string;
  Param_Type: string;
  Param_Exc: any;           // null | string | Array<{ key: string, value: string }>
}
interface ParamResponse {
  param: Param[];
}
@Component({
  selector: 'app-grafana',
  templateUrl: './grafana.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    "./grafana.component.scss",
    //"../../../../../../node_modules/devextreme/dist/css/dx.material.blue.light.css",
    "../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css",
    "../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.material.blue.light.css",
    "../../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css"
  ]
})
export class GrafanaComponent implements OnInit {
  @ViewChild(DxReportViewerComponent, { static: false })
    viewer!: DxReportViewerComponent;
    @ViewChild('paramValue', { static: false })
    public paramValue!: ElementRef;
  id: string = '';
  url: string;
  urlSafe: SafeResourceUrl;
  params: Param[] = [];
  form!: FormGroup;
  get reportUrl() {
    return this.koReportUrl();
  };
  set reportUrl(newUrl) {
    this.koReportUrl(newUrl);
  }
  title = 'DXReportViewerSample';
  hostUrl: string = CONST.API_URL;
  invokeAction: string = '/DXXRDV';
  koReportUrl = ko.observable('');

  useSameTabExport = true;
  useAsynchronousExport = true;

  constructor(private activateRoute: ActivatedRoute,private fb: FormBuilder,private http: HttpClient,private router: ActivatedRoute,private routering: Router,private buttonService: ButtonService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private analyticsService: AnalyticsService,
    private notificationService: NotificationService,
    private reportService: reportService) {}

  ngOnInit() {
    this.router.params.subscribe(({ id }) => {
      if (id != null) {
        this.id = id;
        const req:  any = {ReportId: +id};
        this.reportService.getParamReport(req).subscribe(
          (res: any) => {
            this.params = res.param;
            this.buildForm();
            this.onSubmit();
          },
          err => {
            console.log(new Date(), err);
            this.notificationService.alertError(err.error);
          }
        );
        this.reportUrl = id;
      }
    });
  }
  private buildForm(): void {
    const group: { [key: string]: any } = {};
    this.params.forEach(p => {
      let defaultValue: any;
      switch (p.Param_Type) {
        case 'Text':
          defaultValue = p.Param_Exc ?? '';
          break;
        case 'SQL':
          defaultValue = Array.isArray(p.Param_Exc) && p.Param_Exc.length
                         ? p.Param_Exc[0].key
                         : '';
          break;
        case 'DateTime':
          defaultValue = p.Param_Exc
                         ? new Date(p.Param_Exc as string)
                         : new Date();
          break;
        case 'Boolean':
          // nếu p.Param_Exc chứa boolean, dùng nó; ngược lại mặc định false
          defaultValue = typeof p.Param_Exc === 'boolean'
                         ? p.Param_Exc
                         : false;
          break;
        default:
          defaultValue = '';
      }
      group[p.Param_Code] = [ defaultValue ];
    });
    this.form = this.fb.group(group);
  }

  onSubmit(): void {
    // Lấy object { key1: value1, key2: value2, … }
    const values = this.form.value;
    console.log(values);
    // Build query string: ["key1=val1", "key2=val2", …].join("&")
    // const qs = Object
    //   .entries(values)
    //   .map(([k, v]) => 
    //     `${encodeURIComponent(k)}=${encodeURIComponent(v == null ? '' : v.toString())}`
    //   )
    //   .join('&');


      const qs = Object.entries(values)
  .map(([k, v]) => {
    let val = v;
    if (v instanceof Date) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      val = `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}`;
    }
    return `${encodeURIComponent(k)}=${encodeURIComponent(val == null ? '' : val.toString())}`;
  })
  .join('&');
    const url = this.reportUrl + (qs ? `?${qs}` : '');
    this.viewer.bindingSender.OpenReport(url);
  }
  
}
