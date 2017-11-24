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
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        },
        {
            event: 'click',
            selector: '.add-item',
            callback: function(){
                this.events.addItem(this.data)
            }
        },
        {
            event: 'click',
            selector: '.df-input-radio',
            callback: function(event){
                this.data.value=event.value;
                _.debounce(()=>{
                    this.events.changeValue(this.data);
                },200)();
                for(let obj of this.data.group){
                    if(obj.value==event.value){
                        obj['checked']=true;
                    }else{
                        obj['checked']=false;
                    }
                }
                this.reload();
            }
        }
    ],
    afterRender(){
	    this.data.direction=1;
    	if(this.data.direction){
    		this.el.find('.df-input-label').addClass('flexItem');
    		this.el.find('.radio-wrap').removeClass('height26');
    		this.el.find('.direction-wrap').addClass('line');
	    }
        if(this.data.is_view){
            this.el.find('.df-input-radio').attr('disabled',true);
        }else{
            this.el.find('.df-input-radio').attr('disabled',false);
        }
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible').addClass('icon-fl');
        }
        if(!this.data.is_view && this.data.can_add_item){
            this.el.find('.add-item').css('visibility','visible').addClass('icon-fl');
        }
    },
    beforeDestory(){
        this.el.off();
    }
}
class RadioControl extends Component {
    constructor(data,events,newConfig){
        super($.extend(true,{},config,newConfig),data,events)
    }
}

export default RadioControl