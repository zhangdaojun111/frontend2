import Component from "../../../lib/component";
import template from './leftContext.SelectLabel.html';
import './leftContext.SelectLabel.scss';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    actions: {
       
    },

    afterRender: function() {
        
    }
}

class Item extends LeftContentSelect {
    constructor(data){
        config.data = data;
        super(config);
    }

}

export default LeftContentSelect;