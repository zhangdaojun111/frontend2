import Component from '../../../lib/component';
import template from './workflow-seal.html';
import './workflow-seal.scss';

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
    showheader(data){
        let component = new ApprovalHeader(data);
        let el = $('#workflow-seal');
        component.render(el);
    },
};