/**
 * Created by Yunxuan Yan on 2017/9/11.
 */
import template from './progresses.html';

export const progressConfig = {
    template:template,
    data:{},
    binds:[
        {
            event: 'click',
            selector: '.button',
            callback: function () {
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key: this.key,
                    data: {
                        confirm: true
                    }
                })
            }
        },{
            event: 'click',
            selector:'.cancel-upload',
            callback: function (event) {
                let id = event.attributes.itemid.value;
                this.el.find('#'+id).remove();
                PMAPI.sendToSelf({
                    type:PMENUM.send_data_to_iframe,
                    key:this.key,
                    data:{
                        originalField:this.data.originalField,
                        type:'cancel_uploading',
                        id:id
                    }
                });
                if($(this.el.find('.process-item')).length == 0){
                    PMAPI.sendToSelf({
                        type: PMENUM.close_dialog,
                        key: this.key,
                        data: {
                            confirm: true
                        }
                    })
                }
            }
        }
    ],
    actions:{
        updateData:function (data) {
            switch(data.type){
                case 'update':
                    this.actions.update(data.msg);
                    break;
                case 'finish':
                    this.actions.finish(data.msg);
                    break;
                case 'error':
                    this.actions.error(data.msg);
            }
        },
        update:function({fileOrder:i,progress:n}) {
            this.el.find('#'+i).find('.progress-liquid').css('width',n+'%');
        },
        finish:function (i) {
            this.el.find('#'+i).find('.cancel-upload').css('display','none');
            this.el.find('#'+i).find('.progress-bottle').css('display','none');
            let text = this.el.find('#'+i).find('.progress-msg').text() + "传输完成!";
            this.el.find('#'+i).find('.progress-msg').text(text);
        },
        error:function ({msg:msg,index:i}) {
            this.el.find('#'+i).find('.progress-bottle').css('display','none');
            let text = this.el.find('#'+i).find('.progress-msg').text() + ": "+msg;
            this.el.find('#'+i).find('.progress-msg').text(text).css('color','red');
        }
    },
    afterRender:function () {
        for(let i=0,length=this.data.files.length;i < length;i++){
            $(this.el.find('.process-item')[i]).attr('id',this.data.files[i].id);
            $(this.el.find('.cancel-upload')[i]).attr('itemid',this.data.files[i].id);
        }

    }
}
