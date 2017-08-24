/**
 * Created by Yunxuan Yan on 2017/8/8.
 */
import template from './attachment-control.html';
import Component from "../../../lib/component";
import '../../../lib/msgbox'
import AttachmentQueueItem from "./attachment-queue-item/attachment-queue-item";
import {screenShotConfig} from "./screenshot-receiver/screenshot-receiver";
import {PMAPI} from "../../../lib/postmsg";
import {attachmentListConfig} from "./attachment-list/attachment-list";

let config={
    template: template,
    data: {
        queue:[]
    },
    actions: {
        viewAttachList:function(){
            attachmentListConfig.data = _.defaultsDeep({
                fileIds:this.data.value,
                dinput_type:this.data.real_type
            },attachmentListConfig.data);
            PMAPI.openDialogByComponent(attachmentListConfig,{
                width:500,
                height:300,
                title:"浏览上传文件"
            });
        },
        uploadFile:function () {
            let ele = this.el.find('.selecting-file');
            //视频附件
            if(this.data.dinput_type == 33){
                ele.attr('accept','video/*');
            }
            ele.click();
        },
        shotScreen:function () {
            PMAPI.openDialogByComponent(screenShotConfig,{
                width:500,
                height:300,
                title:"选择截图"
            }).then(res=>{
                if(!res.file){
                    return;
                }
                this.actions.controlUploadingForFile(res.file);
            })
         },
        controlUploadingForFile:function (file) {
            if(file.size>100*1024*1024){
                alert(file.name + ' 文件过大，无法上传，请确保上传文件大小小于100MB');
                return;
            }
            let ele = $('<div></div>');
            let item = new AttachmentQueueItem({file:file,real_type:this.data.real_type},
                {changeFile:event=>{
                    if(event.event == 'delete'){
                        ele.remove();
                        if(event.data !=undefined){
                            this.data.queue.slice(this.data.queue.indexOf(event.data),1);
                            this.data.value.slice(this.data.queue.indexOf(event.data),1);
                        }
                    }
                    if(event.event == 'finished'){
                        this.data.queue.push(event.data);
                        this.data.value.push(event.data.fileId);
                        this.el.find('.view-attached-list').html(`共${this.data.value.lenght}个文件`);
                        this.trigger('changeValue', this.data);
                    }
                }
            });
            this.el.find('.upload-process-queue').append(ele);
            item.render(ele);

        }
    },
    afterRender: function () {
        if(this.data.dinput_type == 33){
            this.el.find('.shot-screen').css('display','none');
        }
        this.el.on('click','.view-attached-list',()=>{
            this.actions.viewAttachList();
        }).on('click','.upload-file',()=>{
            this.actions.uploadFile();
        }).on('click','.shot-screen',()=>{
            this.actions.shotScreen();
        }).on('change','.selecting-file',(event)=>{
            let files = event.target.files;
            for(let file of files){
                this.actions.controlUploadingForFile(file);
            }
        })
    }
};

export default class AttachmentControl extends Component{
    constructor(data,event){
        super(config,data,event);
    }
}
