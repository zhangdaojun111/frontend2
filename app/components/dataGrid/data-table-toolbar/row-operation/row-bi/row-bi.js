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
        params: [],
        //字段信息
        fieldsMap: [],
        //当前的数据
        currentData: []
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
            this.data.currentData = currentRowData;
            this.data.params.rowId = currentRowData['_id'];
            this.actions.calcClick();
        },
        //拼装字段信息
        pickFiled() {
            let cols = this.data.params.columnsList
            cols.forEach(obj => {
                let dict = {value: obj.field,label: obj.name};
                this.data.fieldsMap.push(dict);
            })
            let html = '';
            for( let d of this.data.fieldsMap ){
                html+= '<option value='+ d.value + '>' + d.label + '</option>';
            }
            let choose = this.el.find( '.fieldsMap' )
            choose[0].innerHTML = html;
        },
        //改变字段属性
        changeFields: function () {
            let val = this.el.find( '.fieldsMap' )[0].value;
            this.el.find( '.fieldsVal' )[0].innerHTML = this.data.currentData[val]
        },
        //判断是否可以点击上一条或者下一条数据
        calcClick: function () {
            this.el.find( '.prev' ).removeClass( 'cantClick' )
            this.el.find( '.next' ).removeClass( 'cantClick' )
            let allData = this.data.params.allRowData;
            let index = 0;
            allData.forEach((item, idx) => {
                if ( item._id == this.data.params.rowId ) {
                    index = idx;
                }
            })
            if( index == 0 ){
                this.el.find( '.prev' ).addClass( 'cantClick' )
            }
            if( index == (allData.length - 1) ){
                this.el.find( '.next' ).addClass( 'cantClick' )
            }
        },
        //打开BI
        openBIIframe: function (quick_page) {
            let obj = this.data.params;
            let url = `/bi/index/?parent_table_id=${obj.parent_table_id}&row_id=${obj.rowId}&operation_id=${obj.operation_id}&folder_id=&query_mark=single`;
            if(quick_page) {
                url += '&quick_page=1';
            }
            this.el.find( '.bi-con' )[0].innerHTML = '';
            let iframe = document.createElement( 'iframe' );
            iframe.src = url;
            this.el.find( '.bi-con' ).append( iframe );
            console.log( "row-bi-url" )
            console.log( url )
        },
    },
    binds: [
        {
            event: 'change',
            selector: '.fieldsMap',
            callback: function () {
                this.actions.changeFields();
                let json = {
                    table_id: this.data.params.parent_table_id,
                    row_bi_show_field: this.el.find( '.fieldsMap' )[0].value
                }
                dataTableService.getBIField( json ).then( data=>{

                } )
            }
        },
        {
            event: 'click',
            selector: '.prev',
            callback: function () {
                if( this.el.find( '.prev' )[0].className.indexOf( 'cantClick' )!=-1 ){
                    return
                }
                this.actions.findCurrentData( 'prev' );
                this.actions.changeFields();
                this.actions.openBIIframe( true )
            }
        },
        {
            event: 'click',
            selector: '.next',
            callback: function () {
                if( this.el.find( '.next' )[0].className.indexOf( 'cantClick' )!=-1 ){
                    return
                }
                this.actions.findCurrentData( 'next' );
                this.actions.changeFields();
                this.actions.openBIIframe( true )
            }
        }
    ],
    afterRender: function (){
        PMAPI.getIframeParams(window.config.key).then((res) => {
            this.data.params = res.data;
            let json = {
                table_id: this.data.params.parent_table_id,
                action: 'get'
            }
            dataTableService.getBIField( json ).then( data=>{
                this.actions.findCurrentData();
                //拼装字段信息
                this.actions.pickFiled();
                this.el.find( '.fieldsMap' )[0].value = data['row_bi_show_field'];
                this.actions.changeFields();
                this.actions.openBIIframe();
            } )
        })
    }
}

class rowBi extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default rowBi;