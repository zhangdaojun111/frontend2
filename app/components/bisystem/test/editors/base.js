import Component from '../../../../lib/component';
import {Text} from '../forms/text/text';
import {Select} from '../forms/select/select';
import {AutoSelect} from '../forms/autoselect/autocomplete';

let formItemTypes = {
    'text': Text,
    'select': Select,
    'autoselect': AutoSelect
}

class Base extends Component {
    constructor(config, data, event){
        super(config, data, event);
    }
    drawForm(){
        let options = this.data.options;
        this.formItems = {};
        options.forEach((item) => {
            let clazz = formItemTypes[item.type];
            let instance = new clazz({
                value: item.defaultValue,
                label: item.label,
                name: item.name
            }, item.events);
            this.append(instance, this.el.find('.form-group'));
            this.formItems[item.name] = instance;
        });
    }
    getData(){
        this.formItems()
    }
    fillData(){}
}
export {Base}