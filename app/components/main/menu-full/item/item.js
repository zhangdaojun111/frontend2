import Component from '../../../../lib/component';
import template from './item.html';
import Mediator from '../../../../lib/mediator';
import 'jquery-ui/ui/widgets/tooltip';
import './item.scss';

let config = {
    template: template,
    data: {
        type: 'full',
        expandChild: false
    },

    actions: {
        /**
         * 正常模式下显示孩子菜单
         */
        showChildrenAtFull: function () {
            this.childlist.show();
            this.iconWrap.removeClass('ui-state-focus').addClass('ui-state-active');
            this.icon.removeClass('ui-icon-caret-1-e').addClass('ui-icon-caret-1-s');
            this.data.display = true;
            this.findBrothers().forEach((brother) => {
                brother.actions.hideChildrenAtFull();
            });
        },
        /**
         * 隐藏孩子菜单
         */
        hideChildrenAtFull: function () {
            this.childlist.hide();
            this.iconWrap.removeClass('ui-state-active').addClass('ui-state-focus');
            this.icon.removeClass('ui-icon-caret-1-s').addClass('ui-icon-caret-1-e');
            this.data.display = false;
        },
        /**
         * 正常模式下点击item，显示其下孩子菜单或打开对应iframe（编辑模式下点击不打开iframe）
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
                console.log(this.data);
                if (this.data.ts_name == '' && this.data.table_id == "0") {
                    return;
                }
                if (this.data.url && this.data.url !== ''){
                    Mediator.emit('menu:item:openiframe', {
                        id: this.data.namespace,
                        name: this.data.label,
                        url: this.data.url,
                        flag:false,
                    });
                }
            } else {
                //编辑模式下不再打开tab
                if(event.currentTarget.className.indexOf('edit') > 0){
                    return;
                }
                if (this.data.ts_name == '' && this.data.table_id == "0") {
                    return;
                }
                let key;
                if (this.data.table_id && this.data.table_id !== '' && this.data.table_id !== "0") {
                    key = this.data.table_id;
                }else{
                    key = this.data.ts_name;
                }
                Mediator.emit('menu:item:openiframe', {
                    id: key,
                    name: this.data.label,
                    url: this.data.url
                });
            }
        },
        /**
         * 迷你菜单模式下
         */
        showChildrenAtMini: function (event) {
            // window.clearTimeout(this.data.timer);
            if (this.childlist.length) {
                this.childlist.show();
                //获取文档高度
                let documentHeight= $(document).height();
				let position = $(event).position();
                let screenHeight = $('body').height();
                let parentPos = $(event).parent().css('position') == 'fixed'?($(event).parent().position()):{top:0,left:0};
                let top = position.top + parentPos.top;
				let left = position.left + parentPos.left + Math.ceil($(event).outerWidth());
                if(this.childlist.height() >= (documentHeight - top)){
					this.childlist.css({
						bottom:0,
						left:left
					})
                } else {
					this.childlist.removeClass('bottom').addClass('top');
					this.childlist.css({
						top:top,
						left:left
					})

				}
                // if ((position.top + this.childlist.height()) > screenHeight) {
                //     this.childlist.removeClass('top').addClass('bottom');
                //     this.childlist.css({
                //         bottom:0,
                //         left:left
                //     })
                // }
            }
        },
        /**
         * 迷你菜单下隐藏子菜单
         */
        hideChildrenAtMini: function () {
            // window.clearTimeout(this.data.timer);
            // this.data.timer = window.setTimeout(() => {
                this.childlist.hide();
            // }, 500)
        },
        /**
         * 迷你菜单下点击item打开iframe
         */
        onItemClickAtMini: function () {
            if (_.isUndefined(this.data.items)) {
                let key;
                if (this.data.table_id && this.data.table_id !== '' && this.data.table_id !== "0") {
                    key = this.data.table_id;
                }else{
                    key = this.data.ts_name;
                }
                Mediator.emit('menu:item:openiframe', {
                    id: key,
                    name: this.data.label,
                    url: this.data.url
                });
            }
        },
        /**
         * 编辑模式勾选checkbox
         * @param context
         * @param event
         */
        onCheckboxChange: function (context, event) {
            let value = context.checked;
            this.actions.setCheckboxValue(value);
            this.trigger('onSubCheckboxChange', value);
        },
        /**
         * 设置checkbox的值
         * @param value
         */
        setCheckboxValue: function (value) {
            if (this.ownCheckbox.length) {
                this.ownCheckbox[0].checked = value;
            }
            this.subComponents.forEach((comp) => {
                comp.actions.setCheckboxValue(value);
            })
        },
        /**
         * 设置点击的item的checkbox的值
         * @param value
         */
        setCheckboxValueSelf: function (value) {
            if (this.ownCheckbox.length) {
                this.ownCheckbox[0].checked = value;
            }
        },
        /**
         * 设置点击的item的子菜单checkbox的值
         */
        checkChildrenChecked: function () {
            let allCheckbox = this.el.find('.childlist input:checkbox');
            let allChecked = this.el.find('.childlist input:checked');
            if (allCheckbox.length === allChecked.length) {
                this.actions.setCheckboxValueSelf(true);
            } else {
                this.actions.setCheckboxValueSelf(false);
            }
        },
        /**
         * 正常模式的item显示
         */
        setToFull: function () {
            this.data.type = 'full';
            this.cancelEvents();
            this.bindEvents();
            this.el.off('mouseenter');
            this.el.off('mouseleave');
            this.row.css({
                'padding-left': this.data.fullOffsetLeft + 'px',
                'padding-right': '0'
            });
        },
        /**
         * 迷你模式的item显示
         */
        setToMini: function () {
            this.data.type = 'mini';
            this.cancelEvents();
            this.bindEvents();
            this.actions.hideChildrenAtFull();
            let offset = 30;
            if (this.data.items) {
                offset = 10;
            }
            this.row.css({
                'padding-left': offset + 'px',
                'padding-right': '20px'
            });
        }
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
        }, {
            event: 'mouseenter',
            selector: null,
            callback: function (event) {
                this.actions.showChildrenAtMini(event);
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
        }, {
            event: 'change',
            selector: '> .menu-full-item .custom-checkbox input:checkbox',
            callback: function (context, event) {
                this.actions.onCheckboxChange(context, event);
            }
        }
    ],
    afterRender: function () {
        this.ownCheckbox = this.el.find('> .menu-full-item .custom-checkbox input:checkbox');
        // 子菜单
        this.childlist = this.el.find('> .childlist');
        // 自己
        this.row = this.el.find('> .menu-full-item > .row');
        this.iconWrap = this.el.find('> .menu-full-item > .row > .icon');
        this.icon = this.iconWrap.find('> .ui-icon');
        this.row.addClass(this.data.type);
        let that = this;
        if (this.data.type === 'full') {
            this.el.off('mouseenter');
            this.el.off('mouseleave');
        }

        if (_.isUndefined(this.data.items)) {
            if (this.data.table_id && this.data.table_id !== '' && this.data.table_id !== "0") {
                this.data.key = this.data.table_id;
            }else{
                this.data.key = this.data.ts_name;
            }
            if (window.config.commonUse.data.indexOf(this.data.key) !== -1) {
                this.actions.onCheckboxChange({checked: true});
            }
            this.ownCheckbox.addClass('leaf').attr('key', this.data.key);
        }

        if (this.data.items) {
            this.data.items.forEach((data) => {
                let newData = _.defaultsDeep({}, data, {
                    root: false,
                    offset: this.data.offset + 20,
                    searchDisplay: true,
                    type: this.data.type
                });

                let component = new FullMenuItem(newData, {
                    onSubCheckboxChange: function (value) {
                        that.actions.checkChildrenChecked();
                    }
                });
                this.append(component, this.childlist, 'li');
            });
        }
        if (this.data.root !== true) {
            if (this.data.type === 'full') {
                let offset = this.data.offset;
                if (this.data.items) {
                    offset = this.data.offset - 20;
                }
                this.data.fullOffsetLeft = offset + 20;
                this.row.css({
                    'padding-left':  this.data.fullOffsetLeft + 'px'
                })
            }
        }
        if (this.data.expandChild) {
            // this.data.expandChild = true;
            this.childlist.show();
            // this.actions.showChildrenAtFull();
        }
    }
};

class FullMenuItem extends Component {
    constructor(data, event) {
        super(config, data, event)
    }
}

export {FullMenuItem};