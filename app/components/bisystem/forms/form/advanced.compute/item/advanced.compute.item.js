import template from './advanced.compute.item.html';
import {Base} from '../../base';
import {Text} from '../../text/text';
import {Textarea} from '../../textarea/textarea';

let config = {
    template: template,
    data: {
    },
    actions: {
    },
    binds: [
    ],
    afterRender(){
        this.name = new Text();
        this.code = new Textarea();
        this.result = new Text();
        this.append(this.name, this.el.find('.advanced-name'));
        this.append(this.code, this.el.find('.advanced-code'));
        this.append(this.result, this.el.find('.advanced-result'));
    }
}

class AdvancedComputeItem extends Base {
    constructor(data, event) {
        super(config, data, event)
    }
}

export {AdvancedComputeItem}