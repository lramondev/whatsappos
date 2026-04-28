import { Column as ColumnInterface } from "../../../../../interfaces";
import { IdColumn, EmptyColumn, StatusColumn, TextColumn, ComponentColumn } from "../columns";

export class Column {

  static id(): ColumnInterface {
    return IdColumn()
  }

  static text(
    column_def: string, 
    header: string, 
    width = 300
  ): ColumnInterface {
    return TextColumn(column_def, header, width);
  }
  
  static status(): ColumnInterface {
    return StatusColumn();
  }

  static empty(): ColumnInterface {
    return EmptyColumn()
  }

  static component(
    column_def: string,
    header: string,
    width = 100,
    component: any,
    inputs: Record<string, any> = {}
  ): ColumnInterface {
    return ComponentColumn(column_def, header, width, component, inputs);
  }
}