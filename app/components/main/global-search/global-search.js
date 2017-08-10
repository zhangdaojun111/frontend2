import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './global-search.scss';
import template from './global-search.html';
import msgbox from '../../../lib/msgbox';


let config ={
    template:template,
    data:{},
    actions:{

    },
    afterRender:function () {

    },
    beforeDestory:function () {
    }
};


class GlobalSearch extends  Component{
    constructor(){
        super(config);
    }
}

export {GlobalSearch}

