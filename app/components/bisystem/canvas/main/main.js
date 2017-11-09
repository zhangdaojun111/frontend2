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
        carousel : false,
    },
    binds: [
        // 编辑模式
        {
            event: 'click',
            selector: '.to-edit-page',
            callback: function (context, event) {
                //编辑模式Iframe
                let iFrameUrl = '';
                if(this.data.isViewEmpty === true){
                    iFrameUrl = window.location.href.replace('index/', 'manager/#views/edit');
                }else{
                    iFrameUrl = window.location.href.replace('index', 'manager');
                }
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
        // { //鼠标移入
        //     event: 'mouseover',
        //     selector: '.cells-container',
        //     callback: function (context, event) {
        //         if(!this.data.editMode){
        //             clearTimeout(this.data.run);
        //             this.data.timer = setInterval(()=> {
        //                 console.log(this.data.imouse);
        //                 if(this.data.imouse == 0){
        //                     this.actions.setCarousel(parseInt(3000));
        //                     clearInterval(this.data.timer);
        //                 }
        //                 this.data.imouse = 0;
        //             },3000);
        //         }
        //     }
        // },
        // { //鼠标移动
        //     event: 'mousemove',
        //     selector: '.cells-container',
        //     callback: function (context, event) {
        //         this.data.imouse = 1;
        //     }
        // },
        // { //鼠标移出
        //     event: 'mouseout',
        //     selector: '.cells-container',
        //     callback: function (context, event) {
        //         clearInterval(this.data.timer);
        //         this.actions.setCarousel(parseInt(3000));
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
        },

        /**
         * 设置循环
         * @param date 轮播时间
         */
        // setCarousel(date){
            // let carousel = this.el.find('.nav-tabs-false a'),carouselArr = [],ind = 0;
            // carousel.each((index,val)=>{
            //     carouselArr.push($(val)[0]['href']);
            //     if($(val)[0]['href'] == window.location.href){
            //         ind = index;
            //     }
            // });
            // let carouselArrLeft  = carouselArr.slice(0,ind),carouselArrRight = carouselArr.slice(ind),carouselArrNew = [...carouselArrRight,...carouselArrLeft];
            // let i   = 0,len = carouselArrNew.length;
            // let self = this;
            // (function setAgain() {
            //     clearTimeout(self.data.run);
            //     self.data.run = setTimeout(function () {
            //         window.location = carouselArrNew[i++];
            //         if(i === len){i = 0;}
            //         i<len&&setAgain();
            //     },date)
            // }());
        // }
    },

    afterRender:function(){
        if (self.frameElement && self.frameElement.tagName == "IFRAME") {
            let w = $(self.frameElement).closest('.iframes').width();
            let h = $(self.frameElement).closest('.iframes').height();
            $('html.bi').css({'width':w,'height':h});
        }
        //根据判断是否单行模式加载header
        this.actions.headLoad();

        //设置轮播 用户模式下默认执行
        // if(!this.data.editMode){
        //     this.actions.setCarousel(parseInt(3000));
        // }

    },
    beforeDestory:function () {}
};

export class CanvasMain extends Component {
    constructor(data, events,extendConfig) {
        config.data.isViewEmpty = window.config.bi_views[0] ? false : true;
        super($.extend(true,{},config,extendConfig), data, events);
    }
}


