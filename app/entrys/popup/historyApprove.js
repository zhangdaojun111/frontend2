/**
 * Created by zhr
 * Iframe查看历史
 */
import historyApprove from '../../components/dataGrid/data-table-toolbar/history-approve-data/history-approve-data'
$(document).ready(function(){
    let obj = {
        key: window.config.key
    }
    let hyApprove = new historyApprove(obj);
    hyApprove.render($('#historyApprove'));
})