import Component from "../../../lib/component";
import template from './data-table-page.html';
import './data-table-page.scss';

import dataTableAgGrid from "../data-table-page/data-table-agGrid/data-table-agGrid"
let config = {
    template: template,
    data: {
        tableId:'',
        tableName:'',
        isRenderIntrain: false
    },
    actions: {},
    afterRender: function (){
        let json = {
            tableId: this.data.tableId,
            tableName: this.data.tableName
        };
        this.append(new dataTableAgGrid(json), this.el.find('#data-table-agGrid'));
        $('.tabContent').eq(0).show();
        $('.tabTitle li').click(function() {
            let i = $('.tabTitle li').index(this);
            $('.tabContent').hide();
            $('.tabContent').eq(i).show().siblings().hide();

        });
        $('.left-active').click(function () {
            $(this).addClass('active');
            $('.right-active').removeClass('active');
        });
        $('.right-active').click(function () {
            $(this).addClass('active');
            $('.left-active').removeClass('active');
        });
        //渲染在途
        this.el.on( 'click','.dataTableInTransit',()=>{
            if( !this.data.isRenderIntrain ){
                let obj = {
                    tableId: this.data.tableId,
                    tableName: this.data.tableName,
                    tableType: 'in_process',
                    viewMode: 'in_process'
                };
                this.append(new dataTableAgGrid(obj), this.el.find('.dataTableInTransitCon'));
                this.data.isRenderIntrain = true;
            }
        } )
    }
};


class dataTablePage extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default dataTablePage;