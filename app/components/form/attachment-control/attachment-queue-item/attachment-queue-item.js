/**
 * Created by Yunxuan Yan on 2017/8/9.
 */
import './attachment-queue-item.scss';
import template from './attachment-queue-item.html';
import Component from "../../../../lib/component";
import browserMD5File from 'browser-md5-file';
import {FormService} from "../../../../services/formService/formService";
import msgbox from '../../../../lib/msgbox';
import {PMAPI} from "../../../../lib/postmsg";
import ViewVideo from "../../view-video/view-video";
import Mediator from "../../../../lib/mediator";

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
                if(this.data.is_archieved){
                    //todo trigger to delete
                    this.trigger('changeFile',{event:'delete',data:{
                        fileId:this.data._controlItem.fileId,
                        file:{name:this.data.row.file_name},
                        md5:'0'}
                    });
                } else {
                    FormService.deleteUploaded({
                        file_ids: JSON.stringify(file_ids),
                        dinput_type: this.data.real_type
                    }).then(res => {
                        if (res.success) {
                            this.trigger('changeFile', {event: 'delete', data: this.data._controlItem});
                        } else {
                            msgbox.alert('删除文件失败，请再试一次');
                        }
                    });
                }
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
                if(this.data.is_archieved == false && this.data._controlItem.process != 100){
                    msgbox.showTips('数据上传未完成！');
                    return;
                }
                let fileId = this.data._controlItem['fileId'];
                let fileName = this.data.is_archieved?this.data.row.file_name:this.data._controlItem.file.name;
                let src = '/download_attachment/?file_id='+fileId+'&download=0&dinput_type='+this.data.real_type;
                let fileType = this.data.is_archieved?this.data.row.content_type:this.data.file.type;
                if(fileType.indexOf('image') != -1) {
                    let items = [];
                    for(let data of this.data.list){
                        let item = {file_id:data};
                        items.push(item);
                    }
                    if(items.length == 0 || this.data.real_type == 9){
                        items = [{file_id:fileId}];
                    }
                    PMAPI.openPreview({list:items,id:fileId});
                } else if (fileType== 'video/mp4'
                    || fileType == 'audio/mp3'
                    || fileType == 'audio/wav') {
                    ViewVideo.data.rows = [{file_id:fileId,file_name:fileName}];
                    ViewVideo.data.dinput_type = this.data.real_type;
                    ViewVideo.data.currentVideoId = fileId;
                    ViewVideo.data.is_view = true;
                    ViewVideo.data.videoSrc = src;
                    ViewVideo.data.showFileList = false;
                    PMAPI.openDialogByComponent(ViewVideo, {
                        width: 700,
                        height: 600,
                        title: '视频播放器'
                    });
                }
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
                this.actions._unableSomePreview();
            }
        },
        _unableSomePreview:function(){//有一些不能预览的文件，预览按钮灰显

            if(this.data.real_type == 9 || this.data.real_type == 33){
                this.el.find('.preview').css('display','inline');
                let fileType = this.data.is_archieved?this.data.row.content_type:this.data.file.type;
                if(fileType.indexOf('image') == -1
                    && fileType != 'video/mp4'
                    && fileType != 'audio/mp3'
                    && fileType != 'audio/wav'){
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
        transData:function(){
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
                formData.append('time_stamp',this.data.timestamp);
                formData.append('string_stamp', this.data.timestamp);
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
                            this.data.toolbox.showError({fileId:this.data.fileOrder,msg:res.error});
                        } else {
                            msgbox.alert(res.error);
                        }
                        // this.actions.showReuploadingButton();
                        this.el.remove();
                    }
                },errorCallback);
            }
        },
        _loadArchievedRow:function () {
            this.el.find('.loader').hide();
            this.el.find('.preview').show();
            this.actions._unableSomePreview();
            if(this.data.is_view==0){
                this.el.find('.delete-file').show();
            }
            this.data._controlItem = {
                fileId:this.data.row.file_id,
                file:{name:this.data.row.file_name}
            };
            this.el.find('.download-url').attr('href','/download_attachment/?file_id='+this.data.row.file_id+'&download=1&dinput_type='+this.data.real_type);
        }
    },
    afterRender:function () {
        if(this.data.is_archieved == false){
            config.data.fileSize = config.actions.getReadableFileSize(this.data.file.size);
            this.data.fileSize =  config.data.fileSize;
            this.data.timestamp =  new Date().getTime();
            if(this.data.file.name == undefined){
                this.data.file.name = 'file-'+this.data.timestamp+'.'+this.data.file.type.substring(this.data.file.type.lastIndexOf('/')+1,this.data.file.type.length);
                let title = this.data.file.name+"("+this.data.fileSize+")";
                this.el.find('.file-name').prop('title',title).find('strong').text(title);
            }
            this.actions.startUploadFile();
        } else {
            this.actions._loadArchievedRow();
        }
    },
    firstAfterRender:function () {
        Mediator.subscribe('attachment:changeValue',(data)=>{
            this.data.list = data;
        })
    }
};
let AttachmentQueueItem = Component.extend(config)
export default AttachmentQueueItem