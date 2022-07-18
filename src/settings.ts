"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;


export class VisualSettings extends DataViewObjectsParser {
  public circle: CircleSettings = new CircleSettings();
  public dataPoint: DataPointSettings = new DataPointSettings();
}
export class DataPointSettings {
  public defaultColor: string = "";
  public showAllDataPoints: boolean = true;
  public fill: string = "";
  public fillRule: string = "";
  public fontSize: number = 24;
}



export class CircleSettings {
  public circleColor: string = "white";
  public circleThickness: number = 2;
  public fontSize: number = 24;
}
