import { TemplateRef } from '@angular/core';

export type ColumnMetaDataType = {
  label: string;
  columnName?: string;
  headerColumnClass?: string[];
  rowColumnClass?: string[];
  commonColumnClass?: string[];
  type?: 'date' | 'currency' | 'number' | 'percent' | 'boolean' | 'status';
  typeArgs?: string[];
  order?: number;
  template?: TemplateRef<any>;
  grow?: boolean;
  combineData?: string[];
  combineSeprator?: string;
  hide?: boolean;
  tooltip?: boolean;
};
