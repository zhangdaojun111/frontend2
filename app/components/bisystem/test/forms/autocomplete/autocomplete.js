import template from './autocomplete.html';
import {Base} from '../base';
import {AutoSelect} from '../../../../util/autoSelect/autoSelect';

let config = {
    template: template,
    actions: {
        /**
         * 当AutoSelect 选中值时
         * @param value
         */
        onSelect(value) {
            if (value.length > 0) {
                for(let item of this.autoselect.data.list) {
                    if (item.id === value[0].id) {
                        this.data.value = item;
                        break;
                    }
                };
            }
            this.trigger('onSelect', this.data.value);
        }
    },
    binds: [
    ],
    afterRender(){
        const autoselect_data = {
            multiSelect: false,
            choosed: this.data.value,
            onSelect: this.actions.onSelect
        };
        this.autoselect = new AutoSelect(autoselect_data);
        this.append(this.autoselect, this.el);
    },
    firstAfterRender() {}
}

class AutoComplete extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    /**
     * 设置autoselect list数据
     * @param list = 要设置的list数据
     */
    setList(list) {
        this.autoselect.actions.setList(list);
    }
}

export {AutoComplete}