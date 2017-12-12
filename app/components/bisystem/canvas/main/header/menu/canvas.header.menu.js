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
            //发送通知给canvas.header组件 删除隐藏的更多目录框的选中状态
            this.trigger('onClearActive');
        },
    },

    binds: [],
    afterRender() {}
};

export let CanvasHeaderMenuComponent = Component.extend(config);

// export class CanvasHeaderMenuComponent extends Component {
//     constructor(data, events,extendConfig) {
//         super($.extend(true,{},config,extendConfig), data, events);
//     }
// }