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
    .rotate-button{
        position: absolute;
        transform: translate(50%,-50%);
        right: 50%;
        bottom: 0;
        width: 300px;
        height: 50px;
        z-index: 10;
        padding:0 20px;
        background: rgba(0,0,0,0.3);
        padding-top: 5px;
        display:flex;
        align-items:center;
        justify-content: center;
    }
    .rotate-button li{
        padding:5px 15px;
    }
    `;
let AttachmentList = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        dragStart: false,
        rotateNo: 0,
        imgScale: 1,
        list: [],
        dinput_type: '',
        fileIds: '',
        is_view: '',
        isFormAbout: '',
        fileGroup: [],
        preview_file: ["gif", "jpg", "jpeg", "png", "txt", "pdf", "lua", "sql", "rm", "rmvb", "wmv", "mp4", "3gp", "mkv", "avi"],
    },
    actions: {
        //获取文件名后缀
        getFileExtension(filename) {
            return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        }
    },
    afterRender() {
        //许多操作已暂时弃用 代码留着 有备无患
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        let _this = this;
        //图片弹窗预览
        this.el.on('click', '.pre', function (event) {
            _this.el.find('.my-mask').show();
            _this.data.rotateNo = 0;
            _this.data.imgScale = 1;
            _this.el.find('.img-pre').css("height", $(window).height() * 0.7 + 'px');
            _this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + _this.data.rotateNo + "deg) scale(" + _this.data.imgScale + "," + _this.data.imgScale + ")");
            let myLocated = location.href.split('#');
            // _this.el.find('.img-pre').get(0).src=myLocated[0]+"download_attachment/?file_id="+$(event.target).data("id")+"&download=0&dinput_type="+_this.data.dinput_type;
            _this.el.find('.img-pre').get(0).src = "/download_attachment/?file_id=" + $(event.target).data("id") + "&download=0&dinput_type=" + _this.data.dinput_type;
            $(document).on("mousewheel DOMMouseScroll", (e) => {
                let delta = (e.originalEvent['wheelDelta'] && (e.originalEvent['wheelDelta'] > 0 ? 1 : -1)) ||
                    (e.originalEvent['detail'] && (e.originalEvent['detail'] > 0 ? -1 : 1));
                if (delta > 0) {
                    _this.data.imgScale += 0.1;
                    _this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + _this.data.rotateNo + "deg) scale(" + _this.data.imgScale + ")");
                } else if (delta < 0) {
                    this.imgScale -= 0.1;
                    _this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + _this.data.rotateNo + "deg) scale(" + _this.data.imgScale + ")");
                }
            });
        });
        //删除
        this.el.on('click', '.del', function (event) {
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
            })
            HTTP.flush();
        });

        this.el.on('click', '.mask-div,.closeImg', function () {
            _this.el.find('.my-mask').hide();
            _this.data.dragStart = false;
            $(document).off("mousewheel DOMMouseScroll");
        })
        this.el.on('mouseup', '.img-pre', function () {
            _this.data.dragStart = false;
        }).on('mousemove', '.img-pre', function ($event) {
            //是否拖拽
            if (!_this.data.dragStart) {
                return;
            }

            //初始值调用 计算位移偏差值
            let disX = $event.clientX - _this.data.dragStartX;
            let disY = $event.clientY - _this.data.dragStartY;

            //计算图片相对位置
            let goX = _this.data.imgStartX + disX + $(".img-pre").width() / 2;
            let goY = _this.data.imgStartY + disY + $(".img-pre").height() / 2;

            $($event.target).css({'top': goY + 'px', 'left': goX + 'px'});
        }).on('mousedown', '.img-pre', function ($event) {
            $event.preventDefault && $event.preventDefault();//这个很重要
            //dragStart==可拖拽标识
            _this.data.dragStart = true;

            //初始值记录
            _this.data.dragStartX = $event.clientX;
            _this.data.dragStartY = $event.clientY;
            _this.data.imgStartX = _this.el.find('.img-pre').position().left;
            _this.data.imgStartY = _this.el.find('.img-pre').position().top;
        })
        this.el.on('click','.zoom-out',function () {
            _this.data.imgScale -= 0.1;
            _this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + _this.data.rotateNo + "deg) scale(" + _this.data.imgScale + ")");
        }).on('click', '.zoom-in', function () {
            _this.data.imgScale += 0.1;
            _this.el.find(".img-pre").css("transform", "translate(-50%,-50%) rotate(" + _this.data.rotateNo + "deg) scale(" + _this.data.imgScale + ")");
        }).on('click', '.rotate', function (event) {
            _this.data.rotateNo -= 90;
            _this.data.imgScale = 1;
            $(event.target).parent().parent().find(".img-pre").css({
                "transform": "translate(-50%,-50%) rotate(" + _this.data.rotateNo + "deg) scale(" + _this.data.imgScale + ")",
                "top": "50%",
                "left": "50%"
            });
        }).on('click','')
    },
    beforeDestory() {
        this.data.style.remove();
    }
}
export default AttachmentList