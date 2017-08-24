/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './funnel.html';
import {FormBaseComponent} from '../../base/base';
import {instanceFitting, groupFitting} from '../../fittings/export.fittings';
import Mediator from '../../../../../lib/mediator';
import msgbox from "../../../../../lib/msgbox";
import {FormMixShareComponent} from '../../mix.share/mix.share';
import "./funnel.scss";
import {ChartFormService} from '../../../../../services/bisystem/chart.form.service';


let config = {
    template:template,
    data: {},
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        this.el.on('click', '.chart-form .save-btn', (event) => {
            // this.saveChart();
        })
    },
    beforeDestory() {}
};

export class FormFunnelComponent extends BiBaseComponent{
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
            auto:instanceFitting({
                type:'auto',
                me:this,
                container:('form-group-auto'),
            })
        };

    }

    reset() {

    }
}