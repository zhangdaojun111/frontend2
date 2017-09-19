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
    let items = grids.join(',')
    let arr = items.split(',');
    return arr[index]
});


let config = {
    template: template,
    data: {
        yAxis: [], // 大盘 小盘 中盘
        xAxis: [], // 价值 核心 成长
        grids: [], // 九宫图数据
        legend: []
    },
    actions: {
        /**
         * 主题颜色切换
         */
        themeChange(){
            let theme = this.data.chart.theme;
            if (theme == 'green'){
                this.el.find('.grid li:last-child div').css('background','#f1c888');
                this.el.find('.grid li div:last-child').css('background','#33b6ac');
            }else if(theme == 'grayBlue'){
                this.el.find('.grid li:last-child div').css('background','#5b95e8');
                this.el.find('.grid li div:last-child').css('background','#646c9e');
            }
        }
    },
    afterRender() {},
    firstAfterRender() {
        this.actions.themeChange();
    }
}

export class CellNineGridComponent extends CellBaseComponent {
    // constructor(cellChart) {
    //     config.data.cellChart = cellChart ? cellChart : null;
    //     config.actions.init(cellChart);
    //     super(config);
    // }

    constructor(data,event) {
        let cellChart = CellNineGridComponent.init(data);
        super(config,cellChart,event);
    }

    /**
     * 初始化组装九宫格数据
     * @param cellChart 画布块数据(通过父类初始化子类传递进来)
     */
   static init(cellChart) {
        if (cellChart['chart']['data']['rows'].length === 0) {
            return false;
        };
        let nineType = parseInt(cellChart['chart']['type']);
        let grids = cellChart['chart']['data']['rows'][0];
        let types = [];
        let xAxis = [];
        let yAxis = [];
        let legend = [];
        // 合并九宫格数据为[[],[],[]]
        new Array(nineType).fill('').forEach((val, index) => {
            val = grids.slice(index * nineType, index * nineType + nineType);
            types.push(val);
        });
        Object.keys(cellChart['chart']['yAxis']).sort().forEach(keys => {
            yAxis.push(cellChart['chart']['yAxis'][keys])
        });

        Object.keys(cellChart['chart']['xAxis']).sort().forEach((keys,index) => {
            xAxis.push(cellChart['chart']['xAxis'][keys]);
            yAxis.forEach((val,yAxisindex) => {
                legend.push(val+ cellChart['chart']['xAxis'][keys])
            })
        });
        cellChart.grids = types;
        cellChart.xAxis = xAxis;
        cellChart.yAxis = yAxis;
        cellChart.legend = legend;
        return cellChart;
    }
}