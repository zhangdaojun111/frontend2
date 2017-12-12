/**
 * @author yangxiaochuan
 * 行级操作的iframe
 */

import rowBi from '../../components/dataGrid/data-table-toolbar/row-operation/row-bi/row-bi';
import excuteOperation from '../../components/dataGrid/data-table-toolbar/row-operation/excute-operation/excute-operation';
import lifeCycle from '../../components/dataGrid/data-table-toolbar/row-operation/data-grid-lifecycle/data-grid-lifecycle'
import '../../assets/scss/main.scss';
$(document).ready(function(){
    let type = window.config.operationType;
    let com = null;
    if( type == 'bi' ){
        com = new rowBi({data: {}});
    }
    if( type == 'excute' ){
        com = new excuteOperation({data: {}});
    }
    if( type == 'lifeCycle' ){
        com = new lifeCycle({data: {}});
    }
    if( com ){
        com.render($('#rowOperation'));
    }
});