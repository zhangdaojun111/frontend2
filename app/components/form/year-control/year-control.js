import Component from '../../../lib/component'
import DropDown from '../vender/dropdown/dropdown'

let config={
    template:`<div class="dropdown"></div>`,
    data:{
        options:[],
    },
    firstAfterRender:function(){
        console.log(this.options);
        this.append(new DropDown(this.data),this.el.find('.dropdown'));
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