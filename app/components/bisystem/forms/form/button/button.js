/**
 * Created by birdyy on 2017/9/1.
 * 保存表单图表到服务器
 */

import template from './button.html';
import {Base} from '../base';
import './button.scss';

let config = {
    template: template,
    data: {},
    actions: {
        /**
         * 保存配置图表
         * @param chart = form form图表配置的参数 eg:{chartName: {id:'', name: ''}}
         */
        saveChart(){
            this.trigger('save');
        }

    },
    binds: [
        {
            event: 'click',
            selector: 'button',
            callback: function (context) {
                this.actions.saveChart();
            }
        },
        {
            event: 'click',
            selector: '.back-chart',
            callback: function (context) {
                window.location.hash = '#/forms/home';
            }
        }
    ],
    afterRender(){}
}

class Button extends Base {
    constructor(data, event,extendConfig){
        super($.extend(true,{},config,extendConfig), data, event)
    }
}

export {Button}