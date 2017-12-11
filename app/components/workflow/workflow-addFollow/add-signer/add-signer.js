import Component from '../../../../lib/component';
import Mediator from '../../../../lib/mediator';

let config={
    template: `<label class="search-check-row flex" data-id="{{id}}">
        <div class="search-check-item custom-radio J_name">
            <input type="radio" name="addUser" value="{{id}}">
        </div>
        <div class="search-check-item J_name" title="{{name}}">{{name}}</div>
        <div class="search-check-item J_name" title="{{username}}">{{username}}</div>
    </label>`,
    data:{},
    action:{

    },
    afterRender(){
    
    }
};
let AddSigner = Component.extend(config);
export default AddSigner