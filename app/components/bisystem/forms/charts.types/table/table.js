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


let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        this.el.on('click', '.save-btn', (event) => {
            // this.saveChart();
        })
    },
    beforeDestory() {}
};

export class FormTableComponent extends BiBaseComponent{
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

        this.formGroup = {
            chartName: base,
            share: share,
            columns: instanceFitting({
                type:'checkbox',
                data: {
                    value:null,
                    checkboxs:[
                        {
                            dfield: "f1",
                            id: "8898_n3g8bsq7iNmxF6ejffiNdg",
                            name: "创建时间",
                            type: "5"
                        },
                        {
                            dfield: "f2",
                            id: "2420_Q3yziPZKn5hgewUkPGCEFL",
                            name: "更新时间",
                            type: "5"
                        }
                    ],
                    onChange: null
                },
                me: this,
                container: 'form-group-columns .table-columns'
            }),
            sort:instanceFitting({
                type:'radio',
                data: {
                    value:null,
                    radios:[
                        {value:'0', name:'升序'},
                        {value: '1',name: '降序'}
                    ],
                    onChange: null
                },
                me: this,
                container: 'form-group-sort-columns .table-sort-columns'
            }),
            sortColumn:instanceFitting({
                type:'autoComplete',
                data: {
                    value:null,
                },
                me: this,
                container: 'form-group-sort-columns .table-sort-columns'
            }),
            align:instanceFitting({
                type:'select',
                data: {
                    value:1,
                    label: '表格文字居中对齐',
                    options:[
                        {value: 'left', name: '居左'},
                        {value: 'center', name: '居中'},
                        {value: 'right', name: '居右'}
                    ],
                    onChange: null,
                },
                me: this,
                container: 'form-group-align'
            })
        };

    }

    reset() {

    }
}