import workflowPage from '../../components/customPage/workflow-page/workflow-page.js'
$(document).ready(function(){
    let ts_name = window.config.ts_name;
    let com = null;
    let json = {};
    let workflowPages = ['approve-workflow']
    if( workflowPages.indexOf( ts_name ) != -1 ){
        json = {
            tableId: ts_name
        }
        com = new workflowPage(json);
    }
    com.render($('#customDataGrid'));
})