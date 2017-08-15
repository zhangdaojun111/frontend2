import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";
import Mediator from '../../../lib/mediator';
import template from './year-month-control.html'
import {AutoSelect} from "../../util/autoSelect/autoSelect"

let config={
    template:template,
    data:{
        isInit:true,
    },
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
                if(data.length==0 && _this.data.isInit){
                    return;
                }
                _this.actions.changeValue(data[0]['id'],_this);
            },
            choosed:[],
        } ;
        let monthData = {
            multiSelect:false,
            onSelect:function(data){
                if(data.length==0 && _this.data.isInit){
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
        }
        else{
            yearData['choosed'][0] = {name:myYear,id:myYear};
            monthData['choosed'][0] = {name:myDate.getMonth() + 1,id:myDate.getMonth() + 1};
        }
        this.destroyChildren();
        this.append(new AutoSelect(yearData),this.el.find('.year'));
        this.append(new AutoSelect(monthData),this.el.find('.month'));
        this.data.isInit=false;
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