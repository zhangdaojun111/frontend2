/**
 * Created by zj on 2017/11/1.
 */
import Component from '../../../../lib/component';
import template from './followerDialog.html';
import './followerDialog.scss';

let config = {
    template: template,
    data: {
    },
    actions: {
        
    },
    afterRender: function () {

    }
};

class FollowerDialog extends Component {
    constructor(data, newconfig = {}) {
        config.data = data;
        super($.extend(true ,{}, config, newconfig));
    }
}
export default FollowerDialog;