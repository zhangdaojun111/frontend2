import Component from '../../../lib/component';
let config={
    template:`<div style="display: inline-block">{{label}}</div>
               {{#group}}
                    <input type="radio" value="{{this.value}}" name="{{this.name}}"/>{{this.label}}
                {{/group}}
                `,
    data:{
    },
    actions:{
    },
}
class RadioControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default RadioControl