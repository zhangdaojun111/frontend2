import Component from '../../../../lib/component';
import template from './main.html';
import './main.scss';
import {CanvasCellsComponent} from './cells/canvas.cells';
import {CanvasHeaderComponent} from './header/canvas.header';
import {canvasCellService} from '../../../../services/bisystem/canvas.cell.service';
import msgbox from '../../../../lib/msgbox';
import {PMAPI} from "../../../../lib/postmsg";
import Mediator from '../../../../lib/mediator';
import {Backbone} from 'backbone';


let config = {
    template: template,
    data: {
        views: window.config.bi_views,
        currentViewId: '',
        headerComponents: {},
        editMode: window.config.bi_user === 'manager' ? window.config.bi_user : false,
        singleMode: window.location.href.indexOf('single') !== -1,
        isViewEmpty: false,
        carouselInterval:3,
        operateInterval:4,
        viewArr:window.config.bi_views,  //所有bi视图
        viewNo:0,   //记录当前视图在数组中的位置
        timer:null, //记录即将执行的轮播动画
        firstCanvas:true,   //第一次直接加载cells，后续通过轮播动画更换
    },
    binds: [
        // 编辑模式
        {
            event: 'click',
            selector: '.to-edit-page',
            callback: function (context, event) {
                // 编辑模式Iframe
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
                return false;
            }
        },
    ],
    actions: {
        /**
         * 通过鼠标点击执行视图切换
         * @param viewId
         */
        switchViewId: function (viewId) {
            // 如果router没有传viewId 则默认用bi_views第一个
            this.data.currentViewId = viewId && this.data.headerComponents.data.menus[viewId] ? viewId.toString() : window.config.bi_views[0] && window.config.bi_views[0].id;
            this.actions.resetViewArrayNo(viewId);
            if (this.data.currentViewId) {
                this.data.headerComponents.data.menus[this.data.currentViewId].actions.focus();
                if(this.data.firstCanvas === true){
                    this.data.cells = new CanvasCellsComponent(this.data.currentViewId);
                    this.data.cells.render(this.el.find('.cells-container'));
                    this.data.firstCanvas = false;
                }else {
                    //后续鼠标点击使用轮播动画切换视图,并重置timer
                    this.data.cells.actions.doCarouselAnimate(this.data.currentViewId);
                    window.clearTimeout(this.data.timer);
                    this.actions.checkCanCarousel();
                }
            }
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
                    if (Array.isArray(this.data.views) && this.data.views.length > 0) {
                        const res = await this.data.cells.actions.cellsDataIsFinish();
                    }
                    if (self.frameElement && self.frameElement.tagName == "IFRAME" && !this.data.singleMode) {
                        $('.bi-container').css({'width': 'auto', 'height': 'auto'});
                    }
                    window.print();
                    msgbox.hideLoadingRoot();
                    if (self.frameElement && self.frameElement.tagName == "IFRAME" && !this.data.singleMode) {
                        let w = $(self.frameElement).closest('.iframes').width();
                        let h = $(self.frameElement).closest('.iframes').height();
                        $('.bi-container').css({'width': w, 'height': h});
                    }
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
        },

        /**
         * 检测是否符合执行轮播条件
         */
        checkCanCarousel(){
            if(this.data.carouselInterval > 0 && this.data.operateInterval > 0 && window.config.bi_user === 'client'){
                let temp = this.data.viewNo + 1;
                if(temp === this.data.viewArr.length){
                    this.data.viewNo = 0;
                }else{
                    this.data.viewNo = temp;
                }
                this.data.currentViewId = this.data.viewArr[this.data.viewNo].id;
                this.actions.delayCarousel(this.data.currentViewId);
            }
        },
        /**
         * 轮播执行入口，调用1次，执行1次轮播
         */
        delayCarousel:function (id) {
            let that = this;
            //鼠标点击标签后，需要重置timer
            this.data.tiemr = window.setTimeout(function () {
                that.data.headerComponents.data.menus[id].actions.focus();
                that.data.cells.actions.doCarouselAnimate(id);
            },this.data.carouselInterval * 1000)
        },
        resetViewArrayNo(id){
            console.log(this.data.viewArr);
            for ( let item of this.data.viewArr){
                console.log(index,item);



            }
        }
    },
    afterRender:function(){
        if (self.frameElement && self.frameElement.tagName == "IFRAME" && !this.data.singleMode) {
            let w = $(self.frameElement).closest('.iframes').width();
            let h = $(self.frameElement).closest('.iframes').height();
            $('.bi-container').css({'width': w, 'height': h});
        }

        //根据判断是否单行模式加载header
        this.actions.headLoad();

        //判断是否执行轮播
        this.actions.checkCanCarousel();
    },
    beforeDestory:function () {}
};

export class CanvasMain extends Component {
    constructor(data, events,extendConfig) {
        config.data.isViewEmpty = window.config.bi_views[0] ? false : true;
        super($.extend(true,{},config,extendConfig), data, events);
    }
}


