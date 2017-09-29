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
import {TabService} from "../../../services/main/tabService";
import customColumns from "../../dataGrid/data-table-toolbar/custom-columns/custom-columns";

let config = {
    template: template,
    data: {
        tableId:'',
        tableName:'',
        columnDefs: [],
        rowData:[],
        footerData:[],
        fieldsData:[],
        //定制列（列宽）
        colWidth: {},
        //定制列（固定列）
        fixCols: {l: [], r: []},
        //定制列（列排序）
        orderFields: [],
        //上一次操作状态
        lastGridState: [],
        //定制列（隐藏列）
        ignoreFields: [],
        //定制列需要字段信息
        customColumnsFields: [],
        isShowCustomPanel: false,
        //订阅刷新用
        onRefresh: false,
        //第一次设置数据
        firstSetData: true,
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
                let number = dgcService.numberCol;
                number['headerCellTemplate'] = this.actions.resetPreference();
                this.data.columnDefs = [
                    number,dgcService.selectCol,
                    {headerName: '操作',field: 'myOperate', width: 120,  suppressSorting: true,suppressResize: true,suppressMenu: true, cellRenderer: (param)=>{
                        return '<div style="text-align:center;"><a class="ui-link" id="departView" style="color:#0088ff;">查看</a> | <a class="ui-link" id="departModify" style="color:#0088ff;">编辑</a><div>';
                    }},
                    { headerName: '部门', field: 'f5',cellRenderer: 'group',suppressMenu: true, tooltipField:'f5' }
                ]
                this.data.customColumnsFields = [{name:'序号',field:'number',canhide:false,candrag:false,canFix:false},
                    {name:'选择',field:'mySelectAll',canhide:false,candrag:false,canFix:false},
                    {name:'操作',field:'myOperate',canhide:true,candrag:true,canFix:true}]
                this.data.fieldsData = res[1].rows;
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
                    footerData: this.data.footerData,
                    fieldsData: this.data.fieldsData,
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
                    agGrid: this.agGrid,
                    close: this.actions.calcCustomColumn,
                }
                this.customColumnsCom  = new customColumns(custom);
                this.append(this.customColumnsCom, this.el.find('.custom-columns-panel'));
                this.actions.getDepartmentData(false);
                this.actions.btnClick();
            });
            HTTP.flush();
        },
        resetPreference: function () {
            let ediv = document.createElement('div');
            let eHeader = document.createElement('span');
            ediv.appendChild( eHeader )
            eHeader.innerHTML = "初";
            eHeader.className = "table-init-logo";
            eHeader.title = '初始化偏好'
            eHeader.addEventListener('click', () => {
                msgBox.confirm( '确定初始化偏好？' ).then( r=>{
                    if( r ){
                        dataTableService.delPreference( {table_id: this.data.tableId} ).then( res=>{
                            msgBox.showTips( '操作成功' );
                            let obj = {
                                actions: JSON.stringify(['ignoreFields', 'group', 'fieldsOrder', 'pageSize', 'colWidth', 'pinned']),
                                table_id: this.data.tableId
                            };
                            dataTableService.getPreferences( obj ).then( res=>{
                                dgcService.setPreference( res,this.data );
                                //创建表头
                                this.agGrid.gridOptions.api.setColumnDefs( this.data.columnDefs );
                                dgcService.calcColumnState( this.data,this.agGrid,["number","mySelectAll","myOperate","f5"] )
                                this.customColumnsCom.actions.makeSameSate();
                            } );
                            HTTP.flush();
                        } );
                        HTTP.flush();
                    }
                } )
            });
            return ediv;
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
                //第一次关闭loading
                if( this.data.firstSetData ){
                    this.hideLoading();
                    this.data.firstSetData = false;
                }
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
                        btnType: 'new',
                        is_view: 0
                    }
                    let url = dgcService.returnIframeUrl( '/form/index/',obj );
                    this.actions.openSelfIframe( url,'新增' )
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
                That.agGrid.actions.refreshView();
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
            if( this.el.find( '.grid-auto-width' )[0] ) {
                this.el.find('.grid-auto-width').on('click', () => {
                    if (!this.data.isAutoWidth) {
                        this.data.lastGridState = this.agGrid.gridOptions.columnApi.getColumnState();
                        this.agGrid.actions.autoWidth();
                    } else {
                        let state = this.agGrid.gridOptions.columnApi.getColumnState();
                        for (let s of state) {
                            for (let ls of this.data.lastGridState) {
                                if (s.colId == ls.colId) {
                                    s.width = ls.width;
                                    break;
                                }
                            }
                        }
                        this.agGrid.gridOptions.columnApi.setColumnState(state);
                    }
                    this.el.find('.grid-auto-width').find('span').html(!this.data.isAutoWidth ? '恢复默认' : '自适宽度');
                    this.data.isAutoWidth = !this.data.isAutoWidth;
                })
            }
            //定制列
            if( this.el.find( '.custom-column-btn' )[0] ){
                this.el.find( '.custom-column-btn' ).on( 'click',()=>{
                    this.actions.calcCustomColumn();
                } )
            }
            //点击关掉定制列panel
            this.el.find( '.ag-body' ).on( 'click',()=>{
                setTimeout( ()=>{
                    this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'-200px' } );
                },400 )
                this.data.isShowCustomPanel = false;
                this.actions.changeAgGridWidth(true);
            } )
            //新窗口显示隐藏
            if( this.data.isNewWindow ){
                this.el.find( '.grid-new-window' )[0].style.display = 'none';
            }
        },
        //定制列事件
        calcCustomColumn: function () {
            this.data.isShowCustomPanel = !this.data.isShowCustomPanel;
            let close = false;
            if( this.data.isShowCustomPanel ){
                this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'0px' } );
            }else {
                close = true;
                setTimeout( ()=>{
                    this.el.find( '.custom-columns-panel' ).eq(0).animate( { 'right':'-200px' } );
                },400 )
            }
            this.actions.changeAgGridWidth(close);
        },
        //改变agGrid宽度
        changeAgGridWidth: function (close) {
            let num = 0;
            if( this.data.isShowCustomPanel ){
                num+=200;
            }
            let grid = this.el.find( '#data-agGrid' )
            if( close ){
                grid.width( 'calc(100% - ' + num + 'px)' );
            }else {
                setTimeout( ()=>{
                    grid.width( 'calc(100% - ' + num + 'px)' );
                },400 )
            }
        },
        //打开穿透数据弹窗
        openSourceDataGrid: function ( url,title,w,h ) {
            let defaultMax = false;
            if( url.indexOf( '/form/index/' ) != -1 ){
                defaultMax = true;
            }
            PMAPI.openDialogByIframe( url,{
                width: w || 1000,
                height: h || 800,
                title: title,
                modal:true,
                defaultMax: defaultMax,
                customSize: defaultMax
            } ).then( (data)=>{
            } )
        },
        //打开局部的弹窗
        openSelfIframe: function ( url,title,w,h ) {
            PMAPI.openDialogToSelfByIframe( url,{
                width: w || 1400,
                height: h || 800,
                title: title,
                modal:true,
                defaultMax: true,
                // customSize: true
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
                is_view: 1
            }
            let url = dgcService.returnIframeUrl( '/form/index/',obj );
            this.actions.openSelfIframe( url,'查看' )
        },
        onCellClicked: function ($event) {
            if( $event.colDef.field=='f5' ){
                this.agGrid.gridOptions.api.redrawRows();
            }
            if( $event.colDef.headerName == '操作' ){
                if( $event.event.srcElement.id == 'departModify' ){
                    let obj = {
                        table_id: this.data.tableId,
                        btnType: 'edit',
                        real_id: $event.data._id,
                        is_view: 0
                    }
                    let url = dgcService.returnIframeUrl( '/form/index/',obj );
                    this.actions.openSelfIframe( url,'编辑' )
                }
                if( $event.event.srcElement.id == 'departView' ){
                    let obj = {
                        table_id: this.data.tableId,
                        btnType: 'view',
                        real_id: $event.data._id,
                        is_view: 1
                    }
                    let url = dgcService.returnIframeUrl( '/form/index/',obj );
                    this.actions.openSelfIframe( url,'查看' )
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
        this.showLoading();
        TabService.onOpenTab( this.data.tableId );
        this.actions.createHeader();
        //订阅数据失效
        PMAPI.subscribe(PMENUM.data_invalid, (info) => {
            console.log( "部门信息订阅数据失效" )
            let tableId = info.data.table_id;
            if( this.data.tableId == tableId ){
                if( !this.data.onRefresh ){
                    this.data.onRefresh = true;
                    this.actions.getDepartmentData();
                    setTimeout( ()=>{
                        this.data.onRefresh = false;
                    },500 )
                }
            }
        })
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