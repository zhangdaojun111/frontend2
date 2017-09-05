/**
 *@author qiumaoyun
 *Iframe打开批量审批
 */
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import '../../assets/scss/core/reset.scss';
import '../../assets/scss/core/common.scss';
import '../../components/workflow/multi-app/multi-app.scss';
import MultiApp from '../../components/workflow/multi-app/multi-app';
let multiApp = new MultiApp();

multiApp.render($('#multi-app'));