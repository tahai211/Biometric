import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { DxDataGridComponent } from "devextreme-angular";
@Component({
    template: ''
})
export class GridBase implements OnInit, OnDestroy {
    @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
    public length = 0;
    public pageIndex = 0;
    public pageSize = 10;

    public dataSource: any = {};
    public collapsed = false;
    public queryParam: string = '';
    public objectRequest: any;

    hidePageSize = false;
    showPageSizeOptions = false;
    showFirstLastButtons = true;
    disabled = false;

    public pageEvent: PageEvent;

    constructor() {
    }
    ngOnInit(): void {

    }
    ngOnDestroy(): void {
        this.dataGrid.instance.dispose();
    }
    loadData(params: string) { };
    contentReady(event: any) {
        if (!this.collapsed) {
            this.collapsed = true;
            // event.component.expandRow(['EnviroCare']);
            // if (this.dataSource.store().loadOptions().length > 0) {
            //     this.dataGrid.instance.refresh(); // Refresh the grid to ensure the data is displayed
            // }
            this.buildQueryParam();
            this.loadData(this.queryParam);
            console.log('contentReady finished');
        }
    }
    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        console.log("onPaginationChangedEvent ", e);
        console.log('paginationGetCurrentPage' + e.pageIndex);
        this.buildQueryParam();
        this.loadData(this.queryParam);
    }
    buildQueryParam() {
        var index: number = 1 + this.pageIndex;
        var skipCount = this.pageIndex * this.pageSize;
        this.queryParam = "?SkipCount=" + skipCount + "&MaxResultCount=" + this.pageSize;
        this.buildParamsUrl(this.objectRequest);
    }
    buildParamsUrl(obj: any) {
        if (obj) {
            const objectKeys = Object.keys(obj);
            if (objectKeys != null && objectKeys.length > 0) {
                objectKeys.forEach((item: any) => {
                    if (item != null && item != '' && obj[item] != null && obj[item] != '') {
                        if (this.queryParam == null || this.queryParam == '') {
                            this.buildQueryParam();
                        }
                        this.queryParam += '&' + item + '=' + obj[item];
                    }
                });
            }
        }
    }
    reloadGrid(req: any) {
        req = {};
        this.buildQueryParam();
        this.loadData(this.queryParam);
    }
    search(req: any) {
        this.objectRequest = req;
        var skipCount = this.pageIndex * this.pageSize;
        this.queryParam = "?SkipCount=" + skipCount + "&MaxResultCount=" + this.pageSize;
        console.log('queryDefault: ', this.queryParam);
        this.buildParamsUrl(req);
        this.loadData(this.queryParam);
    }
}