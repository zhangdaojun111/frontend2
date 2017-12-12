import 'jquery-ui/ui/widgets/dialog.js';
import 'jquery-ui/ui/widgets/sortable.js';
import dataTableAgGrid from '../../components/dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
$(document).ready(function(){
    let json = {
        tableId: window.config.tableId || '',
        tableName: window.config.tableName || '',
        parentTableId: window.config.parentTableId || '',
        parentTempId: window.config.parentTempId || '',
        parentRealId: window.config.parentRealId || '',
        rowId: window.config.rowId || '',
        fieldId: window.config.fieldId || '',
        flowId: window.config.flowId || '',
        recordId: window.config.recordId || '',
        tableType: window.config.tableType || '',
        viewMode: window.config.viewMode || 'normal',
        key: window.config.key || '',
        base_buildin_dfield: window.config.base_buildin_dfield || '',
        source_field_dfield: window.config.source_field_dfield || '',
        fieldContent: window.config.fieldContent || null,
        correspondenceField: window.config.correspondenceField || '',
        keyword: window.config.keyword || '',
        gridTips: window.config.gridTips || '',
        project: window.config.project || '',
        isNewWindow: window.config.isNewWindow || false
    }
    $( 'title' ).html( window.config.tableName || 'REDS' );
    let DataTableAgGrid=new dataTableAgGrid( {data: json} );
    DataTableAgGrid.render($('#sourceDataGrid'));
});