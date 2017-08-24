/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './nine.grid.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {NineGridNumberComponent} from './number/number';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';
import './nine.grid.scss';

let config = {
    template:template,
    data: {
        assortment: ''
    },
    actions: {},
    afterRender() {
        this.renderFitting();
        this.switchOptions(this.formGroup.nineGridColumn.data.value);
    },
    firstAfterRender() {
        // 监听数据源变化
        this.el.on(`${this.data.assortment}-chart-editMode-source`,(event,params) => {
            if (this.chartId && this.editModeOnce) {
                this.getChartData(this.chartId);
            }
        });
        this.el.on('click', '.chart-nine-grid .save-btn', (event) => {
            this.saveChart();
        })
    }
};

export class FormNineGridComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.formGroup={};
        this.data.assortment = chart.assortment;
        this.chartId = chart.id;
        this.editModeOnce = this.chartId ? true : false
    }

    /**
     * 渲染nine-grid fittings
     */
    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent(this.data.assortment);
        let grid = new NineGridNumberComponent();
        this.append(base, this.el.find('.nine-grid-base'));
        this.append(share, this.el.find('.nine-grid-share'));
        this.append(grid,this.el.find('.nine-grid-column-xy'));

        this.formGroup = {
            nineGridName:base,
            nineGridShare:share,
            grid:grid,
            nineGridColumn:instanceFitting({
                type:'select',
                me: this,
                container: 'nine-grid-column',
                data: {
                    value: '3',
                    options:[
                        {name:'3*3', value:'3'},
                        {name:'4*4', value:'4'}
                    ],
                    onChange: this.switchOptions.bind(this),
                }

            })
        }
    }
    /**
     * 切换3*3 / 4*4 格子数
     * @param val === 3 / val ===4
     *
     */
    switchOptions(val) {
        if(val == 4){
            this.formGroup.grid.data.columnsShow = true;
        }else{
            this.formGroup.grid.data.columnsShow = false;
        }
        this.formGroup.grid.reload();
    }


    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(chart) {
        this.formGroup = {};
        this.chartId = chart ? chart.id : null;
        this.editModeOnce = this.chartId ? true : false
    }

    /**
     * 获取到九宫格 X,Y轴 输入数据
     */
    async saveChart() {
        let dataCur = {
            'xAxis': {},
            'yAxis': {}
        };
        let val = this.formGroup.nineGridColumn.data.value;
        let dataX = this.formGroup.grid.getValue();
        let opt = {};
        if(val == 3){
            opt = this.formGroup.nineGridColumn.data.options[0];
            Object.keys(dataX.xAxis).slice(0,3).map(key=>{
                dataCur.xAxis[key]=dataX.xAxis[key]
            });
            Object.keys(dataX.yAxis).slice(0,3).map(key=>{
                dataCur.yAxis[key]=dataX.yAxis[key]
            });
        }else{
            opt = this.formGroup.nineGridColumn.data.options[1];
            dataCur = dataX;
        }
        const fields  = this.formGroup;
        const data = {};
        Object.keys(fields).map(k => {
            if (fields[k].getValue) {
                data[k] = fields[k].getValue();
            };
        });
        const chart = {
            assortment: 'nineGrid',
            chartName:data.nineGridName,
            countColumn:'',
            filter: [],
            icon: [],
            source: data.nineGridShare.chartSource,
            theme: data.nineGridShare.themes,
            type: opt,
            xAxis:dataCur.xAxis,
            yAxis:dataCur.yAxis,
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
        }
    }


    /**
     * 编辑模式发送chartId, 得到服务器数据
     * @param chartId 图表id
     */
    async getChartData(chartId) {
        if (this.chartId) {
            const chart = await canvasCellService.getCellChart({chart_id: chartId});
            this.fillChart(chart[0])
        }
    }

    /**
     * 编辑模式
     */
    fillChart(chart) {
        this.formGroup.nineGridName.setValue(chart['chartName']);
        let share = {
            chartSource:chart['source'],
            themes: chart['theme'],
            icons: chart['icon'],
            filter: chart['filter']
        };
        this.formGroup.nineGridShare.setValue(share);
        this.formGroup.nineGridColumn.setValue(chart['type']);
        this.formGroup.grid.columnsXY.x1.setValue(chart['xAxis']['x1']);
        this.formGroup.grid.columnsXY.x2.setValue(chart['xAxis']['x2']);
        this.formGroup.grid.columnsXY.x3.setValue(chart['xAxis']['x3']);
        this.formGroup.grid.columnsXY.x4.setValue(chart['xAxis']['x4']);
        this.formGroup.grid.columnsXY.y1.setValue(chart['yAxis']['y1']);
        this.formGroup.grid.columnsXY.y2.setValue(chart['yAxis']['y2']);
        this.formGroup.grid.columnsXY.y3.setValue(chart['yAxis']['y3']);
        this.formGroup.grid.columnsXY.y4.setValue(chart['yAxis']['y4']);
        this.editModeOnce = false;
    }

}