// PowerBI-Visuals_Tutorial_CircleCard\src\visual.ts

"use strict";

import "./../style/visual.less";

import { debug } from "./lib/utilities/helper";

/**/
import powerbi from "powerbi-visuals-api";

import "core-js/stable";

/**/
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.IVisualHost;

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;

/**/
import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

/**/
import ISelectionManager = powerbi.extensibility.ISelectionManager;

import * as d3 from "d3";
import { select as d3Select } from "d3-selection";
const getEvent = () => require("d3-selection").event;

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
  private host: IVisualHost;

  private visualSettings: VisualSettings;
  private selectionManager: ISelectionManager;

  private target: HTMLElement;

  private svg: Selection<SVGElement>;
  private container: Selection<SVGElement>;
  private circle: Selection<SVGElement>;
  private textValue: Selection<SVGElement>;
  private textLabel: Selection<SVGElement>;
  private path: Selection<SVGPathElement>;
  private label: Selection<SVGTextPathElement>;

  private counterValue: Selection<SVGElement>;
  private counterLabel: Selection<SVGElement>;
  private counter: number;
  private textNode: Text;

  /**
   * 
   */
  constructor(options: VisualConstructorOptions) {
    console.log('Visual constructor', options);
    this.target = options.element;

    this.counter = 0;

    this.svg = d3.select(options.element).append("svg").classed("circleCard", true);

    /**/
    this.container = this.svg.append("g").classed("container", true);

    /**/
    this.circle = this.container.append("circle").classed("circle", true);
    this.textValue = this.container.append("text").classed("textValue", true);
    this.textLabel = this.container.append("text").classed("textLabel", true);

    /**/
    this.counterLabel = this.container.append('text')
      .attr('href', '#path')
      .attr('startOffset', '50%')
      .style('text-anchor', 'middle')
      .text("Update Count:");

    this.counterValue = this.container.append("text")
      .classed("textLabel", true);

    /*
    this.handleContextMenu();
    */
  }

  /**
   *
   */
  public update(options: VisualUpdateOptions) {
    console.log("update: options=", options);

    let dataView: DataView = options.dataViews[0];
    this.visualSettings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);

    this.visualSettings.circle.circleThickness = Math.max(0, this.visualSettings.circle.circleThickness);
    this.visualSettings.circle.circleThickness = Math.min(10, this.visualSettings.circle.circleThickness);
    this.visualSettings.circle.fontSize = this.visualSettings.circle.fontSize;

    console.log("update: circle=", this.visualSettings.circle)

    let width: number = options.viewport.width;
    let height: number = options.viewport.height;

    /**/
    this.svg.attr("width", width);
    this.svg.attr("height", height);
    let radius: number = Math.min(width, height) / 2.2;

    /**/
    this.circle
      .style("fill", this.visualSettings.circle.circleColor)
      .style("fill-opacity", 0.5)
      .style("stroke", "black")
      .style("stroke-width", this.visualSettings.circle.circleThickness)
      .attr("r", radius)
      .attr("cx", width / 2)
      .attr("cy", height / 2);

    /**/
    let fontSize: number = this.visualSettings.circle.fontSize;
    console.log("update: fontSize=", fontSize)

    this.textValue
      .text(<string>dataView.single.value)
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("font-size", fontSize + "px");

    /**/
    this.textLabel
      .text(dataView.metadata.columns[0].displayName)
      .attr("x", "50%")
      .attr("y", height / 2)
      .attr("dy", fontSize / 1.2)
      .attr("text-anchor", "middle")
      .style("font-size", fontSize + "px");
  }


  /**
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstanceEnumeration {
    const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();

    console.log("enumerateObjectInstances: settings", settings)
    console.log("enumerateObjectInstances: options", options)

    return VisualSettings.enumerateObjectInstances(settings, options);
  }

  /**
   * 
   */
  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  /**
   * 
   */
  private handleContextMenu() {
    debug(2, "handleContextMenu")

    this.container.on("contextmenu", (event) => {
      debug(2, "handleContextMenu: event=", event)
      let mouseEvent: MouseEvent = getEvent();
      let eventTarget: EventTarget = mouseEvent.target;
      let dataPoint: any= d3Select(<d3.BaseType>eventTarget).datum();     
      let data: any = dataPoint.datum();
      
      this.selectionManager.showContextMenu(
        data ? data.selectionId : {},
        {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
        }
      );
      mouseEvent.preventDefault();
    });
  }
}
