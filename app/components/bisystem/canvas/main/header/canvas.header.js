/**
 * Created by birdyy on 2017/7/31.
 */
import Component from '../../../../../lib/component';
import template from './canvas.header.html';
import {CanvasHeaderMenuComponent} from './menu/canvas.header.menu';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import msgbox from '../../../../../lib/msgbox';

import './canvas.header.scss';

let config = {
    template: template,
    data: {
        id: '',
        name: '',
        views: [],
        editMode: window.config.bi_user === 'manager'? window.config.bi_user : false,
        menus: {},
        isAdmin: window.config.is_admin,
        isSelf: window.config.bi_views.self,
    },
    actions: {
        /**
         * 添加画布块
         */
        addCell() {
            const layout = {
                attribute:[],
                layout_id: '',
                chart_id: '',
                name: '',
                select:[],
                deep_clear: "0",
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

        /**
         * 当前选中的视图
         * @param id 当前视图的id
         * @returns {*}
         */
        canSaveViews(viewId) {
            let biViews = window.config.bi_views;
            let isSelf = _.result(_.find(biViews,{'id':parseInt(viewId)}),'self');
            if(isSelf===1){
                this.el.find('.canSaveView').show();
            }else{
                this.el.find('.canSaveView').hide();
            }
        }

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
        {
            // 导入数据
            event: 'change',
            selector: '#form-data',
            callback: function (context, event) {
                let formData = new FormData();
                formData.append('file',$(context)[0].files[0]);
                canvasCellService.importData(formData).then((res)=>{
                    if (res['success'] === 1) {
                        // msgbox.alert('上传成功');
                        location.reload();
                    } else {
                        msgbox.alert(res['error']);
                    }
                })
            }
        },
    ],
    afterRender() {

        //新窗口隐藏新窗口图标
        if(window === window.parent){
            this.el.find('.new-window').hide();
        };

        this.data.views = window.config.bi_views;
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
