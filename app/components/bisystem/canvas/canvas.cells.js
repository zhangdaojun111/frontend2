import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';
import {CanvasHeaderlComponent} from "../canvas/header/canvas.header";

import template from './canvas.cells.html';
import './canvas.cells.scss';
import {canvasCellService} from '../../../services/bisystem/canvas.cell.service';
import Mediator from '../../../lib/mediator';
import {ToolPlugin} from '../utils/tool.plugin';


let config = {
    template: template,
    data: {
        views: window.config.bi_views,
        cells:[],
        componentIds: [],
        cellMaxZindex: 0,
        canvasSingle:false,
        biUser:window.config.bi_user === 'client' ? true : false,
    },
    actions: {
        /**
         * 渲染cells
         */
        async loadCells() {
            // 获取画布块数据
            let zIndex = [];
            const chartsId = this.data.cells.map((cell) => {
                zIndex.push(cell.size.zIndex);
                return cell.chart_id ? cell.chart_id : 0
            });

            // 获取画布块最大zindex
            this.data.cellMaxZindex = Math.max(...zIndex);

            const charts = await canvasCellService.getCellChart({chart_id: chartsId});
            this.data.cells.forEach((val, index) => {
                val['chart'] = charts[index];
                val['canvas'] = this;
                let id = this.instantiationCell(val);
                val['componentId'] = id;
            });
        },

        /**
         * 添加画布块
         */
        addCell() {

            const cell = {
                layout_id: '',
                chart_id: '',
                name:'',
                size: {
                    left: 100,
                    top: 100,
                    width: 300,
                    height: 300,
                    zIndex: this.data.cellMaxZindex
                }
            };
            cell.chart = {};
            cell['canvas'] = this;
            let id = this.instantiationCell(cell);
            cell['componentId'] = id;
            this.data.cells.push(cell);
        },

        /**
         * 初始化加载cell(仅加载一次)
         */
        async getCellLayout() {
            const cells = await canvasCellService.getCellLayout({view_id: this.viewId});
            this.data.cells = cells['data'];
            this.actions.loadCells();
        }

    },

    afterRender() {
        this.cells = [];
        //加载头部导航
        if(config.data.canvasSingle){
            this.data.views.forEach((val,index) => {
                let canvasHeaderlComponent = new CanvasHeaderlComponent(val);
                this.append(canvasHeaderlComponent,this.el.find('.nav-tabs'));
            });
        }
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
            _.remove(this.data.cells, function (cell) {
                return cell.componentId === componentId;
            });
        });

        // 保存视图画布
        const toolBtns = this.el.find('.views-btn-group');
        toolBtns.on('click', '.view-save-btn', (event) => {
            let cells = ToolPlugin.clone(this.data.cells);
            const data = {
                view_id: this.viewId,
                canvasType: "pc",
                data: cells.map((cell) => {
                    delete cell['chart'];
                    delete cell['canvas'];
                    delete cell['componentId'];
                    return JSON.stringify(cell);
                })
            };
            canvasCellService.saveCellLayout(data).then(res => {
                if (res['success'] === 1) {
                    alert('保存成功')
                }
            });
            return false;
        });

        //
        toolBtns.on('click', '.add-cell-btn', (event) => {
            this.actions.addCell();
            return false;
        });

        //单页跳转指定路由
        $('.btn-single').click(function () {
            let pathname = '/bi/index/';
            let hash = window.location.hash;
            let url = `${pathname}${hash}?single`;
            window.location.href = url;
        });

        this.el.on('click', '.bi-manage-btn', function(event){
            let url = window.location.hash;
            let reg = url.replace(/\?single/, "");
            window.location.href = `/bi/manager/${reg}`;
        }).on('click', '.btn-multip', function(){
            let url = window.location.hash;
            window.location.href = `/bi/index/${url}`;
        });

        this.actions.getCellLayout()
    }
};

export class CanvasCellsComponent extends BiBaseComponent{
    constructor(id) {
        let hash = window.location.href.indexOf('single');
        if(hash>0){
            config.data.canvasSingle = false;
        } else {
            config.data.canvasSingle = true;
        };
        config.data.views = window.config.bi_views;
        super(config);
        this.viewId = id ? id : this.data.views[0] ? this.data.views[0]['id'] : [] ;
    }

    /**
     * 实例化cell
     * @param data cell实例化初始数据
     */
    instantiationCell(data) {
        let cellComponent = new CanvasCellComponent(data);
        this.append(cellComponent, this.el.find('.cells'));
        this.data.componentIds.push(cellComponent.componentId);
        return cellComponent.componentId;
    }
}