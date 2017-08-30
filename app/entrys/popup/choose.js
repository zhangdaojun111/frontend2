/**
 *@author yudeping
 *选择器入口
 */
import BuildChoose from '../../components/popup/buildChoose/buildChoose';
// function GetQueryString(name)
// {
//     let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//     let r = window.location.search.substr(1).match(reg);
//     if(r!=null)return  unescape(r[2]); return null;
// }
$(document).ready(function(){
    let fieldId=GetQueryString('fieldId');
    let key=GetQueryString('key');
    let el=$('<div></div>').appendTo($('body'));
    // let buildChoose=new BuildChoose({fieldId:fieldId,key:key});
    let buildChoose=new BuildChoose(window.config);
    buildChoose.render(el);
});