/**
 * Created by Yunxuan Yan on 2017/10/11.
 */

import template from './preview.html';
import Component from "../../../lib/component";
import './preview.css';

let preview_file = ["gif","jpg","jpeg","png","wmv","mp4"];

let config = {
    template:template,
    data:{
        firstPreviewableIndex:0,
        lastPreviewableIndex:0
    },
    binds:[
        {
            event: 'click',
            selector: '.closeImg',
            callback: function () {
                this.el.find('.my-mask').hide();
                this.data.dragStart = false;
                this.el.remove();
                // $(document).off("mousewheel DOMMouseScroll");
            }
        }, {
            event: 'mouseup',
            selector: '.img-pre',
            callback: function () {
                this.data.dragStart = false;
            }
        }, {
            event: 'mousemove',
            selector: '.img-pre',
            callback: function ($event) {
                //是否拖拽
                if (!this.data.dragStart) {
                    return;
                }

                //初始值调用 计算位移偏差值
                let disX = $event.clientX - this.data.dragStartX;
                let disY = $event.clientY - this.data.dragStartY;

                //计算图片相对位置
                let goX = this.data.imgStartX + disX + $(".img-pre").width() / 2;
                let goY = this.data.imgStartY + disY + $(".img-pre").height() / 2;

                $($event.target).css({'top': goY + 'px', 'left': goX + 'px'});
            }
        }, {
            event: 'mousedown',
            selector: '.img-pre',
            callback: function ($event) {
                $event.preventDefault && $event.preventDefault();//这个很重要
                //dragStart==可拖拽标识
                this.data.dragStart = true;

                //初始值记录
                this.data.dragStartX = $event.clientX;
                this.data.dragStartY = $event.clientY;
                this.data.imgStartX = this.el.find('.img-pre').position().left;
                this.data.imgStartY = this.el.find('.img-pre').position().top;
            }
        }, {
            event:'click',
            selector: '.save',
            callback:function (event) {
                this.el.find('.download-url').attr('href','/download_attachment/?file_id='+event.id+'&download=1&dinput_type={{'+this.data.dinput_type+'}}');
            }
        }, {
            event: 'click',
            selector: '.zoom-out',
            callback: function () {
                this.data.imgScale -= 0.1;
                this.actions._updatePreview();
            }
        }, {
            event: 'click',
            selector: '.zoom-in',
            callback: function () {
                this.data.imgScale += 0.1;
                this.actions._updatePreview();
            }
        }, {
            event: 'click',
            selector: '.rotate',
            callback: function (event) {
                this.data.rotateNo -= 90;
                this.data.imgScale = 1;
                this.el.find(".img-pre").css({
                    "transform": "translate(-50%,-50%) rotate(" + this.data.rotateNo + "deg)",
                    "top": "50%",
                    "left": "50%"
                });
                this.actions._uploadScale();
            }
        }, {
            event: 'click',
            selector: '.rotate-anti',
            callback: function (event) {
                this.data.rotateNo += 90;
                this.data.imgScale = 1;
                this.el.find(".img-pre").css({
                    "transform": "translate(-50%,-50%) rotate(" + this.data.rotateNo + "deg)",
                    "top": "50%",
                    "left": "50%"
                });
                this.actions._uploadScale();
            }
        },
        {
            event:'click',
            selector: '.resize',
            callback:function () {
                this.data.imgScale = 1;
                this.data.rotateNo = 0;
                this.actions._updatePreview();
            }
        }, {
            event: 'click',
            selector:'.previous',
            callback:function () {
                let fileId;
                if(this.data.list[0].file_name){//兼容附件浏览的情况
                    //找到前一个可浏览的文件的索引
                    let i = this.data.currentIndex - 1;
                    for(;i >=0; i--){
                        let type = this.data.list[i].file_name.split('.').pop();
                        if(preview_file.includes(type)){
                            break;
                        }
                    }
                    if(i < 0 ){ //前面没有可浏览文件
                        this.el.find('.previous').hide();
                        this.data.firstPreviewableIndex = this.data.currentIndex;
                        return;
                    } else {
                        this.data.currentIndex--;
                    }
                    fileId = this.data.list[this.data.currentIndex].file_id;
                }else {//普通图片浏览
                    this.data.currentIndex = this.data.currentIndex == 0? this.data.currentIndex:this.data.currentIndex - 1;
                    fileId = Object.keys(this.data.list[this.data.currentIndex])[0];
                }
                this.actions._loadPreview(fileId);
            }
        }, {
            event: 'click',
            selector:'.next',
            callback:function () {
                let fileId;
                if(this.data.list[0].file_name) {//兼容附件浏览的情况
                    //找到前一个可浏览的文件的索引
                    let i = this.data.currentIndex + 1;
                    let length = this.data.list.length;
                    for (; i < length; i++) {
                        let type = this.data.list[i].file_name.split('.').pop();
                        if (preview_file.includes(type)) {
                            break;
                        }
                    }
                    if (i >= length) { //后面没有可浏览文件
                        this.el.find('.next').hide();
                        this.data.lastPreviewableIndex = this.data.currentIndex;
                        return;
                    } else {
                        this.data.currentIndex++;
                    }
                    fileId = this.data.list[this.data.currentIndex].file_id;
                } else {//普通图片浏览
                    this.data.currentIndex = this.data.currentIndex < this.data.list.length - 1? this.data.currentIndex + 1:this.data.currentIndex;
                    fileId = Object.keys(this.data.list[this.data.currentIndex])[0];
                }

                this.actions._loadPreview(fileId);
            }
        }
    ],
    actions:{
        _uploadScale() {
            this.el.find('.scale').text(Math.floor(this.data.imgScale*100)+"%");
        },
        _updatePreview() {
            this.el.find(".img-pre").css('transform','translate(-50%,-50%) rotate(' + this.data.rotateNo + 'deg) scale(' + this.data.imgScale + ')');
            this.actions._uploadScale();
        },
        _loadPreview(id){
            this.el.find('.my-mask').show();
            this.data.rotateNo = 0;
            this.data.imgScale = 1;
            this.actions._uploadScale();
            this.actions._updateSwiftButtons(this.data.currentIndex);
            this.el.find('.img-pre').css("max-height", $(window).height() * 0.8 + 'px');
            this.el.find('.img-pre').css('max-width',$(window).width() * 0.9 + 'px');
            this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + this.data.rotateNo + "deg) scale(" + this.data.imgScale + "," + this.data.imgScale + ")");
            this.el.find('.img-pre').get(0).src = "/download_attachment/?file_id=" + id + "&download=0&dinput_type=" + this.data.dinput_type;
            this.el.on("wheel", '.img-pre',(e) => {
                let delta = e.originalEvent['wheelDelta']|| -(e.originalEvent['detail']);
                if (delta > 0) {
                    this.data.imgScale += 0.1;
                    this.actions._updatePreview();
                } else if (delta < 0) {
                    this.data.imgScale -= 0.1;
                    this.actions._updatePreview();
                }
            });
            this.el.find(".save").attr('id',id);
        },
        _getCurrentIndex(id){
            let i = 0;
            for(let length = this.data.list.length; i < length; i++){
                if(id == this.data.list[i]['file_id']) {
                    break;
                }
            }
            return i;
        },
        _updateSwiftButtons(i){
            if(i == this.data.firstPreviewableIndex){
                this.el.find('.previous').hide();
            } else {
                this.el.find('.previous').show();
            }
            if(i == this.data.lastPreviewableIndex){
                this.el.find('.next').hide();
            } else {
                this.el.find('.next').show();
            }
        }
    },
    afterRender:function () {
        this.data.lastPreviewableIndex = this.data.list.length - 1;
        if(this.data.currentIndex == undefined){
             this.data.currentIndex = this.actions._getCurrentIndex(this.data.id);
        } else {
            this.data.id = Object.keys(this.data.list[this.data.currentIndex])[0];
        }
        this.actions._loadPreview(this.data.id);
    }
};

export default class Preview extends Component {
    constructor(data) {
        super(config,data);
    }
}