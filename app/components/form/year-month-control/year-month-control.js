import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';
import template from './year-month-control.html'
import {AutoSelect} from "../../util/autoSelect/autoSelect"

let config={
    template:template,
    actions:{
      changeValue(value){
          let val = 0;
          if( value > 12 ){
              val =value + "-" + this.data.value.split('-')[1];
          }
          else{
              val = this.data.value.split('-')[0] + "-" + value;
          }
          _this.data.value = val;
          _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
      }
    },
    firstAfterRender(){
        let _this=this;
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
        let _this=this;
        let yearData = {
            multiSelect:false,
            onSelect:function(data){
                if(data.length==0){
                    return;
                }
                _this.actions.changeValue(data[0]['id']);
            }
        } ;
        let monthData = {
            multiSelect:false,
            onSelect:function(data){
                if(data.length==0){
                    return;
                }
                _this.actions.changeValue(data[0]['id']);
            }
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
            {"name": 1,"id": 1},
            {"name": 2,"id": 2},
            {"name": 3,"id": 3},
            {"name": 4,"id": 4},
            {"name": 5,"id": 5},
            {"name": 6,"id": 6},
            {"name": 7,"id": 7},
            {"name": 8,"id": 8},
            {"name": 9,"id": 9},
            {"name": 10,"id": 10},
            {"name": 11,"id": 11},
            {"name": 12,"id": 12}
        ]
        if(this.data.value != ''){
            yearData.value = this.data.value.split('-')[0]
            monthData.value = this.data.value.split('-')[1]
        }
        else{
            yearData.value = myYear;
            monthData.value = myDate.getMonth() + 1;
        }
        this.destroyChildren();
        this.append(new AutoSelect(yearData),this.el.find('.year'));
        this.append(new AutoSelect(monthData),this.el.find('.month'));
    },
    beforeDestory(){
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}
export default class YearMonthControl extends Component{
    constructor(data){
        super(config,data);
    }
}