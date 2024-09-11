import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  PercentPipe,
} from '@angular/common';
import { DataPipe } from '../../pipes/datapipe.pipe';
import { columnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TooltipOnOverflowDirective } from '../../directives/overflow.directive';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dynamictable',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    CommonModule,
    DataPipe,
    MatTooltipModule,
    MatIconModule,
    TooltipOnOverflowDirective,
    MatPaginatorModule,
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    DataPipe,
    TooltipOnOverflowDirective,
  ],
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.scss'],
})
export class DynamictableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[] = [];
  @Input() columnMetaData: columnMetaDataType[] = [];
  columnsToDisplay: string[] = [];
  @Input() loading!: boolean;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public pageSize: number = 20;
  public totalSize: number = 0;
  public getCurrentPage: number = 0;

  dataSource!: MatTableDataSource<any>;

  constructor(private datapipe: DataPipe, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.setupTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnMetaData'] || changes['data']) {
      setTimeout(() => {
        this.setupTable();
      }, 0);
    }
  }

  setupTable() {
    this.columnMetaData.sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order;
      } else if (a.order) {
        return 1;
      } else if (b.order) {
        return -1;
      }
      return 0;
    });

    // Automatically generate columns to display based onMetaData
    const sortedColumns = this.columnMetaData
      .filter((ele) => !ele.hide)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((col) => col.columnName || 'combineData');

    this.columnsToDisplay = [...sortedColumns];
    this.dataSource = new MatTableDataSource(this.data);
    this.totalSize = this.data.length;

    this.dataSource.paginator = this.paginator;
    this.iterator();

    this.cd.detectChanges();
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    this.getCurrentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
  }

  iterator() {
    const end = (this.getCurrentPage + 1) * this.pageSize;
    const start = this.getCurrentPage * this.pageSize;
    const part = this.data.slice(start, end);
    this.dataSource = new MatTableDataSource(part);
  }

  getColumnType(column: columnMetaDataType) {
    return column.type || '';
  }

  getColumnTypeArgs(column: columnMetaDataType) {
    return column.typeArgs || [];
  }

  getTemplate(column: columnMetaDataType): TemplateRef<any> | null {
    return column.template || null;
  }

  getClass(...classes: (string | string[] | undefined | null)[]): string {
    const validClasses = classes
      .filter((item) => item != null && item != undefined)
      .flatMap((item) =>
        typeof item === 'string' ? [item] : Array.isArray(item) ? item : []
      )
      .filter(
        (value, index, self) =>
          typeof value === 'string' && self.indexOf(value) === index
      );

    return validClasses.join(' ');
  }

  combineData(element: any, column: columnMetaDataType): string {
    if (!column.combineData) return '';

    const fields = column.combineData;
    let combinedString = fields
      .map((field) => {
        const value = element[field];
        return this.datapipe.transform(
          value,
          column.type || '',
          column.typeArgs || []
        );
      })
      .join(column.combineSeprator || '-');

    return combinedString;
  }

  getTooltipText(element: any, column: columnMetaDataType): string {
    let value: any;

    if (column.combineData) {
      value = this.combineData(element, column);
    } else {
      value = this.datapipe.transform(
        element[column.columnName!],
        this.getColumnType(column),
        this.getColumnTypeArgs(column)
      );
    }

    return value !== null && value !== undefined && column.type != 'boolean'
      ? value.toString()
      : '';
  }

  trackByColumn(index: number, column: columnMetaDataType): string {
    return column.columnName || index.toString();
  }

  getStatusClass(column: columnMetaDataType, value: string | undefined) {
    let ans = '';
    if (column.type === 'status' && value) {
      ans += `status-${value.toLowerCase()}`;
    }
    return ans;
  }
}
