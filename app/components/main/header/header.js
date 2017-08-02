import Component from '../../../lib/component';
import template from './header.html';
import './header.scss';
import 'jquery-ui/ui/widgets/tooltip';
import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    data: {
        asideSize: 'full'
    },
    actions: {
        setSizeToFull: function () {
            this.el.removeClass('mini');
        },
        setSizeToMini: function () {
            this.el.addClass('mini');
        }
    },
    afterRender: function () {
        this.el.tooltip();
        let that = this;
        this.el.on('click', '.fold', () => {
            that.data.asideSize = that.data.asideSize === 'full' ? 'mini' : 'full';
            Mediator.emit('aside:size', that.data.asideSize);
            if (that.data.asideSize === 'full') {
                this.actions.setSizeToFull();
            } else {
                this.actions.setSizeToMini();
            }
        });
    }
}

export const HeaderInstance = new Component(config);