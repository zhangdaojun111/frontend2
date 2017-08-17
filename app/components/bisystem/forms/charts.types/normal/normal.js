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
        });

        // 当删除数据源时 清除x,y轴字段
        Mediator.subscribe('bi:chart:form:fields:clear', data => {
            this.clearSourceRelationField();
        });

        // 增加y轴实例
        Mediator.subscribe('bi:chart:normal:addY', (event) => {
            this.addYAxis();
        });

        // 删除y轴实例
        Mediator.subscribe('bi:chart:normal:removeY', (event) => {
            this.addYAxis();
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
                {checked:false, name:'是否展示双y轴'},
            ]
        };


        this.formGroup = {
            chartName: base,
            share: share,
            x: instanceFitting({type:'autoComplete',me: this,container: 'form-group-x' }),
            y: this.y,
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
     * 当数据源为空时，清空相关联的字段数据
     */
    clearSourceRelationField() {
        this.formGroup.x.autoSelect.data.list = [];
        this.formGroup.x.autoSelect.data.choosed=[];
        this.formGroup.x.autoSelect.reload();
    }

    /**
     * 增加y轴
     */
    addYAxis() {
        let y = new FormNormalYComponent();
        this.append(y, this.el.find('.form-group-y'));
        this.y.push(y);
    }

    /**
     * 删除y轴
     */
    removeYAxis(componentId) {
        // let items = _remove(this.y, (event) =>{
        //
        // })
        // this.y.push(y);
    }

    /**
     * 保存数据
     */
    save() {
        const data  = this.data.formGroup;
        return data;
    }
}