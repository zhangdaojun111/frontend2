import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';
import {CanvasHeaderlComponent} from "../canvas/header/canvas.header";

import template from './canvas.cells.html';
import './canvas.cells.scss';
import {canvasCellService} from '../../../services/bisystem/canvas.cell.service';
import Mediator from '../../../lib/mediator';
import msgbox from "../../../lib/msgbox";

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

            // 通过cells渲染画布块
            let zIndex = [];
            let layouts = []; // 需要请求服务器画布块的chart数据
            let layoutsId = [];
            let userMode = window.config.bi_user === 'manager' ? 'manager' : 'client'; // 判断是客户端还是编辑模式

            cells.map((val,index) => {
                zIndex.push(val.size.zIndex);
                val.deep = userMode === 'manager' ? {} : val.is_deep == 1 ? JSON.parse(val.deep) : val.deep;
                val.is_deep = userMode === 'manager' ? 0 : val.is_deep;
                const data = {
                    'canvas': this,
                    'cell': val
                };
                let cell = new CanvasCellComponent(data);
                this.append(cell, this.el.find('.cells'));
                layoutsId.push(val.layout_id);

                let deep_info = {};
                if (val.is_deep == 0) {
                    deep_info = {}
                } else {
                    if (userMode === 'client') {
                        deep_info[val.deep.floor] = val.deep.xOld.map(x => x['name'])
                    };
                };
                layouts.push(JSON.stringify({
                    chart_id: val.chart_id ? val.chart_id : 0,
                    floor: val.is_deep == 0 ? 0 : userMode === 'client' ? val.deep['floor'] : 0,
                    view_id: this.viewId,
                    layout_id: val.layout_id,
                    xOld: val.is_deep == 0 ? {} : userMode === 'client' ? val.deep['xOld'] : {},
                    row_id:0,
                    deep_info: deep_info
                }));
            });
            // 获取画布块最大zindex
            this.data.cellMaxZindex = Math.max(...zIndex);

            // 获取画布块的chart数据
            const res = await canvasCellService.getCellChart({layouts:layouts,query_type:'deep',is_deep:1});
            let charts = {}
            if (res['success'] == 0) {
                msgbox.alert(res['error']);
            };
            res.forEach((chart, index) => {
                charts[layoutsId[index]] = chart
            })
            this.messager('canvas:cell:chart:finish', {'data': charts, type: 'loadChartData'});
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
                    delete cell['is_deep'];
                    delete cell['deep'];
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