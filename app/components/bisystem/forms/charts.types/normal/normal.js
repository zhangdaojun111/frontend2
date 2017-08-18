/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './normal.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormNormalYComponent} from './yAxis/yAxis';
import {config as advancedDialogConfig} from "./advanced/advanced";
import {FormMixShareComponent} from '../../mix.share/mix.share';
import "./normal.scss";

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
        this.el.on('click','.add',async()=> {
            const res = await PMAPI.openDialogByComponent(advancedDialogConfig,{
                width: 600,
                height: 630,
                title: '高级数据'
            })
        })
    },
    firstAfterRender() {
        // 所有子组件的改变都通过
        Mediator.subscribe('bi:chart:form:update', option => {
            this.MediatorDistribution(option);
        });
        this.el.on('click', '.save-btn', (event) => {
            alert('hello');
            this.save();
        })
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

        // 默认增加第一条y数据
        this.addYAxis();
        this.formGroup = {
            chartName: base,
            share: share,
            x: instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'form-group-x'
            }),
            y: [this.y, this.y1],
            doubleY: instanceFitting({
                type:'checkbox',
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'是否展示双y轴'},
                    ],
                    onChange: this.showY1Axis.bind(this)
                },
                me: this,
                container: 'form-group-doubleY'
            }),
            defaultY: instanceFitting({
                type:'checkbox',
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'默认显示Y轴数据'},
                    ],
                    onChange: this.selectYAxis.bind(this)
                },
                me: this,
                container: 'form-group-defaultY .default-y-tit'
            }),
            ySelectedGroup:instanceFitting({
                type:'checkbox',
                data: {
                    value:null,
                    checkboxs:[],
                    onChange: null
                },
                me: this,
                container: 'form-group-defaultY .default-y-selected'
            }),
            yHorizontal: instanceFitting({
                type:'checkbox',
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'是否横向展示y轴数据'},
                    ],
                    onChange: this.showXAxisVertical.bind(this)
                },
                me: this,
                container: 'form-group-yHorizontal'}),
            yHorizontalColumns: instanceFitting({
                type:'checkbox',
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'是否展示所有x轴数据(x轴45°展示)'},
                    ],
                    onChange: this.showAllXAxis.bind(this)
                },
                me: this,
                container: 'form-group-yHorizontalColumns .x45'
            }),
            xMarginBottom: instanceFitting({
                type:'input',
                data:{
                    value:null,
                    show: false,
                    label: 'x轴下边距(未选择X轴竖向展示时生效)'
                },
                me: this,
                container: 'form-group-yHorizontalColumns .x-margin-bottom'
            }),
            echartX: instanceFitting({
                type:'checkbox',
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'x轴竖向展示'},
                    ],
                    onChange: this.showXAxisVertical.bind(this)
                },
                me: this,
                container: 'form-group-echartX .tit'
            }),
            echartXTextNum: instanceFitting({
                type:'input',
                data: {
                    value:null,
                    label: 'x轴每行字数',
                    show:false,
                },
                me: this,
                container: 'form-group-echartX .echartX-text-num'
            }),
            echartXMarginBottom: instanceFitting({
                type:'input',
                data: {
                    value:null,
                    label: 'x轴下边距',
                    show:false,
                },
                me: this,
                container: 'form-group-echartX .echartX-margin-bottom'
            }),
            chartAssignment: instanceFitting({
                type:'select',
                data: {
                    value:null,
                    label: '选择分组或下拉',
                    options:[
                        {value: 1, name: '分组'},
                        {value: 2, name: '下穿'}
                    ]
                },
                me: this,
                container: 'form-group-chartAssignment'
            }),
            advanced: instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'form-deep-auto'
            }),
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
     * render数据源相关联的字段数据
     * fields x轴列表数据，y轴列表数据
     */
    renderSourceRelationField(fields) {
        if (fields['x_field'] || fields['y_field']) {
            this.renderXField(fields['x_field']);
            this.renderYField(fields['y_field']);
        };
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
     * Mediator subscribe事件分配
     * option {type: '根据类型分配到具体的函数', data: [传过来的值]}
     */
    MediatorDistribution(option) {
        switch(option.type) {
            case 'fields':
                this.renderSourceRelationField(option.data);
                break;
            case 'remove-y':
                this.removeYAxis(option.data);
                break;
            case 'add-y':
                if (option.data.num === 0) {
                    this.addYAxis();
                } else {
                    this.showY1Axis(true);
                };
                break;
            case 'update-y':
                if (this.formGroup.defaultY.data.value) {
                    this.selectYAxis(true)
                };
                break;
        }
    }

    /**
     * 展示所有x轴所有数据(x轴45°展示)
     */
    showAllXAxis(checked) {
        if (checked) {
            this.formGroup.xMarginBottom.data.show = true;
        } else {
            this.formGroup.xMarginBottom.data.show = false;
        }
        this.formGroup.xMarginBottom.reload();
    }

    /**
     * x轴竖向展示（x轴每行字数，x轴下边距）
     */
    showXAxisVertical(checked) {
        if (checked) {
            this.formGroup.echartXTextNum.data.show = true;
            this.formGroup.echartXMarginBottom.data.show = true;
        } else {
            this.formGroup.echartXTextNum.data.show = false;
            this.formGroup.echartXMarginBottom.data.show = false;
        };

        this.formGroup.echartXTextNum.reload();
        this.formGroup.echartXMarginBottom.reload();
    }

    /**
     * 保存数据
     */
    save() {
        const data  = this.formGroup;
        console.log(data);
    }
}