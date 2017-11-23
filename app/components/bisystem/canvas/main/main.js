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
        carouselInterval:5,
        operateInterval:3,
        viewArr:window.config.bi_views,  //所有bi视图
        viewNo:1,   //记录当前视图在数组中的位置
        // firstViews:true,   //第一次直接加载cells，后续通过轮播动画更换
        animateTime:1000,  //动画执行时间长度（ms）
        carouselFlag:false,  //轮播执行状态下为true
        isNewWindow:false,    //判断是否是在新窗口打开
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
        // {
        //     event:'keydown',
        //     selector:'.cells-container',
        //     callback:function (context, event) {
        //         // this.actions.listenExistCoursel();
        //         console.log(event);
        //     }
        // }
    ],
    actions: {
        /**
         * 通过鼠标点击执行视图切换
         * @param viewId
         */
        switchViewId: function (viewId) {
            let that = this;
            // 如果router没有传viewId 则默认用bi_views第一个
            this.data.currentViewId = viewId && this.data.headerComponents.data.menus[viewId] ? viewId.toString() : window.config.bi_views[0] && window.config.bi_views[0].id;
            // this.actions.resetViewArrayNo(viewId);
            if (this.data.currentViewId) {
                this.data.headerComponents.data.menus[this.data.currentViewId].actions.focus();
                // if(this.data.firstViews === true){
                    this.data.cells = new CanvasCellsComponent(this.data.currentViewId);
                    this.data.cells.render(this.el.find('.cells-container'));
                    this.data.cells.data.secondViewId = this.data.viewArr[1].id;

                    // this.data.firstViews = false;
                    // //判断是否执行轮播
                    // this.actions.checkCanCarousel();
                // }else {
                    //后续鼠标点击使用轮播动画切换视图,并重置timer
                    // window.clearTimeout(this.data.timer);
                    // this.data.cells.actions.doCarouselAnimate(this.data.currentViewId);
                    // setTimeout(function () {
                    //     that.actions.checkCanCarousel();
                    // },this.data.animateTime)
                }
            // }
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
                },
                doFullScreenCarousel:() => {
                    this.data.carouselFlag = true;
                    this.actions.checkCanCarousel(this.data.carouselInterval);
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
        checkCanCarousel(time){
            if(this.data.carouselInterval > 0 && this.data.operateInterval > 0 && window.config.bi_user === 'client' && this.data.carouselFlag === true){
                console.log(this.data.isNewWindow);
                if(this.data.isNewWindow){
                    this.actions.launchFullScreen(document.documentElement);
                }
                this.el.find('.views-header').hide();
                this.actions.startListenUserOperate();
                this.actions.delayCarousel(time);
            }
        },
        /**
         * 按指定时间间隔插入下一次轮播动画任务
         * @param time
         */
        delayCarousel:function (time) {
            let interval = time;      //防止用户操作停止后等待两项时间间隔总和
            let that = this;
            //退出轮播模式后，立即清除timer
            this.data.timer = window.setTimeout(function () {
                let temp = Number(that.data.viewNo) + 1;
                if(temp === that.data.viewArr.length){
                    that.data.viewNo = 0;
                }else{
                    that.data.viewNo = temp;
                }
                that.data.currentViewId = that.data.viewArr[that.data.viewNo].id;
                that.data.cells.data.currentViewId = that.data.currentViewId;
                that.data.headerComponents.data.menus[that.data.currentViewId].actions.focus();
                that.data.cells.actions.doCarouselAnimate();

                setTimeout(function () {
                    that.actions.checkCanCarousel(that.data.carouselInterval);
                },that.data.animateTime)
            },interval * 1000)
        },
        /**
         * 鼠标点击切换视图后，重置viewNo，保证下次轮播顺序正确
         * @param id
         */
        resetViewArrayNo(id){
            for ( let k in this.data.viewArr){
                console.log(k,this.data.viewArr[k]['id'],id);
                if(this.data.viewArr[k]['id'] == id){
                   this.data.viewNo = k;
                }
            }
        },
        /**
         * 用户操作后，重置轮播
         */
        resetCarousel:function () {
            let that = this;
            window.clearTimeout(this.data.timer);
            window.clearTimeout(this.data.timer2);
            // let time = this.data.carouselInterval > this.data.operateInterval ? this.data.carouselInterval - this.data.operateInterval : 0;
            let time = 0;
            this.data.timer2 = window.setTimeout(function () {
                that.actions.checkCanCarousel(time);
            },that.data.operateInterval * 1000)
        },
        /**
         * 判断各种浏览器，进入全屏模式
         * @param element
         */
        launchFullScreen(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        /**
         * 退出全屏模式
         */
        exitFullScreen() {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },
        /**
         * 监听退出轮播模式
         */
        listenExistCarousel(){
            let Doc = $(document)[0];
            let isFullScreen = Doc.IsFullScreen || Doc.webkitIsFullScreen || Doc.mozIsFullScreen;
            if((this.data.isNewWindow === true && !isFullScreen) || this.data.isNewWindow === false){
                this.data.carouselFlag = false;
                window.clearTimeout(this.data.timer);
                this.actions.stopListenUserOperate();
                this.el.find('.views-header').show();
            }
        },
        /**
         * 轮播模式下，监听用户操作
         */
        startListenUserOperate(){
            let that = this;
            this.el.on('mousemove',function () {
                that.actions.resetCarousel();
            }).on('click','.cells-container',function () {
                that.actions.resetCarousel();
            }).on('mousewheel',function () {
                that.actions.resetCarousel();
            });
        },
        /**
         * 非全屏模式下，停止监听用户操作
         */
        stopListenUserOperate(){
            this.el.off('mousemove');
            this.el.off('click','.cells-container');
            this.el.off('mousewheel');
        }

    },
    afterRender:function(){
        let that = this;
        if (self.frameElement && self.frameElement.tagName == "IFRAME" && !this.data.singleMode) {
            let w = $(self.frameElement).closest('.iframes').width();
            let h = $(self.frameElement).closest('.iframes').height();
            $('.bi-container').css({'width': w, 'height': h});
        }

        //根据判断是否单行模式加载header
        this.actions.headLoad();

        if(window.hasOwnProperty("parent") && window.parent === window){
            //监听浏览器大小变化，判断是否停止轮播
            $(window).resize(function () {
                that.actions.listenExistCarousel();
            });
            this.data.isNewWindow = true;
        }else{
            //监听ESC，退出轮播模式
            $(window).on('keydown',function (event) {
                if(event.keyCode.toString() === '27'){
                    that.actions.listenExistCarousel();
                }
            })
        }
    },
    beforeDestory:function () {}
};

export class CanvasMain extends Component {
    constructor(data, events,extendConfig) {
        config.data.isViewEmpty = window.config.bi_views[0] ? false : true;
        super($.extend(true,{},config,extendConfig), data, events);
    }
}


