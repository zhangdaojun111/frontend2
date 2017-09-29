/**
 *@author yudeping
 *选择器入口
 */
import BuildChoose from '../../components/popup/buildChoose/buildChoose';

$(document).ready(function(){
    let el=$('<div></div>').appendTo($('body'));
    let config=Object.assign({},window.config,{errMsg:''});
    let buildChoose=new BuildChoose(config);
   // console.log('window.config  ',config)
    buildChoose.render(el);
});