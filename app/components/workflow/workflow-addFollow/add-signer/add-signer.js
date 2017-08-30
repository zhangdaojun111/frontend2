import Component from '../../../../lib/component';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<div class="search-check-row flex" data-id="{{id}}">
        <div class="search-check-item custom-radio">
        <input type="radio" name="addUser" value="{{id}}">
        </div>
        <div class="search-check-item">{{name}}</div>
        <div class="search-check-item">{{username}}</div>
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