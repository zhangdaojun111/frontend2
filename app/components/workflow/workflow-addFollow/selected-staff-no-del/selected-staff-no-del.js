/**
 *@author qiumaoyun
 *添加关注人右边组件 不可删除
 */
import Component from '../../../../lib/component';
import template from './selected-staff-no-del.html';
import Mediator from '../../../../lib/mediator';

let config={
    template:template,
    data:{},
    action:{

    },
    afterRender(){
    }
};
class SelectedStaffNoDel extends Component{
    // constructor (data){
    //     super(config,data);
    // }

    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default SelectedStaffNoDel;