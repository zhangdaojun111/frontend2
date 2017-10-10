/**
 * @author yangxiaochuan
 * 行级操作的iframe
 */

import rowBi from '../../components/dataGrid/data-table-toolbar/row_operation/row-bi/row-bi';
$(document).ready(function(){
    let type = window.config.operationType;
    let com = null;
    if( type == 'bi' ){
        com = new rowBi( {} );
    }
    if( com ){
        com.render($('#rowOperation'));
    }
});