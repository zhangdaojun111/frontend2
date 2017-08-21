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
        columnsShow:false
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
             columnsXL:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称1*',
                    show:true
                },
                me: this,
                container: 'x-columns'
            }),
            columnsXC:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称2*',
                    show:true
                },
                me: this,
                container: 'x-columns'
            }),
            columnsXR:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称3*',
                    show:true
                },
                me: this,
                container: 'x-columns'
            }),
            columnsXD:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称4*',
                    show:this.data.columnsShow,
                },
                me: this,
                container: 'x-columns'
            }),
            columnsYL:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称1*',
                    show:true
                },
                me: this,
                container: 'y-columns'
            }),
            columnsYC:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称2*',
                    show:true
                },
                me: this,
                container: 'y-columns'
            }),
            columnsYR:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称3*',
                    show:true
                },
                me: this,
                container: 'y-columns'
            }),
             columnsYD:instanceFitting({
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
}