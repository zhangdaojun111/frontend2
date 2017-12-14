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
import {ViewsService} from '../../../../services/bisystem/views.service';


let config = {
    template: template,
    data: {
        views: window.config.bi_views,
        currentViewId: '',
        nextViewId: '',
        headerComponents: {},
        editMode: window.config.bi_user === 'manager' ? window.config.bi_user : false,
        singleMode: window.location.href.indexOf('single') !== -1,
        isViewEmpty: false,
        isSingle:false,
        PMENUM:{
            open_iframe_dialog: '0',
            close_dialog: '1',
            recieve_data: '2',
            open_component_dialog: '3',
            iframe_active: '4',
            iframe_silent: '5',
            table_invalid: '6',              // 表格数据失效
            one_the_way_invalid: '7',         // 在途数据失效
            data_invalid: '11',
            open_iframe_params: '8',
            get_param_from_root: '9',        // 来自子框架的消息，需要获取iframe的参数
            send_param_to_iframe: '10',       // 来组主框架的消息，向iframe发送参数
            workflow_approve_msg: '11',
            show_tips: '12',
            send_data_to_dialog_component: '13', //向子componentDialog发消息，需和openDialogByComponentWithKey结合使用，便于获得dialog的key
            send_data_to_iframe:'14',
            get_data:'15',
            show_loading:'16',          //打开loading
            hide_loading:'17',          //隐藏loading
            open_preview:'18',          //打开图片浏览
            aside_fold: '19',
            send_event:'20',
            open_iframe_by_id:'21',     //bi点击title打开数据源tab
        },
        carouselInterval: 0,         //用户设置的轮播执行间隔
        operateInterval: 0,          //用户设置的操作暂停轮播间隔
        viewArr: window.config.bi_views,  //所有bi视图
        nextViewNo: 1,   //记录当前视图在数组中的位置
        animateTime: 1000,  //动画执行时间长度（ms）
        carouselFlag: false,  //轮播执行状态下为true
        isNewWindow: false,    //判断是否是在新窗口打开
        mode:window.config.bi_user,
        firstCarousel:true,
    },
    binds: [
        // 编辑模式
        {
            event: 'click',
            selector: '.to-edit-page',
            callback: function (context, event) {

                let iFrameUrl = window.location.href.replace('index', 'manager');

                PMAPI.openDialogByIframe(
                    iFrameUrl,
                    {
                        title: '编辑模式',
                        modal: true,
                        customSize: true,
                        maxable: true,
                        defaultMax: false,
                    }).then((data) => {
                        location.reload();
                    }
                );
                return false;
            }
        },
        //下载pdf
        {
            event: 'click',
            selector: '.to-download-pdf',
            callback: function (context, event) {
                this.actions.downloadPDF();
            }
        }
    ],
    actions: {
        /**
         * 通过鼠标点击执行视图切换
         * @param viewId
         */
        switchViewId: function (viewId) {
            // 如果router没有传viewId 则默认用bi_views第一个
            this.data.currentViewId = viewId && this.data.headerComponents.data.menus[viewId] ? viewId.toString() : window.config.bi_views[0] && window.config.bi_views[0].id;
            if (this.data.currentViewId) {
                this.data.headerComponents.data.menus[this.data.currentViewId].actions.focus();
                this.data.cells = new CanvasCellsComponent({
                    data:{
                        currentViewId:this.data.currentViewId
                    }
                });
                this.data.cells.actions.loadChartFinish = this.actions.loadChartFinish;
                this.data.cells.render(this.el.find('.cells-container'));
            }
            //客户模式下设置轮播视图序号
            if(this.data.mode === 'client' && this.data.views.length >= 2 ){
                this.actions.resetViewArrayNo(viewId);
            }
        },

        /**
         * 加载头部
         */
        headLoad: function () {
            // if (!this.data.singleMode) {
            //
            // }
            let header = new CanvasHeaderComponent({
                data:{},
                events: {
                    selectAllCanvas: () => {
                        this.data.cells.actions.selectAllCells();
                    },
                    cancelSelectCanvas: () => {
                        this.data.cells.actions.cancelSelectCells();
                    },
                    reverseSelectCanvas: () => {
                        this.data.cells.actions.reverseSelectCells();
                    },
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
                    doFullScreenCarousel: async () => {
                        if (this.data.isNewWindow) {
                            this.actions.launchFullScreen(document.documentElement);
                        } else {
                            msgbox.showTips('按ESC退出轮播模式');
                        }
                        if (this.data.firstCarousel) {
                            this.data.cells.actions.loadSecondView();
                            this.data.firstCarousel = false;
                        }
                        let res = await this.actions.getCarouselSetting();
                        this.data.carouselInterval = res.data.carousel_time;
                        this.data.operateInterval = res.data.stop_time;
                        this.data.carouselFlag = true;
                        this.actions.checkCanCarousel(this.data.carouselInterval);
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
         * 参数解析函数
         * @param key
         * @returns {null}
         */
        getUrlParam(key) {
            let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
            let r = window.location.search.substr(1).match(reg);
            if (r !== null) {
                return r[2];
            }
            return null
        },
        /**
         * 通过url判断单页模式以及pdf页面
         */
        checkUrl() {
            this.data.isSingle = (this.actions.getUrlParam('single') === 'true') || false;
            this.data.isPdf = window.config.pdf === true;
            if (this.data.isPdf) {
                this.data.pdfViewId = this.actions.getUrlParam('view_id');
            }
            if (this.data.isSingle || this.data.isPdf) {
                this.el.find('.views-header').hide();
                this.el.find('.cells-container').addClass('hide-head');
            }
        },

        /**
         * 检测是否符合执行轮播条件
         */
        checkCanCarousel(time) {
            if (this.data.carouselInterval > 0 && this.data.operateInterval > 0  && this.data.carouselFlag === true && this.data.mode === 'client') {
                this.el.find('.views-header').hide();
                this.actions.startListenUserOperate();
                this.actions.delayCarousel(time);
            }
        },
        /**
         * 按指定时间间隔插入下一次轮播动画任务
         * @param time
         */
        delayCarousel: function (time) {
            let interval = time;      //防止用户操作停止后等待两项时间间隔总和
            let that = this;
            //退出轮播模式后，立即清除timer
            this.data.timer = window.setTimeout(function () {
                that.data.currentViewId = that.data.nextViewId;
                let temp = Number(that.data.nextViewNo) + 1;
                if (temp === that.data.viewArr.length) {
                    that.data.nextViewNo = 0;
                } else {
                    that.data.nextViewNo = temp;
                }

                that.data.nextViewId = that.data.viewArr[that.data.nextViewNo].id;
                that.data.cells.data.currentViewId = that.data.nextViewId;
                that.data.headerComponents.data.menus[that.data.currentViewId].actions.focus();
                that.data.cells.actions.doCarouselAnimate();

                setTimeout(function () {
                    that.actions.checkCanCarousel(that.data.carouselInterval);
                }, that.data.animateTime)
            }, interval * 1000)
        },
        /**
         * 鼠标点击切换视图后，重置nextViewNo，保证下次轮播顺序正确
         * @param id
         */
        resetViewArrayNo(id) {
            for (let k in this.data.viewArr) {
                if (this.data.viewArr[k]['id'] == id) {
                    this.data.nextViewNo = k;
                }
            }
            let no = Number(this.data.nextViewNo) + 1;
            if (this.data.viewArr.length === no) {
                no = 0;
            }
            this.data.cells.data.secondViewId = this.data.viewArr[no].id;
            this.data.nextViewNo = no;
            this.data.nextViewId = this.data.viewArr[no].id;
        },
        /**
         * 用户操作后，重置轮播
         */
        resetCarousel: function () {
            let that = this;
            window.clearTimeout(this.data.timer);
            window.clearTimeout(this.data.timer2);
            let time = 0;
            this.data.timer2 = window.setTimeout(function () {
                that.actions.checkCanCarousel(time);
            }, that.data.operateInterval * 1000)
        },
        /**
         * 判断各种浏览器，进入全屏模式
         * @param element
         */
        launchFullScreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        /**
         * 退出全屏模式
         */
        exitFullScreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },
        /**
         * 监听退出轮播模式
         */
        listenExistCarousel() {
            let Doc = $(document)[0];
            let isFullScreen = Doc.IsFullScreen || Doc.webkitIsFullScreen || Doc.mozIsFullScreen;
            if ((this.data.isNewWindow === true && !isFullScreen) || this.data.isNewWindow === false) {
                this.data.carouselFlag = false;
                window.clearTimeout(this.data.timer);
                this.actions.stopListenUserOperate();
                this.el.find('.views-header').show();
            }
        },
        /**
         * 轮播模式下，监听用户操作
         */
        startListenUserOperate() {
            let that = this;
            this.el.on('mousemove', function () {
                that.actions.resetCarousel();
            }).on('click', '.cells-container', function () {
                that.actions.resetCarousel();
            }).on('mousewheel', function () {
                that.actions.resetCarousel();
            });
        },
        /**
         * 非全屏模式下，停止监听用户操作
         */
        stopListenUserOperate() {
            this.el.off('mousemove');
            this.el.off('click', '.cells-container');
            this.el.off('mousewheel');
        },
        /**
         * 获取轮播设置时间
         * @returns {*}
         */
        getCarouselSetting: function () {
            return ViewsService.getCarouselSetting();
        },
        /**
         * 最后一个cell加载完后执行的回调,将滚动条设置到body上
         */
        loadChartFinish(){
            $('body').css('overflow','auto');
            this.el.find('.cells-container').css('overflow','visible');
        },
        /**
         * 点击下载pdf
         */
        downloadPDF(){
            //计算实际内容高度
            let width = 0;
            let height = -300;
            // let height = this.el.find('.cells-container')[0].scrollHeight;

            //逐个计算画布块高度
            this.el.find('.current').find('.cell').each(function () {
                height = height + $(this).height() + 20;
            });
            //计算内容高度
            this.el.find('.bi-table').each(function () {
                height = height - $(this).height() + $(this)[0].scrollHeight;
            });
            this.el.find('.comment').each(function () {
                height = height - $(this).height() + $(this)[0].scrollHeight;
            });

            //计算最大宽度
            this.el.find('.cell').each(function () {
                width = Math.max(width,$(this)[0].scrollWidth);
            });

            let heightIn = Math.max((Number(height)/105).toFixed(2),11.7);
            let widthIn = Math.min(Math.max((Number(width)/105).toFixed(2),8.27),18);

            let origin = window.location.origin;
            let parent_table_id = window.config.parent_table_id || '';
            let row_id = window.config.row_id || '';
            let query_mark = window.config.query_mark || '';
            let operation_id = window.config.operation_id || '';
            let folder_id = window.config.folder_id || '';

            let url = origin + `/bi/download_pdf/?view_id=${this.data.currentViewId}&page_width=${widthIn}in&page_height=${heightIn}in&parent_table_id=${parent_table_id}&row_id=${row_id}&query_mark=${query_mark}&operation_id=${operation_id}&folder_id=${folder_id}`;

            window.open(url);
        }
    },
    afterRender:function(){
        let that = this;
        if (self.frameElement && self.frameElement.tagName == "IFRAME" && !this.data.singleMode) {
            let w = $(self.frameElement).closest('.iframes').width();
            let h = $(self.frameElement).closest('.iframes').height();
            $('.bi-container').css({'width': w, 'height': h});
        }

        //订阅数据失效
        PMAPI.subscribe(this.data.PMENUM.data_invalid, (info) => {
            alert('message服务更新了');
            this.data.cells.actions.updateCells(info);
        });

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
        this.actions.checkUrl();
    },
    beforeDestory:function () {}
};

export let CanvasMain = Component.extend(config);

// export class CanvasMain extends Component {
//     constructor(data, events,extendConfig) {
//         config.data.isViewEmpty = window.config.bi_views[0] ? false : true;
//         super($.extend(true,{},config,extendConfig), data, events);
//     }
// }


