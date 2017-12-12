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
function GetQueryString(name)
{
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
let key=GetQueryString('key');
let multiApp = new MultiApp({data:{key}});

multiApp.render($('#multi-app'));