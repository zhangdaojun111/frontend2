/**
 * Created by birdyy on 2017/8/17.
 * y轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './yAxis.html';
import "./yAxis.scss";

let config = {
    template:template,
    data: {
        field:null
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },

    firstAfterRender() {
        let me = this;
        this.el.on('click', '.remove-y-btn', function(event) {
            let yItems = $(me.el).siblings('div');
            let y = $(this).closest('.form-group-y').attr('class');
            let num = y.indexOf('form-group-y0') !== -1 ? 0 : 1;
            if (yItems.length > 0) {
                Mediator.publish('bi:chart:normal:removeY', {num: num, componentId: me.componentId});
                me.destroySelf();
            };
            return false;
        }).on('click', '.add-y-btn', function(event) {
            let y = $(this).closest('.form-group-y').attr('class');
            let data = y.indexOf('form-group-y0') !== -1 ? 0 : 1;
            Mediator.publish('bi:chart:normal:addY', data);
            return false;
        })

    },
    beforeDestory() {}
};

export class FormNormalYComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.yAxis = null
    }

    /**
     * 渲染y轴 fittings
     */
    renderFitting() {
        const groupYFitting = [
            {name: 'field', option: {type: 'autoComplete', me: this, container: 'y-item'}},
            {name: 'type', option: {type: 'select', me: this, container: 'y-item'}}
        ];
        this.yAxis = groupFitting(groupYFitting);
        this.yAxis.field.autoSelect.data.onSelect = this.getValue.bind(this);
    }

    /**
     * 当数据源改变时，重新渲染y轴
     */
    reloadRender(data) {
        Object.keys(this.yAxis).map(key => {
            if (key === 'field') {
                this.yAxis[key].autoSelect.data.list = data;
                this.yAxis[key].autoSelect.reload();
            }
        })
    }

    /**
     * 当数据源为空时，清空y轴数据
     */
    clearRender() {
        Object.keys(this.yAxis).map(key => {
            if (key === 'field') {
                this.yAxis[key].autoSelect.data.list = [];
                this.yAxis[key].autoSelect.data.choosed = [];
                this.yAxis[key].autoSelect.reload();
            }
        })
    }

    /**
     * 获取y轴的数据
     */
    getValue(data) {
        this.data.field = data;
        Mediator.publish('bi:chart:normal:y:update', this.data);
    }
}