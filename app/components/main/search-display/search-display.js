/**
 * @author zhaoyan
 * 全局搜索结果展示界面
 */
import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './search-display.scss';
import template from './search-display.html';
import Mediator from '../../../lib/mediator';
import {SingleDisplay} from './single-display/single-display'
import {FileDisplay} from './file-display/file-display'
import {GlobalService} from "../../../services/main/globalService"
import dataPagination from "../../../components/dataGrid/data-table-toolbar/data-pagination/data-pagination";
import msgbox from "../../../lib/msgbox";
// import msgbox from "../../../lib/msgbox";

let ResearchResult = Component.extend({
    template:template,
    data:{
        searchText:'',
        dataCount:"",
        attachmentCount:"",
    },
    actions:{
        /**
         * 根据每个data创建数据展示组件，一页最多展示20个数据
         * @param data
         */
        displayDataResult:function (data) {
            let $fatherContainer = this.el.find("div.data-result-content");
            $fatherContainer.empty();
            let tempData = data.result;
            for( let d of tempData){
                SingleDisplay.create(d,$fatherContainer);
            }
        },
        /**
         * 根据每个data创建附件展示组件，一页最多展示15个附件
         * @param data
         */
        displayAttachmentResult:function (data) {
            let $fatherContainer = this.el.find("div.attachment-result-content");
            $fatherContainer.empty();
            let tempData = data.result;
            for( let d of tempData){
                FileDisplay.create(d,$fatherContainer);
            }
        },
        /**
         * 切换到数据展示界面
         */
        showDataPage:function () {
            if(this.data.dataCount.toString() !== "0"){             //data搜索结果不为0条，显示data页面
                this.el.find('div.data-result-display').show();
                this.el.find('div.attachment-result-display').hide();
                this.el.find('div.result-nothing-display').hide();
            }else{                                                   //data搜索结果为0条，显示nothing页面
                let str = '"' + this.data.searchText + '"';
                this.el.find('.nothing-name').html(str);
                this.el.find('div.attachment-result-display').hide();
                this.el.find('div.result-nothing-display').show();
            }
            this.el.find('.data-btn').addClass('btn-active');
            this.el.find('.attachment-btn').removeClass('btn-active');
        },
        /**
         * 切换到附件展示界面
         */
        showAttachmentPage:function () {
            if(this.data.attachmentCount.toString() !== "0"){           //附件搜索结果不为0条，显示data页面
                this.el.find('div.data-result-display').hide();
                this.el.find('div.attachment-result-display').show();
                this.el.find('div.result-nothing-display').hide();
            }else{
                let str = '"' + this.data.searchText + '"';             //附件搜索结果为0条，显示nothing页面
                this.el.find('.nothing-name').html(str);
                this.el.find('div.data-result-display').hide();
                this.el.find('div.result-nothing-display').show();
            }
            this.el.find('.data-btn').removeClass('btn-active');
            this.el.find('.attachment-btn').addClass('btn-active');
        },
        /**
         * 根据url的参数设置搜索内容
         */
        setSearchContent:function () {
            let url = location.search;
            let mark = url.indexOf('=');
            mark += 1;
            this.data.searchText =  decodeURI(url.substr(mark));
            this.actions.sendSearch();
        },
        /**
         * 创建两个分页组件分别管理data和附件的分页
         */
        initPageController:function () {
            //初始化data页面分页控制
            this.data.dataPageController = this.actions._initController(20,'data',this.data.dataCount,this.actions.dataPageChanged);
            //初始化attachment页面分页控制
            this.data.attachmentPageController = this.actions._initController(15,'attachment',this.data.attachmentCount,this.actions.attachmentPageChanged);
        },
        _initController:function (rowCount,selector,dataCount,pageChanged) {
            let controller = new dataPagination({
                data:{
                    currentPage:1,
                    rows:rowCount,
                }
            });
            let $parent = this.el.find(`.${selector}-page-control`);
            controller.render($parent);
            let str = '"' + this.data.searchText + '"';
            this.el.find(`.${selector}-num`).html(dataCount);
            this.el.find(`.${selector}-name`).html(str);
            controller.actions.paginationChanged = pageChanged;
            return controller;
        },
        /**
         * 数据页面的页码改变，按页码进行搜索并更新显示内容
         * @param data
         */
        dataPageChanged:function (data) {
            this.showLoading();
            //data页面改变分页，根据页面请求新数据，并刷新页面内容
            let searchData = {
                keyword:this.data.searchText,            //搜索文字
                rows:20 ,                               //每页显示的个数
                page:data.currentPage,                  //页面分页的页数
            };

            //发起搜索请求，仅查询数据
            this.actions._sendSearch(searchData,this.data.dataCount,this.data.dataPageController,'data',data.currentPage);
        },
        /**
         * 附件页面的页码改变，按页码进行搜索并更新显示内容
         * @param data
         */
        attachmentPageChanged:function (data) {
            this.showLoading();
            let searchData = {
                keyword:this.data.searchText,            //搜索文字
                rows:15 ,                               //每页显示的个数
                page:data.currentPage,                  //页面分页的页数
                in_attachment:1,
            };

            /**
             * 发起搜索请求，仅搜索附件
             * @type {config}
             */
            this.actions._sendSearch(searchData,this.data.attachmentCount,this.data.attachmentPageController,'attachment',data.currentPage);
        },
        _sendSearch:function (searchData,dataCount,controller,selector,page) {
            GlobalService.sendSearch(searchData).done((result) => {
                if (result.success === 1) {
                    let tempData = result;                           //开全局搜索接口后使用
                    // let tempData = this.data.test_attachment_result;    //测试使用
                    dataCount = tempData.total;
                    let str2 = '"' + this.data.searchText + '"';
                    this.el.find(`.${selector}-num`).html(dataCount);
                    this.el.find(`.${selector}-name`).html(str2);
                    this.actions.displayAttachmentResult(tempData);
                    controller.actions.setPagination(tempData.total, page);
                    this.hideLoading();
                } else {
                    console.log("查询失败");
                    that.hideLoading();
                }
            }).fail((err) => {
                console.log("查询失败",err);
                that.hideLoading();
            });
        },
        /**
         * 向后台请求第一轮搜索，数据和附件均搜索
         */
        sendSearch:function () {
            this.showLoading();

            // msgbox.showLoadingSelf();
            // setTimeout(function () {
            //     msgbox.hideLoadingSelf();
            // },5000);
            //
            // setTimeout(function () {
            //     msgbox.showLoadingSelf();
            //     msgbox.showLoadingSelf();
            //     msgbox.showLoadingSelf();
            // },7000);
            //
            // setTimeout(function () {
            //     msgbox.hideLoadingSelf()
            //     msgbox.hideLoadingSelf()
            //     msgbox.hideLoadingSelf()
            //     msgbox.hideLoadingSelf()
            //     msgbox.hideLoadingSelf()
            //     msgbox.hideLoadingSelf()
            // },12000);

            let searchData = {
                keyword:this.data.searchText,            //搜索文字
                rows:20 ,                               //每页显示的个数
                page:1,                               //页面分页的页数
            };
            let that = this;
            //发起第一次搜索请求，查询数据
            GlobalService.sendSearch(searchData).done((result) => {
                if(result.success === 1){
                    let tempData = result;       //开全局搜索接口后使用
                    // let tempData = this.data.test_data_result;      //测试使用
                    that.data.dataCount = tempData.total;
                    let str = '"' + this.data.searchText + '"';
                    // 搜索结果为0条则显示无结果背景
                    if(this.data.dataCount.toString() === "0"){
                        that.el.find('.data-result-display').hide();
                        that.el.find('.result-nothing-display').show();
                        that.el.find('.nothing-name').html(str);
                    }else{
                        that.el.find('.data-num').html(this.data.dataCount);
                        that.el.find('.data-name').html(str);
                        that.actions.displayDataResult(tempData);
                        that.data.dataPageController.actions.setPagination(tempData.total,1);
                    }
                }else{
                    console.log("查询失败",result);
                }
            }).fail((err) => {
                console.log("查询失败",err);
            });

            searchData.in_attachment = 1 ;
            searchData.rows = 15;

            //发起第二次搜索请求，搜索附件

            this.actions._sendSearch(searchData,this.data.attachmentCount,this.data.attachmentPageController,'attachment',1);
        }
    },
    binds:[
        {
            event:'click',
            selector:'.data-btn',
            callback:function () {
                this.actions.showDataPage();
            }
        },
        {
            event:'click',
            selector:'.attachment-btn',
            callback:function () {
                this.actions.showAttachmentPage();
            }
        }
    ],
    afterRender:function () {
        this.actions.initPageController();
        this.actions.setSearchContent();
    },
    beforeDestroy:function () {
        Mediator.removeAll();
    }
});

export {ResearchResult}