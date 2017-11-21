/**
 *@author qiumaoyun
 *添加关注人中间组件
 */
import Component from '../../../../lib/component';
import template from './select-staff.html';
import Mediator from '../../../../lib/mediator';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        Mediator.publish('workflow:pubCheck',this.data);
        let _this=this;
        this.el.on('click','.checkbox',function(){
            if(!$(this).hasClass('checked')){
                $(this).addClass('checked');
                Mediator.publish('workflow:pubCheckSingle',{
                    id:this.getAttribute('value'),
                    name:this.getAttribute('name')
                });
            }else{
            	if(_this.data.preventClick.indexOf(this.getAttribute('value')) != -1){
            		return;
	            }
                $(this).removeClass('checked');
                Mediator.publish('workflow:pubUncheckSingle',this.getAttribute('value'));
            }
        });
    }
};
class SelectStaff extends Component{
    // constructor (data){
    //     super(config,data);
    // }

    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default SelectStaff;