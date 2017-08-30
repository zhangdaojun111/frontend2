/**
 *@author yudeping
 *视频播放器
 */

import template from './view-video.html';
let css = ``;
css = css.replace(/(\n)/g, '');
let ViewVideo = {
    template: template.replace(/\"/g, '\''),
    data: {

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