/**
 * Created by birdyy on 2017/9/18.
 * 数据源高级计算
 */
import Component from '../../../../../../../../lib/component';
import template from './original.advanced.html';
import handlebars from 'handlebars';
import msgbox from '../../../../../../../../lib/msgbox';

let config = {
    template: template,
    actions: {
    },
    data: {

    },
    binds:[
        { //保存
            event:'click',
            selector:'.submit-area submit',
            callback:function () {

            }
        },

        {//返回
            event:'click',
            selector:'.submit-area button:last-child',
            callback:function () {

            }
        },
    ],
    afterRender() {
    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalAdvancedComponent extends Component {
    constructor(data,events) {
        super(config,data,events);
    }
}