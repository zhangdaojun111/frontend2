import Component from "../../../lib/component";
import template from './data-table-page.html';
import './data-table-page.scss';
import {HTTP} from "../../../lib/http";
import {PMAPI,PMENUM} from '../../../lib/postmsg';
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
                this.el.find( '.inProcessNum' )[0].innerHTML = res.total || 0;
            } )
            HTTP.flush();
        },
        //添加点击事件
        addClick: function () {
            this.el.find( '.tabTitle .left' ).on( 'click',()=>{
                this.el.find( '.left' ).addClass( 'active' );
                this.el.find('.right').removeClass('active');
                this.el.find( '.page-group .dataTableAgGrid' )[0].style.display = 'block';
                this.el.find( '.page-group .dataTableInTransit' )[0].style.display = 'none';
            } )
            this.el.find( '.tabTitle .right' ).on( 'click',()=>{
                this.el.find( '.left' ).removeClass( 'active' );
                this.el.find('.right').addClass('active');
                this.el.find( '.page-group .dataTableAgGrid' )[0].style.display = 'none';
                this.el.find( '.page-group .dataTableInTransit' )[0].style.display = 'block';
                //渲染在途
                if( !this.data.isRenderIntrain ){
                    let obj = {
                        tableId: this.data.tableId,
                        tableName: this.data.tableName,
                        tableType: 'in_process',
                        viewMode: 'in_process'
                    };
                    this.append(new dataTableAgGrid(obj), this.el.find('#data-table-in-process'));
                    this.data.isRenderIntrain = true;
                }
            } )
        }
    },
    afterRender: function (){
        let json = {
            tableId: this.data.tableId,
            tableName: this.data.tableName
        };
        this.append(new dataTableAgGrid(json), this.el.find('#data-table-agGrid'));

        this.actions.addClick();
        //获取在途数据
        this.actions.getInProcessNum();

        //订阅数据失效
        PMAPI.subscribe(PMENUM.on_the_way_invalid, (info) => {
            let tableId = info.data.table_id;
            if( this.data.tableId == tableId ){
                console.log( '在途数量失效刷新' );
                this.actions.getInProcessNum();
            }
        })
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