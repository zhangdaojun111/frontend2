import dataTableImport from '../../components/dataGrid/data-table-toolbar/data-table-import/data-table-import'
$(document).ready(function(){
    let obj = {
        key :window.config.key,
        tableId:window.config.tableId,
        isBatch: window.config.isBatch,
        parentRealId: window.config.parentRealId,
        parentTableId: window.config.parentTableId,
        parentTempId: window.config.parentTempId
    };
    let dataImport = new dataTableImport(obj);
    dataImport.render($('#dataImport'));
})