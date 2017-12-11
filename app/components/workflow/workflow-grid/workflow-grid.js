/**
 *@author qiumaoyun and luyang
 *工作流表格
 */
import Component from "../../../lib/component";
import template from './workflow-grid.html';
import './workflow-grid.scss'


let config = {
	template: template,
	data:{},

	actions: {

	},
	afterRender: function() {

	}
}

export default class WorkFlowGrid extends Component {
	// constructor(data){
	//     config.data = data;
	//     super(config);
	// }

	constructor(extendConfig){
		super($.extend(true, {}, config, extendConfig));
	}
}

WorkFlowGrid.config=config;
