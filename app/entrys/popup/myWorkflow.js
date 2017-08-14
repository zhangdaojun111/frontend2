import workflowPage from '../../components/customPage/workflow-page/workflow-page'
$(document).ready(function(){
    let json = {
        tableId: window.config.tableId
    }
    console.log( "我的工作" )
    console.log( json )
    let com = new workflowPage(json);
    com.render($('#myWorkflow'));
})