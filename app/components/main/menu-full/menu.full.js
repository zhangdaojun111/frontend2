import Component from '../../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';
import {FullMenuItem} from './item/item';

let config = {
    template: template,
    data: {
        list: [],
        text: '',
        type: 'full',
        listComp:[],
    },
    actions: {
        /**
         * 根据搜索框内容过滤菜单
         * @param text
         */
        search: function (text) {
            this.data.text = text;
            this.data.listComp.forEach(comp=>{
                comp.actions.filter(this.data.text);
            })

        },
        hide: function() {
            this.el.hide();
        },
        show: function() {
            this.el.show();
            this.actions.countHeight();
        },
        countHeight: function() {
            $(window).trigger('resize.menu');
        },
        /**
         * 正常模式下的菜单显示
         */
        setSizeToFull: function () {
            this.el.removeClass('mini');
            this.data.type = 'full';
            let allChildren = this.findAllChildren();
            allChildren.forEach((item) => {
                item.actions.setToFull();
            });
            this.actions.countHeight();
        },
        /**
         * 迷你模式下的菜单显示
         */
        setSizeToMini: function () {
            this.el.addClass('mini');
            this.data.type = 'mini';
            let allChildren = this.findAllChildren();
            allChildren.forEach((item) => {
                item.actions.setToMini();
            });
            this.actions.countHeight();
        },
        /**
         * 开启编辑模式后的菜单显示
         */
        startEditModel: function () {
            this.el.find('.custom-checkbox').show();
            this.el.find('.search').addClass('edit');
            this.el.find('.menu-full').addClass('edit');
            this.el.find('.menu-full-item > .row.full').addClass('edit');
            this.actions.countHeight();
        },
        /**
         * 退出编辑模式后的菜单显示
         */
        cancelEditModel: function () {
            this.el.find('.custom-checkbox').hide();
            this.el.find('.search').removeClass('edit');
            this.el.find('.menu-full').removeClass('edit');
            this.el.find('.menu-full-item > .row.full').removeClass('edit');
            this.actions.countHeight();
        },
        /**
         * 获取被勾选的常用item
         * @returns {Array}
         */
        getSelected: function () {
            let choosed = this.el.find('input:checkbox:checked.leaf[key]');
            let res = Array.from(choosed).map((item) => {
                return $(item).attr('key');
            });
            _.remove(res, function (i) {
                return i === '0';
            });
            return res;
        },
        /**
         * 根据菜单数据创建item，形成树形菜单
         */
        renderMenuList: function () {
            this.destroyChildren();
            this.data.listComp = [];
            this.data.list.forEach((data) => {
                let component = new FullMenuItem(_.defaultsDeep({}, data, {
                    root: true,
                    offset: 0,
                    type: this.data.type
                }));
                this.append(component, this.$root, 'li');
                this.data.listComp.push(component);
            });
        }
    },

    binds: [
        {
            event: 'input',
            selector: 'label.search input:text',
            callback: _.debounce(function(context) {
                this.actions.search(context.value);
            }, 200)
        },
        {
            event:'focus',
            selector:'label.search input',
            callback:function (context) {
                $(context).parent().addClass('highlight');
            }
        },
        {
            event:'blur',
            selector:'label.search input',
            callback:function (context) {
                $(context).parent().removeClass('highlight');
            }
        }
    ],

    afterRender: function () {
        this.$root = this.el.find('.root');
        this.actions.renderMenuList();
        // this.el.find('.search input:text').focus();
        this.actions.countHeight();
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
};

class MenuComponent extends Component {
    constructor(data,events,newConfig){
        super($.extend(true,{},config,newConfig),data,events)
    }
}


export {MenuComponent};