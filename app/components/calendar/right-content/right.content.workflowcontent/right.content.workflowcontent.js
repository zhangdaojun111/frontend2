/**
 * Created by lipengfei.
 * 工作流进度展示
 */
import Component from "../../../../lib/component";
import template from './right.content.workflowcontent.html';
import './right.content.workflowcontent.scss';

import {PMAPI} from '../../../../lib/postmsg';

let config = {

    template:template,
    data:{

    },
    actions:{
        toPercent:function(point){
            var str=Number(point*100).toFixed(1);
            str+="%";
            return str;
        },
        showfirst(){
            let record_progress = config.actions.toPercent(this.data['record_progress']);
            this.el.find(".workflow-schedule").css({"width":record_progress});
        }
    },
    afterRender: function() {
        this.el.css("width","100%");
        this.actions.showfirst();
        this.el.on('click', '.workflow-content', () => {
            PMAPI.openDialogByIframe(
                `/wf/approval/?record_id=${this.data['id']}&form_id=${this.data['form_id']}&table_id=${this.data['table_id']}&flow_id=${this.data['flow_id']}`,
                {
                    width: "100%",
                    height: '900',
                    modal: true,
                    customSize: true,
                })
        })
    },
};
class RightContentWorkFlow extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}
export default RightContentWorkFlow;