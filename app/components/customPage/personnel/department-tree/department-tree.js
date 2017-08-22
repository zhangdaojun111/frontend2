/**
 * @author yangxiaochuan
 * 人员信息-部门树
 */

import Component from "../../../../lib/component";
import template from './department-tree.html';
import './department-tree.scss';

let config = {
    template: template,
    data: {
        department_tree: []
    },
    actions: {},
    afterRender: function (){}
}

class departmentTree extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d];
        }
        super(config);
    }
}

export default departmentTree;