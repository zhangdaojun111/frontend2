import Component from '../../../../lib/component';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<div class="flex" data-id="{{id}}">
        <input class="w33" type="radio" name="addUser" value="{{id}}">
        <div class="w33">{{name}}</div>
        <div class="w33">{{username}}</div>
    </div>`,
    data:{},
    action:{

    },
    afterRender(){
    
    }
};
class AddSigner extends Component{
    constructor (data){
        super(config,data);
    }
}

export default AddSigner;