/**
 * Created by zhr
 */
import {FullMenuItem as FullMenuItemOld} from '../../../../../../../app/components/main/menu-full/item/item'

let config = {
    data: {
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
        },
        /**
         * 设置checkbox的值
         * @param value
         */
        setCheckboxValue: function (value) {
            if (this.ownCheckbox.length) {
                this.ownCheckbox[0].checked = value;
            }
        },
        checkChildrenChecked: function () {
            let allCheckbox = this.el.find('.childlist input:checkbox');
            let allChecked = this.el.find('.childlist input:checked');
            if (allCheckbox.length === allChecked.length) {
                this.actions.setCheckboxValueSelf(true);
            }
        },
        /**
         * 隐藏未选中目录
         */
        hideUnchoiceItem: function (el) {
            for (let item of window.config.commonUse.data) {
                console.log(el.attr('key'))
                if (item == el.attr('key')) {
                    this.el.find('> .menu-full-item').show()
                    return false
                } else {
                    if (this.el.find('> .childList')) {
                        this.childlist.show();
                    }
                    this.el.find('> .menu-full-item').hide();
                }
            }
        }
    },
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
            } else {
                this.data.key = this.data.ts_name;
            }
            if (window.config.commonUse.data.indexOf(this.data.key) !== -1) {
                this.actions.onCheckboxChange({checked: true});
            }
            this.ownCheckbox.attr('key', this.data.key);
        } else {
            if (this.data.table_id && this.data.table_id !== '' && this.data.table_id !== "0") {
                this.data.key = this.data.table_id;
            } else {
                this.data.key = this.data.name_py;
            }
            this.ownCheckbox.attr('key', this.data.key);
        }
        this.ownCheckbox.addClass('leaf');
        if (this.data.common) {
            this.actions.hideUnchoiceItem(this.ownCheckbox)
        }
        if (this.data.items) {
            this.data.items.forEach((data) => {
                let check = false, width = 20;
                if (this.data.common) {
                    if (data.items) {
                        for (let item of window.config.commonUse.data) {
                            if (item == data.name_py) {
                                check = true;
                            }
                        }
                        if (!check) {
                            width = 0;
                        }
                    }
                }
                let newData = _.defaultsDeep({}, data, {
                    root: false,
                    offset: this.data.offset + 20,
                    type: this.data.type,
                    common: this.data.common
                });

                let component = new FullMenuItem(newData, {
                    onSubCheckboxChange: function (value) {
                        that.actions.checkChildrenChecked();
                    }
                });
                this.append(component, this.childlist, 'li');
                this.data.listComp.push(component);
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
}

class FullMenuItem extends FullMenuItemOld {
    constructor(data,events){
        super(data,events,config);
    }
}
export {FullMenuItem};