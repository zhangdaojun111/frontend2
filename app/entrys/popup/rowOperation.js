/**
 * @author yangxiaochuan
 * 行级操作的iframe
 */

import rowBi from '../../components/dataGrid/data-table-toolbar/row-operation/row-bi/row-bi';
import excuteOperation from '../../components/dataGrid/data-table-toolbar/row-operation/excute-operation/excute-operation';
$(document).ready(function(){
    let type = window.config.operationType;
    let com = null;
    if( type == 'bi' ){
        com = new rowBi( {} );
    }
    if( type == 'excute' ){
        com = new excuteOperation( {} );
    }
    if( com ){
        com.render($('#rowOperation'));
    }
});