/**
 * Created by birdyy on 2017/8/14.
 * title: chart组件基础配置
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './base.html';
import {fittings as form} from '../fittings/export.fittings';
import './base.scss';

let config = {
    template: template,
    data: {
        formGroup: {
            name: form.input,
            source: form.input
        }
    },
    actions: {},
    afterRender() {
        // this.renderFitting();
    },
    firstAfterRender() {
        this.renderFitting();
    }
};

export class FormBaseComponent extends BiBaseComponent {
    constructor() {
        super(config);
    }


    /**
     * 渲染chart fittings
     */
    renderFitting() {
        Object.values(this.data.formGroup).map(fitting => {
            let component = new fitting();
            this.append(component, this.el.find('.base'))
        })
    }
}