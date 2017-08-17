/**
 * Created by birdyy on 2017/8/14.
 * title: chart组件基础配置
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './base.html';
import './base.scss';
import {instanceFitting} from '../fittings/export.fittings';

let config = {
    template: template,
    data: {},
    actions: {},
    afterRender() {},
    firstAfterRender() {
        this.renderFitting();
    }
};

export class FormBaseComponent extends BiBaseComponent {
    constructor() {
        super(config);
        this.formGroup = null;

    }

    /**
     * 渲染chart fittings
     */
    renderFitting() {
        const chartNameData = {
            value:null,
            label: '请输入图表名称'
        };
        this.formGroup = {
            chartName: instanceFitting({type:'input',data:chartNameData, me: this,container: 'form-chart-base' }),
        }
    }

}