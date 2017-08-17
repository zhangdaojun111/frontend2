/**
 * @author yangxiaochuan
 * 部门信息定制表
 */

import Component from "../../../lib/component";
import template from './department.html';
import './department.scss';

let config = {
    template: template,
    data: {
    },
    actions: {},
    afterRender: function (){
    }
}

class department extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d];
        }
        super(config);
    }
}

export default department;