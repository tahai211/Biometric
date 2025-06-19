import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  NgModule,
  Renderer2,
  ViewContainerRef,
  Optional,
  Self,
  Host
} from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "mat-paginator-goto",
  templateUrl: "./mat-paginator-goto.component.html",
  styleUrls: ["./mat-paginator-goto.component.scss"]
})
export class MatPaginatorGotoComponent implements OnInit {
  pageSize: number;
  pageIndex: number;
  length: number;
  goTo: number;
  pageNumbers: number[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() disabled = false;
  @Input() hidePageSize = false;
  @Input() pageSizeOptions: number[];
  @Input() showFirstLastButtons = false;
  @Output() page = new EventEmitter<PageEvent>();
  @Input("pageIndex") set pageIndexChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
  @Input("length") set lengthChanged(length: number) {
    this.length = length;
    this.updateGoto();
  }
  @Input("pageSize") set pageSizeChanged(pageSize: number) {
    this.pageSize = pageSize;
    this.updateGoto();
  }

  constructor(@Host() @Self() @Optional() private readonly matPag: MatPaginator,
  private vr: ViewContainerRef,
  private ren: Renderer2) {

  }

  ngOnInit() {
    this.updateGoto();
  }

  updateGoto() {
    this.goTo = (this.pageIndex || 0) + 1;
    this.pageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.length / this.pageSize); i++) {
      this.pageNumbers.push(i);
      //console.log('updateGoto',i);
    }
  }

  paginationChange(pageEvt: PageEvent) {
    this.length = pageEvt.length;
    this.pageIndex = pageEvt.pageIndex;
    this.pageSize = pageEvt.pageSize;
    this.updateGoto();
    this.emitPageEvent(pageEvt);
  }

  goToChange() {
    this.paginator.pageIndex = this.goTo - 1;
    const event: PageEvent = {
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.paginator.page.next(event);
    this.emitPageEvent(event);
  }

  emitPageEvent(pageEvent: PageEvent) {
    this.page.next(pageEvent);
  }
}

@NgModule({
  declarations: [ MatPaginatorGotoComponent ],
  exports: [ MatPaginatorGotoComponent ],
  imports:[MatPaginatorModule,
    MatFormFieldModule,MatSelectModule,
    MatRadioModule,FormsModule,MatInputModule ]
})

export class MatPaginatorGotoModule {}
