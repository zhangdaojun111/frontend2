/**
 * @author hufei
 * 生成常用工作流按钮
 */
import Component from "../../../../lib/component";
import template from './workflow-btn.html';
import './workflow-btn.scss';
import {workflowService} from '../../../../services/workflow/workflow.service';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    actions: {
        choose: function(e) {
	        this.events.chooseCb(_.defaultsDeep({},$(e.target)[0].dataset,{type:'btn'}));
        }
    },
    afterRender: function() {
        this.el.on('click', '.workflow-btn', (e) => {
            this.actions.choose(e);
        });
        this.el.on('click', '.delFav', (e) => {
	        workflowService.delWorkflowFavorite({'id':$(e.target)[0].dataset.id});
        });
    }
}

class WorkFlowBtn extends Component {
	constructor(extendConfig){
		super($.extend(true, {}, config, extendConfig));
	}
}

export default WorkFlowBtn;

WorkFlowBtn.config=config;