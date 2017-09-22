/**
 * Created by zhr
 * Iframe权限操作
 */
import jurisdiction from '../../components/dataGrid/data-table-toolbar/jurisdiction/jurisdiction'
$(document).ready(function(){
    let obj = {
        key: window.config.key
    }
    let jdiction = new jurisdiction(obj);
    jdiction.render($('#jurisdiction'));
})