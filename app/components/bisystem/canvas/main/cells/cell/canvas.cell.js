/**
 * Created by birdyy on 2017/7/31.
 */

import Component from '../../../../../../lib/component';
import template from './canvas.cell.html';
import './canvas.cell.scss';
import Mediator from '../../../../../../lib/mediator';

import {CellNormalComponent} from './normal/cell.normal';
import {CellTableComponent} from './table/cell.table';
import {CellRadarComponent} from './radar/cell.radar';
import {CellPieComponent} from './pie/cell.pie';
import {CellNineGridComponent} from './nine.grid/cell.nine.grid';
import {CellMultiChartComponent} from './multi.chart/cell.multi.chart';
import {CellFunnelComponent} from './funnel/cell.funnel';
import {CellCommentComponent} from './comment/cell.comment';
import {CellStylzieComponent} from './stylzie/cell.stylzie';
import {CanvasCellTitleComponent} from './title/canvas.title';
import {CellGaugeComponent} from './gauge/cell.gauge';
import {CellMapComponent} from './map/cell.map';
import {CellApprovalComponent} from './approval/cell.approval';
import {CellCalendarComponent} from './calendar/cell.calendar';

import {canvasCellService} from '../../../../../../services/bisystem/canvas.cell.service';
import msgbox from '../../../../../../lib/msgbox';

// cell 组件类型，通过匹配assortment渲染不同的组件
const cellTypes = {
    'radar': CellRadarComponent,
    'table': CellTableComponent,
    'normal': CellNormalComponent,
    'multilist': CellMultiChartComponent,
    'nineGrid': CellNineGridComponent,
    'funnel': CellFunnelComponent,
    'pie': CellPieComponent,
    'comment': CellCommentComponent,
    'stylzie': CellStylzieComponent,
    'map':CellMapComponent,
    'gauge' : CellGaugeComponent,
    'approval' : CellApprovalComponent,
    'calendar' : CellCalendarComponent,
};


let config = {
    template: template,
    actions: {
        /**
         * 渲染cell
         */
        renderCell() {
            let windowSize = $(document).width();
            if (windowSize && windowSize <= 960) {
                this.data.cell.size.width = 'auto';
            }
            this.el.find('.cell').css(this.data.cell.size);
            this.cellTitle = new CanvasCellTitleComponent({},{
                /**
                 * 显示原始数据
                 */
                onShowOriginal: () => {
                    let originalData = this.data.cellComponent.data;
                    this.data.cellComponent.showCellDataSource(originalData,this.el.find('.cell-chart'))
                }
            });
            this.append(this.cellTitle, this.el.find('.bread-crumb-nav'));
        },
        /**
         * 动态渲染图表
         */
        loadCellChart(chart) {
            if (!chart || chart['success'] !== 1) {
                msgbox.showTips(chart['error']);
                return false;
            }
            const data = {
                chart: chart['data'],
                cell: this.data.cell,
                viewId: this.data.currentViewId,
            };
            if (chart['data']['assortment']) {
                this.cellTitle.actions.setValue(chart,this.data.currentViewId);
                this.data.cellComponent = new cellTypes[chart['data']['assortment']](data, {
                    onUpdateChartDeepTitle: (data) => {
                        this.cellTitle.actions.setDeepTitle(data)
                    }
                });
                let cellContainer = this.el.find('.cell-chart');
                this.data.cellComponent.render(cellContainer);
            }

            //bi打印pdf则执行回调
            if(window.config.pdf === true){
                if(this.el.find('.bi-table').length > 0){
                    let cellWidth = this.el.find('.cell').width();
                    console.log(cellWidth);
                    console.log(this.el.find('.bi-table')[0].scrollWidth);
                    let width = Math.max(this.el.find('.bi-table')[0].scrollWidth + 30,cellWidth);
                    console.log(width);
                    let widthChart = width - 20;
                    console.log(widthChart);
                    this.el.find('.cell').css('width',width);
                    this.el.find('.cell-chart').css('width',widthChart);
                }
                if(this.data.isLast === true){
                    this.actions.loadChartFinish();
                }
            }
        },

        /**
         *画布块拖拽，缩放
         */
        cellDragandResize() {
            let dragCell = this.el.find('.cell');
            const dragOption = {
                containment: '.cells-container',
                grid: [1, 1],
                stop: (event, ui) => {
                    this.actions.cancelSelect();
                    this.data.cell.size.left = ui.position.left;
                    this.data.cell.size.top = ui.position.top;
                    this.trigger('onUpdateLayout', {componentId: this.componentId,cell:this.data.cell});
                },
                // cancel: "div.comment"//造成编辑状态下，需点击cell外才可以响应键盘事件
            };

            const resizeOption = {
                grid: [1, 1],
                stop: (event, ui) => {
                    this.data.cell.size.width = ui.size.width;
                    this.data.cell.size.height = ui.size.height;
                    let myChartComponentId = dragCell.find('.cell-chart').attr('component');
                    this.trigger('onUpdateLayout', {componentId: this.componentId,cell:this.data.cell});
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
            this.trigger('onRemoveLayout', this.componentId);
            this.destroySelf();
        },

        /**
         *从左侧拖拽图表到画布块，
         * @param id 传递chart_id，从服务器获取chart 数据
         */
        async dragChartData(chart) {
            if (this.loadData) {
                return false;
            }
            const res = await canvasCellService.getCellChart(chart.data);
            this.loadData = false;
            this.data['chart'] = res[0]['data'];
            this.data['cell'].chart_id = chart.chart_id;
            this.data['cell']['is_deep'] = 0;
            this.trigger('onUpdateLayout', {componentId: this.componentId,cell:this.data.cell, deep_clear: this.data.cell.layout_id ? "1" : "0"});
            this.data.biUser = true;
            this.actions.loadCellChart(res[0]);
        },

        cancelSelect() {
            this.el.find('.move-with-keyboard').prop('checked', false);
            this.actions.removeKeyboardListener();
        },

        select(){
            if(this.el.find('.move-with-keyboard').prop('checked')){
                return
            }
            this.el.find('.move-with-keyboard').prop('checked', true);
            this.actions.addKeyboardListener();
        },

        toggleSelect(){
            let checked = this.el.find('.move-with-keyboard').prop('checked');
            if(checked){
                this.actions.removeKeyboardListener();
            } else {
                this.actions.addKeyboardListener();
            }
            this.el.find('.move-with-keyboard').prop('checked', !checked);
        },

        addKeyboardListener() {
            // this.el.on('keydown','.cell',this.actions.keyEvent);
            document.addEventListener('keydown',this.actions.keyEvent);
        },
        removeKeyboardListener() {
            // this.el.off('keydown','.cell',this.actions.keyEvent);
            document.removeEventListener('keydown',this.actions.keyEvent);
        },
        keyEvent(event){
            let key = event.key;
            let top = parseInt(this.el.find('.cell').css('top'));
            let left = parseInt(this.el.find('.cell').css('left'));
            let offSet = 20;
            switch (key){
                case 'ArrowDown':
                    top +=offSet;
                    event.preventDefault();
                    break;
                case 'ArrowUp':
                    top = (top<offSet)? 0 : top - offSet;
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    left = (left<offSet)? 0 :left - offSet;
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    left += offSet;
                    event.preventDefault();
                    break;
            }
            this.el.find('.cell').css({'left':left+'px','top':top+'px'});
            this.data.cell.size.left = left;
            this.data.cell.size.top = top;
            this.trigger('onUpdateLayout', {componentId: this.componentId,cell:this.data.cell});
        }

    },

    data: {
        chart: null,
        isIcon :true,
        cellComponent:'',
        cellMaxZindex:1
    },

    binds: [
        // 拖拽start画布mousedown触发
        {
            event: 'mousedown',
            selector: '.cell',
            callback: function (context,event) {
                this.trigger('onDrag',this.componentId);
                $(context).css('zIndex', this.data.cellMaxZindex);
                event.stopPropagation();
            }
        },
        // 拖拽end画布mouseup触发

        // {
        //     event: 'mouseup',
        //     selector: '.cell',
        //     callback: function (context,event) {
        //         // this.data.cell.size.zIndex = this.data.cellMaxZindex;
        //     }
        // },
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
                    view_id: this.data.currentViewId,
                    layout_id: this.data.cell.layout_id,
                    xOld: {},
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
        // 显示富文本编辑器
        {
            event: 'click',
            selector: '.rich-text-btn',
            callback: function (context,event) {
                if (this.data.cellComponent.actions.showQuill) {
                    this.data.cellComponent.actions.showQuill()
                }
                return false;
            }
        },
        //是否用键盘移动画布
        {
            event:'click',
            selector:'.move-with-keyboard',
            callback:function (event) {
                if(event.checked){
                    this.actions.addKeyboardListener();
                } else {
                    this.actions.removeKeyboardListener();
                }
            }
        }
    ],
    afterRender() {
        this.actions.renderCell();
        if (window.config.bi_user !== 'client') {
            this.actions.cellDragandResize();
        } else {
            this.el.off('mousedown mouseup');
        }

        if(window.config.pdf){
            this.el.find('.cell').addClass('download-pdf');
        }
    }
};

export class CanvasCellComponent extends Component {

    constructor(data, events,extendConfig) {
        super($.extend(true,{},config,extendConfig), data, events);
        // config.data.biUser = window.config.bi_user === 'client' ? false : true;
        // super(config);
        // this.data.cell = data['cell'];
        // this.canvas = data['canvas'];
        // this.loadData = false;
        // this.cellTitle = null; // 图表标题组件
        // this.cellChart = null; // 动态渲染图表组件
    }
    setChartData(chart) {
        try {
            this.data.chart = chart['data'];
            this.actions.loadCellChart(chart);
        } catch (err) {
            console.log(err)
        } finally {

        }
    }
}