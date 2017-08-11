import Component from '../../../../lib/component';
import template from './item.html';
import Mediator from '../../../../lib/mediator';
import 'jquery-ui/ui/widgets/tooltip';

let config = {
    template: template,
    data: {
        type: 'full'
    },

    actions: {
        showChildren: function() {
            this.el.find('> .list').show();
            this.el.find('> .menu-full-item > .row .icon').removeClass('ui-state-focus').addClass('ui-state-active');
            this.el.find('> .menu-full-item > .row > .icon > .ui-icon').removeClass('ui-icon-caret-1-e').addClass('ui-icon-caret-1-s');
            this.data.display = true;
            this.findBrothers().forEach((brother) => {
                brother.actions.hideChildren();
            });
        },
        hideChildren: function() {
            this.el.find('> .list').hide();
            this.el.find('> .menu-full-item > .row > .icon').removeClass('ui-state-active').addClass('ui-state-focus');
            this.el.find('> .menu-full-item > .row > .icon > .ui-icon').removeClass('ui-icon-caret-1-s').addClass('ui-icon-caret-1-e');
            this.data.display = false;
        },
        onItemClick: function() {
            if (this.data.items && this.data.items.length) {
                if (this.data.type === 'full') {
                    if (this.data.display === true) {
                        this.actions.hideChildren();
                    } else {
                        this.actions.showChildren();
                    }
                }
            } else {
                let key = this.data.ts_name || this.data.table_id;
                Mediator.emit('menu:item:openiframe', {
                    id: key,
                    name: this.data.label,
                    url: this.data.url
                });
            }
        }
    },
    afterRender: function () {
        if (this.data.items) {
            this.data.items.forEach((data) => {
                let newData = _.defaultsDeep({}, data, {
                    root: false,
                    offset: this.data.offset + 20,
                    searchDisplay: true
                });
                let component = new FullMenuItem(newData);
                this.append(component, this.el.find('> .list'), 'li');
            })
        }
        if (this.data.root !== true) {
            let offset = this.data.offset;
            if (this.data.items) {
                offset = this.data.offset - 20;
            }
            this.el.find('> .menu-full-item > .row').css({
                'padding-left': offset + 20 + 'px'
            })
        }
        this.el.on('click', '> .menu-full-item > .row', () => {
            this.actions.onItemClick();
        });
    },
    firstAfterRender: function () {
        Mediator.on('aside:size', (order) => {
            if (this.data) {
                this.data.type = order;
            }
        });
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