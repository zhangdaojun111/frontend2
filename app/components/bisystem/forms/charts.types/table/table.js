/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './table.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {FormMixShareComponent} from '../../mix.share/mix.share';
import "./table.scss";
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';
import {FormColumnComponent} from './columns/column';
import {FormSingleComponent} from './single/single';

let config = {
    template:template,
    data: {
        assortment: ''
    },
    actions: {},
    afterRender() {
        this.init();
        this.renderFitting();
    },
    firstAfterRender() {
        let me = this;

        // 监听数据源变化
        this.el.on(`${this.data.assortment}-chart-source`,(event,params) => {
            this.chartSourceChange(params['sources'])
        }).on('form:table:column:choosed',(event,params) => { // 监听选中字段
            this.single.setColumns(params['choosed'])
        });

        this.el.on('click', '.save-btn', (event) => {
            // this.saveChart();
        });

        this.el.on('change', '.single-checkbox input', function(event){
            let checked = $(this).is(':checked');
            me.singleConfig(checked);
        })
    },
    beforeDestory() {}
};

export class FormTableComponent extends BiBaseComponent{
    constructor(chart) {
        super(config);
        this.data.assortment = chart.assortment
        this.formGroup = {};
    }

    /**
     * 初始化操作
     */
    init() {
        this.columns = new FormColumnComponent();
        this.single = new FormSingleComponent();
        this.append(this.columns, this.el.find('.table-columns'));
        this.append(this.single, this.el.find('.form-group-single-columns'));
    }

    /**
     * 渲染chart fittings
     */
    renderFitting() {
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent(this.data.assortment);
        this.append(base, this.el.find('.form-group-base'));
        this.append(share, this.el.find('.form-group-share'));

        this.formGroup = {
            chartName: base,
            share: share,
            sortColumn:instanceFitting({
                type:'autoComplete',
                data: {
                    value:null,
                },
                me: this,
                container: 'form-group-sort-columns .table-sort-columns'
            }),
        };

    }

    /**
     * 单行配置
     */
    singleConfig(checked) {
        if (checked) {
            this.el.find('.form-group-show-columns').hide();
        } else {
            this.el.find('.form-group-show-columns').show();
        }
        this.single.data.show = checked;
        this.single.reload();
    }

    /**
     * 数据源变化执行一些列动作
     * @param sources = 数据源数据
     */
    chartSourceChange(sources) {
        this.columns.reloadUi(sources);
        if (this.formGroup.sortColumn) {
            if (this.formGroup.sortColumn.autoSelect) {
                this.formGroup.sortColumn.autoSelect.data.list = sources['x_field'];
                this.formGroup.sortColumn.autoSelect.reload();
            }
        }
    }

    reset() {
    }
}