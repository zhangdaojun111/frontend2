/**
 * Created by birdyy on 2017/9/11.
 * 画布header视图列表menu
 */
import Component from '../../../../../../lib/component';
import template from './canvas.header.menu.html';
import './canvas.header.menu.scss';

let config = {
    template: template,
    data: {
        id: '',
        name: '',
    },
    actions: {
        focus(){
            this.el.find('a').addClass('active');
            this.el.find('i').addClass('tabs-menu-active-icon');
            let brothers = this.findBrothers();
            brothers.forEach((item) => {
                item.actions.blur();
            });
            this.data.isCurrent = true;
        },
        blur(){
            this.el.find('a').removeClass('active');
            this.el.find('i').removeClass('tabs-menu-active-icon');
            this.data.isCurrent = false;
        }
    },
    binds: [
        {
            event: 'click',
            selector: '',
            callback: function () {
                this.actions.focus();
            }
        }
    ],
    afterRender() {
        console.log(this.data.isCurrent);
        if (this.data.isCurrent) {
            this.el.find('a').addClass('active');
        }
    }
};

export class CanvasHeaderMenuComponent extends Component {
    constructor(data, events) {
        super(config, data, events);
    }
}