import workflowPage from '../../components/customPage/workflow-page/workflow-page.js'
import myWorkflow from '../../components/customPage/my-workflow/my-workflow.js'
import myOperation from '../../components/customPage/my-operation/my-operation.js'
import department from '../../components/customPage/department/department'
import personnel from '../../components/customPage/personnel/personnel'
$(document).ready(function(){
    let isNewWindow = window.location.href.indexOf( 'isNewWindow=true' ) == -1 ? false:true;
    let tableName = window.config.tableName || 'ERDS';
    let ts_name = window.config.ts_name;
    let com = null;
    let json = {};
    let workflowPages = ['approve-workflow','approving-workflow','finished-workflow'];
    if( workflowPages.indexOf( ts_name ) != -1 ){
        json = {
            tableId: ts_name,
            isNewWindow: isNewWindow
        }
        com = new workflowPage(json);
    }
    if( ts_name == 'my-workflow' ){
        json = {
            tableId: ts_name,
            isNewWindow: isNewWindow
        }
        com = new myWorkflow(json);
    }
    if( ts_name == 'my-operations'){
        tableName = '我的操作';
        json = {
            tableId: ts_name,
            isNewWindow: isNewWindow
        }
        com = new myOperation(json);
    }
    if( ts_name == 'department-information' ){
        tableName = '部门信息';
        json = {
            tableId: window.config.table_id,
            isNewWindow: isNewWindow
        }
        com = new department(json);
    }
    if( ts_name == 'personal-information' ){
        tableName = '人员信息';
        json = {
            tableId: window.config.table_id,
            isNewWindow: isNewWindow
        }
        com = new personnel(json);
    }
    $( 'title' ).html( tableName );
    com.render($('#customDataGrid'));
})