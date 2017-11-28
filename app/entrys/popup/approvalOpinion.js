/**
 * Created by zj on 2017/10/25.
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import approvalOpinion from '../../components/workflow/approval-opinion/approval-opinion';
$(document).ready(function(){
    let approvalOpinionComponent = new approvalOpinion();

    approvalOpinionComponent.render($('#approvalOpinion'));
});