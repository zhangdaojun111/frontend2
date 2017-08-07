import Component from '../../../lib/component';
import template from './workflow-addFollow.html';
import './workflow-addFollow.scss';

let config={
    template: template,
    data:{},
    action:{

    },
    afterRender(){
        this.el.on('click','#addFollower',()=>{
            console.log(1);
        })
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