/**
 *@author qiumaoyun
 *发起工作流主要逻辑
 */
import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import jsplumb from 'jsplumb';
import CreateWorkflow from  '../components/workflow/create-workflow/create-workflow';

new CreateWorkflow().render($('#WorkflowInitial'));