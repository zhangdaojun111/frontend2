/**
 * Created by zj on 2017/12/4.
 */
import workflowPageOld from '../../../../../../app/components/customPage/workflow-page/workflow-page'
import {dgcService} from "../../../../../../app/services/dataGrid/data-table-control.service";
import {TabService} from "../../../../../../app/services/main/tabService";
import {wchService} from '../../../../../../app/services/dataGrid/workflow-config-header.service';
import agGrid from "../../../../../../app/components/dataGrid/agGrid/agGrid";
import FloatingFilter from "../../../../../../app/components/dataGrid/data-table-toolbar/floating-filter/floating-filter";
import {PMAPI, PMENUM} from '../../../../../../app/lib/postmsg';
let config = {
    data: {
    },
    actions: {
        createColumnDefs: function () {
            let cols = wchService.getWorkflowHeader( this.data.pageType );
            let number = dgcService.numberCol;
            number['headerCellTemplate'] = this.actions.resetPreference();
            this.data.columnDefs = [number];
            if( this.data.pageType === 2||this.data.pageType === 0 ){
                this.data.columnDefs.push( dgcService.selectCol );
                this.data.customColumnsFields.push( {name:'选择',field:'mySelectAll',canhide:false,candrag:false,canFix:false} )
            }
            let fixArr = this.data.fixCols.l.concat(this.data.fixCols.r);
            for( let col of cols ){
                if( col.field === 'myOperate' ){
                    col['suppressFilter'] = true;
                    this.data.columnDefs.unshift( col );
                    continue;
                }
                let s = this.actions.searchType(col["field"],col.headerName);
                let minWidth = {
                    datetime: 160,
                    time: 90,
                    date: 110
                };
                let obj = {
                    headerName: col.headerName,
                    field: col["field"],
                    enableCellChangeFlash: true,
                    suppressMenu: true,
                    suppressToolPanel: true,
                    // suppressMovable: fixArr.indexOf(data.data["field"]) == -1 ? false : true,
                    colId: col["field"],
                    tooltipField: col["field"],
                    sortingOrder: ['desc', 'asc', null],
                    hide: false,
                    minWidth: minWidth[s.type] || 20,
                    width: col["width"] || 120,
                    cellStyle: {'font-style': 'normal'},
                    floatingFilterComponent: this.floatingFilterCom.actions.createFilter(s.type , s.field, this.data.searchValue, this.data.searchOldValue),
                    floatingFilterComponentParams: {suppressFilterButton: true},
                    enableRowGroup: true,
                    suppressSorting: false,
                    sortField: col["field"],
                    suppressResize: false,
                    suppressMovable: false
                };
                //定制列数据
                this.data.customColumnsFields.push( {name:col.headerName,field:col["field"],canhide:true,candrag:true,canFix:true} );
                this.data.columnDefs.push( obj );
            }
            this.data.fieldsData = this.data.columnDefs;
        },

    },
    afterRender: function () {
        this.showLoading();
        this.el.find( '.headerTips' ).eq(0).find( 'span' ).eq(0).html( this.data.tableId2Name[this.data.tableId] );
        this.floatingFilterCom = new FloatingFilter();
        this.floatingFilterCom.actions.floatingFilterPostData = this.actions.floatingFilterPostData;
        this.data.pageType = this.data.tableId2pageType[this.data.tableId];
        this.actions.getData();
    },
};

class workflowPage extends workflowPageOld{
    constructor(data, newconfig) {
        super(data, $.extend(true, {}, config, newconfig));
    }
}
export default workflowPage;