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
import {FormNormalDeepComponent} from './deep/deep';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

import '../../../../../assets/scss/bisystem/charts.types.scss';
import "./normal.scss";

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
        // 所有子组件的改变都通过
        Mediator.subscribe('bi:chart:form:update', option => {
            this.MediatorDistribution(option);
        });
    },
    firstAfterRender() {
        this.el.on('click', '.save-normal-btn', (event) => {
            this.saveChart();
            return false;
        });
        this.el.on('click','.add',async()=> {
            const res = await PMAPI.openDialogByComponent(advancedDialogConfig,{
                width: 600,
                height: 630,
                title: '高级数据'
            });
        });
    },
    beforeDestory() {}
};

export class FormNormalComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.formGroup = {};
        this.chartId = chart.id;
        this.y = [];
        this.y1 = [];
        this.editModeOnce = this.chartId ? true : false // 如果是编辑模式 需要在第一次加载进来重置某些字段的默认值
        this.editModeXField = null;// 编辑模式 需要等到x轴数据加载完成在设置
        this.editModeYField = []; // 编辑模式 需要等到y轴数据加载完成在设置
        this.editModeY1Field = [] // 编辑模式 需要等到y轴数据加载完成在设置
        this.editModeDeeps = { // 同上
            deeps:[],
            group:{}
        };
    }
    /**
     * 编辑模式发送chartId, 得到服务器数据
     * @param chartId 图表id
     */
    async getChartData(chartId) {
        if (this.chartId) {
            const chart = await canvasCellService.getCellChart({chart_id: chartId});
            this.fillChart(chart['data'][0])
        }
    }
    /**
     * 编辑时渲染图表
     * @param 图表数据
     */
    fillChart(chart) {
        console.log(chart);
        this.formGroup.base.setValue(chart['chartName']);
        let share = {
            chartSource:chart['source'],
            themes: chart['theme'],
            icons: chart['icon'],
            filter: chart['filter']
        };
        this.formGroup.share.setValue(share);
        this.editModeXField = chart['xAxis'];
        chart['yAxis'].forEach((y,index) => {
            if (y.yAxisIndex == 0) {
                this.addYAxis();
                this.editModeYField.push(y);
            } else {
                this.showY1Axis(true);
                this.editModeY1Field.push(y);
            }
        });
        this.formGroup.doubleY.setValue(chart['double'] == 0 ? false : true);
        this.formGroup.defaultY.setValue(chart['ySelectedGroup'] ? true : false);
        this.formGroup.yHorizontal.setValue(chart['yHorizontal'] ? true : false);
        this.formGroup.yHorizontalColumns.setValue(chart['yHorizontalColumns'].hasOwnProperty('marginBottom') ? true : false);
        this.formGroup.xMarginBottom.setValue(chart['yHorizontalColumns'].hasOwnProperty('marginBottom') ? chart['yHorizontalColumns']['marginBottom'] : 0);
        this.formGroup.echartX.setValue(chart['echartX'].hasOwnProperty('marginBottom') ? true : false);
        this.formGroup.echartXTextNum.setValue(chart['echartX'].hasOwnProperty('textNum') ? chart['echartX']['textNum'] : 0);
        this.formGroup.echartXMarginBottom.setValue(chart['echartX'].hasOwnProperty('marginBottom') ? chart['echartX']['marginBottom'] : 0);
        this.formGroup.chartAssignment.setValue(chart['chartAssignment'].val);
        this.formGroup.ySelectedGroup.setValue(chart['ySelectedGroup']);
        this.editModeDeeps = {
            deeps: chart['deeps'],
            group: chart['chartGroup']
        };
    }


    /**
     * 渲染chart fittings
     */
    renderFitting() {
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent();
        let deeps = new FormNormalDeepComponent()
        this.append(base, this.el.find('.form-group-base'));
        this.append(share, this.el.find('.form-group-share'));
        this.append(deeps, this.el.find('.chart-form-deep'));

        this.formGroup = {
            chartName: base,
            share: share,
            base: base,
            deeps: deeps,
            x: instanceFitting({
                type:'autoComplete',
                me: this,
                data: {
                    label: '请选择x轴字段',
                },
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
                    onChange: this.checkShowY1Axis.bind(this)
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
                    items: [],
                    checkedItems: [],
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
                    onChange: this.showyHorizontal.bind(this)
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
                    label: 'x轴下边距(未选择X轴竖向展示时生效)',
                    onChange: null
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
                    value:1,
                    label: '选择分组或下拉',
                    options:[
                        {value: 1, name: '分组'},
                        {value: 2, name: '下穿'},
                    ],
                    onChange: this.switchGroupandDeep.bind(this),
                },
                me: this,
                container: 'form-group-chartAssignment'
            })
        };
        // 如果不是编辑模式，默认增加第一条y数据
        if (!this.chartId) {
            this.addYAxis();
        };

    }

    /**
     * 渲染x轴字段
     * @param fields x轴字段列表
     */
    renderXField(fields = []) {
        if (this.formGroup.deeps) {
            this.formGroup.deeps.reloadXaxis(fields);
            if (fields.length > 0 && this.editModeOnce) {
                this.formGroup.deeps.setValue(this.editModeDeeps);
            }
        };

        if (this.formGroup.x) {
            this.formGroup.x.autoSelect.data.choosed = [];
            this.formGroup.x.autoSelect.data.list = fields;

            if (fields.length > 0 && this.editModeOnce) {
                this.formGroup.x.autoSelect.data.choosed[0] = this.editModeXField;
            }
            this.formGroup.x.autoSelect.reload()
        };
    }

    /**
     * 渲染y轴字段
     * @param fields y轴字段列表
     */
    renderYField(fields = []) {
        let yGroup = this.y.concat(this.y1);
        yGroup.forEach(y => {
            y.reloadRender(fields);
        });
        if (fields.length > 0 && this.editModeOnce) {
            let a = this.editModeYField.concat(this.editModeY1Field);
            let yEditOnceGroup = this.editModeYField.concat(this.editModeY1Field);
            yGroup.map((y,index) => {
                y.setValue(yEditOnceGroup[index]);
            })
            this.editModeOnce = false;
        }
    }

    /**
     * render数据源相关联的字段数据
     * fields x轴列表数据，y轴列表数据
     */
    renderSourceRelationField(fields) {
        this.renderXField(fields['x_field']);
        this.renderYField(fields['y_field']);
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
     * 勾选是否展示双y轴时
     */
    checkShowY1Axis(checked) {
        if (!this.editModeOnce) {
            this.showY1Axis(checked);
        }
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
        };
        this.selectYAxis(true);

    }

    /**
     * 默认展示Y轴数据
     */
    selectYAxis(flag) {
        if (this.formGroup.defaultY.getValue()) {
            let checkboxs = [];
            let items = [];
            this.y.concat(this.y1).map(y => {
                if (y.data.field) {
                    items.push(y.data.field);
                    checkboxs.push(y.data.field['field'])
                }
            });
            this.formGroup.ySelectedGroup.data['items'] = items;
            this.formGroup.ySelectedGroup.data['checkboxs'] = checkboxs;
            this.formGroup.ySelectedGroup.reload();
        } else {
            this.formGroup.ySelectedGroup.data['checkboxs'] = [];
            this.formGroup.ySelectedGroup.data['items'] = [];
            this.formGroup.ySelectedGroup.data['checkItems'] = [];
            this.formGroup.ySelectedGroup.reload();
        }
    }

    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(chart) {
        this.formGroup = {};
        this.y = [];
        this.y1 = [];
        this.chartId = chart ? chart.id : null;
        this.editModeOnce = this.chartId ? true : false;
        this.editModeXField = null;
        [this.editModeYField,this.editModeY1Field] = [[], []];
        this.editModeDeeps = {
            deeps:[],
            group:{}
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
            case 'source_icon_load_finish':
                this.getChartData(this.chartId);
                break;
        }
    }

    /**
     * 展示所有x轴所有数据(x轴45°展示)
     */
    showAllXAxis(checked) {
        if (this.formGroup.yHorizontalColumns.getValue()) {
            this.formGroup.xMarginBottom.data.show = true;
        } else {
            this.formGroup.xMarginBottom.data.show = false;
        }
        this.formGroup.xMarginBottom.reload();
    }

    /**
     * 横向展示数据
     * @param checked 通过checkbox判断是否选中
     */
    showyHorizontal(checked) {
        if (this.formGroup.yHorizontal.getValue()) {
            this.formGroup.echartX.data.checked = false;
            this.formGroup.echartXTextNum.data.show = false;
            this.formGroup.echartXMarginBottom.data.show = false;
        };
        this.formGroup.echartXTextNum.reload();
        this.formGroup.echartXMarginBottom.reload();
        this.formGroup.echartX.reload();
    }

    /**
     * 切换分组和下穿
     * @param val 通过val判断是下穿还是分组 val === 1 分组， val === 2 下穿
     */
    switchGroupandDeep(val) {
        if (val == 1) {
            this.formGroup.deeps.data.deepShow = false;
            this.formGroup.deeps.data.deeps =[];
            this.changeContext(val);
        } else {
            this.formGroup.deeps.data.deepShow = true;
            this.changeContext(val);
        };
        this.formGroup.deeps.reload();
    }

    /**
     * x轴竖向展示（x轴每行字数，x轴下边距）
     * @param checked 通过checkbox判断是否选中
     */
    showXAxisVertical(checked) {
        if (checked) {
            this.formGroup.yHorizontal.data.checked = false;
            this.formGroup.echartXTextNum.data.show = true;
            this.formGroup.echartXMarginBottom.data.show = true;
        } else {
            this.formGroup.echartXTextNum.data.show = false;
            this.formGroup.echartXMarginBottom.data.show = false;
        };
        this.formGroup.yHorizontal.reload();
        this.formGroup.echartXTextNum.reload();
        this.formGroup.echartXMarginBottom.reload();
    }

    /**
     * 保存数据
     */
    async saveChart() {
        const fields  = this.formGroup;
        // const data = {
        //         advancedDataTemplates: [],
        //         assortment: 'normal',
        //         chartAssignment: {name:'下穿', val:2},
        //         chartName:{id:'',name:'hello'},
        //         countColumn: {},
        //         deeps:[],
        //         double:0,
        //         echartX: {
        //             marginBottom:30,
        //             textNum:3
        //         },
        //         filter:[],
        //         icon:'598c2cfb1ec7e720e489866b',
        //         relations: [],
        //         source: {
        //             id: '9478_gXNiKqBeGd9fnTHo7rqyzP',
        //             name: '部门信息',
        //             count_fields: [],
        //         },
        //         theme: 'blue',
        //         xAxis: {
        //             dfield: 'f1',
        //             id: '8898_n3g8bsq7iNmxF6ejffiNdg',
        //             name: '创建时间',
        //             type:"5"
        //         },
        //         yAxis: [
        //             {
        //                 field: {
        //                     dfield: "f6",
        //                     id: "4972_f92J3NUuQYqEoVfzJmJDYg",
        //                     name: "是否为管理员",
        //                     type: "11"
        //                 },
        //                 type: {
        //                     name:'折线图',
        //                     type: 'line',
        //                     yAxisIndex:0
        //                 }
        //             }
        //         ],
        //         yHorizontal: false,
        //         yHorizontalColumns: {
        //             marginBottom:0
        //         },
        //         ySelectedGroup: []
        //
        // }
        const data = {};
        Object.keys(fields).map(k => {
            if (fields[k].getValue) {
                data[k] = fields[k].getValue();
            };
        });
        const yAxis = [];
        // 设置y轴yAxisIndex
        this.y.map(y => {
            y.data.field['yAxisIndex'] = 0;
            yAxis.push(y.data.field);
        });
        this.y1.map(y => {
            y.data.field['yAxisIndex'] = 1;
            yAxis.push(y.data.field);
        });

        const chart = {
            advancedDataTemplates: [],
            assortment: 'normal',
            chartAssignment: data.chartAssignment == 1 ? {name:'分组', val:1} : {name:'下穿', val:2},
            chartName:data.base,
            countColumn: {},
            double: data.doubleY ? 1 : 0,
            echartX: data.echartX ? {marginBottom: data.echartXMarginBottom, textNum:data.echartXTextNum}: {},
            filter: [],
            icon: data.share.icons,
            relations: [],
            source: data.share.chartSource,
            theme: data.share.themes,
            xAxis: data.x,
            yAxis: yAxis,
            yHorizontal: data.yHorizontal,
            yHorizontalColumns: data.yHorizontalColumns ? {marginBottom:data.xMarginBottom} : {},
            ySelectedGroup: data.ySelectedGroup
        };
        if (data.chartAssignment == 1) {
            chart['chartGroup'] = data.deeps.group
        } else {
            chart['deeps'] = data.deeps.deeps
        };
        let res = await ChartFormService.saveChart(JSON.stringify(chart));
        if (res['success'] == 1) {
            msgbox.alert('保存成功');
            if (!chart['chartName']['id']) {
                this.reset();
                this.reload();
            };

            Mediator.publish('bi:aside:update',{type: chart['chartName']['id'] ? 'update' :'new', data:res['data']})
        } else {
            msgbox.alert(res['error'])
        };
    }

    /**
     * 改变label的显示 下拉,分组
     */
    changeContext(val){
        if(val==2){
            this.el.find('.chart-form-deep').addClass('after-content');
        }else{
            this.el.find('.chart-form-deep').removeClass('after-content');
        }

    }
}