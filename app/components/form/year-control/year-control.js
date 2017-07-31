import Component from '../../../lib/component'
import DropDown from '../vender/dropdown/dropdown'
import Mediator from '../../../lib/mediator';

let config={
    template:`<div class="clearfix">
                <div style="float: left">{{label}}</div>
                <div class="dropdown" style="float: left"></div>
              <div style="float: left;">
                   {{#if required}}
                    <span id="requiredLogo" class="required" ></span>
                   {{/if}} 
              </div>
              </div>
                `,
    data:{
        options:[],
    },
    firstAfterRender:function(){
        let _this=this;
        console.log(this.options);
        this.append(new DropDown(this.data),this.el.find('.dropdown'));
        //监听dropdown值改变
        Mediator.subscribe('form:valueChange',function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
           _this.data.value=data.value;
           //重置必填样式
           if(data.value=='' || data.value.length ==0 || data.value==null){
               _this.el.find('#requiredLogo').get(0).className='required';
           }else{
               _this.el.find('#requiredLogo').get(0).className='required2';
           }
        });
    }
}
export default class YearControl extends Component{
    constructor(data){
        let myDate = new Date();
        let myYear = myDate.getFullYear();
        for( let i=5;i>=-10;i-- ){
            config.data.options.push( { "label": String(myYear + i),"value": String(myYear + i)} );
        }
        config.data.options.unshift({"label":"请选择","value":"请选择"});
        super(config,data);
    }
}