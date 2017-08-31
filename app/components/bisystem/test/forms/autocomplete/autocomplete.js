import template from './text.html';
import {Base} from '../base';
import {AutoSelect} from '../../../../util/autoSelect/autoSelect';

let config = {
    template: template,
    actions: {
        /**
         * 设置autoselect list数据
         * @param list = 要设置的list数据
         */
        setList(list) {
            this.autoSelect.setList(list);
        }
    },
    binds: [
    ],
    afterRender(){
    },
    firstAfterRender() {
        this.autoselect = new AutoSelect();
        this.append(this.autoselect, this.el);
    }
}

class AutoComplete extends Base {
    constructor(data, event){
        super(config, data, event)
    }

}

export {AutoComplete}