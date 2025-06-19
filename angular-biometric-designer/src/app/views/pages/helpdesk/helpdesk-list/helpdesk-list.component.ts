import { Component, OnInit } from '@angular/core';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import DevExpress from 'devextreme';
@Component({
  selector: 'app-helpdesk-list',
  templateUrl: './helpdesk-list.component.html',
  styleUrls: ['./helpdesk-list.component.scss']
})
export class HelpdeskListComponent implements OnInit {
  dataSource: any[];
  columns: any[];

  constructor() { }

  ngOnInit(): void {
    this.dataSource = [
      // Sample data
      { id: 1, name: 'John Doe', issue: 'Login issue' },
      { id: 2, name: 'Jane Smith', issue: 'Payment issue' },
      // ...more data
    ];

    this.columns = [
      { dataField: 'id', caption: 'ID' },
      { dataField: 'name', caption: 'Name' },
      { dataField: 'issue', caption: 'Issue' },
      // ...more columns
    ];
  }

  onSearch(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.dataSource = this.dataSource.filter(item => 
      item.name.toLowerCase().includes(searchValue) || 
      item.issue.toLowerCase().includes(searchValue)
    );
  }
}
