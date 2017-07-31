import Component from '../../../lib/component';
let config={
    template:`<div style="display: inline-block">{{label}}</div>
              <input type="textarea" value="{{value}}" style=" height: 100px;  color: rgb(0, 0, 0); width: 100%;"/>
                `,
    data:{
        label:'',
        vale:'',
    },
    actions:{
    },
}
class TextAreaControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default TextAreaControl