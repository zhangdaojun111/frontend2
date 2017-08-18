import historyApprove from '../../components/dataGrid/data-table-toolbar/history-approve-data/history-approve-data'
$(document).ready(function(){
    console.log(window.config.key)
    let obj = {
        key: window.config.key
    }
    let hyApprove = new historyApprove(obj);
    hyApprove.render($('#historyApprove'));
})