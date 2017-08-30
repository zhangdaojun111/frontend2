/**
 *@author chenli
 *@description 隐藏框控件
 */
import Component from '../../../lib/component';
import template from './hidden-control.html'

let config = {
    template: template,
    data: {},
    actions: {},
}

class HiddenControl extends Component {
    constructor(data) {
        super(config, data);
    }
}

export default HiddenControl