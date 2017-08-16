/**
 * Created by birdyy on 2017/8/16.
 * title: chart 高级查询组件
 */

import {BiBaseComponent} from '../../bi.base.component';
import template from './search.html';
import {fittings as form} from '../fittings/export.fittings';
import './search.scss';

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