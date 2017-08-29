/**
 * Created by birdyy on 2017/8/24.
 * name item
 */

import template from './item.html';
import {BiBaseComponent} from '../../../../bi.base.component';
import handlebars from 'handlebars'

handlebars.registerHelper("itemJsonString",function(item,options){
    return JSON.stringify(item);
});
let config = {
    template: template,
    data: {
        items: [],

    },
    actions:{

    },

    binds:[],
    afterRender() {
        let me = this;
        this.el.find('li').each(function(index,element){
            $(this).data('item',me.data.items[index]);
        })

    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class AutoCompleteItemComponent extends BiBaseComponent {
    constructor() {
        super(config);
    }

}