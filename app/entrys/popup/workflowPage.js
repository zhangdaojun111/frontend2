import workflowPage from '../../components/customPage/workflow-page/workflow-page';
$(document).ready(function(){
    let isNewWindow = window.location.href.indexOf( 'isNewWindow=true' ) == -1 ? false:true;
    let json = {
        tableId: window.config.tableId,
        isNewWindow: isNewWindow
    }
    $( 'title' ).html( window.config.tableName || 'ERDS' );
    let WorkflowPage=new workflowPage( json );
    WorkflowPage.render($('#workflowPage'));
});