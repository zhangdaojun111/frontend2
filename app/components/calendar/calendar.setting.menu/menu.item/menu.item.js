/**
 * Created by zj on 2017/9/15.
 */
import Component from '../../../../lib/component';
import template from './menu.item.html';
import Mediator from '../../../../lib/mediator';
import 'jquery-ui/ui/widgets/tooltip';

let config = {
    template: template,
    data: {
        type: 'full',
        expandChild: false
    },

    actions: {
        /**
         * 显示菜单
         */
        showChildrenAtFull: function () {
            this.childlist.show();
            // this.iconWrap.removeClass('ui-state-focus').addClass('ui-state-active');
            this.icon.removeClass('ui-icon-caret-1-e').addClass('ui-icon-caret-1-s');
            this.data.display = true;
            // this.findBrothers().forEach((brother) => {
            //     brother.actions.hideChildrenAtFull();
            // });
        },
        /**
         * 隐藏菜单
         */
        hideChildrenAtFull: function () {
            this.childlist.hide();
            // this.iconWrap.removeClass('ui-state-active').addClass('ui-state-focus');
            this.icon.removeClass('ui-icon-caret-1-s').addClass('ui-icon-caret-1-e');
            this.data.display = false;
        },
        /**
         * 点击菜单
         * @param event
         */
        onItemClickAtFull: function (event) {
            if (this.data.items && this.data.items.length) {
                if (this.data.type === 'full') {
                    if (this.data.display === true) {
                        this.actions.hideChildrenAtFull();
                    } else {
                        this.actions.showChildrenAtFull();
                    }
                }
            } else {
                Mediator.emit(
                    'calendar-set-left:calendar-set',
                    {
                        table_id: this.data['table_id'],
                        label: this.data['label'],
                    });
            }
        },
    },
    binds: [
        {
            event: 'click',
            selector: '> .menu-full-item > .row.full',
            callback: function (context, event) {
                if (!$(event.target).is('input')) {
                    this.actions.onItemClickAtFull(event);
                }
            }
        },
    ],
    afterRender: function () {
        // 子菜单
        this.childlist = this.el.find('> .childlist');
        // 自己
        this.row = this.el.find('> .menu-full-item > .row');
        this.iconWrap = this.el.find('> .menu-full-item > .row > .icon');
        this.icon = this.iconWrap.find('> .ui-icon');
        this.row.addClass(this.data.type);
        this.icon.removeClass('ui-icon-caret-1-e').addClass('ui-icon-caret-1-s');
        if (this.data.items) {
            this.data.items.forEach((data) => {
                data.display = true;
                let newData = _.defaultsDeep({}, data, {
                    root: false,
                    offset: this.data.offset + 20,
                    searchDisplay: true,
                    type: this.data.type
                });
                let component = new FullMenuItem(newData);
                this.append(component, this.childlist, 'li');
            });
        }
        if (this.data.root !== true) {
            if (this.data.type === 'full') {
                let offset = this.data.offset;
                if (this.data.items) {
                    offset = this.data.offset;
                }
                this.row.css({
                    'padding-left': offset + 'px'
                })
            }
        }
        if (this.data.expandChild) {
            // this.data.expandChild = true;
            this.childlist.show();
            // this.actions.showChildrenAtFull();
        }

    }
}

class FullMenuItem extends Component {
    constructor(data, event) {
        super(config, data, event)
    }
}

export {FullMenuItem};