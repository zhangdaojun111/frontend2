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

let CalendarEditor = Base.extend(config);

export {CalendarEditor}