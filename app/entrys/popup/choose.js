/**
 *@author yudeping
 *选择器入口
 */
import BuildChoose from '../../components/popup/buildChoose/buildChoose';
$(document).ready(function(){
    let el=$('<div></div>').appendTo($('body'));
    let buildChoose=new BuildChoose(window.config);
    buildChoose.render(el);
});