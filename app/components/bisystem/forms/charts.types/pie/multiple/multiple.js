/**
 * Created by birdyy on 2017/8/21.
 * xy轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './multiple.html';
import "./multiple.scss";

let config = {
    template:template,
    data: {
        multipleShow:'',
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {

    },
    beforeDestory() {}
};

export class MultipleComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 多条数据 Y轴数据 fittings
     */
    renderFitting() {
        this.multiples = {
            pieY:instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'pie-y'
            }),
            pieDeep:instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'pie-deep .pie-deep-auto'
            }),
        }
    };
}