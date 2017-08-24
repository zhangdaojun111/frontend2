/**
 *@author qiumaoyun
 *添加关注人右边组件
 */
import Component from '../../../../lib/component';
import template from './selected-staff.html';
import Mediator from '../../../../lib/mediator';

let config={
    template: template,
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