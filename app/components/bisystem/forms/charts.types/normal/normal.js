/**
 * Created by birdyy on 2017/8/14.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './normal.html';
import {FormBaseComponent} from '../../base/base';
import {fittings as form} from '../../fittings/export.fittings';

let config = {
    template:template,
    data: {
        formGroup:{}
    },
    actions: {},
    afterRender() {
        this.renderFitting();
    },
    firstAfterRender() {
        this.el.on('click', '.save', () => {
            const form = this.save();
            // const data = {
            //     'name': form['name'].getValue(),
            //     'source': form['source'].getValue(),
            //     'x': form['x'].getValue(),
            //     'y': form['y'].getValue()
            // }
            console.log(form['x'].getValue());
            console.log(form['y'].getValue());
            return false;
        })
    },
    beforeDestory() {}
}

export class FormNormalComponent extends BiBaseComponent{
    constructor() {
        super(config)
    }

    /**
     * 渲染chart fittings
     */
    renderFitting() {
        let base = new FormBaseComponent();
        this.append(base, this.el.find('.field'));
        this.data.formGroup['base'] = base;
        const formGroup = {
            x: form.input,
            y: form.input
        };
        Object.keys(formGroup).map(type => {
            let component = new formGroup[type]();
            this.data.formGroup[type] = component;
            this.append(component, this.el.find('.base'))
        })
    }

    /**
     * 保存数据
     */
    save() {
        const data  = this.data.formGroup;
        return data;
    }
}