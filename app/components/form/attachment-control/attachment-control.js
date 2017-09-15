/**
 * Created by Yunxuan Yan on 2017/8/8.
 */
import template from './attachment-control.html';
import Component from "../../../lib/component";
import msgBox from '../../../lib/msgbox';
import AttachmentQueueItem from "./attachment-queue-item/attachment-queue-item";
import {screenShotConfig} from "./screenshot-receiver/screenshot-receiver";
import {PMAPI} from "../../../lib/postmsg";
import {attachmentListConfig} from "./attachment-list/attachment-list";
import {FormService} from '../../../services/formService/formService';
import ThumbnailList from "./thumbnail-list/thumbnail-list";
import {Storage} from "../../../lib/storage";
import Mediator from "../../../lib/mediator";

let config = {
    template: template,
    binds: [
        {
            event: 'click',
            selector: '.view-attached-list',
            callback: function () {
                attachmentListConfig.data =_.defaultsDeep({
                    isView:this.data.is_view,
                    id:this.data.id,
                    fileIds: this.data.value,
                    dinput_type: this.data.real_type
                },attachmentListConfig.data);
                PMAPI.openDialogByComponent(attachmentListConfig, {
                    width: 700,
                    height: 500,
                    title: "浏览上传文件"
                }).then(res=>{
                    Storage.init((new URL(document.URL)).searchParams.get('key'));
                    let deletedFiles = Storage.getItem('deletedItem-'+this.data.id,Storage.SECTION.FORM);
                    for(let file of deletedFiles){
                        this.data.value.splice(this.data.value.indexOf(file),1);
                    }
                    this.trigger('changeValue',this.data);
                });
            }
        }, {
            event: 'click',
            selector: '.upload-file',
            callback: function () {
                let ele = this.el.find('.selecting-file');
                if (this.data.dinput_type == 33) {  //视频附件
                    ele.attr('accept', 'video/*');
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
                    width: 500,
                    height: 300,
                    title: "选择截图"
                }).then(res => {
                    if (!res.file) {
                        return;
                    }
                    let key = (new URL(document.URL)).searchParams.get('key');
                    let name = res.file.name;
                    let fileId = name.split('.')[0]+"-"+new Date().getTime();
                    let toolbox = msgBox.showProgress({
                        files:[{id:fileId,name:name}],
                        lordKey:key,
                        originalField:this.data.id
                    });
                    this.actions.controlUploadingForFile(res.file,fileId,toolbox);
                })
            }
        }, {
            event: 'change',
            selector: '.selecting-file',
            callback: function (event) {
                let files = event.files;
                let fileArray = [];
                for (let file of files) {
                    let name = file.name;
                    let fileId = name.split('.')[0]+"-"+new Date().getTime();
                    fileArray.push({id:fileId,name:name});
                }
                let toolbox = msgBox.showProgress({files:fileArray,originalField:this.data.id});
                for(let i = 0, length = files.length;i < length; i++){
                    this.actions.controlUploadingForFile(files[i],fileArray[i].id,toolbox);
                }
                this.el.find('.selecting-file').val(null);
            }
        }
    ],
    data: {
        attachmentQueueItemComps:{}
    },
    actions: {
        controlUploadingForFile: function (file,i,toolbox) {
            if (file.size > 100 * 1024 * 1024) {
                msgBox.alert(file.name + ' 文件过大，无法上传，请确保上传文件大小小于100MB');
                return;
            }
            if (this.data.dinput_type == 33) {
                if (!file.type.startsWith('video')) {
                    msgBox.alert('"' + file.name + '"不是视频类型文件，支持文件类型包括：avi, asf, mpg, mpeg, mpe, wmv, mp4');
                    return;
                }
            } else if (this.data.dinput_type == 23) {
                if (!file.type.startsWith('image')) {
                    msgBox.alert('"' + file.name + '"不是图片类型文件，支持文件类型包括：bmp, jpg, png, tiff, gif, exif, svg, pcd, dxf, ufo');
                    return;
                }
            }
            let ele = $('<div></div>');
            let item = new AttachmentQueueItem({file: file, real_type: this.data.real_type, fileOrder:i, toolbox:toolbox},
                {
                    changeFile: event => {
                        if (event.event == 'delete') {
                            ele.remove();
                            if (event.data != undefined) {
                                this.data.value.splice(this.data.value.indexOf(event.data.fileId), 1);
                                this.el.find('.view-attached-list').html(`共${this.data.value.length}个文件`);
                                if (this.data['thumbnailListComponent']) {
                                    this.data['thumbnailListComponent'].actions.deleteItem(event.data.fileId);
                                    if(this.data.value.length == 0){
                                        delete this.data['thumbnailListComponent'];
                                    }
                                }
                                this.events.changeValue(this.data);
                            }
                        }
                        if (event.event == 'finished') {
                            this.data.value = this.data.value == '' ? [] : this.data.value;
                            this.data.value.push(event.data.fileId);
                            this.el.find('.view-attached-list').html(`共${this.data.value.length}个文件`);
                            this.trigger('changeValue', this.data);
                            let obj = {};
                            obj[event.data.fileId] = event.data.thumbnail;
                            if (this.data['thumbnailListComponent']) {
                                this.data['thumbnailListComponent'].actions.addItem(obj);
                            } else if(this.data.dinput_type == 23 || this.data.dinput_type == 33) {
                                let comp = new ThumbnailList([obj]);
                                comp.render(this.el.find('.thumbnail-list-anchor'));
                                this.data['thumbnailListComponent'] = comp;
                            }
                        }
                    }
                });
            this.el.find('.upload-process-queue').append(ele);
            item.render(ele);
            this.data.attachmentQueueItemComps[i]=item;
        }
    },
    afterRender: function () {
        if (this.data.dinput_type == 33) {
            this.el.find('.shot-screen').css('display', 'none');
            this.el.find('.upload-file').val('上传视频');
        } else if (this.data.dinput_type == 23) {
            this.el.find('.upload-file').val('上传图片');
        }
        if ((this.data.dinput_type == 33 || this.data.dinput_type == 2) && this.data.value.length != 0) {
            FormService.getThumbnails({
                file_ids: JSON.stringify(this.data.value)
            }).then(res => {
                if (!res.success) {
                    console.log(res.error)
                }
                if (res.rows.length != 0) {
                    let comp = new ThumbnailList(res.rows);
                    comp.render(this.el.find('.thumbnail-list-anchor'));
                    this.data['thumbnailListComponent'] = comp;
                }
            })
        }
        Mediator.subscribe('getDataFromOtherFrame:'+this.data.id,(data)=>{
            console.log("get data from progress dialog");
            console.dir(data);
            if(data.type != 'cancel_uploading'){
                return;
            }
            let id = data.id;
            console.dir(this.data.attachmentQueueItemComps);
            this.data.attachmentQueueItemComps[id].actions.cancelUploading();
        })
    },
    beforeDestroy:function () {
        Mediator.remove('getDataFromOtherFrame:'+this.data.id);
    }
};
export default class AttachmentControl extends Component {
    constructor(data, event) {
        super(config, data, event);
    }
}
