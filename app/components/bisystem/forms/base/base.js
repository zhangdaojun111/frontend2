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
        this.formGroup = {
            chartName: instanceFitting({
                type:'input',
                data:{
                    show:true,
                    value: null,
                    label: '请输入图标名称'
                },
                me: this,
                container: 'form-chart-base'
            }),
        }
    }

    /**
     * 获取数据
     */
    getValue() {
        return this.formGroup.chartName.data.value;
    }

}