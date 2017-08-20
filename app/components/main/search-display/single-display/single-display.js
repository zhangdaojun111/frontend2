import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './single-display.scss';
import template from './single-display.html';


let config = {
    template:template,
    data:{
        searchData:{},
    },
    actions:{
        initInfo:function () {
            this.el.find('span.data-content').html(this.data.searchData.label);
            this.el.find('span.data-count').html(this.data.searchData.row_num);
        }
    },
    afterRender:function () {
        this.actions.initInfo();
        this.el.on('click','.data-content',() => {

        })
    },
    beforeDestory:function () {

    }
};

class SingleResult extends Component{
    constructor(data){
        super(config);
        this.data.searchData = data;
    }
}

export const SingleDisplay = {
    el:null,
    create:function (data,$father) {
        console.log("do create");
        this.el = $("<div class='single-container'>").appendTo($father);
        let component = new SingleResult(data);
        component.render(this.el);
    }
};