import {BiBaseComponent} from '../../../bi.base.component';

import template from "./dialog.create.html";
import "./dialog.create.scss";

let config = {
    template:template,
    afterRender() {

    }
};

class DialogCreateComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }
}

export const dialogCreateSetting = {
    el: null,
    show: function() {
        let component = new DialogCreateComponent();
        this.el = $('<div id="dialog-create">').appendTo(document.body);
        component.render(this.el);
        this.el.dialog({
            title: '新建视图',
            width: 348,
            height: 217,
            modal: true,
            close: function() {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide: function () {
        this.el.dialog('close');
    }
}