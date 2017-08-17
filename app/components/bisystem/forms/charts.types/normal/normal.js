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

        // 当y轴数据更新时, 更新默认显示y轴数据
        Mediator.subscribe('bi:chart:normal:y:update', (data) => {
            if (this.formGroup.defaultY.data.value) {
                this.selectYAxis(true)
            };
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
        this.doubleY = null;
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
            value:null,
            checkboxs:[
                {value:'', name:'是否展示双y轴'},
            ],
            onChange: this.showY1Axis.bind(this)
        };
        const defaultYdata = {
            value:null,
            checkboxs:[
                {value:'', name:'默认显示Y轴数据'},
            ],
            onChange: this.selectYAxis.bind(this)
        };
        const ySelectedGroup = {
            value:null,
            checkboxs:[],
            onChange: null
        };
        const yHorizontalData = {
            value:null,
            checkboxs:[
                {value:'', name:'是否横向展示y轴数据'},
            ],
            onChange: null
        };
        const yHorizontalColumnsData = {
            value:null,
            checkboxs:[
                {value:'', name:'是否展示所有x轴数据(x轴45°展示)'},
            ],
            onChange: null
        };
        const xMarginBottomData = {
            value:null,
            label: 'x轴下边距(未选择X轴竖向展示时生效)'
        };
        const echartXData = {
            value:null,
            checkboxs:[
                {value:'', name:'x轴竖向展示'},
            ],
        };

        const echartXTextNumData = {
            value:null,
            label: 'x轴每行字数'
        };
        const echartXMarginBottom = {
            value:null,
            label: 'x轴下边距'
        };
        this.formGroup = {
            chartName: base,
            share: share,
            x: instanceFitting({type:'autoComplete',me: this,container: 'form-group-x' }),
            y: [this.y, this.y1],
            doubleY: instanceFitting({type:'checkbox', data: doubleYdata,me: this,container: 'form-group-doubleY'}),
            defaultY: instanceFitting({type:'checkbox', data: defaultYdata,me: this,container: 'form-group-defaultY .default-y-tit' }),
            ySelectedGroup:instanceFitting({type:'checkbox', data: ySelectedGroup,me: this,container: 'form-group-defaultY .default-y-selected' }),
            yHorizontal: instanceFitting({type:'checkbox', data: yHorizontalData,me: this,container: 'form-group-yHorizontal'}),
            yHorizontalColumns: instanceFitting({type:'checkbox', data: yHorizontalColumnsData,me: this,container: 'form-group-yHorizontalColumns .x45'}),
            xMarginBottom: instanceFitting({type:'input',data:xMarginBottomData,me: this,container: 'form-group-yHorizontalColumns .x-margin-bottom'}),
            echartX: instanceFitting({type:'checkbox', data: echartXData,me: this,container: 'form-group-echartX .tit'}),
            echartXTextNum: instanceFitting({type:'input', data: echartXTextNumData,me: this,container: 'form-group-echartX .echartX-text-num'}),
            echartXMarginBottom: instanceFitting({type:'input', data: echartXMarginBottom,me: this,container: 'form-group-echartX .echartX-margin-bottom'})
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
        this.formGroup.x.autoSelect.data.choosed = [];
        this.formGroup.x.autoSelect.reload();
        let yGroup = this.y.concat(this.y1);
        yGroup.forEach(y => {
            y.clearRender();
        });
    }

    /**
     * 增加y轴
     */
    addYAxis() {
        let y = new FormNormalYComponent();
        this.append(y, this.el.find('.form-group-y0'));
        if (this.y[0]) {
            if(this.y[0].yAxis.field.autoSelect.data.list) {
                y.yAxis.field.autoSelect.data.list = this.y[0].yAxis.field.autoSelect.data.list;
                y.yAxis.field.autoSelect.reload();
            };
        };
        this.y.push(y);
    }

    /**
     * 显示双y轴
     */
    showY1Axis(flag) {
        if (flag) {
            let y = new FormNormalYComponent();
            this.el.find('.form-group-y1').addClass('group-active');
            this.append(y, this.el.find('.form-group-y1'));
            if(this.y[0].yAxis.field.autoSelect.data.list) {
                y.yAxis.field.autoSelect.data.list = this.y[0].yAxis.field.autoSelect.data.list;
                y.yAxis.field.autoSelect.reload();
            };
            this.y1.push(y);
        } else {
            this.el.find('.form-group-y1').removeClass('group-active');
            this.y1.map(y => y.destroySelf());
            this.y1 = [];
        };
        this.selectYAxis(true);
    }

    /**
     * 删除y轴
     */
    removeYAxis(data) {
        if (data.num === 0) {
            let items = _.remove(this.y, (item) =>{
                return item.componentId == data.componentId;
            });
        } else {
            let items = _.remove(this.y1, (item) =>{
                return item.componentId == data.componentId;
            });
        }

    }

    /**
     * 默认展示Y轴数据
     */
    selectYAxis(flag) {
        if (flag) {
            let checkboxs = [];
            this.y.concat(this.y1).map(y => {
                if(y.data.field) {
                    if (y.data.field[0]) {
                        checkboxs.push(y.data.field[0]);
                    }
                }
            });
            this.formGroup.ySelectedGroup.data.checkboxs = checkboxs;
            this.formGroup.ySelectedGroup.reload();
        } else {
            this.formGroup.ySelectedGroup.data.checkboxs = [];
            this.formGroup.ySelectedGroup.reload();
        };
    }

    /**
     * 保存数据
     */
    save() {
        const data  = this.data.formGroup;
        return data;
    }
}