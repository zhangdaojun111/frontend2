import Component from '../../../lib/component'
import DropDown from '../vender/dropdown/dropdown'
import Mediator from '../../../lib/mediator'
import template from './year-control.html'

let config={
    template:template,
    data:{
        options:[],
    },
    firstAfterRender(){
        let _this=this;
        Mediator.subscribe('form:dropDownSelect:'+_this.data.tableId,function(data){
            if(data.dfield !=_this.data.dfield || !_this.data.required){
                return;
            }
            _this.data.value=data.value;
            _.debounce(function(){Mediator.publish('form:changeValue:'+_this.data.tableId,_this.data)},200)();
        });
        this.el.on('click','.ui-history',function(){
            _.debounce(function(){Mediator.publish('form:history:'+_this.data.tableId,_this.data)},300)();
        });
    },
    afterRender(){
        if(!this.data.be_control_condition) {
            this.destroyChildren();
            this.append(new DropDown(this.data), this.el.find('.dropdown'));
        }
    },
    beforeDestory(){
        Mediator.removeAll('form:dropDownSelect:'+this.data.tableId);
        Mediator.removeAll('form:changeValue:'+this.data.tableId);
        Mediator.removeAll('form:history:'+this.data.tableId);
    }
}
export default class YearControl extends Component{
    constructor(data){
        let myDate = new Date();
        let myYear = myDate.getFullYear();
        for( let i=5;i>=-10;i-- ){
            config.data.options.push( { "label": String(myYear + i),"value": String(myYear + i),"tableId":data.tableId} );
        }
        config.data.options.unshift({"label":"请选择","value":"请选择"});
        if(data.value){
            data.showValue=data.value;
        }
        super(config,data);
    }
}