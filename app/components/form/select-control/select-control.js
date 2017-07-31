import Component from '../../../lib/component'
import DropDown from "../vender/dropdown/dropdown";

let config={
    template:'<div class="dropdown"></div>',
    data:{

    },
    actions:{

    },
    firstAfterRender:function(){
        this.append(new DropDown(this.data),this.el.find('.dropdown'));
    }
}
export default class SelectControl extends Component{
    constructor(data){
        super(config,data);
    }
}