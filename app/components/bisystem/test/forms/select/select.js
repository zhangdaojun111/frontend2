import template from './select.html';
import {Base} from '../base';

let config = {
    template: template,
    data: {},
    actions: {},
    binds: [
    ],
    afterRender(){
    }
};

class Select extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    /**
     * 设置value
     * @param value
     */
    setValue(value){}

    /**
     * 设置select options
     * @param list = 要设置的options数据
     */
    setList(list) {
        this.data.list = list;
        this.reload();
    }

}

export {Select}