/**
 * @author yangxiaochuan
 * 行级BI
 */
import Component from "../../../../../lib/component";
import template from './row-bi.html';
import './row-bi.scss';
import {PMAPI,PMENUM} from '../../../../../lib/postmsg';
import msgBox from '../../../../../lib/msgbox';
import {HTTP} from "../../../../../lib/http";

import {dataTableService} from "../../../../../services/dataGrid/data-table.service";

let config = {
    template: template,
    data: {
        //从aggrid传过来的数据
        params: []
    },
    actions: {
        //找当前行的数据
        findCurrentData: function ( type ) {
            let currentRowData;
            let allData = this.data.params.allRowData;
            this.data.params.allRowData.forEach((item,idx) => {
                if(item._id == this.data.params.rowId) {
                    if(type == 'prev') {
                        currentRowData = allData[idx-1];
                    }else if(type == 'next') {
                        currentRowData = allData[idx+1];
                    }else {
                        currentRowData = allData[idx];
                    }
                }
            })
            return currentRowData;
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.original-data-btn',
            callback: function () {
                this.trigger('onShowOriginal');
            }
        }
    ],
    afterRender: function (){
        PMAPI.getIframeParams(window.config.key).then((res) => {
            console.log( "______________________" )
            console.log( "______________________" )
            console.log( res )
            this.data.params = res.data;
            let json = {
                table_id: this.data.parent_table_id,
                action: 'get'
            }
            dataTableService.getBIField( json ).then( data=>{
                console.log( '返回的BI数据' )
                console.log( data )
                let currentData = this.actions.findCurrentData();
                let obj = {
                    selectedField: data['row_bi_show_field'],
                    parent_table_id: this.data.params.parent_table_id,
                    rowId: this.data.params.rowId,
                    operation_id: this.data.params.operation_id,
                    allRowData: this.data.params.allRowData,
                    columnsList: this.data.params.columnsList,
                    currentRowData: currentData,
                    isShowBI: true,
                    selectedFieldValue: currentData[data['row_bi_show_field']]
                }
                let url = `/bi/index/?parent_table_id=${obj.parent_table_id}&row_id=${obj.rowId}&operation_id=${obj.operation_id}&folder_id=&query_mark=`;
                console.log( "______________________" )
                console.log( "______________________" )
                console.log( url )
                let iframe = document.createElement( 'iframe' );
                iframe.src = url;
                this.el.find( '.bi-con' ).append( iframe );
            } )
        })
    }
}

class rowBi extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default rowBi;