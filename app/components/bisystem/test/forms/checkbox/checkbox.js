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
            this.data.value = [];
            this.reload();
        },

        /**
         * checkbox 选中 or 不选中
         * @param checked === true ? 选中 : '不选中'
         *        vaulue = 选中的值，checked=true push()
         */
        onChange: function (checked,value) {
            value = JSON.parse(value)
            if (checked) {
                this.data.value.push(value);
            } else {
                _.remove(this.data.value, (item) => {
                    return item.id === value.id
                });
            }
            this.trigger('onChange', this.data.value);
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
    },
    firstAfterRender() {
        // this.trigger('onChange', this.data.value);
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
        let data = list.map(val => {
            return {value: JSON.stringify(val), name: val['name']}
        })
        this.data.list = data;
        this.reload();
    }

}

export {Checkbox}