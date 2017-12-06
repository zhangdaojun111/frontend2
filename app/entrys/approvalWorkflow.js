import '../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import jsplumb from 'jsplumb';
import ApprovalInit from '../components/workflow/approval-init/approval-init'

new ApprovalInit().render($('#approval-workflow'));
