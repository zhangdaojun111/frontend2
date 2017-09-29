/**
 *@author yudeping
 *aggrid附件弹窗
 */

import template from './attachment-list.html';

let css = `
    .attachment-list{
      //  width:100%;
        //height:100%;       
          height: 90%;
          display: flex;
          border: 1px solid #E4E4E4;
          margin: 10px;
          text-align: left;          
    }
    .attachment-list .table {    
          position: relative;
          margin: 0 auto;
          width: 99%;
          max-width: 100%;
          margin-bottom: 20px;
          margin-top: 8px;
    }
    .attachment-list .table a{
        outline-style:none;
    }
    .attachment-list .table-bordered  thead  tr  th:first-child,.attachment-list .table-bordered  tbody  tr  td:first-child{
      width: 70%;
    }
    .attachment-list .table-bordered  thead  tr  th:last-child,.attachment-list .table-bordered  tbody  tr  td:last-child{
      width: 30%;
    }
    .attachment-list .table-bordered  tbody  tr  td a{
        text-decoration: none;
         margin-right: 25px;
         color:#0088FF;       
    }
    
    .attachment-list .table  thead  tr  th,
    .attachment-list .table  tbody  tr  th,
    .attachment-list .table  tfoot  tr  th,
    .attachment-list .table  thead  tr  td,
    .attachment-list .table  tbody  tr  td,
    .attachment-list .table  tfoot  tr  td {
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;
      border-top: 1px solid #F2F2F2;
    }
    .attachment-list .table  thead  tr th {
      vertical-align: bottom;
      border-bottom: 2px solid #ddd;
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
      font-weight: 700;
      font-style: normal;
      text-align: left;
    }
      .attachment-list .table  tbody  tr td {
        font-family: '微软雅黑';
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
    }
    .attachment-list .table-bordered  thead  tr  th,
    .attachment-list .table-bordered  tbody  tr  th,
    .attachment-list .table-bordered  tfoot  tr  th,
    .attachment-list .table-bordered  thead  tr  td,
    .attachment-list .table-bordered  tbody  tr  td,
    .attachment-list .table-bordered  tfoot  tr  td {
      border: 1px solid #F2F2F2;
    }
    .attachment-list .table-bordered  thead  tr  th,
    .attachment-list .table-bordered  thead  tr  td {
      border-bottom-width: 2px;
    }
    .my-mask{
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }
    .closeImg{
        position: absolute;
        right:20px;
        top:20px;
        cursor: pointer;
    }
    .mask-div{
        position: absolute;
        z-index: 2;
        background: black;
        height: 100%;
        width: 100%;
        opacity: 0.3;
    }
    .img-pre{
        vertical-align: middle;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        z-index: 10;
        max-height:80%;
    }
    .operator-buttons{
        position: absolute;
        transform: translate(50%,-50%);
        right: 50%;
        bottom: 0;
        width: 350px;
        height: 50px;
        z-index: 10;
        padding:0 20px;
        background: rgba(0,0,0,0.3);
        padding-top: 5px;
        display:flex;
        align-items:center;
        justify-content: center;
    }
    .operator-buttons li{
        padding:5px 15px;
    }
    .scale {
        font-size:20px;
        color:white;
    }
    .previous {
        z-index: 10;
        position: absolute;
        left: 20px;
        top: 50%;
        cursor: pointer;
    }
    .next {
        z-index: 10;
        position: absolute;
        right: 20px;
        top: 50%;
        cursor: pointer;
    }
    .closeImg {
        z-index: 10;
        cursor: pointer;
    }
    `;
let AttachmentList = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        dragStart: false,
        rotateNo: 0,
        imgScale: 1,
        currentIndex:0,
        firstPreviewableIndex:0,
        lastPreviewableIndex:0,
        list: [],
        dinput_type: '',
        fileIds: '',
        is_view: '',
        isFormAbout: '',
        fileGroup: [],
        preview_file: ["gif", "jpg", "jpeg", "png", "txt", "pdf", "lua", "sql", "rm", "rmvb", "wmv", "mp4", "3gp", "mkv", "avi"],
    },
    binds: [
        {
            //图片弹窗预览
            event:'click',
            selector:'.pre',
            callback:function (event) {
                let id = event.dataset.id;
                this.actions._loadPreview(id);
                this.data.currentIndex = this.actions._getCurrentIndex(id);
                this.actions._updateSwiftButtons(this.data.currentIndex);
            }
        }, {
            //删除
            event: 'click',
            selector: '.del',
            callback: function (event) {
                let _this = this;
                let fielIds = $(event.target).attr('id');
                HTTP.post('delete_attachment', {
                    file_ids: JSON.stringify([fielIds]),
                    dinput_type: this.data.dinput_type
                }).then(res => {
                    _this.data.list = res["rows"];
                    for (let i = 0, len = _this.data.list.length; i < len; i++) {
                        if (_this.data.list[i]["file_id"] == fielIds) {
                            _this.data.list.splice(i, 1);
                            break;
                        }
                    }
                    // this.wfService.sendDelFile(fileId);
                    // this.wfService.sendDelQQimg(fileId);
                    // this.emitDelAttachmentIds.emit(fileId);
                    _this.reload();
                });
                HTTP.flush();
            }
        }, {
            event: 'click',
            selector: '.mask-div,.closeImg',
            callback: function () {
                this.el.find('.my-mask').hide();
                this.data.dragStart = false;
                $(document).off("mousewheel DOMMouseScroll");
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
                //找到前一个可浏览的文件的索引
                let i = this.data.currentIndex - 1;
                for(;i >=0; i--){
                    let type = this.data.list[i].file_name.split('.').pop();
                    if(this.data.preview_file.includes(type)){
                        break;
                    }
                }
                if(i < 0 ){ //前面没有可浏览文件
                    this.el.find('.previous').hide();
                    this.firstPreviewableIndex = this.data.currentIndex;
                    return;
                } else {
                    this.data.currentIndex--;
                }

                this.actions._loadPreview(this.data.list[this.data.currentIndex].file_id);
                this.actions._updateSwiftButtons(this.data.currentIndex);
            }
        }, {
            event: 'click',
            selector:'.next',
            callback:function () {
                //找到前一个可浏览的文件的索引
                let i = this.data.currentIndex + 1;
                let length = this.data.list.length;
                for(;i < length; i++){
                    let type = this.data.list[i].file_name.split('.').pop();
                    if(this.data.preview_file.includes(type)){
                        break;
                    }
                }
                if(i >= length){ //后面没有可浏览文件
                    this.el.find('.next').hide();
                    this.firstPreviewableIndex = this.data.currentIndex;
                    return;
                } else {
                    this.data.currentIndex++;
                }

                this.actions._loadPreview(this.data.list[i].file_id);
                this.actions._updateSwiftButtons(i);
            }
        }
    ],
    actions: {
        //获取文件名后缀
        getFileExtension(filename) {
            return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        },
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
            this.el.find('.img-pre').css("height", $(window).height() * 0.7 + 'px');
            this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + this.data.rotateNo + "deg) scale(" + this.data.imgScale + "," + this.data.imgScale + ")");
            this.el.find('.img-pre').get(0).src = "/download_attachment/?file_id=" + id + "&download=0&dinput_type=" + this.data.dinput_type;
            $(document).on("mousewheel DOMMouseScroll", (e) => {
                let delta = (e.originalEvent['wheelDelta'] && (e.originalEvent['wheelDelta'] > 0 ? 1 : -1)) ||
                    (e.originalEvent['detail'] && (e.originalEvent['detail'] > 0 ? -1 : 1));
            if (delta > 0) {
                this.data.imgScale += 0.1;
                this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + this.data.rotateNo + "deg) scale(" + this.data.imgScale + ")");
            } else if (delta < 0) {
                this.imgScale -= 0.1;
                this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + this.data.rotateNo + "deg) scale(" + this.data.imgScale + ")");
            }
        });
            this.el.find(".save").attr('id',id);
        },
        _getCurrentIndex(id){
            let i = 0;
            for(let length = this.data.list.length; i < length; i++){
                if(id == this.data.list[i]['file_id'])
                {
                    console.log(i);
                    break;
                }
            }
            return i;
        },
        _updateSwiftButtons(i){
            if(i == 0){
                this.el.find('.previous').hide();
            } else {
                this.el.find('.previous').show();
            }
            if(i == this.data.list.length - 1){
                this.el.find('.next').hide();
            } else {
                this.el.find('.next').show();
            }
        }
    },
    afterRender() {
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.actions._uploadScale();
        this.data.lastPreviewableIndex = this.data.list.length - 1;
    },
    beforeDestory() {
        this.data.style.remove();
    }
}
export default AttachmentList