import {Base} from '../base';
import template from './message.html';
import './message.scss';

let config = {
    template: template,
    actions:{},
    data: {
        options: []
    },
    afterRender() {},
};

class MessageEditor extends Base {
    constructor(data,extendConfig) {
        super($.extend(true,{},config,extendConfig));
    }
}

export {MessageEditor}