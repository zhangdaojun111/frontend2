import template from './autocomplete.html';
import {Base} from '../base';
import {AutoSelect} from '../../../../util/autoSelect/autoSelect';

let config = {
    template: template,
    actions: {
    },
    binds: [
    ],
    afterRender(){
    },
    firstAfterRender() {
        const autoselect_data = {
            multiSelect: false,
            onSelect: this.onSelect
        };
        this.autoselect = new AutoSelect(autoselect_data);
        this.append(this.autoselect, this.el);
    }
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

    /**
     * mapping autoselect onselect事件
     */
    onSelect() {
    }

}

export {AutoComplete}