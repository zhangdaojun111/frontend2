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

import {canvasCellService} from '../../../../services/bisystem/canvas.cell.service';

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
    afterRender() {
    }
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
        let cellComponent = new cellTypes[this.cell['chart']['assortment']](this.cell);
        let cellContainer = this.el.find('.cell-chart');
        cellComponent.render(cellContainer);
    }

    /**
     * 等CanvasCellComponent组件渲染完成后，在动态渲染组件
     */
    firstAfterRender() {
        this.renderCell();
        Mediator.subscribe("chart:drag", (data) => {
            if (data['componentId'] && Number(data['componentId']) === this.componentId) {
                let chartId = [data.id];
                canvasCellService.getCellChart({chart_id: chartId}).then(res => {
                    this.cell.chart = res[0];
                    this.renderCell();
                })
            }
        })
    }
}