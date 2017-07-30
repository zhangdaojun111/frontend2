import Component from '../../../../lib/component';
import template from './item.html';

import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data: {},
    actions: {
        search: function() {

        },
        onItemClick: function() {
            if (this.data.children && this.data.children.length) {
                if (this.data.display === true) {
                    this.el.find('> .menu-full-item > .list').hide();
                    this.data.display = false;
                } else {
                    this.el.find('> .menu-full-item > .list').show();
                    this.data.display = true;
                }
            } else {
                Mediator.emit('menu:item:openiframe', {
                    id: this.data.id,
                    name: this.data.name,
                    url: this.data.url
                })
            }

        }
    },
    afterRender: function () {
        if (this.data.children) {
            this.data.children.forEach((data) => {
                let newData = _.defaultsDeep({}, data, {
                    root: false,
                    offset: this.data.offset + 20
                });
                this.append(new FullMenuItem(newData), this.el.find('> .menu-full-item > .list'));
            })
        }
        if (this.data.root !== true) {
            this.el.find('> .menu-full-item > .row').css({
                'padding-left': this.data.offset + 'px'
            })
        }
        this.el.on('click', '> .menu-full-item > .row', () => {
            this.actions.onItemClick();
        })

    },
    beforeDestory: function () {

    }
}

class FullMenuItem extends Component {
    constructor(data) {
        super(config, data)
    }
}

export {FullMenuItem};