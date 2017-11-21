import {Base} from '../base';
import template from './approval.html';
import './approval.scss';

let config = {
    template: template,
    actions:{},
    data: {
        options: []
    },
    afterRender() {},
};

class ApprovalEditor extends Base {
    constructor(data,extendConfig) {
        super($.extend(true,{},config,extendConfig));
    }
}

export {ApprovalEditor}