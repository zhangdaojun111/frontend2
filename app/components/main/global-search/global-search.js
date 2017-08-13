import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './global-search.scss';
import template from './global-search.html';
import {AutoSelect} from '../../../components/util/autoSelect/autoSelect';
import {GlobalService} from  '../../../services/main/globalService';
import Mediator from '../../../lib/mediator';
import {UserInfoService} from "../../../services/main/userInfoService"
import msgbox from "../../../lib/msgbox";


let config ={
    template:template,
    data:{
        historyList:[{
            content:"test1",
            index:"0",
            py:"test1",
            display:"true",
        },{
            content:"test2",
            index:"1",
            py:"test2",
            display:"true",
        },{
            content:"test3",
            index:"2",
            py:"test3",
            display:"true",
        },{
            content:"test4",
            index:"3",
            py:"test4",
            display:"true",
        }],
        test_result:{"total": 19, "result": [{"ts_name": "", "count": 0, "name_py": "grrb", "row_num": 3515, "table_id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "folder_id": 252, "company_name": "rzrk", "namespace": "standard", "id": "1190_WsuRDjEJ9R6vHcHuR8hMzZ", "label": "\u4e2a\u4eba\u65e5\u62a5"}, {"ts_name": "", "count": 0, "name_py": "SAPqx", "row_num": 2164, "table_id": "5613_CHEUbzmZMsjDFT3AiwPB46", "folder_id": 100, "company_name": "rzrk", "namespace": "standard", "id": "5613_CHEUbzmZMsjDFT3AiwPB46", "label": "SAP\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xsBuggl", "row_num": 250, "table_id": "9233_m6GFUdno6HBvXzXsEiB2cn", "folder_id": 90, "company_name": "rzrk", "namespace": "standard", "id": "9233_m6GFUdno6HBvXzXsEiB2cn", "label": "\u7ebf\u4e0aBug\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "xtgzqsxtqx", "row_num": 231, "table_id": "7962_xCgeDKXmMXYHvzGBDajHAP", "folder_id": 99, "company_name": "rzrk", "namespace": "standard", "id": "7962_xCgeDKXmMXYHvzGBDajHAP", "label": "\u8fc5\u6295\u4f30\u503c\u6e05\u7b97\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xmjhmx", "row_num": 184, "table_id": "771_uNRGnuYfkrjAfE4eH7cpzD", "folder_id": 89, "company_name": "rzrk", "namespace": "standard", "id": "771_uNRGnuYfkrjAfE4eH7cpzD", "label": "\u9879\u76ee\u8ba1\u5212\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xttzjyxtqx", "row_num": 176, "table_id": "3790_NwsLTLfYZrgYvkyfnw2otN", "folder_id": 96, "company_name": "rzrk", "namespace": "standard", "id": "3790_NwsLTLfYZrgYvkyfnw2otN", "label": "\u8fc5\u6295\u6295\u8d44\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "bjkq", "row_num": 157, "table_id": "8924_YrawF4zecr4e9ZHgU6aNoS", "folder_id": 249, "company_name": "rzrk", "namespace": "standard", "id": "8924_YrawF4zecr4e9ZHgU6aNoS", "label": "\u5317\u4eac\u8003\u52e4"}, {"ts_name": "", "count": 0, "name_py": "xtjgjyxtqx", "row_num": 121, "table_id": "9844_LF7p29NigQvFE43fuTQMGP", "folder_id": 102, "company_name": "rzrk", "namespace": "standard", "id": "9844_LF7p29NigQvFE43fuTQMGP", "label": "\u8fc5\u6295\u673a\u6784\u4ea4\u6613\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xtmxptqx", "row_num": 97, "table_id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "folder_id": 98, "company_name": "rzrk", "namespace": "standard", "id": "4402_2TTVdex3Xe2v5DjHWuMVXF", "label": "\u8fc5\u6295\u6a21\u578b\u5e73\u53f0\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "xtzhglxtqx", "row_num": 22, "table_id": "9578_6fJrcK6tcj7Nv6oCovE7vF", "folder_id": 363, "company_name": "rzrk", "namespace": "standard", "id": "9578_6fJrcK6tcj7Nv6oCovE7vF", "label": "\u8fc5\u6295\u7efc\u5408\u7ba1\u7406\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "qxsqjlb", "row_num": 16, "table_id": "6771_gJL2KhEvCv8h67ZodMXVH2", "folder_id": 22, "company_name": "rzrk", "namespace": "standard", "id": "6771_gJL2KhEvCv8h67ZodMXVH2", "label": "\u6743\u9650\u7533\u8bf7\u8bb0\u5f55\u8868"}, {"ts_name": "", "count": 0, "name_py": "qjgl", "row_num": 16, "table_id": "8462_Zcer5GV7egyKF2TCGUfkn9", "folder_id": 17, "company_name": "rzrk", "namespace": "standard", "id": "8462_Zcer5GV7egyKF2TCGUfkn9", "label": "\u8bf7\u5047\u7ba1\u7406"}, {"ts_name": "", "count": 0, "name_py": "nbxqqr", "row_num": 5, "table_id": "8303_nXzZ8MApkZGKKTgyipch6E", "folder_id": 91, "company_name": "rzrk", "namespace": "standard", "id": "8303_nXzZ8MApkZGKKTgyipch6E", "label": "\u5185\u90e8\u9700\u6c42\u786e\u8ba4"}, {"ts_name": "", "count": 0, "name_py": "dddcmx", "row_num": 4, "table_id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "folder_id": 325, "company_name": "rzrk", "namespace": "standard", "id": "4978_RGU4hJp6cBGPHkxZxCMTEh", "label": "\u6ef4\u6ef4\u6253\u8f66\u660e\u7ec6"}, {"ts_name": "", "count": 0, "name_py": "xtgtxtqx", "row_num": 3, "table_id": "6228_iGVzG7supQSx485gXTfUKF", "folder_id": 103, "company_name": "rzrk", "namespace": "standard", "id": "6228_iGVzG7supQSx485gXTfUKF", "label": "\u8fc5\u6295\u67dc\u53f0\u7cfb\u7edf\u7f3a\u9677"}, {"ts_name": "", "count": 0, "name_py": "SAPbfjl", "row_num": 1, "table_id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "folder_id": 188, "company_name": "rzrk", "namespace": "standard", "id": "1560_hv7qdJS4MLHbiDdWQp7HpC", "label": "SAP\u62dc\u8bbf\u8bb0\u5f55"}, {"ts_name": "", "count": 0, "name_py": "xmglb", "row_num": 1, "table_id": "3758_jFgQgnxh42Ugkbrrfb7Tfh", "folder_id": 88, "company_name": "rzrk", "namespace": "standard", "id": "3758_jFgQgnxh42Ugkbrrfb7Tfh", "label": "\u9879\u76ee\u7ba1\u7406\u8868"}, {"ts_name": "", "count": 0, "name_py": "grfyhzx", "row_num": 1, "table_id": "7528_aeEEGfSyKxQvpKDy58EPDA", "folder_id": 372, "company_name": "rzrk", "namespace": "standard", "id": "7528_aeEEGfSyKxQvpKDy58EPDA", "label": "\u4e2a\u4eba\u8d39\u7528\u6c47\u603b\u65b0"}, {"ts_name": "", "count": 0, "name_py": "fybxsqb", "row_num": 1, "table_id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "folder_id": 321, "company_name": "rzrk", "namespace": "standard", "id": "9458_PcVT5cWJJ35xP3x6kCrPhT", "label": "\u8d39\u7528\u62a5\u9500\u7533\u8bf7\u8868"}], "success": 1, "error": ""},
        searchContent:"",
        maxHistory:10,
    },
    autoSelectRef:null,
    actions:{
        getData:function () {
            // UserInfoService.getSearchHistory().done((result) => {
            //     if(result.success === 1){
            //         this.data.historyList = result.data;
            //         this.actions.initAutoSelect();
            //     }else{
            //         console.log("get search history failed");
            //     }
            // }).fail((err) => {
            //     console.log("get search history failed",err);
            // })
            this.actions.initAutoSelect();
        },
        initAutoSelect:function () {
            let tempData = [];
            for (let item of this.data.historyList){
                if(item.content && item.content.trim() !== ''){
                    item.name = item.content;
                    item.id = item.index;
                }
                tempData.push(item);
            }
            let destroyItem = {
                name : "清除历史搜索记录",
                id : "destroy-record"
            };
            tempData.push(destroyItem);
            let autoSelectComponent = new AutoSelect({list:tempData});
            this.autoSelectRef = autoSelectComponent;
            let $container = this.el.find("div.search-group");
            autoSelectComponent.render($container);
            let $a = $("<a class='icon-search'>");
            $container.prepend($a);
        },
        doSearch:function () {
            let content = this.el.find("input").val();
            this.data.searchContent = content;

            if(content && content !== ''){
                //调用search服务
                // let id = this.actions.getNewId();
                let searchData = {
                    keyword:content,                      //搜索文字
                    rows:24 ,                               //每页显示的个数
                    page:1,                               //页面分页的页数
                    // id:id                               //新增设置id，id不重复
                };
                //打开搜索结果页面
                this.actions.showResearchResult();
                //暂时隐藏搜索按钮
                this.el.find("a.icon-search").hide();
                //发起第一次搜索请求，查询数据
                GlobalService.sendSearch(searchData).done((result) => {
                    if(result.success === 1){
                        console.log(result);
                        this.actions.addSearchHistory();
                    }else{
                        console.log("查询失败",result);
                    }
                }).fail((err) => {
                    console.log("查询失败",err);
                });

                searchData.in_attachment = 1 ;
                searchData.rows = 18;

                //发起第二次搜索请求，搜索附件
                GlobalService.sendSearch(searchData).done((result) => {
                    if(result.success === 1){
                        console.log(result);
                        this.el.find("a.icon-search").show();
                    }else{
                        this.el.find("a.icon-search").show();
                        console.log("查询失败",result);
                    }
                }).fail((err) => {
                    this.el.find("a.icon-search").show();
                    console.log("查询失败",err);
                });
            }
        },
        addSearchHistory(){
            let content = this.data.searchContent;
            if(content && content !== ""){
                for (let history of this.data.historyList){
                    if(history.content === content){
                        return;
                    }
                }
                let newHistory = {
                    content:this.data.content,
                };
                this.data.historyList.unshift(newHistory);
                if(this.data.historyList.length > this.data.maxHistory){
                    this.data.historyList.pop();
                }
                for (let i in this.data.historyList) {
                    this.data.historyList[i].index = i;
                }
            }

            UserInfoService.saveGlobalSearchHistory(this.historyList).done((result) => {
                console.log("historyList save success",result);
                //使用autoSelect扩展接口更新list的显示
            }).fail((err) => {
                console.log("historyList save failed",err);
            })
        },
        isDeleteAllHistory:function () {
            msgbox.confirm("您确定要清除全局搜索所有的历史数据吗？").then((result) => {
                if (result === true) {
                    this.actions.deleteAllHistory();
                } else {
                    return false;
                }
            })
        },
        deleteAllHistory:function () {
            this.data.historyList = [];
            UserInfoService.saveGlobalSearchHistory(this.data.historyList)
                .done((result) => {
                    //删除页面中的list////////////////////////////////////////////////////
                    msgbox.alert("成功清除历史搜索记录！")
                })
        },
        deleteSingleHistory:function (item) {
            let name = "test1";         //动态获取
            for(let i in this.data.historyList){
                if(this.data.historyList[i].content === name){
                    this.data.historyList.splice(i,1);
                    //删除页面中的list////////////////////////////////////////////////////
                    UserInfoService.saveGlobalSearchHistory(this.data.historyList);
                    break;
                }
            }
        },
        showResearchResult(){
            Mediator.emit('menu:item:openiframe', {
                id: "search-result",
                name: "搜索结果",
                url: "/search_result/"
            });

        }
        // initRecordList:function () {
        //     let $ul = this.el.find("ul.record-list");
        //     for (let item of this.data.historyList){
        //         let $li = $("<li class='record-item'>").html(item);
        //         let $a = $("<a class='close-icon'>").html("x");
        //         $li.append($a);
        //         $ul.append($li);
        //         this.data.record_count++;
        //     }
        //     let $li =  $("<li class='clear-record'>").html("清除历史记录");
        //     $ul.append($li);
        // },
        // getFocus:function () {
        //     console.log("get focus");
        //     this.el.find("div.record-container").show();
        //     this.el.find("input.search-input").removeAttr("placeholder");
        // },
        // loseFocus:function () {
        //     this.el.find("div.record-container").hide();
        //     console.log("aa");
        //     if(this.el.find("input.search-input").val() === ''){
        //         this.el.find("input.search-input").attr("placeholder","请输入要搜索的内容...");
        //     }
        // }
    },
    afterRender:function () {
        this.actions.getData();
        this.el.on("click","a.icon-search", () => {
            this.actions.doSearch();
        }).on("click","ul li:last-child", (event) => {
            this.actions.isDeleteAllHistory();
        })
    },
    beforeDestroy:function () {

    }
};


class GlobalSearch extends  Component{
    constructor(){
        super(config);
    }
}

export {GlobalSearch}

