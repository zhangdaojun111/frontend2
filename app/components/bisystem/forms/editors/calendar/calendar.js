import {Base} from '../base';
import template from './calendar.html';
import './calendar.scss';

let config = {
    template: template,
    actions:{},
    data: {
        options: []
    },
    afterRender() {},
};

class CalendarEditor extends Base {
    constructor(data,extendConfig) {
        super($.extend(true,{},config,extendConfig));
    }
}

export {CalendarEditor}