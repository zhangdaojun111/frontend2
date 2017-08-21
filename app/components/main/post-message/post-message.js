import template from './post-message.html';
import './post-message.scss';
import Component from '../../../lib/component';
import msgbox from '../../../lib/msgbox';
import {HTTP} from '../../../lib/http';
import {Form} from '../../../lib/form';
import TreeView from '../../util/tree/tree';
import {AutoSelect} from '../../util/autoSelect/autoSelect';
import moment from 'moment';

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

let config = {
    template: template,
    data: {
        userData: [],
        departmentData: [],
        choosedDepart: []
    },
    actions: {
        getDepartmentData: function () {
            HTTP.getImmediately('/get_department_tree/', {type: ''}).then((res) => {
                this.data.userData = res.data.department2user;
                this.data.departmentData = formatTreeData(res.data.department_tree)
                this.actions.initTree();
                this.actions.initChoosedUsers();
            });
        },
        initTree: function () {
            let treeView = new TreeView(this.data.departmentData, {
                callback: (order, node) => {
                    this.actions._selectNode(order, node);
                },
                isSearch: true,
                treeType: "MULTI_SELECT",
                treeName: "post-message-depatment-tree"
            });
            let $container = this.el.find(".tree");
            treeView.render($container);
        },
        initChoosedUsers: function () {
            this.autoSelect = new AutoSelect({
                displayType: 'static',           // popup或者static popup为弹出的形式 static 为静态显示
                selectBoxHeight: 200,           // select 框的高度
                width: 300,                     // 为0表示显示默认宽度240
                displayChoosed: false,
            }, {
                onSelect: function (param) {
                    console.log(param);
                }
            });
            this.autoSelect.render(this.el.find('.users'));
        },
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
        renderUsers: _.debounce(function (context) {
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
                    name: hash[userId]['name']
                });
            }
            this.autoSelect.data.list = users;
            this.autoSelect.data.choosed = users;
            this.autoSelect.reload();
        }, 500),
        onSendTypeChange: function (value) {
            let dom = this.el.find('.prepare-time');
            if (value === '0') {
                dom.css('display', 'flex');
                dom.html(`
                    <label class="label-out">预计时间</label>
                    <div class="inputs">
                        <input type="datetime-local" name="deadline" required="required" formnovalidate="formnovalidate">
                        审批超预计时间是否仍发送：
                        <label>
                            <input type="radio" name="outTimeSend" value="1" checked>
                            是
                        </label>
                        <label>
                            <input type="radio" name="outTimeSend" value="0">
                            否
                        </label>
                    </div>
                `);
            } else {
                this.el.find('.prepare-time').hide();
                this.el.find('.prepare-time').html('');
            }
        },
        submit: function () {
            let form = this.el.find('form')[0];
            let choosedUsers = this.autoSelect.actions.getValue();
            choosedUsers = choosedUsers.map((item) => {
                return item.id;
            })
            if (form.checkValidity()) {
                let formData = Form.getValue(form);
                if (choosedUsers.length === 0) {
                    this.autoSelect.el.find('input:text')[0].setCustomValidity("发送人员不能为空");
                } else {
                    formData.obj_staff = JSON.stringify(choosedUsers);
                    if (formData.deadline !== undefined) {
                        formData.deadline = moment(new Date(formData.deadline)).format('YYYY-MM-DD hh:mm')
                    }
                    HTTP.postImmediately('/set_notice/', formData).then((res) => {
                        if (res.success === 1) {
                            postMessageUtil.hide();
                            msgbox.showTips('发送成功');
                        } else {
                            msgbox.alert(res.error);
                        }
                    });
                }
            }
        }
    },
    afterRender: function () {
        this.actions.getDepartmentData();
        let that = this;
        this.el.on('change', 'input[name=sendType]', function () {
            that.actions.onSendTypeChange($(this).val());
        }).on('click', '.submit', () => {
            this.actions.submit();
        });
    },
    firstAfterRender: function () {

    },
    beforeDestory: function () {

    }
}

class PostMessage extends Component {

    constructor(data) {
        super(config, data);
    }

}

let postMessageUtil = {
    el: null,
    show: function () {
        this.el = $("<div>").appendTo('body');
        let postMessage = new PostMessage();
        postMessage.render(this.el);
        this.el.dialog({
            width: 1200,
            height: 800,
            modal: true,
            title: '消息推送',
            close: function () {
                $(this).dialog('destroy');
                postMessage.destroySelf();
            }
        })
    },
    hide: function () {
        this.el.dialog('close');
    }
}

export {postMessageUtil};
// postMessageUtil.show();
