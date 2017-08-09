import BuildChoose from '../../components/popup/buildChoose/buildChoose';
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
$(document).ready(function(){
    let fieldId=GetQueryString('fieldId');
    let key=GetQueryString('key');
    let buildChoose=new BuildChoose({fieldId:fieldId,key:key});
    buildChoose.render($('body'));
});