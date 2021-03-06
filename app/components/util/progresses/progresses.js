/**
 * Created by Yunxuan Yan on 2017/9/11.
 */
import template from './progresses.html';

let css=`
.component-progress {
    height:90%;
    position:relative;
}
.progresses {
    margin:auto;
    text-align:center;
    position:absolute;
    top:50%;
    transform: translateY(-50%);
}
.process-item {
    margin:5px;
}
.progress-msg {
    font-family: '微软雅黑';
    font-size: 12px;
    margin:0 2px;
    width:140px;
    display: inline-block;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
    vertical-align: text-bottom;
}
.progress-bottle {
    font-family: '微软雅黑';
    font-size: 12px;
    margin:0 5px;
}
.cancel-upload {
    font-family: '微软雅黑';
    font-size: 12px;
    margin:0 2px;
}
`;

export const progressConfig = {
    template:template,
    data:{
        css:css.replace(/(\n)/g, ''),
    },
    binds:[
        {
        //     event: 'click',
        //     selector: '.button',
        //     callback: function () {
        //         PMAPI.sendToSelf({
        //             type: PMENUM.close_dialog,
        //             key: this.key,
        //             data: {
        //                 confirm: true
        //             }
        //         })
        //     }
        // },{
            event: 'click',
            selector:'.cancel-upload',
            callback: function (event) {
                let id = event.attributes.itemid.value;
                this.el.find(`#${id}`).remove();
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
                    this.actions.closeDialog();
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
        update:function({fileId:i,progress:n}) {
            this.el.find(`#${i} .progress-liquid`).css('width',n+'%').text(n+'%');
            if(n == 100){
                this.el.find(`#${i} .cancel-upload`).css('display','none');
                this.el.find(`#${i} .post-upload-process`).css('display','inline-block');
            }
        },
        finish:function (i) {
            this.el.find(`#${i} .cancel-upload`).remove();
            this.el.find(`#${i} .progress-bottle`).html('传输完成').css('background-color','');
            this.actions.closeDialogDelay();
        },
        error:function ({msg:msg,fileId:i}) {
            this.el.find(`#${i} .progress-bottle`).css('display','none');
            this.el.find(`#${i} .progress-msg`).css({'width':'50%', 'margin':'0 auto'});
            this.el.find(`#${i} .cancel-upload`).css('display','none');
            this.actions.closeDialogDelay();
        },
        closeDialogDelay:function () {
            setTimeout(()=>{
                if($(this.el.find('.process-bottle')).length == 0){
                    this.actions.closeDialog();
                }
            },2000);
        },
        closeDialog:function () {
            PMAPI.sendToSelf({
                type: PMENUM.close_dialog,
                key: this.key,
                data: {
                    confirm: true
                }
            });
        }
    },
    afterRender:function () {
        this.data.style = $('<style type="text/css"></style>').text(this.data.css).appendTo($("head"));
        for(let i=0,length=this.data.files.length;i < length;i++){
            $(this.el.find('.process-item')[i]).attr('id',this.data.files[i].id);
            $(this.el.find('.cancel-upload')[i]).attr('itemid',this.data.files[i].id);
            if(this.data.unCancellable){
                $(this.el.find('.cancel-upload')[i]).css('display','none');
            }
        }
    },
    beforeDestroy:function () {
        this.data.style.remove();
    }
}
