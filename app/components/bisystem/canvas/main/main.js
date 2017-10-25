import Component from '../../../../lib/component';
import template from './main.html';
import './main.scss';
import {CanvasCellsComponent} from './cells/canvas.cells';
import {CanvasHeaderComponent} from './header/canvas.header';
import {canvasCellService} from '../../../../services/bisystem/canvas.cell.service';
import msgbox from '../../../../lib/msgbox';
import {PMAPI} from "../../../../lib/postmsg";

let config = {
    template: template,
    data: {
        views: window.config.bi_views,
        currentViewId: '',
        headerComponents: {},
        editMode: window.config.bi_user === 'manager' ? window.config.bi_user : false,
        singleMode: window.location.href.indexOf('single') !== -1,
        isViewEmpty: false,
    },
    binds: [
        // 编辑模式
        {
            event: 'click',
            selector: '.to-edit-page',
            callback: function (context, event) {
                //编辑模式Iframe
                let iFrameUrl = window.location.href.replace('index', 'manager');
                PMAPI.openDialogByIframe(
                    iFrameUrl,
                    {
                        title: '编辑模式',
                        modal: true,
                        customSize: true,

                    }).then((data) => {
                        location.reload();
                    }
                );
                // window.location.href = `/bi/manager/#/canvas/${this.currentViewId}`;
                return false;
            }
        },
        // 多页
        // {
        //     event: 'click',
        //     selector: '.multiplepage',
        //     callback: function (context, event) {
        //         window.location.href = `/bi/index/#/canvas/${this.currentViewId}`;
        //         return false;
        //     }
        // },
        // 单页
        // {
        //     event: 'click',
        //     selector: '.singlepage',
        //     callback: function (context, event) {
        //         window.location.href = `/bi/index/#/canvas/${this.currentViewId}?single`;
        //         return false;
        //     }
        // },
    ],
    actions: {
        /**
         * 加载canvas
         * @param viewId
         */
        switchViewId: function (viewId) {
            // 如果router没有传viewId 则默认用bi_views第一个
            this.data.currentViewId = viewId && this.data.headerComponents.data.menus[viewId] ? viewId.toString() : window.config.bi_views[0] && window.config.bi_views[0].id;
            if (this.data.currentViewId) {
                this.data.headerComponents.data.menus[this.data.currentViewId].actions.focus();
                this.data.cells = new CanvasCellsComponent(this.data.currentViewId);
                this.data.cells.render(this.el.find('.cells-container'));

               // this.data.headerComponents.actions.canSaveViews(this.data.currentViewId);
            };

        },
        /**
         * 加载头部
         */
        headLoad: function () {
            // if (!this.data.singleMode) {
            //
            // }
            let header = new CanvasHeaderComponent({}, {
                onAddCell: (cell) => {
                    this.data.cells.actions.addCell(cell);
                },
                onSaveCanvas: () => {
                    this.data.cells.actions.saveCanvas();
                },
                onWhenPrintCellDataFinish: async () => {
                    msgbox.showLoadingRoot();
                    const res = await this.data.cells.actions.cellsDataIsFinish();
                    window.print();
                    msgbox.hideLoadingRoot();
                }
            });
            this.append(header, this.el.find('.views-header'));
            this.data.headerComponents = header;
        },

        /**
         * 销毁canvas.cells组件
         */
        destroyCanvasCells() {
            this.data.cells.destroySelf();
            this.el.find('.component-bi-canvas-main').append("<div class='cells-container client " + this.data.editMode + "'></div>")
        }
    },

    afterRender:function(){
        //根据判断是否单行模式加载header
        this.actions.headLoad();
    },
    beforeDestory:function () {}
};

export class CanvasMain extends Component {
    constructor(data, events,extendConfig) {
        config.data.isViewEmpty = window.config.bi_views[0] ? false : true;
        super($.extend(true,{},config,extendConfig), data, events);
    }
}


