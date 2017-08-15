import Component from '../../../lib/component';
import template from '././approval-record.html';
import '././approval-record.scss';


let config={
    template: template,
    data:{},
    actions:{

    },
    afterRender(){

    }
};
class workflowRecord extends Component{
    constructor (data){
        super(config,data);
    }
}

export default {
    showRecord(data){
        let component = new workflowRecord(data);
        let el = $('#workflow-record');
        component.render(el);
    },
};

