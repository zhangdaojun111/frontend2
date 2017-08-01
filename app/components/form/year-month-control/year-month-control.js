import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';

let config={
    template:`<div class="clearfix">
                 {{#if be_control_condition }}
                    <a href="javascript:void(0);" style="color:#ccc;">被修改条件限制</a>
                 {{else}}
                        <div style="float: left">{{label}}</div>
                        <div class="year" style="float: left"></div>
                        <span style="float: left;">年</span>
                        <div class="month" style="float: left"></div>
                        <span style="float: left;">月</span>
                        <div style="float: left;">
                           {{#if required}}
                                    <span  class="{{requiredClass}}" ></span>
                           {{/if}}  
                      </div>
                 {{/if}}
            </div>`,
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect',function(data){
            if(data.dfield !=_this.data.dfield){
                return;
            }
            console.log(_this.data.value)
            console.log(data.value)
            console.log(_this.data.value.split('-')[1])
            let val = 0;
            if( data.value > 12 ){
                val =data.value + "-" + _this.data.value.split('-')[1];
            }
            else{
                val = _this.data.value.split('-')[0] + "-" + data.value;
            }
            _this.data.value = val;
            console.log(_this.data.value);
            if(_this.data.required){
                Mediator.publish('form:checkRequired',data);
            }
        });
    },
    afterRender:function(){
        let yearData = {} ;
        let monthData = {} ;
        $.extend(true,yearData,this.data)
        $.extend(true,monthData,this.data)
        let myDate = new Date();
        let myYear = myDate.getFullYear();
        if(!yearData.options || !yearData.options.length){
            yearData.options=[];
        }
        yearData.options.push({ "label": String(myYear),"value": String(myYear)})
        for( let i=1;i<=5;i++ ){
            yearData.options.unshift( { "label": String(myYear - i),"value": String(myYear - i)} );
            yearData.options.push( { "label": String(myYear + i),"value": String(myYear + i)} );
        }
        console.log(myYear)
        monthData.options = [
            {"label": 1,"value": 1},
            {"label": 2,"value": 2},
            {"label": 3,"value": 3},
            {"label": 4,"value": 4},
            {"label": 5,"value": 5},
            {"label": 6,"value": 6},
            {"label": 7,"value": 7},
            {"label": 8,"value": 8},
            {"label": 9,"value": 9},
            {"label": 10,"value": 10},
            {"label": 11,"value": 11},
            {"label": 12,"value": 12}
        ]
        if(this.data.value != ''){
            yearData.showValue = this.data.value.split('-')[0]
            monthData.showValue = this.data.value.split('-')[1]
        }
        else{
            yearData.showValue = myYear;
            monthData.showValue = myDate.getMonth() + 1;
        }
        this.append(new DropDown(yearData),this.el.find('.year'));
        this.append(new DropDown(monthData),this.el.find('.month'));
    }
}
export default class YearMonthControl extends Component{
    constructor(data){
        super(config,data);
    }
}