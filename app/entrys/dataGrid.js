import dataTablePage from '../../app/components/dataGrid/data-table-page/data-table-page';
let json = {
    tableId:window.config.table_id,
    tableName:window.config.table_name
}
let DataTablePage = new dataTablePage({data: json});
DataTablePage.render($('#DataTablePage'));