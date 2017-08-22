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
import {NineGridNumberComponent} from './number/number';

import './nine.grid.scss';

let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
        this.switchOptions(this.formGroup.nineGridColumn.data.value);
    },
    firstAfterRender() {
        this.el.on('click', '.save-btn', (event) => {
            this.save();
        })
    }
};

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
        let grid = new NineGridNumberComponent();
        this.append(base, this.el.find('.nine-grid-base'));
        this.append(share, this.el.find('.nine-grid-share'));
        this.append(grid,this.el.find('.nine-grid-column-xy'));

        this.formGroup = {
            nineGridName:base,
            nineGridShare:share,
            grid:grid,
            nineGridColumn:instanceFitting({
                type:'select',
                me: this,
                container: 'nine-grid-column',
                data: {
                    value: '3',
                    options:[
                        {name:'3*3', value:'3'},
                        {name:'4*4', value:'4'}
                    ],
                    onChange: this.switchOptions.bind(this),
                }

            })
        }
    }
    /**
     * 切换3*3 / 4*4 格子数
     * @param val === 3 / val ===4
     *
     */
    switchOptions(val) {
        if(val == 4){
            this.formGroup.grid.data.columnsShow = true;
        }else{
            this.formGroup.grid.data.columnsShow = false;
        }
        this.formGroup.grid.reload();
    }


    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(flag) {
        this.formGroup = {};
    }

    /**
     * 获取到九宫格 X,Y轴 输入数据
     */
    save() {
       let val = this.formGroup.nineGridColumn.data.value;
       let data = this.formGroup.grid.getValue();

        console.log(data);
    }

}