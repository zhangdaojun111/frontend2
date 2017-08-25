/**
 * Created by birdyy on 2017/8/24.
 * name auto输入组件
 */

import template from './auto.html';
import './auto.scss';
import {FormFittingAbstract} from '../form.abstract'

let config = {
    template: template,
    data: {

    },
    actions:{

    },

    binds:[
        {
            event: 'focus',
            selector: '.mat-input-container .mat-input-val',
            callback: _.debounce(function () {
                this.el.find('.mat-select-list').fadeIn();
                let top = $('.form-group-auto').offset().top + $('.mat-select-list').height() + $('.mat-input-container').height();
                let maxHeight = $('.chart-form').height();
                if(top>maxHeight){
                    $('.mat-select-list').css('top','-260px');
                }else{
                    $('.mat-select-list').css('top','30px');
                }
            },50)
        },
        {
            event: 'blur',
            selector: '.mat-input-container .mat-input-val',
            callback: _.debounce(function () {
                this.el.find('.mat-select-list').fadeOut();
            },50)
        },
        {
            event: 'input',
            selector: '.mat-input-container .mat-input-val',
            callback: function () {
                this.searchSelect();
            },
        },
        {
            event: 'click',
            selector:'.mat-select-list ul li span',
            callback: function (self = this) {
                let val = $(self).html();
                this.el.find('.mat-input-container .mat-input-val').val(val);
            }
        }
    ],
    afterRender() {},
    firstAfterRender() {

    }
};

export class AutoComponent extends FormFittingAbstract {
    constructor() {
        super(config);
    }


    /**
     *模糊查询
     */
    searchSelect (){
        this.el.find('.mat-select-list ul li span').hide();
        let inputVal = this.el.find('.mat-input-val').val();
        if(inputVal.length<=0){
            this.el.find('.mat-select-list ul li span').show();
        }
        this.el.find('.mat-select-list ul li span').each(function () {
            let flag = $(this).html().indexOf(inputVal);
            if(flag!==-1){
                $(this).show();
            }
        })
    }

}