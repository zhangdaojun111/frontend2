/**
 * Created by Yunxuan Yan on 2017/8/11.
 */

import template from './screenshot-receiver.html'
import Component from "../../../../lib/component";
import './screenshot-receiver.scss';

let config={
    template:template,
    data:{
        file:'',
        imageEle:undefined,
        callback:function () {}
    },
    actions:{

    },
    afterRender:function () {
        let t = this;
        this.el.on('paste',(event)=>{
            if(this.data.file != ''){
                return;
            }
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (let index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    t.data.file = blob;
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        let ele = $('<img src="'+event.target.result+'" style="height: 100%;width: 100%">');
                        t.el.find('.img-anchor').append(ele);
                        t.data.imageEle = ele;
                        t.el.find('.paste-tip').css('display','none');
                    }; // data url!
                    reader.readAsDataURL(blob);
                }
            }
        }).on('click','.comfirm-n-save',()=>{
            if(this.data.file == ''){
                return;
            }
            this.data.callback(this.data.file);
        }).on('click','.cancel-to-rechoose',()=>{
            if(!this.data.imageEle){
                return;
            }
            this.data.imageEle.remove();
            t.el.find('.paste-tip').css('display','block');
            this.data.file = '';
        })
    }
}

export default class ScreenShotReceiver extends Component{
    constructor(func){
        if(func){
            config.data.callback = func;
        }
        super(config);
    }
}
