/**
 *@author qiumaoyun
 *添加关注人中间组件 不可删除
 */
import Component from '../../../../lib/component';
import template from './select-staff-no-del.html';
import Mediator from '../../../../lib/mediator';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        Mediator.publish('workflow:pubCheckNoDel',this.data);
    }
};
class SelectStaffNoDel extends Component{
    // constructor (data){
    //     super(config,data);
    // }

	constructor(extendConfig){
		super($.extend(true, {}, config, extendConfig));
	}
}

export default SelectStaffNoDel;

SelectStaffNoDel.config=config;