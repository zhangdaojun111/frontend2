import template from './commonuse.html';
import './commonuse.scss';
import Component from '../../../lib/component';
import 'jquery-ui/ui/widgets/dialog';
import TreeView from '../../util/tree/tree';
import {HTTP} from '../../../lib/http';
import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    data: {
        selected: []
    },
    actions: {
        handle: function (event, node) {
            if (event === 'select') {
                this.actions.select(node);
            } else {
                this.actions.unselect(node);
            }
        },
        select: function (node) {
            let that = this;

            function func(node) {
                if (node.nodes) {
                    node.nodes.forEach((n) => {
                        func(n);
                    });
                } else {
                    let key = node.ts_name || node.table_id;
                    that.data.selected.push(key);
                }
            }

            func(node);
        },
        unselect: function (node) {
            let that = this;

            function func(node) {
                if (node.nodes) {
                    node.nodes.forEach((n) => {
                        func(n);
                    });
                } else {
                    let key = node.ts_name || node.table_id;
                    _.remove(that.data.selected, (_key) => {
                        return _key === key;
                    })
                }
            }

            func(node);
        },
        save: async function () {
            HTTP.postImmediately('/user_preference/', {
                action: "save",
                pre_type: "8",
                content: "1"
            });
            HTTP.postImmediately('/user_preference/', {
                action: "save",
                pre_type: "7",
                content: JSON.stringify(this.data.selected)
            });
            window.config.commonUse.data = this.data.selected;
            Mediator.emit('commonuse:change');
            commonuse.hide();
            // if (saveRes.success == 1) {
            //     let newCommonUse = await HTTP.postImmediately('/user_preference/', {
            //         action: "get",
            //         pre_type: "7"
            //     });
            // }
        },
        formatOriginData: function () {
            let menu = _.defaultsDeep([], window.config.menu);
            let commonUse = _.defaultsDeep([], window.config.commonUse.data);

            function func(nodes) {
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    let key = node.ts_name || node.table_id;
                    node.text = node.label;
                    node.icon = '';
                    node.selectedIcon = '';
                    node.backColor = "#FFFFFF";
                    node.selectable = false;
                    node.state = {
                        checked: commonUse.indexOf(key) !== -1,
                        disabled: false,
                        expanded: true,
                        selected: commonUse.indexOf(key) !== -1,
                    };
                    node.tags = ['available'];
                    node.nodes = node.items;
                    const children = node.items;
                    if (children && children.length > 0) {
                        func(children);
                    }
                }
            }
            func(menu);
            return {
                menu: menu,
                commonUse: commonUse
            };
        }
    },
    firstAfterRender: function () {

        let originData = this.actions.formatOriginData();
        this.data.selected = originData.commonUse;
        this.data.menu = originData.menu;

        let treeView = new TreeView({data:{treeNodes:this.data.menu, options:{
            callback: (event, node) => {
                this.actions.handle(event, node);
                console.log(this.data.selected)
            },
            treeType: "MULTI_SELECT",
            treeName: "menu-tree"
        },indent:0}});
        let $container = this.el.find("div.menu-tree");
        treeView.render($container);
        this.el.on('click', '.save button', () => {
            this.actions.save();
        })
    }
}

class CommonUse extends Component {
    constructor(newConfig) {
        super($.extend(true,{},config,newConfig));
    }
}

export const commonuse = {
    el: null,
    show: function () {
        let component = new CommonUse();
        this.el = $('<div>').appendTo(document.body);
        component.render(this.el);
        this.el.dialog({
            title: '常用菜单设置',
            width: 600,
            height: 600,
            modal: true,
            close: function () {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide: function () {
        if (this.el) {
            this.el.dialog('close');
        }
    }
}
// commonuse.show();