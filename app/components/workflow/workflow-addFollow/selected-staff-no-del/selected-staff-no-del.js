import Component from '../../../../lib/component';
// import './workflow-addFollow.scss';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<span data-id="{{id}}" style="background:#66CCFF">{{name}}</span>`,
    data:{},
    action:{

    },
    afterRender(){
    }
};
class SelectedStaffNoDel extends Component{
    constructor (data){
        super(config,data);
    }
}

export default SelectedStaffNoDel;