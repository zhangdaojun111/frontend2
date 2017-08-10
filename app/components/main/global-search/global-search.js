import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './global-search.scss';
import template from './global-search.html';
import msgbox from '../../../lib/msgbox';


let config ={
    template:template,
    data:{
        history_list:["test1","test2","test3","test4","test5"],
        record_count:0,
    },
    actions:{
        initComponent:function () {
            this.actions.getData();
        },
        getData:function () {
            // this.data.history_list =       初始化历史记录数据
            this.actions.initRecordList();
        },
        initRecordList:function () {
            let $ul = this.el.find("ul.record-list");
            for (let item of this.data.history_list){
                let $li = $("<li class='record-item'>").html(item);
                let $a = $("<a class='close-icon'>").html("x");
                $li.append($a);
                $ul.append($li);
                this.data.record_count++;
            }
            let $li =  $("<li class='clear-record'>").html("清除历史记录");
            $ul.append($li);
        },
        getFocus:function () {
            console.log("get focus");
            this.el.find("div.record-container").show();
            this.el.find("input.search-input").removeAttr("placeholder");
        },
        loseFocus:function () {
            this.el.find("div.record-container").hide();
            console.log("aa");
            if(this.el.find("input.search-input").val() === ''){
                this.el.find("input.search-input").attr("placeholder","请输入要搜索的内容...");
            }
        }
    },
    afterRender:function () {
        this.actions.initComponent();
        this.el.on("focus","input.search-input", () => {
            this.actions.getFocus();
        }).on("blur","input.search-input", () => {
            this.actions.loseFocus();
        })
    },
    beforeDestory:function () {
    }
};


class GlobalSearch extends  Component{
    constructor(){
        super(config);
    }
}

export {GlobalSearch}

