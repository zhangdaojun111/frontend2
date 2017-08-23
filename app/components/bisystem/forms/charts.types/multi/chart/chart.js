/**
 * Created by birdyy on 2017/8/21.
 * xy轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import {FormSearchComponent} from '../../../search/search';
import template from './chart.html';
import "./chart.scss";

let config = {
    template:template,
    data: {

    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        this.el.on('click','.multi-close',()=>{
            this.multiDel();
        })
    },
    beforeDestory() {}
};

export class MultiChartComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 添加图标 配置 fittings
     */
    renderFitting() {
        let multiSearch = new FormSearchComponent();
        this.append(multiSearch, this.el.find('.item-senior'));

        this.multiChart = {
            multiShare:multiSearch,
            multiSource: instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'item-source'
            }),
            multiType: instanceFitting({
                type:'select',
                data: {
                    value:1,
                    label: '图表类型',
                    options:[
                        {value: 1, name: '折线图'},
                        {value: 2, name: '柱状图'}
                    ],

                },
                me: this,
                container: 'item-type'
            }),
            multiX: instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'item-x'
            }),
            multiY: instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'item-filed .item-y'
            }),
            multiCheckbox: instanceFitting({
                type:'checkbox',
                me: this,
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'剩余年假'},
                    ],

                },
                container: 'item-filed .item-y'
            }),
        }
    };

    /**
     * 删除一张图表
     */
    multiDel(){
        this.destroySelf();
    }


}