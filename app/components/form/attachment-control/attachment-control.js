/**
 * Created by Yunxuan Yan on 2017/8/8.
 */
import template from './attachment-control.html';
import Component from "../../../lib/component";
import msgBox from '../../../lib/msgbox';
import AttachmentQueueItem from "./attachment-queue-item/attachment-queue-item";
import {screenShotConfig} from "./screenshot-receiver/screenshot-receiver";
import {PMAPI} from "../../../lib/postmsg";
import {FormService} from '../../../services/formService/formService';
import ThumbnailList from "./thumbnail-list/thumbnail-list";
import {Storage} from "../../../lib/storage";
import Mediator from "../../../lib/mediator";
import browserMD5File from 'browser-md5-file';
import AttachmentList from '../attachment-list/attachment-list';
import ViewVideo from '../view-video/view-video';

let preview_file = ["gif","jpg","jpeg","png","wmv","mp4","pdf","mp3","wav"];

let config = {
    template: template,
    binds: [
        {
            event: 'click',
            selector: '.upload-file',
            callback: function () {
                let ele = this.el.find('.selecting-file');
                if (this.data.dinput_type == 33) {  //视频附件
                    ele.attr('accept', 'video/*,audio/*');
                } else if (this.data.dinput_type == 23) {  //图片附件
                    ele.attr('accept', 'image/*');
                }
                ele.click();
            }
        }, {
            event: 'click',
            selector: '.shot-screen',
            callback: function () {
                PMAPI.openDialogByComponent(screenShotConfig, {
                    width: 900,
                    height: 600,
                    title: "选择截图"
                }).then(res => {
                    if (!res.file) {
                        return;
                    }
                    let fileId = new Date().getTime();
                    let toolbox ={
                        update:function () {},
                        finish:function () {},
                        showError:function () {}
                    };
                    this.actions.controlUploadingForFile(res.file,fileId,toolbox);
                })
            }
        }, {
            event: 'change',
            selector: '.selecting-file',
            callback: function (event) {
                let files = event.files;
                let fileArray = [];
                for (let f = 0;f<files.length;f++) {
                    let name = files[f].name;
                    let fileId = new Date().getTime();
                    fileArray.push({id:fileId,name:name});
                }
                for(let i = 0, length = files.length;i < length; i++){
                    let file = files[i];
                    let fileItem = fileArray[i];
                    browserMD5File(file, (err,md5)=>{
                        if(this.data.queue ){
                            for(let item of this.data.queue){
                                if(file.name == item.file.name && md5 == item.md5){
                                    msgBox.showTips('文件已上传');
                                    return;
                                }
                            }
                        }
                        if(this.data.rows){
                            for(let item of this.data.rows){
                                if(file.name == item.file_name && md5 == item.file_md5){
                                    msgBox.showTips('文件已上传');
                                    return;
                                }
                            }
                        }
                        this.actions.controlUploadingForFile(file,fileItem.id,this.data.toolbox);
                    });
                }
                //清空文件选择器，不影响下一次选择
                this.el.find('.selecting-file').val(null);
            }
        }, {
            event: 'click',
            selector:'.ellipses',
            callback: function () {
                this.el.find('.ellipses').css('display','none');
                for(let i=3,length = this.data.queueItemEles.length; i <length;i++){
                    this.data.queueItemEles[i].css('display','block');
                }
            }
        }, {
            event:'click',
            selector: '.view-attached-list',
            callback: function () {
                if(this.data.value.length == 0){
                    return;
                }
                //初始化清空一下缓存
                Storage.init((new URL(document.URL)).searchParams.get('key'));
                Storage.deleteItem('deletedItem-'+this.data.id,Storage.SECTION.FORM);
                FormService.getAttachment({
                    file_ids:JSON.stringify(this.data.value),
                    dinput_type:this.data.dinput_type
                }).then(res=>{
                    if(res.success){
                        this.data.rows = res.rows;
                        for( let data of this.data.rows ){
                            //附件名称编码转换
                            data.file_name = data.file_name;
                            let str = data.file_name.split('.').pop();
                            if( preview_file.indexOf( str.toLowerCase() ) != -1 ){
                                data["isPreview"] = true;
                                if( preview_file.indexOf(str.toLowerCase()) <4){
                                    data["isImg"] = true;
                                }else{
                                    data["isImg"] = false;
                                }
                            }else{
                                data["isPreview"] = false;
                            }
                        }
                        if(this.data.dinput_type == 9 || this.data.dinput_type == 23){
                            let obj={
                                list:this.data.rows,
                                dinput_type:this.data.dinput_type,
                                is_view:this.data.is_view,
                                control_id:this.data.id
                            };
                            PMAPI.openDialogByComponent(_.defaultsDeep({},{data:obj},AttachmentList), {
                                width: 700,
                                height: 500,
                                title: "浏览上传文件"
                            }).then(res=>{
                                this.actions._updateDeleted(res);
                            });
                        }else if(this.data.dinput_type == 33){
                            let fileId = this.data.value[0];
                            let obj={
                                rows:this.data.rows,
                                dinput_type:this.data.dinput_type,
                                currentVideoId:fileId,
                                videoSrc:`/download_attachment/?file_id=${fileId}&download=0&dinput_type=${this.data.dinput_type}`,
                                control_id:this.data.id,
                                is_view:this.data.is_view
                            }
                            PMAPI.openDialogByComponent(_.defaultsDeep({},{data:obj},ViewVideo), {
                                width: 780,
                                height: 500,
                                title: '视频播放器'
                            }).then(res=>{
                                this.actions._updateDeleted(res);
                            })
                        }

                    }
                })
            }
        }
    ],
    data: {
        attachmentQueueItemComps:{},
        queue:[],
        queueItemEles:[]
    },
    actions: {
        controlUploadingForFile: function (file,i,toolbox) {
            if (file.size > 100 * 1024 * 1024) {
                msgBox.alert(file.name + ' 文件过大，无法上传，请确保上传文件大小小于100MB');
                return;
            }
            if (this.data.dinput_type == 33) {
                if (!file.type.startsWith('video') && !file.type.startsWith('audio')) {
                    msgBox.alert('"' + file.name + '"不是视音频类型文件，支持文件类型包括：avi, asf, mpg, mpeg, mpe, wmv, mp4,mp3,wav');
                    return;
                }
            } else if (this.data.dinput_type == 23) {
                if (!file.type.startsWith('image')) {
                    msgBox.alert('"' + file.name + '"不是图片类型文件，支持文件类型包括：bmp, jpg, png, tiff, gif, exif, svg, pcd, dxf, ufo');
                    return;
                }
            }
            let ele = $('<div></div>');
            let item = new AttachmentQueueItem({file: file, real_type: this.data.dinput_type, fileOrder:i, toolbox:toolbox},
                {
                    changeFile: event => {
                        if (event.event == 'delete') {
                            ele.remove();
                            this.data.queueItemEles.splice(this.data.queueItemEles.indexOf(ele),1);
                            if (event.data != undefined){
                                let i = 0;
                                let l = this.data.queue.length;
                                for(; i < l; i++){
                                    let item = this.data.queue[i];
                                    if(item.file.name == event.data.file.name && item.md5 == event.data.md5){
                                        break;
                                    }
                                }
                                if(i < l){
                                    this.data.queue.splice(i,1);
                                }
                                this.data.value.splice(this.data.value.indexOf(event.data.fileId), 1);
                                this.el.find('.view-attached-list').html(`共${this.data.value.length}个文件`);
                                this.actions._deleteItemFromThumbnailList(event.data.fileId);
                                this.events.changeValue(this.data);
                                this.actions._playQueueItems();
                                if(this.data.value.length == 0){
                                    this.el.find('.view-attached-list').css('cursor','auto');
                                }
                            }
                        }
                        if (event.event == 'finished') {
                            this.data.value = this.data.value == '' ? [] : this.data.value;
                            this.data.value.push(event.data.fileId);
                            ele.attr('id',event.data.fileId);
                            this.data.queue.push(event.data);
                            this.el.find('.view-attached-list').html(`共${this.data.value.length}个文件`);
                            if(this.data.value.length > 0){
                                this.el.find('.view-attached-list').css('cursor','pointer');
                            }
                            this.trigger('changeValue', this.data);
                            let obj = {};
                            obj[event.data.fileId] = event.data.thumbnail;
                            if(!event.data.thumbnail || event.data.thumbnail ==''){
                                return;
                            }
                            if (this.data['thumbnailListComponent']) {
                                this.data['thumbnailListComponent'].actions.addItem(obj);
                            } else if(this.data.dinput_type == 23) {
                                let comp = new ThumbnailList([obj],this.data.dinput_type);
                                comp.render(this.el.find('.thumbnail-list-anchor'));
                                this.data['thumbnailListComponent'] = comp;
                            }
                        }
                    }
                });
            this.el.find('.upload-process-queue').prepend(ele);
            item.render(ele);
            this.data.queueItemEles.unshift(ele);
            this.actions._playQueueItems();
            this.data.attachmentQueueItemComps[i]=item;
        },
        _deleteItemFromThumbnailList:function (fileId) {
            if (this.data['thumbnailListComponent']) {
                this.data['thumbnailListComponent'].actions.deleteItem(fileId);
                if(this.data.value.length == 0){
                    delete this.data['thumbnailListComponent'];
                }
            }
        },
        //调整上传文件条目，仅显示3条
        _playQueueItems:function () {
            if(this.data.queueItemEles.length > 3){
                this.el.find('.ellipses').css('display','block');
                for(let i=3,length = this.data.queueItemEles.length; i <length;i++){
                    this.data.queueItemEles[i].css('display','none');
                }
            } else {
                this.el.find('.ellipses').css('display','none');
            }
            for(let i=0;i<3;i++){
                if(!this.data.queueItemEles[i]){
                    break;
                }
                this.data.queueItemEles[i].css('display','block');
            }
        },
        _updateDeleted:function(res){
            Storage.init('null');
            let deletedFiles = Storage.getItem('deletedItem-'+this.data.id,Storage.SECTION.FORM);
            if(!deletedFiles){
                return;
            }
             for(let file of deletedFiles){
                this.data.value.splice(this.data.value.indexOf(file),1);
                this.el.find('#'+file).remove();
                if(this.data.dinput_type == 23){
                    this.actions._deleteItemFromThumbnailList(file);
                }
            }
            this.el.find('.view-attached-list').html(`共${this.data.value.length}个文件`);
            if(this.data.value.length > 0){
                this.el.find('.view-attached-list').css('cursor','pointer');
            }
            this.trigger('changeValue',this.data);
        }
    },
    afterRender: function () {
        if (this.data.dinput_type == 33) {
            this.el.find('.shot-screen').css('display', 'none');
            this.el.find('.upload-file').val('上传视频');
        } else if (this.data.dinput_type == 23) {
            this.el.find('.upload-file').val('上传图片');
            if(this.data.value.length != 0){
                FormService.getThumbnails({
                    file_ids: JSON.stringify(this.data.value)
                }).then(res => {
                    if (!res.success) {
                        console.log(res.error);
                        return;
                    }
                    if (res.rows.length != 0) {
                        let comp = new ThumbnailList(res.rows,this.data.dinput_type);
                        comp.render(this.el.find('.thumbnail-list-anchor'));
                        this.data['thumbnailListComponent'] = comp;
                    }
                })
            }
        }
        Mediator.subscribe('getDataFromOtherFrame:'+this.data.id,(data)=>{
            if(data.type != 'cancel_uploading'){
                return;
            }
            let id = data.id;
            this.data.attachmentQueueItemComps[id].actions.cancelUploading();
        });
        if(this.data.value.length > 0){
            this.el.find('.view-attached-list').css('cursor','pointer');
        }
    },
    beforeDestroy:function () {
        Mediator.remove('getDataFromOtherFrame:'+this.data.id);
    }
};
export default class AttachmentControl extends Component {
    constructor(data,events,newConfig){
        super($.extend(true,{},config,newConfig),data,events)
    }
}
