/**
 * Created by birdyy on 2017/9/11.
 * 画布header视图列表menu
 */
import Component from '../../../../../../lib/component';
import template from './canvas.header.menu.html';


let config = {
    template: template,
    data: {
        id: '',
        name: ''
    },
    actions: {
        focus(){
            this.el.find('a').addClass('active');
            let brothers = this.findBrothers();
            brothers.forEach((item) => {
                item.actions.blur();
            });
            this.data.isCurrent = true;
        },
        blur(){
            this.el.find('a').removeClass('active');
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