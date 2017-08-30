/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './comment.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {canvasCellService} from '../../../../../services/bisystem/canvas.cell.service';

import '../../../../../assets/scss/bisystem/charts.types.scss';
import "./comment.scss";

let config = {
    template:template,
    data: {
        columns:{},
        assortment:''
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        //监听数据源变化
        this.el.on(`${this.data.assortment}-chart-source`,(event,params) => {
            this.chartSourceChange(params['sources']['rich_field'])
        });
        //编辑模式
        this.el.on(`${this.data.assortment}-chart-editMode-source`,(event,params) => {
            if (this.chartId && this.editModeOnce) {
                this.getChartData(this.chartId);
            }
        });
        //保存数据
        this.el.on('click', '.chart-comment .save-btn', (event) => {
            this.saveChart();
        });
    }
};

export class FormCommentComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.formGroup={};
        this.data.assortment = chart.assortment;
        this.chartId = chart.id;
        this.editModeOnce = this.chartId ? true : false
        this.editChart = null;
        console.log(this.editModeOnce);
    }

    /**
     * 渲染comment fittings
     */
    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent(this.data.assortment);
        this.append(base, this.el.find('.comment-base'));
        this.append(share, this.el.find('.comment-share'));

        this.formGroup = {
            commentName:base,
            commentShare:share,
            items: instanceFitting({
                type:'radio',
                me: this,
                data:{
                    // value:null,
                    // name:'test',
                    // radios:[
                    //     {value:'1',name:'tag1'},
                    // ]
                },
                container: 'comment-column .comment-column-item' }),
        }
    }

    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(chart) {
        this.formGroup = {};
        this.chartId = chart ? chart.id : null;
        this.editModeOnce = this.chartId ? true : false;
        this.editChart = null;
    }

    /**
     * 保存数据
     */
    async saveChart() {
        const fields  = this.formGroup;
        const data = {};
        Object.keys(fields).map(k => {
            if (fields[k].getValue) {
                data[k] = fields[k].getValue();
            };
        });
        const chart = {
            assortment: 'comment',
            chartName:data.commentName,
            columns: JSON.parse(data.items),
            filter: [],
            icon: data.commentShare.icons,
            source: data.commentShare.chartSource,
            theme: data.commentShare.themes,

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
     * 编辑模式
     */
    fillChart(chart) {
        this.editChart = chart;
        this.formGroup.commentName.setValue(chart['chartName']);
        let share = {
            chartSource: chart['source'],
            themes: chart['theme'],
            icons: chart['icon'],
            filter: chart['filter']
        };
        this.formGroup.commentShare.setValue(share);
    }

    /**
     * 数据源变化执行一些列动作
     * @param sources = 数据源数据
     */
    chartSourceChange(sources){
        if(sources){
            const data = {
            name:'test',
            value:'null',
            radios:[],
            };
            sources.forEach((val,index)=>{
                data.radios[index] = {value:JSON.stringify(val),name:val.name}
            });
            this.formGroup.items.data = data;
            this.formGroup.items.reload();
            if(this.editChart && this.editModeOnce) {
                this.formGroup.items.setValue(JSON.stringify(this.editChart['columns']));
                this.editModeOnce = false;
            }
        }
    }
}