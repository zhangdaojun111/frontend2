import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator'
import {workflowService} from "../../../services/workflow/workflow.service";
import TreeView from '../../../components/util/tree/tree'
import WorkflowAddSigner from '../../../components/workflow/workflow-addFollow/workflow-addSigner/workflow-addSigner';

let config = {
	data: {
		tree: [],
		staff: [],
	},
	actions: {
		recursion(arr, slnds, pubInfo) {
			if (slnds.nodes.length !== 0) {
				for (let j in arr) {
					slnds.nodes.forEach(child => {
						if (j == child.id) {
							Mediator.publish(`workflow:${pubInfo}`, arr[j]);
							this.actions.recursion(arr, child, pubInfo)
						}
					});
				}
			}
		},
		recur(data) {
			for (let item of data){
				item.nodes=item.children;
				if(item.children.length!==0){
					this.actions.recur(item.children);
				}
			}
		},
		createTree(){
			let _this=this;
			let treeComp3 = new TreeView(this.data.tree, {
				callback: function (event, selectedNode) {
					if (event === 'select') {
						for (let k in _this.data.staff) {
							if (k == selectedNode.id) {
								Mediator.publish('workflow:checkAdder', _this.data.staff[k]);
								_this.actions.recursion(_this.data.staff, selectedNode, 'checkAdder');
							}
						}
					} else {
						for (let k in _this.data.staff) {
							if (k == selectedNode.id) {
								Mediator.publish('workflow:unCheckAdder', staff[k]);
								_this.actions.recursion(_this.data.staff, selectedNode, 'unCheckAdder');
							}
						}
					}
				},
				treeType: 'MULTI_SELECT',
				isSearch: true,
				withButtons: true
			});
			treeComp3.render(this.el.find('#addUser'));
		}
	},
	async afterRender() {
		let res=await workflowService.getStuffInfo({url: '/get_department_tree/'});
		this.data.tree=res.data.department_tree;
		this.data.staff=res.data.department2user;
		this.actions.recur(this.data.tree);
		let key = workflowService.GetQueryString('key');
		new WorkflowAddSigner({data:{key:key}}).render(this.el);
		this.actions.createTree();

	}
}

export default class AddSingner extends Component {
	constructor(extendConfig){
		super($.extend(true, {}, config, extendConfig));
	}
}