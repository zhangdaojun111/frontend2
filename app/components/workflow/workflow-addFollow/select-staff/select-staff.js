import Component from '../../../../lib/component';
import template from './select-staff.html';
// import './workflow-addFollow.scss';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
    
    }
};
class SelectStaff extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new SelectStaff();
let el = $('#staffMulti');
component.render(el);