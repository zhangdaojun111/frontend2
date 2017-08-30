import template from './text.html';
import {Base} from '../base';
import {AutoSelect} from '../../../../util/autoSelect/autoSelect';

let config = {
    template: template,
    actions: {
    },
    binds: [
    ],
    afterRender(){
    }
}

class AutoComplete extends Base {
    constructor(data, event){
        super(config, data, event)
    }

}

export {AutoComplete}