import Component from '../../../../lib/component';
import template from './main.html';
import './main.scss';
import {CanvasCellsComponent} from './cells/canvas.cells';
import {CanvasHeaderComponent} from './header/canvas.header';
import {canvasCellService} from '../../../../services/bisystem/canvas.cell.service';
import msgbox from '../../../../lib/msgbox';

let config = {
    template: template,
    data: {
        views: window.config.bi_views,
        currentViewId: '',
        headerComponents: {},
        editMode: window.config.bi_user === 'manager' ? window.config.bi_user : false,
        singleMode: window.location.href.indexOf('single') !== -1,
    },
    binds: [
        // 编辑模式
        {
            event: 'click',
            selector: '.editpage',
            callback: function (context,event) {
                window.location.href = `/bi/manager/#/canvas/${this.currentViewId}`;
                return false;
            }
        },
        // 多页
        {
            event: 'click',
            selector: '.multiplepage',
            callback: function (context,event) {
                window.location.href = `/bi/index/#/canvas/${this.currentViewId}`;
                return false;
            }
        },
        // 单页
        {
            event: 'click',
            selector: '.singlepage',
            callback: function (context,event) {
                window.location.href = `/bi/index/#/canvas/${this.currentViewId}?single`;
                return false;
            }
        },
    ],
    actions: {
        switchViewId: function (viewId) {
            this.currentViewId = viewId ? viewId.toString() : window.config.bi_views[0].id;
            if (!this.data.singleMode) {
                this.data.headerComponents.data.menus[this.currentViewId].actions.focus();
            };
            this.data.cells = new CanvasCellsComponent(this.currentViewId);
            this.data.cells.render(this.el.find('.cells-container'));
        },

        /**
         * 销毁canvas.cells组件
         */
        destroyCanvasCells() {
            this.data.cells.destroySelf();
            this.el.find('.component-bi-canvas-main').append("<div class='cells-container client'></div>")
        }
    },
    afterRender(){
        this.showLoading();
        //根据判断是否单行模式加载header
        if (!this.data.singleMode) {
            let header = new CanvasHeaderComponent({},{
                onAddCell: (cell) => {
                    this.data.cells.actions.addCell(cell)
                },
                onSaveCanvas: () => {
                    this.data.cells.actions.saveCanvas()
                },
            });
            this.append(header, this.el.find('.views-header'));
            this.data.headerComponents = header;
        };
        this.hideLoading();
    },
};

export class CanvasMain extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}


// let CanvasMain = new Component(config);
// CanvasMain.render($('#route-outlet'));
// export {CanvasMain};

