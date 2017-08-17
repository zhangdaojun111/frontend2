/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './normal.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {FormNormalYComponent} from './yAxis/yAxis';

import {FormMixShareComponent} from '../../mix.share/mix.share';
import "./normal.scss";

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {

        // 当选择数据源时渲染x,y轴字段
        Mediator.subscribe('bi:chart:form:fields', data => {
            this.renderXField(data['x_field']);
            this.renderYField(data['y_field']);
        });

        // 当删除数据源时 清除x,y轴字段
        Mediator.subscribe('bi:chart:form:fields:clear', data => {
            this.clearSourceRelationField();
        });

        // 增加y轴实例
        Mediator.subscribe('bi:chart:normal:addY', (data) => {
            if (data === 0) {
                this.addYAxis();
            } else {
                this.showY1Axis(true);
            }
        });

        // 删除y轴实例
        Mediator.subscribe('bi:chart:normal:removeY', (componentId) => {
            this.removeYAxis(componentId);
        });

        // 默认增加第一条y数据
        this.addYAxis();
    },
    beforeDestory() {}
};

export class FormNormalComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.formGroup = {};
        this.y = [];
        this.y1 = [];
    }

    /**
     * 渲染chart fittings
     */
    renderFitting() {
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent();
        this.append(base, this.el.find('.form-group-base'));
        this.append(share, this.el.find('.form-group-share'));
        const doubleYdata = {
            name: 'doubleY',
            value:null,
            checkboxs:[
                {value:'', name:'是否展示双y轴'},
            ],
            onChange: this.showY1Axis.bind(this)
        };


        this.formGroup = {
            chartName: base,
            share: share,
            x: instanceFitting({type:'autoComplete',me: this,container: 'form-group-x' }),
            y: [this.y, this.y1],
            doubleY: instanceFitting({type:'checkbox', data: doubleYdata,me: this,container: 'form-group-doubleY' })
        };
    }

    /**
     * 渲染x轴字段
     * @param fields x轴字段列表
     */
    renderXField(fields) {
        this.formGroup.x.autoSelect.data.choosed=[];
        this.formGroup.x.autoSelect.data.list = fields;
        this.formGroup.x.autoSelect.reload();
    }

    /**
     * 渲染y轴字段
     * @param fields x轴字段列表
     */
    renderYField(fields) {
        let yGroup = this.y.concat(this.y1);
        yGroup.forEach(y => {
            y.reloadRender(fields);
        })
    }

    /**
     * 当数据源为空时，清空相关联的字段数据
     */
    clearSourceRelationField() {
        this.formGroup.x.autoSelect.data.list = [];
        this.formGroup.x.autoSelect.data.choosed=[];
        this.formGroup.x.autoSelect.reload();
        let yGroup = this.y.concat(this.y1);
        yGroup.forEach(y => {
            y.clearRender();
        })
    }

    /**
     * 增加y轴
     */
    addYAxis() {
        let y = new FormNormalYComponent();
        this.append(y, this.el.find('.form-group-y0'));
        this.y.push(y);
    }

    /**
     * 显示双y轴
     */
    showY1Axis(flag) {
        if (flag) {
            let y = new FormNormalYComponent();
            this.append(y, this.el.find('.form-group-y1'));
            this.y1.push(y);
        } else {
            this.y1.map(y => y.destroySelf());
            this.y1 = [];
        };
    }

    /**
     * 删除y轴
     */
    removeYAxis(componentId) {
        let items = _.remove(this.y, (item) =>{
            return item.componentId == componentId;
        });
    }

    /**
     * 保存数据
     */
    save() {
        const data  = this.data.formGroup;
        return data;
    }
}