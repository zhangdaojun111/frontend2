import template from './checkbox.html';
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

class Checkbox extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    /**
     * 设置value
     * @param value
     */
    setValue(value){}

    /**
     * 设置checkbox list
     * @param checkbox = 要设置的checkboxs数据
     */
    setList(list) {
        this.data.list = list;
        this.reload();
    }

}

export {Checkbox}