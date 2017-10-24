import template from './advanced.compute.item.html';
import {Base} from '../../base';
import {Text} from '../../text/text';
import {Textarea} from '../../textarea/textarea';

let config = {
    template: template,
    data: {
        id: ''
    },
    actions: {
        saveItem() {
            this.name.el.find('input').prop('readonly', true);
            this.code.el.find('textarea').prop('readonly', true).addClass('code-height-auto');
            this.result.el.find('input').prop('readonly', true);
            this.el.find('.edit-item-btn').show();
            this.el.find('.save-item-btn').hide();
        },
        editItem() {
            this.name.el.find('input').prop('readonly', false);
            this.code.el.find('textarea').prop('readonly', false).removeClass('code-height-auto');
            this.result.el.find('input').prop('readonly', false);
            this.el.find('.edit-item-btn').hide();
            this.el.find('.save-item-btn').show();
        }
    },
    binds: [
        // 删除高级数据模版对象
        {
            event: 'click',
            selector: '.remove-item-btn',
            callback: function (context) {
                this.trigger('onRemoveItem', this.componentId);
                this.destroySelf();
            }
        },
        // 保存高级数据模版对象
        {
            event: 'click',
            selector: '.save-item-btn',
            callback: function (context) {
                this.actions.saveItem();
            }
        },
        // 编辑高级数据模版对象
        {
            event: 'click',
            selector: '.edit-item-btn',
            callback: function (context) {
                this.actions.editItem();
            }
        },
    ],
    afterRender(){
        this.name = new Text();
        this.code = new Textarea();
        this.result = new Text();
        this.append(this.name, this.el.find('.advanced-name'));
        this.append(this.code, this.el.find('.advanced-code'));
        this.append(this.result, this.el.find('.advanced-result'));
        this.el.find('.edit-item-btn').hide();
    },
    firstAfterRender() {}
}

class AdvancedComputeItem extends Base {
    constructor(data, event,extendConfig) {
        super($.extend(true,{},config,extendConfig), data, event)
    }

    /**
     * 设置item值
     * @param value
     */
    setValue(value) {
        this.data.id = value.id;
        this.name.setValue(value.name);
        this.code.setValue(value.code);
        this.result.setValue(value.result);
        this.actions.saveItem();
    }
    /**
     * 获取item值
     * @param value
     */
    getValue() {
        return {
            id: this.data.id,
            name: this.name.data.value,
            code: this.code.data.value,
            result: this.result.data.value
        }
    }
}

export {AdvancedComputeItem}