/**
 *@author yudeping
 *Iframe打开表单入口
 */
import FormEntry from '../form';
$(document).ready(function() {
    let el=$('<div style="width:100%; height:100%;position: fixed;left: 0;right: 0;overflow: auto"></div>').prependTo('body');
    let config=Object.assign({},window.config,{el:el});
    FormEntry.createForm(config);

});