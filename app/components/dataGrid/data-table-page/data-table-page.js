import Component from "../../../lib/component";
import template from './data-table-page.html';
import './data-table-page.scss';
import {HTTP} from "../../../lib/http";
import {PMAPI,PMENUM} from '../../../lib/postmsg';
import dataTableAgGrid from "./data-table-agGrid/data-table-agGrid";
import {dataTableService} from "../../../services/dataGrid/data-table.service";
let config = {
    template: template,
    data: {
        tableId:'',
        tableName:'',
        isRenderIntrain: false,
        firatShowHelp: false,
        //刷新在途
        refreshOnTheWay: true
    },
    actions: {
        //获取在途数据
        getInProcessNum: function () {
            let inProcess = dataTableService.getInProcessNum( {table_id: this.data.tableId} )
            let arr = [inProcess];
            // if( !this.data.firatShowHelp ){
            //     let help = dataTableService.getHelpData( {is_form:1,table_id:this.data.tableId,type:0} )
            //     arr.push( help );
            // }
            Promise.all(arr).then((res)=> {
                this.el.find( '.inProcessNum' )[0].style.display = res[0].total? 'block':'none';
                try{this.inProcessGrid.actions.getInprocessData()}catch(e){}
                // if( !this.data.firatShowHelp ){
                //     if(typeof res[1].data != "object"){
                //         if(res[1].data != ""){
                //             this.el.find( '.dataTableHelp' )[0].style.display = 'flex';
                //         }
                //     }
                // }
                // this.data.firatShowHelp = true;
            })
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
                    this.actions.showTabs(0);
                    let obj = {
                        tableId: this.data.tableId,
                        tableName: this.data.tableName,
                        tableType: 'in_process',
                        viewMode: 'in_process',
                        gridTips: '在途'
                    };
                    this.inProcessGrid = new dataTableAgGrid(obj);
                    this.append(this.inProcessGrid, this.el.find('#data-table-in-process'));
                    this.data.isRenderIntrain = true;
                }
            } )
        },
        //显示tabs
        showTabs: function (opacity) {
            this.el.find( '.page-tab' )[0].style.opacity = opacity;
        }
    },
    afterRender: function (){
        let json = {
            tableId: this.data.tableId,
            tableName: this.data.tableName,
            showTabs: this.actions.showTabs,
            gridTips: '数据'
        };
        this.append(new dataTableAgGrid(json), this.el.find('#data-table-agGrid'));
        this.actions.addClick();
        //获取在途数据
        this.actions.getInProcessNum();

        //订阅数据失效
        PMAPI.subscribe(PMENUM.one_the_way_invalid, (info) => {
            let tableId = info.data.table_id;
            if( this.data.tableId == tableId ){
                console.log( '在途数量失效刷新' );
                if( this.data.refreshOnTheWay ){
                    this.actions.getInProcessNum();
                    this.data.refreshOnTheWay = false;
                    // msgBox.showTips( '表：《' + this.data.tableName + '》在途数据失效。'  );
                    setTimeout( ()=>{
                        this.data.refreshOnTheWay = true;
                    },200 )
                }
            }
        })
        //是否显示帮助
        let help = window.config.sysConfig.logic_config.use_help || '0';
        if( help == 1 ){
            this.el.find( '.dataTableHelp' )[0].style.display = 'flex';
        }
    }
};


class dataTablePage extends Component {
    // constructor(data) {
    //     for (let d in data) {
    //         config.data[d] = data[d]
    //     }
    //     super(config);
    // }
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default dataTablePage;