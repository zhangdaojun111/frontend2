import Component from "../../../lib/component";
import template from './data-table-page.html';
import './data-table-page.scss';
import {HTTP} from "../../../lib/http";
import dataTableAgGrid from "../data-table-page/data-table-agGrid/data-table-agGrid"
import {dataTableService} from "../../../services/dataGrid/data-table.service"
let config = {
    template: template,
    data: {
        tableId:'',
        tableName:'',
        isRenderIntrain: false
    },
    actions: {
        //获取在途数据
        getInProcessNum: function () {
            dataTableService.getInProcessNum( {table_id: this.data.tableId} ).then( res=>{
                console.log( "_________________" )
                console.log( "_________________" )
                console.log( res )
            } )
            HTTP.flush();
        }
    },
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
        //获取在途数据
        this.actions.getInprocessData();
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