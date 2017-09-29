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
// import msgbox from "../../../lib/msgbox";

let config = {
    template:template,
    data:{
        // test_data_result:{"total": 0, "result": [{"ts_name": "", "count": 0, "name_py": "grrb", "row_num": 3515, "table_id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "folder_id": 252, "company_name": "rzrk", "namespace": "standard", "id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "label": "\u4e2a\u4eba\u65e5\u62a5"}, {"ts_name": "", "count": 0, "name_py": "SAPqx", "row_num": 2164, "table_id": "5613_CHEUbzmZMsjDFT3AiwPB46", "folder_id": 100, "company_name": "rzrk", "namespace": "standard", "id": "5613_CHEUbzmZMsjDFT3AiwPB46", "label": "SAP\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xsBuggl", "row_num": 250, "table_id": "9233_m6GFUdno6HBvXzXsEiB2cn", "folder_id": 90, "company_name": "rzrk", "namespace": "standard", "id": "9233_m6GFUdno6HBvXzXsEiB2cn", "label": "\u7ebf\u4e0aBug\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "xtgzqsxtqx", "row_num": 231, "table_id": "7962_xCgeDKXmMXYHvzGBDajHAP", "folder_id": 99, "company_name": "rzrk", "namespace": "standard", "id": "7962_xCgeDKXmMXYHvzGBDajHAP", "label": "\u8fc5\u6295\u4f30\u503c\u6e05\u7b97\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xmjhmx", "row_num": 184, "table_id": "771_uNRGnuYfkrjAfE4eH7cpzD", "folder_id": 89, "company_name": "rzrk", "namespace": "standard", "id": "771_uNRGnuYfkrjAfE4eH7cpzD", "label": "\u9879\u76ee\u8ba1\u5212\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xttzjyxtqx", "row_num": 176, "table_id": "3790_NwsLTLfYZrgYvkyfnw2otN", "folder_id": 96, "company_name": "rzrk", "namespace": "standard", "id": "3790_NwsLTLfYZrgYvkyfnw2otN", "label": "\u8fc5\u6295\u6295\u8d44\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "bjkq", "row_num": 157, "table_id": "8924_YrawF4zecr4e9ZHgU6aNoS", "folder_id": 249, "company_name": "rzrk", "namespace": "standard", "id": "8924_YrawF4zecr4e9ZHgU6aNoS", "label": "\u5317\u4eac\u8003\u52e4"}, {"ts_name": "", "count": 0, "name_py": "xtjgjyxtqx", "row_num": 121, "table_id": "9844_LF7p29NigQvFE43fuTQMGP", "folder_id": 102, "company_name": "rzrk", "namespace": "standard", "id": "9844_LF7p29NigQvFE43fuTQMGP", "label": "\u8fc5\u6295\u673a\u6784\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xtmxptqx", "row_num": 97, "table_id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "folder_id": 98, "company_name": "rzrk", "namespace": "standard", "id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "label": "\u8fc5\u6295\u6a21\u578b\u5e73\u53f0\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xtzhglxtqx", "row_num": 22, "table_id": "9578_6fJrcK6tcj7Nv6oCovE7vF", "folder_id": 363, "company_name": "rzrk", "namespace": "standard", "id": "9578_6fJrcK6tcj7Nv6oCovE7vF", "label": "\u8fc5\u6295\u7efc\u5408\u7ba1\u7406\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "qxsqjlb", "row_num": 16, "table_id": "6771_gJL2KhEvCv8h67ZodMXVH2", "folder_id": 22, "company_name": "rzrk", "namespace": "standard", "id": "6771_gJL2KhEvCv8h67ZodMXVH2", "label": "\u6743\u9650\u7533\u8bf7\u8bb0\u5f55\u8868"}, {"ts_name": "", "count": 0, "name_py": "qjgl", "row_num": 16, "table_id": "8462_Zcer5GV7egyKF2TCGUfkn9", "folder_id": 17, "company_name": "rzrk", "namespace": "standard", "id": "8462_Zcer5GV7egyKF2TCGUfkn9", "label": "\u8bf7\u5047\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "nbxqqr", "row_num": 5, "table_id": "8303_nXzZ8MApkZGKKTgyipch6E", "folder_id": 91, "company_name": "rzrk", "namespace": "standard", "id": "8303_nXzZ8MApkZGKKTgyipch6E", "label": "\u5185\u90e8\u9700\u6c42\u786e\u8ba4"}, {"ts_name": "", "count": 0, "name_py": "dddcmx", "row_num": 4, "table_id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "folder_id": 325, "company_name": "rzrk", "namespace": "standard", "id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "label": "\u6ef4\u6ef4\u6253\u8f66\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xtgtxtqx", "row_num": 3, "table_id": "6228_iGVzG7supQSx485gXTfUKF", "folder_id": 103, "company_name": "rzrk", "namespace": "standard", "id": "6228_iGVzG7supQSx485gXTfUKF", "label": "\u8fc5\u6295\u67dc\u53f0\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "SAPbfjl", "row_num": 1, "table_id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "folder_id": 188, "company_name": "rzrk", "namespace": "standard", "id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "label": "SAP\u62dc\u8bbf\u8bb0\u5f55"}, {"ts_name": "", "count": 0, "name_py": "xmglb", "row_num": 1, "table_id": "3758_jFgQgnxh42Ugkbrrfb7Tfh", "folder_id": 88, "company_name": "rzrk", "namespace": "standard", "id": "3758_jFgQgnxh42Ugkbrrfb7Tfh", "label": "\u9879\u76ee\u7ba1\u7406\u8868"}, {"ts_name": "", "count": 0, "name_py": "grfyhzx", "row_num": 1, "table_id": "7528_aeEEGfSyKxQvpKDy58EPDA", "folder_id": 372, "company_name": "rzrk", "namespace": "standard", "id": "7528_aeEEGfSyKxQvpKDy58EPDA", "label": "\u4e2a\u4eba\u8d39\u7528\u6c47\u603b\u65b0"}, {"ts_name": "", "count": 0, "name_py": "fybxsqb", "row_num": 1, "table_id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "folder_id": 321, "company_name": "rzrk", "namespace": "standard", "id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "label": "\u8d39\u7528\u62a5\u9500\u7533\u8bf7\u8868"}], "success": 1, "error": ""},
        // test_attachment_result:{"total": 10, "result": [{"file_name": "\u4e2a\u4eba01_\u552e\u524d\u7ec6\u5219_20170815093943(\u5ba2\u6237) (1).mp4", "file_id": "59929b6dd8e9e425bf0b2b00", "content_type": "video/mp4", "id": "1182_P4BX5vGn3T2H6rb9b5RJW7", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u57fa\u672c\u4fe1\u606f\uff08\u4e2a\u4eba\uff09", "name_py": "tzzjbxx\uff08gr\uff09", "table_id": "1182_P4BX5vGn3T2H6rb9b5RJW7", "company_name": "rzrk", "folder_id": 31}, {"file_name": "超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题超级长的标题pushsaddsadsdk_20170816165000.docx", "file_id": "5995665ea6ddea692202875d", "content_type": "text/plain", "id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u5c5e\u6027\u8bc4\u6d4b\u6c47\u603b\uff08\u4e2a\u4eba\uff09", "name_py": "tzzsxpchz\uff08gr\uff09", "table_id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "company_name": "rzrk", "folder_id": 44}, {"file_name": "MidasLog_20170809.txt", "file_id": "598bbf4f1bb18498ae9f375d", "content_type": "application/octet-stream", "id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u5c5e\u6027\u8bc4\u6d4b\u6c47\u603b\uff08\u4e2a\u4eba\uff09", "name_py": "tzzsxpchz\uff08gr\uff09", "table_id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "company_name": "rzrk", "folder_id": 44}, {"file_name": "pushsdk_20170808000941.txt", "file_id": "598bbf4f1bb18498ae9f375a", "content_type": "application/octet-stream", "id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u5c5e\u6027\u8bc4\u6d4b\u6c47\u603b\uff08\u4e2a\u4eba\uff09", "name_py": "tzzsxpchz\uff08gr\uff09", "table_id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "company_name": "rzrk", "folder_id": 44}, {"file_name": "pushsdk_20170809081545.txt", "file_id": "5995665ebfcd252de5f8b7df", "content_type": "text/plain", "id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u5c5e\u6027\u8bc4\u6d4b\u6c47\u603b\uff08\u4e2a\u4eba\uff09", "name_py": "tzzsxpchz\uff08gr\uff09", "table_id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "company_name": "rzrk", "folder_id": 44}, {"file_name": "1.png", "file_id": "59910211d8e9e4683ee10eab", "content_type": "image/png", "id": "8994_JQ2GyCiGxKcpspg66Pr3AN", "ts_name": "", "namespace": "standard", "label": "\u56fe\u7247\u6d4b\u8bd5", "name_py": "tpcs", "table_id": "8994_JQ2GyCiGxKcpspg66Pr3AN", "company_name": "rzrk", "folder_id": 227}, {"file_name": "pushsdk_20170809081545.txt", "file_id": "598bbf4f1bb18498ae9f3754", "content_type": "application/octet-stream", "id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u5c5e\u6027\u8bc4\u6d4b\u6c47\u603b\uff08\u4e2a\u4eba\uff09", "name_py": "tzzsxpchz\uff08gr\uff09", "table_id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "company_name": "rzrk", "folder_id": 44}, {"file_name": "pushsdk_20170807095736.txt", "file_id": "598bbf4f1bb18498ae9f3757", "content_type": "application/octet-stream", "id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u5c5e\u6027\u8bc4\u6d4b\u6c47\u603b\uff08\u4e2a\u4eba\uff09", "name_py": "tzzsxpchz\uff08gr\uff09", "table_id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "company_name": "rzrk", "folder_id": 44}, {"file_name": "\u9644\u4ef61.png", "file_id": "59956402d8e9e42158198780", "content_type": "image/png", "id": "1182_P4BX5vGn3T2H6rb9b5RJW7", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u57fa\u672c\u4fe1\u606f\uff08\u4e2a\u4eba\uff09", "name_py": "tzzjbxx\uff08gr\uff09", "table_id": "1182_P4BX5vGn3T2H6rb9b5RJW7", "company_name": "rzrk", "folder_id": 31}, {"file_name": "MidasLog_20170809.txt", "file_id": "5995665ea6ddea6922028760", "content_type": "text/plain", "id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "ts_name": "", "namespace": "standard", "label": "\u6295\u8d44\u8005\u5c5e\u6027\u8bc4\u6d4b\u6c47\u603b\uff08\u4e2a\u4eba\uff09", "name_py": "tzzsxpchz\uff08gr\uff09", "table_id": "2091_UjW2Jo8B3RnboBGF7n8yPb", "company_name": "rzrk", "folder_id": 44}], "success": 1, "error": ""},
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
            this.dataPageController = new dataPagination({
                currentPage:1,
                rows:20,
            });
            let $parent1 = this.el.find('.data-page-control');
            this.dataPageController.render($parent1);
            let str = '"' + this.data.searchText + '"';
            this.el.find('.data-num').html(this.data.dataCount);
            this.el.find('.data-name').html(str);
            this.dataPageController.actions.paginationChanged = this.actions.dataPageChanged;

            //初始化attachment页面分页控制
            this.attachmentPageController = new dataPagination({
                currentPage:1,
                rows:15,
            });
            let $parent2 = this.el.find('.attachment-page-control');
            this.attachmentPageController.render($parent2);
            let str2 = '"' + this.data.searchText + '"';
            this.el.find('.attachment-num').html(this.data.attachmentCount);
            this.el.find('.attachment-name').html(str2);
            this.attachmentPageController.actions.paginationChanged = this.actions.attachmentPageChanged;
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
            let that = this;
            GlobalService.sendSearch(searchData).done((result) => {
                if(result.success === 1){
                    let tempData = result;       //开全局搜索接口后使用
                    // let tempData = this.data.test_data_result;      //测试使用
                    that.data.dataCount = tempData.total;
                    let str = '"' + this.data.searchText + '"';
                    that.el.find('.data-num').html(this.data.dataCount);
                    that.el.find('.data-name').html(str);
                    that.actions.displayDataResult(tempData);
                    that.dataPageController.setPagination(tempData.total,data.currentPage);
                    that.hideLoading();
                }else{
                    console.log("查询失败",result);
                    that.hideLoading();
                }
            }).fail((err) => {
                console.log("查询失败",err);
                that.hideLoading();
            });
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
            let that = this;
            GlobalService.sendSearch(searchData).done((result) => {
                if (result.success === 1) {
                    let tempData = result;                           //开全局搜索接口后使用
                    // let tempData = this.data.test_attachment_result;    //测试使用
                    that.data.attachmentCount = tempData.total;
                    let str2 = '"' + this.data.searchText + '"';
                    that.el.find('.attachment-num').html(this.data.attachmentCount);
                    that.el.find('.attachment-name').html(str2);
                    that.actions.displayAttachmentResult(tempData);
                    that.attachmentPageController.actions.setPagination(tempData.total, data.currentPage);
                    that.hideLoading();
                } else {
                    console.log("查询数据失败");
                    that.hideLoading();
                }
            })
        },
        /**
         * 向后台请求第一轮搜索，数据和附件均搜索
         */
        sendSearch:function () {
            this.showLoading();

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
                        that.dataPageController.actions.setPagination(tempData.total,1);
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

            GlobalService.sendSearch(searchData).done((result) => {
                if(result.success === 1){
                    let tempData = result;                           //开全局搜索接口后使用
                    // let tempData = that.data.test_attachment_result;    //测试使用
                    that.data.attachmentCount = tempData.total;
                    let str2 = '"' + this.data.searchText + '"';
                    that.el.find('.attachment-num').html(this.data.attachmentCount);
                    that.el.find('.attachment-name').html(str2);
                    that.actions.displayAttachmentResult(tempData);
                    that.attachmentPageController.actions.setPagination(tempData.total,1);
                    that.hideLoading();
                }else{
                    console.log("查询失败",result);
                    that.hideLoading();
                }
            }).fail((err) => {
                console.log("查询失败",err);
                that.hideLoading();
            });
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
        // this.el.on('click','.data-btn',() => {
        //     this.actions.showDataPage();
        // }).on('click','.attachment-btn',() => {
        //     this.actions.showAttachmentPage();
        // });
    },
    beforeDestroy:function () {
        Mediator.removeAll();
    }
};

class ResearchResult extends  Component{
    constructor(){
        super(config);
    }
}

export {ResearchResult}