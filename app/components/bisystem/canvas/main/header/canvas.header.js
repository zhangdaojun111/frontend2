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
        headerMenus:[],
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

        // /**
        //  * 当前选中的视图
        //  * @param id 当前视图的id
        //  * @returns {*}
        //  */
        // canSaveViews(viewId) {
        //     let biViews = window.config.bi_views;
        //     let isSelf = _.result(_.find(biViews,{'id':parseInt(viewId)}),'self');
        //     if(isSelf==1){
        //         this.el.find('.canSaveView').show();
        //     }else{
        //         this.el.find('.canSaveView').hide();
        //     }
        // },

        // /**
        //  * 初始化加载时隐藏的更多目录框
        //  */
        // hideMoreMenu(){
        //     let childWidth = 0;
        //     let navTabsWidth = this.el.find('.nav-tabs').width();
        //     this.el.find('.child-menu').css('left',navTabsWidth);//child-menu隐藏目录框显示的位置
        //     this.el.find('.nav-tabs div').each((index,val)=>{//首次加载后的目录，将自身，自身的宽，显示属性添加到headerMenus数组中
        //         this.data.headerMenus.push({'header':$(val),'width':$(val).width(),'show':true});
        //         childWidth += $(val).width();
        //         if(childWidth >= navTabsWidth){//当前目录宽的和大于nav-tabs的宽时 将其余的目录添加到child-menu隐藏目录框中 并将其属性show变为false
        //             this.el.find('.nav-tabs-select').show();
        //             $(val).appendTo(this.el.find('.child-menu'));
        //             this.data.headerMenus[index].show = false;
        //         }
        //     });
        // },
        // /**
        //  *当窗口大小改变时 更多目录框的显示随之改变
        //  */
        // windowChange(){
        //     let childWidth = 0;
        //     let navTabsWidth = this.el.find('.nav-tabs').width();
        //     let navTabsLen = this.el.find('.nav-tabs div').length-1;
        //     let staus = true;
        //     this.el.find('.child-menu').css('left',navTabsWidth);
        //     this.data.headerMenus.forEach((val,index)=>{
        //         if (val.show){
        //             childWidth += val.width;
        //             if(childWidth >= navTabsWidth){
        //                 val.show = false;
        //                 if(this.el.find('.child-menu div').length!==0 && index===navTabsLen && staus){
        //                     this.el.find('.child-menu div:first-child').before(val.header);
        //                 }else {
        //                     val.header.appendTo(this.el.find('.child-menu'));
        //                     staus = false;
        //                 }
        //             }
        //         }else{
        //             childWidth += val.width;
        //             if(childWidth < navTabsWidth){
        //                 val.show = true;
        //                 val.header.appendTo(this.el.find('.nav-tabs'));
        //             }else {
        //                 return;
        //             }
        //         }
        //
        //     });
        //     //下拉图标的显示与隐藏
        //     if(this.el.find('.child-menu div').length){
        //         this.el.find('.nav-tabs-select').css('visibility','visible');
        //     }else{
        //         this.el.find('.nav-tabs-select').css('visibility','hidden');
        //     }
        //
        // },
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
        // { //点击显示更多目录
        //     event:'click',
        //     selector:'.nav-tabs-select',
        //     callback: function (context,event) {
        //         event.stopPropagation();
        //         this.el.find('.child-menu').css('visibility','visible');
        //     }
        // },
        { //调用打印
            event:'click',
            selector:'.print-btn',
            callback: function (context,event) {
                window.print();
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
                    this.actions.hideBrothers(viewData.id);
                }
            });
            this.append(menu, this.el.find('.nav-tabs'));
            this.data.menus[viewData.id] = menu;
        });


    },
    firstAfterRender(){
    },
    beforeDestory(){
    }
};
export class CanvasHeaderComponent extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}
