/**
 * Created by birdyy on 2017/8/21.
 * xy轴组件
 */

import {BiBaseComponent} from '../../../../bi.base.component';
import {instanceFitting, groupFitting} from '../../../fittings/export.fittings';
import Mediator from '../../../../../../lib/mediator';
import msgbox from "../../../../../../lib/msgbox";
import template from './number.html';

import "./number.scss";

let config = {
    template:template,
    data: {
        columnsShow:false,
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {

    },
    beforeDestory() {}
};

export class NineGridNumberComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }

    /**
     * 渲染4*4格子数 fittings
     */
    renderFitting() {
        this.columnsXY = {
            x1:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称1*',
                    show:true
                },
                me: this,
                container: 'x-columns'
            }),
            x2:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称2*',
                    show:true
                },
                me: this,
                container: 'x-columns'
            }),
            x3:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称3*',
                    show:true
                },
                me: this,
                container: 'x-columns'
            }),
            x4:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称4*',
                    show:this.data.columnsShow,
                },
                me: this,
                container: 'x-columns'
            }),
            y1:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称1*',
                    show:true
                },
                me: this,
                container: 'y-columns'
            }),
            y2:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称2*',
                    show:true
                },
                me: this,
                container: 'y-columns'
            }),
            y3:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称3*',
                    show:true
                },
                me: this,
                container: 'y-columns'
            }),
            y4:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称4*',
                    show:this.data.columnsShow
                },
                me: this,
                container: 'y-columns'
            })
        }
    };


    /**
     * 分别获取到九宫格 所有数据 返回data
     */
    getValue() {
        const data = {
            'xAxis': {},
            'yAxis': {}
        };
        Object.keys(this.columnsXY).map(key => {
            if (key.indexOf('x')!== -1) {
                data['xAxis'][key] = this.columnsXY[key].getValue();
            } else {
                data['yAxis'][key] = this.columnsXY[key].getValue();
            }
        });
        return data;
    }
}