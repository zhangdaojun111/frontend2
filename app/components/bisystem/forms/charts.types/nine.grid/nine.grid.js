/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './nine.grid.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormMixShareComponent} from '../../mix.share/mix.share';

import './nine.grid.scss';
let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {}
}
export class FormNineGridComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.formGroup={};
    }

   /**
    * 渲染nine-grid fittings
    */
   renderFitting(){
       let base = new FormBaseComponent();
       let share = new FormMixShareComponent();
       this.append(base, this.el.find('.nine-grid-base'));
       this.append(share, this.el.find('.nine-grid-share'));

        this.formGroup = {
            nineGridName:base,
            nineGridShare:share,
            nineGridColumn:instanceFitting({
                type:'select',
                me: this,
                container: 'nine-grid-column',
                data: {
                    options:[
                        {
                            name:'3*3',
                            value:'3*3'
                        },
                        {
                            name:'4*4',
                            value:'4*4'
                        }
                    ]
                }

            }),
            nineGridColumnXL:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称1*',
                    show:true
                },
                me: this,
                container: 'nine-grid-column-x'
            }),
            nineGridColumnXC:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称2*',
                    show:true
                },
                me: this,
                container: 'nine-grid-column-x'
            }),
            nineGridColumnXR:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入X轴名称3*',
                    show:true
                },
                me: this,
                container: 'nine-grid-column-x'
            }),
            nineGridColumnYL:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称1*',
                    show:true
                },
                me: this,
                container: 'nine-grid-column-y'
            }),
            nineGridColumnYC:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称2*',
                    show:true
                },
                me: this,
                container: 'nine-grid-column-y'
            }),
            nineGridColumnYR:instanceFitting({
                type:'input',
                data:{
                    value:null,
                    label: '请输入Y轴名称3*',
                    show:true
                },
                me: this,
                container: 'nine-grid-column-y'
            }),

        }
   }

    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(flag) {
        this.formGroup = {};
    }

}