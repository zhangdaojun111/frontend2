/**
 *@author yudeping
 *单选控件
 */

import Component from '../../../lib/component';
import './radio-control.scss';
import template from './radio-control.html'
let config={
    template:template,
    actions:{
        changeOption(res){
            if( this.data.dfield && res == this.data.dfield ){
                this.data.value = [];
                this.reload();
            }
        }
    },
    afterRender(){
        let _this=this;
        this.el.on('click','.df-input-radio',function(event){
            _this.data.value=event.target.value;
            _.debounce(function(){
                _this.events.changeValue(_this.data);
            },200)();
            for(let obj of _this.data.group){
                if(obj.value==event.target.value){
                    obj['checked']=true;
                }else{
                    obj['checked']=false;
                }
            }
            _this.reload();
        })

        this.el.on('click','.add-item',function(){
            _.debounce(function(){
                _this.events.addItem(_this.data);
            },200)();
        })

        this.el.on('click','.ui-history',function(){
            _.debounce(function(){
                _this.events.emitHistory(_this.data);
            },300)();
        });
        if(this.data.is_view){
            this.el.find('.df-input-radio').attr('disabled',true);
        }else{
            this.el.find('.df-input-radio').attr('disabled',false);
        }
    },
    beforeDestory(){
        this.el.off();
    }
}
class RadioControl extends Component {
    constructor(data,events){
        super(config,data,events);
    }
}

export default RadioControl