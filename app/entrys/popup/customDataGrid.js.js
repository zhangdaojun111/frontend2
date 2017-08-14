import workflowPage from '../../components/customPage/workflow-page/workflow-page.js'
import myWorkflow from '../../components/customPage/my-workflow/my-workflow.js'
$(document).ready(function(){
    let ts_name = window.config.ts_name;
    let com = null;
    let json = {};
    let workflowPages = ['approve-workflow','approving-workflow','finished-workflow'];
    if( workflowPages.indexOf( ts_name ) != -1 ){
        json = {
            tableId: ts_name
        }
        com = new workflowPage(json);
    }
    if( ts_name == 'my-workflow' ){
        com = new myWorkflow(json);
    }
    com.render($('#customDataGrid'));
})