/**
 * Created by birdyy on 2017/7/31.
 */
import Component from '../../../../../lib/component';
import template from './canvas.header.html';
import {CanvasHeaderMenuComponent} from './menu/canvas.header.menu';

let config = {
    template: template,
    data: {
        id: '',
        name: '',
        views: window.config.bi_views,
        editMode: window.config.bi_user === 'manager',
        menus: {}
    },
    actions: {
        /**
         * 添加画布块
         */
        addCell() {
            const layout = {
                layout_id: '',
                chart_id: '',
                name: '',
                size: {
                    left: 100,
                    top: 100,
                    width: 300,
                    height: 300,
                    zIndex: 1
                }
            };
            this.trigger('onAddCell', layout);
        },

    },
    binds: [
        //保存画布块
        {
            event: 'click',
            selector: '.views-btn-group .view-save-btn',
            callback: function (context, event) {
                this.trigger('onSaveCanvas');
                return false;
            }
        },
        {
            // 新增画布块
            event: 'click',
            selector: '.views-btn-group .add-cell-btn',
            callback: function (context, event) {
                this.actions.addCell();
                return false;
            }
        },
    ],
    afterRender() {
        // 渲染header视图列表
        this.data.views.forEach(viewData => {
            let menu = new CanvasHeaderMenuComponent(viewData);
            this.append(menu, this.el.find('.nav-tabs'));
            this.data.menus[viewData.id] = menu;
        })
    }
};

export class CanvasHeaderComponent extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}
