/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './comment.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {PMAPI} from '../../../../../lib/postmsg';
import {FormMixShareComponent} from '../../mix.share/mix.share';
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';

import "./comment.scss";

let config = {
    template:template,
    data: {
        columns:{

        }
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        this.getChartField();
    }
};

export class FormCommentComponent extends BiBaseComponent{
    constructor() {
        super(config);
        this.formGroup={};
    }

    /**
     * 渲染comment fittings
     */
    renderFitting(){
        let base = new FormBaseComponent();
        let share = new FormMixShareComponent();
        this.append(base, this.el.find('.comment-base'));
        this.append(share, this.el.find('.comment-share'));

        this.formGroup = {
            commentName:base,
            commentShare:share,
            items: instanceFitting({
                type:'radio',
                me: this,
                data:{
                    // value:null,
                    // name:'test',
                    // radios:[
                    //     {value:'1',name:'tag1'},
                    // ]
                },
                container: 'comment-column .comment-column-item' }),
        }
    }

    /**
     * reset实例，当通过路由重新进入实例，清空所有数据
     */
    reset(flag) {
        this.formGroup = {};
    }

    /**
     * 获取图表数据源
     */
    async getChartField() {
        let res = await ChartFormService.getChartField();
        if (res['success'] === 1) {
            const data = {
                name: 'test',
                value:null,
                radios:res.data['rich_field'].map(item => {
                    return {value:item.name,name:item.name}
                })
            };
            this.formGroup.items.data = data;
            this.formGroup.items.reload();
        } else {
            msgbox.alert(res['error']);
        };
    }

}