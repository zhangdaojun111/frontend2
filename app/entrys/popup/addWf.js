/**
 *@author qiumaoyun
 *默认新增，编辑等操作工作流逻辑
 */
import '../../assets/scss/main.scss';
import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';
import Mediator from '../../lib/mediator';
import AddWfInit from '../../components/workflow/add-wf/add-wf';

let serchStr = location.search.slice(1);
let obj = {};
serchStr.split('&').forEach(res => {
	let arr = res.split('=');
	obj[arr[0]] = arr[1];
});
new AddWfInit({data:{obj:obj}}).render($('#add-wf'));