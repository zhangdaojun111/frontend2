import Component from '../../../lib/component';
import template from './header.html';
import './header.scss';
import 'jquery-ui/ui/widgets/tooltip'

let config = {
    template: template,
    data: {},
    actions: {},
    afterRender: function() {
        this.el.tooltip();
    }
}

export const HeaderInstance = new Component(config);