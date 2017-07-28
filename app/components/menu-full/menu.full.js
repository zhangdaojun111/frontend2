import Component from '../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';

import ItemComponent from './item/item';

let config = {
    template: template,
    data: {
        list: [

        ]
    },
    actions: {},
    afterRender: () => {

    },
    beforeDestory: () => {

    }
}

class FullMenu extends Component {
    constructor() {
        super(config);
    }
}

export { FullMenu };