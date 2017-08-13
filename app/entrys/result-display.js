import Component from '../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import '../assets/scss/result-display.scss';
import template from '../../../../../template/reuslt-display.html';
import Mediator from '../../../../lib/mediator';

let config = {
    template:template,
    data:{},
    actions:{
        
    },
    afterRender:function () {
        console.log("init research result page");
    },
    beforeDestroy:function () {

    }
};

class ResearchResult extends  Component{
    constructor(){
        super(config);
    }
}

export {ResearchResult}