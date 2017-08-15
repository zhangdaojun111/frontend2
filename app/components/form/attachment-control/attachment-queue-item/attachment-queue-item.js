/**
 * Created by Yunxuan Yan on 2017/8/9.
 */
import './attachment-queue-item.scss';
import template from './attachment-queue-item.html';
import Component from "../../../../lib/component";
import browserMD5File from 'browser-md5-file';
import {FormService} from "../../../../services/formService/formService";
import '../../../../lib/msgbox';

let config = {
    template: template,
    data:{
        real_type:9,
        file:{},
        callback:function () {},
        _controlItem:{
            pack_size:1024*768,
            process: 0,
            uploadedSize:0,
            uploadingState:'on'
        }
    },
    actions:{
        updateProcess:function (i) {
            this.data._controlItem.process = Math.round(i*100);
            if(this.data._controlItem.process > 100){
               return;
            }
            this.el.find('#my-bar').css('width',this.data._controlItem.process + '%');
            this.el.find('#process-num').text(this.data._controlItem.process+'%');
            if(this.data._controlItem.process == 100){
               this.el.find('.processing').css('display','none');
               this.el.find('.keep-on-attaching').css('display','none');
               this.el.find('.pause-attaching').css('display','none');
               this.el.find('.cancel-attaching').css('display','none');
               this.el.find('.delete-file').css('display','block');
            }
        },
        processEvent(event){
            var position = event.loaded || event.position;
            position = position + this.data._controlItem.uploadedSize;
            this.actions.updateProcess(position/this.data._controlItem.file.size);
        },
        pauseUploading:function(){
            this.el.find('.pause-attaching').css('display','none');
            this.el.find('.keep-on-attaching').css('display','block');
            this.data._controlItem.uploadingState = 'paused';
        },
        keepOnUploading:function() {
            this.data._controlItem.index++;
            this.actions.restartUploading();
        },
        restartUploading:function() {
            this.el.find('.keep-on-attaching').css('display','none');
            this.el.find('.pause-attaching').css('display','block');
            this.data._controlItem.uploadingState = 'on';
            this.actions.transData();
        },
        reUploading:function () {
            this.el.find('.re-uploading').css('display','none');
            this.actions.restartUploading();
        },
        showReuploadingButton:function(){
            this.el.find('.keep-on-attaching').css('display','none');
            this.el.find('.pause-attaching').css('display','none');
            this.el.find('.re-uploading').css('display','block');
            this.data._controlItem.uploadingState = 'stopped';
        },
        cancelUploading:function () {
            this.data.callback('delete');
        },
        deleteMe:function () {
            //删除文件
            let file_ids = [this.data._controlItem.fileId];
            FormService.deleteUploaded({
                file_ids:JSON.stringify(file_ids),
                dinput_type:this.data.real_type
            }).then(res=>{
                if(res.success){
                    this.data.callback('delete',this.data._controlItem);
                } else {
                    alert('删除文件失败，请再试一次');
                }
            });
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
                console.log('*******')
                console.log('*******')
                console.log('*******')
                console.log('*******')
                console.log(item);
                formData.append('fileName', item.file.name);
                formData.append('md5', item.md5);
                formData.append('chunks', item.chunks);
                formData.append('index', item.index);
                formData.append('per_size', item.pack_size);
                formData.append('content_type', item.file.type);
                formData.append('dinput_type', this.data.real_type);
                FormService.uploadAttachment(item.url, formData, this.actions.processEvent, (res) => {
                    if (res.success) {
                        if (item.index < item.chunks - 1) {
                            item.index++;
                            this.actions.transData(item);
                        } else {
                            this.actions.updateProcess(1);
                            this.data._controlItem.uploadingState = 'finished';
                            this.data._controlItem['fileId'] = res.file_id;
                            this.data._controlItem['thumbnail'] = res.thumbnail;
                            this.data.callback('finished',this.data._controlItem);
                        }
                    } else {
                        this.data._controlItem.uploadingState = 'failed';
                        alert('传输中断！');
                        this.actions.showReuploadingButton();
                    }
                });
            }
        }
    },
    afterRender:function () {

        this.el.on('click','.processing',()=>{
            this.el.find('.processing').css('display','none');
            this.el.find('.cancel-attaching').css('display','block');
            this.actions.pauseUploading();
        }).on('click','.pause-attaching',()=>{
            this.actions.pauseUploading();
        }).on('click','.keep-on-attaching',()=>{
            this.actions.keepOnUploading();
        }).on('click','.delete-file',()=>{
            this.actions.deleteMe();
        }).on('click','.re-uploading',()=>{
            this.actions.reUploading();
        }).on('click','.cancel-attaching',()=>{
            this.actions.cancelUploading();
        });

        this.actions.startUploadFile();
    }
}

export default class AttachmentQueueItem extends Component{
    constructor(file,real_type,callback){
        config.data.file = file;
        config.data.real_type = real_type;
        if(callback){
            config.data.callback = callback;
        }
        super(config);
    }
}
