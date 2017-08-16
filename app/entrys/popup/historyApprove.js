import historyApprove from '../../components/dataGrid/data-table-toolbar/history-approve-data/history-approve-data'
$(document).ready(function(){
    console.log(window.config.key)
    let obj = {
        key: window.config.key
    }
    let historyApprove = new historyApprove(obj);
    historyApprove.render($('#historyApprove'));
})