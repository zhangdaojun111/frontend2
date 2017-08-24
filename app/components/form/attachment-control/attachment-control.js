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
            this.el.find('.selecting-file').click();
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
            let item = new AttachmentQueueItem(file,this.data.real_type,(event,data)=>{
                if(event == 'delete'){
                    ele.remove();
                    if(data !=undefined){
                        this.data.queue.slice(this.data.queue.indexOf(data),1);
                    }
                }
                if(event == 'finished'){
                    this.data.queue.push(data);
                }
            });
            this.el.find('.upload-process-queue').append(ele);
            item.render(ele);

        }
    },
    afterRender: function () {
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
    constructor(data,events){
        super(config,data,events);
    }
}
