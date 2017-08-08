import Component from "../../../lib/component";
import template from './item.html';
import './item.scss';

import Mediator from '../../../lib/mediator';

let config = {
    template: template,

    actions: {
        delete: function() {
            Mediator.publish('comment:get', 'destroy');
            this.destroySelf();
        }
    },

    afterRender: function() {
        this.el.on('click', 'input', () => {
            this.actions.delete();

        });
    }
}

class Item extends Component {
        config.data = data;
        super(config);
    }

}

export default Item;