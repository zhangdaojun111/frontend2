/**
 * Created by birdyy on 2017/7/31.
 */
import {CellBaseComponent} from '../base';
import template from './cell.nine.grid.html';
import "./cell.nine.grid.scss";
import handlebars from 'handlebars';

// 自定义handlebar helper
handlebars.registerHelper('enumerateyAxis', function(yAxis,index, options) {
    return yAxis[index];
});

handlebars.registerHelper('enumerateLegend', function(grids,index, options) {
    let items = grids.join(',');
    let arr = items.split(',');
    return arr[index]
});


let config = {
    template: template,
    data: {
        yAxis: [], // 大盘 中盘 小盘
        xAxis: [], // 成长 价值 核心
        grids: [], // 九宫图数据
        legend: []
    },
    actions: {},
    beforeRender: function () {
        let cellChart = {
            cell:this.data.cell,
            chart:this.data.chart
        };
        let _cellChart = CellNineGridComponent.init(cellChart);
        $.extend(true, this.data, _cellChart);
    },
    afterRender() {},
    firstAfterRender() {}
};

export class CellNineGridComponent extends CellBaseComponent {
    constructor(extendConfig) {
        super($.extend(true,{},config,extendConfig));
    }

    /**
     * 初始化组装九宫格数据
     * @param cellChart 画布块数据(通过父类初始化子类传递进来)
     */
   static init(cellChart) {
        if (cellChart['chart']['data']['rows'].length === 0) {
            return false;
        }
        let nineType = parseInt(cellChart['chart']['type']);
        let grids = cellChart['chart']['data']['rows'][0];
        //自定义设置精度
        if(cellChart.chart.customAccuracy){
            grids.forEach((val, index) => {
                grids[index] = val.toFixed(parseInt(cellChart.chart.customAccuracy));
            })
        }
        let types = [];
        let xAxis = [];
        let yAxis = [];
        let legend = [];
        // 合并九宫格数据为[[],[],[]]
        new Array(nineType).fill('').forEach((val, index) => {
            val = grids.slice(index * nineType, index * nineType + nineType);
            types.push(val);
        });

        Object.keys(cellChart['chart']['xAxis']).sort().forEach((keys,index) => {
            xAxis.push(cellChart['chart']['xAxis'][keys]);
        });

        Object.keys(cellChart['chart']['yAxis']).sort().forEach((keys,index) => {
            yAxis.push(cellChart['chart']['yAxis'][keys]);
            xAxis.forEach((val,xAxisindex) =>{
                legend.push(cellChart['chart']['yAxis'][keys]+val);
            })
        });
        cellChart.grids = types;
        cellChart.xAxis = xAxis;
        cellChart.yAxis = yAxis;
        cellChart.legend = legend;

        return cellChart;
    }
}

CellNineGridComponent.config = config;