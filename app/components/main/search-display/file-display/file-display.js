import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './file-display.scss';
import template from './file-display.html';



let config = {
    template:template,
    data:{
        searchData:{},
    },
    actions:{
        initInfo:function () {
            this.el.find('p.table-name').html(this.data.searchData.label);
            this.el.find('div.attachment-name').html(this.data.searchData.file_name);
        }
    },
    afterRender:function () {
        this.actions.initInfo();
    },
    beforeDestory:function () {

    }
};

class FileResult extends Component{
    constructor(data){
        super(config);
        this.data.searchData = data;
    }
}

export const FileDisplay = {
    el:null,
    create:function (data,$father) {
        console.log("do create");
        this.el = $("<div class='file-container'>").appendTo($father);
        let component = new FileResult(data);
        component.render(this.el);
    }
};