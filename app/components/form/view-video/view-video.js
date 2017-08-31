/**
 *@author yudeping
 *视频播放器
 */

import template from './view-video.html';
let css = `
    .videoList {
    width: 20%;
    height: 100%;
    float: left;
    margin-left: 14px;
    overflow-y: scroll;
}
.videoContain {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid #d4d4d4;
    float: left;
    overflow: hidden;
}
`;
let ViewVideo = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        imgData:'',
        imgSelect:'',
        res:'',
        seletNum:0,
    },
    actions:{

    },
    afterRender(){
        let _this=this;
        this.data.video=this.el.find('video').get(0);
        this.el.find('.quick').on('click',function(){
            console.log('quick')
            _this.data.video.currentTime=200;
        })
        let video = _this.el.find('video');
        _this.el.find('.play').on('click', function () {
            video[0].play();
            _this.el.find('.play').hide();
        })
        this.el.find('.submit').on('click',function(){
            console.log('submit')
            let $div =$('<div></div>');
            $div.html(_this.el.find('.danmu').val());
            $div.appendTo(_this.el);
            $div.css({
                'font':'20px',
                'color':'red',
                'position':'absolute',
                'top':Math.random()*(_this.el.height()*0.65)+'px',
                'left':'100%',
                'border':'1px solid red'
            })
            $div.animate({
                left:'-100%'
            },6666,function(){
                $div.remove();
            });
        })
    },
}
export default ViewVideo