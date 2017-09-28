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
            if(isSelf==1){
                this.el.find('.canSaveView').show();
            }else{
                this.el.find('.canSaveView').hide();
            }
        },
        /**
         * 初始化加载时隐藏的更多目录框
         */
        hideMoreMenu(){
            let childWidth = 0;
            let parentWidth = this.el.find('.nav-tabs').width();
            this.el.find('.nav-tabs-select').css('left',parentWidth);
            this.el.find('.child-menu').css('left',parentWidth);
            this.el.find('.nav-tabs a').each((index,val)=>{
                childWidth += $(val).outerWidth();
                if(childWidth > parentWidth){
                    $(val).parent().appendTo(this.el.find('.child-menu'));
                }
            });
        },
        /**
         *当窗口大小改变时 更多目录框的显示随之改变
         */
        windowChange(){
            let childWidth = 0;
            let parentWidth = this.el.find('.nav-tabs').width();
            this.el.find('.nav-tabs-select').css('left',parentWidth);
            this.el.find('.child-menu').css('left',parentWidth);
            this.el.find('.nav-tabs div').each((index,val)=>{
                childWidth += $(val).width();
                if(childWidth > parentWidth){
                    if(this.el.find('.child-menu div').length!==0){
                        this.el.find('.child-menu div:first-child').before($(val));
                    }else {
                        $(val).appendTo(this.el.find('.child-menu'));
                    }
                }
            });
            this.el.find('.child-menu div').each((index,val)=>{
                childWidth +=$(val).width();
                if(childWidth < parentWidth){
                    $(val).appendTo(this.el.find('.nav-tabs'));
                }
            })
        }
    },
    binds: [
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
        {
            // 导入数据
            event: 'change',
            selector: '#form-data',
            callback: function (context, event) {
                let formData = new FormData();
                formData.append('file',$(context)[0].files[0]);
                canvasCellService.importData(formData).then((res)=>{
                    if (res['success'] === 1) {
                        location.reload();
                    } else {
                        msgbox.alert(res['error']);
                    }
                })
            }
        },
        { //点击显示更多目录
            event:'click',
            selector:'.nav-tabs-select',
            callback: function (context,event) {
                this.el.find('.child-menu').show();
                event.stopPropagation();
            }
        },
    ],
    afterRender() {

        //新窗口隐藏新窗口图标
        if(window === window.parent){
            this.el.find('.new-window').hide();
        }

        this.data.views = window.config.bi_views;
        // 渲染header视图列表
        this.data.views.forEach(viewData => {
            let menu = new CanvasHeaderMenuComponent(viewData,{
                onClearActive:()=>{
                    console.log('do a test');

                }
            });
            this.append(menu, this.el.find('.nav-tabs'));
            this.data.menus[viewData.id] = menu;
        });

        //第一次渲染之后隐藏多的目录
        this.actions.hideMoreMenu();

    },
    firstAfterRender(){
        //当窗口大小改变时 更多目录框的显示随之改变
        $(window).resize(()=> {
            this.actions.windowChange();
        });

        //点击更多目录框外 隐藏显示框
        $(document.body).bind('click.menu',()=>{
           this.el.find('.child-menu').hide();
        })
    },
    beforeDestory(){
        //当destory时销毁全局document.body click事件
        $(document.body).off('click.menu');
    }
};
export class CanvasHeaderComponent extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}
