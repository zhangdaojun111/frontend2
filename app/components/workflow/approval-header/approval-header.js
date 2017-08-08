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
        console.log(data)
        super(config,data);
    }

}

export default {
    showheader(data){
        let component = new ApprovalHeader(data);
        let el = $('#approval-info');
        component.render(el);
    },
};