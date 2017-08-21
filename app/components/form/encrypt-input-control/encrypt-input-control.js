import Component from '../../../lib/component';
import './add-enrypt.html';
import template from './encrypt-input-control.html'

let config={
    template:template,
    actions:{
        hasChangeValue(data){
            let _this=this;
            this.data=_.defaultsDeep({},data);
            $('#inputShow').val(data.value);
            _.debounce(function(){
                _this.events.changeValue(_this.data);
            },200)();
        }
    },
    binds:[
        {
            event: 'click',
            selector: '#edit',
            callback: function(){
                this.events.addPassword(this.data)
            }
        }
    ],
    afterRender() {
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
class PasswordControl extends Component {
    constructor(data,events){
        super(config,data,events);
    }
}

export default PasswordControl