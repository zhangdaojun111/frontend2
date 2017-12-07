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
        headerComponents: {},
        editMode: window.config.bi_user === 'manager' ? window.config.bi_user : false,
        singleMode: window.location.href.indexOf('single') !== -1,
        isViewEmpty: false,
        isSingle:false,
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
                        maxable:true,
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
         * 加载canvas
         * @param viewId
         */
        switchViewId: function (viewId) {
            // 如果router没有传viewId 则默认用bi_views第一个
            this.data.currentViewId = viewId && this.data.headerComponents.data.menus[viewId] ? viewId.toString() : window.config.bi_views[0] && window.config.bi_views[0].id;
            if (this.data.currentViewId) {
                this.data.headerComponents.data.menus[this.data.currentViewId].actions.focus();
                this.data.cells = new CanvasCellsComponent(this.data.currentViewId);
                this.data.cells.actions.loadChartFinish = this.actions.loadChartFinish;
                this.data.cells.render(this.el.find('.cells-container'));
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
                selectAllCanvas:()=>{
                    this.data.cells.actions.selectAllCells();
                },
                cancelSelectCanvas:()=>{
                    this.data.cells.actions.cancelSelectCells();
                },
                reverseSelectCanvas:()=>{
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
        getUrlParam(key){
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
        checkUrl(){
            this.data.isSingle = (this.actions.getUrlParam('single') === 'true') || false;
            this.data.isPdf = window.config.pdf === true;
            if(this.data.isPdf){
                this.data.pdfViewId = this.actions.getUrlParam('view_id');
            }
            if(this.data.isSingle || this.data.isPdf ){
                this.el.find('.views-header').hide();
                this.el.find('.cells-container').addClass('hide-head');
            }
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
            let widthIn = 8.27;
            //计算实际内容高度
            let height = this.el.find('.cells-container')[0].scrollHeight;
            this.el.find('.bi-table').each(function () {
                height = height - $(this).height() + $(this)[0].scrollHeight;
            });
            this.el.find('.comment').each(function () {
                height = height - $(this).height() + $(this)[0].scrollHeight;
            });
            console.log('height',height);
            let heightIn = Math.max((Number(height)/105).toFixed(2),11.7);
            console.log('heightIn',heightIn);
            let origin = window.location.origin;
            let parent_table_id = window.config.parent_table_id || '';
            let row_id = window.config.row_id || '';
            let query_mark = window.config.query_mark || '';
            let operation_id = window.config.operation_id || '';
            let folder_id = window.config.folder_id || '';

            let url = origin + `/bi/download_pdf/?view_id=${this.data.currentViewId}&page_width=${widthIn}in&page_height=${heightIn}in&parent_table_id=${parent_table_id}&row_id=${row_id}&query_mark=${query_mark}&operation_id=${operation_id}&folder_id=${folder_id}`;
            console.log(url);
            window.open(url);
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
        this.actions.checkUrl();
    },
    beforeDestory:function () {}
};

export class CanvasMain extends Component {
    constructor(data, events,extendConfig) {
        config.data.isViewEmpty = window.config.bi_views[0] ? false : true;
        super($.extend(true,{},config,extendConfig), data, events);
    }
}


