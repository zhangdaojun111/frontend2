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
        searchContent:"",
        maxHistory:10,
    },
    searchBarRef:null,
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
            this.actions.initList(this.data.historyList);
        },
        initList:function () {
            let $listParent = this.el.find('.history-list');
            let temp = this.data.historyList;
            $listParent.empty();
            for( let k of temp){
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
        },
        doSearch:function () {
            let content = this.data.searchContent;
            if(content && content !== ''){
                Mediator.emit('menu:item:openiframe', {
                    id: "search-result",
                    name: "搜索结果",
                    url: "/search_result?searchText=" + content
                });
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
                this.el.find("div.history-display").slideUp();
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
                this.el.find("div.history-display").slideDown();
                this.el.find("input.search-content").removeAttr("placeholder");
            }
        },
        hideHistoryList:function () {
            this.el.find("div.history-display").slideUp();
            if(this.el.find("input.search-content").val() === ''){
                this.el.find("input.search-content").attr("placeholder","请输入要搜索的内容...");
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
        }).on('blur','.search-content',() => {
            this.actions.hideHistoryList();
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

