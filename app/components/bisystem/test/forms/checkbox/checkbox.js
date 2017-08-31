import template from './checkbox.html';
import {Base} from '../base';

let config = {
    template: template,
    data: {},
    actions: {
        /**
         * 清空所有字段
         */
        clear() {
            this.data.list = [];
            this.reload();
        },

        /**
         * checked or no-checked
         */
        onChange: function (checked,value) {
            // this.data.value = value;
            if (checked) {
                this.data.value.push(JSON.parse(value));
                console.log(this.data.value)
            } else {
                _.remove(this.data.value, (item) => {
                    return item.id === value.id
                });
                console.log(this.data)
            }
            this.trigger('onChange', value);
        }
    },
    binds: [
        {
            event: 'change',
            selector: 'input',
            callback: function (context) {
                let checked = $(context).is(':checked');
                this.actions.onChange(checked, context.value);
            }
        }
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

    /**
     * 设置checkbox list
     * @param list = 因为list的value是一个对象,需要把值转化为jsonstring
     */
    setJsonList(list) {
        let data = list.map(val => {
            return {value: JSON.stringify(val), name: val['name']}
        })
        this.data.list = data;
        this.reload();
    }

}

export {Checkbox}