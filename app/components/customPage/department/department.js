/**
 * @author yangxiaochuan
 * 部门信息定制表
 */

import Component from "../../../lib/component";
import template from './department.html';
import './department.scss';
import {HTTP} from "../../../lib/http";
import msgBox from '../../../lib/msgbox';
import {PMAPI,PMENUM} from '../../../lib/postmsg';

import agGrid from '../../../components/dataGrid/agGrid/agGrid';
import {dataTableService} from '../../../services/dataGrid/data-table.service';
import {dgcService} from "../../../services/dataGrid/data-table-control.service";
import exportSetting from '../../dataGrid/data-table-toolbar/data-table-export/data-table-export';
import customColumns from "../../dataGrid/data-table-toolbar/custom-columns/custom-columns";

let config = {
    template: template,
    data: {
        tableId:'',
        tableName:'',
        columnDefs: [],
        rowData:[],
        //定制列（列宽）
        colWidth: {},
        //定制列（固定列）
        fixCols: {l: [], r: []},
        //定制列（列排序）
        orderFields: [],
        //定制列（隐藏列）
        ignoreFields: [],
        //定制列需要字段信息
        customColumnsFields: [],
        isShowCustomPanel: false,
    },
    actions: {
        //创建表头数据
        createHeader: function () {
            let obj = {
                actions: JSON.stringify(['ignoreFields', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                table_id: this.data.tableId
            }
            let preferenceData = dataTableService.getPreferences( obj );
            let columnData = dataTableService.getColumnList( {table_id: this.data.tableId} );
            Promise.all([preferenceData,columnData]).then((res)=> {
                dgcService.setPreference( res[0],this.data );
                this.data.columnDefs = [
                    dgcService.numberCol,dgcService.selectCol,
                    {headerName: '操作',field: 'myOperate', width: 120,  suppressSorting: true,suppressResize: true,suppressMenu: true, cellRenderer: (param)=>{
                        return '<div style="text-align:center;"><a class="departModify" style="color:#337ab7;">编辑</a><div>';
                    }},
                    { headerName: '部门', field: 'f5',cellRenderer: 'group',suppressMenu: true, tooltipField:'f5' }
                ]
                this.data.customColumnsFields = [{name:'序号',field:'number',canhide:false,candrag:false,canFix:false},
                    {name:'选择',field:'mySelectAll',canhide:false,candrag:false,canFix:false},
                    {name:'操作',field:'myOperate',canhide:true,candrag:true,canFix:true}]
                for( let col of res[1].rows ){
                    if( col.field == '_id' ){
                        continue;
                    }
                    let obj = {
                        headerName: col.name,
                        field: col["field"],
                        enableCellChangeFlash: true,
                        suppressMenu: true,
                        suppressToolPanel: true,
                        colId: col["field"],
                        tooltipField: col["field"],
                        sortingOrder: ['desc', 'asc', null],
                        width: col.width,
                        hide: false,
                        minWidth: 20,
                        cellStyle: {'font-style': 'normal'},
                        enableRowGroup: true,
                        suppressSorting: true,
                        suppressResize: false,
                        suppressMovable: false,
                        suppressFilter: true
                    }
                    let c = {
                        canhide:true,candrag:true,canFix:true
                    };
                    c['name'] = col.name;
                    c['field'] = col.field;
                    this.data.customColumnsFields.push(c)
                    this.data.columnDefs.push( obj );
                }
                let gridData = {
                    columnDefs: this.data.columnDefs,
                    rowData: this.data.rowData,
                    onColumnResized: this.actions.onColumnResized,
                    onSortChanged: this.actions.onSortChanged,
                    onDragStopped: this.actions.onDragStopped,
                    onCellClicked: this.actions.onCellClicked,
                    onRowDoubleClicked: this.actions.onRowDoubleClicked
                }
                this.agGrid = new agGrid(gridData);
                this.append(this.agGrid , this.el.find('#data-agGrid'));
                dgcService.calcColumnState( this.data,this.agGrid,["number","mySelectAll","myOperate","f5"] )
                let custom = {
                    gridoptions: this.agGrid.gridOptions,
                    fields: this.data.customColumnsFields,
                    fixCols: this.data.fixCols,
                    tableId: this.data.tableId,
                    agGrid: this.agGrid
                }
                this.customColumnsCom  = new customColumns(custom);
                this.append(this.customColumnsCom, this.el.find('.custom-columns-panel'));
                this.actions.getDepartmentData(false);
                this.actions.btnClick();
            });
            HTTP.flush();
        },
        //获取部门数据
        getDepartmentData: function (isRefresh) {
            dataTableService.getDepartmentData().then( res=>{
                this.data.rowData = res.department_tree;
                let obj = {
                    rowData: this.data.rowData
                }
                this.agGrid.actions.setGridData( obj );
                if( isRefresh ){
                    msgBox.showTips( '刷新成功' );
                }
                this.el.find( '.departmentSratch' )[0].value = '';
            } )
            HTTP.flush();
        },
        //按钮点击事件
        btnClick: function () {
            //新增
            if( this.el.find( '.new-form-btn' )[0] ){
                this.el.find( '.new-form-btn' ).on( 'click',()=>{
                    let obj = {
                        table_id: this.data.tableId,
                        btnType: 'new'
                    }
                    let url = dgcService.returnIframeUrl( '/form/index/',obj );
                    this.actions.openSourceDataGrid( url,'新增' )
                } )
            }
            //删除
            if( this.el.find( '.grid-del-btn' )[0] ){
                this.el.find( '.grid-del-btn' ).on( 'click',()=>{
                    this.actions.delDepartment();
                } )
            }
            //刷新
            if( this.el.find( '.refresh-btn' )[0] ){
                this.el.find( '.refresh-btn' ).on( 'click',()=>{
                    this.actions.getDepartmentData(true);
                } )
            }
            //搜索
            let That = this;
            this.el.find( '.departmentSratch' ).on( 'input',_.debounce( ()=>{
                That.agGrid.gridOptions.api.setQuickFilter( That.el.find( '.departmentSratch' )[0].value );
            },1000 ) )
            //导出
            if( this.el.find( '.grid-export-btn' )[0] ){
                this.el.find( '.grid-export-btn' ).on( 'click',()=>{
                    let obj = {
                        tableId: this.data.tableId,
                        groupCheck: false,
                        hideOptions: ['isFilter']
                    }
                    for( let o in obj ){
                        exportSetting.data[o] = obj[o];
                    }
                    PMAPI.openDialogByComponent(exportSetting, {
                        width: 600,
                        height: 360,
                        title: '导出数据'
                    }).then((data) => {

                    });
                } )
            }
            //导入数据
            if( this.el.find( '.grid-import-btn' )[0] ){
                this.el.find('.grid-import-btn').on( 'click',()=>{
                    let json = {
                        tableId: this.data.tableId,
                        isSuperUser: window.config.is_superuser || 0
                    }
                    let url = dgcService.returnIframeUrl( '/iframe/dataImport/',json );
                    let winTitle = '导入数据';
                    this.actions.openSourceDataGrid( url,winTitle,600,800 );
                } )
            }
            //宽度自适应
            if( this.el.find( '.custom-column-btn' )[0] ){
                this.el.find( '.custom-column-btn' ).on( 'click',()=>{
                    this.el.find( '.custom-columns-panel' )[0].style.display = this.data.isShowCustomPanel?'none':'block';
                    this.data.isShowCustomPanel = !this.data.isShowCustomPanel;
                    let num = 0;
                    if( this.data.isShowCustomPanel ){
                        num+=200;
                    }
                    let grid = this.el.find( '#data-agGrid' )
                    grid.width( 'calc(100% - ' + num + 'px)' );
                } )
            }
        },
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title,w,h ) {
            PMAPI.openDialogByIframe( url,{
                width: w || 1300,
                height: h || 800,
                title: title,
                modal:true
            } ).then( (data)=>{
            } )
        },
        onColumnResized: function ($event) {
            this.customColumnsCom.actions.onColumnResized( this.customColumnsCom );
        },
        onDragStopped: function ($event) {
            this.customColumnsCom.actions.onFix();
            this.customColumnsCom.actions.dragAction();
        },
        onSortChanged: function ($event) {
        },
        onRowDoubleClicked: function ($event) {
            let obj = {
                table_id: this.data.tableId,
                btnType: 'view',
                real_id: $event.data._id,
            }
            let url = dgcService.returnIframeUrl( '/form/index/',obj );
            this.actions.openSourceDataGrid( url,'查看' )
        },
        onCellClicked: function ($event) {
            if( $event.colDef.headerName == '操作' ){
                if( $event.event.srcElement.className == 'departModify' ){
                    let obj = {
                        table_id: this.data.tableId,
                        btnType: 'edit',
                        real_id: $event.data._id,
                    }
                    let url = dgcService.returnIframeUrl( '/form/index/',obj );
                    this.actions.openSourceDataGrid( url,'编辑' )
                }
            }
        },
        //删除数据
        delDepartment: function () {
            let arr = [];
            let rows = this.agGrid.gridOptions.api.getSelectedRows();
            for( let r of rows ){
                if( r._id ){
                    arr.push( r._id );
                }
            }
            if( arr.length == 0 ){
                msgBox.alert( '请选择数据' )
                return;
            }
            msgBox.confirm( '确定删除？' ).then( res=>{
                if( res ){
                    let json = {
                        table_id:this.data.tableId,
                        real_ids:JSON.stringify( arr ),
                        is_batch: 0
                    }
                    dataTableService.delTableData( json ).then( res=>{
                        if( res.success ){
                            msgBox.showTips( '删除成功' )
                        }else {
                            msgBox.alert( res.error )
                        }
                    } )
                    HTTP.flush();
                }
            } )
        }
    },
    afterRender: function (){
        this.actions.createHeader();
    }
}

class department extends Component {
    constructor(data) {
        for( let d in data ){
            config.data[d] = data[d];
        }
        super(config);
    }
}

export default department;