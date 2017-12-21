/**
 * @author xiongxiaotao
 * @description 本组件是向其他用户推送消息的组件
 */
import template from './post-message.html';
import './post-message.scss';
import Component from '../../../lib/component';
import msgbox from '../../../lib/msgbox';
import {HTTP} from '../../../lib/http';
import {Form} from '../../../lib/form';
import TreeView from '../../util/tree/tree';
import {AutoSelect} from '../../util/autoSelect/autoSelect';
import moment from 'moment';

/**
 * 初始化树的数据
 * @param list
 */
function formatTreeData(list) {
    let res = list.map((item) => {
        item.icon = '';
        item.selectedIcon = '';
        item.backColor = "#FFFFFF";
        item.selectable = false;
        item.state = {
            checked: false,
            disabled: false,
            expanded: true,
            selected: false,
        };
        item.tags = ['available'];
        item.nodes = item.children;
        delete item.children;
        if (item.nodes) {
            if (item.nodes.length === 0) {
                delete item.nodes;
            } else {
                item.nodes = formatTreeData(item.nodes);
            }
        }
        return item;
    });

    return res;
}

let PostMessage = Component.extend({
    template: template,
    data: {
        // 用户数据
        userData: [],
        // 部门数据
        departmentData: [],
        // 选中的部门
        choosedDepart: [],
	    //所在部门所有成员id
	    depIDs:[],
	    depUserIds:[],
	    department_tree:null,
	    depId:window.config.sysConfig.userInfo.department_whole && window.config.sysConfig.userInfo.department_whole,
	    isHr:false,
    },
    binds:[{
        event:'change',
        selector:'input[name=sendType]',
        callback:function (content) {
            this.actions.onSendTypeChange($(content).val());
        }
    },{
        event:'click',
        selector:'.submit',
        callback:function () {
            this.actions.submit();
        }
    }],
    actions: {
        /**
         * 获取部门数据，并初始化部门树和人员选择组件
         */
        getDepartmentData: function () {
            this.showLoading();
            HTTP.getImmediately('/get_department_tree/', {type: ''}).then((res) => {
                this.data.userData = res.data.department2user;
                this.data.department_tree=res.data.department_tree;
                this.data.departmentData = formatTreeData(res.data.department_tree)
                this.actions.initTree();
                this.actions.initChoosedUsers();
                for(let id of this.data.depId){
	                this.actions.findDep(this.data.department_tree,id);
                }
                this.actions.saveUserIds();
                this.hideLoading();
            });
        },
	    saveUserIds(){
        	for(let key in this.data.userData){
        		if((~this.data.depIDs.indexOf(key))){
        			for(let key2 in this.data.userData[key]){
        				this.data.depUserIds.push(key2);
			        }
		        }
	        }
	    },
	    //存储所有所在部门成员id
	    saveDepIds(data){
		    data.id && this.data.depIDs.push(data.id);
			for(let key in data){
				let obj=data[key];
				let node=obj.nodes;
				if(node && node.length && node.length>0){
					this.saveDepIds(obj);
				}
			}
	    },
	    //查找所在部门
	    findDep(data,id){
        	for(let key in data){
        		if(data[key].id == id){
        			if(data[key].text.indexOf('人力资源部') !=-1 && (this.data.isHr=true)){
        				return true;
			        }
        			this.actions.saveDepIds(data[key]);
        			return true;
		        }
		        let node=data[key].nodes;
		        if( node && node.length && node.length>0){
		        	if(this.actions.findDep(node,id) === true){
		        		break;
			        }
		        }
	        }
	        return false;
	    },

        /**
         * 初始化部门树
         */
        initTree: function () {
            let treeView = new TreeView({data:{treeNodes:this.data.departmentData, options:{
                callback: (order, node) => {
                    this.actions._selectNode(order, node);
                },
                isSearch: true,
                treeType: "MULTI_SELECT",
                treeName: "post-message-depatment-tree",
            },indent:0}});
            let $container = this.el.find(".tree");
            treeView.render($container);
        },
        /**
         * 初始化人员选择组件
         */
        initChoosedUsers: function () {
            this.autoSelect = new AutoSelect({data:{
                displayType: 'static',           // popup或者static popup为弹出的形式 static 为静态显示
                selectBoxHeight: 210,           // select 框的高度
                width: 300,                     // 为0表示显示默认宽度240
                displayChoosed: false,
            },events: {
                onSelect: function (param) {
                    console.log(param);
                }
            }});
            this.autoSelect.render(this.el.find('.users'));
        },
        /**
         * 内部方法，当树选中时触发此方法，根据选中的部门
         * 显示对应部门的人员
         * @param order
         * @param node
         * @param callback
         * @private
         */
        _selectNode: function (order, node, callback) {
            if (order === 'select') {
                this.data.choosedDepart.push(node.id);
            } else {
                _.remove(this.data.choosedDepart, (item) => {
                    return item === node.id;
                })
            }
            this.actions.renderUsers(this);
        },
        /**
         * 将选中的人员渲染到组件内
         */
        renderUsers: _.debounce(function (context) {
            let users = this.actions._getUsers(context);
            this.autoSelect.data.list = users;
            this.autoSelect.data.choosed = users;
            this.autoSelect.reload();
        }, 500),
        _getUsers:function (context) {
            let hash = {};
            let userData = context.data.userData;
            let choosedDepart = context.data.choosedDepart;
            choosedDepart.forEach((deptId) => {
                if (userData[deptId]) {
                    for (let userId in userData[deptId]) {
                        hash[userId] = userData[deptId][userId];
                    }
                }
            });
            let users = [];
            for (let userId in hash) {
                users.push({
                    id: userId,
                    name: hash[userId]['name'],
                    py: hash[userId]['username']
                });
            }
            return users;
        },
        /**
         * 当发送规则改变触发此方法
         * @param value
         */
        onSendTypeChange: function (value) {
            let dom = this.el.find('.prepare-time');
            if (value === '0') {
                dom.css('display', 'flex');
                dom.html(this.actions._getHtml());
            } else {
                this.el.find('.prepare-time').hide();
                this.el.find('.prepare-time').html('');
            }
        },
        _getHtml:function () {
            return `<label class="label-out">预计时间</label>
                    <div class="inputs clearfix">
                        <input type="datetime-local" name="deadline" required="required" formnovalidate="formnovalidate">
                        <p>审批超预计时间是否仍发送：</p>
                        <label class="custom-radio">
                            <input type="radio" name="outTimeSend" value="1" checked>
                            是
                        </label>
                        <label class="custom-radio">
                            <input type="radio" name="outTimeSend" value="0">
                            否
                        </label>
                    </div>`;
        },
        /**
         * 提交数据
         */
        submit: function () {
            let form = this.el.find('form')[0];
            let choosedUsers = this.autoSelect.actions.getValue();
            choosedUsers = choosedUsers.map((item) => {
                return item.id;
            });
            let user=window.config.sysConfig.userInfo;
            if(!user.is_superuser && !this.data.isHr){
            	if(!window.config.send_msg_perm){
		            msgbox.alert('您没有发送权限');
		            return;
	            }
	            for(let id of choosedUsers){
            		if(!(~this.data.depUserIds.indexOf(id))){
            			msgbox.alert('请选择同部门人员');
            			return;
		            }
	            }
            }
            if (form.checkValidity()) {
                let formData = Form.getValue(form);
                if (choosedUsers.length === 0) {
                    this.autoSelect.el.find('input:text')[0].setCustomValidity("发送人员不能为空");
                } else {
                    formData.obj_staff = JSON.stringify(choosedUsers);
                    if (formData.deadline !== undefined) {
                        formData.deadline = moment(new Date(formData.deadline)).format('YYYY-MM-DD hh:mm')
                    }
                    this.showLoading();
                    HTTP.postImmediately('/set_notice/', formData).then((res) => {
                        if (res.success === 1) {
                            postMessageUtil.hide();
                            msgbox.alert('发送成功');
                        } else {
                            msgbox.alert(res.error);
                        }
                        this.hideLoading();
                    });
                }
            }
        }
    },
    afterRender: function () {
        this.actions.getDepartmentData();
    }
})

let postMessageUtil = {
    el: null,
    show: function () {
        this.el = $("<div>").appendTo('body');
        let postMessage = new PostMessage();
        postMessage.render(this.el);
        this.el.erdsDialog({
            width: 950,
            height: 600,
            modal: true,
            title: '消息推送',
            maxable: false,
            defaultMax: false,
            close: function () {
                $(this).erdsDialog('destroy');
                postMessage.destroySelf();
            }
        })
    },
    hide: function () {
        this.el.erdsDialog('close');
    }
};

export {postMessageUtil};
// postMessageUtil.show();
