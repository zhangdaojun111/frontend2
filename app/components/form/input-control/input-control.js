import Component from '../../../lib/component';
let config={
    template:`<div style="display: inline-block">{{label}}</div>
<input type="text" class="{{class1}}" value="{{value}}"/>`,
    data:{
        class1:'required'
    },
    actions:{
    },
}
class InputControl extends Component {
    constructor(data){
        super(config,data);
        console.log(this.data);
    }
}

export default InputControl