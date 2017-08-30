import template from './text.html';
import {Base} from '../base';

let config = {
    template: template,
    actions: {
        onInput: function (value) {
            this.data.value = value;
            this.trigger('onChange', value);
        }
    },
    binds: [
        {
            event: 'input',
            selector: 'input',
            callback: function (context) {
                this.actions.onInput(context.value);
            }
        }
    ],
    afterRender(){
        this.$input = this.el.find('input');
        this.$label = this.el.find('label');
    }
}

class Text extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    setValue(value){
        this.data.value = value;
        this.$input.val(value);
    }

    setLabel(label){
        this.data.label = label;
        this.$label.text(label);
    }
}

export {Text}