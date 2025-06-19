import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DxTreeListComponent } from "devextreme-angular";

@Component({
    template: ''
})
export class TreeBase implements OnInit, OnDestroy {
    @ViewChild('treeList', { static: false }) treeList: DxTreeListComponent;
    dataSource: any = {};
    queryParam: string = '';
    selectRowkey: any[] = [];
    public collapsed = false;
    ngOnInit(): void {

    }
    ngOnDestroy(): void {
        if (this.treeList != null) {
            this.treeList.instance.dispose();
        }
    }
    loadData(param: any) { }
    contentReady(event: any) {
        if (!this.collapsed) {
            this.collapsed = true;
            // event.component.expandRow(['EnviroCare']);
            // if (this.dataSource.store().loadOptions().length > 0) {
            //     this.dataGrid.instance.refresh(); // Refresh the grid to ensure the data is displayed
            // }
            this.loadData(this.queryParam);
            // console.log('contentReady finished');
        }
    }
}