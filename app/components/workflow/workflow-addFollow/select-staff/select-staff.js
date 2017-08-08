import Component from '../../../../lib/component';
import template from './select-staff.html';
// import './workflow-addFollow.scss';
import Mediator from '../../../../lib/mediator';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        Mediator.subscribe('workflow:delUserArr', (msg)=> {
            console.log(msg);
        });
    }
};
class SelectStaff extends Component{
    constructor (data){
        super(config,data);
    }
}

export default SelectStaff;