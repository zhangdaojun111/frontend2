import Component from '../../../../lib/component';
// import './workflow-addFollow.scss';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<div class="flex" data-id="{{id}}">
    <div class="w33"><span class=" checkbox checked" name="{{name}}" value="{{id}}"></span></div>
        <div class="w33">{{name}}</div>
        <div class="w33">{{username}}</div>
    </div>`,
    data:{},
    action:{

    },
    afterRender(){
        Mediator.publish('workflow:pubCheck',this.data);
        this.el.on('click','.checkbox',function(){
            if(!$(this).hasClass('checked')){
                $(this).addClass('checked');
                Mediator.publish('workflow:pubCheckSingle',{
                    id:this.getAttribute('value'),
                    name:this.getAttribute('name')
                });
            }else{
                $(this).removeClass('checked');
                Mediator.publish('workflow:pubUncheckSingle',this.getAttribute('value'));
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