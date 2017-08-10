/**
 * Created by Yunxuan Yan on 2017/8/8.
 */
import template from './attachment-control.html';
import Component from "../../../lib/component";
import '../../../lib/msgbox'
import AttachmentQueueItem from "./attachment-queue-item/attachment-queue-item";

let config={
    template: template,
    data: {
        queue:[]
    },
    actions: {
        viewAttachList:function(){
            alert('viewAttachList');
        },
        uploadFile:function () {
            this.el.find('.selecting-file').click();
        },
        shotScreen:function () {
            alert('shotScreen');
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
                if(file.size>100*1024*1024){
                    alert(file.name + ' 文件过大，无法上传，请确保上传文件大小小于100MB');
                    continue;
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
                        console.log("here");
                        this.data.queue.push(data);
                    }
                });
                this.el.find('.upload-process-queue').append(ele);
                item.render(ele);
            }
        })
    }
};

export default class AttachmentControl extends Component{
    constructor(data){
        config.data = _.defaultsDeep(data,config.data);
        super(config);
        console.dir(data);
    }
}