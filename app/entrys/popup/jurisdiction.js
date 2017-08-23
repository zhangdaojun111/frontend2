/**
 * Created by zhr
 */
import jurisdiction from '../../components/dataGrid/data-table-toolbar/jurisdiction/jurisdiction'
$(document).ready(function(){
    console.log(window.config.key)
    let obj = {
        key: window.config.key
    }
    let jdiction = new jurisdiction(obj);
    jdiction.render($('#jurisdiction'));
})