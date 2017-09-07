import Component from '../../../../lib/component';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<label class="search-check-row flex" data-id="{{id}}">
        <div class="search-check-item custom-radio J_name">
            <input type="radio" name="addUser" value="{{id}}">
        </div>
        <div class="search-check-item J_name">{{name}}</div>
        <div class="search-check-item J_name">{{username}}</div>
    </label>`,
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