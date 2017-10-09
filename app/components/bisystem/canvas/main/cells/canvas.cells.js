import Component from '../../../../../lib/component';
import {CanvasCellComponent} from './cell/canvas.cell';

import template from './canvas.cells.html';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import Mediator from '../../../../../lib/mediator';
import msgbox from '../../../../../lib/msgbox';

let config = {
    template: template,
    data: {
        currentViewId: '', // 当前画布块视图id
        cells: {}, // 用于存储cell的信息(通过componentId标识唯一标识符)
        cellMaxZindex: 0,
    },
    actions: {
        makeCell(data) {
            let cell = new CanvasCellComponent(data,{

                onDrag: (componentId) => {
                    let comp = this.data.cells[componentId];
                    this.data.cellMaxZindex++;
                    comp.data.cellMaxZindex = comp.data.cell.size.zIndex = this.data.cellMaxZindex;
                },

                onUpdateLayout:(data) => {
                    this.data.cells[data.componentId].data.cell = data.cell;
                    if (data['deep_clear']) {
                        this.data.cells[data.componentId].data.cell.deep_clear = data.deep_clear;
                    }
                },

                onRemoveLayout:(componentId) => {
                    delete this.data.cells[componentId];
                },
            });
            this.append(cell, this.el.find('.cells'));
            return cell;
        },

        /**
         * 添加画布块
         */
        addCell(cell) {
            cell.size.zIndex += this.data.cellMaxZindex;
            const data = {
                'currentViewId': this.data.currentViewId,
                'cell': cell
            };
            let cellLayout = this.actions.makeCell(data);
            this.data.cells[cellLayout.componentId] = cellLayout;
        },

        /**
         * 根据当前视图id，得到当前视图画布块布局，大小
         */
        async getCellLayout() {
            const res = await canvasCellService.getCellLayout({view_id: this.data.currentViewId});
            if (res['success'] === 1) {
                try {
                    this.actions.loadCellChart(res['data']['data']);
                } catch (e){

                } finally {

                };
            } else {
                msgbox.alert(res['error'])
            }
        },

        /**
         * 渲染画布块，只渲染基础数据 eg(left:100, top:100, width: 100, height:100,zIndex:20)
         */
        async loadCellChart(layoutsData) {
            let zIndex = [];  // 获取每个画布块的zIndex(用来获取最大)
            let layouts = []; // 需要请求服务器画布块的chart数据
            let userMode = window.config.bi_user === 'manager' ? 'manager' : 'client'; // 判断是客户端还是编辑模式

            // 通过cells渲染画布块
            layoutsData.map((val, index) => {
                zIndex.push(val.size.zIndex);
                val.deep = userMode === 'manager' ? {} : val.is_deep == 1 ? JSON.parse(val.deep) : val.deep;
                val.is_deep = userMode === 'manager' ? 0 : val.is_deep;
                const data = {
                    'currentViewId': this.data.currentViewId,
                    'cell': val
                };
                let cell = this.actions.makeCell(data);
                this.data.cells[cell.componentId] = cell;

                // 在客户模式下获取有没有下穿记录
                let deep_info = {};
                if (val.is_deep == 0) {
                    deep_info = {}
                } else {
                    deep_info[val.deep.floor] = val.deep.xOld.map(x => x['name'])
                };

                layouts.push(JSON.stringify({
                    chart_id: val.chart_id ? val.chart_id : 0,
                    floor: val.is_deep == 0 ? 0 : userMode === 'client' ? val.deep['floor'] : 0,
                    view_id: this.data.currentViewId,
                    layout_id: val.layout_id,
                    xOld: val.is_deep == 0 ? {} : userMode === 'client' ? val.deep['xOld'] : {},
                    row_id: 0,
                    deep_info: deep_info,
                    sort: val.sort
                }));
            });

            // 获取画布块最大zindex
            this.data.cellMaxZindex = Math.max(...zIndex);

            // 获取画布块的chart数据
            const res = await canvasCellService.getCellChart({layouts: layouts, query_type: 'deep', is_deep: 1});
            if (this.data) { // 当快速切换视图的时候 有可能数据返回 但不需要渲染

                //结束加载动画
                this.hideLoading();

                if (res['success'] == 0) {
                    msgbox.alert(res['error']);
                    return false;
                };

                // 当返回成功时，通知各个cell渲染chart数据
                Object.keys(this.data.cells).map((key,index) => {
                    this.data.cells[key].setChartData(res[index]);
                })
            }
        },

        /**
         * 保存画布布局
         */
        saveCanvas() {
            let cells = Object.values(this.data.cells).map(cell => cell.data.cell);
            const data = {
                view_id: this.data.currentViewId,
                canvasType: "pc",
                data: cells.map((cell) => {
                    delete cell['is_deep'];
                    delete cell['deep'];
                    return JSON.stringify(cell);
                })
            };
            canvasCellService.saveCellLayout(data).then(res => {
                if (res['success'] === 1) {
                    msgbox.showTips('保存视图信息成功');
                    for (let index of window.config.bi_views.keys()) {
                        if ( window.config.bi_views[index].name === res['data'].name) {
                            window.config.bi_views[index] = res['data'];
                            break;
                        };
                    }
                    console.log(window.config.bi_views);
                } else {
                    msgbox.showTips(res['error']);
                };
            });
        }
    },
    binds: [],

    afterRender() {
        // 加载loading动画;
        this.showLoading();
        this.actions.getCellLayout();
    },
    beforeDestory() {}
};

export class CanvasCellsComponent extends Component {
    constructor(id, events) {
        super(config, {currentViewId: id});
    }
}