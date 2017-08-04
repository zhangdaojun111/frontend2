import Component from '../../../lib/component';
import template from './approval-header.html';
import './approval-header.scss';

import Mediator from '../../../lib/mediator';


let config = {
    template: template,
    data: {

    },
    actions: {

    },
    afterRender: function() {

    },
    beforeDestory: function(){

    }
}

class ApprovalHeader extends Component{
    constructor (data){
        super(config,data);
    }

}

export default {

    //获取常用工作流和下拉工作流名称
    loadData(data){
        let component = new ApprovalHeader(data);
        let el = $('#approval-header');
        component.render(el);
    },
};