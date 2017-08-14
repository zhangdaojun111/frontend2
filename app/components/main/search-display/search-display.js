import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './search-display.scss';
import template from './search-display.html';
import Mediator from '../../../lib/mediator';

let config = {
    template:template,
    data:{},
    actions:{
        subscribeData:function () {
            //订阅数据查询结果
            Mediator.on("main:global-search:data",(data) => {
                console.log("on",this.data.test_data_result);
                this.actions.displayDataResult(data);
            });
            //订阅附件查询结果
            Mediator.on("main:global-search:attachment",(data) => {
                this.actions.displayAttachmentResult(data);
            });
        },
        displayDataResult:function (data) {
            console.log(data);
        },
        displayAttachmentResult:function (data) {
            console.log(data);
        }
    },
    afterRender:function () {
        console.log("init research result page");
        this.actions.subscribeData();
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