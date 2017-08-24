/**
 * Created by birdyy on 2017/8/14.
 * 饼图配置
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './pie.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {SingleComponent} from './single/single';
import {MultipleComponent} from './multiple/multiple';

import './pie.scss';
let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        // 监听数据源变化
        this.el.on(`${this.data.assortment}-chart-source`,(event,params) => {
            this.chartSourceChange(params['sources']);
        })

        // 保存饼图配置
        this.el.on('click', '.chart-pie .save-btn', (event) => {
            this.saveChart()
        })
    }
}
export class FormPieComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.formGroup={};
    }

    /**
     * 渲染pie fittings
     */

    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent();
        let single = new SingleComponent();
        let multiple = new MultipleComponent();
        this.append(base, this.el.find('.pie-base'));
        this.append(share, this.el.find('.pie-share'));
        this.append(single, this.el.find('.pie-single-columns'));
        this.append(multiple, this.el.find('.pie-multiple-columns'));

        this.formGroup = {
            pieName:base,
            pieShare:share,
            single:single,
            multiple:multiple,
            pieSingle:instanceFitting({
                type:'select',
                me: this,
                container: 'pie-single',
                data:{
                    label:'选择多条数据，单挑数据',
                    options:[
                        {name:'多条', value:'2'},
                        {name:'单条', value:'1'},
                    ],
                    onChange:this.switchSingle.bind(this),
                }
            }),
            pieX:instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'pie-x',
                data: {
                    label:'x轴字段'
                }
            }),
        };
    }


    /**
     * 切换 单条数据/多条数据
     * @param val == 1 单条  val ==2 多条
     */
    switchSingle(val){
        if(val == 1){
            this.formGroup.single.data.singleShow = '';
            this.formGroup.multiple.data.multipleShow = 'form-chart-pie-hide';
        }else{
            this.formGroup.single.data.singleShow = 'form-chart-pie-hide';
            this.formGroup.multiple.data.multipleShow = '';
        }
        this.formGroup.single.reload();
        this.formGroup.multiple.reload();

    }

    /**
     * 数据源变化执行一些列动作
     * @param sources = 数据源数据
     */
    chartSourceChange(sources) {
        if (this.formGroup.pieX) {
            // 加载x轴autoComplete
            if (this.formGroup.pieX.autoSelect) {
                this.formGroup.pieX.autoSelect.data.choosed = [];
                this.formGroup.pieX.autoSelect.data.list = sources['x_field'];
                this.formGroup.pieX.autoSelect.reload();
                // if (this.editModeOnce && this.editChart) {
                //     if (this.editChart.hasOwnProperty('chartName')) {
                //         if (this.editChart['product'].hasOwnProperty('id')) {
                //             this.formGroup.product.setValue(this.editChart['product'])
                //         }
                //     }
                // }
            }
        };
        if (this.formGroup.single) {
            // 加载单条数据y轴数据
            this.formGroup.single.formYAxis.yAxis.data.checkboxs = sources['y_field'];
            this.formGroup.single.formYAxis.yAxis.reload();
        }

    }

    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(flag) {
        this.formGroup = {};
    }

    /**
     * 提交饼图配置到服务器
     */
    async saveChart() {
        // const fields  = this.formGroup;
        // const data = {};
        // Object.keys(fields).map(k => {
        //     if (fields[k].getValue) {
        //         data[k] = fields[k].getValue();
        //     };
        // });
        // const chart = {
        //     assortment: 'radar',
        //     chartName:data.chartName,
        //     countColumn:'',
        //     filter: [],
        //     columns:Array.from(this.columns.data.choosed),
        //     product:data.product,
        //     icon: data.share.icons,
        //     source: data.share.chartSource,
        //     theme: data.share.themes,
        // };
        // let res = await ChartFormService.saveChart(JSON.stringify(chart));
        // if (res['success'] == 1) {
        //     msgbox.alert('保存成功');
        //     if (!chart['chartName']['id']) {
        //         this.reset();
        //         this.reload();
        //     };
        //     Mediator.publish('bi:aside:update',{type: chart['chartName']['id'] ? 'update' :'new', data:res['data']})
        // } else {
        //     msgbox.alert(res['error'])
        // };
    }
}