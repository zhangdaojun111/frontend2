import template from './autocomplete.html';
import {Base} from '../base';
import {AutoSelect} from '../../../../util/autoSelect/autoSelect';
import './autocomplete.scss';

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
                this.clearErrorMsg();
            } else {
                this.data.value = null;
            };
            this.trigger('onSelect', this.data.value);
        }
    },
    binds: [],
    afterRender(){
        const autoselect_data = {
            multiSelect: false,
            choosed: this.data.value,
            placeholder:this.data.placeholder ? this.data.placeholder : '请选择数据',
            onSelect: this.actions.onSelect
        };
        this.autoselect = new AutoSelect(autoselect_data);
        this.append(this.autoselect, this.el.find('.form-chart-wrapper'));
    },
    firstAfterRender() {}
}

class AutoComplete extends Base {
    constructor(data, event,extendConfig){
        super($.extend(true,{},config,extendConfig), data, event)
    }

    /**
     * 设置autoselect list数据
     * @param list = 要设置的list数据
     */
    setList(list) {
        if (this.data.firstDo) {
            this.data.firstDo = false;
        } else {
            this.autoselect.data.choosed = [];
        }
        this.autoselect.actions.setList(list);
    }

    /**
     * 设置value
     * @param value = 设置autoselect 默认值
     */
    setValue(value){
        this.data.value = value;
        this.autoselect.data.choosed = value ? [value] : [];
        this.data.firstDo = this.autoselect.data.list.length > 0 ? false : true;
        if (this.autoselect.data.list.length > 0) {
            this.autoselect.reload();
        };
    }
}

export {AutoComplete}