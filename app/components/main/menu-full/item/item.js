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
        showChildrenAtFull: function() {
            this.childlist.show();
            this.iconWrap.removeClass('ui-state-focus').addClass('ui-state-active');
            this.icon.removeClass('ui-icon-caret-1-e').addClass('ui-icon-caret-1-s');
            this.data.display = true;
            this.findBrothers().forEach((brother) => {
                brother.actions.hideChildrenAtFull();
            });
        },
        hideChildrenAtFull: function() {
            this.childlist.hide();
            this.iconWrap.removeClass('ui-state-active').addClass('ui-state-focus');
            this.icon.removeClass('ui-icon-caret-1-s').addClass('ui-icon-caret-1-e');
            this.data.display = false;
        },
        onItemClickAtFull: function() {
            if (this.data.items && this.data.items.length) {
                if (this.data.type === 'full') {
                    if (this.data.display === true) {
                        this.actions.hideChildrenAtFull();
                    } else {
                        this.actions.showChildrenAtFull();
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
        },
        showChildrenAtMini: function () {
            window.clearTimeout(this.data.timer);
            if (this.childlist.length) {
                this.childlist.show();
                let height = this.childlist.height();
                let position = this.childlist.offset();
                let screenHeight = $('body').height();
                if ((position.top + height) > screenHeight) {
                    this.childlist.removeClass('top').addClass('bottom');
                } else {
                    this.childlist.removeClass('bottom').addClass('top');
                }
            }
        },
        hideChildrenAtMini: function () {
            window.clearTimeout(this.data.timer);
            this.data.timer = window.setTimeout(() => {
                this.childlist.hide();
            }, 500)
        },
        onItemClickAtMini: function () {
            if (_.isUndefined(this.data.items)) {
                let key = this.data.ts_name || this.data.table_id;
                Mediator.emit('menu:item:openiframe', {
                    id: key,
                    name: this.data.label,
                    url: this.data.url
                });
            }
        }
    },
    binds:[
        {
            event: 'click',
            selector: '> .menu-full-item > .row.full',
            callback: function (context, event) {
                if (!$(event.target).is('input')) {
                    this.actions.onItemClickAtFull();
                }
            }
        }, {
            event: 'mouseenter',
            selector: null,
            callback: function () {
                this.actions.showChildrenAtMini();
            }
        }, {
            event: 'mouseleave',
            selector: null,
            callback: function () {
                this.actions.hideChildrenAtMini();
            }
        }, {
            event: 'click',
            selector: '> .menu-full-item > .row.mini',
            callback: function () {
                this.actions.onItemClickAtMini();
            }
        }
    ],
    afterRender: function () {
        // 子菜单
        this.childlist = this.el.find('> .childlist');
        // 自己
        this.row = this.el.find('> .menu-full-item > .row');
        this.iconWrap = this.el.find('> .menu-full-item > .row > .icon');
        this.icon = this.iconWrap.find('> .ui-icon');

        this.row.addClass(this.data.type);
        if (this.data.type === 'full') {
            this.el.off('mouseenter');
            this.el.off('mouseleave');
        }

        if (this.data.items) {
            this.data.items.forEach((data) => {
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
        if (this.data.root !== true ) {
            if (this.data.type === 'full') {
                let offset = this.data.offset;
                if (this.data.items) {
                    offset = this.data.offset - 20;
                }
                this.row.css({
                    'padding-left': offset + 20 + 'px'
                })
            } else {
                let offset = 30;
                if (this.data.items) {
                    offset = 10;
                }
                this.row.css({
                    'padding-left': offset + 'px',
                    'padding-right': '20px'
                })
            }
        }
    }
}

class FullMenuItem extends Component {
    constructor(data) {
        super(config, data)
    }
}

export {FullMenuItem};