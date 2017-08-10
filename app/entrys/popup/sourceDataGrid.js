import 'jquery-ui/ui/widgets/dialog.js';
import 'jquery-ui/ui/widgets/sortable.js';
import dataTableAgGrid from '../../components/dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
$(document).ready(function(){
    let json = {
        tableId: window.config.tableId || '',
        tableName: window.config.tableName || '',
        parentTableId: window.config.parentTableId || '',
        parentRealId: window.config.parentRealId || '',
        rowId: window.config.rowId || '',
        fieldId: window.config.fieldId || '',
        tableType: window.config.tableType || '',
        viewMode: window.config.viewMode || 'normal',
        key: window.config.key || '',
        base_buildin_dfield: window.config.base_buildin_dfield || '',
    }
    let DataTableAgGrid=new dataTableAgGrid( json );
    DataTableAgGrid.render($('#sourceDataGrid'));
});