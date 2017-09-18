/**
 * Created by zj on 2017/9/15.
 */

import Component from '../../../lib/component';
import template from './setting.menu.html';
import './setting.menu.scss';
import {FullMenuItem} from './menu.item/menu.item';

let config = {
    template: template,
    data: {
        list: [],
        text: '',
        type: 'full'
    },
    actions: {
        renderMenuList: function () {
            this.destroyChildren();
            this.data.list.forEach((data) => {
               data.display = false;
                let component = new FullMenuItem(_.defaultsDeep({}, data, {
                    root: true,
                    offset: 0,
                    searchDisplay: true,
                    type: this.data.type
                }));
                this.append(component, this.$root, 'li');
            });
        }
    },

    binds: [
    ],

    afterRender: function () {
        this.$root = this.el.find('.root');
        this.actions.renderMenuList();
        // this.el.find('.search input:text').focus();
    },
    firstAfterRender: function() {
        this.originData = _.cloneDeep(this.data.list);
        $(window).on('resize.menu', () => {
            let menu = this.el.find('.menu-full');
            menu.css({
                height:0
            });
            menu.css({
                height: (document.body.scrollHeight - menu.offset().top) + 'px'
            });
        });
    },
    beforeDestory: () => {
        $(window).off('resize.menu')
    }
}

class SettingMenuComponent extends Component {
    constructor(data){
        super(config, data);
    }
}


export {SettingMenuComponent};