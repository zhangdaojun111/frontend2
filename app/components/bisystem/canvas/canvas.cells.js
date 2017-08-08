import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';
import {CanvasHeaderlComponent} from "../canvas/header/canvas.header";

import template from './canvas.cells.html';
import './canvas.cells.scss';
import {canvasCellService} from '../../../services/bisystem/canvas.cell.service';
import Mediator from '../../../lib/mediator';
import  {ToolPlugin} from '../utils/tool.plugin';

let config = {
    template: template,
    data: {
        views: window.config.bi_views,
        cells:[],
        componentIds: []
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
                this.data.componentIds.push(cellComponent.componentId);
            });
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

        //子组件删除时 更新this.data.cells
        Mediator.subscribe("bi:cell:remove", componentId => {
            for (let [index,id] of this.data.componentIds.entries()) {
                if (id == componentId) {
                    this.data.cells.splice(index,1);
                    break;
                };
            }
        })

        // 保存视图画布
        this.el.on('click', '.view-save-btn', (event) => {
            let cells = ToolPlugin.clone(this.data.cells);
            const data = {
                view_id: this.viewId,
                canvasType: "pc",
                data: cells.map((cell) => {
                    delete cell['chart']
                    return JSON.stringify(cell);
                })
            };
            canvasCellService.saveCellLayout(data).then(res => {
                if (res['success'] === 1) {
                    alert('保存成功')
                }
            })
        })

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