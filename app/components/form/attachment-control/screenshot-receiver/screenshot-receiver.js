/**
 * Created by Yunxuan Yan on 2017/8/11.
 */

import template from './screenshot-receiver.html'
import Component from "../../../../lib/component";
import './screenshot-receiver.scss';

let config={
    template:template,
    data:{
        file:''
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
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        console.log(event.target.result);
                        t.data.file = event.target.result;
                        let ele = $('<img src="'+event.target.result+'" style="height: 100%;width: 100%">');
                        t.el.find('.img-anchor').append(ele);
                        t.el.find('.paste-tip').css('display','none');
                    }; // data url!
                    reader.readAsDataURL(blob);
                }
            }
        }).on('click','.comfirm-n-save'.()=>{

        })
    }
}

export default class ScreenShotReceiver extends Component{
    constructor(){
        super(config);
    }
}
