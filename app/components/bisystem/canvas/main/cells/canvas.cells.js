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
        /**
         * 获取画布块数据
         * @param cells 需要渲染的画布块数据的组件
         */
        async getCellChartData(layouts,cells) {
            const res = await canvasCellService.getCellChart({layouts: layouts, query_type: 'deep', is_deep: 1});
            if (this.data) { // 当快速切换视图的时候 有可能数据返回 但不需要渲染

                if (res['success'] == 0) {
                    msgbox.alert(res['error']);
                    return false;
                };

                // 当返回成功时，通知各个cell渲染chart数据
                cells.map((item,index) => {
                    item.setChartData(res[index]);
                })
            };
        },

        /**
         * 瀑布流方式加载cell chart data 数据(pc端的处理)
         * @param option = {top：scrollbar的滚动距离}
         */
        async waterfallLoadingCellData(option) {
            let top = option.top;
            let layouts = [];
            let cells = [];
            let cellsHeight = this.el.height() ? this.el.height() : 940;
            Object.keys(this.data.cells).forEach(key => {
                let cellSizeTop = this.data.cells[key].data.cell.size.top;
                let cellSizeHeight = this.data.cells[key].data.cell.size.height;
                let startSection = top <= cellSizeTop + cellSizeHeight;
                let endSection = cellSizeTop > cellsHeight + top ? false : true;
                if (startSection && endSection && !this.data.cells[key].data.chart) {
                    layouts.push(this.data.cells[key].data.layout);
                    cells.push(this.data.cells[key]);
                };
            });
            // 获取画布块的chart数据
            if (layouts.length > 0) {
                this.actions.getCellChartData(layouts,cells);
            };

        },

        /**
         * 瀑布流方式加载cell chart data 数据(移动端的处理)
         * @param option = {top：scrollbar的滚动距离}
         */
        async phoneWaterfallLoadingCellData(option) {
            let top = option.top;
            let layouts = [];
            let cells = [];
            let viewAllHeight = 0; // 手机端可视区域需要加载cells的总高度
            for (let key of Object.keys(this.data.cells)) {
                if (viewAllHeight <= this.el.height() + top && !this.data.cells[key].data.chart) {
                    layouts.push(this.data.cells[key].data.layout);
                    cells.push(this.data.cells[key]);
                };

                if (viewAllHeight > this.el.height() + top) {
                    break;
                } else {
                    viewAllHeight += this.data.cells[key].data.cell.size.height;
                }
            };
            // 获取画布块的chart数据
            if (layouts.length > 0) {
                this.actions.getCellChartData(layouts,cells);
            };
        },

        /**
         * 是否加载了所有的画布块数据
         */
        async cellsDataIsFinish() {
            let layouts = [];
            let cells = [];
            Object.keys(this.data.cells).forEach(key => {
                if (!this.data.cells[key].data.chart) {
                    layouts.push(this.data.cells[key].data.layout);
                    cells.push(this.data.cells[key]);
                };
            });

            // 获取画布块的chart数据
            if (layouts.length > 0) {
                await this.actions.getCellChartData(layouts,cells);
            };

            return new Promise((resolve, reject) => {
                resolve('finish');
            })
        },

        isScrollStop() {
            // 判断此刻到顶部的距离是否和1秒前的距离相等
            if(this.el.scrollTop() == this.data.curScrollTop) {
                console.log("scroll bar is stopping!");
                let windowSize = $(window).width();
                if (windowSize && windowSize <= 960) {
                    this.actions.phoneWaterfallLoadingCellData({top: this.data.curScrollTop});
                } else {
                    this.actions.waterfallLoadingCellData({top: this.data.curScrollTop});
                };
                clearInterval(this.data.interval);
                this.data.interval = null;
            }
        },

        /**
         * 实例化画布块，并返回实例化的对象
         */
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

                this.data.cells[cell.componentId].data.layout = JSON.stringify({
                    chart_id: val.chart_id ? val.chart_id : 0,
                    floor: val.is_deep == 0 ? 0 : userMode === 'client' ? val.deep['floor'] : 0,
                    view_id: this.data.currentViewId,
                    layout_id: val.layout_id,
                    xOld: val.is_deep == 0 ? {} : userMode === 'client' ? val.deep['xOld'] : {},
                    row_id: 0,
                    deep_info: deep_info,
                    sort: val.sort
                });
            });

            // 获取画布块最大zindex
            this.data.cellMaxZindex = Math.max(...zIndex);
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
                        if (window.config.bi_views[index].name === res['data'].name) {
                            window.config.bi_views[index] = res['data'];
                            break;
                        };
                    }
                } else {
                    msgbox.showTips(res['error']);
                };
            });
        }
    },
    binds: [
        { //滚动距离
            event: 'scroll',
            selector: '',
            callback: function (context, event) {
               let curScrollTop = $(context).scrollTop();
               if (!this.data.interval) {
                   this.data.interval = setInterval(() => {
                       this.actions.isScrollStop();
                   }, 500);
               };
               this.data.curScrollTop = curScrollTop;
            }
        },
    ],

    async afterRender() {

        // 加载loading动画;
        await this.actions.getCellLayout();

        if (this.data) {
            let windowSize = $(window).width();
            if (windowSize && windowSize <= 960) {
                this.actions.phoneWaterfallLoadingCellData({top: this.el.scrollTop()});
            } else {
                this.actions.waterfallLoadingCellData({top: this.el.scrollTop()});
            };
        };
    },
    beforeDestory() {}
};

export class CanvasCellsComponent extends Component {
    constructor(id, events,extendConfig) {
        super($.extend(true,{},config,extendConfig), {currentViewId: id});
    }
}