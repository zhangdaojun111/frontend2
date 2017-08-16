import workflowPage from '../../components/customPage/workflow-page/workflow-page';
$(document).ready(function(){
    let json = {
        tableId: window.config.tableId
    }
    let WorkflowPage=new workflowPage( json );
    WorkflowPage.render($('#workflowPage'));
});