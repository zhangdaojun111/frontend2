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
        let z = 1000;
        let dragCell = $(this.el).find('.cell');
        const dragOption = {
            cursor: "crosshair",
            containment: '.cells-container',
            drag: (event, ui) => {
                dragCell.draggable('option', 'zIndex', 1001)
            },
            stop: (event, ui) => {
                this.cell.size.left = ui.position.left;
                this.cell.size.top = ui.position.top;
            }
        };
        const resizeOption = {
            stop: (event, ui) => {
                this.cell.size.width = ui.size.width;
                this.cell.size.height = ui.size.height;
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

}