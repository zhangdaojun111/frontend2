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
    },
    afterRender() {
        this.data.choosed = this.autoSelect.data.choosed;
    },
    firstAfterRender() {
        let me = this;

        // 配置autoSelect组件
        const autoSelectData = {
            list: this.data.list,
            selectBoxHeight: 'auto',
            multiSelect: false
        }
        this.autoSelect = new AutoSelect(autoSelectData);
        this.append(this.autoSelect, this.el.find('.autocomplete'));

        // 取消mouseenter,增加click事件
        // 因为下拉菜单中点击li 需要向服务器请求数据，原autoselect li click 冲突，所以需要先取消li click,在绑定
        this.autoSelect.el.off('mouseenter');

        this.autoSelect.el.on('click', (event) => {
            this.autoSelect.actions.showSelectBox();
        });

        this.autoSelect.el.on('focus', 'input.text', function(event) {
            console.log(this.callBack);
            if (typeof this.callBack === 'function') {
                console.log('xxxxxxxxxxxxxxxxxxxxxxxx');
                this.callBack(...args)
            };
        })
    }
}


export class AutoCompleteComponent extends FormFittingAbstract {
    constructor() {
        super(config);
        this.autoSelect = {};
        this.callBack = null;
    }

    /**
     * autocomplete 返回值
     */
    getValue() {
        return this.autoSelect.data.choosed;
    }


}