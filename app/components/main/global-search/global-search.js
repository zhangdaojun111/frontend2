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
        historyList:[],
        searchContent:"",
        maxHistory:10,
        selectNum: -1,      //记录键盘选中的历史搜索记录，按一次下，选中第0条（界面中第一条）记录
        formerSearchContent:"",
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
        },
        initList:function () {
            let $listParent = this.el.find('.history-list');
            let temp = this.data.historyList;
            $listParent.empty();
            for( let k of temp){
                let $li = $("<li class='record-item'>");
                $li.attr('data_content',k.content)
                    .attr('data_index',k.index);

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
            this.el.find('.search-content').val(content).blur();
            this.el.find("div.history-display").hide();

            // 暂时隐藏搜索按钮
            // this.el.find(".search-icon").hide();
            if(content && content !== ''){
                // //判断搜索结果iframe是否已打开，打开则重置src
                // //此处全局搜索div.iframes
                // let resultIframe;
                // let iframes =  $("div.iframes").find("iframe");
                // let str = "searchContent=" + this.data.formerSearchContent;
                // str = encodeURI(str);
                // for(let k of iframes){
                //     let src = k.src;
                //     if(src.indexOf(str) > 0){
                //         resultIframe = k;
                //     }
                // }
                //
                // if(resultIframe){
                //     let newSrc = '/search_result?searchContent=' + this.data.searchContent;
                //     $(resultIframe).attr("src",newSrc);
                // }else{
                //     //搜索结果展示窗口未打开
                //     Mediator.emit('menu:item:openiframe', {
                //         id: "search-result",
                //         name: "搜索结果",
                //         url: "/search_result?searchContent=" + content
                //     });
                // }
                Mediator.emit('search:displayreuslt', {'content':content,'formerContent':this.data.formerSearchContent});
                this.actions.addSearchHistory();
                this.data.formerSearchContent = this.data.searchContent;
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
            this.el.find('.search-content').val('');
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
            if(this.el.find("input.search-content").val() === ''){
                this.el.find("input.search-content").attr("placeholder","请输入要搜索的内容...");
            }
        },
        setItemHover:function (event) {
            this.el.find('.record-item').removeClass('item-selected');
            $(event.currentTarget).addClass('item-selected');
            this.data.selectNum = event.currentTarget.attributes.data_index.value;
        },
        myKeyDown:function (event) {
            if(event.keyCode === 13){       //回车，进行搜索
                let content_first = this.el.find('.search-content').val();
                if(content_first){
                    this.data.searchContent = content_first
                }else if(this.data.selectNum >= 0){
                    this.data.searchContent = this.data.historyList[this.data.selectNum].content;
                }else{
                    this.data.searchContent = "";
                }
                this.actions.doSearch();
                this.data.selectNum = -1;
            }else if(event.keyCode === 40){
                this.data.selectNum++;
                let $list = this.el.find('.history-list');
                $list.find('.record-item').removeClass('item-selected');
                if(this.data.selectNum === this.data.historyList.length){
                    this.data.selectNum = 0;
                }
                let selected_content = this.data.historyList[this.data.selectNum].content;
                $list.find(`li[data_content = ${selected_content}]`).addClass('item-selected');
            }else if(event.keyCode === 38){
                this.data.selectNum--;
                let $list = this.el.find('.history-list');
                $list.find('.record-item').removeClass('item-selected');
                if(this.data.selectNum < 0){
                    this.data.selectNum = this.data.historyList.length - 1 ;
                }
                let selected_content = this.data.historyList[this.data.selectNum].content;
                $list.find(`li[data_content = ${selected_content}]`).addClass('item-selected');
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
            this.actions.dealRecordClick(event);
        }).on("click",".delete-all-history", (event) => {
            this.actions.isDeleteAllHistory();
        }).on('focus','.search-content',() => {
            this.actions.showHistoryList();
        }).on('blur','.global-search-main',() => {
            this.actions.hideHistoryList();
        }).on('keydown','.search-content',(event) => {
            this.actions.myKeyDown(event);
        }).on('mouseenter','li.record-item',(event) => {
            this.actions.setItemHover(event);
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

