import "core-js/stable";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
//import { interactivitySelectionService } from "powerbi-visuals-utils-interactivityutils";
//start--added for custom visual development
import IVisualHost = powerbi.extensibility.IVisualHost;

import * as d3 from "d3";
type Selection = d3.Selection<T, any, any, any>;
//type selectionManager = d3.Selection<T, any, any, any>;

import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import DataViewCategorical = powerbi.DataViewCategorical;
import DataViewValueColumnGroup = powerbi.DataViewValueColumnGroup;
import PrimitiveValue = powerbi.PrimitiveValue;
//import { Selector } from "powerbi-models";
//import { ISelectionHandler } from "powerbi-visuals-utils-interactivityutils/lib/interactivityBaseService";
import ISelectionManager = powerbi.extensibility.ISelectionManager;

//END--added for custom visual development
export class Visual implements IVisual {
    /*
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;
    */
    //start--added for custom visual development
    private host: IVisualHost;
    private target: HTMLElement;
    private categories: HTMLElement;
    private svg: Selection;
    //private g: d3.Selection<SVGElement, {}, HTMLElement, any>;
    //private svg: selectionManager;
    private container: Selection;
    private circle1: Selection;
    private circle2: Selection;

    private textValue1: Selection;
    private textLabel1: Selection;
    private textArea1: Selection;
    private textValue2: Selection;
    private textLabel2: Selection;
    private textArea2: Selection;

    private visualSettings: VisualSettings;
    private selectionManager: ISelectionManager;

    //END--added for custom visual development
    constructor(options: VisualConstructorOptions) {


        this.svg = d3.select(options.element)
            .append('svg')
            .classed('circleCard', true);
        this.container = this.svg.append("g").classed('container', true);
        this.circle1 = this.container.append("circle").classed('circle1', true);
        this.circle2 = this.container.append("circle").classed('circle', true);
        this.textValue1 = this.container.append("text").classed("textValue", true);
        this.textLabel1 = this.container.append("text").classed("textLabel", true);
        this.textArea1 = this.container.append("p").classed("textArea", true)
        this.textValue2 = this.container.append("text").classed("textValue", true);
        this.textLabel2 = this.container.append("text").classed("textLabel", true);
        this.textArea2 = this.container.append("p").classed("textArea", true)
        //this.textArea = this.container.append("textarea")
        //  .classed("textArea",true);
        //END--added for custom visual development   
    }
    public addCircleCard(options: VisualConstructorOptions, index) {
        this.svg = d3.select(options.element)
            .append('svg')
            .classed('circleCard', true);
        this.container = this.svg.append("g")
            .classed('container', true);
        this.circle1 = this.container.append("circle")
            .classed('circle', true);
        this.textValue1 = this.container.append("text")
            .classed("textValue", true);
        this.textLabel1 = this.container.append("text")
            .classed("textLabel", true);
        this.textArea1 = this.container.append("p")
            .classed("textArea", true)

    }
    public wrap(text, width, height): string {
        text.each(function (idx, elem) {
            var text = (elem);
            text.attr("dy", height);
            var words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (elem.getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
        return text
    }

    public createCard1(object: DataView["categorical"], offset: number, radius: number, index: number) {
        //this.addCircleCard
        this.circle1
            .style("fill", this.visualSettings.circle.circleColor)
            .style("fill-opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", this.visualSettings.circle.circleThickness)
            .attr("r", radius)
            .attr("cx", offset)
            .attr("cy", offset);
        let fontSizeValue: number = radius * 0.5;
        this.textValue1
            .text(<string><unknown>object.values[index].values.filter(function (f) {
                return f != null;
            }))
            .attr("x", offset)
            .attr("y", offset)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("font-size", fontSizeValue + "px");
        let fontSizeLabel: number = fontSizeValue / 3;
        this.textLabel1
            .text(<string>object.values[index].source.groupName)
            .attr("x", offset)
            .attr("y", offset)
            .attr("dy", fontSizeValue * 2.5)
            .attr("text-anchor", "middle")
            .style("font-size", fontSizeLabel + "px")

    }
    public createCard2(object: DataView["categorical"], offset: number, radius: number, index: number) {
        //this.addCircleCard
        this.circle2
            .style("fill", this.visualSettings.circle.circleColor)
            .style("fill-opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", this.visualSettings.circle.circleThickness)
            .attr("r", radius)
            .attr("cx", offset)
            .attr("cy", offset - 200);
        let fontSizeValue: number = radius * 0.5;
        this.textValue2
            .text(<string><unknown>object.values[index].values.filter(function (f) {
                return f != null;
            }))
            .attr("x", offset)
            .attr("y", offset - 200)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("font-size", fontSizeValue + "px");
        let fontSizeLabel: number = fontSizeValue / 3;
        this.textLabel2
            .text(<string>object.values[index].source.groupName)
            .attr("x", offset)
            .attr("y", offset - 200)
            .attr("dy", fontSizeValue * 2.5)
            .attr("text-anchor", "middle")
            .style("font-size", fontSizeLabel + "px")

    }
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    public update(options: VisualUpdateOptions) {
        /*
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        if (this.textNode) {
            this.textNode.textContent = (this.updateCount++).toString();
        }
        */
        //START--added for custom visual development
        //let tempText : string = this.wrap("h",20,10)

        let dataView: DataView = options.dataViews[0];
        let width: number = options.viewport.width;
        let height: number = options.viewport.height;
        this.svg.attr("width", width);
        this.svg.attr("height", height);
        let totalKpi: number = (dataView.categorical.categories.length * 10)
        let radius: number = Math.min(width, height) / totalKpi;
        let currentObject = dataView.categorical
        this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);
        this.visualSettings.circle.circleThickness = Math.max(0, this.visualSettings.circle.circleThickness);
        this.visualSettings.circle.circleThickness = Math.min(10, this.visualSettings.circle.circleThickness);
        //const categoryFieldIndex = 0;
        //const measureFieldIndex = 0;
        //let categories: PrimitiveValue[] = dataView.categorical.categories[0].values;
        //let values: DataViewValueColumnGroup[] = dataView.categorical.values.grouped();
        //let data = {};

        //categories.map((kpiNames : PrimitiveValue, kpiNamesIndex : number) => 
        //for (let index = 0; index < dataView.categorical.categories.length; index++) {
        //currentObject = dataView.categorical
        this.createCard1(currentObject, totalKpi + 100, radius, 1)
        this.createCard2(currentObject, totalKpi + 300, radius, 3)

        this.svg.on('contextmenu', () => {
            const mouseEvent: MouseEvent = event as MouseEvent;
            const eventTarget: EventTarget = mouseEvent.target;
            let dataPoint = d3.select('eventTarget').datum();
            this.selectionManager.showContextMenu(dataPoint, {
                x: mouseEvent.clientX,
                y: mouseEvent.clientY
            });
            mouseEvent.preventDefault();
        });
    }
}