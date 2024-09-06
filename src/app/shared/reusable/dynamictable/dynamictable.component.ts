import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ChangeDetectorRef,
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
import { statusType } from '../../../core/models/interfaces/teamLeaveRequest';

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
  ],
  providers: [CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, DataPipe],
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.scss'],
})
export class DynamictableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columnMetaData: columnMetaDataType[] = [];
  columnsToDisplay: string[] = [];

  dataSource!: MatTableDataSource<any>;

  constructor(private datapipe: DataPipe) {}

  ngOnInit() {
    this.setupTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnMetaData'] || changes['data']) {
      this.setupTable();
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

    // Automatically generate columns to display based on columnMetaData
    const sortedColumns = this.columnMetaData
      .filter((ele) => !ele.hide)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((col) => col.columnName || 'combineData');

    // Set up data source
    this.columnsToDisplay = [...sortedColumns];
    this.dataSource = new MatTableDataSource([...this.data]); 
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

  getClass(...classes: (string | string[] | undefined)[]): string {
    return classes
      .filter((item): item is string | string[] => Boolean(item))
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(' ');
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

  getStatusClass(column:columnMetaDataType,value:string | undefined){
    if(column.type==='status' && value){
      return `status-${value.toLowerCase()}`;
    }
    return '';
  }
  
}


