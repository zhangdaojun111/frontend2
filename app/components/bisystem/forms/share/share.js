/**
 * Created by birdyy on 2017/8/16.
 * title: chart mix混合组件(包括数据源，选择颜色，选中图标，高级查询)
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './share.html';
import {instanceFitting} from '../fittings/export.fittings';
import './share.scss';
import {ChartFormService} from '../../../../services/bisystem/chart.form.service';
import msgbox from "../../../../lib/msgbox";
import {FormSearchComponent} from '../search/search';
import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data: {
        assortment: '',
        themes:[
            {value:'blue', name:'蓝色'},
            {value: 'green',name: '绿色'},
            {value: 'grayBlue', name:'灰蓝色'}
        ],
        icons: [],
        value: {
            'icon': '',
            'theme': ''
        },
        chart: null
    },
    actions: {},
    binds:[
        {
            event: 'change',
            selector: '.theme input',
            callback: _.debounce(function (context,event) {
                let val = $(context).val();
                this.data.value.theme = val;
            },50)
        },
        {
            event: 'change',
            selector: '.icons input',
            callback: _.debounce(function (context,event) {
                let val = $(context).val();
                this.data.value.icon = val;
            },50)
        },
    ],
    afterRender() {
        if (this.data.chart) {
            this.setValue(this.data.chart);
        }
    },
    firstAfterRender() {
        this.getChartIcon();
    }
};

export class FormShareComponent extends BiBaseComponent {
    constructor(chart) {
        super(config);
        this.data.assortment = chart;
    }

    /**
     * 初始化
     */
    init(){}

    /**
     * 获取图表图标
     */
    async getChartIcon() {
        let res = await ChartFormService.getChartIcon();
        if (res['success'] === 1) {
            this.data.icons = res['data'];
            this.data.icons = res['data'].map(icon => {
                return {value: icon,name:`<img src=/bi/download_icon/?file_id=${icon} />`}
            });
            this.reload();
        } else {
            msgbox.alert(res['error']);
        }
    }

    /**
     * 设置值
     */
    setValue(chart) {
        for (let [index,radio] of this.data.themes.entries()) {
            if (chart['theme'] == radio.value) {
                this.el.find('.theme input').eq(index).attr('checked', 'true');
                break;
            }
        };

        for (let [index,radio] of this.data.icons.entries()) {
            if (chart['icon'] == radio.value) {
                this.el.find('.icons input').eq(index).attr('checked', 'true');
                break;
            }
        };
        this.data.value.theme = chart['theme'];
        this.data.value.icon = chart['icon'];
        this.data.chart = chart
    }

    /**
     * 获取数据
     */
    getValue() {
        return this.data.value;
    }

}