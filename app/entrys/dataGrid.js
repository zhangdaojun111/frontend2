import dataTablePage from '../../app/components/dataGrid/data-table-page/data-table-page';

import 'jquery-ui/ui/widgets/tabs.js';
import 'jquery-ui/ui/widgets/dialog.js';
import 'jquery-ui/ui/widgets/sortable.js';
let json = {
    tableId:window.config.table_id,
    tableName:window.config.table_name
}
let DataTablePage = new dataTablePage(json);

DataTablePage.render($('#DataTablePage'));