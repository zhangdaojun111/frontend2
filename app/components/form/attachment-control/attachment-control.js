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
// import {FormService} from '../../../services/formService/formService';
// import ThumbnailList from "./thumbnail-list/thumbnail-list";

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
            if(this.data.dinput_type == 33){  //视频附件
                ele.attr('accept','video/*');
            } else if(this.data.dinput_type == 23){  //图片附件
                ele.attr('accept','image/*');
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
            if(this.data.dinput_type == 33){
                if(!file.type.startsWith('video')){
                    alert(file.name + '不是视频类型文件，支持文件类型包括：avi, asf, mpg, mpeg, mpe, wmv, mp4');
                    return;
                }
            } else if(this.data.dinput_type == 23){
                if(!file.type.startsWith('image')){
                    alert(file.name + '不是图片类型文件，支持文件类型包括：bmp, jpg, png, tiff, gif, exif, svg, pcd, dxf, ufo');
                    return;
                }
            }
            let ele = $('<div></div>');
            let item = new AttachmentQueueItem({file:file,real_type:this.data.real_type},
                {changeFile:event=>{
                    if(event.event == 'delete'){
                        ele.remove();
                        if(event.data !=undefined){
                            this.data.queue.splice(this.data.queue.indexOf(event.data),1);
                            this.data.value.splice(this.data.value.indexOf(event.data.fileId),1);
                            this.el.find('.view-attached-list').html(`共${this.data.value.length}个文件`);
                        }
                    }
                    if(event.event == 'finished'){
                        this.data.queue.push(event.data);
                        this.data.value = this.data.value==''?[]:this.data.value;
                        this.data.value.push(event.data.fileId);
                        this.el.find('.view-attached-list').html(`共${this.data.value.length}个文件`);
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
