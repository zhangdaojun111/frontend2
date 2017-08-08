import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';
import {CanvasHeaderlComponent} from "../canvas/header/canvas.header";

import template from './canvas.cells.html';
import './canvas.cells.scss';
import {canvasCellService} from '../../../services/bisystem/canvas.cell.service';
import {router} from '../bi.router';
import Mediator from '../../../lib/mediator';


let config = {
    template: template,
    data: {
        views: window.config.bi_views,
        cells:[]
    },
    actions: {
        /**
         * 渲染cells
         */
        async loadCells() {
            // 获取画布块数据
            const chartsId = this.data.cells.map((cell) => cell.chart_id);
            const charts = await canvasCellService.getCellChart({chart_id: chartsId});
            this.data.cells.forEach((val, index) => {
                val['chart'] = charts[index];
                let cellComponent = new CanvasCellComponent(val);
                this.append(cellComponent, this.el.find('.cells'));
            });
            Mediator.publish('init:drag', chartsId);


        },
    },

    afterRender() {
        //加载头部导航
        this.data.views.forEach((val,index) => {
            let canvasHeaderlComponent = new CanvasHeaderlComponent(val);
            this.append(canvasHeaderlComponent,this.el.find('.nav-tabs'));
        });

        let self = this;
        // 匹配导航的视图id
        if (self.viewId) {
            for(let [index,view] of self.data.views.entries()) {
                if (view.id == self.viewId) {
                    $('.nav-tabs a').eq(index).addClass('active');
                };
            }
        } else {
            $('.nav-tabs a').eq(0).addClass('active');
        };
    },

    /**
     * 初始化加载cell(仅加载一次)
     */
    async firstAfterRender() {
        const cells = await canvasCellService.getCellLayout({view_id: this.viewId});
        this.data.cells = cells['data'];
        this.actions.loadCells();
    },


};

export class CanvasCellsComponent extends BiBaseComponent{
    constructor(id) {
        super(config);
        this.viewId = id ? id : this.data.views[0]['id'];
    };
}