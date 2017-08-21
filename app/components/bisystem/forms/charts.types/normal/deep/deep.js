/**
 * Created by birdyy on 2017/8/17.
 * y轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './deep.html';
import "./deep.scss";

let config = {
    template:template,
    data: {
        show: false,
        deeps: [],
        xAxis: [],
        deepShow:false
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },

    firstAfterRender() {
        let me = this;
        this.el.on('click', '.save-btn', (event) => {
            this.addDeep(this.x.getValue());
        });
        this.el.on('click', '.del-deep-btn',function(event){
            let index = $(this).closest('tr').index();
            me.removeDeep(index);
        })
    },
    beforeDestory() {}
};

export class FormNormalDeepComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }
    /**
     * 渲染y轴 fittings
     */
    renderFitting() {
        this.x = instanceFitting({
            type:'autoComplete',
            data: {
                list: this.data.xAxis,
                onSelect: null,
            },
            me: this,
            container: 'form-deep-xAxis'
        })
    }

    /**
     * 渲染下穿和分组x轴数据
     */
    reloadXaxis(fields){
        this.data.xAxis = fields;
        this.data.deeps = [];
        this.reload();
    }

    /**
     * 增加下穿
     *@param item 下穿数据
     */
    addDeep(item) {
        console.log(item);
        if (item) {
            this.data.deeps.push(item);
            this.reload();
        }
    }

    /**
     * 删除下穿
     *@param index 通过具体的索引删除具体的下穿
     */
    removeDeep(index) {
        this.data.deeps.splice(index,1);
        this.reload();
    }

    /**
     * 获取下穿和分组数据
     */
    getValue(){
        console.log(this.x)
        return {
            deeps: this.data.deeps,
            group: this.x.getValue()
        }
    }
}