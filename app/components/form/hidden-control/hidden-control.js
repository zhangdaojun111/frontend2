import Component from '../../../lib/component';
let config={
    template:`<div style="display: inline-block">{{lable}}隐藏 </div>
              <input type="hidden" value="{{value}}" />             
                `,
    data:{

    },
    actions:{
    },
}
class HiddenControl extends Component {
    constructor(data){
        super(config,data);
    }
}

export default HiddenControl