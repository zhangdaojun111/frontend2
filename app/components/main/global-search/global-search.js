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
        historyList:[],             //存放历史搜索记录
        searchContent:"",           //当前爱搜索内容
        maxHistory:10,              //历史记录最大数量
        selectNum: -1,              //记录键盘选中的历史搜索记录，按一次下，选中第0条（界面中第一条）记录
        formerSearchContent:"",     //上一次的搜索记录，用来查找iframe
        globalSearchOpen:"1",       //是否允许使用全局搜索
    },
    actions:{
        /**
         * 获取用户历史搜索记录数据，初始化记录列表
         */
        getData:function () {
            let that = this;
            UserInfoService.getSearchHistory().done((result) => {
                if(result.success === 1){
                    that.data.historyList = $.parseJSON(result.data);
                    that.actions.initList();
                }else{
                    console.log("get search history failed");
                }
            }).fail((err) => {
                console.log("get search history failed",err);
            });
        },
        /**
         * 根据数据更新历史记录列表
         */
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
                $delete.html('×');

                $li.append($content);
                $li.append($delete);
                $listParent.append($li);
            }
            //添加清除历史记录按钮
            $("<li class='delete-all-history'>清除所有搜索记录</li>").appendTo($listParent);
        },
        /**
         * 监听用户输入，设置搜索内容，在历史记录中查找匹配内容
         */
        setSearchContent:function (event) {
            this.data.searchContent = event.target.value;
            this.actions.filterHistory(event.target.value);
        },
        /**
         * 历史记录中过滤显示匹配内容
         */
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
        /**
         * 根据用户权限，通知搜索组件执行搜索并显示结果或提示用户全局搜索功能未开启
         */
        doSearch:function () {
            if(this.data.globalSearchOpen === "1"){
                let content = this.data.searchContent;
                this.el.find('.search-content').val(content).blur();
                this.el.find("div.history-display").hide();
                // 暂时隐藏搜索按钮
                // this.el.find(".search-icon").hide();
                if(content && content !== ''){
                    Mediator.emit('search:displayreuslt', {'content':content,'formerContent':this.data.formerSearchContent});
                    this.actions.addSearchHistory();
                    this.data.formerSearchContent = this.data.searchContent;
                }else{
                    msgbox.alert("搜索内容不能为空");
                }
            }else{
                msgbox.showTips("全局检索功能未开启，" + '<br>' + "请联系管理员。");
            }
        },
        /**
         * 添加搜索记录
         */
        addSearchHistory(){
            let content = this.data.searchContent;
            if(content && content !== ""){
                //删除重复历史记录，保证新查询的记录在最前面
                _.remove(this.data.historyList,function (n) {
                    return n.content === content;
                });

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
            //向后台更新历史搜索记录
            UserInfoService.saveGlobalSearchHistory(this.data.historyList).done((result) => {
            }).fail((err) => {
                console.log("historyList save failed",err);
            })
        },
        /**
         * 手动删除一条历史记录
         */
        deleteOneRecord:function (content) {
            _.remove(this.data.historyList,function (k) {
                return k.content === content;
            });
            //向后台存history
            UserInfoService.saveGlobalSearchHistory(this.data.historyList);
            this.actions.initList();
        },
        /**
         * 点击历史记录根据事件对象进行查询或删除该条记录
         */
        dealRecordClick:function (event) {
            let operate = '';
            if((event.target.attributes).hasOwnProperty('operate')){
                operate = event.target.attributes.operate.value
            }
            let content = event.currentTarget.attributes.data_content.value;

            if(operate === 'delete'){                   //operate取值delete或search
                this.actions.deleteOneRecord(content);
            }else{
                this.data.searchContent = content;
                this.actions.doSearch();
            }
        },
        /**
         * 确认清除所有历史记录？
         */
        isDeleteAllHistory:function () {
            msgbox.confirm("确定清除所有检索历史？").then((result) => {
                if (result === true) {
                    this.actions.deleteAllHistory();
                } else {
                    return false;
                }
            })
        },
        /**
         * 清除所有历史记录
         */
        deleteAllHistory:function () {
            this.data.historyList.length = 0;
            this.actions.initList();
            UserInfoService.saveGlobalSearchHistory(this.data.historyList)
                .done((result) => {
                    msgbox.alert("成功清除历史搜索记录！")
                })
        },
        /**
         * 显示历史搜索记录
         */
        showHistoryList:function () {
            // this.el.find('.search-content').val('');
            if(this.data.historyList.length > 0){
                this.el.find("div.history-display").show();
                // this.el.find("input.search-content").removeAttr("placeholder");
            }
        },
        /**
         * 隐藏历史记录
         */
        hideHistoryList:function () {
            this.el.find("div.history-display").hide();
            // if(this.el.find("input.search-content").val() === ''){
            //     this.el.find("input.search-content").attr("placeholder","请输入要搜索的内容...");
            // }
        },
        /**
         * 鼠标hover历史记录，样式设置，保证与键盘操作同步
         */
        setItemHover:function (event) {
            this.el.find('.record-item').removeClass('item-selected');
            $(event.currentTarget).addClass('item-selected');
            this.data.selectNum = event.currentTarget.attributes.data_index.value;
        },
        /**
         * 键盘绑定监听
         */
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
        },
        /**
         * 指向清除所有历史记录时，取消所有历史记录样式
         */
        allItemBlur:function () {
            this.el.find('.record-item').removeClass('item-selected');
        }
    },
    binds:[
        {
            event:'click',
            selector:'i.search-icon',
            callback:_.debounce(function(){     //点击开始搜索
                this.actions.doSearch();
            },500)
        },
        {
            event:'input',
            selector:'.search-content',
            callback:function (target,event) {          //监听用户输入，设置搜索内容和过滤历史记录
                this.actions.setSearchContent(event);
            }
        },
        {
            event:'mousedown',
            selector:'.record-item',
            callback:function (target,event) {          //监听历史记录点击，执行搜索或删除该条记录
                this.actions.dealRecordClick(event);
            }
        },
        {
            event:'mousedown',
            selector:'.delete-all-history',
            callback:function () {
                this.actions.isDeleteAllHistory();      //确认删除所有历史记录
            }
        },
        {
            event:'focus',
            selector:'.search-content',
            callback:function () {
                this.actions.showHistoryList();         //显示历史记录
            }
        },
        {
            event:'blur',
            selector:'.global-search-main',
            callback:function (target,event) {
                this.actions.hideHistoryList(event);        //隐藏历史记录
            }
        },
        {
            event:'keydown',
            selector:'.search-content',
            callback:function (target,event) {
                this.actions.myKeyDown(event);          //监听键盘
            }
        },
        {
            event:'mouseenter',
            selector:'li.record-item',
            callback:function (target,event) {
                this.actions.setItemHover(event);       //鼠标指向历史记录
            }
        },
        {
            event:'mouseenter',
            selector:'.delete-all-history',
            callback:function () {
                this.actions.allItemBlur();             //鼠标指向删除全部历史记录
            }
        }
    ],
    afterRender:function () {
        this.actions.getData();
        this.data.globalSearchOpen = window.config.sysConfig.logic_config.use_search.toString();        //设置用户权限
        // this.el.on("click","i.search-icon", _.debounce(() => {
        //     this.actions.doSearch();
        // },500)).on('input','.search-content',(event) => {
        //     this.actions.setSearchContent(event);
        // }).on('mousedown','.record-item',(event) => {
        //     this.actions.dealRecordClick(event);
        // }).on("click",".delete-all-history", () => {
        //     this.actions.isDeleteAllHistory();
        // }).on('focus','.search-content',() => {
        //     this.actions.showHistoryList();
        // }).on('blur','.global-search-main',(event) => {
        //     this.actions.hideHistoryList(event);
        // }).on('keydown','.search-content',(event) => {
        //     this.actions.myKeyDown(event);
        // }).on('mouseenter','li.record-item',(event) => {
        //     this.actions.setItemHover(event);
        // })
    },
    beforeDestroy:function () {

    }
};

class GlobalSearch extends  Component{
    constructor(newConfig){
        super($.extend(true,{},config,newConfig));
    }
}

export {GlobalSearch}

