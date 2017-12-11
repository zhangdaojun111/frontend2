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

let WorkFlowGrid = Component.extend(config);
export default WorkFlowGrid
