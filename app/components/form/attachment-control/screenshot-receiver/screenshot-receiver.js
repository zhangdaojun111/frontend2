/**
 * Created by Yunxuan Yan on 2017/8/11.
 */

import template from './screenshot-receiver.html'
import Component from "../../../../lib/component";
import './screenshot-receiver.scss';

let css = `
// .screenshot {
//   max-width: 500px;
//   min-height: 250px;
//   background: white;
//   border: 1px solid #ccc;
// }
//
// .paste-tip {
//   height: 40px;
//   line-height: 40px;
//   font-size: 30px;
//   color: gray;
//   left: 0;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   margin: auto;
//   text-align: center;
//   padding: 110px 0;
// }
//
// .screenshot-image {
//   height: 100%;
//   width: 100%;
// }
`;

export const screenShotConfig={
    template:template,
    binds:[
        {
            event:'click',
            selector:'.comfirm-n-save',
            callback:function () {
                if(this.data.file == ''){
                    return;
                }
                window.parent.postMessage({
                    type:'1',
                    key:this.key,
                    data:{
                        file:this.data.file
                    }
                }, location.origin);
            }
        },{
            event:'click',
            selector:'.cancel-to-rechoose',
            callback:function () {
                if(!this.data.imageEle){
                    return;
                }
                this.data.imageEle.remove();
                this.el.find('.paste-tip').css('display','block');
                this.data.file = '';
            }
        }
    ],
    data:{
        file:'',
        css:css.replace(/(\n)/g, '')
    },
    afterRender:function () {
        this.data.style = $('<style type="text/css"></style>').text(this.data.css).appendTo($("head"));
        let t = this;
        this.el.on('paste',(event)=>{
            if(this.data.file != ''){
                return;
            }
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            if(items == undefined){//safari
                items = event.originalEvent.clipboardData.files;
                for(let index in items){
                    var item = items[index];
                    if(item.constructor.name == 'File'){
                        t.data.file = item;
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            console.log('onload');
                            let ele = $('<img>');
                            ele.addClass('screenshot-image');
                            ele.attr('src',event.target.result);
                            console.dir(ele);
                            t.el.find('.img-anchor').append(ele);
                            t.data['imageEle'] = ele;
                            t.el.find('.paste-tip').css('display','none');
                        }; // data url!
                        reader.readAsDataURL(t.data.file); //存在读取文件的时候，报FileError 4的错误
                    }
                }
            } else {//chrome
                for (let index in items) {
                    var item = items[index];
                    if (item.kind === 'file') {
                        var blob = item.getAsFile();
                        t.data.file = blob;
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            let ele = $('<img>');
                            ele.addClass('screenshot-image');
                            ele.attr('src',event.target.result);
                            t.el.find('.img-anchor').append(ele);
                            t.data['imageEle'] = ele;
                            t.el.find('.paste-tip').css('display','none');
                        }; // data url!
                        reader.readAsDataURL(blob);
                    }
                }
            }
        });

        //弹窗button位置不随滚动条滚动
        t.el.find(".screenshot").parents().scroll(function () {
            let scrollTop =  t.el.find(".screenshot").parents().scrollTop();
            let scrollLeft =  t.el.find(".screenshot").parents().scrollLeft();
            t.el.find(".btn-save-rechoose").css('right',-scrollLeft + 'px')
            t.el.find(".btn-save-rechoose").css('bottom',-scrollTop + 'px')
        });
    },
    beforeDestory:function () {
        this.data.style.remove();
    }
}

