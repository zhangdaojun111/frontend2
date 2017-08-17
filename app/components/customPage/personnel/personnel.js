/**
 * @author yangxiaochuan
 * 人员信息定制表
 */

import Component from "../../../lib/component";
import template from './personnel.html';
import './personnel.scss';

let config = {
    template: template,
    data: {
    },
    actions: {},
    afterRender: function (){
    }
}

class personnel extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d];
        }
        super(config);
    }
}

export default personnel;