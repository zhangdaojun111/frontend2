import Component from "../../../lib/component";
import Mediator from "../../../lib/mediator";
import TreeView from '../../util/tree/tree'
import {workflowService} from '../../../services/workflow/workflow.service'
import WorkflowAddFollow from '../../../components/workflow/workflow-addFollow/workflow-addFollow/workflow-addFollow';

let config = {
	data: {
		tree: [],
		staff: [],
	},
	actions: {
		recur(data, dept, staff, idArr, notice) {
			for (let item of data) {
				item.nodes = item.children;
				for (let i in dept) {
					if (item.text.indexOf(dept[i]) !== -1) {
						item.state = {};
						item.state.checked = true;
						item.state.selected = true;
						for (let k in staff) {
							if (k == item.id) {
								let o = {};
								for (let j in idArr) {
									o[idArr[j]] = staff[k][idArr[j]];
								}
								notice ? this.data.addFollow.action.checkDeptAlready(o) : Mediator.publish('workflow:checkDept', o);
							}
						}
					}
				}
				if (item.children.length !== 0) {
					this.actions.recur(item.children, dept, staff, idArr, notice);
				}
			}
		},
		recur2(data) {
			for (let item of data) {
				item.nodes = item.children;
				if (item.children.length !== 0) {
					this.actions.recur2(item.children);
				}
			}
		},
		renderTree(tree) {
			let _this = this;
			let treeComp2 = new TreeView(tree, {
				callback: function (event, selectedNode) {
					if (event === 'select') {
						for (let k in  _this.data.staff) {
							if (k == selectedNode.id) {
								Mediator.publish('workflow:checkDept', _this.data.staff[k]);
							}
						}
					} else {
						for (let k in  _this.data.staff) {
							if (k == selectedNode.id) {
								Mediator.publish('workflow:unCheckDept', _this.data.staff[k]);
							}
						}
					}
				},
				treeType: 'MULTI_SELECT',
				isSearch: true,
				withButtons: true
			});
			treeComp2.render(this.el.find('#treeMulti'));
		},
		subscribe() {
			Mediator.subscribe('workflow:addusers',(data) => {
				this.actions.addFocusCb(data);
			});
		},
		async addFocusCb(data){
			let arr = data.users;
			let defaultFocus = [];
			for (let key in data.defaultFocus) {
				defaultFocus.push(key);
			}
			if (!arr || arr.length < 1) return;
			let dept = [], idArr = [];
			let users = await workflowService.getWorkflowInfo({url: '/get_all_users/'});
			for (let i in arr) {
				idArr.push(users.rows[i].id);
				dept.push(users.rows[i].department);
			}
			this.data.addFollow.action.idArr(idArr);
			dept = _.uniq(dept);
			let res = await  workflowService.getStuffInfo({url: '/get_department_tree/'});
			this.data.tree = res.data.department_tree;
			this.data.staff = res.data.department2user;
			this.actions.recur(this.data.tree, dept, this.data.staff, idArr, false);
			this.actions.renderTree(this.data.tree);
		}
	},
	async afterRender() {
		let focus = this.data.focus;
		let key = workflowService.GetQueryString('key');
		let _this=this;
		this.data.addFollow=new WorkflowAddFollow({data:{key: key},events:{
			addFocusCb(res){
				_this.actions.addFocusCb(res)
			}
		}});
		this.data.addFollow.render(this.el);
		if (focus.length >= 1 && focus[0].indexOf('key') === -1) {
			let dept = [], idArr = [];
			let users = await workflowService.getWorkflowInfo({url: '/get_all_users/'});
			for (let i in focus) {
				idArr.push(users.rows[focus[i]].id);
				dept.push(users.rows[focus[i]].department);
			}
			this.data.addFollow.action.idArr(idArr);
			dept = _.uniq(dept);
			let res =await workflowService.getStuffInfo({url: '/get_department_tree/'});
			this.data.tree = res.data.department_tree;
			this.data.staff = res.data.department2user;
			this.actions.recur(this.data.tree, dept, this.data.staff, idArr, true);
		} else {
			let res = await workflowService.getStuffInfo({url: '/get_department_tree/'});
			this.data.tree = res.data.department_tree;
			this.data.staff = res.data.department2user;
			this.data.addFollow.action.checkDeptAlready(0)
			this.actions.recur2(this.data.tree);
		}
		this.actions.renderTree(this.data.tree);
		this.actions.subscribe();
	}
}

export default class AddFocus extends Component {
	constructor(extendConfig){
		super($.extend(true, {}, config, extendConfig));
	}


}