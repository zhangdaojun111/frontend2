/**
 * Created by Yunxuan Yan on 2017/8/9.
 */
import './attachment-queue-item.scss';
import template from './attachment-queue-item.html';
import Component from "../../../../lib/component";
import browserMD5File from 'browser-md5-file';
import {FormService} from "../../../../services/formService/formService";
import msgbox from '../../../../lib/msgbox';

let config = {
    template: template,
    binds:[
        {
            event:'click',
            selector:'.processing',
            callback:function () {
                this.el.find('.processing').css('display','none');
                this.el.find('.cancel-attaching').css('display','inline');
                this.actions.pauseUploading();
            }
        },{
            event:'click',
            selector:'.pause-attaching',
            callback:function () {
                this.actions.pauseUploading();
            }
        },{
            event:'click',
            selector:'.keep-on-attaching',
            callback:function () {
                this.data._controlItem.index++;
                this.actions.restartUploading();
            }
        },{
            event:'click',
            selector:'.delete-file',
            callback:function () {
                //删除文件
                let file_ids = [this.data._controlItem.fileId];
                FormService.deleteUploaded({
                    file_ids:JSON.stringify(file_ids),
                    dinput_type:this.data.real_type
                }).then(res=>{
                    if(res.success){
                        this.trigger('changeFile',{event:'delete',data:this.data._controlItem});
                    } else {
                        msgbox.alert('删除文件失败，请再试一次');
                    }
                });
            }
        },{
            event:'click',
            selector:'.re-uploading',
            callback:function () {
                this.el.find('.re-uploading').css('display','none');
                this.actions.restartUploading();
            }
        }, {
            event:'click',
            selector:'.cancel-attaching',
            callback:function () {
                this.actions.cancelUploading();
            }
        }, {
            event:'click',
            selector:'.preview',
            callback:function () {
                if(this.el.find('.preview-contain').is(":visible")){
                    this.el.find('.preview-contain').hide();
                } else {
                    if(this.data._controlItem.process != 100){
                        msgbox.showTips('数据上传未完成！');
                        return;
                    }
                    let fileId = this.data._controlItem['fileId'];
                    let src = '/download_attachment/?file_id='+fileId+'&download=0&dinput_type='+this.data.real_type;
                    if(this.data.file.type.indexOf('image') != -1) {
                        this.el.find('.preview-contain').show();
                        let ele = $('<img src="'+src+'">');
                        this.el.find('.preview-anchor').empty().append(ele);
                    } else if (this.data.file.type == 'video/mp4') {
                        this.el.find('.preview-contain').show();
                        let ele = $('<video width="400" controls><source src="'+src+'" type="video/mp4">您的浏览器不支持HTML5</video>');
                        this.el.find('.preview-anchor').empty().append(ele);
                    }
                }
            }
        }, {
            event:'click',
            selector:'.hide-preview',
            callback: function () {
                this.el.find('.preview-contain').hide();
            }
        }
    ],
    data:{
        real_type:9,
        file:{},
        _controlItem:{
            pack_size:1024*768,
            process: 0,
            uploadedSize:0,
            uploadingState:'on'
        },
        fileSize:'0'
    },
    actions:{
        updateProcess:function (i) {
            this.data._controlItem.process = Math.round(i*100);
            if(this.data._controlItem.process > 100){
               return;
            }
            if(this.data.toolbox){
                this.data.toolbox.update({
                    fileId:this.data.fileOrder,
                    progress:this.data._controlItem.process,
                });
            }
            this.el.find('#process-num').text(this.data._controlItem.process+'%');
            if(this.data._controlItem.process == 100){
                this.el.find('.loader').css('display','none');
                this.el.find('.processing').css('display','none');
                this.el.find('.keep-on-attaching').css('display','none');
                this.el.find('.pause-attaching').css('display','none');
                this.el.find('.cancel-attaching').css('display','none');
                this.el.find('.delete-file').css('display','inline');
                this.el.find('.preview').css('display','inline');
                if(this.data.file.type.indexOf('image') == -1 && this.data.file.type != 'video/mp4'){
                    this.el.find('.preview').css({'color':'grey','cursor':'auto'});
                }
            }
        },
        cancelUploading:function () {
            this.data._controlItem.uploadingState = 'canceled';
            this.trigger('changeFile',{event:'delete'});
        },
        processEvent(event){
            var position = event.loaded || event.position;
            position = position + this.data._controlItem.uploadedSize;
            this.actions.updateProcess(position/this.data._controlItem.file.size);
        },
        pauseUploading:function(){
            this.el.find('.loader').css('animation','none');
            this.el.find('.pause-attaching').css('display','none');
            this.el.find('.keep-on-attaching').css('display','inline');
            this.data._controlItem.uploadingState = 'paused';
        },
        restartUploading:function() {
            this.el.find('.loader').css('animation','spin 2s linear infinite');
            this.el.find('.keep-on-attaching').css('display','none');
            this.el.find('.pause-attaching').css('display','inline');
            this.data._controlItem.uploadingState = 'on';
            this.actions.transData();
        },
        showReuploadingButton:function(){
            this.el.find('.keep-on-attaching').css('display','none');
            this.el.find('.pause-attaching').css('display','none');
            this.el.find('.re-uploading').css('display','inline');
            this.data._controlItem.uploadingState = 'stopped';
        },
        getReadableFileSize:function (fileSize) {
            let units = ['B','kB','MB','GB','TB','PB','EB','ZB','YB'];
            let thresh = 1000;
            let i = 0;
            while(i < units.length){
                if(fileSize < thresh){
                    return fileSize+units[i];
                }
                fileSize=(fileSize/thresh).toFixed(1);
                i++;
            }
            return fileSize+units[units.length-1];
        },
        startUploadFile:function () {
            let file = this.data.file;
            browserMD5File(file, (err,md5)=>{
                this.data._controlItem =_.defaultsDeep(this.data._controlItem,{
                    md5:md5,
                    file:file,
                    chunks:Math.ceil(file.size/this.data._controlItem.pack_size),
                    index:0,
                    is_stop:1,
                    url: '/upload_attachment/?is_image_type='+(file.type.indexOf('image')>=0?'1':'0')
                });
                this.actions.transData();
            });
        },
        transData(){
            if(this.data._controlItem.uploadingState == 'on') {
                let item = this.data._controlItem;
                this.data._controlItem.uploadedSize = item.index * item.pack_size;
                let formData = new FormData();
                formData.append('file', item.file.slice(item.index * item.pack_size, (item.index + 1) * item.pack_size));
                formData.append('fileName', item.file.name);
                formData.append('md5', item.md5);
                formData.append('chunks', item.chunks);
                formData.append('index', item.index);
                formData.append('per_size', item.pack_size);
                formData.append('content_type', item.file.type);
                formData.append('dinput_type', this.data.real_type);
                let errorCallback = this.data.toolbox?this.data.toolbox.showError:undefined;
                FormService.uploadAttachment(item.url, formData, this.actions.processEvent, (res) => {
                    if (res.success) {
                        if (item.index < item.chunks - 1) {
                            item.index++;
                            this.actions.transData(item);
                        } else {
                            this.actions.updateProcess(1);
                            if(this.data.toolbox){
                                this.data.toolbox.finish({fileId:this.data.fileOrder});
                            }
                            this.data._controlItem.uploadingState = 'finished';
                            this.data._controlItem['fileId'] = res.file_id;
                            this.data._controlItem['thumbnail'] = res.thumbnail;
                            this.trigger('changeFile',{event:'finished',data:this.data._controlItem});
                        }
                    } else {
                        this.data._controlItem.uploadingState = 'failed';
                        if(this.data.toolbox){
                            this.data.toolbox.showError({fileId:this.data.fileOrder,msg:"传输中断"});
                        } else {
                            msgbox.alert('传输中断！');
                        }
                        this.actions.showReuploadingButton();
                    }
                },errorCallback);
            }
        }
    },
    afterRender:function () {
        this.actions.startUploadFile();
    }
}

export default class AttachmentQueueItem extends Component{
    constructor(data,event){
        config.data.fileSize = config.actions.getReadableFileSize(data.file.size);
        super(config,data,event);
    }
}
