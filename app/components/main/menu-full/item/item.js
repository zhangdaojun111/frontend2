import Component from '../../../../lib/component';
import template from './item.html';
let config = {
    template: template,
    data: {},
    actions: {},
    afterRender: function() {
        if (this.data.child) {
            this.data.child.forEach((data) => {
                debugger;
                this.append(new FullMenuItem(data), this.el.find('> .menu-full-item > .list'));
            })
        }
    },
    beforeDestory: function() {

    }
}

class FullMenuItem extends Component {
    constructor(data){
        super(config, data)
    }
}

export {FullMenuItem};