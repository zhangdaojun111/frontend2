/**
 * Created by birdyy on 2017/8/14.
 * name input输入组件
 */

import template from './autocomplete.html';
import './autocomplete.scss';
import {FormFittingAbstract} from '../form.abstract'
import {AutoSelect} from '../../../../util/autoSelect/autoSelect';
import './autocomplete.scss';

let config = {
    template: template,
    data: {
        list: [],
        onSelect: null,
        items: []
    },
    afterRender() {
        this.data.choosed = this.autoSelect.data.choosed;
    },
    actions: {
    },
    firstAfterRender() {
        let me = this;

        // 配置autoSelect组件
        const autoSelectData = {
            list:me.data.list,
            selectBoxHeight: 'auto',
            multiSelect: false,
            onSelect: me.data.onSelect
        };
        this.autoSelect = new AutoSelect(autoSelectData);
        this.append(this.autoSelect, this.el.find('.autocomplete'));

        // 取消mouseenter,增加click事件
        this.autoSelect.el.off('mouseenter');

        this.autoSelect.el.on('click', (event) => {
            this.autoSelect.actions.showSelectBox();
        });
    }
}


export class AutoCompleteComponent extends FormFittingAbstract {
    constructor(data) {
        config.data = data;
        super(config);
        this.autoSelect = {};
    }

    /**
     * 设置autoComplete值
     */
    setValue(val) {
        this.autoSelect.data.choosed[0] = val;
        this.autoSelect.reload();
    }

    /**
     * autocomplete 返回值
     */
    getValue() {
        const field = this.autoSelect.data.choosed[0];
        let data = {}
        if (field) {
            for (let choosed of this.autoSelect.data.list) {
                if (field.id == choosed.id) {
                    data = choosed;
                    break;
                }
            }

        }
        return data;
    }


}