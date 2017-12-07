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
        markSingle:'',
        // headerMenus:[],
    },
    actions: {
        /**
         * 添加画布块
         */
        addCell() {
            let scrollHeight = $('.cells-container').scrollTop();
            const layout = {
                attribute:[],
                layout_id: '',
                chart_id: '',
                name: '',
                select:[],
                deep_clear: "0",
                size: {
                    left: 100,
                    top: scrollHeight > 100 ? scrollHeight : 100,
                    width: 300,
                    height: 300,
                    zIndex: 1
                }
            };
            this.trigger('onAddCell', layout);
        },
        /**
         * 未选中的所有目录取消选中状态
         * @param menuId 选中的目录id
         */
        hideBrothers(menuId){
            this.findAllChildren().forEach((item)=>{
                if(item.data.id == menuId){
                    item.el.find('a').addClass('active');
                    item.el.find('i').addClass('tabs-menu-active-icon');
                }else{
                    item.el.find('a').removeClass('active');
                    item.el.find('i').removeClass('tabs-menu-active-icon');
                }
            });
        }
    },
    binds: [
        {
            event:'click',
            selector:'.views-btn-group .select-all',
            callback: function () {
                this.trigger('selectAllCanvas');
                return false;

            }
        },
        {
            event:'click',
            selector:'.views-btn-group .cancel-select',
            callback: function () {
                this.trigger('cancelSelectCanvas');
                return false;

            }
        },
        {
            event:'click',
            selector:'.views-btn-group .reverse-select',
            callback: function () {
                this.trigger('reverseSelectCanvas');
                return false;

            }
        },
        { //保存画布块
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
        { //清楚缓存
            event:'click',
            selector:'.view-refresh-cache',
            callback: function (context,event) {
                canvasCellService.refreshCache().then((res)=>{
                    if (res['success'] === 1) {
                        msgbox.showTips('清除缓存成功');
                        window.setTimeout(function() {
                            location.reload();
                        },1000);
                    } else {
                        msgbox.alert(res['error']);
                    }
                })
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
                        msgbox.alert('导入成功');
                        window.setTimeout(function() {
                            location.reload();
                        },2000);
                    } else {
                        msgbox.alert(res['error']);
                    }
                })
            }
        },
        { //调用打印
            event:'click',
            selector:'.print-btn',
            callback: function (context,event) {
                this.trigger('onWhenPrintCellDataFinish');
                return false;
            }
        },
    ],
    afterRender() {
        //新窗口隐藏新窗口图标
        if(window === window.parent){
            this.el.find('.new-window').hide();
        }else{
            let url = window.location.href;
            this.el.find('.new-window').attr('href',url);
        }
        this.data.views = window.config.bi_views;
        // 渲染header视图列表
        this.data.views.forEach(viewData => {
            let menu = new CanvasHeaderMenuComponent(viewData,{
                onClearActive:()=>{
                    this.actions.hideBrothers(viewData.id);
                }
            });
            this.append(menu, this.el.find('.nav-tabs'));
            this.data.menus[viewData.id] = menu;
        });
    },
    firstAfterRender(){
        //修改单页模式下的url地址
         if(window.config.query_mark === "single"){
            this.el.find('.new-window').prop('href',`/bi/index/${window.location.search}`);
        }
    },
    beforeDestory(){
    }
};
export class CanvasHeaderComponent extends Component {
    constructor(data, events,extendConfig) {
        let _config = $.extend(true, {}, config);
        if (extendConfig) {
            let binds = Component.mergeBinds(extendConfig.binds, config.binds);
            let _extendConfig = $.extend(true, {}, extendConfig);
            delete _config.binds;
            _extendConfig.binds = binds;
            super($.extend(true,{},_config,_extendConfig), data, events);
        } else {
            super(_config, data, events);
        }
    }
}
