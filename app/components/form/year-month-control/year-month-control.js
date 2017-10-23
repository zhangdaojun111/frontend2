/**
 *@author fangqiwei
 *年份控件
 */

import Component from '../../../lib/component'
import template from './year-month-control.html'
import {AutoSelect} from "../../util/autoSelect/autoSelect"

let config={
    template:template,
    data:{
        isInit:true,
    },
    binds:[
        {
            event: 'click',
            selector: '.ui-history',
            callback: function(){
                this.events.emitHistory(this.data);
            }
        }
    ],
    actions:{
      changeValue(value,_this){
          let val = 0;
          if( value > 12 ){
              val =value + "-" + _this.data.value.split('-')[1];
          }
          else{
              val = _this.data.value.split('-')[0] + "-" + value;
          }
          _this.data.value = val;
          _.debounce(function(){_this.events.changeValue(_this.data)},200)();
      }
    },
    afterRender(){
        let _this=this;
        if(this.data.history){
            this.el.find('.ui-history').css('visibility','visible');
        }
        let yearData = {
            multiSelect:false,
            editable:this.data.is_view?false:true,
            onSelect:function(data){
                if(data.length==0 || _this.data.isInit){
                    return;
                }
                _this.actions.changeValue(data[0]['id'],_this);
            },
            choosed:[],
        } ;
        let monthData = {
            multiSelect:false,
            editable:this.data.is_view?false:true,
            onSelect:function(data){
                if(data.length==0 || _this.data.isInit){
                    return;
                }
                _this.actions.changeValue(data[0]['id'],_this);
            },
            choosed:[],
        } ;
        let myDate = new Date();
        let myYear = myDate.getFullYear();
        if(!yearData.list || !yearData.list.length){
            yearData.list=[];
        }
        yearData.list.push({ "name": String(myYear),"id": String(myYear)})
        for( let i=1;i<=5;i++ ){
            yearData.list.unshift( { "name": String(myYear - i),"id": String(myYear - i)} );
            yearData.list.push( { "name": String(myYear + i),"id": String(myYear + i)} );
        }
        monthData.list = [
            {"name": 1,"id": '01'},
            {"name": 2,"id": '02'},
            {"name": 3,"id": '03'},
            {"name": 4,"id": '04'},
            {"name": 5,"id": '05'},
            {"name": 6,"id": '06'},
            {"name": 7,"id": '07'},
            {"name": 8,"id": '08'},
            {"name": 9,"id": '09'},
            {"name": 10,"id": 10},
            {"name": 11,"id": 11},
            {"name": 12,"id": 12}
        ]
        if(this.data.value != ''){
            yearData['choosed'][0] = {name:this.data.value.split('-')[0],id:this.data.value.split('-')[0]};
            monthData['choosed'][0] = {name:this.data.value.split('-')[1],id:this.data.value.split('-')[1]};
            if (this.data.is_view) {
                this.el.find('.year').attr('title', yearData['choosed'][0].name);
                this.el.find('.month').attr('title', monthData['choosed'][0].name)
            }

        }
        else{
            // yearData['choosed'][0] = {name:myYear,id:myYear};
            // monthData['choosed'][0] = {name:myDate.getMonth() + 1,id:myDate.getMonth() + 1};
        }
        this.destroyChildren();
        this.append(new AutoSelect(yearData),this.el.find('.year'));
        this.append(new AutoSelect(monthData),this.el.find('.month'));
        this.data.isInit=false;
    },
    beforeDestory(){
        this.el.off();
    }
}
export default class YearMonthControl extends Component{
    constructor(data,events,newConfig){
        super($.extend(true,{},config,newConfig),data,events)
    }
}