/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './pie.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormMixShareComponent} from '../../mix.share/mix.share';

import './pie.scss';
let config = {
    template:template,
    data: {
        single:false,
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {}
}
export class FormPieComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.formGroup={};
    }

    /**
     * 渲染pie fittings
     */

    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent();
        this.append(base, this.el.find('.pie-base'));
        this.append(share, this.el.find('.pie-share'));

        this.formGroup = {
            pieName:base,
            pieShare:share,
            pieType:instanceFitting({
                type:'select',
                me: this,
                container: 'pie-type',
                data:{
                    options:[{
                        name:'饼图',
                        value:'饼图'
                    }]
                }
            }),
            pieSingle:instanceFitting({
                type:'select',
                me: this,
                container: 'pie-single',
                data:{
                    options:[
                        {
                            name:'单条',
                            value:'单条'
                        },
                        {
                            name:'多条',
                            value:'多条'
                        }
                    ]
                }
            }),
            pieX:instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'pie-x'
            }),
            singleColumns:instanceFitting({
                type:'checkbox',
                me: this,
                data: {
                    value:null,
                    checkboxs:[
                        {value:'', name:'是否为管理员'},
                    ],
                },
                container: 'pie-single-columns .single-columns'
            }),
            pieY:instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'pie-y'
            }),
            pieDeep:instanceFitting({
                type:'autoComplete',
                me: this,
                container: 'pie-deep .pie-deep-auto'
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