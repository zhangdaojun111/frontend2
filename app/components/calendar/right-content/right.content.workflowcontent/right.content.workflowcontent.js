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
        let workflow_Id = "#workflow-"+config.data.table_id;
        this.el.find("#workflow").attr("id","workflow-"+config.data.table_id);
        this.el.find(workflow_Id).css({"width":config.data.record_progress});
        console.log(config.data);
    },
}
class RightContentWorkFlow extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}
export default RightContentWorkFlow;