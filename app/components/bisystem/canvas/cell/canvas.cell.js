/**
 * Created by birdyy on 2017/7/31.
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './canvas.cell.html';
import './canvas.cell.scss';
import Handlebars from 'handlebars';
import Mediator from '../../../../lib/mediator';

import {CellNormalComponent} from './normal/cell.normal';
import {CellTableComponent} from './table/cell.table';
import {CellRadarComponent} from './radar/cell.radar';
import {CellPieComponent} from './pie/cell.pie';
import {CellNineGridComponent} from './nine.grid/cell.nine.grid';
import {CellMultiChartComponent} from './multi.chart/cell.multi.chart';
import {CellFunnelComponent} from './funnel/cell.funnel';
import {CellCommentComponent} from './comment/cell.comment';
import {CanvasCellTitleComponent} from './title/canvas.title';
import {CanvasDataSourceComponent} from './datasource/datasource';
import {canvasCellService} from '../../../../services/bisystem/canvas.cell.service';

// cell 组件类型，通过匹配assortment渲染不同的组件
const cellTypes = {
    'radar': CellRadarComponent,
    'table': CellTableComponent,
    'normal': CellNormalComponent,
    'multilist': CellMultiChartComponent,
    'nineGrid': CellNineGridComponent,
    'funnel': CellFunnelComponent,
    'pie': CellPieComponent,
    'comment': CellCommentComponent
};


let config = {
    template: template,
    actions: {
        /**
         * 渲染cell
         */
        renderCell() {
            this.el.find('.cell').css(this.data.cell.size);
            this.cellTitle = new CanvasCellTitleComponent();
            this.append(this.cellTitle, this.el.find('.bread-crumb-nav'));
        },
        /**
         * 动态渲染图表
         */
        loadCellChart(chart) {
            if (chart['success'] !== 1) {
                return false;
            };
            const data = {
                chart: chart['data'],
                cell: this.data.cell,
                canvas: this.canvas
            };
            if (chart['data']['assortment']) {
                this.cellTitle.actions.setValue(chart);
                let cellComponent = new cellTypes[chart['data']['assortment']](data);
                let cellContainer = this.el.find('.cell-chart');
                cellComponent.render(cellContainer);
                if(chart['data']['assortment']=='table'){
                    cellComponent.actions.alignTable(chart);
                    // console.log(cellComponent.el);
                }
                this.cellChart = cellComponent;
            }
        },

        /**
         *画布块拖拽，缩放
         */
        cellDragandResize() {
            let dragCell = $(this.el).find('.cell');
            const dragOption = {
                cursor: "crosshair",
                containment: '.cells-container',
                grid: [10, 10],
                stop: (event, ui) => {
                    this.data.cell.size.left = ui.position.left;
                    this.data.cell.size.top = ui.position.top;
                }
            };

            const resizeOption = {
                grid: [10, 10],
                stop: (event, ui) => {
                    this.data.cell.size.width = ui.size.width;
                    this.data.cell.size.height = ui.size.height;
                    let myChartComponentId = dragCell.find('.cell-chart').attr('component');
                    //通知echarts resize更新
                    Mediator.publish(`bi:cell${myChartComponentId}:resize`, this.data.cell.size);
                }
            };

            dragCell.draggable(dragOption).resizable(resizeOption);
        },

        /**
         *删除画布layout
         */
        delCellLayout() {
            Mediator.publish('bi:cell:remove', this.data.cell.layout_id);
            this.destroySelf();
        },

        /**
         *从左侧拖拽图表到画布块，
         * @param id 传递chart_id，从服务器获取chart 数据
         */
        async dragChartData(chart) {
            if (this.loadData) {
                return false;
            };
            const res = await canvasCellService.getCellChart(chart.data);
            this.loadData = false;
            this.data['chart'] = res[0]['data'];
            this.data['cell'].chart_id = chart.chart_id;
            this.data['cell']['is_deep'] = 0;
            this.data.biUser = true;
            this.actions.loadCellChart(res[0]);
        },

        /**
         *显示数据源画布块
         */
        showCellDataSource() {
            let dataSource = new CanvasDataSourceComponent();
            this.append(dataSource,this.el.find('.cell .cell-chart'));
            this.el.find('.back-floor-btn-data').attr('disabled',true);
            this.el.find('.bi-origin-data-close').on('click', ()=> {
                this.el.find('.back-floor-btn-data').attr('disabled',false);
            })
        },

        // /**
        //  * 渲染图表初始化下穿数据
        //  * @param res = 下穿数据
        //  */
        // loadChartDeepData(res) {
        //     console.log(res);
        //     if (res.hasOwnProperty(this.data.cell.layout_id)) {
        //         const chartDeepData = res[this.data.cell.layout_id];
        //         if(chartDeepData['success'] === 1) {
        //             if (chartDeepData['data']['xAxis'].length > 0 && chartDeepData['data']['yAxis'].length > 0) {
        //                 this.cellChart.data.cellChart['chart']['data']['xAxis'] = chartDeepData['data']['xAxis'];
        //                 this.cellChart.data.cellChart['chart']['data']['yAxis'] = chartDeepData['data']['yAxis'];
        //                 //重新渲染echarts
        //                 const option = this.cellChart.pieChart.pieOption(this.cellChart.data.cellChart);
        //                 this.cellChart.pieChart.myChart.setOption(option);
        //                 this.cellChart.pieChart.myChart.resize();
        //             }
        //         }
        //     }
        // }
    },
    data: {
        chart: null,
        isIcon :true,
    },
    binds: [
        // 拖拽start画布mousedown触发
        {
            event: 'mousedown',
            selector: '.cell',
            callback: function (context,event) {
                this.canvas.data.cellMaxZindex++;
                let zIndex = this.canvas.data.cellMaxZindex;
                $(context).css('zIndex', zIndex);
                return false;
            }
        },
        // 拖拽end画布mouseup触发
        {
            event: 'mouseup',
            selector: '.cell',
            callback: function (context,event) {
                this.data.cell.size.zIndex = this.canvas.data.cellMaxZindex;
            }
        },
        // html5原生拖拽，dragover需要ev.preventDefault
        {
            event: 'dragover',
            selector: '',
            callback: function (context,event) {
                let ev = event.originalEvent;
                event.preventDefault();
                return true;
            }
        },
        // 从左侧导航拖拽图表渲染到画布块
        {
            event: 'drop',
            selector: '',
            callback: function (context,event) {
                let ev = event.originalEvent;
                let data = JSON.parse(ev.dataTransfer.getData("Text"));
                ev.dataTransfer.clearData("Text");
                let layout = {
                    chart_id: data.id,
                    floor: 0,
                    view_id: this.canvas.viewId,
                    layout_id: this.data.cell.layout_id,
                    xOld: 0,
                    row_id:0,
                    deep_info: {}
                };
                this.actions.dragChartData({
                    data:{
                        layouts:[JSON.stringify(layout)],
                        query_type:'deep',
                        is_deep:1,
                    },
                    chart_id: data.id
                });
                this.loadData = true;
                return false;
            }
        },
        // 返回(下穿)上一层
        {
            event: 'click',
            selector: '.back-floor-btn',
            callback: function (context,event) {
                let deepComponentId = this.el.find('.cell-chart').attr('component');
                Mediator.publish(`bi:deep${deepComponentId}:cell`, true);
                return false;
            }
        },
        // 删除画布块
        {
            event: 'click',
            selector: '.del-cell-btn',
            callback: function (context,event) {
                this.actions.delCellLayout();
                return false;
            }
        },
        // 显示数据源
        {
            event: 'click',
            selector: '.back-floor-btn-data',
            callback: function (context,event) {
                this.actions.showCellDataSource();
                return false;
            }
        },
    ],
    afterRender() {
        let self = this;
        this.actions.renderCell();
        if (window.config.bi_user !== 'client') {
            this.actions.cellDragandResize();
        } else {
            this.el.off('mousedown mouseup');
        }
    },
    firstAfterRender() {
        // 监听当从服务器获取画布块图表数据finish时
        $('.bi-container').on('canvas:cell:chart:finish', (event,params) => {
            this.data.chart = params['data'][this.data.cell.layout_id];
            this.actions.loadCellChart(this.data.chart);
        })
    },
    beforeDestory() {
        $('.bi-container').off('canvas:cell:chart:finish');
    }
};

export class CanvasCellComponent extends BiBaseComponent {

    constructor(data) {
        config.data.biUser = window.config.bi_user === 'client' ? false : true;
        super(config);
        this.data.cell = data['cell'];
        this.canvas = data['canvas'];
        this.loadData = false;
        this.cellTitle = null; // 图表标题组件
        this.cellChart = null; // 动态渲染图表组件
    }
}