/**
 * Created by birdyy on 2017/8/21.
 * xy轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './multiple.html';
import "./multiple.scss";
import {PieDeepComponent} from "./deeps/deep";


let config = {
    template:template,
    data: {
        multipleShow:'',
        xAxis:[],
        yAxis:[],
        choosed: [],
        deeps: [], //饼图下穿数据
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        let me = this;
        this.el.on('click', '.save-new', (event) => {
            this.addDeep(this.multiples.pieDeep.getValue());
            return false;
        });
    },
    beforeDestory() {}
};

export class MultipleComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 多条数据 Y轴数据 fittings
     */
    renderFitting() {
        let deeps = new PieDeepComponent();
        this.append(deeps, this.el.find('.pie-deep-table'));
        this.multiples = {
            deeps: deeps,
            pieY:instanceFitting({
                type:'autoComplete',
                me: this,
                data:{
                    label: 'y轴字段',
                    choosed:[],
                    list: this.data.yAxis,
                },
                container: 'pie-y'
            }),
            pieDeep:instanceFitting({
                type:'autoComplete',
                me: this,
                data: {
                    list: this.data.xAxis,
                    choosed:[],
                    onSelect:this.addDeep.bind(this)
                },
                container: 'pie-deep .pie-deep-auto'
            }),
        }
    };


    /**
     * 增加下穿
     *@param item 下穿数据
     */
    addDeep(item) {
        if (item.hasOwnProperty('id')) {
            this.multiples.deeps.data.deeps.push(item);
            this.multiples.deeps.reload();
            this.multiples.pieDeep.autoSelect.data.choosed = [];
            this.multiples.pieDeep.autoSelect.reload();
        }
    }

    /**
     * 获取下穿和分组数据
     */
    getValue(){
        return {
            yAxis: this.multiples.pieY.getValue(),
            deeps: this.multiples.deeps.data.deeps
        }
    }
}