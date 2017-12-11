/**
 *@author chenli
 *@description 密码框控件
 */


import Component from '../../../lib/component';
import './add-enrypt.html';
import template from './encrypt-input-control.html'

let config = {
    template: template,
    actions: {
        hasChangeValue(data) {
            let _this = this;
            this.data = _.defaultsDeep({}, data);
            $('#inputShow').val(data.value);
            _.debounce(function () {
                _this.events.changeValue(_this.data);
            }, 200)();
        }
    },
    binds: [
        {
            event: 'click',
            selector: '#edit',
            callback: function () {
                this.events.addPassword(this.data)
            }
        }
    ],
    afterRender() {
        this.el.find('.ui-width').css('width', this.data.width);
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        if (this.data.is_view) {
            this.el.find('.ui-width').attr('disabled', true);
        } else {
            this.el.find('.ui-width').attr('disabled', false);
        }
    },
    beforeDestory() {
        this.el.off();
    }
}
let PasswordControl = Component.extend(config)
export default PasswordControl