import Component from '../../../../lib/component';
// import './workflow-addFollow.scss';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<span class="removeble" data-id="{{id}}">{{name}}</span>`,
    data:{},
    action:{

    },
    afterRender(){
    }
};
class SelectedStaff extends Component{
    constructor (data){
        super(config,data);
    }
}

export default SelectedStaff;