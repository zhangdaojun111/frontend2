/**
 * Created by birdyy on 2017/8/24.
 * name auto输入组件
 */

import template from './auto.html';
import './auto.scss';
import {FormFittingAbstract} from '../form.abstract'

let config = {
    template: template,
    data: {},
    actions:{},
    binds:[
        {
            event: 'focus',
            selector: '.mat-input-container .mat-input-val',
            callback: function () {
                this.el.find('.mat-select-list').fadeIn();
            }
        },
        {
            event: 'blur',
            selector: '.mat-input-container .mat-input-val',
            callback: function () {
                this.el.find('.mat-select-list').fadeOut();
            }
        },
        // {
        //     event: 'click',
        //     selector: '.mat-select-list ul li span',
        //     callback: function () {
        //
        //     }
        // }
    ],
    afterRender() {},
    firstAfterRender() {
        let me = this;
        this.el.on('click','.mat-select-list ul li span',function(){
            let val = $(this).html();
            me.el.find('.mat-input-container .mat-input-val').val(val);
        })
    }
};

export class AutoComponent extends FormFittingAbstract {
    constructor() {
        super(config);
    }

}