/**
 * Created by birdyy on 2017/9/18.
 * 数据源高级计算
 */
import Component from '../../../../../../../../lib/component';
import template from './original.advanced.html';
import './original.data.scss';
import handlebars from 'handlebars';
import msgbox from '../../../../../../../../lib/msgbox';


let config = {
    template: template,
    actions: {
    },
    data: {

    },
    binds:[
    ],
    afterRender() {
    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalAdvancedComponent extends Component {
    constructor(data,events) {
        super(config,originalData,events);
    }
}