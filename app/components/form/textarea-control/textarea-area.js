/**
 *@author yudeping
 *文本区控件
 */

import Component from '../../../lib/component';
import template from './textarea-control.html';
import './textarea-control.scss';
let config={
    template:template,
    afterRender(){
        let _this=this;
        _this.el.on('input','input',_.debounce(function(){
            _this.data.value=$(this).val();
            _this.events.changeValue(_this.data);
        },300));
        _this.el.on('click','.ui-history',_.debounce(function(){
            _this.events.emitHistory(_this.data);
        },200));
        this.el.find('.ui-width').css('width',this.data.width);
        if(this.data.is_view){
            this.el.find('.ui-width').attr('disabled',true);
        }else{
            this.el.find('.ui-width').attr('disabled',false);
        }
    },
    beforeDestory(){
        this.el.off();
    }
}
class TextAreaControl extends Component {
    constructor(data,events){
        super(config,data,events);
    }
}

export default TextAreaControl