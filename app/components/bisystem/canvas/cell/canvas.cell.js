/**
 * Created by birdyy on 2017/7/31.
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './canvas.cell.html';
import './canvas.cell.scss';
import Mediator from '../../../../lib/mediator';

import {CellNormalComponent} from './normal/cell.normal';
import {CellTableComponent} from './table/cell.table';
import {CellRadarComponent} from './radar/cell.radar';
import {CellPieComponent} from './pie/cell.pie';
import {CellNineGridComponent} from './nine.grid/cell.nine.grid';
import {CellMultiChartComponent} from './multi.chart/cell.multi.chart';
import {CellFunnelComponent} from './funnel/cell.funnel';
import {CellCommentComponent} from './comment/cell.comment';

import {canvasCellService} from '../../../../services/bisystem/canvas.cell.service';
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import "jquery-ui/ui/widgets/droppable";

// cell 组件类型，通过匹配assortment渲染不同的组件
const cellTypes = {
    'radar' : CellRadarComponent,
    'table' : CellTableComponent,
    'normal' : CellNormalComponent,
    'multilist' : CellMultiChartComponent,
    'nineGrid' : CellNineGridComponent,
    'funnel': CellFunnelComponent,
    'pie': CellPieComponent,
    'comment': CellCommentComponent
};


let config = {
    template: template,
    actions: {
    },
};

export class CanvasCellComponent extends BiBaseComponent {

    constructor(cell) {
        config.data = cell.chart? cell.chart : null;
        super(config);
        this.cell = cell;
        console.log(this.cell);
    }

    /**
     * 动态渲染组件 通过this.cellType 决定渲染具体的图表
     */
    renderCell() {
        this.el.find('.cell').css(this.cell.size);
        if (this.cell['chart']['assortment']) {
            let cellComponent = new cellTypes[this.cell['chart']['assortment']](this.cell);
            let cellContainer = this.el.find('.cell-chart');
            cellComponent.render(cellContainer);
        }
    }

    afterRender() {


        this.renderCell();
        this.cellDragandResize();

        this.el.on('click', '.del-cell-btn', (event) => {
            this.delCellLayout();
            return false;
        });

        this.el.on('dragover',function(event){
            let ev = event.originalEvent;
            ev.preventDefault();
        });

        this.el.on('drop',async (event) => {
            let ev = event.originalEvent;
            let data = JSON.parse(ev.dataTransfer.getData("Text"));
            this.loadChartData([data.id]);
        });

        // 设置cell zindex 为最大
        let self = this;
        this.el.on('mousedown', '.cell',function(){
            self.cell.canvas.data.cellMaxZindex++;
            let zIndex = self.cell.canvas.data.cellMaxZindex ;
            $(this).css('zIndex', zIndex);
        }).on('mouseup', '.cell', function(){
            self.cell.size.zIndex = self.cell.canvas.data.cellMaxZindex;
        });

        // 返回(下穿)上一层
        this.el.on('click', '.back-floor-btn', (event) => {
            let deepComponentId = this.el.find('.cell-chart').attr('component');
            Mediator.publish(`bi:deep${deepComponentId}:cell`, true);
            return false;
        })

    }

    /**
     * 等CanvasCellComponent组件渲染完成后，在动态渲染组件
     */
    firstAfterRender() {
    };

    /**
     *画布块拖拽，缩放
     */
    cellDragandResize() {
        let dragCell = $(this.el).find('.cell');
        const dragOption = {
            cursor: "crosshair",
            containment: '.cells-container',
            stop: (event, ui) => {
                this.cell.size.left = ui.position.left;
                this.cell.size.top = ui.position.top;
            }
        };
        const resizeOption = {
            stop: (event, ui) => {
                this.cell.size.width = ui.size.width;
                this.cell.size.height = ui.size.height;
                let myChartComponentId = dragCell.find('.cell-chart').attr('component');
                //通知echarts resize更新
                Mediator.publish(`bi:cell${myChartComponentId}:resize`, this.cell.size);
            }
        }
        dragCell.draggable(dragOption).resizable(resizeOption);
    };

    /**
     *删除画布layout
     */
    delCellLayout() {
        let ok = confirm('确定删除');
        if (ok) {
            Mediator.publish('bi:cell:remove', this.componentId);
            this.destroySelf();
        }
    }

    /**
     *加载chart数据
     * @param id 传递chart_id，从服务器获取chart 数据
     */
    async loadChartData(chartId) {
        const res = await canvasCellService.getCellChart({chart_id: chartId});
        this.cell['chart'] = res[0];
        this.data = res[0];
        this.cell.chart_id = chartId[0];
        this.reload();

    }

}