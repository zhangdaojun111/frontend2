import workflowPage from '../../components/customPage/workflow-page/workflow-page.js'
import myWorkflow from '../../components/customPage/my-workflow/my-workflow.js'
import department from '../../components/customPage/department/department'
import personnel from '../../components/customPage/personnel/personnel'
$(document).ready(function(){
    console.log( "________" )
    console.log( "________" )
    console.log( window.config )
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
    if( ts_name == 'department-information' ){
        json = {
            tableId: window.config.table_id
        }
        com = new department(json);
    }
    if( ts_name == 'personal-information' ){
        json = {
            tableId: window.config.table_id
        }
        com = new personnel(json);
    }
    com.render($('#customDataGrid'));
})