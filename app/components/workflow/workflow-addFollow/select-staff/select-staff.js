import Component from '../../../../lib/component';
// import './workflow-addFollow.scss';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<div class="flex" data-id="{{id}}">
        <input class="w33" type="checkbox" name="{{name}}" value="{{id}}" checked>
        <div class="w33">{{name}}</div>
        <div class="w33">{{username}}</div>
    </div>`,
    data:{},
    action:{

    },
    afterRender(){
        Mediator.publish('workflow:pubCheck',this.data);
        this.el.on('click','input[type="checkbox"]',function(){
            if($(this).prop('checked')){
                Mediator.publish('workflow:pubCheckSingle',{
                    id:this.value,
                    name:this.name
                });
            }else{
                Mediator.publish('workflow:pubUncheckSingle',this.value);
            }
        });
    }
};
class SelectStaff extends Component{
    constructor (data){
        super(config,data);
    }
}

export default SelectStaff;