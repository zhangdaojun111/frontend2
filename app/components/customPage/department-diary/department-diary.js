/**
 * @author yangxiaochuan
 * 部门日报
 */
import Component from "../../../lib/component";
import template from './department-diary.html';
import './department-diary.scss';
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import msgBox from '../../../lib/msgbox';
import {HTTP} from "../../../lib/http";
import TreeView from "../../../components/util/tree/tree";
import {AutoSelect} from '../../util/autoSelect/autoSelect';
import dataTableAgGrid from "../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid"
import {dataTableService} from "../../../services/dataGrid/data-table.service";

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

let config = {
    template: template,
    data: {
        tableId: '',
        tableName: '',
        userData: [],
        departmentData: [],
        choosedDepart: [],
        //第一次加载数据不触发
        firstGetData: true,
        tabOpen: true
    },
    actions: {
        /**
         * 获取部门数据，并初始化部门树和人员选择组件
         */
        getDepartmentData: function () {
            HTTP.getImmediately('/get_department_tree/', {type: 'ribao'}).then((res) => {
                this.data.userData = res.data.department2user;
                this.data.departmentData = formatTreeData(res.data.department_tree)
                this.actions.initTree();
                this.actions.initChoosedUsers();
            });
        },
        /**
         * 初始化部门树
         */
        initTree: function () {
            let treeView = new TreeView(this.data.departmentData, {
                callback: (order, node) => {
                    this.actions._selectNode(order, node);
                },
                isSearch: true,
                treeType: "MULTI_SELECT",
                treeName: "post-message-depatment-tree",
            });
            let $container = this.el.find(".tree");
            treeView.render($container);
        },
        /**
         * 初始化人员选择组件
         */
        initChoosedUsers: function () {
            let That = this;
            this.autoSelect = new AutoSelect({
                displayType: 'static',           // popup或者static popup为弹出的形式 static 为静态显示
                selectBoxHeight: '100%',           // select 框的高度
                width: 230,                     // 为0表示显示默认宽度240
                displayChoosed: false,
            }, {
                onSelect: function (param) {
                    That.actions.setDiaryFilter( That,param );
                }
            });
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
            this.autoSelect.data.list = users;
            this.autoSelect.data.choosed = users;
            this.autoSelect.reload();
        }, 500),
        //获取部门提报搜索field
        getDiarySearchField: function (d) {
            console.log( '填写人字段：' + d )
            this.data.searchField = d;
        },
        //设置搜索参数
        setDiaryFilter: _.debounce( (That,users)=>{
            if( That.data.firstGetData ){
                That.data.firstGetData = false;
                return;
            }
            let filter = [];

            for( let u of users ){
                filter.push(u.name)
            }
            let obj = {}
            obj[That.data.searchField] = {'$in':filter}
            That.dataGrid.data.departmentFilter = obj;
            That.dataGrid.actions.getGridData( true );
        },1000 ),
        //开关右侧tab
        calcUserCon: function () {
            this.data.tabOpen = !this.data.tabOpen;
            setTimeout( ()=>{
                this.el.find( '.diary-user' ).eq(0).animate( { 'left':this.data.tabOpen ? '0px' : '-470px' } );
                this.el.find( '.calc-user' )[0].className = this.data.tabOpen ? 'calc-user icon-aggrid-shouhui':'calc-user icon-aggrid-quxiao';
            },this.data.tabOpen ? 0 : 200 )
            setTimeout( ()=>{
                this.el.find( '.diary-grid' )[0].style.width = this.data.tabOpen ? 'calc(100% - 500px)':' calc(100% - 30px)';
            },this.data.tabOpen ? 200 : 0 )
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.calc-user',
            callback: function () {
                this.actions.calcUserCon();
            }
        }
    ],
    afterRender: function (){
        this.showLoading();
        dataTableService.getCustomTableId( {table_key: 'department-daily'} ).then( res=>{
            if( res.success ){
                this.data.tableId = res.table_id;
                let json = {
                    tableId: this.data.tableId,
                    tableName: this.data.tableName,
                    viewMode: 'normal',
                    departmentDiary: true,
                    getDiarySearchField: this.actions.getDiarySearchField
                }
                this.dataGrid = new dataTableAgGrid(json)
                this.append(this.dataGrid, this.el.find('.diary-grid'));
                this.actions.getDepartmentData();
            }else {
                msgBox.alert( '请联系管理员配置定指表tableId。' )
            }
            setTimeout( ()=>{
                this.hideLoading();
            },700 )
        } )
    }
}
class departmentDiary extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default departmentDiary;