import Component from '../../../lib/component';
import template from './workflow-addFollow.html';
import './workflow-addFollow.scss';
import Mediator from '../../../lib/mediator';
import SelectStaff from './select-staff/select-staff';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        this.el.find('#staffMulti').html('');
        Mediator.subscribe('workflow:checkDept', (msg)=> {
            $.each(msg,(i,val)=>{
                val.id=i;
                this.append(new SelectStaff(val), this.el.find('#staffMulti'));
            })
        });
        Mediator.subscribe('workflow:unCheckDept', (msg)=> {
            let userArr=[];
            for(var id in msg){
                userArr.push(id);
            }
            console.log(userArr);
            console.log($('#staffMulti'));
            // Mediator.publish('workflow:delUserArr', userArr);
        });
        
        // this.data[1].rows.forEach((row)=>{
        // });

        this.el.on('click','#addFollower',()=>{
            this.el.find('#follower-select').show();
        })
        this.el.on('click','.close',()=>{
            this.el.find('#follower-select').hide();
        });
    }
};
class WorkflowAddFollow extends Component{
    constructor (data){
        super(config,data);
    }
}

let component = new WorkflowAddFollow();
let el = $('#add-follow');
component.render(el);