/**
 * @author zhaoyan
 * 全局搜索框控制组件
 */

import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './global-search.scss';
import template from './global-search.html';
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
        testResult:{"data": "[{\"content\": \"sad\", \"index\": \"0\", \"py\": \"sad\", \"display\": true}, {\"index\": \"1\", \"py\": \"cz\", \"selector\": false, \"content\": \"cz\", \"display\": true, \"select\": false}, {\"index\": \"2\", \"py\": \"a b\", \"selector\": false, \"content\": \"a b\", \"display\": true, \"select\": false}, {\"index\": \"3\", \"py\": \"vvcx\", \"selector\": false, \"content\": \"vvcx\", \"display\": true, \"select\": false}, {\"index\": \"4\", \"py\": \"h\", \"selector\": false, \"content\": \"\\u534e\", \"display\": true, \"select\": false}, {\"index\": \"5\", \"py\": \"c\", \"selector\": false, \"content\": \"c\", \"display\": true, \"select\": false}, {\"index\": \"6\", \"py\": \"i\", \"selector\": false, \"content\": \"i\", \"display\": true, \"select\": false}]", "success": 1, "error": ""},
        // historyList:[],
        searchContent:"",
        maxHistory:10,
        selectNum: -1,      //记录键盘选中的历史搜索记录，按一次下，选中第0条（界面中第一条）记录
    },
    searchBarRef:null,
    actions:{
        getData:function () {
            UserInfoService.getSearchHistory().done((result) => {
                if(result.success === 1){
                    this.data.historyList = $.parseJSON(result.data);
                    this.actions.initList();
                }else{
                    console.log("get search history failed");
                }
            }).fail((err) => {
                console.log("get search history failed",err);
            });
            // this.actions.initList(this.data.historyList);
        },
        initList:function () {
            let $listParent = this.el.find('.history-list');
            let temp = this.data.historyList;
            $listParent.empty();
            console.log(temp);
            for( let k of temp){
                console.log(k)
                let $li = $("<li class='record-item'>");
                $li.attr('data_content',k.content);

                let $content = $("<span class='record-content'>");
                $content.attr("operate","search");
                $content.html(k.content);

                let $delete = $("<span class='delete-icon'>");
                $delete.attr("operate","delete");
                $delete.html('x');

                $li.append($content);
                $li.append($delete);
                $listParent.append($li);
            }

            //添加清除历史记录按钮
            let $deleteBtn = $("<li class='delete-all-history'>");
            $deleteBtn.html("清除所有搜索记录");
            $listParent.append($deleteBtn);
        },
        setSearchContent:function (event) {
            this.data.searchContent = event.target.value;
            this.actions.filterHistory(event.target.value);
        },
        filterHistory:function (str) {
            let $list = this.el.find('.history-list');
            if(str !== ''){
                $list.find('.record-item').hide();
                $list.find('.delete-all-history').hide();
                $list.find(`li[data_content *= ${str}]`).show();
            }else{
                if(this.data.historyList.length > 0){
                    $list.find('.record-item').show();
                    $list.find('.delete-all-history').show();
                }
            }
        },
        doSearch:function () {
            let content = this.data.searchContent;
            if(content && content !== ''){
                Mediator.emit('menu:item:openiframe', {
                    id: "search-result",
                    name: "搜索结果",
                    url: "/search_result?searchText=" + content
                });
                this.actions.addSearchHistory();
            }else{
                msgbox.alert("搜索内容不能为空");
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
                    'content':content,
                    'py':content,
                };
                this.data.historyList.unshift(newHistory);
                if(this.data.historyList.length > this.data.maxHistory){
                    this.data.historyList.pop();
                }
                for (let i in this.data.historyList) {
                    this.data.historyList[i].index = i;
                }
            }
            this.actions.initList();
            UserInfoService.saveGlobalSearchHistory(this.data.historyList).done((result) => {
                console.log("historyList save success",result);
                //使用autoSelect扩展接口更新list的显示
            }).fail((err) => {
                console.log("historyList save failed",err);
            })
        },
        deleteOneRecord:function (content) {
            _.remove(this.data.historyList,function (k) {
                return k.content === content;
            });
            //向后台存history
            UserInfoService.saveGlobalSearchHistory();


            this.actions.initList();
        },
        dealRecordClick:function (event) {
            let operate = '';
            if((event.target.attributes).hasOwnProperty('operate')){
                operate = event.target.attributes.operate.value
            }
            let content = event.currentTarget.attributes.data_content.value;

            if(operate === 'delete'){
                this.actions.deleteOneRecord(content);
            }else{
                this.data.searchContent = content;
                this.actions.doSearch();
                this.el.find('.search-content').val(content);
                this.el.find("div.history-display").hide();
            }
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
            this.data.historyList.length = 0;
            this.actions.initList();
            UserInfoService.saveGlobalSearchHistory(this.data.historyList)
                .done((result) => {
                    msgbox.alert("成功清除历史搜索记录！")
                })
        },
        showHistoryList:function () {
            if(this.data.historyList.length > 0){
                this.el.find("div.history-display").show();
                this.el.find("input.search-content").removeAttr("placeholder");
            }
        },
        hideHistoryList:function () {
            let that = this;
            setTimeout(function () {
                that.el.find("div.history-display").hide();
            },100);
            // this.el.find("div.history-display").hide();
            if(this.el.find("input.search-content").val() === ''){
                this.el.find("input.search-content").attr("placeholder","请输入要搜索的内容...");
            }
        },
        myKeyDown:function (event) {
            console.log(event);
            if(event.keyCode === 13){       //回车，进行搜索
                //根据id设置搜索的content

                selectNum = -1;
                this.actions.doSearch();
            }else if(event.keyCode === 40){
                this.data.selectNum++;
                this.el.find('')
            }else if(event.keyCode === 38){

            }else{

            }











        }
    },
    afterRender:function () {
        let that = this;
        this.actions.getData();
        this.el.on("click","i.search-icon", () => {
            this.actions.doSearch();
        }).on('input','.search-content',(event) => {
            this.actions.setSearchContent(event);
        }).on('click','.record-item',(event) => {
            setTimeout(function () {
                that.actions.dealRecordClick(event);
            },100);
        }).on("click",".delete-all-history", (event) => {
            this.actions.isDeleteAllHistory();
        }).on('focus','.search-content',() => {
            this.actions.showHistoryList();
        }).on('blur','.global-search-main',() => {
            console.log("oooo");
            this.actions.hideHistoryList();
        }).on('keydown','.search-content',(event) => {
            this.actions.myKeyDown(event);
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

