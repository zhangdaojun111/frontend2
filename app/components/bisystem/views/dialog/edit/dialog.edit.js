import {BiBaseComponent} from '../../../bi.base.component';

import template from './dialog.edit.html';
// import "./dialog.edit.scss";

let css =`
    body {
        background:red;
    }
`
export let config = {
    template:template,
    data: {},
    afterRender() {
        console.log($('.inp-val').val());
    },
    beforeDestory: function () {
        alert('hello 我要销毁了');
    }
};


// class DialogEditComponent extends BiBaseComponent{
//     constructor() {
//         super(config);
//     }
// }
//
// export const dialogEditSetting = {
//     el: null,
//     show: function() {
//         let component = new DialogEditComponent();
//         this.el = $('<div id="dialog-create">').appendTo(document.body);
//         component.render(this.el);
//         this.el.dialog({
//             title: '编辑视图',
//             width: 348,
//             height: 217,
//             modal: true,
//             close: function() {
//                 $(this).dialog('destroy');
//                 component.destroySelf();
//             }
//         });
//     },
//     hide: function () {
//         this.el.dialog('close');
//     }
// }