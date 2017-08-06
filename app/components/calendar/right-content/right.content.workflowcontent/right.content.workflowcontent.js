import Component from "../../../../lib/component";
import template from './right.content.workflowcontent.html';
import './right.content.workflowcontent.scss';

let config = {

    template:template,
    data:{
        workflow_schedule: "'20%'",
    },
    actions:{

    },
    afterRender: function() {
        this.el.css("height","30px");
        let workflow_Id = "#workflow-"+config.data.workflow_Id;
        $("#workflow").attr("id","workflow-"+config.data.workflow_Id);
        $(workflow_Id).css({"width":config.data.workflow_schedule});
        console.log(config.data.workflow_schedule);
    },
}
class RightContentWorkFlow extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}
export default RightContentWorkFlow;