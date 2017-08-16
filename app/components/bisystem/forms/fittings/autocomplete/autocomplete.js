/**
 * Created by birdyy on 2017/8/14.
 * name input输入组件
 */

import template from './autocomplete.html';
import './autocomplete.scss';
import {FormFittingAbstract} from '../form.abstract'

let config = {
    template: template,
    data: {
        value:null
    },
    afterRender() {},
    firstAfterRender() {
        let self = this;
        this.el.on('input', '.input',function(event) {
            self.data.value = $(this).val();
        })
    }
}


export class AutoCompleteComponent extends FormFittingAbstract {
    constructor() {
        super(config)
    }

    getValue() {
        return this.data.value;
    }
}