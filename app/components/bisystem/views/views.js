import {BiBaseComponent} from '../bi.base.component';

import template from "./views.html";
import "./views.scss";

let ViewsConfig = {
    template:template,

    actions:{

    },

    afterRender:function (){
        $('.nav-list a').each(function () {
            $(this).on('click',function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            })
        })
    }
};

class ViewsComponent extends BiBaseComponent{
    constructor() {
        super(ViewsConfig)
    }
}

export default ViewsComponent;
