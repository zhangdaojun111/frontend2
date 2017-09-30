import template from './checkbox.html';
import {Base} from '../base';
import './checkbox.scss';

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
         * 全选
         */
        selectAll() {
            let list = [];
            this.data.list.map(checkbox => {
                list.push(JSON.parse(checkbox.value))
                this.el.find('input').prop('checked', true);
            });
            this.data.value = list;
        },

        /**
         * checkbox 选中 or 不选中
         * @param checked === true ? 选中 : '不选中'
         *        vaulue = 选中的值，checked=true push()
         */
        onChange: function (checked,value) {
            value = JSON.parse(value);
            if (checked) {
                this.data.value.push(value);
            } else {
                _.remove(this.data.value, (item) => {
                    return item.id === value.id
                });
            };
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
    afterRender(){},
    firstAfterRender() {}
};

class Checkbox extends Base {
    constructor(data, event){
        super(config, data, event)
    }

    /**
     * 设置value
     * @param value
     */
    setValue(value){
        this.data.firstDo = true;
        if (Array.isArray(value)) { // 多选
            this.data.value = value;
            this.data.list.forEach((l,index) => {
                console.log(this.data.value)
                for (let choosed of this.data.value) {
                    if (choosed.id === JSON.parse(l.value).id) {
                        this.el.find('input[type=checkbox]').eq(index).prop('checked',true);
                        break;
                    }
                }
            })
        } else { // 单选
            if (value) {
                this.data.value.push(value);
                this.el.find(`input`).prop("checked",true);
            };
            this.trigger('onChange', this.data.value);// 作为单选的时候触发
        };
    }

    /**
     * 设置checkbox list
     * @param checkbox = 要设置的checkboxs数据
     */
    setList(list) {
        let data = list.map(val => {
            return {value: JSON.stringify(val), name: val['name']}
        })
        this.data.list = data;
        this.data.value = this.data.firstDo ? this.data.value : [];
        this.reload();
        if (this.data.firstDo) {
            this.setValue(this.data.value);
            if (this.data.list.length > 0) {
                this.data.firstDo = false;
            };
        };
        this.trigger('onChange', this.data.value);
    }

}

export {Checkbox}