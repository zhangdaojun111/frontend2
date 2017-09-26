/**
 *@author yudeping
 *文本区控件
 */

import Component from '../../../lib/component';
import template from './textarea-control.html';
import './textarea-control.scss';
let config={
    template:template,
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        }
    ],
    afterRender(){
        let _this=this;
        this.el.find('.textArea').on('input',_.debounce(function(){
            _this.data.value=$(this).val();
            _this.events.changeValue(_this.data);
        },300));
        this.el.find('.ui-width').css('width',this.data.width);
        if(this.data.is_view){
            this.el.find('.ui-width').attr('disabled',true);
        }else{
            this.el.find('.ui-width').attr('disabled',false);
        }
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        //回显
        if (_this.data.value) {
            _this.el.find(".textArea").val(_this.data.value);
        } else {
            _this.el.find(".textArea").val('');
        }
    },
    beforeDestory(){
        this.el.find('input').off();
        this.el.off();
    }
}
class TextAreaControl extends Component {
    constructor(data,events){
        super(config,data,events);
    }
}

export default TextAreaControl