/**
 * Created by birdyy on 2017/7/31.
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './canvas.cell.html';
import './canvas.cell.scss';

import {CellNormalComponent} from './normal/cell.normal';
import {CellTableComponent} from './table/cell.table';
import {CellRadarComponent} from './radar/cell.radar';
import {CellPieComponent} from './pie/cell.pie';
import {CellNineGridComponent} from './nine.grid/cell.nine.grid';
import {CellMultiChartComponent} from './multi.chart/cell.multi.chart';
import {CellFunnelComponent} from './funnel/cell.funnel';
import {CellCommentComponent} from './comment/cell.comment';


// cell 组件类型，通过匹配assortment渲染不同的组件
const cellTypes = {
    'radar' : CellRadarComponent,
    'table' : CellTableComponent,
    'normal' : CellNormalComponent,
    'multilist' : CellMultiChartComponent,
    'nineGrid' : CellNineGridComponent,
    'funnel': CellFunnelComponent,
    'comment': CellCommentComponent,
    'pie': CellPieComponent
};


let config = {
    template: template,
    actions: {
    }
};

export class CanvasCellComponent extends BiBaseComponent {

    constructor(cellType, data) {
        config.data = data? data : null;
        super(config);
        this.cellType = cellType;
    }

    /**
     * 动态渲染组件 通过this.cellType 决定渲染具体的图表
     */
    renderCell() {
        let cellComponent = new cellTypes[this.cellType]();
        cellComponent.render($('.cell-chart'));
    }

    /**
     * 等CanvasCellComponent组件渲染完成后，在动态渲染组件
     */
    firstAfterRender() {
        this.renderCell()
    }
}