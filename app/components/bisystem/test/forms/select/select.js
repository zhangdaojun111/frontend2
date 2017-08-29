import template from './select.html';
import {Base} from '../base';

let config = {
    template: template
}

class Select extends Base {
    constructor(data, event){
        super(config, data, event)
    }
}

export {Select}