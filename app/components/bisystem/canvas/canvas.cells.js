import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';
import {CanvasHeaderlComponent} from "../canvas/header/canvas.header";

import template from './canvas.cells.html';
import './canvas.cells.scss';
import {canvasCellService} from '../../../services/bisystem/canvas.cell.service';
import Mediator from '../../../lib/mediator';
import {ToolPlugin} from '../utils/tool.plugin';
import msgbox from "../../../lib/msgbox";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import "jquery-ui/ui/widgets/droppable";


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
            const data = {
                'canvas': this,
                'cell': cell
            };
            let com = new CanvasCellComponent(data);
            this.append(com, this.el.find('.cells'));
            this.data.cells.push(cell);
        },

        /**
         * 根据当前视图id，得到当前视图画布块布局，大小
         */
        async getCellLayout() {
            const res = await canvasCellService.getCellLayout({view_id: this.viewId});
            if (res['success'] === 1) {
                this.actions.updateCells(res['data']['data']);
                this.actions.loadCellChart(res['data']['data']);
            } else {
                msgbox.alert(res['error'])
            }
        },

        /**
         * 更新画布块cells
         */
        updateCells(data) {
            this.data.cells = data;
        },


        /**
         * 渲染画布块，只渲染基础数据 eg(left:100, top:100, width: 100, height:100,zIndex:20)
         */
        async loadCellChart(cells) {

            // 获取画布块数据
            let zIndex = [];
            let deeps = [];
            const layouts = {
                'layout_id': '',
                'deep_info': {},
                'floor':'',
                'view_id': this.viewId,
                'xAxis': '',
                'chart_id':'',
                'xOld': []
            };
            const data = {
                'layouts': [JSON.stringify(layouts)],
                'query_type': 'deep',
                'is_deep': 0
            };
            const chartsId = cells.map((cell) => {

                if (cell.is_deep == 1) {
                    console.log(cell);
                    // layouts['layout_id'] = cell.layout_id;
                    // layouts['deep_info'][cell.deep.floor]
                };
                zIndex.push(cell.size.zIndex);
                return cell.chart_id ? cell.chart_id : 0
            });
            let componentIds = [];

            // 获取画布块最大zindex
            this.data.cellMaxZindex = Math.max(...zIndex);

            // 通过cells渲染画布块
            cells.forEach((val, index) => {
                val['canvas'] = this;
                const data = {
                    'canvas': this,
                    'cell': val
                };
                let cell = new CanvasCellComponent(data);
                componentIds.push(cell.componentId);
                this.append(cell, this.el.find('.cells'));
            });

            // 获取画布块的chart数据
            const res = await canvasCellService.getCellChart({chart_id: chartsId});
            let charts = {};
            if (res['success'] === 1) {
                res['data'].forEach((chart,index) => {
                    charts[componentIds[index]] = chart;
                });
                this.messager('canvas:cell:chart:finish', {'data': charts});
            } else {
                msgbox.alert(res['error']);
            };
        },

    },
    binds:[
        // 拖拽start画布mousedown触发
        // {
        //     event: 'mousedown',
        //     selector: '.cell',
        //     callback: function (context,event) {
        //         this.canvas.data.cellMaxZindex++;
        //         let zIndex = this.canvas.data.cellMaxZindex;
        //         $(context).css('zIndex', zIndex);
        //         return false;
        //     }
        // },

    ],

    afterRender() {

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
        Mediator.subscribe("bi:cell:remove", layout_id => {
            _.remove(this.data.cells, function (cell) {
                return cell.layout_id == layout_id;
            });
        });

        // 保存视图画布
        const toolBtns = this.el.find('.views-btn-group');
        toolBtns.on('click', '.view-save-btn', (event) => {
            let cells = _.cloneDeep(this.data.cells);
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
                    msgbox.alert('保存成功');
                }
            });
            return false;
        });

        //添加一个空的画布块
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
    },
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
}