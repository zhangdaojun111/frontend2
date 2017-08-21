/**
 * Created by birdyy on 2017/8/21.
 * xy轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './single.html';
import "./single.scss";

let config = {
    template:template,
    data: {
        singleShow:'form-chart-pie-hide',
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {

    },
    beforeDestory() {}
};

export class SingleComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 单条数据 Y轴数据 fittings
     */
    renderFitting() {
        this.singles = {
            singleY:instanceFitting({
                type:'checkbox',
                me: this,
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'是否为管理员'},
                    ],
                },
                container: 'single-columns'
            }),
            singleM:instanceFitting({
                type:'checkbox',
                me: this,
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'交通补贴'},
                    ],
                },
                container: 'single-columns'
            }),
        }
    };
}