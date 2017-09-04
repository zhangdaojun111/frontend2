import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './single-display.scss';
import template from './single-display.html';
import {PMAPI} from '../../../../lib/postmsg';


let config = {
    template:template,
    data:{
        searchData:{},
    },
    actions:{
        initInfo:function () {
            this.el.find('span.data-content').html(this.data.searchData.label);
            this.el.find('span.data-count').html(this.data.searchData.row_num);
        },
        penetrateToGrid:function () {
            //穿透到ag-grid
            let tableId = this.data.searchData.table_id;
            let keyword = this.data.searchData.label;
            PMAPI.openDialogByIframe(`/datagrid/source_data_grid/?tableId=${tableId}&keyword=${keyword}&viewMode=keyword&tableType=keyword`,{
                width:1200,
                height:700,
                title:`${this.data.searchData.label}`,
                modal:true
            })
        }
    },
    binds:[
        {
            event:'click',
            selector:'.single-box',
            callback:function () {
                this.actions.penetrateToGrid();
            }
        }
    ],
    afterRender:function () {
        this.actions.initInfo();
        // let that = this;
        // this.el.on('click','.single-box',() => {
        //     that.actions.penetrateToGrid();
        // })
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
        this.el = $("<div class='single-container'>").appendTo($father);
        let component = new SingleResult(data);
        component.render(this.el);
    }
};