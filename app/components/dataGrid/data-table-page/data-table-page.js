import Component from "../../../lib/component";
import template from './data-table-page.html';
import './data-table-page.scss';
import {HTTP} from "../../../lib/http";
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import dataTableAgGrid from "../data-table-page/data-table-agGrid/data-table-agGrid"
import fastSearch from "../data-table-toolbar/fast-search/fast-search"
import {dataTableService} from "../../../services/dataGrid/data-table.service"
let config = {
    template: template,
    data: {
        tableId:'',
        tableName:'',
        isRenderIntrain: false,
        firatShowHelp: false
    },
    actions: {
        //获取在途数据
        getInProcessNum: function () {
            let inProcess = dataTableService.getInProcessNum( {table_id: this.data.tableId} )
            let arr = [inProcess];
            if( !this.data.firatShowHelp ){
                let help = dataTableService.getHelpData( {is_form:1,table_id:this.data.tableId,type:0} )
                arr.push( help );
            }
            Promise.all(arr).then((res)=> {
                this.el.find( '.inProcessNum' )[0].style.display = res[0].total? 'block':'none';
                if( !this.data.firatShowHelp ){
                    if(typeof res[1].data != "object"){
                        if(res[1].data != ""){
                            this.el.find( '.dataTableHelp' )[0].style.display = 'flex';
                        }
                    }
                }
                this.data.firatShowHelp = true;
            })
            // dataTableService.getInProcessNum( {table_id: this.data.tableId} ).then( res=>{
            //     this.el.find( '.inProcessNum' )[0].style.display =res.total? 'block':'none';
            // } )
            HTTP.flush();
        },
        //添加点击事件
        addClick: function () {
            this.el.find( '.tabTitle .dataTableAgGrid' ).on( 'click',()=>{
                this.el.find( '.dataTableAgGrid' ).addClass( 'active' );
                this.el.find('.dataTableInTransit').removeClass('active');
                this.el.find( '.page-group .dataTableAgGrid' )[0].style.display = 'block';
                this.el.find( '.page-group .dataTableInTransit' )[0].style.display = 'none';
            } )
            this.el.find( '.tabTitle .dataTableInTransit' ).on( 'click',()=>{
                this.el.find( '.dataTableAgGrid' ).removeClass( 'active' );
                this.el.find('.dataTableInTransit').addClass('active');
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