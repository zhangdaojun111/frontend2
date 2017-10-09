/**
 *@author yudeping
 *视频播放器
 */

import template from './view-video.html';
let css = `
 .videoList {
    width: 35%;
    height: 100%;
    float: left;
    margin-left: 14px;
    overflow-y: scroll;
}
.select-video div{
    line-height: 40px;
    border-bottom: 1px solid #F2F2F2;
}
.select-video .download-button{
    position: absolute;
    top: 4px;
    right:0px;
    outline-style:none;
    display: inline-block;
    margin-left: 3px;
    margin-right: 6px;
}
.select-video .delete-button {
    position: absolute;
    top: 4px;
    right:26px;
    outline-style:none;
    display: inline-block;
    margin-left: 6px;
    margin-right: 3px;
}
.video-file-name {
    display: inline-block;
    width:75%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    cursor:pointer;
}

.videoContain {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid #d4d4d4;
    float: left;
    overflow: hidden;

`;
let ViewVideo = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
    },
    binds:[
        {
            event:'click',
            selector:'.select-video',
            callback:function (event) {
                if(id == this.data.currentVideoId){
                    return;
                }
                let id = event.id;
                let video = $(this.el.find('video'))[0];
                video.pause();
                this.el.find('video').find('source').attr('src','/download_attachment/?file_id='+id+'&download=0&dinput_type='+this.data.dinput_type);
                video.load();
                video.play();
            }
        },{
            event:'click',
            selector:'.delete-button',
            callback:function (event) {
                let fileId = $(event).attr('file-id');
                this.el.find('#'+fileId).remove();
                let deletedFiles = Storage.getItem('deletedItem-'+this.data.id,Storage.SECTION.FORM);
                if(deletedFiles == undefined){
                    deletedFiles = [];
                }
                if(this.el.find('video').find('source').attr('src').indexOf(fileId)!=-1){
                    let video = $(this.el.find('video'))[0];
                    video.pause();
                }
                deletedFiles.push(fileId);
                Storage.init((new URL(document.URL)).searchParams.get('key'));
                Storage.setItem(deletedFiles,'deletedItem-'+this.data.control_id,Storage.SECTION.FORM);

            }
        }
    ],
    actions:{
        //设置背景色
        setBackground(){
            this.el.find('.select-video').each((index,obj)=>{
                let color=obj.id == this.data.currentVideoId ? '#F2F2F2' : '#fff';
                $(obj).css('background-color',color);
                $(obj).on('click',function () {
                    $(this).css('background-color','#F2F2F2').siblings().css('background-color','#fff');
                })
            });
        },
    },
    afterRender(){
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.actions.setBackground();
        for(let item of this.data.rows){
            let ele = this.el.find('#'+item.file_id);
             ele.find('.video-file-name').attr('title',item.file_name);
             ele.find('.download-button').attr('href','/download_attachment/?file_id='+item.file_id+'&download=1&dinput_type='+this.data.dinput_type);
             if(this.data.is_view){
                 this.el.find('.delete-button').hide();
             } else {
                 this.el.find('.delete-button').show();
             }
        }
        //没啥用的代码 写着玩的
        // let _this=this;
        // this.data.video=this.el.find('video').get(0);
        // this.el.find('.quick').on('click',function(){
        //     console.log('quick')
        //     _this.data.video.currentTime=200;
        // })
        // let video = _this.el.find('video');
        // _this.el.find('.play').on('click', function () {
        //     video[0].play();
        //     _this.el.find('.play').hide();
        // })
        // this.el.find('.submit').on('click',function(){
        //     console.log('submit')
        //     let $div =$('<div></div>');
        //     $div.html(_this.el.find('.danmu').val());
        //     $div.appendTo(_this.el);
        //     $div.css({
        //         'font':'20px',
        //         'color':'red',
        //         'position':'absolute',
        //         'top':Math.random()*(_this.el.height()*0.65)+'px',
        //         'left':'100%',
        //         'border':'1px solid red'
        //     })
        //     $div.animate({
        //         left:'-100%'
        //     },6666,function(){
        //         $div.remove();
        //     });
        // })
    },
}
export default ViewVideo