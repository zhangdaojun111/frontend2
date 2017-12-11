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
let SelectStaffNoDel = Component.extend(config);
export default SelectStaffNoDel