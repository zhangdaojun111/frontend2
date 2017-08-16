import Component from '../../../lib/component';
let config={
    template:`
                <div style="display: none">             
                       <input style="width: 240px"  type="hidden" value="{{value}}"> 
               </div>         
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